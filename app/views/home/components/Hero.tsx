import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-content">
        <h1 id="hero-heading">
          <span>TRANSFORM YOUR</span>
          <span>CHILD&apos;S ARTWORK INTO</span>
          <span><em>a family</em> <mark>heirloom</mark></span>
        </h1>
        <p>
          Custom made collages by Zsófia Mátrai to preserve your
          <br className="hero-desktop-break" /> children&apos;s memories
        </p>
        <div className="hero-action">
          <Link className="hero-cta" href="/commissions">GET STARTED</Link>
          <Image className="hero-eyelash" src="/hero-eyelash.svg" alt="" width={51} height={85} aria-hidden="true" />
        </div>
      </div>
      <Image
        className="hero-showcase"
        src="/hero-showcase.png"
        alt="A child standing beside two colourful KinCollage artworks"
        width={838}
        height={812}
        sizes="(max-width: 820px) 100vw, 60vw"
        priority
      />
      <Image
        className="hero-showcase-mobile"
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