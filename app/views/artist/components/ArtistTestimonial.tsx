import Image from "next/image";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";

export default function ArtistTestimonial({ testimonial }: { testimonial: ArtistViewModel["testimonial"] }) {
  const [intro, quote] = testimonial.paragraphs;
  const [beforeHighlight, afterHighlight] = quote.split(testimonial.highlightedText);

  return (
    <section className="artist-testimonial relative h-[743px] overflow-hidden rounded-[20px] text-[#263443] max-[900px]:h-auto max-[900px]:min-h-[520px] max-[900px]:aspect-[1398/743] max-[600px]:min-h-[490px] max-[600px]:rounded-2xl max-[700px]:min-h-[420px] max-[700px]:bg-[#00d18f]" aria-label={"Testimonial from " + testimonial.name}>
      <Image unoptimized
        className="artist-testimonial-background absolute inset-0 block h-full w-full object-cover max-[700px]:hidden"
        src="/artist/testimonial-bg.png"
        alt=""
        width={1398}
        height={743}
        aria-hidden="true"
      />
      <div className="artist-testimonial-stack absolute top-[132px] left-1/2 h-[478px] w-[min(1240px,calc(100%-112px))] -translate-x-1/2 max-[900px]:top-[18%] max-[900px]:h-[64%] max-[900px]:w-[90%] max-[600px]:top-[12%] max-[600px]:h-[76%] max-[600px]:w-[calc(100%-32px)] max-[700px]:top-[34px] max-[700px]:h-[calc(100%-80px)] max-[700px]:w-[calc(100%-30px)]">
        <Image unoptimized
          className="artist-testimonial-shadow absolute top-6 left-[26px] z-0 h-full w-full object-fill max-[900px]:top-[5%] max-[900px]:left-[2%] max-[600px]:top-3 max-[600px]:left-3 max-[700px]:top-[11px] max-[700px]:left-2.5"
          src="/artist/testimonial-shadow.png"
          alt=""
          width={1233}
          height={454}
          aria-hidden="true"
        />
        <div className="artist-testimonial-card absolute inset-0 z-[1] grid place-items-center overflow-hidden rounded-[20px] max-[600px]:rounded-2xl">
          <Image unoptimized
            className="artist-testimonial-card-background absolute inset-0 block h-full w-full object-fill"
            src="/artist/testimonial-card.png"
            alt=""
            width={1240}
            height={478}
            aria-hidden="true"
          />
          <Image unoptimized
            className="artist-testimonial-quote-mark absolute right-[22px] bottom-[-12px] z-[1] h-auto w-[236px] max-[900px]:w-[15%] max-[600px]:right-1.5 max-[600px]:bottom-[-6px] max-[600px]:w-28"
            src="/artist/testimonial-quote.png"
            alt=""
            width={236}
            height={202}
            aria-hidden="true"
          />
          <blockquote className="relative z-[2] m-0 w-[min(860px,calc(100%-100px))] text-center max-[900px]:w-[calc(100%-60px)] max-[600px]:w-[calc(100%-36px)]">
            <div className="artist-testimonial-stars text-[15px] tracking-px max-[600px]:text-[13px]" aria-label={testimonial.rating + " out of 5 stars"}>
              {"★".repeat(testimonial.rating)}
            </div>
            <p className="mt-6 text-[24px] leading-[1.22] max-[900px]:mt-[18px] max-[900px]:text-[clamp(16px,2.1vw,24px)] max-[600px]:text-[15px] max-[600px]:leading-[1.35]">
              {intro}
              <br />
              {beforeHighlight}
              <mark>{testimonial.highlightedText}</mark>
              {afterHighlight}
            </p>
            <footer className="mt-[18px] flex flex-col items-center max-[600px]:mt-4">
              <strong className="text-[29px] leading-[1.1] font-normal max-[900px]:text-[clamp(23px,3vw,29px)]">{testimonial.name}</strong>
              <span className="mt-2 text-[12px] leading-none">{testimonial.location}</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
