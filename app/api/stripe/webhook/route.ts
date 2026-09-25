import type Stripe from "stripe";
import { fulfillPaymentIntent } from "../../../lib/paymentFulfillment";
import { markStripeEvent, recordStripeEvent, releaseDiscountReservation } from "../../../lib/supabaseAdmin";
import { getKinPaymentType, getStripeServer, getStripeWebhookSecret } from "../../../lib/stripeServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function eventObjectId(event: Stripe.Event) {
  const object = event.data.object as { id?: string };
  return typeof object.id === "string" ? object.id : "unknown";
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing Stripe signature." }, { status: 400 });

  let stripe: ReturnType<typeof getStripeServer>;
  let webhookSecret: string;
  try {
    stripe = getStripeServer();
    webhookSecret = getStripeWebhookSecret();
  } catch (error) {
    console.error("Stripe webhook is not configured:", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Webhook is not configured." }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const handledEvents = new Set([
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
  ]);
  if (!handledEvents.has(event.type)) return Response.json({ received: true });

  const objectId = eventObjectId(event);
  try {
    await recordStripeEvent(event.id, event.type, objectId);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = await stripe.paymentIntents.retrieve(objectId);
      if (getKinPaymentType(paymentIntent)) {
        const result = await fulfillPaymentIntent(paymentIntent);
        if (result.status === "processing") throw new Error("Payment fulfillment is already being processed; retry this event.");
      }
    } else if (event.type === "payment_intent.canceled") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (getKinPaymentType(paymentIntent) === "commission") await releaseDiscountReservation(paymentIntent.id);
    }

    await markStripeEvent(event.id, "processed");
    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook processing error";
    console.error("Stripe webhook processing failed:", { eventId: event.id, type: event.type, objectId, message });
    await markStripeEvent(event.id, "failed", message).catch((recordError) => {
      console.error("Could not record Stripe webhook failure:", event.id, recordError);
    });
    return Response.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
