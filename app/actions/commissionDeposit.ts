"use server";

import { Resend } from "resend";
import Stripe from "stripe";
import { ADD_ON_PRICE, RUSH_FEE_RATE } from "../lib/commissionPricing";
import { formatMoney } from "../lib/money";
import { ADD_ON_PRODUCTS } from "../models/site";
import { findAvailableCoupon, findAvailableVoucher, redeemCoupon, redeemVoucher, type CouponRecord, type VoucherRecord } from "../lib/supabaseAdmin";
import {
  type CommissionEmailDetails,
  renderCommissionConfirmationHtml,
  renderCommissionConfirmationText,
  renderCommissionNotificationHtml,
  renderCommissionNotificationText,
} from "./emailTemplates";

export type CommissionDepositState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "quote-only"; message: string }
  | { status: "ready"; clientSecret: string; depositCents: number; totalCents: number; currency: string };

export type CommissionPaymentState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ready"; clientSecret: string; amountCents: number; totalCents: number; currency: string; paymentPlan: "full" | "installments" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PRIORITY_DATE = "2099-12-31";

function isValidPriorityDate(value: string) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > MAX_PRIORITY_DATE) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return year >= 2000 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

const INVALID_PRIORITY_DATE_MESSAGE = "Please enter a valid priority date between 2000 and 2099.";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function metadataValue(value: string) {
  return value.slice(0, 450);
}

type DiscountSource = { record: CouponRecord | VoucherRecord; type: "coupon" | "voucher" } | null;

function getDiscountCents(source: DiscountSource) {
  if (!source) return 0;
  return source.type === "voucher"
    ? Math.max(0, Number((source.record as VoucherRecord).amount_cents) || 0)
    : Math.max(0, Number((source.record as CouponRecord).discount_cents) || 0);
}

async function resolveDiscountCode(code: string): Promise<DiscountSource> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  if (!/^GREET\d{6}$/.test(normalized) && !/^VOUCHER\d{8}$/.test(normalized)) return null;

  const coupon = await findAvailableCoupon(normalized);
  if (coupon) return { record: coupon, type: "coupon" };
  if (/^VOUCHER/.test(normalized)) {
    const voucher = await findAvailableVoucher(normalized);
    if (voucher) return { record: voucher, type: "voucher" };
  }
  return null;
}

function calculatePaymentTotals(paymentPlan: "full" | "installments", selectedAmountCents: number, priorityDate: string, shippingCents: number, requestedDiscountCents = 0) {
  const baseTotalCents = paymentPlan === "installments" ? selectedAmountCents * 3 : selectedAmountCents;
  const rushCents = priorityDate ? Math.round(baseTotalCents * 0.3) : 0;
  const discountableTotalCents = baseTotalCents + rushCents;
  const discountCents = Math.min(Math.max(0, requestedDiscountCents), discountableTotalCents);
  const currentPaymentBeforeDiscountCents = paymentPlan === "installments"
    ? selectedAmountCents + Math.round(rushCents / 3)
    : selectedAmountCents + rushCents;
  const currentPaymentDiscountCents = paymentPlan === "installments" ? Math.floor(discountCents / 3) : discountCents;
  const amountCents = currentPaymentBeforeDiscountCents - currentPaymentDiscountCents + shippingCents;
  const totalCents = discountableTotalCents - discountCents + shippingCents;
  return { amountCents, totalCents, baseTotalCents, rushCents, discountCents };
}

export type CommissionShippingRegion = "australia" | "us-canada";

function shippingForProductName(productName: string, region: CommissionShippingRegion) {
  if (region === "us-canada") return 3500;
  return productName.toLowerCase().includes("mini") ? 2500 : 3500;
}

function calculateShippingForPrices(prices: Stripe.Price[], region: CommissionShippingRegion) {
  return prices.reduce((total, price) => {
    const product = typeof price.product === "string" || price.product.deleted ? "" : price.product.name;
    return total + shippingForProductName(product, region);
  }, 0);
}

