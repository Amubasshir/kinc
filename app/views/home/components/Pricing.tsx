import Image from "next/image";
import Link from "next/link";
import type { PricingSizeModel } from "../../../models/site";
export default function Pricing({ sizes }: { sizes: PricingSizeModel[] }) {
  return (
    <section className="pricing min-h-[1090px] rounded-[20px] bg-[#f5f5f5] px-0 pt-[68px] pb-20 text-[#555] max-[700px]:min-h-0 max-[700px]:rounded-none max-[700px]:pt-[31px] max-[700px]:pb-[42px]" aria-labelledby="pricing-heading">
      <header className="pricing-header text-center">
        <h2 className="text-[48px] max-[700px]:font-[Georgia] max-[700px]:text-[31px]" id="pricing-heading">Sizes &amp; Pricing</h2>
        <p className="mt-[23px] text-[16px] max-[700px]:mt-[17px] max-[700px]:text-[14px]">Worldwide shipping available. Arrives in ~ 6weeks.</p>
      </header>

      <div className="pricing-grid mt-[57px] grid grid-cols-[repeat(4,299px)] justify-center gap-4 max-[1250px]:grid-cols-[repeat(2,299px)] max-[700px]:mt-[31px] max-[700px]:flex max-[700px]:w-full max-[700px]:flex-col max-[700px]:gap-0">
        {sizes.map((size) => (
          <article className="pricing-card w-[299px] rounded-[15px] bg-white max-[700px]:w-full max-[700px]:rounded-[17px] max-[700px]:[&:not(:first-child)]:hidden" key={size.name}>
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
              <Link
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#97ff77] px-6 text-[14px] font-semibold text-[#344153] no-underline transition hover:-translate-y-0.5 hover:bg-[#7ff45d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008d60]"
                href={`/start-your-commission${size.purchaseId ? `?product=${size.purchaseId}` : ""}`}
              >
                Buy Now
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="pricing-footer mx-auto mt-[59px] w-full max-w-[1240px] max-[1100px]:px-8 max-[700px]:mt-8 max-[700px]:px-[22px]">
        <div className="pricing-notes grid grid-cols-3 gap-10 max-[700px]:grid-cols-1 max-[700px]:justify-items-center max-[700px]:gap-[39px] max-[700px]:px-8 max-[700px]:text-center">
          <div>
            <h3>COSTS</h3>
            <p>
              ✧ All commissions require a <strong>full payment</strong> at checkout.
              <br />
              ✧ Remaining balance, taxes, and shipping are calculated separately upon completion.
            </p>
          </div>
          <div>
            <h3>SHIPPING</h3>
            <p>
              ✧ <strong>AUS Standard:</strong> 2 - 8 business days
              <br />
              ✧ <strong>AUS Express:</strong> 1 - 4 business days
              <br />
              ✧ <strong>International:</strong> USA: 6 - 9 business days NZ: 4 - 7 business days
              <br />
              ✧ <strong>Rest of the world:</strong> 10 - 14 days
              <br />
              ✧ For full shipping details, please <Link href="/legal#shipping"><strong>click here</strong></Link>.
            </p>
          </div>
          <div>
            <h3>NEED A DIFFERENT SIZE ARTWORK OR MATERIAL?</h3>
            <p>
              ✧ Additional custom sizes are available to select on the order form.
              <br />
              ✧ Standard pieces are crafted on canvas with oak frame.
              <br />
              ✧ For custom surfaces, sizes or special requests, please reach out directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
