"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { FormEvent } from "react";
import { useState } from "react";
import { completeCommissionOrder } from "../../actions/commissionDeposit";
import { getStripe } from "../../lib/stripeClient";

function PayButton({ depositCents, currency, onSuccess }: { depositCents: number; currency: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidPaymentIntentId, setPaidPaymentIntentId] = useState<string | null>(null);
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });

  const handlePay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsPaying(true);
    setError(null);

    if (paidPaymentIntentId) {
      const completion = await completeCommissionOrder(paidPaymentIntentId);
      if (completion.success) {
        onSuccess();
        return;
      }
      setError(completion.message ?? "The order confirmation could not be completed. Please try again.");
      setIsPaying(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please check your card details and try again.");
      setIsPaying(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      setPaidPaymentIntentId(paymentIntent.id);
      const completion = await completeCommissionOrder(paymentIntent.id);
      if (!completion.success) {
        setError(completion.message ?? "Your payment succeeded, but the order confirmation could not be completed. Please try again.");
        setIsPaying(false);
        return;
      }
      onSuccess();
    } else {
      setError("Payment did not complete. Please try again.");
      setIsPaying(false);
    }
  };

  return (
    <form className="commission-payment-form mt-6" onSubmit={handlePay}>
      <PaymentElement />
      {error && <p className="commission-field-error mt-3" role="alert">{error}</p>}
      <button className="commission-order-submit mt-6" type="submit" disabled={!stripe || isPaying}>
        {isPaying ? "Processing…" : paidPaymentIntentId ? "Retry order confirmation" : `Pay deposit — ${money.format(depositCents / 100)}`}
      </button>
    </form>
  );
}

export default function DepositPaymentForm({
  clientSecret,
  depositCents,
  totalCents,
  currency,
  onSuccess,
}: {
  clientSecret: string;
  depositCents: number;
  totalCents: number;
  currency: string;
  onSuccess: () => void;
}) {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });
  return (
    <div className="commission-payment mt-8 rounded-[18px] border border-[#e6e6eb] bg-white p-6 max-[700px]:p-5">
      <h3 className="text-[20px]">Secure your studio slot</h3>
      <p className="mt-2 text-[14px] text-[#515151]">
        Estimated total {money.format(totalCents / 100)} — 50% deposit due now:{" "}
        <strong>{money.format(depositCents / 100)}</strong>. The remaining balance is due upon completion.
      </p>
      <Elements
        stripe={getStripe()}
        options={{
          clientSecret,
          fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap" }],
          appearance: {
            theme: "flat",
            variables: {
              colorPrimary: "#00b982",
              colorText: "#263443",
              colorDanger: "#ad3127",
              fontFamily: "'Tenor Sans', Arial, sans-serif",
              borderRadius: "10px",
              spacingUnit: "4px",
            },
            rules: {
              ".Input": { border: "2px solid #aaaab5", padding: "10px 14px" },
              ".Input:focus": { border: "2px solid #00b982", boxShadow: "0 0 0 3px rgb(0 209 143 / 17%)" },
              ".Label": { fontSize: "13px", textTransform: "uppercase", color: "#565661" },
            },
          },
        }}
      >
        <PayButton depositCents={depositCents} currency={currency} onSuccess={onSuccess} />
      </Elements>
    </div>
  );
}