function buildEmailDetails(formData: FormData, sizeLabels: string[], addOns: string[]): CommissionEmailDetails {
  const customSizeSelected = formData.getAll("sizes").includes("other");
  return {
    firstName: field(formData, "firstName"),
    lastName: field(formData, "lastName"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    address: field(formData, "address"),
    product: field(formData, "product"),
    sizes: sizeLabels.join(", ") || (customSizeSelected ? "Custom size" : ""),
    otherSize: field(formData, "otherSize"),
    addOns: addOns.join(", ") || "None",
    framing: field(formData, "framing"),
    box: field(formData, "box"),
    boxDetails: field(formData, "boxDetails"),
    priorityDate: field(formData, "priorityDate"),
    story: field(formData, "story"),
    note: field(formData, "note"),
    coupon: field(formData, "coupon"),
    total: "",
    deposit: "",
    paymentReference: "",
  };
}

async function sendCustomerEmail(details: CommissionEmailDetails) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured.");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Zsofia at KinCollage <hello@kincollage.com>",
    to: details.email,
    subject: details.quoteOnly ? "We've received your KinCollage quote request" : "Your KinCollage order is confirmed",
    html: renderCommissionConfirmationHtml(details),
    text: renderCommissionConfirmationText(details),
  });
  if (error) throw new Error(`Customer confirmation email failed: ${error.message}`);
}

async function sendBusinessEmail(details: CommissionEmailDetails) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) throw new Error("Commission notification email is not configured.");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "KinCollage Orders <hello@kincollage.com>",
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: details.email,
    subject: `${details.quoteOnly ? "New quote request" : "New paid commission"} from ${details.firstName || "customer"}${details.lastName ? ` ${details.lastName}` : ""}`,
    html: renderCommissionNotificationHtml(details),
    text: renderCommissionNotificationText(details),
  });
  if (error) throw new Error(`Business notification email failed: ${error.message}`);
}

async function detailsFromPaymentIntent(stripe: Stripe, paymentIntent: Stripe.PaymentIntent): Promise<CommissionEmailDetails> {
  const metadata = paymentIntent.metadata;
  const customerName = (metadata.customerName ?? "").trim().split(/\s+/).filter(Boolean);
  const shippingCents = Number(metadata.shippingCents ?? 0);
  const rushCents = Number(metadata.rushCents ?? 0);
  let sizeLabels = metadata.sizes ?? "";
  if (!sizeLabels && metadata.sizePriceIds) {
    try {
      const prices = await Promise.all(metadata.sizePriceIds.split(", ").filter(Boolean).map((priceId) => stripe.prices.retrieve(priceId, { expand: ["product"] })));
      sizeLabels = prices.map((price) => typeof price.product === "string" || price.product.deleted ? price.id : price.product.name).join(", ");
    } catch (error) {
      console.error("Failed to load readable size names for order email:", error);
      sizeLabels = metadata.sizePriceIds;
    }
  }
  return {
    firstName: metadata.firstName ?? customerName[0] ?? "",
    lastName: metadata.lastName ?? customerName.slice(1).join(" "),
    email: metadata.email ?? "",
    phone: metadata.phone ?? "",
    address: metadata.address ?? "",
    product: metadata.product ?? "KinCollage commission",
    sizes: sizeLabels,
    otherSize: metadata.otherSize ?? "",
    addOns: metadata.addOns ?? "",
    framing: metadata.framing ?? "",
    box: metadata.box ?? "",
    boxDetails: metadata.boxDetails ?? "",
    priorityDate: metadata.priorityDate ?? "",
    story: metadata.story ?? "",
    note: metadata.note ?? "",
    coupon: metadata.coupon ?? "",
    total: formatMoney(Number(metadata.totalCents ?? paymentIntent.amount * 2) / 100, paymentIntent.currency),
    deposit: formatMoney(paymentIntent.amount_received / 100, paymentIntent.currency),
    paymentReference: paymentIntent.id,
    paymentPlan: metadata.paymentPlan === "installments" ? "3 fortnightly installments" : "Full payment",
    installmentNumber: metadata.installmentNumber ? `${metadata.installmentNumber} of 3` : "",
    shipping: formatMoney(shippingCents / 100, paymentIntent.currency),
    rushFee: rushCents ? formatMoney(rushCents / 100, paymentIntent.currency) : "None",
    discount: Number(metadata.discountCents ?? 0) > 0 ? formatMoney(Number(metadata.discountCents) / 100, paymentIntent.currency) : "",
  };
}

