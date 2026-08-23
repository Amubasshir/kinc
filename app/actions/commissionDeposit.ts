"use server";

import Stripe from "stripe";
import { computeCommissionTotals, SIZES } from "../lib/commissionPricing";
import { ADD_ON_PRODUCTS } from "../models/site";

export type CommissionDepositState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "quote-only"; message: string }
  | { status: "ready"; clientSecret: string; depositCents: number; totalCents: number };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createCommissionDeposit(
  _prevState: CommissionDepositState,
  formData: FormData
): Promise<CommissionDepositState> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not set — add it to .env.local to enable payments.");
    return { status: "error", message: "Payments aren't configured yet. Please contact us to complete your order." };
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const sizeIds = formData.getAll("sizes").map(String).filter((id) => SIZES.some((size) => size.id === id));
  const otherSize = formData.get("sizes") !== null && formData.getAll("sizes").includes("other");
  const addOns = formData.getAll("addOns").map(String);
  const priorityDate = String(formData.get("priorityDate") ?? "").trim();
  const addOnReference = String(formData.get("addOnReference") ?? "").trim();

  if (!firstName || !lastName || !EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please fill in your name and a valid email before continuing to payment." };
  }
  if (sizeIds.length === 0 && !otherSize) {
    return { status: "error", message: "Please choose at least one canvas size." };
  }

  const totals = computeCommissionTotals({ sizeIds, addOnCount: addOns.length, rushRequested: Boolean(priorityDate) });
  const addOnPriceIds = ADD_ON_PRODUCTS.filter((product) => addOns.includes(product.label)).map((product) => product.priceId);

  if (totals.total === 0) {
    // Only a custom ("other") size was selected — that needs a manual quote, not a card charge yet.
    return {
      status: "quote-only",
      message: "Thanks! Custom sizing needs a quick manual quote — we'll email you shortly to confirm pricing before any payment is taken.",
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totals.deposit * 100,
      currency: "aud",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `KinCollage commission deposit — ${firstName} ${lastName}`,
      metadata: {
        firstName,
        lastName,
        email,
        sizes: sizeIds.join(", ") || "custom",
        addOns: addOns.join(", ") || "none",
        addOnPriceIds: addOnPriceIds.join(", ") || "none",
        addOnReference,
        rushRequested: String(Boolean(priorityDate)),
        artworkCents: String(totals.artwork * 100),
        extrasCents: String(totals.extras * 100),
        rushCents: String(totals.rush * 100),
        totalCents: String(totals.total * 100),
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe did not return a client secret.");
    }

    return {
      status: "ready",
      clientSecret: paymentIntent.client_secret,
      depositCents: totals.deposit * 100,
      totalCents: totals.total * 100,
    };
  } catch (err) {
    console.error("Failed to create commission deposit PaymentIntent:", err);
    return { status: "error", message: "Something went wrong setting up payment. Please try again." };
  }
}
