import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section className="about flex min-h-[765px] items-center justify-center gap-20 rounded-[20px] bg-[#00d18f] px-10 py-[70px] text-[#263443] max-[1100px]:flex-col max-[1100px]:gap-10 max-[1100px]:text-center max-[700px]:rounded-[18px] max-[700px]:px-4 max-[700px]:pt-5 max-[700px]:pb-7 max-[700px]:gap-[29px]" aria-labelledby="about-heading">
      <div className="about-content max-w-[650px] self-center max-[700px]:w-full [overflow-wrap:anywhere]">
        <h2 className="text-[48px] max-[700px]:font-[Georgia] max-[700px]:text-[31px]" id="about-heading">About Zsofia Matrai</h2>
        <div className="about-copy mt-7 max-[700px]:mt-[23px] [&>p]:text-[15px] [&>p]:leading-[1.48] [&>p+p]:mt-[26px]">
          <p>
            I&apos;m Zsofi Matrai - <mark>artist, designer, and mother of two</mark> based in Sydney, Australia.
          </p>
          <p>
            I created <strong>KinCollage</strong>{" "}to rescue your children&apos;s precious scribbles from the
            &quot;guilt pile&quot; and elevate them into modern, family heirlooms. From raw artwork to
            ready-to-hang fine art, everything you need to preserve your children&apos;s memory is right here.
          </p>
        </div>
        <Link className="about-cta mt-8 inline-flex min-h-[53px] min-w-[180px] items-center justify-center rounded-full bg-[#97ff77] text-[15px] text-[#263443] no-underline shadow max-[700px]:mx-auto max-[700px]:mt-[27px] max-[700px]:flex max-[700px]:min-h-12 max-[700px]:w-[180px]" href="/the-artist">
          MEET ZSOFI
        </Link>
      </div>

      <div className="about-portrait relative w-[504px] max-w-[45%] self-center max-[1100px]:order-first max-[1100px]:max-w-full max-[700px]:w-full max-[700px]:aspect-[334/537]">
        <Image unoptimized
          src="/about-zsofia.png"
          alt="Zsofia Matrai, founder and artist at KinCollage"
          width={2016}
          height={2528}
          sizes="(max-width: 800px) 92vw, 504px"
        />
        <Image unoptimized
          className="about-signature"
          src="/about-signature.svg"
          alt="Zsofia Matrai signature"
          width={216}
          height={81}
        />
      </div>
    </section>
  );
}
