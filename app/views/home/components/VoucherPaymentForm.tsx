"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, type FormEvent } from "react";
import { completeVoucherPayment } from "../../../actions/voucher";
import { getStripe } from "../../../lib/stripeClient";

function PaymentStep({ amountCents, onComplete }: { amountCents: number; onComplete: (code: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [complete, setComplete] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setPending(true); setError("");
    const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (result.error) { setError(result.error.message ?? "Payment failed. Please try again."); setPending(false); return; }
    if (result.paymentIntent?.status !== "succeeded") { setError("Payment did not complete. Please try again."); setPending(false); return; }
    const voucher = await completeVoucherPayment(result.paymentIntent.id);
    if (!voucher.success || !voucher.code) { setError(voucher.message ?? "We could not send your voucher yet. Please retry."); setPending(false); return; }
    onComplete(voucher.code);
  };
  return <form onSubmit={submit} className="mt-5"><PaymentElement onChange={(event) => setComplete(event.complete)} /><p className="mt-3 text-[13px] text-[#515151]">You will be charged ${(amountCents / 100).toFixed(2)} AUD.</p>{error && <p className="commission-field-error mt-3" role="alert">{error}</p>}<button className="button-primary mt-5 min-h-[50px] w-full rounded-full border-0" type="submit" disabled={!stripe || !elements || !complete || pending}>{pending ? "Processing…" : `Pay $${(amountCents / 100).toFixed(2)} AUD`}</button></form>;
}

export default function VoucherPaymentForm({ clientSecret, amountCents, onComplete }: { clientSecret: string; amountCents: number; onComplete: (code: string) => void }) {
  return <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: "flat", variables: { colorPrimary: "#00b982", colorText: "#263443", borderRadius: "10px" } } }}><PaymentStep amountCents={amountCents} onComplete={onComplete} /></Elements>;
}
