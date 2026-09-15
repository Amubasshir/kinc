"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
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
      <div className="commission-checkout-brand"><Image unoptimized className="commission-checkout-brand-mark" src="/favicon.svg" alt="" width={20} height={20} /><span>KinCollage sandbox</span><span className="commission-checkout-sandbox">Sandbox</span></div>
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
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [addressComplete, setAddressComplete] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [shippingName, setShippingName] = useState("");
  const [shippingCountry, setShippingCountry] = useState("AU");
  const [shippingLine1, setShippingLine1] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("AU");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [priorityDate, setPriorityDate] = useState("");
  const [shippingCents, setShippingCents] = useState(0);
  const [currentAmountCents, setCurrentAmountCents] = useState(amountCents);
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });

  const updateShippingAddress = (name: string, country: string, line1: string, phone: string, phoneCode = phoneCountryCode) => {
    setShippingName(name);
    setShippingCountry(country);
    setShippingLine1(line1);
    setShippingPhone(phone);
    setPhoneCountryCode(phoneCode);
    const dialCode = { AU: "+61", US: "+1", CA: "+1", NZ: "+64" }[phoneCode] ?? "+61";
    setCustomerAddress(JSON.stringify({ name, phone: phone.trim() ? `${dialCode} ${phone.trim()}` : "", address: { line1, country } }));
    setAddressComplete(Boolean(name.trim() && country && line1.trim()));
  };

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
      const details = await savePaymentCustomerDetails(paidPaymentIntentId, customerEmail, customerAddress, customerName);
      if (!details.success) { setError(details.message ?? "We could not save your contact details. Please try again."); setIsPaying(false); return; }
      const completion = await completeCommissionOrder(paidPaymentIntentId);
      if (completion.success) { onSuccess(paidPaymentIntentId); return; }
      setError(completion.message ?? "The order confirmation could not be completed. Please try again.");
      setIsPaying(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: billingSameAsShipping ? shippingName : customerName,
            email: customerEmail,
            phone: billingSameAsShipping ? customerAddress ? JSON.parse(customerAddress).phone : undefined : undefined,
            ...(billingSameAsShipping ? { address: { line1: shippingLine1, country: shippingCountry } } : {}),
          },
        },
      },
      redirect: "if_required",
    });
    if (confirmError) { setError(confirmError.message ?? "Payment failed. Please check your card details and try again."); setIsPaying(false); return; }
    if (paymentIntent?.status === "succeeded") {
      setPaidPaymentIntentId(paymentIntent.id);
      const details = await savePaymentCustomerDetails(paymentIntent.id, customerEmail, customerAddress, customerName);
      if (!details.success) { setError(details.message ?? "We could not save your contact details. Please try again."); setIsPaying(false); return; }
      const completion = await completeCommissionOrder(paymentIntent.id);
      if (!completion.success) { setError(completion.message ?? "Your payment succeeded, but the order confirmation could not be completed. Please try again."); setIsPaying(false); return; }
      onSuccess(paymentIntent.id);
    } else { setError("Payment did not complete. Please try again."); setIsPaying(false); }
  };

  return (
    <form className="commission-payment-form" onSubmit={handlePay}>
      <div className="commission-stripe-section commission-contact-section"><span className="commission-stripe-section-title">Contact details</span><div className="commission-contact-fields"><label className="commission-contact-row"><svg aria-hidden="true" viewBox="0 0 16 16"><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="m3 5 5 3.5L13 5" /></svg><span className="commission-visually-hidden">Email</span><input type="email" autoComplete="email" placeholder="Email" value={customerEmail} onChange={(event) => { setCustomerEmail(event.target.value); setEmailComplete(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value)); }} required /></label><label className="commission-contact-row"><svg aria-hidden="true" viewBox="0 0 16 16"><circle cx="8" cy="5" r="2.5" /><path d="M3 13c.4-2.2 2.2-3.5 5-3.5s4.6 1.3 5 3.5" /></svg><span className="commission-visually-hidden">Full name</span><input type="text" autoComplete="name" placeholder="Full name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required /></label></div></div>
      <label className="commission-stripe-date-field"><span className="commission-stripe-date-label">Priority order request date <em>(Optional)</em></span><input aria-label="Priority Date (30% rush fee applies)" type="date" value={priorityDate} onChange={(event) => changeOptions({ priorityDate: event.target.value, shippingCents })} /><small>Priority Date (30% rush fee applies)</small></label>
      <div className="commission-stripe-section commission-address-section"><span className="commission-stripe-section-title">Shipping address</span><div className="commission-address-fields">
        <label className="commission-address-row"><span className="commission-visually-hidden">Full name</span><input type="text" autoComplete="shipping name" placeholder="Full name" value={shippingName} onChange={(event) => updateShippingAddress(event.target.value, shippingCountry, shippingLine1, shippingPhone)} required /></label>
        <label className="commission-address-row commission-address-country"><span className="commission-visually-hidden">Country or region</span><select autoComplete="shipping country-name" aria-label="Country or region" value={shippingCountry} onChange={(event) => updateShippingAddress(shippingName, event.target.value, shippingLine1, shippingPhone)}><option value="AU">Australia</option><option value="BD">Bangladesh</option><option value="US">United States</option><option value="CA">Canada</option><option value="NZ">New Zealand</option></select><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m3.5 6 4.5 4 4.5-4" /></svg></label>
        <label className="commission-address-row"><span className="commission-visually-hidden">Address</span><input type="text" autoComplete="shipping address-line1" placeholder="Address" value={shippingLine1} onChange={(event) => updateShippingAddress(shippingName, shippingCountry, event.target.value, shippingPhone)} required /></label>
        <div className="commission-address-row commission-address-phone"><label className="commission-phone-code"><span className="commission-visually-hidden">Phone country code</span><select aria-label="Phone country code" value={phoneCountryCode} onChange={(event) => updateShippingAddress(shippingName, shippingCountry, shippingLine1, shippingPhone, event.target.value)}><option value="AU">🇦🇺 +61</option><option value="US">🇺🇸 +1</option><option value="CA">🇨🇦 +1</option><option value="NZ">🇳🇿 +64</option></select><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" /></svg></label><label className="commission-phone-number"><span className="commission-visually-hidden">Phone number (optional)</span><input type="tel" autoComplete="shipping tel-national" placeholder="Phone number" value={shippingPhone} onChange={(event) => updateShippingAddress(shippingName, shippingCountry, shippingLine1, event.target.value)} /></label></div>
      </div></div>
      <fieldset className="commission-stripe-shipping-field"><legend>Shipping method</legend><div className="commission-shipping-options">
        <label><input type="radio" name="stripeShippingCents" checked={shippingCents === 0} onChange={() => changeOptions({ priorityDate, shippingCents: 0 })} /><span>Pick up from Sydney studio</span><strong>Free</strong></label>
        <label><input type="radio" name="stripeShippingCents" checked={shippingCents === 2500} onChange={() => changeOptions({ priorityDate, shippingCents: 2500 })} /><span>{sizeLabel} Shipping (Australia)<small>3–5 business days</small></span><strong>US$25.00</strong></label>
        <label><input type="radio" name="stripeShippingCents" checked={shippingCents === 3500} onChange={() => changeOptions({ priorityDate, shippingCents: 3500 })} /><span>{sizeLabel} Shipping (US &amp; Canada)<small>3–5 business days</small></span><strong>US$35.00</strong></label>
      </div></fieldset>
      <div className="commission-stripe-section commission-payment-section"><span className="commission-stripe-section-title">Payment method</span><PaymentElement onChange={(event) => setIsPaymentComplete(event.complete)} options={{ layout: "accordion", fields: { billingDetails: { address: "never", email: "never", name: "never", phone: "never" } }, defaultValues: { billingDetails: { email: customerEmail } } }} /><label className="commission-billing-same"><input type="checkbox" checked={billingSameAsShipping} onChange={(event) => setBillingSameAsShipping(event.target.checked)} /><span>Billing info same as shipping</span></label></div>
      <label className="commission-checkout-terms"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} required /><span>I agree to KinCollage sandbox&apos;s <a href="/legal#terms" target="_blank" rel="noreferrer">Terms of Service</a> and <a href="/legal#privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</span></label>
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
