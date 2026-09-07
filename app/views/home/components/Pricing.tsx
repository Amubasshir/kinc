"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { PricingSizeModel } from "../../../models/site";

function PricingCard({ size }: { size: PricingSizeModel }) {
  return (
    <article className="pricing-card w-[299px] rounded-[15px] bg-white max-[700px]:w-full max-[700px]:rounded-[17px]" key={size.name}>
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
        <p className="pricing-dimensions">
          <strong>{size.inchDimensions ?? size.dimensions}{size.inchDimensions ? ` (${size.dimensions})` : null}</strong>
          <br />
          {size.minimum}
        </p>
        <p className="pricing-price">{size.price}</p>
        <Link
          className="button-primary mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full px-6 text-[14px] font-semibold no-underline"
          href={`/start-your-commission${size.purchaseId ? `?product=${size.purchaseId}` : ""}`}
        >
          BUY NOW
        </Link>
      </div>
    </article>
  );
}

export default function Pricing({ sizes }: { sizes: PricingSizeModel[] }) {
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const selectMobileSize = (index: number) => {
    const track = mobileTrackRef.current;
    const slide = track?.children[index];
    if (!slide) return;

    setActiveMobileIndex(index);
    slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };
  const handleMobileScroll = () => {
    const track = mobileTrackRef.current;
    if (!track || !track.clientWidth) return;

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    if (nextIndex !== activeMobileIndex) setActiveMobileIndex(nextIndex);
  };

  return (
    <section className="pricing min-h-[1090px] rounded-[20px] bg-[#f5f5f5] px-0 pt-[68px] pb-20 text-[#555] max-[700px]:min-h-0 max-[700px]:rounded-none max-[700px]:pt-[31px] max-[700px]:pb-[42px]" aria-labelledby="pricing-heading">
      <header className="pricing-header text-center">
        <h2 className="text-[48px] max-[700px]:font-[Georgia] max-[700px]:text-[31px]" id="pricing-heading">Sizes &amp; Pricing</h2>
        <p className="mt-[23px] text-[16px] max-[700px]:mt-[17px] max-[700px]:text-[14px]">
          Worldwide shipping available.
          <br />
          🎁 <strong>FREE 2026 Gift:</strong> Custom magnet of your kid’s art ($20 Value)
        </p>
      </header>

      <div className="pricing-grid mt-[57px] grid grid-cols-[repeat(4,299px)] justify-center gap-4 max-[1250px]:grid-cols-[repeat(2,299px)] max-[700px]:hidden">
        {sizes.map((size) => <PricingCard key={size.name} size={size} />)}
      </div>
      <div className="pricing-mobile-carousel hidden max-[700px]:mt-[31px] max-[700px]:block">
        <div
          className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Swipe through sizes and pricing"
          onScroll={handleMobileScroll}
          ref={mobileTrackRef}
        >
          {sizes.map((size) => (
            <div className="w-full shrink-0 snap-start" key={size.name}>
              <PricingCard size={size} />
            </div>
          ))}
        </div>
        {sizes.length > 1 && (
          <div className="pricing-mobile-pagination mt-[17px] flex items-center justify-center gap-2" aria-label="Choose a size">
            {sizes.map((size, index) => (
              <button
                aria-label={`Show ${size.name}`}
                aria-pressed={index === activeMobileIndex}
                className={`h-2 w-2 cursor-pointer rounded-full border-0 p-0 transition duration-150 hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008d60] ${index === activeMobileIndex ? "bg-[#777782]" : "bg-[#dedee3]"}`}
                key={size.name}
                onClick={() => selectMobileSize(index)}
                type="button"
              />
            ))}
          </div>
        )}
      </div>

      <div className="pricing-footer mx-auto mt-[59px] w-full max-w-[1240px] max-[1100px]:px-8 max-[700px]:mt-8 max-[700px]:px-4">
        <div className="pricing-notes grid grid-cols-3 gap-10 max-[700px]:grid-cols-1 max-[700px]:justify-items-stretch max-[700px]:gap-6 max-[700px]:px-0 max-[700px]:text-left">
          <div>
            <h3>COSTS</h3>
            <p>
              ✧ Secure Checkout. Choose between Full Payment or 3 Fortnightly Installments on the next screen.
              <br />
              ✧ Prices reflect current 2026 rates and are subject to change for future booking windows.
              <br />
              ✧ Remaining balance, taxes if applicable are calculated separately upon completion.
            </p>
          </div>
          <div>
            <h3>SHIPPING</h3>
            <p>
              ✧ <strong>AUS Standard:</strong> 2 - 8 business days
              <br />
              ✧ <strong>AUS Express:</strong> 1 - 4 business days
              <br />
              ✧ <strong>International:</strong>
              <br />
              USA: 6 - 9 business days
              <br />
              NZ: 4 - 7 business days
              <br />
              ✧ <strong>Rest of the world:</strong> 10 - 14 days
              <br />
              ✧ For full shipping details, please <Link href="/legal#shipping"><strong>click here</strong></Link>
            </p>
          </div>
          <div>
            <h3>Need a different size artwork or material?</h3>
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
