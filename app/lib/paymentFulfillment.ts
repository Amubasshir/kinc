import "server-only";

import { randomInt } from "node:crypto";
import { Resend } from "resend";
import type Stripe from "stripe";
import {
  type CommissionEmailDetails,
  renderCommissionConfirmationHtml,
  renderCommissionConfirmationText,
  renderCommissionNotificationHtml,
  renderCommissionNotificationText,
  renderVoucherHtml,
  renderVoucherNotificationHtml,
  renderVoucherNotificationText,
  renderVoucherText,
} from "../actions/emailTemplates";
import { formatMoney } from "./money";
import {
  claimPaymentFulfillment,
  createVoucher,
  findPaymentFulfillment,
  findVoucherByPaymentIntent,
  redeemCoupon,
  redeemReservedDiscount,
  redeemVoucher,
  updatePaymentFulfillment,
} from "./supabaseAdmin";
import { getKinPaymentType, getStripeServer, STRIPE_INTEGRATION_NAME } from "./stripeServer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PaymentFulfillmentResult =
  | { status: "completed"; voucherCode?: string }
  | { status: "processing" };

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message.slice(0, 500) : "Unknown fulfillment error";
}

function formatAddress(address: Stripe.Address | null | undefined) {
  if (!address) return "";
  return [address.line1, address.line2, address.city, address.state, address.postal_code, address.country].filter(Boolean).join(", ");
}

async function commissionDetailsFromPaymentIntent(paymentIntent: Stripe.PaymentIntent): Promise<CommissionEmailDetails> {
  const metadata = paymentIntent.metadata;
  const stripe = getStripeServer();
  const shippingName = paymentIntent.shipping?.name?.trim() ?? "";
  const customerName = (metadata.customerName ?? shippingName).trim().split(/\s+/).filter(Boolean);
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

  const totalCents = Number(metadata.totalCents ?? paymentIntent.amount_received);
  return {
    firstName: metadata.firstName ?? customerName[0] ?? "",
    lastName: metadata.lastName ?? customerName.slice(1).join(" "),
    email: paymentIntent.receipt_email ?? metadata.email ?? "",
    phone: paymentIntent.shipping?.phone ?? metadata.phone ?? "",
    address: formatAddress(paymentIntent.shipping?.address) || metadata.address || "",
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
    total: formatMoney(totalCents / 100, paymentIntent.currency),
    deposit: formatMoney(paymentIntent.amount_received / 100, paymentIntent.currency),
    paymentReference: paymentIntent.id,
    paymentPlan: metadata.paymentPlan === "installments" ? "First of 3 installments; remaining payments arranged by the studio" : "Full payment",
    installmentNumber: metadata.installmentNumber ? `${metadata.installmentNumber} of 3` : "",
    shipping: formatMoney(shippingCents / 100, paymentIntent.currency),
    rushFee: rushCents ? formatMoney(rushCents / 100, paymentIntent.currency) : "None",
    discount: Number(metadata.discountCents ?? 0) > 0 ? formatMoney(Number(metadata.discountCents) / 100, paymentIntent.currency) : "",
  };
}

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured.");
  return new Resend(process.env.RESEND_API_KEY);
}

async function sendCommissionCustomerEmail(details: CommissionEmailDetails, paymentIntentId: string) {
  const { error } = await getResend().emails.send({
    from: "Zsofia at KinCollage <hello@kincollage.com>",
    to: details.email,
    subject: "Your KinCollage order is confirmed",
    html: renderCommissionConfirmationHtml(details),
    text: renderCommissionConfirmationText(details),
  }, { idempotencyKey: `commission-customer/${paymentIntentId}` });
  if (error) throw new Error(`Customer confirmation email failed: ${error.message}`);
}

