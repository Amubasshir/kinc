"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { GalleryPageViewModel } from "../../models/site";
import GalleryLightbox from "../shared/GalleryLightbox";
import StayConnected from "../shared/StayConnected";
import GalleryCommissionCard from "./components/GalleryCommissionCard";

export default function GalleryView({ viewModel }: { viewModel: GalleryPageViewModel }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryImages = viewModel.columns.flat();
  const columnOffsets = viewModel.columns.map((_, index) => viewModel.columns.slice(0, index).reduce((total, column) => total + column.length, 0));
  const mobileGroups = [
    [viewModel.columns[0].slice(0, 5), viewModel.columns[1].slice(0, 6)],
    [viewModel.columns[0].slice(5, 11), viewModel.columns[1].slice(6, 12)],
  ];

  return (
    <>
      <section className="gallery-page-hero relative h-[651px] overflow-hidden rounded-[20px] bg-[#efefef] max-[800px]:h-auto max-[800px]:rounded-2xl max-[800px]:aspect-[174/192]" aria-label="Gallery introduction">
        <Image unoptimized
          className="block h-full w-full object-cover object-center"
          src="/gallery-page/hero.png"
          alt="A child holding a framed piece of colourful artwork"
          width={1400}
          height={651}
          priority
          sizes="100vw"
        />
        <Image unoptimized
          className="gallery-page-hero-accent gallery-page-hero-accent-left absolute top-[375px] left-[calc(50%_-_302px)] z-[2] block h-[82px] w-[61px] object-contain max-[800px]:top-1/2 max-[800px]:left-[24%] max-[800px]:h-auto max-[800px]:w-11 max-[700px]:hidden"
          src="/gallery-page/hero-accent-left.png"
          alt=""
          width={61}
          height={82}
          aria-hidden="true"
        />
        <Image unoptimized
          className="gallery-page-hero-accent gallery-page-hero-accent-right absolute top-[375px] right-[calc(50%_-_302px)] z-[2] block h-[82px] w-[61px] object-contain max-[800px]:top-1/2 max-[800px]:right-[24%] max-[800px]:h-auto max-[800px]:w-11 max-[700px]:hidden"
          src="/gallery-page/hero-accent-right.png"
          alt=""
          width={61}
          height={82}
          aria-hidden="true"
        />
      </section>
      <section className="gallery-page-masonry grid grid-cols-4 gap-6 overflow-hidden rounded-[20px] bg-[#f5f5f5] px-3 pt-4 max-[800px]:grid-cols-2 max-[800px]:gap-2.5 max-[800px]:rounded-2xl max-[800px]:px-2.5 max-[800px]:pt-2.5 max-[700px]:hidden" aria-label="KinCollage artwork gallery">
        {viewModel.columns.map((column, columnIndex) => (
          <div className={`gallery-page-column gallery-page-column-${columnIndex + 1} flex min-w-0 flex-col gap-6 max-[800px]:gap-2.5`} key={columnIndex}>
            {column.map((item, itemIndex) => (
              <div key={`${item.src}-${itemIndex}`} className="gallery-page-item relative">
                <button className="gallery-page-image-trigger group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left" type="button" onClick={() => setActiveIndex(columnOffsets[columnIndex] + itemIndex)} aria-label="Open artwork in gallery viewer">
                  <Image unoptimized
                    className="block h-auto w-full rounded-[10px] transition duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015]"
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 700px) 47vw, 23vw"
                  />
                </button>
                {columnIndex === 2 && itemIndex === 6 && <GalleryCommissionCard />}
                {columnIndex === 0 && itemIndex === 14 && <GalleryCommissionCard />}
              </div>
            ))}
          </div>
        ))}
      </section>
      <section className="gallery-page-mobile hidden flex-col gap-[5px] rounded-none bg-[#f5f5f5] pb-4 max-[700px]:flex" aria-label="KinCollage artwork gallery">
        {mobileGroups.map((group, groupIndex) => (
          <div className="gallery-page-mobile-block contents" key={groupIndex}>
            <div className="gallery-page-mobile-group grid grid-cols-2 gap-[5px]">
              {group.map((column, columnIndex) => (
                <div className="gallery-page-mobile-column flex min-w-0 flex-col gap-[5px]" key={columnIndex}>
                  {column.map((item, itemIndex) => (
                    <button
                      className="group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
                      key={`${item.src}-${itemIndex}`}
                      type="button"
                      onClick={() => setActiveIndex(galleryImages.indexOf(item))}
                      aria-label="Open artwork in gallery viewer"
                    >
                      <Image unoptimized
                        className="block h-auto w-full rounded-[7px] transition duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015]"
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        sizes="47vw"
                      />
                    </button>
                  ))}
                </div>
              ))}
            </div>
            {groupIndex === 0 && (
              <div className="gallery-page-mobile-card w-full aspect-[174/194]">
                <GalleryCommissionCard />
              </div>
            )}
          </div>
        ))}
        <Link className="gallery-page-mobile-see-all mt-[11px] inline-flex min-h-[23px] w-[88px] items-center self-center justify-center rounded-full border border-[#263443] text-[8px] text-[#263443] no-underline" href="#page-top">
          SEE ALL WORK
        </Link>
      </section>
      <GalleryLightbox images={galleryImages} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => setActiveIndex(null)} />
      <StayConnected />
    </>
  );
}
