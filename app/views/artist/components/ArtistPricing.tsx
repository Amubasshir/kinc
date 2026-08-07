import Image from "next/image";
import Link from "next/link";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";

export default function ArtistPricing({ pricing }: { pricing: ArtistViewModel["pricing"] }) {
  return (
    <section className="artist-pricing" aria-labelledby="artist-pricing-heading">
      <header className="artist-pricing-header">
        <h2 id="artist-pricing-heading">{pricing.title}</h2>
        <p>{pricing.subtitle}</p>
      </header>
      <div className="artist-pricing-grid">
        {pricing.sizes.map((size) => (
          <article className="artist-pricing-card" key={size.name}>
            <div className="artist-pricing-artwork">
              <Image src={size.image} alt={size.name + " KinCollage example"} width={300} height={353} />
              {size.popular && (
                <Image
                  className="artist-pricing-popular"
                  src="/artist/most-popular.png"
                  alt="Most popular"
                  width={207}
                  height={88}
                />
              )}
            </div>
            <div className="artist-pricing-details">
              <h3>{size.name}</h3>
              <p>
                {size.dimensions}
                <br />({size.minimum})
              </p>
              <strong>{size.price}</strong>
            </div>
          </article>
        ))}
      </div>
      <div className="artist-pricing-footer">
        <div className="artist-pricing-notes">
          <h3>NOTE</h3>
          <p>
            Taxes and shipping are calculated separately.
            <br />
            All artworks are made on canvas (no frame) and requires a non-refundable 50% deposit.
            <br />
            <em>Framing is an optional add-on</em> (sourced locally).
            <br />
            See more details upon starting the commission request process.
            <br />
            EST timeframe is 4-6weeks.
          </p>
          <h3>NEED A DIFFERENT SIZE ARTWORK OR MATERIAL?</h3>
          <p>Custom sizes available upon request.</p>
        </div>
        <div className="artist-pricing-action">
          <Image src="/artist/commission-arrow.svg" alt="" width={44} height={58} aria-hidden="true" />
          <Link href="/commissions">START YOUR COMMISSION</Link>
        </div>
      </div>
    </section>
  );
}
