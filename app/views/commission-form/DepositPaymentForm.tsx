"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import { applyCommissionVoucher, completeCommissionOrder, savePaymentCustomerDetails, updateCommissionPaymentOptions, type CommissionShippingRates, type CommissionShippingRegion } from "../../actions/commissionDeposit";
import { formatMoney } from "../../lib/money";
import { getStripe } from "../../lib/stripeClient";
import ModernDatePicker from "./ModernDatePicker";

export type CheckoutItem = {
  name: string;
  dimensions: string;
  inchDimensions?: string;
  image: string;
  amountCents: number;
  currency: string;
};

const IS_TEST_MODE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") ?? false;

type PaymentOptions = {
  priorityDate: string;
  shippingCents: number;
  shippingRegion: CommissionShippingRegion;
};

function CheckoutSummary({ items, amountCents, totalCents, currency, paymentPlan, options, discountCents, voucherCode, voucherMessage, isApplyingVoucher, onApplyVoucher }: { items: CheckoutItem[]; amountCents: number; totalCents: number; currency: string; paymentPlan: "full" | "installments"; options: PaymentOptions; discountCents: number; voucherCode: string; voucherMessage: { type: "success" | "error"; text: string } | null; isApplyingVoucher: boolean; onApplyVoucher: (code: string) => Promise<void> }) {
  const formatPrice = (cents: number) => formatMoney(cents / 100, currency);
  const itemTotalCents = items.reduce((sum, item) => sum + item.amountCents, 0);
  const baseTotalCents = paymentPlan === "installments" ? itemTotalCents * 3 : itemTotalCents;
  const shippingLabel = options.shippingCents === 0 ? "Pick up from Sydney studio" : options.shippingRegion === "australia" ? "Shipping (Australia)" : "Shipping (US & Canada)";
  const rushCents = options.priorityDate ? Math.round(baseTotalCents * 0.3) : 0;
  const [draftVoucherCode, setDraftVoucherCode] = useState(voucherCode);

  return (
    <aside className="commission-checkout-summary">
      <div className="commission-checkout-brand"><Image unoptimized className="commission-checkout-brand-mark" src="/favicon.svg" alt="" width={20} height={20} /><span>KinCollage</span>{IS_TEST_MODE && <span className="commission-checkout-sandbox">Sandbox</span>}</div>
      <p className="commission-checkout-kicker">Pay KinCollage</p>
      <p className="commission-checkout-amount">{formatPrice(amountCents)}</p>
      <div className="commission-checkout-items">
        {items.map((item) => <div className="commission-checkout-item" key={`${item.name}-${item.amountCents}`}><Image src={item.image} alt="" width={40} height={40} /><div><strong>{item.name} {item.inchDimensions} ({item.dimensions})</strong><small>Standard pieces are crafted on canvas with oak frame. For custom sizes, sizes or special requests, contact us.</small><span>Qty 1</span></div><b>{formatPrice(item.amountCents)}</b></div>)}
      </div>
      <form className="commission-checkout-promo" onSubmit={(event) => { event.preventDefault(); void onApplyVoucher(draftVoucherCode); }}>
        <label htmlFor="commission-voucher-code">Coupon, voucher, or Stripe promo code</label>
        <div><input id="commission-voucher-code" value={draftVoucherCode} onChange={(event) => setDraftVoucherCode(event.target.value)} placeholder="Enter code" autoComplete="off" /><button type="submit" disabled={isApplyingVoucher}>{isApplyingVoucher ? "Applying…" : voucherCode ? "Update" : "Apply"}</button></div>
        {voucherMessage && <p className={`commission-voucher-message ${voucherMessage.type}`} role={voucherMessage.type === "error" ? "alert" : "status"}>{voucherMessage.text}</p>}
      </form>
      <dl className="commission-checkout-totals"><div><dt>Subtotal</dt><dd>{formatPrice(itemTotalCents)}</dd></div><div><dt>Shipping<br /><small>{shippingLabel}</small></dt><dd>{options.shippingCents ? formatPrice(options.shippingCents) : "Free"}</dd></div>{rushCents > 0 && <div><dt>Priority rush fee</dt><dd>{formatPrice(rushCents)}</dd></div>}{discountCents > 0 && <div className="commission-checkout-discount"><dt>Discount</dt><dd>−{formatPrice(discountCents)}</dd></div>}{paymentPlan === "installments" && <div><dt>Full order total</dt><dd>{formatPrice(totalCents)}</dd></div>}<div className="commission-checkout-total"><dt>{paymentPlan === "installments" ? "Due today" : "Total due"}</dt><dd>{formatPrice(amountCents)}</dd></div></dl>
    </aside>
  );
}

