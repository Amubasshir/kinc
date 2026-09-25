"use client";

import { useActionState, useState } from "react";
import { createVoucherPayment, type VoucherPaymentState } from "../../../actions/voucher";
import VoucherPaymentForm from "./VoucherPaymentForm";

const initialVoucherState: VoucherPaymentState = { status: "idle" };

export default function GiftCard() {
  const [amount, setAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [amountError, setAmountError] = useState("");
  const amountValue = Number(amount);
  const canSubmit = Number.isInteger(amountValue) && amountValue >= 1 && amountValue <= 10000;
  const [isOpen, setIsOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherEmail, setVoucherEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
  const [checkoutAttemptId, setCheckoutAttemptId] = useState("");
  const [paymentState, paymentAction, isCreatingPayment] = useActionState(createVoucherPayment, initialVoucherState);

  return (
    <section className="gift-card min-h-[449px] rounded-[20px] bg-[#97ff77] px-6 pt-[79px] pb-[68px] text-center text-[#2E2E38] max-[700px]:min-h-0 max-[700px]:rounded-[20px] max-[700px]:px-[22px] max-[700px]:pt-[31px] max-[700px]:pb-[34px]" aria-labelledby="gift-card-heading">
      <div className="gift-card-content mx-auto w-full max-w-[780px]">
        <h2 className="text-[48px] leading-[1.1] max-[700px]:text-[34px] max-[700px]:leading-[1.08]" id="gift-card-heading">Give the gift of memories</h2>
        <p className="mt-[22px] text-[16px] leading-[1.6] max-[700px]:mt-5 max-[700px]:text-[14px] max-[700px]:leading-[1.6] [&>br]:max-[700px]:hidden">
          Perfect for milestone birthdays, Mother’s Day, Father&apos;s day, or for Christmas.
          <br />
          The KinCollage digital voucher allows the recipient to curate their favourite
          <br />
          childhood memories into a bespoke work of fine art.
        </p>
        <form className="gift-card-form mx-auto mt-6 flex max-w-[480px] flex-col items-center" onSubmit={(event) => { event.preventDefault(); if (!canSubmit) { setAmountError("Please enter an amount between $1 and $10,000 USD."); return; } setAmountError(""); setPurchaseAmount(amountValue); setCheckoutAttemptId(crypto.randomUUID()); setIsOpen(true); }}>
          <label className="text-[14px]" htmlFor="voucher-amount">Voucher amount in US dollars</label>
          <input
            className="mt-3 h-10 w-full rounded-full border-2 border-[#aaaab5] bg-white px-4 text-[14px] outline-none"
            id="voucher-amount"
            name="amount"
            type="number"
            min="1"
            max="10000"
            step="1"
            inputMode="decimal"
            placeholder="$ [ Enter Amount ] USD"
            value={amount}
            onChange={(event) => { setAmount(event.target.value); setAmountError(""); }}
            aria-invalid={Boolean(amountError)}
            aria-describedby={amountError ? "voucher-amount-error" : undefined}
            required
          />
          {amountError && <p id="voucher-amount-error" className="commission-field-error mt-2 self-start text-left" role="alert">{amountError}</p>}
          <button className="button-primary mt-6 min-h-[53px] w-[264px] cursor-pointer rounded-full border-0 text-[14px] max-[700px]:mt-[26px] max-[700px]:min-h-[49px] max-[700px]:w-[232px] max-[700px]:text-[14px]" type="submit" disabled={!canSubmit}>PURCHASE VOUCHER</button>
        </form>
      </div>
      {isOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#263443]/60 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="voucher-modal-title">
        <div className="voucher-modal relative max-h-full w-full max-w-[520px] overflow-y-auto rounded-[24px] bg-white p-8 text-left text-[#263443] shadow-2xl max-[600px]:p-5">
          <button type="button" className="absolute right-5 top-4 text-2xl text-[#515151]" onClick={() => setIsOpen(false)} aria-label="Close voucher purchase">×</button>
          <p className="voucher-modal-eyebrow">KINCOLLAGE DIGITAL VOUCHER</p>
          {voucherCode ? <div className="py-5 text-center"><h2 id="voucher-modal-title" className="voucher-modal-heading">Your voucher is ready</h2><p className="mt-4">Your digital voucher has been emailed to <em>{voucherEmail}</em>. You can also copy your unique code below:</p><div className="mt-5 flex items-center gap-2 rounded-xl bg-[#97ff77] p-2"><p className="flex-1 px-2 py-2 text-[22px] font-semibold tracking-wider">{voucherCode}</p><button type="button" className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-[#263443] shadow-sm transition hover:bg-[#f2fff0]" onClick={async () => { await navigator.clipboard.writeText(voucherCode); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? "COPIED" : "COPY"}</button></div><p className="mt-4 text-[12px] leading-[1.6] text-[#515151]">Didn&apos;t receive your email? Check your spam folder or contact <a className="font-semibold text-[#008d60] underline underline-offset-2" href="mailto:hello@kincollage.com">hello@kincollage.com</a>.</p></div> : paymentState.status === "ready" ? <><h2 id="voucher-modal-title" className="voucher-modal-heading">{paymentMethodSelected ? "Complete your purchase" : "Select payment method"}</h2><VoucherPaymentForm clientSecret={paymentState.clientSecret!} amountCents={paymentState.amountCents!} onComplete={(code, email) => { setVoucherCode(code); setVoucherEmail(email || paymentState.email || ""); setAmount(""); }} onPaymentMethodChange={setPaymentMethodSelected} /></> : <><h2 id="voucher-modal-title" className="voucher-modal-heading">Where should we send it?</h2><p className="mt-2 text-[14px] leading-[1.6] text-[#515151]">Enter the recipient&apos;s email address below. They&apos;ll receive their digital voucher as soon as you complete payment via our secure Stripe checkout.</p><form action={paymentAction} className="mt-6"><input type="hidden" name="amount" value={purchaseAmount} /><input type="hidden" name="checkoutAttemptId" value={checkoutAttemptId} /><label className="font-[var(--font-tenor-sans)] text-[14px]">EMAIL ADDRESS<input className="mt-2 h-11 w-full rounded-full border-2 border-[#aaaab5] px-4 font-[var(--font-montserrat)] outline-none focus:border-[#008d60]" name="email" type="email" placeholder="you@example.com" required /></label>{paymentState.status === "error" && !paymentState.message?.includes("amount") && <p className="commission-field-error mt-3" role="alert">{paymentState.message}</p>}<button className="button-primary mt-6 min-h-[51px] w-full rounded-full border-0 font-[var(--font-tenor-sans)] text-[14px] uppercase tracking-[.03em]" type="submit" disabled={!checkoutAttemptId || isCreatingPayment}>{isCreatingPayment ? "PREPARING SECURE PAYMENT…" : "CONTINUE TO PAYMENT"}</button><p className="mt-3 text-center text-[12px] leading-[1.6] text-[#515151]">🔒 Safe &amp; secure checkout via Stripe</p></form></>}
        </div>
      </div>}
    </section>
  );
}
