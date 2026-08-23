"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { TestimonialModel } from "../../models/site";

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={direction === "previous" ? "M15 18 9 12l6-6" : "m9 18 6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stars() {
  return (
    <div className="testimonial-stars mt-4 flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Image unoptimized className="h-4 w-4" key={index} src="/testimonial-star.svg" alt="" width={16} height={16} aria-hidden="true" />
      ))}
    </div>
  );
}

const PAGE_SIZE = 3;

function TestimonialReview({ paragraphs }: { paragraphs: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const textId = useId();
  const fullText = paragraphs.join(" ");

  useEffect(() => {
    const text = textRef.current;
    if (!text || isExpanded) return;

    const checkOverflow = () => {
      setIsOverflowing(text.scrollHeight > text.clientHeight + 1);
    };

    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(text);

    return () => resizeObserver.disconnect();
  }, [fullText, isExpanded]);

  return (
    <div className="testimonial-review mt-[18px]">
      <p
        className={`m-0 text-[17px] leading-[1.32] text-[#515151] max-[700px]:leading-[1.35] ${isExpanded ? "" : "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]"}`}
        id={textId}
        ref={textRef}
      >
        {fullText}
      </p>
      {(isOverflowing || isExpanded) && (
        <button
          className="testimonial-less mt-[17px] cursor-pointer border-0 bg-transparent p-0 font-[Georgia] text-[16px] text-[#008d91]"
          onClick={() => setIsExpanded((current) => !current)}
          type="button"
          aria-expanded={isExpanded}
          aria-controls={textId}
        >
          {isExpanded ? "SEE LESS" : "SEE MORE"}
        </button>
      )}
    </div>
  );
}

export default function Testimonials({ testimonials }: { testimonials: TestimonialModel[] }) {
  const [activePage, setActivePage] = useState(0);
  const [direction, setDirection] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);
  const pageCount = testimonials.length > PAGE_SIZE ? testimonials.length : 1;
  const visibleTestimonials = Array.from(
    { length: Math.min(PAGE_SIZE, testimonials.length) },
    (_, offset) => testimonials[(activePage + offset) % testimonials.length],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = "none";
    track.style.transform = `translateX(${direction * 48}px)`;
    track.style.opacity = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease-out";
        track.style.transform = "translateX(0)";
        track.style.opacity = "1";
      });
    });
  }, [activePage, direction]);

  const changePage = (nextPage: number, dir: number) => {
    if (nextPage === activePage) return;
    setDirection(dir);
    setActivePage(nextPage);
  };
  const goToPrevious = () => changePage((activePage - 1 + pageCount) % pageCount, -1);
  const goToNext = () => changePage((activePage + 1) % pageCount, 1);

  return (
    <section id="testimonials" className="testimonials rounded-[20px] bg-transparent px-6 pt-[95px] pb-[33px] text-[#5b5b5d] max-[800px]:rounded-2xl max-[800px]:px-[22px] max-[800px]:pt-[70px] max-[800px]:pb-[38px] max-[700px]:rounded-none max-[700px]:px-0 max-[700px]:pt-[30px] max-[700px]:pb-[22px]" aria-labelledby="testimonials-heading">
      <h2 className="text-center text-[48px] leading-[1.15] font-light tracking-[.2px] max-[800px]:text-[42px] max-[700px]:px-[23px] max-[700px]:text-left max-[700px]:font-[Georgia] max-[700px]:text-[31px]" id="testimonials-heading">Testimonials</h2>
      <p className="testimonials-intro mx-[23px] mt-[22px] hidden text-[15px] leading-[1.5] text-[#777] max-[700px]:block [overflow-wrap:anywhere]">Share the magic with family. Print your child&apos;s custom collage onto a limited collection of premium everyday objects, creating an unforgettable keepsake for grandparents and loved ones.</p>
      <div className="testimonials-grid relative mx-auto mt-[69px] w-full max-w-[1154px] max-[1200px]:max-w-[960px] max-[800px]:mt-[52px] max-[800px]:max-w-[420px] max-[700px]:mt-[34px] max-[700px]:max-w-full">
        {pageCount > 1 && (
          <button
            aria-label="Show previous testimonials"
            className="absolute top-1/2 left-[-64px] z-10 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[#dedee3] bg-white text-[#777782] shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition duration-150 hover:border-[#008d91] hover:text-[#008d91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008d60] max-[1200px]:left-[-52px] max-[1200px]:h-10 max-[1200px]:w-10 max-[800px]:left-[-48px] max-[800px]:h-9 max-[800px]:w-9 max-[700px]:hidden"
            onClick={goToPrevious}
            type="button"
          >
            <ArrowIcon direction="previous" />
          </button>
        )}
        <div
          className="grid grid-cols-3 items-start gap-[49px] max-[1200px]:gap-7 max-[800px]:grid-cols-1 max-[800px]:gap-9 max-[700px]:block"
          aria-live="polite"
          ref={trackRef}
        >
        {visibleTestimonials.map((testimonial) => {
          return (
            <article className="testimonial-card overflow-hidden rounded-[17px] bg-white shadow-[0_0_0_1px_rgb(46_46_56/4%)] max-[800px]:rounded-[15px] max-[700px]:w-full max-[700px]:rounded-[18px]" key={testimonial.name}>
            <Image unoptimized
              className="testimonial-art block h-[454px] w-[352px] object-cover max-[1200px]:h-auto max-[1200px]:w-full max-[700px]:aspect-[352/454]"
              src={testimonial.image}
              alt={`Collage artwork commissioned by ${testimonial.name}`}
              width={352}
              height={454}
              sizes="(max-width: 760px) 92vw, 352px"
            />
            <div className="testimonial-copy px-9 pt-[31px] pb-[25px] max-[1200px]:px-[25px] max-[800px]:px-[26px] max-[800px]:pt-[27px] max-[800px]:pb-[30px] max-[700px]:px-[43px] max-[700px]:pt-[29px] max-[700px]:pb-8 [overflow-wrap:anywhere]">
              <blockquote className="m-0 text-[25px] leading-[1.08] font-bold tracking-[-.2px] text-[#59595b] max-[1200px]:text-[22px] max-[800px]:text-[24px] max-[700px]:text-[25px]">{testimonial.quote}</blockquote>
              <Stars />
              <TestimonialReview paragraphs={testimonial.paragraphs} />
              <footer className="mt-[22px]">
                <cite className="block font-[Georgia] text-[38px] leading-[1.05] not-italic text-[#59595b] max-[700px]:text-[31px]">{testimonial.name}</cite>
                <p className="mt-2 text-[17px] leading-[1.2] text-[#515151] max-[700px]:text-[15px]">{testimonial.location}</p>
              </footer>
            </div>
          </article>
          );
        })}
        </div>
        {pageCount > 1 && (
          <button
            aria-label="Show next testimonials"
            className="absolute top-1/2 right-[-64px] z-10 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[#dedee3] bg-white text-[#777782] shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition duration-150 hover:border-[#008d91] hover:text-[#008d91] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008d60] max-[1200px]:right-[-52px] max-[1200px]:h-10 max-[1200px]:w-10 max-[800px]:right-[-48px] max-[800px]:h-9 max-[800px]:w-9 max-[700px]:hidden"
            onClick={goToNext}
            type="button"
          >
            <ArrowIcon direction="next" />
          </button>
        )}
      </div>
      {pageCount > 1 && (
        <div className="testimonial-pagination mt-[45px] flex items-center justify-center gap-2 max-[800px]:mt-[38px] max-[700px]:mt-[27px]" aria-label="Choose a set of testimonials">
          {Array.from({ length: pageCount }, (_, page) => (
            <button
              aria-label={`Show testimonials starting with ${testimonials[page].name}`}
              aria-pressed={page === activePage}
              className={`h-3 w-3 cursor-pointer rounded-full border-0 p-0 transition duration-150 hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008d60] ${page === activePage ? "bg-[#777782]" : "bg-[#dedee3]"}`}
              key={page}
              onClick={() => changePage(page, page > activePage ? 1 : -1)}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  );
}
