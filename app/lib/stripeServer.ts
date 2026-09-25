import "server-only";

import { timingSafeEqual } from "node:crypto";
import Stripe from "stripe";

export const STRIPE_INTEGRATION_NAME = "kincollage";
export const STRIPE_INTEGRATION_VERSION = "1";

export type KinPaymentType = "commission" | "digital_voucher";

let stripeClient: Stripe | undefined;

function keyMode(value: string) {
  if (value.startsWith("sk_live_") || value.startsWith("pk_live_")) return "live";
  if (value.startsWith("sk_test_") || value.startsWith("pk_test_")) return "test";
  return null;
}

function assertMatchingStripeModes(secretKey: string) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  if (!publishableKey) throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured.");

  const secretMode = keyMode(secretKey);
  const publishableMode = keyMode(publishableKey);
  if (!secretMode || !publishableMode) throw new Error("Stripe API keys have an invalid format.");
  if (secretMode !== publishableMode) throw new Error("Stripe secret and publishable keys are from different modes.");
}

export function getStripeServer() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured.");
  assertMatchingStripeModes(secretKey);

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      appInfo: { name: "KinCollage", version: "1.0.0" },
      maxNetworkRetries: 2,
      timeout: 20_000,
    });
  }
  return stripeClient;
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || !secret.startsWith("whsec_")) throw new Error("STRIPE_WEBHOOK_SECRET is not configured correctly.");
  return secret;
}

export function paymentMetadata(paymentType: KinPaymentType) {
  return {
    integration: STRIPE_INTEGRATION_NAME,
    integrationVersion: STRIPE_INTEGRATION_VERSION,
    paymentType,
  };
}

export function getKinPaymentType(paymentIntent: Stripe.PaymentIntent): KinPaymentType | null {
  const metadata = paymentIntent.metadata;
  if (metadata.integration === STRIPE_INTEGRATION_NAME) {
    if (metadata.paymentType === "commission" || metadata.paymentType === "digital_voucher") return metadata.paymentType;
    return null;
  }

  // Support PaymentIntents created immediately before this integration version
  // was deployed. All new PaymentIntents carry the explicit integration marker.
  if (metadata.type === "digital_voucher") return "digital_voucher";
  if (metadata.sizePriceIds) return "commission";
  return null;
}

function paymentIntentIdFromClientSecret(clientSecret: string) {
  if (clientSecret.length > 512) return null;
  const separator = clientSecret.indexOf("_secret_");
  if (separator <= 3) return null;
  const paymentIntentId = clientSecret.slice(0, separator);
  return /^pi_[A-Za-z0-9]+$/.test(paymentIntentId) ? paymentIntentId : null;
}

function secretsMatch(actual: string, supplied: string) {
  const actualBuffer = Buffer.from(actual);
  const suppliedBuffer = Buffer.from(supplied);
  return actualBuffer.length === suppliedBuffer.length && timingSafeEqual(actualBuffer, suppliedBuffer);
}

export async function retrievePaymentIntentForClient(clientSecret: string, expectedType: KinPaymentType) {
  const paymentIntentId = paymentIntentIdFromClientSecret(clientSecret);
  if (!paymentIntentId) throw new Error("Invalid payment reference.");

  const paymentIntent = await getStripeServer().paymentIntents.retrieve(paymentIntentId);
  if (!paymentIntent.client_secret || !secretsMatch(paymentIntent.client_secret, clientSecret)) {
    throw new Error("Invalid payment reference.");
  }
  if (getKinPaymentType(paymentIntent) !== expectedType) throw new Error("Payment type does not match this operation.");
  return paymentIntent;
}

export function isPaymentIntentMutable(paymentIntent: Stripe.PaymentIntent) {
  return paymentIntent.status === "requires_payment_method" || paymentIntent.status === "requires_confirmation";
}
