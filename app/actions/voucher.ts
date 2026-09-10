"use server";

import { randomInt } from "node:crypto";
import { Resend } from "resend";
import Stripe from "stripe";
import { createVoucher, findVoucherByPaymentIntent } from "../lib/supabaseAdmin";
import { renderVoucherHtml, renderVoucherText, renderVoucherNotificationHtml, renderVoucherNotificationText } from "./emailTemplates";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export type VoucherPaymentState = { status: "idle" | "error" | "ready"; message?: string; clientSecret?: string; amountCents?: number };

export async function createVoucherPayment(_prev: VoucherPaymentState, formData: FormData): Promise<VoucherPaymentState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const amount = Number(formData.get("amount"));
  const amountCents = Math.round(amount * 100);
  if (!EMAIL_PATTERN.test(email)) return { status: "error", message: "Please enter a valid email address." };
  if (!Number.isInteger(amount) || amount < 1 || amount > 10000) return { status: "error", message: "Please enter an amount between $1 and $10,000 AUD." };
  if (!process.env.STRIPE_SECRET_KEY) return { status: "error", message: "Payments are not configured yet." };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "aud",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `KinCollage digital voucher - ${amount} AUD`,
      metadata: { type: "digital_voucher", email, amountCents: String(amountCents) },
    });
    if (!paymentIntent.client_secret) throw new Error("Stripe did not return a client secret.");
    return { status: "ready", clientSecret: paymentIntent.client_secret, amountCents };
  } catch (error) {
    console.error("Failed to create voucher payment:", error);
    return { status: "error", message: "We could not start payment. Please try again." };
  }
}

export async function completeVoucherPayment(paymentIntentId: string): Promise<{ success: boolean; code?: string; message?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) return { success: false, message: "Payment verification is not configured." };
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded" || paymentIntent.metadata.type !== "digital_voucher") return { success: false, message: "Payment has not completed yet." };
    const email = paymentIntent.metadata.email ?? paymentIntent.receipt_email ?? "";
    const amountCents = Number(paymentIntent.metadata.amountCents ?? paymentIntent.amount);
    if (!EMAIL_PATTERN.test(email) || !amountCents) throw new Error("Voucher payment metadata is incomplete.");
    const voucher = await findVoucherByPaymentIntent(paymentIntent.id) ?? await createVoucher(email, `VOUCHER${randomInt(10000000, 100000000)}`, amountCents, paymentIntent.id);
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured.");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const customerResult = await resend.emails.send({ from: "Zsofia at KinCollage <hello@kincollage.com>", to: email, subject: "Your KinCollage digital voucher", html: renderVoucherHtml(email, voucher.code, String(amountCents / 100)), text: renderVoucherText(email, voucher.code, String(amountCents / 100)) });
    if (customerResult.error) throw new Error(customerResult.error.message);
    if (process.env.CONTACT_TO_EMAIL) {
      const businessResult = await resend.emails.send({ from: "KinCollage Sales <hello@kincollage.com>", to: process.env.CONTACT_TO_EMAIL, replyTo: email, subject: `New ${amountCents / 100} AUD voucher purchase`, html: renderVoucherNotificationHtml(email, voucher.code, String(amountCents / 100), paymentIntent.id), text: renderVoucherNotificationText(email, voucher.code, String(amountCents / 100), paymentIntent.id) });
      if (businessResult.error) console.error("Voucher business notification failed:", businessResult.error);
    }
    return { success: true, code: voucher.code };
  } catch (error) {
    console.error("Failed to complete voucher payment:", error);
    return { success: false, message: "Payment succeeded, but we could not send the voucher email. Please retry." };
  }
}
