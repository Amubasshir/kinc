"use server";

import { createHash } from "node:crypto";
import { Resend } from "resend";
import type Stripe from "stripe";
import { RUSH_FEE_RATE } from "../lib/commissionPricing";
import { formatMoney } from "../lib/money";
import { fulfillPaymentIntent } from "../lib/paymentFulfillment";
import { enforcePaymentRateLimit } from "../lib/paymentRateLimit";
import { getStripeCommissionProducts } from "../lib/stripePricing";
import { PICKUP_SHIPPING_REGION } from "../lib/stripeShippingConstants";
import {
  getCommissionShippingQuote,
  shippingAmountForRegion,
  shippingLabelForRegion,
  shippingRateIdsForRegion,
  type CommissionShippingRates,
  type CommissionShippingRegion,
} from "../lib/stripeShipping";
import {
  findAvailableCoupon,
  findAvailableVoucher,
  releaseDiscountReservation,
  reserveDiscount,
  type CouponRecord,
  type VoucherRecord,
} from "../lib/supabaseAdmin";
import {
  getStripeServer,
  isPaymentIntentMutable,
  paymentMetadata,
  retrievePaymentIntentForClient,
} from "../lib/stripeServer";
import { ADD_ON_PRODUCTS } from "../models/site";
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
  | { status: "ready"; clientSecret: string; amountCents: number; totalCents: number; currency: string; paymentPlan: "full" | "installments"; shippingRates: CommissionShippingRates };

export type { CommissionShippingRates, CommissionShippingRegion } from "../lib/stripeShipping";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ATTEMPT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_PRIORITY_DATE = "2099-12-31";
const INVALID_PRIORITY_DATE_MESSAGE = "Please enter a valid priority date between 2000 and 2099.";
const DISCOUNT_RESERVATION_MINUTES = 30;

function isValidPriorityDate(value: string) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > MAX_PRIORITY_DATE) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return year >= 2000 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function metadataValue(value: string) {
  return value.slice(0, 450);
}

type StripeDiscountRecord = {
  promotionCode: Stripe.PromotionCode;
  coupon: Stripe.Coupon;
};

type DiscountSource =
  | { record: CouponRecord | VoucherRecord; type: "coupon" | "voucher" }
  | { record: StripeDiscountRecord; type: "stripe" }
  | null;

function getDiscountCents(source: DiscountSource) {
  if (!source || source.type === "stripe") return 0;
  return source.type === "voucher"
    ? Math.max(0, Number((source.record as VoucherRecord).amount_cents) || 0)
    : Math.max(0, Number((source.record as CouponRecord).discount_cents) || 0);
}

async function resolveDiscountCode(stripe: Stripe, code: string): Promise<DiscountSource> {
  const normalized = code.trim().toUpperCase();
  if (!normalized || !/^[A-Z0-9-]{1,64}$/.test(normalized)) return null;

  if (/^GREET\d{6}$/.test(normalized)) {
    const coupon = await findAvailableCoupon(normalized);
    if (coupon) return { record: coupon, type: "coupon" };
  }
  if (/^VOUCHER\d{8}$/.test(normalized)) {
    const voucher = await findAvailableVoucher(normalized);
    if (voucher) return { record: voucher, type: "voucher" };
  }

  const promotionCodes = await stripe.promotionCodes.list({
    code: normalized,
    active: true,
    limit: 1,
    expand: ["data.promotion.coupon"],
  });
  const promotionCode = promotionCodes.data[0];
  if (!promotionCode || promotionCode.promotion.type !== "coupon" || !promotionCode.promotion.coupon) return null;
  const coupon = typeof promotionCode.promotion.coupon === "string"
    ? await stripe.coupons.retrieve(promotionCode.promotion.coupon)
    : promotionCode.promotion.coupon;
  if ("deleted" in coupon) return null;
  return { record: { promotionCode, coupon }, type: "stripe" };
}

