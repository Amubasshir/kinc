create table if not exists public.kin_coupons (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  discount_cents integer not null default 5000 check (discount_cents > 0),
  created_at timestamptz not null default now(),
  redeemed_at timestamptz,
  redeemed_payment_intent_id text
);

create unique index if not exists kin_coupons_email_unique on public.kin_coupons (lower(email));
create unique index if not exists kin_coupons_code_unique on public.kin_coupons (code);

alter table public.kin_coupons enable row level security;
-- The service-role key is used only on the server, so no public policies are needed.

create table if not exists public.kin_vouchers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'aud',
  payment_intent_id text not null,
  created_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create unique index if not exists kin_vouchers_code_unique on public.kin_vouchers (code);
create unique index if not exists kin_vouchers_payment_intent_unique on public.kin_vouchers (payment_intent_id);
alter table public.kin_vouchers enable row level security;
