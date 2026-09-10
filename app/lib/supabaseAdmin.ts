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

export type VoucherRecord = CouponRecord & { amount_cents: number; currency: string; payment_intent_id: string };

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
    body: JSON.stringify({ email, code, amount_cents: amountCents, currency: "aud", payment_intent_id: paymentIntentId }),
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
