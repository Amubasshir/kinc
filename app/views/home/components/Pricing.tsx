import Image from "next/image";
import Link from "next/link";
import type { PricingSizeModel } from "../../../models/site";
export default function Pricing({ sizes }: { sizes: PricingSizeModel[] }) {
  return (
    <section className="pricing min-h-[1090px] rounded-[20px] bg-[#f5f5f5] px-0 pt-[68px] pb-20 text-[#555] max-[700px]:min-h-0 max-[700px]:rounded-none max-[700px]:pt-[31px] max-[700px]:pb-[42px]" aria-labelledby="pricing-heading">
      <header className="pricing-header text-center">
        <h2 className="text-[48px] max-[700px]:font-[Georgia] max-[700px]:text-[31px]" id="pricing-heading">Sizes &amp; Pricing</h2>
        <p className="mt-[23px] text-[16px] max-[700px]:mt-[17px] max-[700px]:text-[14px]">Worldwide shipping available soon.</p>
      </header>

      <div className="pricing-grid mt-[57px] grid grid-cols-[repeat(4,299px)] justify-center gap-4 max-[1250px]:grid-cols-[repeat(2,299px)] max-[700px]:mt-[31px] max-[700px]:flex max-[700px]:w-full max-[700px]:flex-col max-[700px]:gap-0">
        {sizes.map((size) => (
          <article className="pricing-card w-[299px] overflow-hidden rounded-[15px] bg-white max-[700px]:w-full max-[700px]:rounded-[17px] max-[700px]:[&:not(:first-child)]:hidden" key={size.name}>
            <div className="pricing-image">
              <Image unoptimized
                src={size.image}
                alt={`${size.name} collage example`}
                width={1200}
                height={1412}
                sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 299px"
              />
              {size.popular && (
                <Image unoptimized
                  className="pricing-popular"
                  src="/pricing-popular.png"
                  alt="Most popular"
                  width={207}
                  height={88}
                />
              )}
            </div>
            <div className="pricing-card-copy">
              <h3>{size.name}</h3>
              <p>
                {size.dimensions}
                <br />
                {size.minimum}
              </p>
              <p className="pricing-price">{size.price}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="pricing-footer mx-auto mt-[59px] flex w-full max-w-[1240px] items-center justify-between gap-10 max-[700px]:mt-8 max-[700px]:box-border max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-[39px] max-[700px]:px-[22px]">
        <div className="pricing-notes">
          <div>
            <h3>NOTE</h3>
            <p>
              Taxes and shipping are calculated separately.
              <br />
              All artworks are made on canvas (no frame) and requires a non-refundable 50% deposit.
              <br />
              <strong>
                <em>Framing is an optional add-on</em>
              </strong>{" "}
              (sourced locally).
              <br />
              See more details upon starting the commission request process.
              <br />
              EST timeframe is ~ 6weeks.
            </p>
          </div>
          <div className="pricing-custom">
            <h3>NEED A DIFFERENT SIZE ARTWORK OR MATERIAL?</h3>
            <p>Custom sizes available upon request.</p>
          </div>
        </div>

        <div className="pricing-action">
          <Image unoptimized src="/pricing-cursor.svg" alt="" width={44} height={58} aria-hidden="true" />
          <Link href="/start-your-commission">START YOUR COMMISSION</Link>
        </div>
      </div>
    </section>
  );
}
