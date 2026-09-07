"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";
import GalleryLightbox from "../../shared/GalleryLightbox";

export default function ArtistCareerGallery({ gallery }: { gallery: ArtistViewModel["careerGallery"] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollToPageTop = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("page-top");
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "#page-top");
  };
  const images = gallery.images.map((image) => ({ src: image.src, alt: image.alt, width: 1200, height: 1200 }));

  return (
    <section className="artist-career-gallery" aria-label="Selected creative work">
      <div className="artist-career-gallery-heading px-10 pt-[53px] pb-[39px] text-center max-[700px]:px-5 max-[700px]:pt-6 max-[700px]:pb-4">
        <h2 className="m-0 text-[26px] leading-[1.15] tracking-[0.2px] text-[#263443] max-[700px]:text-[23px]">Selected past works &amp; archives</h2>
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
      <Link className="button-tertiary artist-career-mobile-see-all absolute bottom-2.5 left-1/2 hidden min-h-[23px] w-[91px] -translate-x-1/2 items-center justify-center rounded-full text-[8px] no-underline max-[700px]:inline-flex" href="#page-top" onClick={scrollToPageTop}>SEE ALL WORK</Link>
      <GalleryLightbox images={images} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => setActiveIndex(null)} />
    </section>
  );
}
