"use client";

import { AddressElement, Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { applyCommissionVoucher, completeCommissionOrder, savePaymentCustomerDetails, updateCommissionPaymentOptions } from "../../actions/commissionDeposit";
import { getStripe } from "../../lib/stripeClient";

export type CheckoutItem = {
  name: string;
  dimensions: string;
  inchDimensions?: string;
  image: string;
  amountCents: number;
  currency: string;
};

type PaymentOptions = {
  priorityDate: string;
  shippingCents: number;
};

function CheckoutSummary({ items, amountCents, totalCents, currency, paymentPlan, options, discountCents, voucherCode, voucherMessage, isApplyingVoucher, onApplyVoucher }: { items: CheckoutItem[]; amountCents: number; totalCents: number; currency: string; paymentPlan: "full" | "installments"; options: PaymentOptions; discountCents: number; voucherCode: string; voucherMessage: { type: "success" | "error"; text: string } | null; isApplyingVoucher: boolean; onApplyVoucher: (code: string) => Promise<void> }) {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });
  const itemTotalCents = items.reduce((sum, item) => sum + item.amountCents, 0);
  const baseTotalCents = paymentPlan === "installments" ? itemTotalCents * 3 : itemTotalCents;
  const shippingLabel = options.shippingCents === 0 ? "Pick up from Sydney studio" : options.shippingCents === 2500 ? "Shipping (Australia)" : "Shipping (US & Canada)";
  const rushCents = options.priorityDate ? Math.round(baseTotalCents * 0.3) : 0;
  const [draftVoucherCode, setDraftVoucherCode] = useState(voucherCode);

  useEffect(() => setDraftVoucherCode(voucherCode), [voucherCode]);

  return (
    <aside className="commission-checkout-summary">
      <div className="commission-checkout-brand"><span className="commission-checkout-brand-mark">K</span><span>KinCollage sandbox</span><span className="commission-checkout-sandbox">Sandbox</span></div>
      <p className="commission-checkout-kicker">Pay KinCollage sandbox</p>
      <p className="commission-checkout-amount">{money.format(amountCents / 100)}</p>
      <div className="commission-checkout-items">
        {items.map((item) => <div className="commission-checkout-item" key={`${item.name}-${item.amountCents}`}><Image src={item.image} alt="" width={40} height={40} /><div><strong>{item.name} {item.inchDimensions} ({item.dimensions})</strong><small>Standard pieces are crafted on canvas with oak frame. For custom sizes, sizes or special requests, contact us.</small><span>Qty 1</span></div><b>{money.format(item.amountCents / 100)}</b></div>)}
      </div>
      <form className="commission-checkout-promo" onSubmit={(event) => { event.preventDefault(); void onApplyVoucher(draftVoucherCode); }}>
        <label htmlFor="commission-voucher-code">Coupon or voucher code</label>
        <div><input id="commission-voucher-code" value={draftVoucherCode} onChange={(event) => setDraftVoucherCode(event.target.value)} placeholder="Enter code" autoComplete="off" /><button type="submit" disabled={isApplyingVoucher}>{isApplyingVoucher ? "Applying…" : voucherCode ? "Update" : "Apply"}</button></div>
        {voucherMessage && <p className={`commission-voucher-message ${voucherMessage.type}`} role={voucherMessage.type === "error" ? "alert" : "status"}>{voucherMessage.text}</p>}
      </form>
      <dl className="commission-checkout-totals"><div><dt>Subtotal</dt><dd>{money.format(itemTotalCents / 100)}</dd></div><div><dt>Shipping<br /><small>{shippingLabel}</small></dt><dd>{options.shippingCents ? money.format(options.shippingCents / 100) : "Free"}</dd></div>{rushCents > 0 && <div><dt>Priority rush fee</dt><dd>{money.format(rushCents / 100)}</dd></div>}{discountCents > 0 && <div className="commission-checkout-discount"><dt>Voucher discount</dt><dd>−{money.format(discountCents / 100)}</dd></div>}<div className="commission-checkout-total"><dt>Total due</dt><dd>{money.format(amountCents / 100)}</dd></div></dl>
    </aside>
  );
}

