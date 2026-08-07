import Image from "next/image";
import Link from "next/link";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";

export default function ArtistPricing({ pricing }: { pricing: ArtistViewModel["pricing"] }) {
  return (
    <section className="artist-pricing min-h-[1090px] rounded-[20px] bg-[#f5f5f5] pt-[68px] pb-20 text-[#555] max-[1260px]:px-6 max-[650px]:min-h-0 max-[650px]:rounded-2xl max-[650px]:px-[18px] max-[650px]:pt-[58px] max-[650px]:pb-[68px] max-[700px]:px-[14px] max-[700px]:pt-[31px] max-[700px]:pb-[35px]" aria-labelledby="artist-pricing-heading">
      <header className="artist-pricing-header text-center">
        <h2 className="text-[48px] leading-[1.12] max-[650px]:text-[40px] max-[700px]:text-[31px]" id="artist-pricing-heading">{pricing.title}</h2>
        <p className="mt-[23px] text-[16px] leading-[1.4] max-[700px]:mt-3 max-[700px]:text-[13px]">{pricing.subtitle}</p>
      </header>
      <div className="artist-pricing-grid mt-[57px] grid grid-cols-4 justify-center gap-4 max-[900px]:grid-cols-2 max-[650px]:grid-cols-1 max-[700px]:mt-[22px]">
        {pricing.sizes.map((size) => (
          <article className="artist-pricing-card w-[300px] overflow-hidden rounded-[15px] bg-white max-[700px]:w-full max-[700px]:[&:nth-child(n+2)]:hidden" key={size.name}>
            <div className="artist-pricing-artwork relative h-[353px] max-[700px]:h-auto max-[700px]:aspect-[300/353]">
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
      <div className="artist-pricing-footer mt-[59px] flex items-center justify-between gap-10 max-[900px]:items-start max-[900px]:flex-col max-[700px]:mt-[26px] max-[700px]:gap-6">
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