async function sendCommissionBusinessEmail(details: CommissionEmailDetails, paymentIntentId: string) {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error("CONTACT_TO_EMAIL is not configured.");
  const { error } = await getResend().emails.send({
    from: "KinCollage Orders <hello@kincollage.com>",
    to,
    replyTo: details.email,
    subject: `New paid commission from ${details.firstName || "customer"}${details.lastName ? ` ${details.lastName}` : ""}`,
    html: renderCommissionNotificationHtml(details),
    text: renderCommissionNotificationText(details),
  }, { idempotencyKey: `commission-business/${paymentIntentId}` });
  if (error) throw new Error(`Business notification email failed: ${error.message}`);
}

async function fulfillCommission(paymentIntent: Stripe.PaymentIntent, fulfillment: Awaited<ReturnType<typeof claimPaymentFulfillment>>) {
  if (!fulfillment) throw new Error("Could not claim commission fulfillment.");
  if (paymentIntent.amount_received !== paymentIntent.amount || paymentIntent.amount_received <= 0) {
    throw new Error("The paid amount does not match the PaymentIntent amount.");
  }

  const details = await commissionDetailsFromPaymentIntent(paymentIntent);
  if (!EMAIL_PATTERN.test(details.email) || !details.address || !details.sizes) {
    throw new Error("Commission payment customer or order details are incomplete.");
  }

  if (!fulfillment.customer_email_sent_at) {
    await sendCommissionCustomerEmail(details, paymentIntent.id);
    const sentAt = new Date().toISOString();
    await updatePaymentFulfillment(paymentIntent.id, { customer_email_sent_at: sentAt });
    fulfillment.customer_email_sent_at = sentAt;
  }
  if (!fulfillment.business_email_sent_at) {
    await sendCommissionBusinessEmail(details, paymentIntent.id);
    const sentAt = new Date().toISOString();
    await updatePaymentFulfillment(paymentIntent.id, { business_email_sent_at: sentAt });
    fulfillment.business_email_sent_at = sentAt;
  }
  if (paymentIntent.metadata.coupon && !fulfillment.discount_redeemed_at) {
    const usesReservation = paymentIntent.metadata.integration === STRIPE_INTEGRATION_NAME;
    if (usesReservation) {
      if (!await redeemReservedDiscount(paymentIntent.id)) throw new Error("The reserved discount could not be redeemed.");
    } else if (paymentIntent.metadata.couponId) {
      if (paymentIntent.metadata.couponType === "voucher") await redeemVoucher(paymentIntent.metadata.couponId);
      else await redeemCoupon(paymentIntent.metadata.couponId, paymentIntent.id);
    }
    const redeemedAt = new Date().toISOString();
    await updatePaymentFulfillment(paymentIntent.id, { discount_redeemed_at: redeemedAt });
    fulfillment.discount_redeemed_at = redeemedAt;
  }
}

async function createVoucherOnce(paymentIntent: Stripe.PaymentIntent, email: string, amountCents: number) {
  const existing = await findVoucherByPaymentIntent(paymentIntent.id);
  if (existing) return existing;

  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await createVoucher(email, `VOUCHER${randomInt(10000000, 100000000)}`, amountCents, paymentIntent.id);
    } catch (error) {
      lastError = error;
      const concurrent = await findVoucherByPaymentIntent(paymentIntent.id);
      if (concurrent) return concurrent;
    }
  }
  throw lastError ?? new Error("Voucher could not be created.");
}

