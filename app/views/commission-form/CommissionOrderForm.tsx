"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createCommissionDeposit, createCommissionPayment, type CommissionDepositState, type CommissionPaymentState } from "../../actions/commissionDeposit";
import type { StripeCommissionProduct } from "../../lib/stripePricing";
import DepositPaymentForm, { type CheckoutItem } from "./DepositPaymentForm";
import ModernDatePicker from "./ModernDatePicker";

const initialState: CommissionPaymentState = { status: "idle" };
const initialQuoteState: CommissionDepositState = { status: "idle" };

export default function CommissionOrderForm({ commissionProducts, requestedProductId }: { commissionProducts: StripeCommissionProduct[]; requestedAddOnId?: string; requestedProductId?: string }) {
  const router = useRouter();
  const requestedSize = commissionProducts.find((item) => item.productId === requestedProductId);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(requestedSize ? [requestedSize.productId] : []);
  const [otherSize, setOtherSize] = useState(false);
  const [priorityDate, setPriorityDate] = useState("");
  const [paymentPlan, setPaymentPlan] = useState<"full" | "installments">("full");
  const [paymentState, formAction, isCreatingPayment] = useActionState(createCommissionPayment, initialState);
  const [quoteState, quoteFormAction, isSendingQuote] = useActionState(createCommissionDeposit, initialQuoteState);
  const [submittedSelectionKey, setSubmittedSelectionKey] = useState("");
  const [submittedProducts, setSubmittedProducts] = useState<string[]>([]);
  const selectionEditedAfterSubmit = useRef(false);
  const preserveSelectionOnReset = useRef(false);
  const formatPrice = (amount: number, currency: string) => `${currency.toUpperCase()}$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount / 100)}`;
  const selectionKey = `${paymentPlan}:${[...selectedProducts].sort().join(",")}`;
  const hasCurrentPayment = paymentState.status === "ready" && !isCreatingPayment && submittedSelectionKey === selectionKey;
  const submittedSizeLabel = commissionProducts.filter((size) => submittedProducts.includes(size.productId)).map((size) => size.name).join(" + ") || "Selected size";
  const submittedCheckoutItems: CheckoutItem[] = commissionProducts.filter((size) => submittedProducts.includes(size.productId)).map((size) => ({ name: size.name, dimensions: size.dimensions, inchDimensions: size.inchDimensions, image: size.image, amountCents: paymentPlan === "installments" ? size.installmentUnitAmount : size.unitAmount, currency: size.currency }));

  useEffect(() => {
    if (paymentState.status !== "ready") return;
    if (!selectionEditedAfterSubmit.current && selectedProducts.length === 0 && submittedProducts.length > 0) {
      setSelectedProducts(submittedProducts);
    }
    document.getElementById("commission-payment")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [paymentState.status, selectedProducts.length, submittedProducts]);

  useEffect(() => {
    if (quoteState.status === "quote-only") router.push("/thank-you?type=quote");
  }, [quoteState.status, router]);

  return (
    <>
      <form className="commission-order-form commission-design-only-form" action={otherSize ? quoteFormAction : formAction} onSubmit={() => { if (!otherSize) { selectionEditedAfterSubmit.current = false; preserveSelectionOnReset.current = true; setSubmittedProducts(selectedProducts); setSubmittedSelectionKey(selectionKey); } }} onReset={(event) => { if (preserveSelectionOnReset.current) event.preventDefault(); }}>
        <fieldset>
          <legend>WHICH SIZE(S) ARE YOU ORDERING?<span>*</span></legend>
          <small>Note: Prices below reflect design curation, materials, frame and collage work on canvas.</small>
          <div className="commission-options" id="commission-size-options" tabIndex={-1}>
            {commissionProducts.map((size) => {
              const priceId = paymentPlan === "installments" ? size.installmentPriceId : size.priceId;
              const amount = paymentPlan === "installments" ? size.installmentUnitAmount : size.unitAmount;
              return <label key={size.productId}><input type="checkbox" name="sizes" value={priceId} checked={selectedProducts.includes(size.productId)} onChange={(event) => { if (event.nativeEvent.isTrusted) { selectionEditedAfterSubmit.current = true; setSubmittedSelectionKey(""); } setSelectedProducts((current) => current.includes(size.productId) ? current.filter((item) => item !== size.productId) : [...current, size.productId]); }} /><span>{size.name} {size.inchDimensions} ({size.dimensions}) — {formatPrice(amount, size.currency)} USD + shipping</span></label>;
            })}
            <label><input type="checkbox" name="sizes" value="other" checked={otherSize} onChange={(event) => { const checked = event.target.checked; if (event.nativeEvent.isTrusted) { selectionEditedAfterSubmit.current = true; setSubmittedSelectionKey(""); } setOtherSize(checked); if (checked) setSelectedProducts([]); }} /><span>Other</span></label>
          </div>
          {otherSize && <div className="commission-custom-size-fields">
            <div className="commission-custom-size-intro">
              <h3>SHARE YOUR DETAILS</h3>
              <p>Since you&apos;ve selected a custom size, please tell us a little about your project below. We&apos;ll review your details and send a personalised quote and timeline straight to your inbox within 24–48 hours.</p>
            </div>
            <label className="commission-field">CUSTOM SIZE OR REQUEST<input name="otherSize" required placeholder="I need a size 60x75cm" /></label>
            <div className="commission-two-columns">
              <label className="commission-field">FIRST NAME <span>*</span><input name="firstName" required placeholder="Sammy" /></label>
              <label className="commission-field">LAST NAME <span>*</span><input name="lastName" required placeholder="Gordon" /></label>
            </div>
            <label className="commission-field">EMAIL <span>*</span><input name="email" type="email" required placeholder="youremail@email.com" /></label>
            <label className="commission-field">ADDRESS <span>*</span><small>Used for delivery from Sydney, Australia.</small><input name="address" required /></label>
            <label className="commission-field">PRIORITY ORDER REQUEST<small>If you require your piece by a specific date, a 30% rush fee guarantees your chosen completion date. Please enter if applicable.</small><ModernDatePicker name="priorityDate" value={priorityDate} onChange={setPriorityDate} /></label>
            <label className="commission-field">COUPON OR VOUCHER CODE<input name="coupon" /></label>
            <label className="commission-field">PROJECT DETAILS <span>*</span><textarea name="story" required placeholder="Tell us about your project or question..." /></label>
          </div>}
        </fieldset>

        {!otherSize && <fieldset className="commission-payment-plan">
          <legend>WOULD YOU LIKE TO PAY IN FULL OR IN INSTALLMENTS?<span>*</span></legend>
          <div className="commission-options">
            <label><input type="radio" name="paymentPlan" value="full" checked={paymentPlan === "full"} onChange={() => { setSubmittedSelectionKey(""); setPaymentPlan("full"); }} /><span>Pay in full upfront <em>(Best value, save 15%)</em></span></label>
            <label><input type="radio" name="paymentPlan" value="installments" checked={paymentPlan === "installments"} onChange={() => { setSubmittedSelectionKey(""); setPaymentPlan("installments"); }} /><span>3 Fortnightly installments <em>(+15% installment fee; final balance paid prior to dispatch)</em></span></label>
          </div>
        </fieldset>}

        {!hasCurrentPayment && quoteState.status !== "quote-only" && <button className="button-primary commission-order-submit" type="submit" disabled={isCreatingPayment || isSendingQuote || (!otherSize && selectedProducts.length === 0)}>{otherSize ? (isSendingQuote ? "SENDING REQUEST…" : "REQUEST CUSTOM QUOTE") : (isCreatingPayment ? "Preparing payment…" : "Continue to payment")}</button>}
        {paymentState.status === "error" && <p className="commission-field-error" role="alert">{paymentState.message}</p>}
        {quoteState.status === "error" && <p className="commission-field-error" role="alert">{quoteState.message}</p>}
      </form>

      {hasCurrentPayment && <div id="commission-payment"><DepositPaymentForm key={paymentState.clientSecret} clientSecret={paymentState.clientSecret} amountCents={paymentState.amountCents} totalCents={paymentState.totalCents} currency={paymentState.currency} paymentPlan={paymentState.paymentPlan} sizeLabel={submittedSizeLabel} items={submittedCheckoutItems} onSuccess={(paymentIntentId) => router.push(`/thank-you?type=payment&paymentId=${encodeURIComponent(paymentIntentId)}`)} /></div>}
    </>
  );
}