function PayButton({ amountCents, currency, paymentLabel, paymentIntentId, sizeLabel, onSuccess, onOptionsChange }: { amountCents: number; currency: string; paymentLabel: string; paymentIntentId: string; sizeLabel: string; onSuccess: (paymentIntentId: string) => void; onOptionsChange: (options: PaymentOptions) => { amountCents: number; totalCents: number } }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidPaymentIntentId, setPaidPaymentIntentId] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailComplete, setEmailComplete] = useState(false);
  const [customerAddress, setCustomerAddress] = useState("");
  const [addressComplete, setAddressComplete] = useState(false);
  const [priorityDate, setPriorityDate] = useState("");
  const [shippingCents, setShippingCents] = useState(0);
  const [currentAmountCents, setCurrentAmountCents] = useState(amountCents);
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });

  useEffect(() => setCurrentAmountCents(amountCents), [amountCents]);

  const changeOptions = (next: PaymentOptions) => {
    setPriorityDate(next.priorityDate);
    setShippingCents(next.shippingCents);
    const totals = onOptionsChange(next);
    setCurrentAmountCents(totals.amountCents);
  };

  const handlePay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsPaying(true);
    setError(null);

    const updated = await updateCommissionPaymentOptions(paymentIntentId, priorityDate, shippingCents);
    if (!updated.success || updated.amountCents === undefined) {
      setError(updated.message ?? "We could not update the payment total. Please try again.");
      setIsPaying(false);
      return;
    }
    setCurrentAmountCents(updated.amountCents);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Please complete your email, address, and payment details.");
      setIsPaying(false);
      return;
    }

    if (paidPaymentIntentId) {
      const details = await savePaymentCustomerDetails(paidPaymentIntentId, customerEmail, customerAddress);
      if (!details.success) { setError(details.message ?? "We could not save your contact details. Please try again."); setIsPaying(false); return; }
      const completion = await completeCommissionOrder(paidPaymentIntentId);
      if (completion.success) { onSuccess(paidPaymentIntentId); return; }
      setError(completion.message ?? "The order confirmation could not be completed. Please try again.");
      setIsPaying(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (confirmError) { setError(confirmError.message ?? "Payment failed. Please check your card details and try again."); setIsPaying(false); return; }
    if (paymentIntent?.status === "succeeded") {
      setPaidPaymentIntentId(paymentIntent.id);
      const details = await savePaymentCustomerDetails(paymentIntent.id, customerEmail, customerAddress);
      if (!details.success) { setError(details.message ?? "We could not save your contact details. Please try again."); setIsPaying(false); return; }
      const completion = await completeCommissionOrder(paymentIntent.id);
      if (!completion.success) { setError(completion.message ?? "Your payment succeeded, but the order confirmation could not be completed. Please try again."); setIsPaying(false); return; }
      onSuccess(paymentIntent.id);
    } else { setError("Payment did not complete. Please try again."); setIsPaying(false); }
  };

  return (
    <form className="commission-payment-form" onSubmit={handlePay}>
      <label className="commission-stripe-date-field"><span className="commission-stripe-date-label">Priority order request date <em>(Optional)</em></span><small>Priority Date (30% rush fee applies)</small><input type="date" value={priorityDate} onChange={(event) => changeOptions({ priorityDate: event.target.value, shippingCents })} /></label>
      <fieldset className="commission-stripe-shipping-field"><legend>Shipping method</legend><div className="commission-shipping-options">
        <label><input type="radio" name="stripeShippingCents" checked={shippingCents === 0} onChange={() => changeOptions({ priorityDate, shippingCents: 0 })} /><span>Pick up from Sydney studio</span><strong>Free</strong></label>
        <label><input type="radio" name="stripeShippingCents" checked={shippingCents === 2500} onChange={() => changeOptions({ priorityDate, shippingCents: 2500 })} /><span>{sizeLabel} Shipping (Australia)<small>3–5 business days</small></span><strong>US$25.00</strong></label>
        <label><input type="radio" name="stripeShippingCents" checked={shippingCents === 3500} onChange={() => changeOptions({ priorityDate, shippingCents: 3500 })} /><span>{sizeLabel} Shipping (US &amp; Canada)<small>3–5 business days</small></span><strong>US$35.00</strong></label>
      </div></fieldset>
      <div className="commission-stripe-section"><span className="commission-stripe-section-title">Contact details</span><LinkAuthenticationElement onChange={(event) => { setCustomerEmail(event.value.email); setEmailComplete(event.complete); }} options={{ defaultValues: { email: "" } }} /></div>
      <div className="commission-stripe-section"><span className="commission-stripe-section-title">Shipping address</span><AddressElement onChange={(event) => { setCustomerAddress(JSON.stringify(event.value)); setAddressComplete(event.complete); }} options={{ mode: "shipping", fields: { phone: "always" }, allowedCountries: ["AU", "BD", "US", "CA", "NZ"] }} /></div>
      <div className="commission-stripe-section"><span className="commission-stripe-section-title">Payment method</span><PaymentElement onChange={(event) => setIsPaymentComplete(event.complete)} /></div>
      {error && <p className="commission-field-error mt-3" role="alert">{error}</p>}
      <button className="button-primary commission-order-submit mt-6" type="submit" disabled={!stripe || !elements || !isPaymentComplete || !emailComplete || !addressComplete || isPaying}>{isPaying ? "Processing…" : paidPaymentIntentId ? "Retry order confirmation" : `${paymentLabel} — ${money.format(currentAmountCents / 100)}`}</button>
      <p className="commission-checkout-legal">By paying, you agree to KinCollage&apos;s Terms of Service and Privacy Policy.</p>
    </form>
  );
}

