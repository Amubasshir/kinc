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
  redeemed_at timestamptz,
  redeemed_payment_intent_id text
);

alter table public.kin_vouchers add column if not exists redeemed_payment_intent_id text;

create unique index if not exists kin_vouchers_code_unique on public.kin_vouchers (code);
create unique index if not exists kin_vouchers_payment_intent_unique on public.kin_vouchers (payment_intent_id);
alter table public.kin_vouchers enable row level security;

-- Durable, idempotent Stripe fulfillment. Webhook deliveries and the browser
-- fallback both claim the same PaymentIntent, so only one worker performs the
-- side effects at a time. A short lease allows Stripe retries to recover a
-- worker that stopped midway through fulfillment.
create table if not exists public.kin_payment_fulfillments (
  payment_intent_id text primary key,
  payment_type text not null check (payment_type in ('commission', 'digital_voucher')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'failed', 'completed')),
  attempt_count integer not null default 0,
  processing_until timestamptz,
  customer_email_sent_at timestamptz,
  business_email_sent_at timestamptz,
  voucher_created_at timestamptz,
  discount_redeemed_at timestamptz,
  completed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kin_payment_fulfillments enable row level security;

create or replace function public.kin_claim_payment_fulfillment(
  p_payment_intent_id text,
  p_payment_type text
)
returns setof public.kin_payment_fulfillments
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_payment_type not in ('commission', 'digital_voucher') then
    raise exception 'Invalid payment type';
  end if;

  insert into public.kin_payment_fulfillments (payment_intent_id, payment_type)
  values (p_payment_intent_id, p_payment_type)
  on conflict (payment_intent_id) do nothing;

  return query
  update public.kin_payment_fulfillments as fulfillment
  set status = 'processing',
      attempt_count = fulfillment.attempt_count + 1,
      processing_until = now() + interval '2 minutes',
      last_error = null,
      updated_at = now()
  where fulfillment.payment_intent_id = p_payment_intent_id
    and fulfillment.payment_type = p_payment_type
    and fulfillment.status <> 'completed'
    and (fulfillment.status <> 'processing' or fulfillment.processing_until is null or fulfillment.processing_until < now())
  returning fulfillment.*;
end;
$$;

revoke all on function public.kin_claim_payment_fulfillment(text, text) from public, anon, authenticated;
grant execute on function public.kin_claim_payment_fulfillment(text, text) to service_role;

-- Keep an operational record of verified Stripe events. Fulfillment is keyed
-- by PaymentIntent as well because Stripe can create two Event objects for the
-- same underlying object and event type.
create table if not exists public.kin_stripe_events (
  event_id text primary key,
  event_type text not null,
  object_id text not null,
  status text not null default 'received' check (status in ('received', 'processed', 'failed')),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text
);

create index if not exists kin_stripe_events_object_type_idx on public.kin_stripe_events (object_id, event_type);
alter table public.kin_stripe_events enable row level security;

