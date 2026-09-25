This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Payments and gift coupons

Run `supabase/kin_coupons.sql` in the Supabase SQL editor before enabling payments. It creates the coupon/voucher tables plus the fulfillment, webhook-event, discount-reservation, and rate-limit tables/functions used to make payment handling idempotent.

Configure these environment variables in every deployed environment:

```dotenv
STRIPE_SECRET_KEY=sk_test_or_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=orders@example.com
```

Secret, webhook, Supabase service-role, and Resend keys must remain server-side. Stripe secret and publishable keys must both be from the same mode.

In Stripe Workbench, create a webhook endpoint for:

```text
https://YOUR_PRODUCTION_DOMAIN/api/stripe/webhook
```

Subscribe it to `payment_intent.succeeded`, `payment_intent.payment_failed`, and `payment_intent.canceled`, then store that endpoint's signing secret as `STRIPE_WEBHOOK_SECRET`. Test and live endpoints have different signing secrets and must be configured separately.

Run the production-readiness check after configuring an environment:

```bash
npm run audit:stripe
```

The existing “3 installments” catalog prices are one-time Stripe Prices. The application collects installment 1 and explicitly records that installments 2 and 3 are arranged manually by the studio; it does not claim that Stripe schedules them automatically.

Commission shipping amounts are read from active Stripe ShippingRate objects on the server. Create one active rate per supported canvas size and region (the display name must include the configured size dimensions and either “Australia” or “US & Canada”), using the same currency as the commission Prices. Configure equivalent rates in test and live mode; the checkout refuses to use a missing or mismatched rate rather than falling back to a hard-coded amount.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