export async function completeCommissionOrder(paymentIntentId: string): Promise<{ success: boolean; message?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) return { success: false, message: "Payment verification is not configured." };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") return { success: false, message: "Payment has not completed yet." };

    const details = await detailsFromPaymentIntent(stripe, paymentIntent);
    const hasCustomerEmail = EMAIL_PATTERN.test(details.email);

    if (hasCustomerEmail && paymentIntent.metadata.customerEmailSent !== "true") {
      await sendCustomerEmail(details);
      paymentIntent = await stripe.paymentIntents.update(paymentIntent.id, { metadata: { customerEmailSent: "true" } });
    }
    if (hasCustomerEmail && paymentIntent.metadata.businessEmailSent !== "true") {
      await sendBusinessEmail(details);
      await stripe.paymentIntents.update(paymentIntent.id, { metadata: { businessEmailSent: "true" } });
    }
    if (paymentIntent.metadata.couponId && paymentIntent.metadata.couponRedeemed !== "true") {
      if (paymentIntent.metadata.couponType === "voucher") await redeemVoucher(paymentIntent.metadata.couponId);
      else await redeemCoupon(paymentIntent.metadata.couponId, paymentIntent.id);
      await stripe.paymentIntents.update(paymentIntent.id, { metadata: { couponRedeemed: "true" } });
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to complete commission order:", error);
    return { success: false, message: "Payment succeeded, but we couldn't send the order emails. Please retry or contact us." };
  }
}

export async function createCommissionPayment(
  _prevState: CommissionPaymentState,
  formData: FormData
): Promise<CommissionPaymentState> {
  if (!process.env.STRIPE_SECRET_KEY) return { status: "error", message: "Payments aren&apos;t configured yet." };

  const paymentPlan = String(formData.get("paymentPlan") ?? "full");
  if (paymentPlan !== "full" && paymentPlan !== "installments") return { status: "error", message: "Please choose a payment option." };
  const priceIds = [...new Set(formData.getAll("sizes").map(String).filter((id) => id.startsWith("price_")))];
  if (priceIds.length === 0) return { status: "error", message: "Please choose at least one canvas size." };
  const priorityDate = String(formData.get("priorityDate") ?? "").trim();
  if (!isValidPriorityDate(priorityDate)) return { status: "error", message: INVALID_PRIORITY_DATE_MESSAGE };
  const shippingCents = Number(formData.get("shippingCents") ?? 0);
  if (![0, 2500, 3500].includes(shippingCents)) return { status: "error", message: "Please choose a valid shipping method." };

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const prices = await Promise.all(priceIds.map((priceId) => stripe.prices.retrieve(priceId, { expand: ["product"] })));
    const validPrices = prices.filter((price) => {
      const product = typeof price.product === "string" ? null : price.product;
      const nickname = price.nickname?.toLowerCase() ?? "";
      const is2026Price = paymentPlan === "full"
        ? nickname.includes("2026 full price")
        : nickname.includes("2026") && nickname.includes("3 instalment");
      return price.active && price.type === "one_time" && price.unit_amount !== null && is2026Price && Boolean(product && !product.deleted && product.active);
    });
    if (validPrices.length !== prices.length || new Set(validPrices.map((price) => price.currency)).size !== 1) {
      return { status: "error", message: "One of the selected prices is no longer available. Please refresh and try again." };
    }

    const currency = validPrices[0].currency;
    const selectedAmountCents = validPrices.reduce((sum, price) => sum + (price.unit_amount ?? 0), 0);
    const totals = calculatePaymentTotals(paymentPlan, selectedAmountCents, priorityDate, shippingCents);
    const { amountCents, totalCents, rushCents, discountCents } = totals;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      payment_method_types: ["card"],
      description: paymentPlan === "installments" ? "KinCollage 2026 installment 1 of 3" : "KinCollage 2026 full payment",
      metadata: {
        paymentPlan,
        installmentNumber: paymentPlan === "installments" ? "1" : "",
        sizePriceIds: priceIds.join(", "),
        priorityDate,
        shippingCents: String(shippingCents),
        rushCents: String(rushCents),
        coupon: "",
        couponId: "",
        couponType: "",
        discountCents: String(discountCents),
        totalCents: String(totalCents),
      },
    });
    if (!paymentIntent.client_secret) throw new Error("Stripe did not return a client secret.");
    return { status: "ready", clientSecret: paymentIntent.client_secret, amountCents, totalCents, currency, paymentPlan };
  } catch (error) {
    console.error("Failed to create commission payment PaymentIntent:", error);
    return { status: "error", message: "Something went wrong setting up payment. Please try again." };
  }
}

