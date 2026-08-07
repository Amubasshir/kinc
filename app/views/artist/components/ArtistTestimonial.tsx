import Image from "next/image";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";

export default function ArtistTestimonial({ testimonial }: { testimonial: ArtistViewModel["testimonial"] }) {
  const [intro, quote] = testimonial.paragraphs;
  const [beforeHighlight, afterHighlight] = quote.split(testimonial.highlightedText);

  return (
    <section className="artist-testimonial" aria-label={"Testimonial from " + testimonial.name}>
      <Image className="artist-testimonial-background" src="/artist/testimonial-bg.png" alt="" width={1398} height={743} aria-hidden="true" />
      <div className="artist-testimonial-stack">
        <Image className="artist-testimonial-shadow" src="/artist/testimonial-shadow.png" alt="" width={1233} height={454} aria-hidden="true" />
        <div className="artist-testimonial-card">
          <Image className="artist-testimonial-card-background" src="/artist/testimonial-card.png" alt="" width={1240} height={478} aria-hidden="true" />
          <Image className="artist-testimonial-quote-mark" src="/artist/testimonial-quote.png" alt="" width={236} height={202} aria-hidden="true" />
          <blockquote>
            <div className="artist-testimonial-stars" aria-label={testimonial.rating + " out of 5 stars"}>{"★".repeat(testimonial.rating)}</div>
            <p>{intro}<br />{beforeHighlight}<mark>{testimonial.highlightedText}</mark>{afterHighlight}</p>
            <footer><strong>{testimonial.name}</strong><span>{testimonial.location}</span></footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}