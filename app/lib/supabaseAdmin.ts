type SupabaseError = { message?: string; code?: string };

function getConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return { url: url.replace(/\/$/, ""), key };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as SupabaseError;
    throw new Error(error.message ?? `Supabase request failed (${response.status}).`);
  }
  return (await response.json().catch(() => null)) as T;
}

export type CouponRecord = {
  id: string;
  email: string;
  code: string;
  discount_cents: number;
  redeemed_at: string | null;
};

export type VoucherRecord = Omit<CouponRecord, "discount_cents"> & { amount_cents: number; currency: string; payment_intent_id: string };

export type PaymentFulfillmentRecord = {
  payment_intent_id: string;
  payment_type: "commission" | "digital_voucher";
  status: "pending" | "processing" | "failed" | "completed";
  attempt_count: number;
  processing_until: string | null;
  customer_email_sent_at: string | null;
  business_email_sent_at: string | null;
  voucher_created_at: string | null;
  discount_redeemed_at: string | null;
  completed_at: string | null;
  last_error: string | null;
};

export type DiscountReservationInput = {
  paymentIntentId: string;
  code: string;
  sourceType: "coupon" | "voucher" | "stripe";
  sourceId: string;
  maxRedemptions: number | null;
  expiresAt: string;
};

export async function findCouponByEmail(email: string) {
  const rows = await supabaseRequest<CouponRecord[]>(
    `kin_coupons?select=id,email,code,discount_cents,redeemed_at&email=eq.${encodeURIComponent(email)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function findAvailableCoupon(code: string) {
  const rows = await supabaseRequest<CouponRecord[]>(
    `kin_coupons?select=id,email,code,discount_cents,redeemed_at&code=eq.${encodeURIComponent(code)}&redeemed_at=is.null&limit=1`,
  );
  return rows[0] ?? null;
}

export async function createCoupon(email: string, code: string) {
  const rows = await supabaseRequest<CouponRecord[]>("kin_coupons", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ email, code, discount_cents: 5000 }),
  });
  return rows[0];
}

export async function redeemCoupon(id: string, paymentIntentId: string) {
  await supabaseRequest<unknown>(
    `kin_coupons?id=eq.${encodeURIComponent(id)}&redeemed_at=is.null`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ redeemed_at: new Date().toISOString(), redeemed_payment_intent_id: paymentIntentId }),
    },
  );
}

export async function createVoucher(email: string, code: string, amountCents: number, paymentIntentId: string) {
  const rows = await supabaseRequest<VoucherRecord[]>("kin_vouchers", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ email, code, amount_cents: amountCents, currency: "usd", payment_intent_id: paymentIntentId }),
  });
  return rows[0];
}

export async function findVoucherByPaymentIntent(paymentIntentId: string) {
  const rows = await supabaseRequest<VoucherRecord[]>(
    `kin_vouchers?select=id,email,code,amount_cents,currency,payment_intent_id,redeemed_at&payment_intent_id=eq.${encodeURIComponent(paymentIntentId)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function findAvailableVoucher(code: string) {
  const rows = await supabaseRequest<VoucherRecord[]>(
    `kin_vouchers?select=id,email,code,amount_cents,currency,payment_intent_id,redeemed_at&code=eq.${encodeURIComponent(code)}&redeemed_at=is.null&limit=1`,
  );
  return rows[0] ?? null;
}

export async function redeemVoucher(id: string) {
  await supabaseRequest<unknown>(`kin_vouchers?id=eq.${encodeURIComponent(id)}&redeemed_at=is.null`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ redeemed_at: new Date().toISOString() }),
  });
}

export async function claimPaymentFulfillment(paymentIntentId: string, paymentType: PaymentFulfillmentRecord["payment_type"]) {
  const rows = await supabaseRequest<PaymentFulfillmentRecord[]>("rpc/kin_claim_payment_fulfillment", {
    method: "POST",
    body: JSON.stringify({ p_payment_intent_id: paymentIntentId, p_payment_type: paymentType }),
  });
  return rows[0] ?? null;
}

export async function findPaymentFulfillment(paymentIntentId: string) {
  const rows = await supabaseRequest<PaymentFulfillmentRecord[]>(
    `kin_payment_fulfillments?select=payment_intent_id,payment_type,status,attempt_count,processing_until,customer_email_sent_at,business_email_sent_at,voucher_created_at,discount_redeemed_at,completed_at,last_error&payment_intent_id=eq.${encodeURIComponent(paymentIntentId)}&limit=1`,
  );
  return rows[0] ?? null;
}

export async function updatePaymentFulfillment(paymentIntentId: string, values: Partial<Omit<PaymentFulfillmentRecord, "payment_intent_id" | "payment_type" | "attempt_count">>) {
  await supabaseRequest<unknown>(`kin_payment_fulfillments?payment_intent_id=eq.${encodeURIComponent(paymentIntentId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
  });
}

export async function recordStripeEvent(eventId: string, eventType: string, objectId: string) {
  await supabaseRequest<unknown>("kin_stripe_events?on_conflict=event_id", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({ event_id: eventId, event_type: eventType, object_id: objectId }),
  });
}

export async function markStripeEvent(eventId: string, status: "processed" | "failed", error?: string) {
  await supabaseRequest<unknown>(`kin_stripe_events?event_id=eq.${encodeURIComponent(eventId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status,
      processed_at: status === "processed" ? new Date().toISOString() : null,
      last_error: error?.slice(0, 500) ?? null,
    }),
  });
}

export async function reserveDiscount(input: DiscountReservationInput) {
  return supabaseRequest<boolean>("rpc/kin_reserve_discount", {
    method: "POST",
    body: JSON.stringify({
      p_payment_intent_id: input.paymentIntentId,
      p_code: input.code,
      p_source_type: input.sourceType,
      p_source_id: input.sourceId,
      p_max_redemptions: input.maxRedemptions,
      p_expires_at: input.expiresAt,
    }),
  });
}

export async function releaseDiscountReservation(paymentIntentId: string) {
  await supabaseRequest<unknown>("rpc/kin_release_discount", {
    method: "POST",
    body: JSON.stringify({ p_payment_intent_id: paymentIntentId }),
  });
}

export async function redeemReservedDiscount(paymentIntentId: string) {
  return supabaseRequest<boolean>("rpc/kin_redeem_discount", {
    method: "POST",
    body: JSON.stringify({ p_payment_intent_id: paymentIntentId }),
  });
}

export async function checkRateLimit(scope: string, keyHash: string, limit: number, windowSeconds: number) {
  return supabaseRequest<boolean>("rpc/kin_check_rate_limit", {
    method: "POST",
    body: JSON.stringify({ p_scope: scope, p_key_hash: keyHash, p_limit: limit, p_window_seconds: windowSeconds }),
  });
}