async function fulfillVoucher(paymentIntent: Stripe.PaymentIntent, fulfillment: Awaited<ReturnType<typeof claimPaymentFulfillment>>) {
  if (!fulfillment) throw new Error("Could not claim voucher fulfillment.");
  const email = (paymentIntent.receipt_email ?? paymentIntent.metadata.email ?? "").trim().toLowerCase();
  const amountCents = Number(paymentIntent.metadata.amountCents ?? paymentIntent.amount);
  if (!EMAIL_PATTERN.test(email) || !Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new Error("Voucher payment metadata is incomplete.");
  }
  if (paymentIntent.currency !== "usd" || paymentIntent.amount_received !== amountCents || paymentIntent.amount !== amountCents) {
    throw new Error("Voucher payment amount or currency does not match the order.");
  }

  const voucher = await createVoucherOnce(paymentIntent, email, amountCents);
  if (!fulfillment.voucher_created_at) {
    const createdAt = new Date().toISOString();
    await updatePaymentFulfillment(paymentIntent.id, { voucher_created_at: createdAt });
    fulfillment.voucher_created_at = createdAt;
  }

  const formattedAmount = formatMoney(amountCents / 100, "USD");
  if (!fulfillment.customer_email_sent_at) {
    const { error } = await getResend().emails.send({
      from: "Zsofia at KinCollage <hello@kincollage.com>",
      to: email,
      subject: "Your KinCollage digital voucher",
      html: renderVoucherHtml(email, voucher.code, formattedAmount),
      text: renderVoucherText(email, voucher.code, formattedAmount),
    }, { idempotencyKey: `voucher-customer/${paymentIntent.id}` });
    if (error) throw new Error(`Voucher customer email failed: ${error.message}`);
    const sentAt = new Date().toISOString();
    await updatePaymentFulfillment(paymentIntent.id, { customer_email_sent_at: sentAt });
    fulfillment.customer_email_sent_at = sentAt;
  }

  if (!fulfillment.business_email_sent_at && process.env.CONTACT_TO_EMAIL) {
    const { error } = await getResend().emails.send({
      from: "KinCollage Sales <hello@kincollage.com>",
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New ${formattedAmount} voucher purchase`,
      html: renderVoucherNotificationHtml(email, voucher.code, formattedAmount, paymentIntent.id),
      text: renderVoucherNotificationText(email, voucher.code, formattedAmount, paymentIntent.id),
    }, { idempotencyKey: `voucher-business/${paymentIntent.id}` });
    if (error) throw new Error(`Voucher business email failed: ${error.message}`);
    const sentAt = new Date().toISOString();
    await updatePaymentFulfillment(paymentIntent.id, { business_email_sent_at: sentAt });
    fulfillment.business_email_sent_at = sentAt;
  }
  return voucher.code;
}

export async function fulfillPaymentIntent(paymentIntent: Stripe.PaymentIntent): Promise<PaymentFulfillmentResult> {
  if (paymentIntent.status !== "succeeded") throw new Error("Payment has not succeeded.");
  const paymentType = getKinPaymentType(paymentIntent);
  if (!paymentType) throw new Error("PaymentIntent does not belong to the KinCollage integration.");

  const fulfillment = await claimPaymentFulfillment(paymentIntent.id, paymentType);
  if (!fulfillment) {
    const current = await findPaymentFulfillment(paymentIntent.id);
    if (current?.status === "completed") {
      const voucher = paymentType === "digital_voucher" ? await findVoucherByPaymentIntent(paymentIntent.id) : null;
      return { status: "completed", voucherCode: voucher?.code };
    }
    return { status: "processing" };
  }

  try {
    const voucherCode = paymentType === "digital_voucher"
      ? await fulfillVoucher(paymentIntent, fulfillment)
      : (await fulfillCommission(paymentIntent, fulfillment), undefined);
    const completedAt = new Date().toISOString();
    await updatePaymentFulfillment(paymentIntent.id, {
      status: "completed",
      completed_at: completedAt,
      processing_until: null,
      last_error: null,
    });

    try {
      await getStripeServer().paymentIntents.update(paymentIntent.id, {
        metadata: { fulfillmentStatus: "completed", fulfilledAt: completedAt },
      }, { idempotencyKey: `fulfillment-metadata-${paymentIntent.id}` });
    } catch (error) {
      console.error("Payment was fulfilled but Stripe fulfillment metadata could not be updated:", paymentIntent.id, error);
    }
    return { status: "completed", voucherCode };
  } catch (error) {
    await updatePaymentFulfillment(paymentIntent.id, {
      status: "failed",
      processing_until: null,
      last_error: errorMessage(error),
    }).catch((updateError) => console.error("Could not record payment fulfillment failure:", paymentIntent.id, updateError));
    throw error;
  }
}
