"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, type FormEvent } from "react";
import { completeVoucherPayment } from "../../../actions/voucher";
import { formatMoney } from "../../../lib/money";
import { getStripe } from "../../../lib/stripeClient";

function PaymentStep({ clientSecret, amountCents, onComplete, onPaymentMethodChange }: { clientSecret: string; amountCents: number; onComplete: (code: string, email: string) => void; onPaymentMethodChange: (selected: boolean) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [complete, setComplete] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const formattedAmount = formatMoney(amountCents / 100, "USD");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setPending(true); setError("");
    const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (result.error) { setError(result.error.message ?? "Payment failed. Please try again."); setPending(false); return; }
    if (!result.paymentIntent || !["succeeded", "processing"].includes(result.paymentIntent.status)) { setError("Payment did not complete. Please try again."); setPending(false); return; }
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const voucher = await completeVoucherPayment(clientSecret);
      if (voucher.success && voucher.code) { onComplete(voucher.code, result.paymentIntent.receipt_email ?? ""); return; }
      if (!voucher.pending) { setError(voucher.message ?? "We could not send your voucher yet. Please retry."); setPending(false); return; }
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
    setError("Your payment is complete and your voucher is still being finalized. It will be emailed shortly; contact us if it does not arrive.");
    setPending(false);
  };
  return <form onSubmit={submit} className="mt-5"><PaymentElement options={{ wallets: { link: "never" } }} onChange={(event) => setComplete(event.complete)} onFocus={() => onPaymentMethodChange(true)} /><p className="mt-3 text-[12px] leading-[1.6] text-[#515151]">Pay {formattedAmount}. Voucher will be emailed instantly after payment.</p>{error && <p className="commission-field-error mt-3" role="alert">{error}</p>}<button className="button-primary mt-5 min-h-[50px] w-full rounded-full border-0" type="submit" disabled={!stripe || !elements || !complete || pending}>{pending ? "PROCESSING…" : `PAY ${formattedAmount}`}</button><p className="mt-3 text-center text-[12px] leading-[1.6] text-[#515151]">🔒 Safe &amp; secure checkout via Stripe</p></form>;
}

export default function VoucherPaymentForm({ clientSecret, amountCents, onComplete, onPaymentMethodChange }: { clientSecret: string; amountCents: number; onComplete: (code: string, email: string) => void; onPaymentMethodChange: (selected: boolean) => void }) {
  return <Elements stripe={getStripe()} options={{ clientSecret, fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Tenor+Sans&display=swap" }], appearance: { theme: "flat", variables: { colorPrimary: "#263443", colorText: "#263443", colorTextSecondary: "#515151", colorTextPlaceholder: "#77727b", colorIcon: "#263443", colorIconTab: "#263443", colorIconTabSelected: "#263443", colorIconCheckmark: "#263443", colorIconChevronDown: "#263443", fontFamily: "'Montserrat', Arial, sans-serif", borderRadius: "10px" }, rules: { ".Label": { color: "#263443", fontFamily: "'Tenor Sans', Arial, sans-serif" }, ".TabLabel": { color: "#263443", fontFamily: "'Tenor Sans', Arial, sans-serif" }, ".TabIcon": { color: "#263443" }, ".Link": { color: "#263443" }, ".LinkIcon": { color: "#263443" }, ".Input": { color: "#263443", fontFamily: "'Montserrat', Arial, sans-serif" }, ".Text": { color: "#515151", fontFamily: "'Montserrat', Arial, sans-serif" } } } }}><PaymentStep clientSecret={clientSecret} amountCents={amountCents} onComplete={onComplete} onPaymentMethodChange={onPaymentMethodChange} /></Elements>;
}