-- Reserve one-use coupons and vouchers before lowering a PaymentIntent amount.
-- Reservations expire so abandoned checkout tabs do not lock a code forever.
create table if not exists public.kin_discount_reservations (
  id uuid primary key default gen_random_uuid(),
  payment_intent_id text not null unique,
  code text not null,
  source_type text not null check (source_type in ('coupon', 'voucher', 'stripe')),
  source_id text not null,
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  status text not null default 'reserved' check (status in ('reserved', 'redeemed', 'released')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create index if not exists kin_discount_reservations_source_idx on public.kin_discount_reservations (source_type, source_id, status);
alter table public.kin_discount_reservations enable row level security;

create or replace function public.kin_reserve_discount(
  p_payment_intent_id text,
  p_code text,
  p_source_type text,
  p_source_id text,
  p_max_redemptions integer,
  p_expires_at timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_redemptions integer;
  current_reservation public.kin_discount_reservations%rowtype;
begin
  if p_source_type not in ('coupon', 'voucher', 'stripe') or p_expires_at <= now() then
    return false;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_source_type || ':' || p_source_id, 0));

  update public.kin_discount_reservations
  set status = 'released', updated_at = now()
  where status = 'reserved' and expires_at <= now();

  select * into current_reservation
  from public.kin_discount_reservations
  where payment_intent_id = p_payment_intent_id
  for update;

  if found and current_reservation.source_type = p_source_type and current_reservation.source_id = p_source_id then
    if current_reservation.status = 'redeemed' then
      return true;
    end if;
    if current_reservation.status = 'reserved' then
      update public.kin_discount_reservations
      set code = p_code,
          max_redemptions = p_max_redemptions,
          expires_at = p_expires_at,
          updated_at = now()
      where payment_intent_id = p_payment_intent_id;
      return true;
    end if;
  end if;

  if found and current_reservation.status = 'reserved' then
    update public.kin_discount_reservations
    set status = 'released', updated_at = now()
    where payment_intent_id = p_payment_intent_id;
  end if;

  if p_max_redemptions is not null then
    select count(*) into active_redemptions
    from public.kin_discount_reservations
    where source_type = p_source_type
      and source_id = p_source_id
      and (status = 'redeemed' or (status = 'reserved' and expires_at > now()));
    if active_redemptions >= p_max_redemptions then
      return false;
    end if;
  end if;

  insert into public.kin_discount_reservations (
    payment_intent_id, code, source_type, source_id, max_redemptions, status, expires_at, updated_at
  ) values (
    p_payment_intent_id, p_code, p_source_type, p_source_id, p_max_redemptions, 'reserved', p_expires_at, now()
  )
  on conflict (payment_intent_id) do update
  set code = excluded.code,
      source_type = excluded.source_type,
      source_id = excluded.source_id,
      max_redemptions = excluded.max_redemptions,
      status = 'reserved',
      expires_at = excluded.expires_at,
      updated_at = now(),
      redeemed_at = null;

  return true;
end;
$$;

revoke all on function public.kin_reserve_discount(text, text, text, text, integer, timestamptz) from public, anon, authenticated;
grant execute on function public.kin_reserve_discount(text, text, text, text, integer, timestamptz) to service_role;

create or replace function public.kin_release_discount(p_payment_intent_id text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.kin_discount_reservations
  set status = 'released', updated_at = now()
  where payment_intent_id = p_payment_intent_id and status = 'reserved';
$$;

revoke all on function public.kin_release_discount(text) from public, anon, authenticated;
grant execute on function public.kin_release_discount(text) to service_role;

create or replace function public.kin_redeem_discount(p_payment_intent_id text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  reservation public.kin_discount_reservations%rowtype;
  affected_rows integer;
begin
  select * into reservation
  from public.kin_discount_reservations
  where payment_intent_id = p_payment_intent_id
  for update;

  if not found then
    return true;
  end if;
  if reservation.status = 'redeemed' then
    return true;
  end if;
  if reservation.status <> 'reserved' then
    return false;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(reservation.source_type || ':' || reservation.source_id, 0));

  if reservation.source_type = 'coupon' then
    update public.kin_coupons
    set redeemed_at = now(), redeemed_payment_intent_id = p_payment_intent_id
    where id::text = reservation.source_id and redeemed_at is null;
    get diagnostics affected_rows = row_count;
    if affected_rows <> 1 then return false; end if;
  elsif reservation.source_type = 'voucher' then
    update public.kin_vouchers
    set redeemed_at = now(), redeemed_payment_intent_id = p_payment_intent_id
    where id::text = reservation.source_id and redeemed_at is null;
    get diagnostics affected_rows = row_count;
    if affected_rows <> 1 then return false; end if;
  end if;

  update public.kin_discount_reservations
  set status = 'redeemed', redeemed_at = now(), updated_at = now()
  where payment_intent_id = p_payment_intent_id;
  return true;
end;
$$;

revoke all on function public.kin_redeem_discount(text) from public, anon, authenticated;
grant execute on function public.kin_redeem_discount(text) to service_role;

-- Atomic, fixed-window protection for unauthenticated payment creation.
create table if not exists public.kin_rate_limits (
  scope text not null,
  key_hash text not null,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  primary key (scope, key_hash)
);

alter table public.kin_rate_limits enable row level security;

create or replace function public.kin_check_rate_limit(
  p_scope text,
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed boolean;
begin
  if p_limit < 1 or p_window_seconds < 1 then return false; end if;

  insert into public.kin_rate_limits (scope, key_hash, window_started_at, request_count)
  values (p_scope, p_key_hash, now(), 1)
  on conflict (scope, key_hash) do update
  set window_started_at = case
        when public.kin_rate_limits.window_started_at <= now() - pg_catalog.make_interval(secs => p_window_seconds) then now()
        else public.kin_rate_limits.window_started_at
      end,
      request_count = case
        when public.kin_rate_limits.window_started_at <= now() - pg_catalog.make_interval(secs => p_window_seconds) then 1
        else public.kin_rate_limits.request_count + 1
      end
  returning request_count <= p_limit into allowed;

  return allowed;
end;
$$;

revoke all on function public.kin_check_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.kin_check_rate_limit(text, text, integer, integer) to service_role;
