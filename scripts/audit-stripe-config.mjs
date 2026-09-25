import nextEnv from "@next/env";
import Stripe from "stripe";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const failures = [];
const warnings = [];
const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

function mode(key, secretPrefix, publishablePrefix) {
  if (key?.startsWith(`${secretPrefix}_live_`) || key?.startsWith(`${publishablePrefix}_live_`)) return "live";
  if (key?.startsWith(`${secretPrefix}_test_`) || key?.startsWith(`${publishablePrefix}_test_`)) return "test";
  return null;
}

if (!secretKey) failures.push("STRIPE_SECRET_KEY is missing.");
if (!publishableKey) failures.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing.");
if (!webhookSecret?.startsWith("whsec_")) failures.push("STRIPE_WEBHOOK_SECRET is missing or invalid.");
const secretMode = mode(secretKey, "sk", "pk");
const publishableMode = mode(publishableKey, "sk", "pk");
if (secretKey && !secretMode) failures.push("STRIPE_SECRET_KEY has an unexpected format.");
if (publishableKey && !publishableMode) failures.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY has an unexpected format.");
if (secretMode && publishableMode && secretMode !== publishableMode) failures.push("Stripe secret and publishable keys use different modes.");

if (secretKey) {
  const stripe = new Stripe(secretKey, { maxNetworkRetries: 2, timeout: 20_000 });
  try {
    const [account, products, webhooks] = await Promise.all([
      stripe.accounts.retrieve(),
      stripe.products.list({ active: true, limit: 100 }),
      stripe.webhookEndpoints.list({ limit: 100 }),
    ]);
    if (!account.charges_enabled) failures.push("Stripe charges are not enabled for this account.");
    if (!account.payouts_enabled) failures.push("Stripe payouts are not enabled for this account.");

    for (const size of ["mini", "statement", "master", "grand"]) {
      const product = products.data.find((candidate) => candidate.name.toLowerCase().includes(size));
      if (!product) {
        failures.push(`Active ${size} commission product is missing.`);
        continue;
      }
      const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
      const full = prices.data.find((price) => price.type === "one_time" && price.nickname?.toLowerCase().includes("2026 full price"));
      const installment = prices.data.find((price) => price.type === "one_time" && price.nickname?.toLowerCase().includes("2026") && price.nickname?.toLowerCase().includes("3 instalment"));
      if (!full?.unit_amount) failures.push(`${product.name} is missing its active 2026 full-payment price.`);
      if (!installment?.unit_amount) failures.push(`${product.name} is missing its active 2026 installment price.`);
      if (full && installment && full.currency !== installment.currency) failures.push(`${product.name} full and installment prices use different currencies.`);
    }

    const endpoint = webhooks.data.find((item) => {
      try { return new URL(item.url).pathname === "/api/stripe/webhook"; } catch { return false; }
    });
    if (!endpoint) {
      failures.push("No Stripe webhook endpoint targets /api/stripe/webhook in this mode.");
    } else {
      if (endpoint.status !== "enabled") failures.push("The Stripe webhook endpoint is disabled.");
      for (const eventType of ["payment_intent.succeeded", "payment_intent.payment_failed", "payment_intent.canceled"]) {
        if (!endpoint.enabled_events.includes("*") && !endpoint.enabled_events.includes(eventType)) failures.push(`Webhook is not subscribed to ${eventType}.`);
      }
    }
    console.log(`Stripe account check: ${secretMode ?? "unknown"} mode, ${account.country ?? "unknown country"}, ${account.default_currency?.toUpperCase() ?? "unknown currency"}.`);
  } catch (error) {
    failures.push(`Stripe API audit failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  failures.push("Supabase server configuration is missing.");
} else {
  for (const table of ["kin_payment_fulfillments", "kin_stripe_events", "kin_discount_reservations", "kin_rate_limits"]) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=0`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      });
      if (!response.ok) failures.push(`Supabase table ${table} is unavailable (${response.status}). Run supabase/kin_coupons.sql.`);
    } catch (error) {
      failures.push(`Could not verify Supabase table ${table}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

if (secretMode === "test") warnings.push("The current environment uses Stripe test keys; repeat this audit against the production environment before launch.");
for (const warning of warnings) console.warn(`WARNING: ${warning}`);
for (const failure of failures) console.error(`FAIL: ${failure}`);
if (failures.length) process.exitCode = 1;
else console.log("Stripe production-readiness audit passed.");
