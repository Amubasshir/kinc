import Image from "next/image";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";

export default function ArtistHero({ viewModel }: { viewModel: ArtistViewModel }) {
  return (
    <section className="artist-hero" aria-labelledby="artist-heading">
      <div className="artist-hero-inner">
        <div className="artist-hero-copy">
          <h1 id="artist-heading">About {viewModel.name}</h1>
          <div className="artist-hero-body">
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
        <div className="artist-hero-portrait">
          <Image
            src={viewModel.portrait}
            alt={`${viewModel.name}, artist and founder of KinCollage`}
            width={2016}
            height={2528}
            priority
            sizes="(max-width: 800px) 92vw, 504px"
          />
          <Image
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
