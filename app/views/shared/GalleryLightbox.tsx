"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

export type LightboxImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type GalleryLightboxProps = {
  images: LightboxImage[];
  activeIndex: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
};

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={direction === "previous" ? "M15 18 9 12l6-6" : "m9 18 6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GalleryLightbox({ images, activeIndex, onChange, onClose }: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const onChangeRef = useRef(onChange);
  const onCloseRef = useRef(onClose);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    onChangeRef.current = onChange;
    onCloseRef.current = onClose;
  }, [activeIndex, onChange, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = activeIndexRef.current;
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "ArrowLeft" && currentIndex !== null) {
        onChangeRef.current((currentIndex - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight" && currentIndex !== null) {
        onChangeRef.current((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [images.length, isOpen]);

  if (!isOpen || activeIndex === null || !images[activeIndex] || typeof document === "undefined") return null;

  const image = images[activeIndex];
  const previous = () => onChange((activeIndex - 1 + images.length) % images.length);
  const next = () => onChange((activeIndex + 1) % images.length);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#101418]/92 px-4 py-5 backdrop-blur-md sm:px-16 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Artwork gallery viewer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
        if (Math.abs(distance) > 55) (distance > 0 ? previous : next)();
        touchStartX.current = null;
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 text-white sm:px-7 sm:py-6">
        <span className="rounded-full bg-black/30 px-3 py-1.5 text-sm tracking-[.08em] backdrop-blur-sm" aria-live="polite">
          {activeIndex + 1} / {images.length}
        </span>
        <button
          ref={closeButtonRef}
          className="pointer-events-auto grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/30 text-white transition hover:scale-105 hover:bg-white hover:text-[#182028] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {images.length > 1 && (
        <>
          <button className="absolute bottom-5 left-1/2 z-10 grid h-12 w-12 -translate-x-[130%] cursor-pointer place-items-center rounded-full border border-white/25 bg-black/35 text-white shadow-xl backdrop-blur-sm transition hover:scale-105 hover:bg-white hover:text-[#182028] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2" type="button" onClick={previous} aria-label="Previous artwork">
            <ArrowIcon direction="previous" />
          </button>
          <button className="absolute right-1/2 bottom-5 z-10 grid h-12 w-12 translate-x-[130%] cursor-pointer place-items-center rounded-full border border-white/25 bg-black/35 text-white shadow-xl backdrop-blur-sm transition hover:scale-105 hover:bg-white hover:text-[#182028] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:top-1/2 sm:right-6 sm:bottom-auto sm:translate-x-0 sm:-translate-y-1/2" type="button" onClick={next} aria-label="Next artwork">
            <ArrowIcon direction="next" />
          </button>
        </>
      )}

      <figure className="relative m-0 h-[calc(100dvh-145px)] w-[96vw] max-w-[1400px] sm:h-[calc(100dvh-80px)] sm:w-[88vw]">
        <Image
          unoptimized
          className="rounded-[10px] object-contain drop-shadow-[0_30px_45px_rgb(0_0_0/55%)]"
          src={image.src}
          alt={image.alt || "KinCollage artwork"}
          fill
          sizes="(max-width: 700px) 94vw, 86vw"
          priority
        />
      </figure>
    </div>,
    document.body,
  );
}