export async function savePaymentCustomerDetails(paymentIntentId: string, email: string, address: string, contactName = "") {
  if (!process.env.STRIPE_SECRET_KEY || !EMAIL_PATTERN.test(email) || !address) return { success: false, message: "Please provide a valid email and address." };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const parsedAddress = JSON.parse(address) as { name?: string; phone?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } };
      const customerName = contactName.trim() || parsedAddress.name?.trim() || "";
    const nameParts = customerName.split(/\s+/).filter(Boolean);
    const addressParts = [parsedAddress.address?.line1, parsedAddress.address?.line2, parsedAddress.address?.city, parsedAddress.address?.state, parsedAddress.address?.postal_code, parsedAddress.address?.country].filter(Boolean);
    await stripe.paymentIntents.update(paymentIntentId, {
      receipt_email: email,
      metadata: {
        email: metadataValue(email),
        phone: metadataValue(parsedAddress.phone ?? ""),
        customerName: metadataValue(customerName),
        firstName: metadataValue(nameParts[0] ?? ""),
        lastName: metadataValue(nameParts.slice(1).join(" ")),
        address: metadataValue(addressParts.join(", ")),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to save payment customer details:", error);
    return { success: false, message: "We could not save your contact details. Please try again." };
  }
}

export async function updateCommissionPaymentOptions(paymentIntentId: string, priorityDate: string, shippingCents: number, shippingRegion: CommissionShippingRegion) {
  if (!process.env.STRIPE_SECRET_KEY || !["australia", "us-canada"].includes(shippingRegion)) return { success: false, message: "Please choose a valid shipping method." };
  if (!isValidPriorityDate(priorityDate.trim())) return { success: false, message: INVALID_PRIORITY_DATE_MESSAGE };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const paymentPlan = paymentIntent.metadata.paymentPlan === "installments" ? "installments" : "full";
    const priceIds = (paymentIntent.metadata.sizePriceIds ?? "").split(", ").filter(Boolean);
    const prices = await Promise.all(priceIds.map((priceId) => stripe.prices.retrieve(priceId, { expand: ["product"] })));
    const expectedShippingCents = shippingCents === 0 ? 0 : calculateShippingForPrices(prices, shippingRegion);
    if (shippingCents !== expectedShippingCents) return { success: false, message: "The shipping total is out of date. Please select the shipping method again." };
    const selectedAmountCents = prices.reduce((sum, price) => sum + (price.unit_amount ?? 0), 0);
    const totals = calculatePaymentTotals(paymentPlan, selectedAmountCents, priorityDate, shippingCents, Number(paymentIntent.metadata.discountCents ?? 0));
    const { amountCents, totalCents, rushCents, discountCents } = totals;
    await stripe.paymentIntents.update(paymentIntentId, {
      amount: amountCents,
      metadata: { priorityDate, shippingCents: String(shippingCents), shippingRegion, rushCents: String(rushCents), discountCents: String(discountCents), totalCents: String(totalCents) },
    });
    return { success: true, amountCents, totalCents };
  } catch (error) {
    console.error("Failed to update commission payment options:", error);
    return { success: false, message: "We could not update the payment total. Please try again." };
  }
}

