"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryMediaModel, GalleryPageViewModel } from "../../models/site";
import GalleryLightbox from "../shared/GalleryLightbox";
import StayConnected from "../shared/StayConnected";
import GalleryCommissionCard from "./components/GalleryCommissionCard";

type GalleryMediaProps = {
  item: GalleryMediaModel;
  className: string;
  sizes: string;
};

function GalleryImage({ item, className, sizes }: GalleryMediaProps) {
  const [src, setSrc] = useState(item.src);

  return (
    <Image
      unoptimized
      className={className}
      src={src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      sizes={sizes}
      onError={() => {
        if (item.fallbackSrc && src !== item.fallbackSrc) setSrc(item.fallbackSrc);
      }}
    />
  );
}

function GalleryMedia({ item, className, sizes }: GalleryMediaProps) {
  if (item.kind === "video") {
    return (
      <video
        className={className}
        src={item.src}
        width={item.width}
        height={item.height}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-label={item.alt}
      />
    );
  }

  return <GalleryImage item={item} className={className} sizes={sizes} />;
}

export default function GalleryView({ viewModel }: { viewModel: GalleryPageViewModel }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryMedia = viewModel.media;
  const mobileColumns: GalleryMediaModel[][] = Array.from({ length: 2 }, () => []);
  galleryMedia.forEach((item, index) => mobileColumns[index % mobileColumns.length].push(item));

  return (
    <>
      <section className="gallery-page-hero relative h-[651px] overflow-hidden rounded-[20px] bg-[#efefef] max-[800px]:h-auto max-[800px]:rounded-[20px] max-[800px]:aspect-[174/192]" aria-label="Gallery introduction">
        <Image
          unoptimized
          className="gallery-page-hero-image block h-full w-full object-cover"
          src="/gallery-page/gallery-bg.png"
          alt="A child holding a framed piece of colourful artwork"
          width={4032}
          height={1440}
          preload
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
      <section className="gallery-page-masonry grid grid-cols-4 gap-6 overflow-hidden rounded-[20px] bg-[#f5f5f5] px-3 pt-4 max-[1000px]:gap-2.5 max-[1000px]:rounded-[20px] max-[1000px]:px-2.5 max-[1000px]:pt-2.5 max-[700px]:hidden" aria-label="KinCollage artwork gallery">
        {viewModel.columns.map((column, columnIndex) => (
          <div className={`gallery-page-column gallery-page-column-${columnIndex + 1} flex min-w-0 flex-col gap-6 max-[1000px]:gap-2.5`} key={columnIndex}>
            {column.map((item, itemIndex) => (
              <div key={`${item.src}-${itemIndex}`} className="gallery-page-item relative">
                <button className="gallery-page-image-trigger group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left" type="button" onClick={() => setActiveIndex(galleryMedia.indexOf(item))} aria-label={`Open ${item.alt}`}>
                  <GalleryMedia
                    item={item}
                    className="block h-auto w-full rounded-[20px] object-cover transition duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015]"
                    sizes="(max-width: 1000px) 48vw, 23vw"
                  />
                </button>
                {columnIndex === 3 && itemIndex === 5 && <GalleryCommissionCard />}
              </div>
            ))}
          </div>
        ))}
      </section>
      <section className="gallery-page-mobile hidden flex-col gap-[5px] rounded-none bg-[#f5f5f5] pb-4 max-[700px]:flex" aria-label="KinCollage artwork gallery">
        <div className="gallery-page-mobile-grid grid grid-cols-2 gap-[5px]">
          {mobileColumns.map((column, columnIndex) => (
            <div className="gallery-page-mobile-column flex min-w-0 flex-col gap-[5px]" key={columnIndex}>
              {column.map((item) => (
                <button
                  className="group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
                  key={item.src}
                  type="button"
                  onClick={() => setActiveIndex(galleryMedia.indexOf(item))}
                  aria-label={`Open ${item.alt}`}
                >
                  <GalleryMedia item={item} className="block h-auto w-full rounded-[20px] object-cover transition duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015]" sizes="47vw" />
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="gallery-page-mobile-card w-full aspect-[174/194]">
          <GalleryCommissionCard />
        </div>
      </section>
      <GalleryLightbox images={galleryMedia} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => setActiveIndex(null)} />
      <StayConnected />
    </>
  );
}
