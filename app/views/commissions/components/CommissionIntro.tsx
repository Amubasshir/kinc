import Link from "next/link";
export default function CommissionIntro() {
  return (
    <section className="commission-intro relative min-h-[356px] rounded-[20px] px-6 pt-[59px] pb-[54px] text-center text-[#5b5b5d] max-[800px]:min-h-0 max-[800px]:rounded-2xl max-[800px]:px-[22px] max-[800px]:pt-16 max-[800px]:pb-[46px]" aria-labelledby="commission-heading">
      <div className="commission-intro-copy">
        <h1 className="text-[48px] leading-[1.12] tracking-[.2px] max-[800px]:text-[clamp(38px,11vw,48px)]" id="commission-heading">Order it. Get it printed. Use it.</h1>
        <p className="mt-7 text-[15px] leading-[1.38] max-[800px]:text-[14px] max-[800px]:leading-[1.5] [&>br]:max-[800px]:hidden">
          Share the joy with loved ones. As an exclusive add-on to your core
          <br />
          artwork commission, have your child&apos;s custom collage printed onto a
          <br />
          curated collection of premium everyday items.
        </p>
        <p className="commission-intro-note mt-[21px] text-[15px] leading-[1.38]">Select any of these exclusive lifestyle pieces when customising your <br/> commission order.</p>
        <Link className="commission-intro-cta mt-[25px] inline-flex min-h-[53px] min-w-[264px] items-center justify-center rounded-full bg-[#97ff77] text-[15px] text-[#344153] no-underline shadow-[0_4px_5px_rgb(25_93_69/22%)] transition hover:-translate-y-0.5 max-[800px]:min-w-[min(264px,100%)]" href="/start-your-commission">
          START YOUR ORDER
        </Link>
      </div>
    </section>
  );
}
