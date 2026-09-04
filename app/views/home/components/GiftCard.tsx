"use client";

import { useState } from "react";

export default function GiftCard({ commission = false }: { commission?: boolean }) {
  const [amount, setAmount] = useState("");

  return (
    <section className="gift-card min-h-[449px] rounded-[20px] bg-[#97ff77] px-6 pt-[79px] pb-[68px] text-center text-[#263443] max-[700px]:min-h-0 max-[700px]:rounded-[18px] max-[700px]:px-[22px] max-[700px]:pt-[31px] max-[700px]:pb-[34px]" aria-labelledby="gift-card-heading">
      <div className="gift-card-content mx-auto w-full max-w-[780px]">
        <h2 className="text-[48px] leading-[1.1] max-[700px]:text-[34px] max-[700px]:leading-[1.08]" id="gift-card-heading">{commission ? "Give the gift of memories" : "Gift of a commission"}</h2>
        <p className="mt-[22px] text-[17px] leading-[1.45] max-[700px]:mt-5 max-[700px]:text-[15px] max-[700px]:leading-[1.48] [&>br]:max-[700px]:hidden">
          {commission ? "Perfect for milestone birthdays, Mother’s Day, Father’s Day, or for Christmas." : "Perfect for milestone birthdays, Mother’s Day, or a unique baby shower gift."}
          <br />
          The KinCollage digital voucher allows the recipient to curate their favourite
          <br />
          childhood memories into a bespoke work of fine art.
        </p>
        <form className="gift-card-form mx-auto mt-6 flex max-w-[480px] flex-col items-center">
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
          <button className="mt-6 min-h-[53px] w-[264px] cursor-pointer rounded-full border-0 bg-[#d9d9d9] text-[15px] text-[#263443] shadow-[0_4px_5px_rgb(25_93_69/18%)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 max-[700px]:mt-[26px] max-[700px]:min-h-[49px] max-[700px]:w-[232px] max-[700px]:text-[14px]" type="submit" disabled={!amount}>PURCHASE VOUCHER</button>
        </form>
      </div>
    </section>
  );
}
