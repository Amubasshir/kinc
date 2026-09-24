"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";
import GalleryLightbox from "../../shared/GalleryLightbox";
import GalleryCommissionCard from "../../gallery/components/GalleryCommissionCard";

export default function ArtistCareerGallery({ gallery }: { gallery: ArtistViewModel["careerGallery"] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const images = gallery.images.map((image) => ({ src: image.src, alt: image.alt, width: 1200, height: 1200 }));
  const mobileImages = (showAllMobile ? gallery.images : gallery.images.slice(0, 6)).slice().sort((first, second) => second.height / Math.max(second.width, 1) - first.height / Math.max(first.width, 1));
  const mobileColumns: Array<Array<(typeof gallery.images)[number]>> = [[], []];
  const mobileColumnHeights = [0, 0];

  mobileImages.forEach((image) => {
    const columnIndex = mobileColumnHeights[0] <= mobileColumnHeights[1] ? 0 : 1;
    mobileColumns[columnIndex].push(image);
    mobileColumnHeights[columnIndex] += image.height / Math.max(image.width, 1) + (image.caption ? 0.12 : 0);
  });
  const mobileGridImages = Array.from({ length: Math.max(mobileColumns[0].length, mobileColumns[1].length) }).flatMap((_, rowIndex) => [mobileColumns[0][rowIndex], mobileColumns[1][rowIndex]].filter((image): image is (typeof gallery.images)[number] => Boolean(image)));
  type MobileGridItem =
    | { kind: "image"; image: (typeof gallery.images)[number] }
    | { kind: "commission" };
  const mobileGridItems: MobileGridItem[] = mobileGridImages.map((image) => ({ kind: "image", image }));
  mobileGridItems.splice(Math.min(3, mobileGridItems.length), 0, { kind: "commission" });

  return (
    <section className="artist-career-gallery" aria-label="Selected creative work">
      <div className="artist-career-gallery-heading px-10 pt-[53px] pb-[39px] text-center max-[700px]:px-5 max-[700px]:pt-10 max-[700px]:pb-5">
        <h2 className="m-0 text-[26px] leading-[1.15] tracking-[0.2px] text-[#263443] max-[700px]:mx-auto max-[700px]:max-w-[320px] max-[700px]:text-[28px]">Selected past works &amp; archives</h2>
      </div>
      <div className="artist-career-gallery-canvas">
        {gallery.images.map((image, index) => (
          <figure
            className={`artist-career-gallery-tile${image.caption ? " artist-career-gallery-tile-captioned" : ""}${image.caption?.title === "Collection shot" ? " artist-career-gallery-tile-collection" : ""}${image.caption?.title === "Crocodile Dundee Print" ? " artist-career-gallery-tile-print" : ""}`}
            key={image.src}
            style={{
              left: `${image.left}%`,
              top: `${image.top}%`,
              width: `${image.width}%`,
              height: `${image.height}%`,
            }}
          >
            <button className="group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left" type="button" onClick={() => setActiveIndex(index)} aria-label={`Open ${image.alt} in gallery viewer`}>
              <Image unoptimized className="artist-career-gallery-tile-image block h-auto w-full object-contain transition duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015]" src={image.src} alt={image.alt} width={1200} height={1200} sizes="(max-width: 700px) 45vw, 18vw" />
            </button>
            {image.caption && (
              <figcaption>
                <strong>{image.caption.title}</strong>
                <span>{image.caption.credit}</span>
              </figcaption>
            )}
          </figure>
        ))}
        <div className="artist-career-gallery-swatches" aria-label="Selected textile colour palette">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="artist-career-gallery-mobile-grid" aria-label="Selected creative work in two columns">
        {mobileGridItems.map((item, itemIndex) => {
          if (item.kind === "commission") {
            return (
              <div className="gallery-page-mobile-inline-card" key="artist-mobile-commission-card">
                <GalleryCommissionCard />
              </div>
            );
          }

          const image = item.image;
          const imageIndex = gallery.images.indexOf(image);

          return (
            <figure
              className={`artist-career-gallery-mobile-tile${image.caption ? " artist-career-gallery-tile-captioned" : ""}`}
              key={image.src || itemIndex}
            >
              <button className="group block h-full w-full cursor-zoom-in border-0 bg-transparent p-0 text-left" type="button" onClick={() => setActiveIndex(imageIndex)} aria-label={`Open ${image.alt} in gallery viewer`}>
                <Image unoptimized className="artist-career-gallery-mobile-tile-image block h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015]" src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 700px) 45vw, 18vw" />
              </button>
              {image.caption && (
                <figcaption>
                  <strong>{image.caption.title}</strong>
                  <span>{image.caption.credit}</span>
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
      <button className="button-tertiary gallery-cta mx-auto mt-[33px] hidden h-[49px] w-[181px] items-center justify-center rounded-full border-0 text-[14px] leading-none max-[700px]:flex" type="button" onClick={() => setShowAllMobile((current) => !current)}>
        {showAllMobile ? "SHOW LESS" : "SEE ALL WORK"}
      </button>
      <GalleryLightbox images={images} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => setActiveIndex(null)} />
    </section>
  );
}
