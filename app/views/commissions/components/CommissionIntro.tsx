import Link from "next/link";
export default function CommissionIntro() {
  return (
    <section className="commission-intro relative min-h-[356px] rounded-[20px] bg-white px-6 pt-[59px] pb-[54px] text-center text-[#5b5b5d] max-[800px]:min-h-0 max-[800px]:rounded-2xl max-[800px]:px-[22px] max-[800px]:pt-16 max-[800px]:pb-[46px]" aria-labelledby="commission-heading">
      <div className="commission-intro-copy">
        <h1 className="text-[48px] leading-[1.12] tracking-[.2px] max-[800px]:text-[clamp(38px,11vw,48px)]" id="commission-heading">Commission it. Print it. Love it</h1>
        <p className="mt-7 text-[15px] leading-[1.38] max-[800px]:text-[14px] max-[800px]:leading-[1.5] [&>br]:max-[800px]:hidden">
          Share the magic with family. We can print your child&apos;s custom creation onto a limited
          <br />
          collection of premium everyday objects, creating an unforgettable keepsake for
          <br />
          grandparents and loved ones.
        </p>
        <p className="commission-intro-note mt-[21px] text-[15px] leading-[1.38]">Start your commission to add any of these below as add ons.</p>
        <Link className="commission-intro-cta mt-[25px] inline-flex min-h-[53px] min-w-[264px] items-center justify-center rounded-full bg-[#97ff77] text-[15px] text-[#344153] no-underline shadow-[0_4px_5px_rgb(25_93_69/22%)] transition hover:-translate-y-0.5 max-[800px]:min-w-[min(264px,100%)]" href="#product-options">
          START YOUR COMMISSION
        </Link>
      </div>
    </section>
  );
}