function calculateDiscountCents(source: DiscountSource, discountableTotalCents: number, currency: string, productIds: string[]) {
  if (!source) return { discountCents: 0 };
  if (source.type !== "stripe") return { discountCents: Math.min(getDiscountCents(source), discountableTotalCents) };

  const { promotionCode, coupon } = source.record;
  if (!promotionCode.active || !coupon.valid) return { discountCents: 0, message: "That Stripe promotion code is no longer valid." };
  if (promotionCode.expires_at && promotionCode.expires_at * 1000 <= Date.now()) return { discountCents: 0, message: "That Stripe promotion code has expired." };
  if (promotionCode.max_redemptions !== null && promotionCode.times_redeemed >= promotionCode.max_redemptions) {
    return { discountCents: 0, message: "That Stripe promotion code has reached its redemption limit." };
  }
  if (promotionCode.customer || promotionCode.customer_account || promotionCode.restrictions.first_time_transaction) {
    return { discountCents: 0, message: "That Stripe promotion code has customer restrictions and cannot be used here." };
  }

  const currencyMinimum = promotionCode.restrictions.currency_options?.[currency]?.minimum_amount;
  const minimumAmount = currencyMinimum ?? (promotionCode.restrictions.minimum_amount_currency === currency ? promotionCode.restrictions.minimum_amount : null);
  if (minimumAmount !== null && minimumAmount !== undefined && discountableTotalCents < minimumAmount) {
    return { discountCents: 0, message: `This Stripe promotion requires a minimum order of ${formatMoney(minimumAmount / 100, currency)}.` };
  }

  const restrictedProducts = coupon.applies_to?.products ?? [];
  if (restrictedProducts.length > 0 && productIds.some((productId) => !restrictedProducts.includes(productId))) {
    return { discountCents: 0, message: "That Stripe promotion does not apply to all selected products." };
  }

  const amountOff = coupon.currency_options?.[currency]?.amount_off
    ?? (coupon.currency && coupon.currency !== currency ? null : coupon.amount_off);
  if (coupon.amount_off !== null && coupon.currency && coupon.currency !== currency && !coupon.currency_options?.[currency]) {
    return { discountCents: 0, message: "That Stripe promotion is not configured for this currency." };
  }
  if (amountOff === null && coupon.percent_off === null) return { discountCents: 0, message: "That Stripe promotion has no usable discount." };

  const discountCents = amountOff !== null
    ? amountOff
    : Math.round(discountableTotalCents * (coupon.percent_off ?? 0) / 100);
  return { discountCents: Math.min(Math.max(0, discountCents), discountableTotalCents) };
}

async function reserveDiscountForPayment(paymentIntentId: string, normalizedCode: string, source: Exclude<DiscountSource, null>) {
  const expiresAt = new Date(Date.now() + DISCOUNT_RESERVATION_MINUTES * 60_000).toISOString();
  const sourceId = source.type === "stripe" ? source.record.promotionCode.id : source.record.id;
  const maxRedemptions = source.type === "stripe"
    ? source.record.promotionCode.max_redemptions === null
      ? null
      : Math.max(0, source.record.promotionCode.max_redemptions - source.record.promotionCode.times_redeemed)
    : 1;
  if (maxRedemptions === 0) return false;
  return reserveDiscount({
    paymentIntentId,
    code: normalizedCode,
    sourceType: source.type,
    sourceId,
    maxRedemptions,
    expiresAt,
  });
}

