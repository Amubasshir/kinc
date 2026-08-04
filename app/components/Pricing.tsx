import Image from "next/image";
import Link from "next/link";

const sizes = [
  { name: "The Mini", dimensions: "30 x 40 cm", minimum: "(Min. 10 artwork required)", price: "$950 AUD", image: "/pricing-mini.png" },
  { name: "The Statement", dimensions: "60x80cm", minimum: "(Min. 15 artwork required)", price: "$1750 AUD", image: "/pricing-statement.png" },
  { name: "The Master", dimensions: "90x 120cm", minimum: "(Min. 40 artwork required)", price: "$3900 AUD", image: "/pricing-master.png", popular: true },
  { name: "The Grand", dimensions: "122 x 183 cm", minimum: "(Min. 60 artwork required)", price: "$6915 AUD", image: "/pricing-grand.png" },
];

export default function Pricing() {
  return (
    <section className="pricing" aria-labelledby="pricing-heading">
      <header className="pricing-header">
        <h2 id="pricing-heading">Sizes &amp; Pricing</h2>
        <p>Worldwide shipping available soon.</p>
      </header>

      <div className="pricing-grid">
        {sizes.map((size) => (
          <article className="pricing-card" key={size.name}>
            <div className="pricing-image">
              <Image src={size.image} alt={`${size.name} collage example`} width={1200} height={1412} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 299px" />
              {size.popular && <Image className="pricing-popular" src="/pricing-popular.png" alt="Most popular" width={207} height={88} />}
            </div>
            <div className="pricing-card-copy">
              <h3>{size.name}</h3>
              <p>{size.dimensions}<br />{size.minimum}</p>
              <p className="pricing-price">{size.price}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="pricing-footer">
        <div className="pricing-notes">
          <div>
            <h3>NOTE</h3>
            <p>
              Taxes and shipping are calculated separately.<br />
              All artworks are made on canvas (no frame) and requires a non-refundable 50% deposit.<br />
              <strong><em>Framing is an optional add-on</em></strong> (sourced locally).<br />
              See more details upon starting the commission request process.<br />
              EST timeframe is ~ 6weeks.
            </p>
          </div>
          <div className="pricing-custom">
            <h3>NEED A DIFFERENT SIZE ARTWORK OR MATERIAL?</h3>
            <p>Custom sizes available upon request.</p>
          </div>
        </div>

        <div className="pricing-action">
          <Image src="/pricing-cursor.svg" alt="" width={44} height={58} aria-hidden="true" />
          <Link href="/commissions">START YOUR COMMISSION</Link>
        </div>
      </div>
    </section>
  );
}