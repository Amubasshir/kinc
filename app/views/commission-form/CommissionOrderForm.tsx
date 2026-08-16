"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const sizes = [
  { id: "30x40", label: "30 x 40 cm", price: 385, minimum: 10 },
  { id: "60x80", label: "60 x 80 cm", price: 1515, minimum: 30 },
  { id: "70x100", label: "70 x 100 cm", price: 2175, minimum: 50 },
  { id: "80x100", label: "80 x 100 cm", price: 2485, minimum: 60 },
  { id: "90x120", label: "90 x 120 cm", price: 3335, minimum: 60 },
  { id: "122x183", label: "122 x 183 cm", price: 6915, minimum: 80 },
] as const;

const addOns = ["Phone Case", "Tote Bag", "Travel Tumbler", "T-shirt", "Linen Journal", "Digital Canvas Prints", "Greeting Card", "Postcard Sets"] as const;
const money = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

export default function CommissionOrderForm() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [otherSize, setOtherSize] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [framing, setFraming] = useState("");
  const [needsBox, setNeedsBox] = useState("");
  const [priorityDate, setPriorityDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const pricing = useMemo(() => {
    const artwork = sizes.filter((size) => selectedSizes.includes(size.id)).reduce((sum, size) => sum + size.price, 0);
    const extras = selectedAddOns.length * 45;
    const rush = priorityDate ? Math.round((artwork + extras) * 0.3) : 0;
    const total = artwork + extras + rush;
    return { artwork, extras, rush, total, deposit: Math.round(total / 2) };
  }, [priorityDate, selectedAddOns, selectedSizes]);

  const toggle = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedSizes.length === 0 && !otherSize) {
      setSizeError(true);
      document.getElementById("commission-size-options")?.focus();
      return;
    }
    setSizeError(false);
    setSubmitted(true);
    const confirmation = document.getElementById("commission-order-thanks");
    if (confirmation) {
      confirmation.hidden = false;
      window.setTimeout(() => confirmation.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  };

  return (
    <form className="commission-order-form" onSubmit={submit}>
      <div className="commission-two-columns">
        <label className="commission-field">First name <span>*</span><input name="firstName" placeholder="Sammy" required /></label>
        <label className="commission-field">Last name <span>*</span><input name="lastName" placeholder="Gordon" required /></label>
      </div>
      <label className="commission-field">Email <span>*</span><input name="email" type="email" placeholder="youremail@email.com" required /></label>
      <label className="commission-field">Address <span>*</span><small>Used for delivery from Sydney, Australia.</small><input name="address" autoComplete="street-address" required /></label>
      <label className="commission-field">Which product or service would you like to order? <span>*</span><small>If you&apos;re interested in multiple products, fill out a new form for each.</small><select name="product" defaultValue="" required><option value="" disabled>Select a product or service</option><option>Original KinCollage artwork</option><option>KinCollage artwork and add-on products</option><option>Digital voucher</option></select></label>
      <label className="commission-field">Tell us the story behind this commission<small>Specify if it&apos;s for a special milestone, a gift, or to preserve a specific era of childhood.</small><textarea name="story" rows={3} /></label>

      <fieldset>
        <legend>Which size(s) are you ordering? <span>*</span></legend>
        <small>Note: AUD prices below reflect design curation, materials and collage work on canvas. Framing can be added in the next step.</small>
        <div className="commission-options" id="commission-size-options" tabIndex={-1}>
          {sizes.map((size) => <label key={size.id}><input type="checkbox" name="sizes" value={size.id} checked={selectedSizes.includes(size.id)} onChange={() => { toggle(size.id, setSelectedSizes); setSizeError(false); }} /> <span>{size.label} — {money.format(size.price)} + shipping <em>(Minimum {size.minimum} pieces of art)</em></span></label>)}
          <label><input type="checkbox" name="sizes" value="other" checked={otherSize} onChange={(event) => { setOtherSize(event.target.checked); setSizeError(false); }} /> <span>Other, or if you need 2 of the same, please specify</span></label>
        </div>
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
        <small>We can beautifully adapt your child&apos;s custom collage layout into a limited collection of premium everyday essentials. Select any pieces you would like to include for your household or as gifts for your family. <Link href="/products">See product range here</Link>.</small>
        <div className="commission-options">{addOns.map((item, index) => <label key={item}><input type="checkbox" name="addOns" value={item} checked={selectedAddOns.includes(item)} onChange={() => toggle(item, setSelectedAddOns)} /> <span>{item} — $45 {index === 0 && <em>(Our bestseller)</em>}</span></label>)}</div>
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

      <label className="commission-field">Priority order request<small>If you require your piece by a specific date, a 30% rush fee guarantees your chosen completion date.</small><input name="priorityDate" type="date" value={priorityDate} onChange={(event) => setPriorityDate(event.target.value)} /></label>
      <label className="commission-field">Coupon or voucher code<input name="coupon" /></label>
      <label className="commission-field">Your note or question<small>Include any special requests you may have.</small><textarea name="note" rows={4} placeholder="Tell us about your project or question..." /></label>
      <label className="commission-confirm"><input type="checkbox" name="confirmation" required /> <span>I understand that upon submitting this form, I will receive an email confirmation and an order summary for the 50% deposit and remaining balance. Studio creation begins once original artwork and deposit are received.</span></label>

      <aside className="commission-price-summary" aria-live="polite">
        <h3>Order summary</h3>
        <dl><div><dt>Artwork</dt><dd>{money.format(pricing.artwork)}</dd></div><div><dt>Add-ons</dt><dd>{money.format(pricing.extras)}</dd></div>{pricing.rush > 0 && <div><dt>Priority fee (30%)</dt><dd>{money.format(pricing.rush)}</dd></div>}<div className="commission-total"><dt>Estimated total</dt><dd>{money.format(pricing.total)}</dd></div><div><dt>50% deposit</dt><dd>{money.format(pricing.deposit)}</dd></div></dl>
        {(framing.startsWith("Yes") || needsBox === "yes") && <p>Framing and/or collection-box pricing will be added after review. Shipping is calculated from your address.</p>}
      </aside>

      <button className="commission-order-submit" type="submit">Place your order</button>
      {submitted && <p className="commission-submit-status" role="status">Your order details are ready for studio review.</p>}
    </form>
  );
}
