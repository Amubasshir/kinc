import Image from "next/image";

export default function ArtistStory({ videoOnly = false }: { videoOnly?: boolean }) {
  const video = (
    <div className={`artist-story-video relative mx-auto w-full max-w-[990px] ${videoOnly ? "" : "mt-[84px] max-[800px]:mt-[54px] max-[700px]:order-first max-[700px]:mt-0"}`}>
      <video
        className="block h-auto w-full rounded-[18px]"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Trailer for the KinCollage studio story"
      >
        <source src={videoOnly ? "/KC_Commision.mp4" : "/KC_Intro_16x9_1.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Image unoptimized
        className="artist-story-cursor absolute top-[56%] left-[68%] h-auto w-[72px] rotate-[35deg] max-[800px]:w-12"
        src="/gallery-page/cursor-arrow.png"
        alt=""
        width={56}
        height={73}
        aria-hidden="true"
      />
    </div>
  );

  if (videoOnly) {
    return (
      <section className="commission-story-video rounded-t-none rounded-b-[20px] bg-[url('/contact-background.png')] bg-cover bg-center px-6 py-[92px] max-[700px]:rounded-t-none max-[700px]:rounded-b-[18px] max-[700px]:px-3 max-[700px]:py-10" aria-label="Watch our story">
        {video}
      </section>
    );
  }

  return (
    <section className="artist-story min-h-[977px] overflow-hidden rounded-[20px] bg-[#00d18f] px-6 pt-[72px] pb-[79px] text-center text-[#263443] max-[800px]:min-h-0 max-[800px]:rounded-2xl max-[800px]:px-5 max-[800px]:pt-16 max-[800px]:pb-[76px] max-[700px]:flex max-[700px]:flex-col max-[700px]:px-[14px] max-[700px]:pt-1 max-[700px]:pb-[31px]" aria-labelledby="artist-story-heading">
      <h2 className="text-[48px] leading-[1.12] tracking-[.2px] max-[800px]:text-[clamp(38px,11vw,46px)] max-[700px]:order-1 max-[700px]:mt-[17px] max-[700px]:text-[31px]" id="artist-story-heading">Watch our Story</h2>
      <div className="artist-story-copy mt-5 max-[700px]:order-2 max-[700px]:mt-[14px] [&>p]:text-[16px] [&>p]:leading-[1.45] [&>p+p]:mt-5 max-[800px]:[&>p]:text-[15px] max-[800px]:[&>p]:leading-[1.55] max-[700px]:[&>p]:text-[14px] max-[700px]:[&>p]:leading-[1.5]">
        <p>
          Welcome to my studio. As a designer and a mother, I know exactly how it feels to watch your home fill up with
          endless
          <br />
          stacks of precious childhood drawings. You don&apos;t want the clutter, but you can&apos;t bear the guilt of
          throwing them away.
        </p>
        <p>
          In this short video,{" "}
          <em>
            I take you <mark>behind the scenes of KinCollage.</mark>
          </em>{" "}
          See how we rescue those messy scribbles from the
          <br />
          cupboard and apply the precision of high design to transform them into modern family heirlooms.
        </p>
      </div>
      {video}
    </section>
  );
}
