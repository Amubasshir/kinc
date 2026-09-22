"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import GalleryLightbox, { type LightboxImage } from "../../shared/GalleryLightbox";

const currentGalleryImages = [
  "/gallery-page/gallery-images/410B71F0-4287-401C-9726-B1B54ACBE037.JPG",
  "/gallery-page/gallery-images/att.PjvDSzKlCZwzgf7amj8qfpkJ7zRRQErqfwu1G39vY_o.jpg",
  "/gallery-page/gallery-images/BF664436-2AE2-458D-ACF3-01406056BC34.JPG",
  "/gallery-page/gallery-images/Image-1.png",
  "/gallery-page/gallery-images/Image-2.png",
  "/gallery-page/gallery-images/Imagex.png",
  "/gallery-page/gallery-images/IMG_1580.JPG",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_2279.jpg",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_2282.jpg",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_2479.jpg",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_2628.jpg",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_2717.jpg",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_2942.jpg",
  "/gallery-page/gallery-images/IMG_3025.JPG",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_3072.jpg",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_3245.jpg",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_3248.jpg",
  "/gallery-page/gallery-images/browser-fallbacks/IMG_3603.jpg",
];

function getGalleryHeight(number: number) {
  return number === 22 || number === 26 || number === 31 || number === 36
    ? 283
    : number === 23
      ? 397
      : number === 24 || number === 28
        ? 202
        : number === 25 || number === 37
          ? 229
          : number === 27
            ? 264
            : number === 29 || number === 39
              ? 311
              : number === 30
                ? 216
                : number === 32 || number === 34
                  ? 191
                  : number === 33
                    ? 326
                    : number === 35
                      ? 394
                      : 314;
}

export default function Gallery({ columns }: { columns: number[][] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);
  const images: LightboxImage[] = columns.flat().map((number) => ({
    src: currentGalleryImages[number - 22] ?? `/gallery-${number}.png`,
    alt: "KinCollage artwork and creative inspiration",
    width: 208,
    height: getGalleryHeight(number),
  }));
  const mobileColumns: LightboxImage[][] = [[], []];
  const mobileColumnHeights = [0, 0];
  images.forEach((image) => {
    const shortestColumnIndex = mobileColumnHeights[0] <= mobileColumnHeights[1] ? 0 : 1;
    mobileColumns[shortestColumnIndex].push(image);
    mobileColumnHeights[shortestColumnIndex] += image.height / image.width;
  });
  const columnOffsets = columns.map((_, index) => columns.slice(0, index).reduce((total, column) => total + column.length, 0));

  useLayoutEffect(() => {
    const grid = galleryGridRef.current;
    if (!grid) return;

    const alignLastImages = () => {
      if (window.matchMedia("(max-width: 700px)").matches || getComputedStyle(grid).display === "none") return;

      const columnElements = Array.from(grid.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
      const lastImages = columnElements.map((column) => column.lastElementChild as HTMLElement | null).filter((image): image is HTMLElement => Boolean(image));
      if (!lastImages.length) return;

      lastImages.forEach((image) => {
        image.style.height = "";
        image.style.flex = "0 0 auto";
      });

      const maxBottom = Math.max(...lastImages.map((image) => image.getBoundingClientRect().bottom));
      lastImages.forEach((image) => {
        const box = image.getBoundingClientRect();
        const extraHeight = maxBottom - box.bottom;
        if (extraHeight > 0.5) image.style.height = `${box.height + extraHeight}px`;
      });
    };

    alignLastImages();
    const frame = window.requestAnimationFrame(alignLastImages);
    const observer = new ResizeObserver(alignLastImages);
    observer.observe(grid);
    window.addEventListener("resize", alignLastImages);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", alignLastImages);
    };
  }, [columns]);

  return (
    <section id="gallery" className="gallery-section relative min-h-[1030px] overflow-hidden rounded-[20px] px-6 pt-11 pb-[70px] max-[700px]:min-h-0 max-[700px]:rounded-none max-[700px]:px-[10px] max-[700px]:pt-[18px] max-[700px]:pb-[38px]" aria-label="KinCollage gallery">
      <div ref={galleryGridRef} className="gallery-grid mx-auto grid w-full max-w-[1328px] grid-cols-6 gap-4 max-[1350px]:grid-cols-3 max-[700px]:hidden">
        {columns.map((column, columnIndex) => (
          <div className={`gallery-column gallery-column-${columnIndex + 1} flex flex-col gap-4`} key={columnIndex}>
            {column.map((number, imageIndex) => (
              <button
                className="gallery-image-trigger group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
                key={number}
                onClick={() => setActiveIndex(columnOffsets[columnIndex] + imageIndex)}
                style={{ aspectRatio: `208 / ${getGalleryHeight(number)}` }}
                type="button"
                aria-label="Open artwork in gallery viewer"
              >
                <Image unoptimized
                  className="block h-full w-full rounded-[10px] object-cover transition duration-300 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                  src={currentGalleryImages[number - 22] ?? `/gallery-${number}.png`}
                  alt="KinCollage artwork and creative inspiration"
                  width={208}
                  height={getGalleryHeight(number)}
                  sizes="(max-width: 520px) 44vw, (max-width: 900px) 29vw, 208px"
                  style={{ height: "100%", width: "100%" }}
                />
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="gallery-mobile-grid mx-auto hidden w-[94%] grid-cols-2 gap-[5px] max-[700px]:grid" aria-label="KinCollage artwork collage">
        {mobileColumns.map((mobileColumn, columnIndex) => (
          <div className="flex min-w-0 flex-col gap-[5px]" key={columnIndex}>
            {mobileColumn.map((image) => {
              const imageIndex = images.indexOf(image);

              return (
                <button
                  className="group block w-full overflow-hidden rounded-[10px] border-0 bg-transparent p-0 text-left"
                  key={`${image.src}-mobile`}
                  onClick={() => setActiveIndex(imageIndex)}
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                  type="button"
                  aria-label="Open artwork in gallery viewer"
                >
                  <Image
                    unoptimized
                    className="block h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 700px) 45vw, 0px"
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <Link className="button-tertiary gallery-cta mx-auto mt-11 flex h-[53px] w-[200px] shrink-0 items-center justify-center rounded-full text-[14px] leading-none no-underline max-[700px]:mt-[33px] max-[700px]:h-[49px] max-[700px]:w-[181px] max-[700px]:text-[14px]" href="/gallery">
        SEE ALL WORK
      </Link>
      <GalleryLightbox images={images} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => setActiveIndex(null)} />
    </section>
  );
}