export async function applyCommissionVoucher(paymentIntentId: string, code: string, priorityDate: string, shippingCents: number, shippingRegion: CommissionShippingRegion) {
  if (!process.env.STRIPE_SECRET_KEY) return { success: false, message: "Payments aren't configured yet." };
  if (!["australia", "us-canada"].includes(shippingRegion)) return { success: false, message: "Please choose a valid shipping method." };
  if (!isValidPriorityDate(priorityDate.trim())) return { success: false, message: INVALID_PRIORITY_DATE_MESSAGE };

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") return { success: false, message: "This payment has already been completed." };

    const normalized = code.trim().toUpperCase();
    const source = await resolveDiscountCode(normalized);
    if (normalized && !source) return { success: false, message: "That coupon or voucher is invalid or has already been used." };

    const paymentPlan = paymentIntent.metadata.paymentPlan === "installments" ? "installments" : "full";
    const priceIds = (paymentIntent.metadata.sizePriceIds ?? "").split(", ").filter(Boolean);
    if (priceIds.length === 0) return { success: false, message: "The selected product prices could not be found." };
    const prices = await Promise.all(priceIds.map((priceId) => stripe.prices.retrieve(priceId, { expand: ["product"] })));
    const expectedShippingCents = shippingCents === 0 ? 0 : calculateShippingForPrices(prices, shippingRegion);
    if (shippingCents !== expectedShippingCents) return { success: false, message: "The shipping total is out of date. Please select the shipping method again." };
    const selectedAmountCents = prices.reduce((sum, price) => sum + (price.unit_amount ?? 0), 0);
    const totals = calculatePaymentTotals(paymentPlan, selectedAmountCents, priorityDate.trim(), shippingCents, getDiscountCents(source));
    if (totals.amountCents < 50) return { success: false, message: "This voucher covers the initial payment in full. Please contact the studio to complete this order." };

    await stripe.paymentIntents.update(paymentIntentId, {
      amount: totals.amountCents,
      metadata: {
        priorityDate: priorityDate.trim(),
        shippingCents: String(shippingCents),
        shippingRegion,
        rushCents: String(totals.rushCents),
        coupon: normalized,
        couponId: source?.record.id ?? "",
        couponType: source?.type ?? "",
        discountCents: String(totals.discountCents),
        totalCents: String(totals.totalCents),
      },
    });
    return { success: true, code: normalized, discountCents: totals.discountCents, amountCents: totals.amountCents, totalCents: totals.totalCents };
  } catch (error) {
    console.error("Failed to apply commission voucher:", error);
    return { success: false, message: "We could not apply that coupon or voucher. Please try again." };
  }
}

