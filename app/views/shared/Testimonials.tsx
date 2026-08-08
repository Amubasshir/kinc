"use client";

import Image from "next/image";
import { useState } from "react";
import type { TestimonialModel } from "../../models/site";

function Stars() {
  return (
    <div className="testimonial-stars mt-4 flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Image className="h-4 w-4" key={index} src="/testimonial-star.svg" alt="" width={16} height={16} aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials }: { testimonials: TestimonialModel[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials" className="testimonials min-h-[1520px] rounded-[20px] bg-transparent px-6 pt-[95px] pb-[66px] text-[#5b5b5d] max-[800px]:min-h-0 max-[800px]:rounded-2xl max-[800px]:px-[22px] max-[800px]:pt-[70px] max-[800px]:pb-[76px] max-[700px]:rounded-none max-[700px]:px-0 max-[700px]:pt-[30px] max-[700px]:pb-[43px]" aria-labelledby="testimonials-heading">
      <h2 className="text-center text-[48px] leading-[1.15] font-light tracking-[.2px] max-[800px]:text-[42px] max-[700px]:px-[23px] max-[700px]:text-left max-[700px]:font-[Georgia] max-[700px]:text-[31px]" id="testimonials-heading">Testimonials</h2>
      <p className="testimonials-intro mx-[23px] mt-[22px] hidden text-[15px] leading-[1.5] text-[#777] max-[700px]:block [overflow-wrap:anywhere]">Share the magic with family. Print your child&apos;s custom collage onto a limited collection of premium everyday objects, creating an unforgettable keepsake for grandparents and loved ones.</p>
      <div className="testimonials-grid mx-auto mt-[69px] grid w-full max-w-[1154px] grid-cols-3 items-start gap-[49px] max-[1200px]:max-w-[960px] max-[1200px]:gap-7 max-[800px]:mt-[52px] max-[800px]:max-w-[420px] max-[800px]:grid-cols-1 max-[800px]:gap-9 max-[700px]:mt-[34px] max-[700px]:block max-[700px]:max-w-full" aria-live="polite">
        {testimonials.map((testimonial, index) => (
          <article className={`testimonial-card overflow-hidden rounded-[17px] bg-white shadow-[0_0_0_1px_rgb(46_46_56/4%)] max-[800px]:rounded-[15px] max-[700px]:w-full max-[700px]:rounded-[18px] ${index === activeIndex ? "max-[700px]:block" : "max-[700px]:hidden"}`} key={testimonial.name}>
            <Image
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
              <div className="testimonial-review mt-[18px]">
                {testimonial.paragraphs.map((paragraph) => (
                  <p className="m-0 text-[17px] leading-[1.32] text-[#858587] [&+p]:mt-6 max-[700px]:leading-[1.35] max-[700px]:[&:nth-child(n+2)]:hidden" key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {testimonial.paragraphs.join(" ").length > 250 && <span className="testimonial-less mt-[17px] inline-block font-[Georgia] text-[16px] text-[#008d91]">SEE LESS</span>}
              <footer className="mt-[22px]">
                <cite className="block font-[Georgia] text-[38px] leading-[1.05] not-italic text-[#59595b] max-[700px]:text-[31px]">{testimonial.name}</cite>
                <p className="mt-2 text-[17px] leading-[1.2] text-[#555] max-[700px]:text-[15px]">{testimonial.location}</p>
              </footer>
            </div>
          </article>
        ))}
      </div>
      <div className="testimonial-pagination mt-[45px] flex items-center justify-center gap-2 max-[800px]:mt-[38px] max-[700px]:mt-[27px]" aria-label="Choose a testimonial">
        {testimonials.map((testimonial, index) => (
          <button
            aria-label={`Show testimonial from ${testimonial.name}`}
            aria-pressed={index === activeIndex}
            className={`h-3 w-3 cursor-pointer rounded-full border-0 p-0 transition duration-150 hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008d60] ${index === activeIndex ? "bg-[#777782]" : "bg-[#dedee3]"}`}
            key={testimonial.name}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
