"use client";

import { FormEvent, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ADD_ON_PRODUCTS } from "../../models/site";
import { ADD_ON_PRICE, RUSH_FEE_RATE } from "../../lib/commissionPricing";
import type { StripeCommissionProduct } from "../../lib/stripePricing";
import { createCommissionDeposit, type CommissionDepositState } from "../../actions/commissionDeposit";
import DepositPaymentForm from "./DepositPaymentForm";
import ModernDatePicker from "./ModernDatePicker";
import { validateCoupon } from "../../actions/giftCoupon";

const initialDepositState: CommissionDepositState = { status: "idle" };

export default function CommissionOrderForm({ commissionProducts, requestedAddOnId, requestedProductId }: { commissionProducts: StripeCommissionProduct[]; requestedAddOnId?: string; requestedProductId?: string }) {
  const router = useRouter();
  const requestedAddOn = ADD_ON_PRODUCTS.find((item) => item.id === requestedAddOnId);
  const requestedSize = commissionProducts.find((item) => item.productId === requestedProductId);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(requestedSize ? [requestedSize.priceId] : []);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(requestedAddOn ? [requestedAddOn.label] : []);
  const [product, setProduct] = useState(requestedAddOn ? "KinCollage artwork and add-on products" : requestedSize ? "Original KinCollage artwork" : "");
  const [otherSize, setOtherSize] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [framing, setFraming] = useState("");
  const [needsBox, setNeedsBox] = useState("");
  const [priorityDate, setPriorityDate] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [depositState, formAction, isCreatingDeposit] = useActionState(createCommissionDeposit, initialDepositState);

  const syncFormValidity = () => {
    const form = formRef.current;
    if (!form) return;
    setIsFormValid(form.checkValidity() && (selectedSizes.length > 0 || otherSize));
  };

  useEffect(() => {
    if (!requestedAddOn) return;
    document.getElementById("commission-addon-options")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [requestedAddOn]);

  useEffect(() => {
    if (!requestedSize) return;
    document.getElementById("commission-size-options")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [requestedSize]);

  useEffect(() => {
    syncFormValidity();
  }, [selectedSizes.length, otherSize, product, needsBox, priorityDate]);

  useEffect(() => {
    if (depositState.status === "quote-only") router.push("/thank-you?type=quote");
  }, [depositState.status, router]);

  const currency = commissionProducts[0]?.currency ?? "usd";
  const money = useMemo(() => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }), [currency]);
  const pricing = useMemo(() => {
    const artworkCents = commissionProducts.filter((item) => selectedSizes.includes(item.priceId)).reduce((sum, item) => sum + item.unitAmount, 0);
    const extrasCents = selectedAddOns.length * ADD_ON_PRICE * 100;
    const rushCents = priorityDate ? Math.round((artworkCents + extrasCents) * RUSH_FEE_RATE) : 0;
    const totalCents = artworkCents + extrasCents + rushCents;
    const discount = Math.min(couponDiscount, totalCents);
    const discountedTotal = totalCents - discount;
    return { artwork: artworkCents / 100, extras: extrasCents / 100, rush: rushCents / 100, discount: discount / 100, total: discountedTotal / 100, deposit: Math.round(discountedTotal / 2) / 100 };
  }, [commissionProducts, couponDiscount, priorityDate, selectedAddOns.length, selectedSizes]);

  const applyCoupon = async () => {
    setIsCheckingCoupon(true);
    setCouponMessage("");
    const result = await validateCoupon(coupon);
    if (!result) {
      setCouponDiscount(0);
      setCouponMessage("That coupon is invalid or has already been used.");
    } else {
      setCouponDiscount(result.discount_cents);
      setCouponMessage("Coupon applied: $50 off.");
    }
    setIsCheckingCoupon(false);
  };

  const toggle = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (selectedSizes.length === 0 && !otherSize) {
      event.preventDefault();
      setSizeError(true);
      document.getElementById("commission-size-options")?.focus();
      return;
    }
    setSizeError(false);
  };

  return (
    <>
      <form className="commission-order-form" action={formAction} onSubmit={handleSubmit} ref={formRef} onInput={syncFormValidity} onChange={syncFormValidity}>
        <div className="commission-two-columns">
          <label className="commission-field">First name <span>*</span><input name="firstName" placeholder="Sammy" required /></label>
          <label className="commission-field">Last name <span>*</span><input name="lastName" placeholder="Gordon" required /></label>
        </div>
        <label className="commission-field">Email <span>*</span><input name="email" type="email" placeholder="youremail@email.com" required /></label>
        <label className="commission-field">Address <span>*</span><small>Used for delivery from Sydney, Australia.</small><input name="address" autoComplete="street-address" required /></label>
        <label className="commission-field">Which product or service would you like to order? <span>*</span><small>If you&apos;re interested in multiple products, fill out a new form for each.</small><select name="product" value={product} onChange={(event) => setProduct(event.target.value)} required><option value="" disabled>Select a product or service</option><option>Original KinCollage artwork</option><option>KinCollage artwork and add-on products</option><option>Digital voucher</option></select></label>
        <input type="hidden" name="addOnReference" value={requestedAddOnId ?? ""} />
        <label className="commission-field">Tell us the story behind this commission<small>Specify if it&apos;s for a special milestone, a gift, or to preserve a specific era of childhood.</small><textarea name="story" rows={3} /></label>

        <fieldset>
          <legend>Which size(s) are you ordering? <span>*</span></legend>
          <small>Prices below are loaded from Stripe and reflect design curation, materials and collage work on canvas. Framing can be added in the next step.</small>
          <div className="commission-options" id="commission-size-options" tabIndex={-1}>
            {commissionProducts.map((size) => <label key={size.priceId}><input type="checkbox" name="sizes" value={size.priceId} checked={selectedSizes.includes(size.priceId)} onChange={() => { toggle(size.priceId, setSelectedSizes); setSizeError(false); }} /> <span>{size.name} — {size.dimensions} — {money.format(size.unitAmount / 100)} {size.currency.toUpperCase()} + shipping <em>{size.minimum}</em></span></label>)}
            <label><input type="checkbox" name="sizes" value="other" checked={otherSize} onChange={(event) => { setOtherSize(event.target.checked); setSizeError(false); }} /> <span>Other, or if you need 2 of the same, please specify</span></label>
          </div>
          {commissionProducts.length === 0 && <p className="commission-field-error" role="alert">Current sizes could not be loaded from Stripe. Please try again shortly.</p>}
          {otherSize && <input className="commission-round-input" name="otherSize" aria-label="Other size details" required placeholder="Please specify size and quantity" />}
          {sizeError && <p className="commission-field-error" role="alert">Please choose at least one canvas size.</p>}
        </fieldset>

        <fieldset>
          <legend>Would you like custom framing? (Natural Raw Oak, 55 mm profile)</legend>
          <small>Framing is quoted for your selected canvas size and confirmed before your deposit.</small>
          <div className="commission-options">{["Yes — please include a framing quote", "No", "Decide later"].map((option) => <label key={option}><input type="radio" name="framing" value={option} checked={framing === option} onChange={() => setFraming(option)} /> <span>{option}</span></label>)}</div>
        </fieldset>

        <fieldset>
          <legend>Choose any add-on products with your collage printed on them</legend>
          <small>We can beautifully adapt your child&apos;s custom collage layout into a limited collection of premium everyday essentials. Select any pieces you would like to include for your household or as gifts for your family.</small>
          <div className="commission-options" id="commission-addon-options">{ADD_ON_PRODUCTS.map((item, index) => <label key={item.id}><input type="checkbox" name="addOns" value={item.label} checked={selectedAddOns.includes(item.label)} onChange={() => toggle(item.label, setSelectedAddOns)} /> <span>{item.label} — ${ADD_ON_PRICE} {index === 0 && <em>(Our bestseller)</em>}</span></label>)}</div>
        </fieldset>

        <fieldset>
          <legend>Do you require a box to be sent to you for collecting your kid&apos;s artworks? <span>*</span></legend>
          <small>Price is calculated based on number of artworks.</small>
          <div className="commission-options">
            <label><input type="radio" name="box" value="no" checked={needsBox === "no"} onChange={() => setNeedsBox("no")} required /> <span>No thanks, I will pack and mail the artwork using my own packaging.</span></label>
            <label><input type="radio" name="box" value="yes" checked={needsBox === "yes"} onChange={() => setNeedsBox("yes")} required /> <span>Yes please. (Please specify the number of artworks and note the largest artwork size)</span></label>
          </div>
          {needsBox === "yes" && <input className="commission-round-input" name="boxDetails" aria-label="Collection box details" required placeholder="Number of artworks and largest artwork size" />}
        </fieldset>

        <div className="commission-field">Priority order request<small>If you require your piece by a specific date, a 30% rush fee guarantees your chosen completion date.</small><ModernDatePicker name="priorityDate" value={priorityDate} onChange={setPriorityDate} /></div>
        <div className="commission-field"><label htmlFor="commission-coupon">Coupon or voucher code</label><div className="flex gap-2"><input id="commission-coupon" name={couponDiscount ? undefined : "coupon"} value={coupon} readOnly={Boolean(couponDiscount)} onChange={(event) => { setCoupon(event.target.value.toUpperCase()); setCouponDiscount(0); setCouponMessage(""); }} />{couponDiscount > 0 && <input type="hidden" name="coupon" value={coupon} />}<button className="button-secondary rounded-full px-4" type="button" onClick={applyCoupon} disabled={!coupon.trim() || isCheckingCoupon || couponDiscount > 0}>{isCheckingCoupon ? "Checking…" : couponDiscount > 0 ? "Applied" : "Apply"}</button></div>{couponMessage && <small className={couponDiscount ? "text-[#008d60]" : "commission-field-error"} role={couponDiscount ? "status" : "alert"}>{couponMessage}</small>}</div>
        <label className="commission-field">Your note or question<small>Include any special requests you may have.</small><textarea name="note" rows={4} placeholder="Tell us about your project or question..." /></label>
        <label className="commission-confirm"><input type="checkbox" name="confirmation" required /> <span>I understand that upon submitting this form, I will receive an email confirmation and an order summary for the 50% deposit and remaining balance. Studio creation begins once original artwork and deposit are received.</span></label>

        {!otherSize && (
          <aside className="commission-price-summary" aria-live="polite">
            <h3>Order summary</h3>
            <dl><div><dt>Artwork</dt><dd>{money.format(pricing.artwork)}</dd></div><div><dt>Add-ons</dt><dd>{money.format(pricing.extras)}</dd></div>{pricing.rush > 0 && <div><dt>Priority fee (30%)</dt><dd>{money.format(pricing.rush)}</dd></div>}{pricing.discount > 0 && <div><dt>Coupon discount</dt><dd>-{money.format(pricing.discount)}</dd></div>}<div className="commission-total"><dt>Estimated total</dt><dd>{money.format(pricing.total)}</dd></div><div><dt>50% deposit</dt><dd>{money.format(pricing.deposit)}</dd></div></dl>
            {(framing.startsWith("Yes") || needsBox === "yes") && <p>Framing and/or collection-box pricing will be added after review. Shipping is calculated from your address.</p>}
          </aside>
        )}

        {depositState.status !== "ready" && (
          <button className="button-primary commission-order-submit" type="submit" disabled={isCreatingDeposit || !isFormValid}>
            {otherSize
              ? (isCreatingDeposit ? "Sending request…" : "Request custom quote")
              : (isCreatingDeposit ? "Preparing payment…" : "Continue to payment")}
          </button>
        )}
        {depositState.status === "error" && <p className="commission-field-error" role="alert">{depositState.message}</p>}
      </form>

      {depositState.status === "quote-only" && (
        <p className="commission-submit-status" role="status">{depositState.message}</p>
      )}

      {depositState.status === "ready" && (
        <DepositPaymentForm
          clientSecret={depositState.clientSecret}
          depositCents={depositState.depositCents}
          totalCents={depositState.totalCents}
          currency={depositState.currency}
          onSuccess={(paymentIntentId) => router.push(`/thank-you?type=payment&paymentId=${encodeURIComponent(paymentIntentId)}`)}
        />
      )}
    </>
  );
}