function calculatePaymentTotals(paymentPlan: "full" | "installments", selectedAmountCents: number, priorityDate: string, shippingCents: number, requestedDiscountCents = 0) {
  const baseTotalCents = paymentPlan === "installments" ? selectedAmountCents * 3 : selectedAmountCents;
  const rushCents = priorityDate ? Math.round(baseTotalCents * RUSH_FEE_RATE) : 0;
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

function productIdsForPrices(prices: Stripe.Price[]) {
  return prices.map((price) => typeof price.product === "string" || price.product.deleted ? "" : price.product.id).filter(Boolean);
}

async function getCommissionPrices(stripe: Stripe, priceIds: string[], paymentPlan: "full" | "installments") {
  const configuredProducts = await getStripeCommissionProducts();
  const allowedPriceIds = new Set(configuredProducts.map((product) => paymentPlan === "full" ? product.priceId : product.installmentPriceId));
  if (configuredProducts.length === 0 || priceIds.some((priceId) => !allowedPriceIds.has(priceId))) {
    throw new Error("One of the selected prices is not part of the current commission catalog.");
  }

  const prices = await Promise.all(priceIds.map((priceId) => stripe.prices.retrieve(priceId, { expand: ["product"] })));
  const invalidPrice = prices.some((price) => {
    const product = typeof price.product === "string" ? null : price.product;
    return !price.active || price.type !== "one_time" || price.unit_amount === null || !product || product.deleted || !product.active;
  });
  if (invalidPrice || new Set(prices.map((price) => price.currency)).size !== 1) {
    throw new Error("One of the selected prices is no longer available.");
  }
  return prices;
}

function buildEmailDetails(formData: FormData, sizeLabels: string[], addOns: string[]): CommissionEmailDetails {
  return {
    firstName: field(formData, "firstName"),
    lastName: field(formData, "lastName"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    address: field(formData, "address"),
    product: field(formData, "product"),
    sizes: sizeLabels.join(", ") || "Custom size",
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

async function sendQuoteEmails(details: CommissionEmailDetails) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) throw new Error("Quote email service is not configured.");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fingerprint = createHash("sha256").update(`${details.email}:${details.otherSize}:${details.story}`).digest("hex").slice(0, 32);
  const customerPromise = resend.emails.send({
    from: "Zsofia at KinCollage <hello@kincollage.com>",
    to: details.email,
    subject: "We've received your KinCollage quote request",
    html: renderCommissionConfirmationHtml(details),
    text: renderCommissionConfirmationText(details),
  }, { idempotencyKey: `commission-quote-customer/${fingerprint}` });
  const businessPromise = resend.emails.send({
    from: "KinCollage Orders <hello@kincollage.com>",
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: details.email,
    subject: `New quote request from ${details.firstName || "customer"}${details.lastName ? ` ${details.lastName}` : ""}`,
    html: renderCommissionNotificationHtml(details),
    text: renderCommissionNotificationText(details),
  }, { idempotencyKey: `commission-quote-business/${fingerprint}` });
  const [customer, business] = await Promise.all([customerPromise, businessPromise]);
  if (customer.error) throw new Error(`Customer quote email failed: ${customer.error.message}`);
  if (business.error) throw new Error(`Business quote email failed: ${business.error.message}`);
}

export async function completeCommissionOrder(clientSecret: string): Promise<{ success: boolean; pending?: boolean; message?: string }> {
  try {
    const paymentIntent = await retrievePaymentIntentForClient(clientSecret, "commission");
    if (paymentIntent.status !== "succeeded") return { success: false, pending: paymentIntent.status === "processing", message: "Payment has not completed yet." };
    const result = await fulfillPaymentIntent(paymentIntent);
    return result.status === "processing"
      ? { success: true, pending: true, message: "Payment succeeded and the order confirmation is being finalized." }
      : { success: true };
  } catch (error) {
    console.error("Failed to complete commission order:", error);
    return { success: false, message: "Payment succeeded, but we couldn't finish the order confirmation. Please retry or contact us." };
  }
}

export async function createCommissionPayment(_prevState: CommissionPaymentState, formData: FormData): Promise<CommissionPaymentState> {
  const paymentPlanValue = String(formData.get("paymentPlan") ?? "full");
  if (paymentPlanValue !== "full" && paymentPlanValue !== "installments") return { status: "error", message: "Please choose a payment option." };
  const paymentPlan = paymentPlanValue;
  const priceIds = [...new Set(formData.getAll("sizes").map(String).filter((id) => id.startsWith("price_")))];
  if (priceIds.length === 0 || priceIds.length > 4) return { status: "error", message: "Please choose at least one canvas size." };
  const priorityDate = String(formData.get("priorityDate") ?? "").trim();
  if (!isValidPriorityDate(priorityDate)) return { status: "error", message: INVALID_PRIORITY_DATE_MESSAGE };
  const checkoutAttemptId = String(formData.get("checkoutAttemptId") ?? "");
  if (!ATTEMPT_ID_PATTERN.test(checkoutAttemptId)) return { status: "error", message: "Please refresh the page and try again." };

  try {
    await enforcePaymentRateLimit("commission-payment-create");
    const stripe = getStripeServer();
    const prices = await getCommissionPrices(stripe, priceIds, paymentPlan);
    const currency = prices[0].currency;
    const shippingQuote = await getCommissionShippingQuote(stripe, prices);
    const selectedAmountCents = prices.reduce((sum, price) => sum + (price.unit_amount ?? 0), 0);
    const sizeLabels = prices.map((price) => typeof price.product === "string" || price.product.deleted ? price.id : price.product.name);
    const totals = calculatePaymentTotals(paymentPlan, selectedAmountCents, priorityDate, 0);
    if (totals.amountCents < 50) throw new Error("Payment amount is below Stripe's minimum.");
    const canonicalSelection = [...priceIds].sort().join(",");
    const requestHash = createHash("sha256").update(`${paymentPlan}:${canonicalSelection}:${priorityDate}`).digest("hex").slice(0, 24);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totals.amountCents,
      currency,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      description: paymentPlan === "installments" ? "KinCollage 2026 installment 1 of 3 (remaining installments arranged manually)" : "KinCollage 2026 full payment",
      metadata: {
        ...paymentMetadata("commission"),
        paymentPlan,
        installmentNumber: paymentPlan === "installments" ? "1" : "",
        installmentCollection: paymentPlan === "installments" ? "manual" : "",
        remainingInstallments: paymentPlan === "installments" ? "2" : "",
        sizePriceIds: priceIds.join(", "),
        sizes: metadataValue(sizeLabels.join(", ")),
        priorityDate,
        shippingCents: "0",
        shippingRegion: PICKUP_SHIPPING_REGION,
        shippingLabel: "Pick up from Sydney studio",
        shippingRateIds: "",
        rushCents: String(totals.rushCents),
        coupon: "",
        couponId: "",
        couponType: "",
        discountCents: "0",
        baseTotalCents: String(totals.baseTotalCents),
        totalCents: String(totals.totalCents),
      },
    }, { idempotencyKey: `commission-${checkoutAttemptId}-${requestHash}` });
    if (!paymentIntent.client_secret) throw new Error("Stripe did not return a client secret.");
    return { status: "ready", clientSecret: paymentIntent.client_secret, amountCents: totals.amountCents, totalCents: totals.totalCents, currency, paymentPlan, shippingRates: shippingQuote.rates };
  } catch (error) {
    console.error("Failed to create commission PaymentIntent:", error);
    const message = error instanceof Error && error.message.startsWith("Too many payment attempts")
      ? error.message
      : error instanceof Error && (error.message.startsWith("No Stripe shipping") || error.message.startsWith("No active Stripe shipping") || error.message.startsWith("No common active Stripe shipping") || error.message.startsWith("Multiple active Stripe shipping"))
        ? "Shipping is not configured for one of the selected sizes. Please contact the studio."
      : "Something went wrong setting up payment. Please refresh and try again.";
    return { status: "error", message };
  }
}

