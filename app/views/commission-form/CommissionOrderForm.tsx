"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCommissionPayment, type CommissionPaymentState } from "../../actions/commissionDeposit";
import type { StripeCommissionProduct } from "../../lib/stripePricing";
import DepositPaymentForm, { type CheckoutItem } from "./DepositPaymentForm";

const initialState: CommissionPaymentState = { status: "idle" };

export default function CommissionOrderForm({ commissionProducts, requestedProductId }: { commissionProducts: StripeCommissionProduct[]; requestedAddOnId?: string; requestedProductId?: string }) {
  const router = useRouter();
  const requestedSize = commissionProducts.find((item) => item.productId === requestedProductId);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(requestedSize ? [requestedSize.productId] : []);
  const [otherSize, setOtherSize] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<"full" | "installments">("full");
  const [paymentState, formAction, isCreatingPayment] = useActionState(createCommissionPayment, initialState);
  const formatPrice = (amount: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount / 100);
  const selectedSizeLabel = commissionProducts.filter((size) => selectedProducts.includes(size.productId)).map((size) => size.name).join(" + ") || "Selected size";
  const checkoutItems: CheckoutItem[] = commissionProducts.filter((size) => selectedProducts.includes(size.productId)).map((size) => ({ name: size.name, dimensions: size.dimensions, inchDimensions: size.inchDimensions, image: size.image, amountCents: paymentPlan === "installments" ? size.installmentUnitAmount : size.unitAmount, currency: size.currency }));

  useEffect(() => {
    if (paymentState.status === "ready") document.getElementById("commission-payment")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [paymentState.status]);

  return (
    <>
      <form className="commission-order-form commission-design-only-form" action={formAction}>
        <fieldset>
          <legend>WHICH SIZE(S) ARE YOU ORDERING?<span>*</span></legend>
          <small>Note: Prices below reflect design curation, materials, frame and collage work on canvas.</small>
          <div className="commission-options" id="commission-size-options" tabIndex={-1}>
            {commissionProducts.map((size) => {
              const priceId = paymentPlan === "installments" ? size.installmentPriceId : size.priceId;
              const amount = paymentPlan === "installments" ? size.installmentUnitAmount : size.unitAmount;
              return <label key={size.productId}><input type="checkbox" name="sizes" value={priceId} checked={selectedProducts.includes(size.productId)} onChange={() => setSelectedProducts((current) => current.includes(size.productId) ? current.filter((item) => item !== size.productId) : [...current, size.productId])} /><span>{size.name} {size.inchDimensions} ({size.dimensions}) — {formatPrice(amount, size.currency)} USD + shipping</span></label>;
            })}
            <label><input type="checkbox" name="otherSize" value="other" checked={otherSize} onChange={(event) => setOtherSize(event.target.checked)} /><span>Other</span></label>
          </div>
        </fieldset>

        <fieldset className="commission-payment-plan">
          <legend>WOULD YOU LIKE TO PAY IN FULL OR IN INSTALLMENTS?<span>*</span></legend>
          <div className="commission-options">
            <label><input type="radio" name="paymentPlan" value="full" checked={paymentPlan === "full"} onChange={() => setPaymentPlan("full")} /><span>Pay in full upfront <em>(Best value, save 15%)</em></span></label>
            <label><input type="radio" name="paymentPlan" value="installments" checked={paymentPlan === "installments"} onChange={() => setPaymentPlan("installments")} /><span>3 Fortnightly installments <em>(+15% installment fee; final balance paid prior to dispatch)</em></span></label>
          </div>
        </fieldset>

        {paymentState.status !== "ready" && <button className="button-primary commission-order-submit" type="submit" disabled={selectedProducts.length === 0 || isCreatingPayment}>{isCreatingPayment ? "Preparing payment…" : "Continue to payment"}</button>}
        {paymentState.status === "error" && <p className="commission-field-error" role="alert">{paymentState.message}</p>}
      </form>

      {paymentState.status === "ready" && <div id="commission-payment"><DepositPaymentForm clientSecret={paymentState.clientSecret} amountCents={paymentState.amountCents} totalCents={paymentState.totalCents} currency={paymentState.currency} paymentPlan={paymentState.paymentPlan} sizeLabel={selectedSizeLabel} items={checkoutItems} onSuccess={(paymentIntentId) => router.push(`/thank-you?type=payment&paymentId=${encodeURIComponent(paymentIntentId)}`)} /></div>}
    </>
  );
}
