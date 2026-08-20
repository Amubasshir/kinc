"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";
import GalleryLightbox from "../../shared/GalleryLightbox";

export default function ArtistCareerGallery({ gallery }: { gallery: ArtistViewModel["careerGallery"] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const images = [
    { src: gallery.src, alt: gallery.alt, width: 1317, height: 1634 },
    { src: gallery.collectionShot.src, alt: "Camilla collection fashion campaign", width: 750, height: 960 },
  ];

  return (
    <section className="artist-career-gallery relative w-[calc(100%-24px)] self-center overflow-hidden rounded-[20px] bg-[linear-gradient(to_bottom,#00d18f_0_430px,#f5f5f5_430px)] max-[700px]:!w-[calc(100vw-36px)] max-[700px]:!max-w-[calc(100vw-36px)] max-[700px]:rounded-2xl max-[700px]:bg-[linear-gradient(to_bottom,#00d18f_0_8px,#f5f5f5_8px)] max-[700px]:pb-[38px]" aria-label="Selected creative work">
      <div className="artist-career-gallery-heading px-10 pt-9 pb-2 max-[700px]:px-5 max-[700px]:pt-6 max-[700px]:pb-1">
        <h2 className="m-0 text-[34px] leading-tight text-[#263443] max-[700px]:text-[26px]">Some of my previous design work:</h2>
      </div>
      <button className="group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left" type="button" onClick={() => setActiveIndex(0)} aria-label="Open artwork in gallery viewer">
        <Image unoptimized className="artist-career-gallery-master block h-auto w-full transition duration-300 ease-out group-hover:scale-[1.008] group-focus-visible:scale-[1.008]" src={gallery.src} alt={gallery.alt} width={1317} height={1634} sizes="calc(100vw - 16px)" />
      </button>
      <figure className="artist-collection-shot absolute top-[77.42%] left-0 m-0 w-[18.98%] bg-[#f5f5f5]">
        <button className="group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left" type="button" onClick={() => setActiveIndex(1)} aria-label="Open artwork in gallery viewer">
          <Image unoptimized className="block h-auto w-full rounded-[14px] transition duration-300 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015]" src={gallery.collectionShot.src} alt="Camilla collection fashion campaign" width={750} height={960} sizes="19vw" />
        </button>
        <figcaption className="relative z-[2] min-h-[52px] bg-[#f5f5f5] pt-[9px] leading-[1.1] text-[#4b4b55]">
          <strong>{gallery.collectionShot.title}</strong>
          <span>{gallery.collectionShot.credit}</span>
        </figcaption>
      </figure>
      <Link className="artist-career-mobile-see-all absolute bottom-2.5 left-1/2 hidden min-h-[23px] w-[91px] -translate-x-1/2 items-center justify-center rounded-full border border-white text-[8px] text-white no-underline max-[700px]:inline-flex" href="#page-top">SEE ALL WORK</Link>
      <GalleryLightbox images={images} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => setActiveIndex(null)} />
    </section>
  );
}