type ParsedAddress = {
  name?: string;
  phone?: string;
  address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string };
};

function cleanAddressPart(value: string | undefined, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export async function savePaymentCustomerDetails(clientSecret: string, emailInput: string, addressJson: string, contactName = "") {
  const email = emailInput.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || addressJson.length > 4_000) return { success: false, message: "Please provide a valid email and address." };
  try {
    const paymentIntent = await retrievePaymentIntentForClient(clientSecret, "commission");
    if (!isPaymentIntentMutable(paymentIntent)) return { success: false, message: "This payment can no longer be changed." };
    const parsed = JSON.parse(addressJson) as ParsedAddress;
    const name = cleanAddressPart(contactName || parsed.name, 120);
    const phone = cleanAddressPart(parsed.phone, 40);
    const address = {
      line1: cleanAddressPart(parsed.address?.line1, 200),
      line2: cleanAddressPart(parsed.address?.line2, 200) || undefined,
      city: cleanAddressPart(parsed.address?.city, 100),
      state: cleanAddressPart(parsed.address?.state, 100),
      postal_code: cleanAddressPart(parsed.address?.postal_code, 20),
      country: cleanAddressPart(parsed.address?.country, 2).toUpperCase(),
    };
    if (!name || !address.line1 || !address.city || !address.state || !address.postal_code || !/^[A-Z]{2}$/.test(address.country)) {
      return { success: false, message: "Please complete the shipping name and address." };
    }
    const shippingCents = Number(paymentIntent.metadata.shippingCents ?? 0);
    const shippingRegion = paymentIntent.metadata.shippingRegion;
    if (shippingCents > 0 && ((shippingRegion === "australia" && address.country !== "AU") || (shippingRegion === "us-canada" && !["US", "CA"].includes(address.country)))) {
      return { success: false, message: "The shipping method does not match the selected country." };
    }

    const nameParts = name.split(/\s+/).filter(Boolean);
    await getStripeServer().paymentIntents.update(paymentIntent.id, {
      receipt_email: email,
      shipping: { name, phone: phone || undefined, address },
      metadata: {
        customerName: metadataValue(name),
        firstName: metadataValue(nameParts[0] ?? ""),
        lastName: metadataValue(nameParts.slice(1).join(" ")),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to save payment customer details:", error);
    return { success: false, message: "We could not save your contact details. Please try again." };
  }
}

export async function updateCommissionPaymentOptions(clientSecret: string, priorityDateInput: string, shippingCents: number, shippingRegion: CommissionShippingRegion) {
  const priorityDate = priorityDateInput.trim();
  if (!Number.isSafeInteger(shippingCents) || shippingCents < 0 || !shippingRegion.trim()) return { success: false, message: "Please choose a valid shipping method." };
  if (!isValidPriorityDate(priorityDate)) return { success: false, message: INVALID_PRIORITY_DATE_MESSAGE };
  try {
    const stripe = getStripeServer();
    const paymentIntent = await retrievePaymentIntentForClient(clientSecret, "commission");
    if (!isPaymentIntentMutable(paymentIntent)) return { success: false, message: "This payment can no longer be changed." };
    const paymentPlan = paymentIntent.metadata.paymentPlan === "installments" ? "installments" : "full";
    const priceIds = (paymentIntent.metadata.sizePriceIds ?? "").split(", ").filter(Boolean);
    const prices = await getCommissionPrices(stripe, priceIds, paymentPlan);
    const shippingQuote = await getCommissionShippingQuote(stripe, prices);
    const expectedShippingCents = shippingAmountForRegion(shippingQuote, shippingRegion);
    if (expectedShippingCents === null || shippingCents !== expectedShippingCents) return { success: false, message: "The shipping total is out of date. Please select the shipping method again." };

    let discountCents = 0;
    const normalizedCode = (paymentIntent.metadata.coupon ?? "").trim().toUpperCase();
    if (normalizedCode) {
      const source = await resolveDiscountCode(stripe, normalizedCode);
      if (!source) return { success: false, message: "The applied coupon or voucher is no longer available." };
      const baseAmount = prices.reduce((sum, price) => sum + (price.unit_amount ?? 0), 0);
      const undiscounted = calculatePaymentTotals(paymentPlan, baseAmount, priorityDate, shippingCents);
      const discount = calculateDiscountCents(source, undiscounted.baseTotalCents + undiscounted.rushCents, paymentIntent.currency, productIdsForPrices(prices));
      if (discount.message) return { success: false, message: discount.message };
      if (!await reserveDiscountForPayment(paymentIntent.id, normalizedCode, source)) return { success: false, message: "That coupon or voucher is currently in use or has reached its limit." };
      discountCents = discount.discountCents;
    } else {
      await releaseDiscountReservation(paymentIntent.id);
    }

    const selectedAmountCents = prices.reduce((sum, price) => sum + (price.unit_amount ?? 0), 0);
    const totals = calculatePaymentTotals(paymentPlan, selectedAmountCents, priorityDate, shippingCents, discountCents);
    if (totals.amountCents < 50) return { success: false, message: "This voucher covers the initial payment in full. Please contact the studio to complete this order." };
    await stripe.paymentIntents.update(paymentIntent.id, {
      amount: totals.amountCents,
      metadata: {
        priorityDate,
        shippingCents: String(shippingCents),
        shippingRegion,
        shippingLabel: shippingLabelForRegion(shippingQuote, shippingRegion),
        shippingRateIds: shippingRegion === PICKUP_SHIPPING_REGION ? "" : shippingRateIdsForRegion(shippingQuote, shippingRegion).join(","),
        rushCents: String(totals.rushCents),
        discountCents: String(totals.discountCents),
        baseTotalCents: String(totals.baseTotalCents),
        totalCents: String(totals.totalCents),
      },
    });
    return { success: true, amountCents: totals.amountCents, totalCents: totals.totalCents };
  } catch (error) {
    console.error("Failed to update commission payment options:", error);
    return { success: false, message: "We could not update the payment total. Please try again." };
  }
}

export async function applyCommissionVoucher(clientSecret: string, code: string, priorityDateInput: string, shippingCents: number, shippingRegion: CommissionShippingRegion) {
  const priorityDate = priorityDateInput.trim();
  if (!Number.isSafeInteger(shippingCents) || shippingCents < 0 || !shippingRegion.trim()) return { success: false, message: "Please choose a valid shipping method." };
  if (!isValidPriorityDate(priorityDate)) return { success: false, message: INVALID_PRIORITY_DATE_MESSAGE };

  try {
    const stripe = getStripeServer();
    const paymentIntent = await retrievePaymentIntentForClient(clientSecret, "commission");
    if (!isPaymentIntentMutable(paymentIntent)) return { success: false, message: "This payment can no longer be changed." };
    const normalized = code.trim().toUpperCase();
    const source = await resolveDiscountCode(stripe, normalized);
    if (normalized && !source) return { success: false, message: "That coupon or voucher is invalid, expired, or already used." };

    const paymentPlan = paymentIntent.metadata.paymentPlan === "installments" ? "installments" : "full";
    const priceIds = (paymentIntent.metadata.sizePriceIds ?? "").split(", ").filter(Boolean);
    if (priceIds.length === 0) return { success: false, message: "The selected product prices could not be found." };
    const prices = await getCommissionPrices(stripe, priceIds, paymentPlan);
    const shippingQuote = await getCommissionShippingQuote(stripe, prices);
    const expectedShippingCents = shippingAmountForRegion(shippingQuote, shippingRegion);
    if (expectedShippingCents === null || shippingCents !== expectedShippingCents) return { success: false, message: "The shipping total is out of date. Please select the shipping method again." };
    const selectedAmountCents = prices.reduce((sum, price) => sum + (price.unit_amount ?? 0), 0);
    const undiscountedTotals = calculatePaymentTotals(paymentPlan, selectedAmountCents, priorityDate, shippingCents);
    const discount = calculateDiscountCents(source, undiscountedTotals.baseTotalCents + undiscountedTotals.rushCents, paymentIntent.currency, productIdsForPrices(prices));
    if (discount.message) return { success: false, message: discount.message };
    const totals = calculatePaymentTotals(paymentPlan, selectedAmountCents, priorityDate, shippingCents, discount.discountCents);
    if (totals.amountCents < 50) return { success: false, message: "This voucher covers the initial payment in full. Please contact the studio to complete this order." };

    if (source) {
      if (!await reserveDiscountForPayment(paymentIntent.id, normalized, source)) return { success: false, message: "That coupon or voucher is currently in use or has reached its limit." };
    } else {
      await releaseDiscountReservation(paymentIntent.id);
    }
    const stripeSource = source?.type === "stripe" ? source.record : null;
    await stripe.paymentIntents.update(paymentIntent.id, {
      amount: totals.amountCents,
      metadata: {
        priorityDate,
        shippingCents: String(shippingCents),
        shippingRegion,
        shippingLabel: shippingLabelForRegion(shippingQuote, shippingRegion),
        shippingRateIds: shippingRegion === PICKUP_SHIPPING_REGION ? "" : shippingRateIdsForRegion(shippingQuote, shippingRegion).join(","),
        rushCents: String(totals.rushCents),
        coupon: normalized,
        couponId: source && source.type !== "stripe" ? source.record.id : "",
        couponType: source?.type ?? "",
        stripePromotionCodeId: stripeSource?.promotionCode.id ?? "",
        stripeCouponId: stripeSource?.coupon.id ?? "",
        discountCents: String(totals.discountCents),
        baseTotalCents: String(totals.baseTotalCents),
        totalCents: String(totals.totalCents),
      },
    });
    return { success: true, code: normalized, discountCents: totals.discountCents, amountCents: totals.amountCents, totalCents: totals.totalCents };
  } catch (error) {
    console.error("Failed to apply commission voucher:", error);
    return { success: false, message: "We could not apply that coupon or voucher. Please try again." };
  }
}

export async function createCommissionDeposit(_prevState: CommissionDepositState, formData: FormData): Promise<CommissionDepositState> {
  const firstName = field(formData, "firstName");
  const lastName = field(formData, "lastName");
  const email = field(formData, "email").toLowerCase();
  const isCustomSize = formData.getAll("sizes").includes("other");
  const priorityDate = field(formData, "priorityDate");
  if (!isCustomSize) return { status: "error", message: "Please refresh the page and choose a commission size." };
  if (!isValidPriorityDate(priorityDate)) return { status: "error", message: INVALID_PRIORITY_DATE_MESSAGE };
  if (!firstName || !lastName || !EMAIL_PATTERN.test(email)) return { status: "error", message: "Please fill in your name and a valid email so we can send your custom quote." };
  if (!field(formData, "otherSize") || !field(formData, "address") || !field(formData, "story")) return { status: "error", message: "Please complete the custom size, address, and project details fields." };

  try {
    await enforcePaymentRateLimit("commission-quote-create");
    const requestedAddOns = formData.getAll("addOns").map(String);
    const addOns = ADD_ON_PRODUCTS.filter((product) => requestedAddOns.includes(product.label)).map((product) => product.label);
    const details = buildEmailDetails(formData, [], addOns);
    const quoteDetails: CommissionEmailDetails = { ...details, email, total: "Manual quote required", deposit: "No payment taken", paymentReference: "Manual quote", quoteOnly: true };
    await sendQuoteEmails(quoteDetails);
    return { status: "quote-only", message: "Thanks! Custom sizing needs a quick manual quote - we'll email you shortly to confirm pricing before any payment is taken." };
  } catch (error) {
    console.error("Failed to send custom quote emails:", error);
    const message = error instanceof Error && error.message.startsWith("Too many payment attempts")
      ? error.message
      : "We couldn't send your request emails. Please try again.";
    return { status: "error", message };
  }
}