function PayButton({ amountCents, currency, paymentLabel, clientSecret, sizeLabel, shippingRates, onSuccess, onOptionsChange }: { amountCents: number; currency: string; paymentLabel: string; clientSecret: string; sizeLabel: string; shippingRates: CommissionShippingRates; onSuccess: () => void; onOptionsChange: (options: PaymentOptions) => { amountCents: number; totalCents: number } }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailComplete, setEmailComplete] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [addressComplete, setAddressComplete] = useState(false);
  const [shippingName, setShippingName] = useState("");
  const [shippingCountry, setShippingCountry] = useState("AU");
  const [shippingLine1, setShippingLine1] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("AU");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [priorityDate, setPriorityDate] = useState("");
  const [shippingRegion, setShippingRegion] = useState<CommissionShippingRegion>("australia");
  const [shippingCents, setShippingCents] = useState(0);
  const formatPrice = (cents: number) => formatMoney(cents / 100, currency);

  const updateShippingAddress = (changes: Partial<{ name: string; country: string; line1: string; city: string; state: string; phone: string; phoneCode: string; postalCode: string }>) => {
    const name = changes.name ?? shippingName;
    const country = changes.country ?? shippingCountry;
    const line1 = changes.line1 ?? shippingLine1;
    const city = changes.city ?? shippingCity;
    const state = changes.state ?? shippingState;
    const phone = changes.phone ?? shippingPhone;
    const phoneCode = changes.phoneCode ?? phoneCountryCode;
    const postalCode = changes.postalCode ?? shippingPostalCode;
    setShippingName(name);
    setShippingCountry(country);
    setShippingLine1(line1);
    setShippingCity(city);
    setShippingState(state);
    setShippingPostalCode(postalCode);
    setShippingPhone(phone);
    setPhoneCountryCode(phoneCode);
    const dialCode = { AU: "+61", US: "+1", CA: "+1", NZ: "+64" }[phoneCode] ?? "+61";
    setCustomerAddress(JSON.stringify({ name, phone: phone.trim() ? `${dialCode} ${phone.trim()}` : "", address: { line1, city, state, country, postal_code: postalCode } }));
    setAddressComplete(Boolean(name.trim() && country && line1.trim() && city.trim() && state.trim() && postalCode.trim()));
  };

  const changeOptions = (next: PaymentOptions) => {
    setPriorityDate(next.priorityDate);
    setShippingRegion(next.shippingRegion);
    setShippingCents(next.shippingCents);
    onOptionsChange(next);
  };

  const handlePay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsPaying(true);
    setError(null);

    const updated = await updateCommissionPaymentOptions(clientSecret, priorityDate, shippingCents, shippingRegion);
    if (!updated.success || updated.amountCents === undefined) {
      setError(updated.message ?? "We could not update the payment total. Please try again.");
      setIsPaying(false);
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Please complete your email, address, and payment details.");
      setIsPaying(false);
      return;
    }

    if (paymentSucceeded) {
      const completion = await completeCommissionOrder(clientSecret);
      if (completion.success) { onSuccess(); return; }
      setError(completion.message ?? "The order confirmation could not be completed. Please try again.");
      setIsPaying(false);
      return;
    }

    const details = await savePaymentCustomerDetails(clientSecret, customerEmail, customerAddress, customerName);
    if (!details.success) { setError(details.message ?? "We could not save your contact details. Please try again."); setIsPaying(false); return; }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: shippingName,
            email: customerEmail,
            phone: customerAddress ? JSON.parse(customerAddress).phone : undefined,
            address: { line1: shippingLine1, city: shippingCity, state: shippingState, country: shippingCountry, postal_code: shippingPostalCode },
          },
        },
      },
      redirect: "if_required",
    });
    if (confirmError) { setError(confirmError.message ?? "Payment failed. Please check your card details and try again."); setIsPaying(false); return; }
    if (paymentIntent?.status === "succeeded") {
      setPaymentSucceeded(true);
      const completion = await completeCommissionOrder(clientSecret);
      if (!completion.success) { setError(completion.message ?? "Your payment succeeded, but the order confirmation could not be completed. Please try again."); setIsPaying(false); return; }
      onSuccess();
    } else if (paymentIntent?.status === "processing") {
      setError("Your payment is processing. Do not submit another payment; we will email you as soon as Stripe confirms it.");
      setIsPaying(false);
    } else { setError("Payment did not complete. Please try again."); setIsPaying(false); }
  };

  return (
    <form className="commission-payment-form" onSubmit={handlePay}>
      <div className="commission-stripe-section commission-contact-section"><span className="commission-stripe-section-title">Contact details</span><div className="commission-contact-fields"><label className="commission-contact-row"><svg aria-hidden="true" viewBox="0 0 16 16"><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="m3 5 5 3.5L13 5" /></svg><span className="commission-visually-hidden">Email</span><input type="email" autoComplete="email" placeholder="Email" value={customerEmail} onChange={(event) => { setCustomerEmail(event.target.value); setEmailComplete(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value)); }} required /></label><label className="commission-contact-row"><svg aria-hidden="true" viewBox="0 0 16 16"><circle cx="8" cy="5" r="2.5" /><path d="M3 13c.4-2.2 2.2-3.5 5-3.5s4.6 1.3 5 3.5" /></svg><span className="commission-visually-hidden">Full name</span><input type="text" autoComplete="name" placeholder="Full name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required /></label></div></div>
       <label className="commission-stripe-date-field"><span className="commission-stripe-date-label">Priority order request date <em>(Optional)</em></span><ModernDatePicker name="priorityDate" value={priorityDate} variant="checkout" onChange={(value) => changeOptions({ priorityDate: value, shippingCents, shippingRegion })} /><small>Priority Date (30% rush fee applies)</small></label>
      <div className="commission-stripe-section commission-address-section"><span className="commission-stripe-section-title">Shipping address</span><div className="commission-address-fields">
        <label className="commission-address-row"><span className="commission-visually-hidden">Full name</span><input type="text" autoComplete="shipping name" placeholder="Full name" value={shippingName} onChange={(event) => updateShippingAddress({ name: event.target.value })} required /></label>
        <label className="commission-address-row commission-address-country"><span className="commission-visually-hidden">Country or region</span><select autoComplete="shipping country-name" aria-label="Country or region" value={shippingCountry} onChange={(event) => updateShippingAddress({ country: event.target.value })}><option value="AU">Australia</option><option value="BD">Bangladesh</option><option value="US">United States</option><option value="CA">Canada</option><option value="NZ">New Zealand</option></select><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m3.5 6 4.5 4 4.5-4" /></svg></label>
        <label className="commission-address-row"><span className="commission-visually-hidden">Address</span><input type="text" autoComplete="shipping address-line1" placeholder="Address" value={shippingLine1} onChange={(event) => updateShippingAddress({ line1: event.target.value })} required /></label>
        <div className="commission-address-row commission-address-locality"><label><span className="commission-visually-hidden">City</span><input type="text" autoComplete="shipping address-level2" placeholder="City" value={shippingCity} onChange={(event) => updateShippingAddress({ city: event.target.value })} required /></label><label><span className="commission-visually-hidden">State or region</span><input type="text" autoComplete="shipping address-level1" placeholder="State / region" value={shippingState} onChange={(event) => updateShippingAddress({ state: event.target.value })} required /></label></div>
        <label className="commission-address-row"><span className="commission-visually-hidden">Postal code</span><input type="text" autoComplete="shipping postal-code" placeholder="Postal code" value={shippingPostalCode} onChange={(event) => updateShippingAddress({ postalCode: event.target.value })} required /></label>
        <div className="commission-address-row commission-address-phone"><label className="commission-phone-code"><span className="commission-visually-hidden">Phone country code</span><select aria-label="Phone country code" value={phoneCountryCode} onChange={(event) => updateShippingAddress({ phoneCode: event.target.value })}><option value="AU">🇦🇺 +61</option><option value="US">🇺🇸 +1</option><option value="CA">🇨🇦 +1</option><option value="NZ">🇳🇿 +64</option></select><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" /></svg></label><label className="commission-phone-number"><span className="commission-visually-hidden">Phone number (optional)</span><input type="tel" autoComplete="shipping tel-national" placeholder="Phone number" value={shippingPhone} onChange={(event) => updateShippingAddress({ phone: event.target.value })} /></label></div>
      </div></div>
      <fieldset className="commission-stripe-shipping-field"><legend>Shipping method</legend><div className="commission-shipping-options">
        <label><input type="radio" name="stripeShippingRegion" checked={shippingCents === 0} onChange={() => changeOptions({ priorityDate, shippingCents: 0, shippingRegion })} /><span>Pick up from Sydney studio</span><strong>Free</strong></label>
        <label><input type="radio" name="stripeShippingRegion" checked={shippingCents > 0 && shippingRegion === "australia"} onChange={() => changeOptions({ priorityDate, shippingCents: shippingRates.australia, shippingRegion: "australia" })} /><span>{sizeLabel} Shipping (Australia)<small>3–5 business days</small></span><strong>{formatPrice(shippingRates.australia)}</strong></label>
        <label><input type="radio" name="stripeShippingRegion" checked={shippingCents > 0 && shippingRegion === "us-canada"} onChange={() => changeOptions({ priorityDate, shippingCents: shippingRates["us-canada"], shippingRegion: "us-canada" })} /><span>{sizeLabel} Shipping (US &amp; Canada)<small>3–5 business days</small></span><strong>{formatPrice(shippingRates["us-canada"])}</strong></label>
      </div></fieldset>
      <div className="commission-stripe-section commission-payment-section"><span className="commission-stripe-section-title">Payment method</span><PaymentElement onChange={(event) => setIsPaymentComplete(event.complete)} options={{ layout: "accordion", wallets: { link: "auto" }, fields: { billingDetails: { address: "never", email: "never", name: "never", phone: "never" } }, defaultValues: { billingDetails: { email: customerEmail } } }} /><label className="commission-billing-same"><input type="checkbox" checked disabled /><span>Billing info same as shipping</span></label></div>
      <label className="commission-checkout-terms"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} required /><span>I agree to KinCollage&apos;s <a href="/legal#terms" target="_blank" rel="noreferrer">Terms of Service</a> and <a href="/legal#privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</span></label>
      {error && <p className="commission-field-error mt-3" role="alert">{error}</p>}
      <button className="button-primary commission-order-submit mt-6" type="submit" disabled={!stripe || !elements || !isPaymentComplete || !emailComplete || !addressComplete || !termsAccepted || isPaying}>{isPaying ? "Processing…" : paymentSucceeded ? "Retry order confirmation" : `${paymentLabel.toUpperCase()} — ${formatPrice(amountCents)}`}</button>
      <div className="commission-link-disclosure"><p>By paying, you agree to <a href="https://stripe.com/legal/link" target="_blank" rel="noopener noreferrer">Link&apos;s Terms</a> and <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy.</a></p><div><span>Powered by <strong>stripe</strong></span><span aria-hidden="true" /><a href="https://stripe.com/legal/link" target="_blank" rel="noopener noreferrer">Terms</a><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a></div></div>
    </form>
  );
}

