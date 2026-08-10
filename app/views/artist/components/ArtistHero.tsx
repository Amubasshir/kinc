import Image from "next/image";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";

export default function ArtistHero({ viewModel }: { viewModel: ArtistViewModel }) {
  return (
    <section className="artist-hero min-h-[1401px] overflow-hidden rounded-[20px] bg-[#00d18f] text-[#263443] max-[1050px]:min-h-0 max-[1050px]:px-7 max-[1050px]:py-20 max-[760px]:rounded-2xl max-[760px]:px-[22px] max-[760px]:pt-16 max-[760px]:pb-[84px] max-[700px]:px-1 max-[700px]:pt-1 max-[700px]:pb-7" aria-labelledby="artist-heading">
      <div className="artist-hero-inner relative mx-auto min-h-[900px] w-[min(1156px,calc(100%-48px))] max-[1050px]:grid max-[1050px]:min-h-0 max-[1050px]:w-full max-[1050px]:grid-cols-[minmax(0,1fr)_minmax(340px,44%)] max-[1050px]:items-center max-[1050px]:gap-12 max-[760px]:flex max-[760px]:flex-col max-[760px]:gap-[58px] max-[700px]:gap-0">
        <div className="artist-hero-copy absolute top-[197px] left-0 w-[590px] max-[1050px]:relative max-[1050px]:top-auto max-[1050px]:left-auto max-[1050px]:w-full max-[760px]:order-1 max-[700px]:box-border max-[700px]:px-1 max-[700px]:pt-[18px]">
          <h1 className="text-[48px] leading-[1.12] tracking-[.2px] max-[1050px]:text-[44px] max-[760px]:text-[clamp(38px,11vw,46px)] max-[700px]:text-[31px] max-[700px]:leading-[1.08]" id="artist-heading">About {viewModel.name}</h1>
          <div className="artist-hero-body mt-[27px] max-[700px]:mt-[17px] [&>p]:text-[15px] [&>p]:leading-[1.48] [&>p+p]:mt-[25px] max-[700px]:[&>p]:text-[14px] max-[700px]:[&>p]:leading-[1.5] max-[700px]:[&>p+p]:mt-5">
            <p>
              I am a <mark>Sydney-based Australian-Hungarian</mark>{" "}
              <strong>
                <em>artist, designer,</em>
              </strong>{" "}
              and{" "}
              <strong>
                <em>mother of two.</em>
              </strong>
              <br />I inherited my artistic hands from my parents, growing up in a home where creativity
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
              Today, I design <a href="#digital-products">digital products</a>, but my most fulfilling work happens in
              my studio,
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
        </div>
        <div className="artist-hero-portrait absolute top-[132px] right-0 h-[632px] w-[504px] max-[1050px]:relative max-[1050px]:top-auto max-[1050px]:right-auto max-[1050px]:h-auto max-[1050px]:w-full max-[1050px]:aspect-[504/632] max-[760px]:order-first max-[760px]:w-[min(100%,504px)] max-[700px]:w-full">
          <Image unoptimized
            className="block h-full w-full rounded-[15px] object-cover"
            src={viewModel.portrait}
            alt={`${viewModel.name}, artist and founder of KinCollage`}
            width={2016}
            height={2528}
            priority
            sizes="(max-width: 800px) 92vw, 504px"
          />
          <Image unoptimized
            className="artist-hero-signature"
            src={viewModel.signature}
            alt={`${viewModel.name} signature`}
            width={203}
            height={49}
          />
        </div>
      </div>
    </section>
  );
}
