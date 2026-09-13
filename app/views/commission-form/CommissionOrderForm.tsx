"use client";

import { useState } from "react";
import type { StripeCommissionProduct } from "../../lib/stripePricing";

export default function CommissionOrderForm({ commissionProducts, requestedProductId }: { commissionProducts: StripeCommissionProduct[]; requestedAddOnId?: string; requestedProductId?: string }) {
  const requestedSize = commissionProducts.find((item) => item.productId === requestedProductId);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(requestedSize ? [requestedSize.priceId] : []);
  const [otherSize, setOtherSize] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<"full" | "installments">("full");
  const formatPrice = (size: StripeCommissionProduct) => new Intl.NumberFormat("en-US", { style: "currency", currency: size.currency, maximumFractionDigits: 0 }).format(size.unitAmount / 100);
  const formatInstallmentPrice = (size: StripeCommissionProduct) => new Intl.NumberFormat("en-US", { style: "currency", currency: size.currency, maximumFractionDigits: 0 }).format(Math.round(size.unitAmount * 1.15 / 3) / 100);

  return (
    <div className="commission-order-form commission-design-only-form">
      {paymentPlan === "installments" && <p className="commission-installment-heading">2026 - 3 instalment prices per size</p>}
      <fieldset>
        <legend>WHICH SIZE(S) ARE YOU ORDERING?<span>*</span></legend>
        <small>Note: Prices below reflect design curation, materials, frame and collage work on canvas.</small>
        <div className="commission-options" id="commission-size-options" tabIndex={-1}>
          {commissionProducts.map((size) => (
            <label key={size.priceId}>
              <input type="checkbox" checked={selectedSizes.includes(size.priceId)} onChange={() => setSelectedSizes((current) => current.includes(size.priceId) ? current.filter((item) => item !== size.priceId) : [...current, size.priceId])} />
              <span>{size.name} {size.inchDimensions} ({size.dimensions}) — {paymentPlan === "installments" ? formatInstallmentPrice(size) : formatPrice(size)} USD + shipping</span>
            </label>
          ))}
          <label><input type="checkbox" checked={otherSize} onChange={(event) => setOtherSize(event.target.checked)} /><span>Other</span></label>
        </div>
        {otherSize && <input className="commission-round-input" aria-label="Other size details" placeholder="Please specify size and quantity" />}
      </fieldset>

      <fieldset className="commission-payment-plan">
        <legend>WOULD YOU LIKE TO PAY IN FULL OR IN INSTALLMENTS?<span>*</span></legend>
        <div className="commission-options">
          <label><input type="radio" name="paymentPlan" value="full" checked={paymentPlan === "full"} onChange={() => setPaymentPlan("full")} /><span>Pay in full upfront <em>(Best value, save 15%)</em></span></label>
          <label><input type="radio" name="paymentPlan" value="installments" checked={paymentPlan === "installments"} onChange={() => setPaymentPlan("installments")} /><span>3 Fortnightly installments <em>(+15% installment fee; final balance paid prior to dispatch)</em></span></label>
        </div>
      </fieldset>
    </div>
  );
}
