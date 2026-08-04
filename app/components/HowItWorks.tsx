import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "1.",
    title: "Inquiry form",
    image: "/how-inquiry.png",
    alt: "A collection of children's artwork ready for a commission",
    content: (
      <p>Start your commission by filling out the form, and<br /> get a 15-minute free consultation &amp; creative deep<br /> dive to align your child&apos;s artistic spirit with your<br /> home&apos;s aesthetic.</p>
    ),
    action: true,
  },
  {
    number: "2.",
    title: "The Collection",
    image: "/how-collection.png",
    alt: "A mother and child gathering children's artwork",
    content: (
      <>
        <p>Gather your child&apos;s artworks &amp; mail them to us<br /> either by your choice of box or order a box from us<br /> via email.</p>
        <p>From sketches and photos to sculptures, fabrics and<br /> cards, if you love it, pack it! The more variations, the<br /> merrier!</p>
      </>
    ),
  },
  {
    number: "3.",
    title: "The Curation",
    image: "/how-curation.png",
    alt: "Children's drawings cut out and arranged for curation",
    content: (
      <>
        <p>I thoughtfully hand-cut, compose and layer the<br /> story, cutting out the best shapes and colours<br /> through a collage, layering them on professional-<br />grade canvas and varnish to preserve them.</p>
        <p>Lastly, I add the touch of my hand print to fill in<br /> the blanks.</p>
      </>
    ),
    scribble: true,
  },
  {
    number: "4.",
    title: "The Delivery",
    image: "/how-delivery.png",
    alt: "A child proudly standing beside two finished collage artworks",
    content: <p>Receive a premium quality collage ready to hang<br /> proudly in your home.</p>,
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" aria-labelledby="how-heading">
      <h2 id="how-heading"><mark>How</mark> it works</h2>
      <div className="how-steps">
        {steps.map((step, index) => (
          <article className={`how-step how-step-${index + 1}`} key={step.number}>
            <div className="how-photo">
              <Image src={step.image} alt={step.alt} width={1320} height={1320} sizes="(max-width: 760px) 82vw, 370px" />
            </div>
            <div className="how-copy">
              <div className="how-title-row">
                <span className="how-number">{step.number}</span>
                <h3>{step.title}</h3>
              </div>
              <div className="how-body">{step.content}</div>
              {step.action && <Link className="how-cta" href="/commissions">START YOUR COMMISSION</Link>}
              {step.scribble && <Image className="how-scribble" src="/how-scribble.png" alt="" width={538} height={545} aria-hidden="true" />}
            </div>
          </article>
        ))}
        <Image className="how-path how-path-1" src="/how-path-1.svg" alt="" width={502} height={190} aria-hidden="true" />
        <Image className="how-path how-path-2" src="/how-path-2.svg" alt="" width={548} height={193} aria-hidden="true" />
        <Image className="how-path how-path-3" src="/how-path-3.svg" alt="" width={506} height={201} aria-hidden="true" />
      </div>
    </section>
  );
}