export default function DepositPaymentForm({ clientSecret, amountCents, totalCents, currency, paymentPlan, sizeLabel, items, onSuccess }: { clientSecret: string; amountCents: number; totalCents: number; currency: string; paymentPlan: "full" | "installments"; sizeLabel: string; items: CheckoutItem[]; onSuccess: (paymentIntentId: string) => void }) {
  const [options, setOptions] = useState<PaymentOptions>({ priorityDate: "", shippingCents: 0 });
  const [displayAmountCents, setDisplayAmountCents] = useState(amountCents);
  const [displayTotalCents, setDisplayTotalCents] = useState(totalCents);
  const [discountCents, setDiscountCents] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const paymentIntentId = clientSecret.split("_secret")[0];
  const handleOptionsChange = (next: PaymentOptions) => {
    const baseAmount = items.reduce((sum, item) => sum + item.amountCents, 0);
    const baseTotal = paymentPlan === "installments" ? baseAmount * 3 : baseAmount;
    const rush = next.priorityDate ? Math.round(baseTotal * 0.3) : 0;
    const appliedDiscount = Math.min(discountCents, baseTotal + rush);
    const currentPaymentDiscount = paymentPlan === "installments" ? Math.floor(appliedDiscount / 3) : appliedDiscount;
    const amount = (paymentPlan === "installments" ? baseAmount + Math.round(rush / 3) : baseAmount + rush) - currentPaymentDiscount + next.shippingCents;
    setOptions(next);
    setDisplayAmountCents(amount);
    setDisplayTotalCents(baseTotal + rush - appliedDiscount + next.shippingCents);
    return { amountCents: amount, totalCents: baseTotal + rush - appliedDiscount + next.shippingCents };
  };
  const handleApplyVoucher = async (code: string) => {
    setIsApplyingVoucher(true);
    setVoucherMessage(null);
    const result = await applyCommissionVoucher(paymentIntentId, code, options.priorityDate, options.shippingCents);
    if (!result.success || result.amountCents === undefined || result.totalCents === undefined) {
      setVoucherMessage({ type: "error", text: result.message ?? "We could not apply that coupon or voucher." });
      setIsApplyingVoucher(false);
      return;
    }
    setVoucherCode(result.code ?? "");
    setDiscountCents(result.discountCents ?? 0);
    setDisplayAmountCents(result.amountCents);
    setDisplayTotalCents(result.totalCents);
    setVoucherMessage({ type: "success", text: result.code ? `Applied ${result.code}.` : "Voucher removed." });
    setIsApplyingVoucher(false);
  };
  return (
    <div className="commission-checkout-shell">
      <CheckoutSummary items={items} amountCents={displayAmountCents} totalCents={displayTotalCents} currency={currency} paymentPlan={paymentPlan} options={options} discountCents={discountCents} voucherCode={voucherCode} voucherMessage={voucherMessage} isApplyingVoucher={isApplyingVoucher} onApplyVoucher={handleApplyVoucher} />
      <section className="commission-checkout-form-panel">
        <h3>Shipping information</h3>
        <Elements stripe={getStripe()} options={{ clientSecret, fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap" }], appearance: { theme: "flat", variables: { colorPrimary: "#00b982", colorText: "#263443", colorDanger: "#ad3127", fontFamily: "'Tenor Sans', Arial, sans-serif", fontSizeBase: "14px", fontSizeSm: "13px", borderRadius: "8px", spacingUnit: "2px" }, rules: { ".Input": { border: "1px solid #d6d6dc", borderRadius: "7px", backgroundColor: "#fff", padding: "9px 12px", boxShadow: "0 1px 3px rgb(38 52 67 / 10%)", fontSize: "14px" }, ".Input:focus": { border: "2px solid #00b982", boxShadow: "0 0 0 3px rgb(0 209 143 / 17%)" }, ".Label": { fontSize: "13px", textTransform: "none", color: "#565661" } } } }}>
          <PayButton amountCents={displayAmountCents} currency={currency} paymentLabel={paymentPlan === "installments" ? "Pay installment" : "Pay in full"} paymentIntentId={paymentIntentId} sizeLabel={sizeLabel} onOptionsChange={handleOptionsChange} onSuccess={onSuccess} />
        </Elements>
      </section>
    </div>
  );
}
