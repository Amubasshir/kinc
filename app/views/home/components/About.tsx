import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section className="about flex min-h-[765px] items-center justify-center gap-20 rounded-[20px] bg-[#00d18f] px-10 py-[70px] text-[#263443] max-[800px]:flex-col max-[700px]:rounded-[18px] max-[700px]:px-4 max-[700px]:pt-5 max-[700px]:pb-7 max-[700px]:gap-[29px]" aria-labelledby="about-heading">
      <div className="about-content max-w-[650px] max-[700px]:w-full [overflow-wrap:anywhere]">
        <h2 className="text-[48px] max-[700px]:font-[Georgia] max-[700px]:text-[31px]" id="about-heading">About Zsofia Matrai</h2>
        <div className="about-copy mt-7 max-[700px]:mt-[23px] [&>p]:text-[15px] [&>p]:leading-[1.48] [&>p+p]:mt-[26px]">
          <p>
            I am a <mark>Sydney-based Australian-Hungarian</mark>{" "}
            <strong>
              <em>artist, designer,</em>
            </strong>{" "}
            and{" "}
            <strong>
              <em>mother of two.</em>
            </strong>
            <br />
            I inherited my artistic hands from my parents, growing up in a home where creativity
            <br />
            was our primary language.
          </p>
          <p>
            My professional career has always been a blend of fine art and high design. As a former
            <br />
            Textile Designer for Camilla, I spent my days hand-drawing and painting intricate
            <br />
            artworks that were transformed into digital prints and worn by women worldwide.
            <br />
            Today, I design <a href="#merchandise">digital products</a>, but my most fulfilling work happens in my
            studio,
            <br />
            <strong>
              <em>inspired by the creativity of my own children.</em>
            </strong>
          </p>
          <p>
            The <strong>KinCollage studio</strong> was born from a desire to rescue my children&apos;s fleeting
            scribbles
            <br />
            from the &apos;guilt pile&apos; and elevate them into something permanent.
            <br />
            Drawing on my background in textile construction and mixed media, I <mark>sort, layer</mark> and
            <br />
            <mark>compose</mark> these precious marks into modern family heirloom collages.
          </p>
          <p>
            I treat every commission with the same precision I&apos;ve given my award-winning fashion
            <br />
            label &amp; my gallery exhibitions.
            <br />
            My goal is to help you <mark>preserve your child&apos;s art</mark>, transforming everyday drawings into a
            <br />
            <strong>
              <em>timeless family legacy.</em>
            </strong>
          </p>
        </div>
        <Link className="about-cta mt-8 inline-flex min-h-[53px] min-w-[180px] items-center justify-center rounded-full bg-[#97ff77] text-[15px] text-[#263443] no-underline shadow max-[700px]:mx-auto max-[700px]:mt-[27px] max-[700px]:flex max-[700px]:min-h-12 max-[700px]:w-[180px]" href="/the-artist">
          MEET ZSOFI
        </Link>
      </div>

      <div className="about-portrait relative w-[504px] max-w-[45%] max-[800px]:order-first max-[800px]:max-w-full max-[700px]:w-full max-[700px]:aspect-[334/537]">
        <Image
          src="/about-zsofia.png"
          alt="Zsofia Matrai, founder and artist at KinCollage"
          width={2016}
          height={2528}
          sizes="(max-width: 800px) 92vw, 504px"
        />
        <Image
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
