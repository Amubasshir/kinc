import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero relative flex min-h-[812px] items-center overflow-hidden rounded-[20px] bg-[#00d18f] py-0 pr-[calc(59.86%+58px)] pl-[58px] text-[#1d293d] max-[820px]:min-h-0 max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:px-0 max-[820px]:pb-[72px] max-[700px]:gap-3 max-[700px]:overflow-visible max-[700px]:rounded-none max-[700px]:bg-transparent" aria-labelledby="hero-heading">
      <div className="hero-content relative z-[2] w-[446px] max-w-full translate-y-14 max-[820px]:w-auto max-[820px]:translate-y-0 max-[820px]:px-6 max-[820px]:pt-16 max-[700px]:order-1 max-[700px]:min-h-[363px] max-[700px]:w-full max-[700px]:overflow-hidden max-[700px]:rounded-[18px] max-[700px]:bg-[#00d18f] max-[700px]:px-[18px] max-[700px]:pt-[70px] max-[700px]:pb-12 max-[700px]:text-center">
        <h1 className="mb-[14px] text-[clamp(36px,3.08vw,43px)] leading-[1.09] font-light tracking-[-.8px] [&>span]:whitespace-nowrap max-[820px]:text-[clamp(31px,9vw,42px)] max-[700px]:text-[25px] max-[700px]:leading-[1.25] max-[700px]:tracking-[.1px] max-[700px]:[&>span]:whitespace-normal" id="hero-heading">
          <span>TRANSFORM YOUR</span>
          <span>CHILD&apos;S ARTWORK INTO</span>
          <span><em>a family</em> <mark>heirloom</mark></span>
        </h1>
        <p className="text-[17px] leading-[1.28] tracking-[.05px] max-[820px]:max-w-[480px] max-[820px]:text-[16px] max-[700px]:mt-[17px] max-[700px]:text-[15px] max-[700px]:leading-[1.45]">
          Custom made collages by Zsófia Mátrai to preserve your
          <br className="hero-desktop-break" />{" "}children&apos;s memories
        </p>
        <div className="hero-action relative inline-flex max-[700px]:mt-[7px]">
          <Link className="hero-cta mt-7 inline-flex min-h-[52px] min-w-[187px] items-center justify-center rounded-full bg-[#97ff77] font-[Georgia] text-[16px] text-[#283544] no-underline shadow-[0_3px_4px_rgb(25_93_69/28%)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_5px_10px_rgb(25_93_69/30%)] max-[700px]:mt-4 max-[700px]:min-h-[49px] max-[700px]:min-w-[180px]" href="/commissions">GET STARTED</Link>
          <Image className="hero-eyelash pointer-events-none absolute top-3 left-[calc(100%+1px)] h-[85px] w-[51px] object-contain max-[820px]:h-auto max-[820px]:w-[43px] max-[700px]:top-4 max-[700px]:w-12" src="/hero-eyelash.svg" alt="" width={51} height={85} aria-hidden="true" />
        </div>
      </div>
      <Image
        className="hero-showcase absolute top-0 right-0 block h-full w-[59.86%] rounded-[20px] object-cover max-[820px]:relative max-[820px]:order-first max-[820px]:h-auto max-[820px]:w-full max-[820px]:rounded-2xl max-[820px]:aspect-[838/812] max-[700px]:hidden"
        src="/hero-showcase.png"
        alt="A child standing beside two colourful KinCollage artworks"
        width={838}
        height={812}
        sizes="(max-width: 820px) 100vw, 60vw"
        priority
      />
      <Image
        className="hero-showcase-mobile hidden max-[700px]:relative max-[700px]:order-0 max-[700px]:block max-[700px]:h-auto max-[700px]:w-full max-[700px]:rounded-[18px]"
        src="/hero-showcase-mobile.png"
        alt="A child standing beside two colourful KinCollage artworks"
        width={366}
        height={389}
        sizes="calc(100vw - 24px)"
        priority
      />
    </section>
  );
}
