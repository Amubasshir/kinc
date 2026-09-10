"use client";

import { useActionState, useState } from "react";
import { createVoucherPayment, type VoucherPaymentState } from "../../../actions/voucher";
import VoucherPaymentForm from "./VoucherPaymentForm";

const initialVoucherState: VoucherPaymentState = { status: "idle" };

export default function GiftCard() {
  const [amount, setAmount] = useState("");
  const amountValue = Number(amount);
  const canSubmit = Number.isInteger(amountValue) && amountValue >= 1;
  const [isOpen, setIsOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentState, paymentAction, isCreatingPayment] = useActionState(createVoucherPayment, initialVoucherState);

  return (
    <section className="gift-card min-h-[449px] rounded-[20px] bg-[#97ff77] px-6 pt-[79px] pb-[68px] text-center text-[#263443] max-[700px]:min-h-0 max-[700px]:rounded-[18px] max-[700px]:px-[22px] max-[700px]:pt-[31px] max-[700px]:pb-[34px]" aria-labelledby="gift-card-heading">
      <div className="gift-card-content mx-auto w-full max-w-[780px]">
        <h2 className="text-[48px] leading-[1.1] max-[700px]:text-[34px] max-[700px]:leading-[1.08]" id="gift-card-heading">Give the gift of memories</h2>
        <p className="mt-[22px] text-[17px] leading-[1.45] max-[700px]:mt-5 max-[700px]:text-[15px] max-[700px]:leading-[1.48] [&>br]:max-[700px]:hidden">
          Perfect for milestone birthdays, Mother’s Day, Father&apos;s day, or for Christmas.
          <br />
          The KinCollage digital voucher allows the recipient to curate their favourite
          <br />
          childhood memories into a bespoke work of fine art.
        </p>
        <form className="gift-card-form mx-auto mt-6 flex max-w-[480px] flex-col items-center" onSubmit={(event) => { event.preventDefault(); setIsOpen(true); }}>
          <label className="text-[14px]" htmlFor="voucher-amount">Voucher amount in Australian dollars</label>
          <input
            className="mt-3 h-10 w-full rounded-full border-2 border-[#aaaab5] bg-white px-4 text-[15px] outline-none"
            id="voucher-amount"
            name="amount"
            type="number"
            min="1"
            step="1"
            inputMode="decimal"
            placeholder="$ [ Enter Amount ] AUD"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
          <button className="button-primary mt-6 min-h-[53px] w-[264px] cursor-pointer rounded-full border-0 text-[15px] max-[700px]:mt-[26px] max-[700px]:min-h-[49px] max-[700px]:w-[232px] max-[700px]:text-[14px]" type="submit" disabled={!canSubmit}>PURCHASE VOUCHER</button>
        </form>
      </div>
      {isOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#263443]/60 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="voucher-modal-title">
        <div className="voucher-modal relative max-h-full w-full max-w-[520px] overflow-y-auto rounded-[24px] bg-white p-8 text-left text-[#263443] shadow-2xl max-[600px]:p-5">
          <button type="button" className="absolute right-5 top-4 text-2xl text-[#515151]" onClick={() => setIsOpen(false)} aria-label="Close voucher purchase">×</button>
          <p className="voucher-modal-eyebrow">KINCOLLAGE DIGITAL VOUCHER</p>
          {voucherCode ? <div className="py-5 text-center"><h2 id="voucher-modal-title" className="voucher-modal-heading">Your voucher is ready</h2><p className="mt-4">Your digital voucher has been emailed to you.</p><div className="mt-5 flex items-center gap-2 rounded-xl bg-[#97ff77] p-2"><p className="flex-1 px-2 py-2 text-[22px] font-bold tracking-wider">{voucherCode}</p><button type="button" className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-[#263443] shadow-sm transition hover:bg-[#f2fff0]" onClick={async () => { await navigator.clipboard.writeText(voucherCode); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? "Copied" : "Copy"}</button></div></div> : paymentState.status === "ready" ? <><h2 id="voucher-modal-title" className="voucher-modal-heading">Complete your purchase</h2><VoucherPaymentForm clientSecret={paymentState.clientSecret!} amountCents={paymentState.amountCents!} onComplete={(code) => { setVoucherCode(code); setAmount(""); }} /></> : <><h2 id="voucher-modal-title" className="voucher-modal-heading">Where should we send it?</h2><p className="mt-2 text-[15px] text-[#515151]">Enter the recipient email, then continue securely to payment.</p><form action={paymentAction} className="mt-6"><input type="hidden" name="amount" value={amountValue} /><label className="block text-[14px]">EMAIL ADDRESS<input className="mt-2 h-11 w-full rounded-full border-2 border-[#aaaab5] px-4 outline-none focus:border-[#008d60]" name="email" type="email" placeholder="you@example.com" required /></label>{paymentState.status === "error" && <p className="commission-field-error mt-3" role="alert">{paymentState.message}</p>}<button className="button-primary mt-6 min-h-[51px] w-full rounded-full border-0" type="submit" disabled={isCreatingPayment}>{isCreatingPayment ? "Preparing secure payment…" : "Continue to payment"}</button></form></>}
        </div>
      </div>}
    </section>
  );
}