export default function DepositPaymentForm({ clientSecret, amountCents, totalCents, currency, paymentPlan, sizeLabel, items, shippingRates, onSuccess }: { clientSecret: string; amountCents: number; totalCents: number; currency: string; paymentPlan: "full" | "installments"; sizeLabel: string; items: CheckoutItem[]; shippingRates: CommissionShippingRates; onSuccess: () => void }) {
  const [options, setOptions] = useState<PaymentOptions>({ priorityDate: "", shippingCents: 0, shippingRegion: "australia" });
  const [displayAmountCents, setDisplayAmountCents] = useState(amountCents);
  const [displayTotalCents, setDisplayTotalCents] = useState(totalCents);
  const [discountCents, setDiscountCents] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
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
    const result = await applyCommissionVoucher(clientSecret, code, options.priorityDate, options.shippingCents, options.shippingRegion);
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
      <CheckoutSummary key={voucherCode} items={items} amountCents={displayAmountCents} totalCents={displayTotalCents} currency={currency} paymentPlan={paymentPlan} options={options} discountCents={discountCents} voucherCode={voucherCode} voucherMessage={voucherMessage} isApplyingVoucher={isApplyingVoucher} onApplyVoucher={handleApplyVoucher} />
      <section className="commission-checkout-form-panel">
        <h3>Shipping information</h3>
        <Elements stripe={getStripe()} options={{ clientSecret, fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Tenor+Sans&display=swap" }], appearance: { theme: "flat", variables: { colorPrimary: "#263443", colorText: "#263443", iconColor: "#263443", iconHoverColor: "#263443", tabIconColor: "#263443", tabIconHoverColor: "#263443", tabIconSelectedColor: "#263443", tabIconMoreColor: "#263443", colorDanger: "#ad3127", fontFamily: "'Montserrat', Arial, sans-serif", fontSizeBase: "14px", fontSizeSm: "13px", borderRadius: "8px", spacingUnit: "2px" }, rules: { ".Input": { border: "1px solid #d6d6dc", borderRadius: "7px", backgroundColor: "#fff", padding: "9px 12px", boxShadow: "0 1px 3px rgba(38, 52, 67, 0.1)", fontFamily: "'Montserrat', Arial, sans-serif", fontSize: "14px" }, ".Input:focus": { border: "2px solid #263443", boxShadow: "0 0 0 3px rgba(38, 52, 67, 0.17)" }, ".Label": { fontSize: "13px", textTransform: "none", color: "#565661", fontFamily: "'Tenor Sans', Arial, sans-serif" }, ".TabLabel": { color: "#263443", fontFamily: "'Tenor Sans', Arial, sans-serif" }, ".Link": { color: "#263443" }, ".TabIcon": { color: "#263443" } } } }}>
          <PayButton amountCents={displayAmountCents} currency={currency} paymentLabel={paymentPlan === "installments" ? "Pay first installment" : "Pay in full"} clientSecret={clientSecret} sizeLabel={sizeLabel} shippingRates={shippingRates} onOptionsChange={handleOptionsChange} onSuccess={onSuccess} />
        </Elements>
      </section>
    </div>
  );
}