export async function createCommissionDeposit(
  _prevState: CommissionDepositState,
  formData: FormData
): Promise<CommissionDepositState> {
  const firstName = field(formData, "firstName");
  const lastName = field(formData, "lastName");
  const email = field(formData, "email");
  const sizePriceIds = [...new Set(formData.getAll("sizes").map(String).filter((id) => id.startsWith("price_")))];
  const otherSize = formData.getAll("sizes").includes("other");
  const requestedAddOns = formData.getAll("addOns").map(String);
  const addOns = ADD_ON_PRODUCTS.filter((product) => requestedAddOns.includes(product.label)).map((product) => product.label);
  const priorityDate = field(formData, "priorityDate");
  if (!isValidPriorityDate(priorityDate)) return { status: "error", message: INVALID_PRIORITY_DATE_MESSAGE };
  const addOnReference = field(formData, "addOnReference");
  const couponCode = field(formData, "coupon").toUpperCase();

  const addOnPriceIds = ADD_ON_PRODUCTS.filter((product) => addOns.includes(product.label)).map((product) => product.priceId);

  if (otherSize) {
    if (!firstName || !lastName || !EMAIL_PATTERN.test(email)) return { status: "error", message: "Please fill in your name and a valid email so we can send your custom quote." };
    if (!field(formData, "otherSize") || !field(formData, "address") || !field(formData, "story")) return { status: "error", message: "Please complete the custom size, address, and project details fields." };
    try {
      const emailDetails = buildEmailDetails(formData, [], addOns);
      const quoteDetails: CommissionEmailDetails = { ...emailDetails, total: "Manual quote required", deposit: "No payment taken", paymentReference: "Manual quote", quoteOnly: true };
      await sendCustomerEmail(quoteDetails);
      await sendBusinessEmail(quoteDetails);
      return { status: "quote-only", message: "Thanks! Custom sizing needs a quick manual quote - we'll email you shortly to confirm pricing before any payment is taken." };
    } catch (error) {
      console.error("Failed to send custom quote emails:", error);
      return { status: "error", message: "We couldn't send your request emails. Please try again." };
    }
  }

  if (!firstName || !lastName || !EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please fill in your name and a valid email before continuing to payment." };
  }
  if (sizePriceIds.length === 0) return { status: "error", message: "Please choose at least one canvas size." };

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not set - add it to .env.local to enable payments.");
    return { status: "error", message: "Payments aren't configured yet. Please contact us to complete your order." };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const prices = await Promise.all(sizePriceIds.map((priceId) => stripe.prices.retrieve(priceId, { expand: ["product"] })));
    const invalidPrice = prices.some((price) => {
      const product = typeof price.product === "string" ? null : price.product;
      return !price.active || price.type !== "one_time" || price.unit_amount === null || !product || product.deleted || !product.active;
    });
    const currencies = new Set(prices.map((price) => price.currency));
    if (invalidPrice || currencies.size !== 1) return { status: "error", message: "One of the selected Stripe products is no longer available. Please refresh and try again." };

    const currency = prices[0].currency;
    const artworkCents = prices.reduce((sum, price) => sum + (price.unit_amount ?? 0), 0);
    const extrasCents = addOns.length * ADD_ON_PRICE * 100;
    const rushCents = priorityDate ? Math.round((artworkCents + extrasCents) * RUSH_FEE_RATE) : 0;
  const totalCents = artworkCents + extrasCents + rushCents;
    let coupon: CouponRecord | VoucherRecord | null = null;
    let couponType = "coupon";
    if (couponCode) {
      coupon = await findAvailableCoupon(couponCode);
      if (!coupon && /^VOUCHER\d{8}$/.test(couponCode)) {
        coupon = await findAvailableVoucher(couponCode);
        couponType = "voucher";
      }
      if (!coupon) return { status: "error", message: "That coupon is invalid or has already been used." };
    }
    const discountCents = Math.min(getDiscountCents(coupon ? { record: coupon, type: couponType as "coupon" | "voucher" } : null), totalCents);
    const discountedTotalCents = totalCents - discountCents;
    const depositCents = Math.round(discountedTotalCents / 2);
    const sizeLabels = prices.map((price) => typeof price.product === "string" || price.product.deleted ? price.id : price.product.name);
    const emailDetails = buildEmailDetails(formData, sizeLabels, addOns);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: depositCents,
      currency,
      payment_method_types: ["card"],
      receipt_email: email,
      description: `KinCollage commission deposit - ${firstName} ${lastName}`,
      metadata: {
        firstName,
        lastName,
        email,
        address: metadataValue(emailDetails.address),
        product: metadataValue(emailDetails.product),
        sizes: metadataValue(emailDetails.sizes),
        otherSize: metadataValue(emailDetails.otherSize),
        addOns: metadataValue(emailDetails.addOns),
        framing: metadataValue(emailDetails.framing),
        box: metadataValue(emailDetails.box),
        boxDetails: metadataValue(emailDetails.boxDetails),
        priorityDate: metadataValue(emailDetails.priorityDate),
        story: metadataValue(emailDetails.story),
        note: metadataValue(emailDetails.note),
        coupon: metadataValue(emailDetails.coupon),
        couponId: coupon?.id ?? "",
        couponType,
        addOnPriceIds: addOnPriceIds.join(", ") || "none",
        addOnReference,
        rushRequested: String(Boolean(priorityDate)),
        sizePriceIds: sizePriceIds.join(", "),
        artworkCents: String(artworkCents),
        extrasCents: String(extrasCents),
        rushCents: String(rushCents),
        totalCents: String(discountedTotalCents),
        discountCents: String(discountCents),
      },
    });
    if (!paymentIntent.client_secret) throw new Error("Stripe did not return a client secret.");
    return { status: "ready", clientSecret: paymentIntent.client_secret, depositCents, totalCents: discountedTotalCents, currency };
  } catch (error) {
    console.error("Failed to create commission deposit PaymentIntent:", error);
    return { status: "error", message: "Something went wrong setting up payment. Please try again." };
  }
}
