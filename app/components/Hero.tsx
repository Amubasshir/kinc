import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-content">
        <h1 id="hero-heading">
          <span>TRANSFORM YOUR</span>
          <span>CHILD&apos;S ARTWORK</span>
          <span>INTO <em>a family</em> <mark>heirloom</mark></span>
        </h1>
        <p>
          Custom made collages by Zsófia Mátrai to preserve your
          <br className="hero-desktop-break" /> children&apos;s memories
        </p>
        <Link className="hero-cta" href="/commissions">GET STARTED</Link>
      </div>
    </section>
  );
}