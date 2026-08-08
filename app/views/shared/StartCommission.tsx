import Image from "next/image";
import Link from "next/link";

export default function StartCommission() {
  return (
    <section className="start-commission flex min-h-[425px] flex-col items-center rounded-[20px] bg-[#00d18f] px-6 pt-[70px] pb-16 text-center text-[#263443] max-[700px]:min-h-[390px] max-[700px]:rounded-2xl max-[700px]:px-6 max-[700px]:pt-[58px] max-[700px]:pb-[55px]" aria-labelledby="start-commission-heading">
      <Image className="start-commission-mark block h-[50px] w-[50px]" src="/gallery-page/kin-mark.png" alt="Kin" width={49} height={49} />
      <h2 className="mt-[29px] text-[32px] leading-[1.15] tracking-[.25px] max-[700px]:mt-[25px] max-[700px]:text-[30px]" id="start-commission-heading">Start your commission</h2>
      <p className="mt-[19px] text-[16px] leading-[1.45] max-[700px]:max-w-[520px] max-[700px]:text-[15px]">Create a beautiful statement piece for your home, or a deeply meaningful keepsake for grandparents.</p>
      <div className="start-commission-action relative mt-[31px]">
        <Link className="inline-flex min-h-[53px] w-[187px] items-center justify-center rounded-full bg-[#97ff77] font-[var(--font-tenor-sans)] text-[15px] text-[#263443] no-underline shadow-[0_4px_5px_rgb(25_93_69/28%)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(25_93_69/30%)] focus-visible:-translate-y-0.5 focus-visible:shadow-[0_6px_10px_rgb(25_93_69/30%)]" href="/start-your-commission">GET STARTED</Link>
        {/* <Image className="start-commission-burst" src="/hero-eyelash.svg" alt="" width={51} height={85} aria-hidden="true" /> */}
      </div>
    </section>
  );
}
