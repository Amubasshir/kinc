"use server";

import { Resend } from "resend";
import Stripe from "stripe";
import { computeCommissionTotals, SIZES } from "../lib/commissionPricing";
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
  | { status: "ready"; clientSecret: string; depositCents: number; totalCents: number };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const money = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function metadataValue(value: string) {
  return value.slice(0, 450);
}

function buildEmailDetails(formData: FormData, sizeIds: string[], addOns: string[]): CommissionEmailDetails {
  const customSizeSelected = formData.getAll("sizes").includes("other");
  return {
    firstName: field(formData, "firstName"),
    lastName: field(formData, "lastName"),
    email: field(formData, "email"),
    address: field(formData, "address"),
    product: field(formData, "product"),
    sizes: sizeIds.map((id) => SIZES.find((size) => size.id === id)?.label ?? id).join(", ") || (customSizeSelected ? "Custom size" : ""),
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
    subject: `${details.quoteOnly ? "New quote request" : "New paid commission"} from ${details.firstName} ${details.lastName}`,
    html: renderCommissionNotificationHtml(details),
    text: renderCommissionNotificationText(details),
  });
  if (error) throw new Error(`Business notification email failed: ${error.message}`);
}

function detailsFromPaymentIntent(paymentIntent: Stripe.PaymentIntent): CommissionEmailDetails {
  const metadata = paymentIntent.metadata;
  return {
    firstName: metadata.firstName ?? "",
    lastName: metadata.lastName ?? "",
    email: metadata.email ?? "",
    address: metadata.address ?? "",
    product: metadata.product ?? "",
    sizes: metadata.sizes ?? "",
    otherSize: metadata.otherSize ?? "",
    addOns: metadata.addOns ?? "",
    framing: metadata.framing ?? "",
    box: metadata.box ?? "",
    boxDetails: metadata.boxDetails ?? "",
    priorityDate: metadata.priorityDate ?? "",
    story: metadata.story ?? "",
    note: metadata.note ?? "",
    coupon: metadata.coupon ?? "",
    total: money.format(Number(metadata.totalCents ?? paymentIntent.amount * 2) / 100),
    deposit: money.format(paymentIntent.amount_received / 100),
    paymentReference: paymentIntent.id,
  };
}

export async function completeCommissionOrder(paymentIntentId: string): Promise<{ success: boolean; message?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) return { success: false, message: "Payment verification is not configured." };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") return { success: false, message: "Payment has not completed yet." };

    const details = detailsFromPaymentIntent(paymentIntent);
    if (!EMAIL_PATTERN.test(details.email)) throw new Error("The order does not contain a valid customer email.");

    if (paymentIntent.metadata.customerEmailSent !== "true") {
      await sendCustomerEmail(details);
      paymentIntent = await stripe.paymentIntents.update(paymentIntent.id, { metadata: { customerEmailSent: "true" } });
    }
    if (paymentIntent.metadata.businessEmailSent !== "true") {
      await sendBusinessEmail(details);
      await stripe.paymentIntents.update(paymentIntent.id, { metadata: { businessEmailSent: "true" } });
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to complete commission order:", error);
    return { success: false, message: "Payment succeeded, but we couldn't send the order emails. Please retry or contact us." };
  }
}

export async function createCommissionDeposit(
  _prevState: CommissionDepositState,
  formData: FormData
): Promise<CommissionDepositState> {
  const firstName = field(formData, "firstName");
  const lastName = field(formData, "lastName");
  const email = field(formData, "email");
  const sizeIds = formData.getAll("sizes").map(String).filter((id) => SIZES.some((size) => size.id === id));
  const otherSize = formData.getAll("sizes").includes("other");
  const addOns = formData.getAll("addOns").map(String);
  const priorityDate = field(formData, "priorityDate");
  const addOnReference = field(formData, "addOnReference");

  if (!firstName || !lastName || !EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please fill in your name and a valid email before continuing to payment." };
  }
  if (sizeIds.length === 0 && !otherSize) return { status: "error", message: "Please choose at least one canvas size." };

  const totals = computeCommissionTotals({ sizeIds, addOnCount: addOns.length, rushRequested: Boolean(priorityDate) });
  const addOnPriceIds = ADD_ON_PRODUCTS.filter((product) => addOns.includes(product.label)).map((product) => product.priceId);
  const emailDetails = buildEmailDetails(formData, sizeIds, addOns);

  if (totals.total === 0) {
    try {
      const quoteDetails: CommissionEmailDetails = { ...emailDetails, total: "Manual quote required", deposit: "No payment taken", paymentReference: "Manual quote", quoteOnly: true };
      await sendCustomerEmail(quoteDetails);
      await sendBusinessEmail(quoteDetails);
      return { status: "quote-only", message: "Thanks! Custom sizing needs a quick manual quote - we'll email you shortly to confirm pricing before any payment is taken." };
    } catch (error) {
      console.error("Failed to send custom quote emails:", error);
      return { status: "error", message: "We couldn't send your request emails. Please try again." };
    }
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not set - add it to .env.local to enable payments.");
    return { status: "error", message: "Payments aren't configured yet. Please contact us to complete your order." };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totals.deposit * 100,
      currency: "aud",
      automatic_payment_methods: { enabled: true },
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
        addOnPriceIds: addOnPriceIds.join(", ") || "none",
        addOnReference,
        rushRequested: String(Boolean(priorityDate)),
        artworkCents: String(totals.artwork * 100),
        extrasCents: String(totals.extras * 100),
        rushCents: String(totals.rush * 100),
        totalCents: String(totals.total * 100),
      },
    });
    if (!paymentIntent.client_secret) throw new Error("Stripe did not return a client secret.");
    return { status: "ready", clientSecret: paymentIntent.client_secret, depositCents: totals.deposit * 100, totalCents: totals.total * 100 };
  } catch (error) {
    console.error("Failed to create commission deposit PaymentIntent:", error);
    return { status: "error", message: "Something went wrong setting up payment. Please try again." };
  }
}
