"use server";

import { createHash } from "node:crypto";
import { fulfillPaymentIntent } from "../lib/paymentFulfillment";
import { enforcePaymentRateLimit } from "../lib/paymentRateLimit";
import { getStripeServer, paymentMetadata, retrievePaymentIntentForClient } from "../lib/stripeServer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ATTEMPT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type VoucherPaymentState = { status: "idle" | "error" | "ready"; message?: string; clientSecret?: string; amountCents?: number; email?: string };

export async function createVoucherPayment(_prev: VoucherPaymentState, formData: FormData): Promise<VoucherPaymentState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const amount = Number(formData.get("amount"));
  const amountCents = Math.round(amount * 100);
  const checkoutAttemptId = String(formData.get("checkoutAttemptId") ?? "");
  if (!EMAIL_PATTERN.test(email)) return { status: "error", message: "Please enter a valid email address." };
  if (!Number.isInteger(amount) || amount < 1 || amount > 10000) return { status: "error", message: "Please enter an amount between $1 and $10,000 USD." };
  if (!ATTEMPT_ID_PATTERN.test(checkoutAttemptId)) return { status: "error", message: "Please refresh the page and try again." };

  try {
    await enforcePaymentRateLimit("voucher-payment-create");
    const stripe = getStripeServer();
    const requestHash = createHash("sha256").update(`${email}:${amountCents}`).digest("hex").slice(0, 24);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      receipt_email: email,
      description: `KinCollage digital voucher - ${amount} USD`,
      metadata: {
        ...paymentMetadata("digital_voucher"),
        type: "digital_voucher",
        email,
        amountCents: String(amountCents),
      },
    }, { idempotencyKey: `voucher-${checkoutAttemptId}-${requestHash}` });
    if (!paymentIntent.client_secret) throw new Error("Stripe did not return a client secret.");
    return { status: "ready", clientSecret: paymentIntent.client_secret, amountCents, email };
  } catch (error) {
    console.error("Failed to create voucher payment:", error);
    const message = error instanceof Error && error.message.startsWith("Too many payment attempts")
      ? error.message
      : "We could not start payment. Please try again.";
    return { status: "error", message };
  }
}

export async function completeVoucherPayment(clientSecret: string): Promise<{ success: boolean; pending?: boolean; code?: string; message?: string }> {
  try {
    const paymentIntent = await retrievePaymentIntentForClient(clientSecret, "digital_voucher");
    if (paymentIntent.status !== "succeeded") return { success: false, pending: paymentIntent.status === "processing", message: "Payment has not completed yet." };
    const result = await fulfillPaymentIntent(paymentIntent);
    if (result.status === "processing") return { success: false, pending: true, message: "Your payment is being finalized." };
    if (!result.voucherCode) throw new Error("Voucher fulfillment completed without a voucher code.");
    return { success: true, code: result.voucherCode };
  } catch (error) {
    console.error("Failed to complete voucher payment:", error);
    return { success: false, message: "Payment succeeded, but we could not finish the voucher yet. Please retry or contact us." };
  }
}
