"use client";

import { useActionState, useState } from "react";
import { secureGift, type GiftCouponState } from "../../actions/giftCoupon";

const initialState: GiftCouponState = { status: "idle" };

export default function StayConnected() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(secureGift, initialState);
  const canSubmit = name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const labelClass = "mb-[7px] block text-left text-[16px] leading-none max-[700px]:text-[14px]";
  const inputClass = "h-10 w-full rounded-full border-2 border-[#aaaab5] bg-white px-2.5 text-[15px] text-[#263443] outline-none transition duration-150 placeholder:text-[#aaaab5] focus:border-[#008d60] focus:shadow-[0_0_0_3px_rgb(151_255_119/25%)]";
  return (
    <section className="stay-connected mt-4 min-h-[339px] rounded-[20px] bg-[#00d18f] px-6 pt-[73px] pb-16 text-center text-[#1f2b3d] max-[850px]:min-h-0 max-[850px]:rounded-2xl max-[850px]:px-[22px] max-[850px]:pt-16 max-[850px]:pb-[72px] max-[700px]:rounded-[18px] max-[700px]:px-[23px] max-[700px]:pt-[55px] max-[700px]:pb-10 [overflow-wrap:anywhere]" aria-labelledby="stay-connected-heading">
      <h2 className="text-[32px] leading-[1.15] tracking-[.3px] max-[700px]:text-[34px]" id="stay-connected-heading">Stay connected</h2>
      <p className="mt-[22px] text-[17px] leading-[1.7] tracking-[.03px] max-[850px]:leading-[1.45] max-[700px]:mt-[29px] max-[700px]:text-[15px] max-[700px]:leading-[1.5] [&>br]:max-[850px]:hidden">
        Subscribe for exclusive studio batch drops and curation tips, and receive a printed<br className="max-[500px]:hidden" />
        <mark className="rounded-sm bg-[#97ff77] px-[3px] pt-px pb-0.5 text-inherit"><strong>greeting card ($50 Value)</strong></mark> featuring your child’s custom collage design with your<br className="max-[500px]:hidden" />
        first commission.
      </p>
      <form action={formAction} className="stay-connected-form mx-auto mt-6 grid w-full max-w-[790px] grid-cols-[230px_231px_264px] items-end gap-8 text-left max-[850px]:mt-8 max-[850px]:max-w-[460px] max-[850px]:grid-cols-1 max-[850px]:gap-5 max-[700px]:mt-[31px] max-[700px]:gap-[30px]">
        <div className="stay-connected-field">
          <label className={labelClass} htmlFor="subscriber-name">
            FULL NAME <span className="text-[#ad3127]">*</span>
          </label>
          <input className={inputClass} id="subscriber-name" name="name" type="text" placeholder="Sammy Milson" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div className="stay-connected-field">
          <label className={labelClass} htmlFor="subscriber-email">
            EMAIL <span className="text-[#ad3127]">*</span>
          </label>
          <input
            className={inputClass}
            id="subscriber-email"
            name="email"
            type="email"
            placeholder="yourname@email.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <button className="button-primary stay-connected-submit min-h-[53px] cursor-pointer rounded-full border-0 font-[Georgia] text-[16px] tracking-[.03em] max-[850px]:mt-2 max-[850px]:w-full max-[850px]:max-w-[264px] max-[850px]:justify-self-center max-[700px]:mx-auto max-[700px]:mt-0 max-[700px]:w-[232px] max-[700px]:text-[14px]" type="submit" disabled={!canSubmit || isPending}>{isPending ? "CREATING COUPON…" : "SECURE MY GIFT"}</button>
      </form>
      {state.message && <p className="mt-5 text-[15px]" role={state.status === "error" ? "alert" : "status"}>{state.message}{state.code && <><br /><strong>Your code: {state.code}</strong></>}</p>}
    </section>
  );
}
