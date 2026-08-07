import Image from "next/image";

export default function ArtistStory() {
  return (
    <section className="artist-story" aria-labelledby="artist-story-heading">
      <h2 id="artist-story-heading">Watch our Story</h2>
      <div className="artist-story-copy">
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
      <div className="artist-story-video">
        <Image
          src="/artist/story-video.png"
          alt="Trailer for the KinCollage studio story"
          width={990}
          height={558}
          sizes="(max-width: 800px) 94vw, 990px"
        />
        <Image
          className="artist-story-cursor"
          src="/gallery-page/cursor-arrow.png"
          alt=""
          width={56}
          height={73}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
