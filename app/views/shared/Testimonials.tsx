import Image from "next/image";
import type { TestimonialModel } from "../../models/site";

function Stars() {
  return (
    <div className="testimonial-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Image key={index} src="/testimonial-star.svg" alt="" width={16} height={16} aria-hidden="true" />
      ))}
    </div>
  );
}
export default function Testimonials({ testimonials }: { testimonials: TestimonialModel[] }) {
  return (
    <section id="testimonials" className="testimonials" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading">Testimonials</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <Image
              className="testimonial-art"
              src={testimonial.image}
              alt={`Collage artwork commissioned by ${testimonial.name}`}
              width={352}
              height={454}
              sizes="(max-width: 760px) 92vw, 352px"
            />
            <div className="testimonial-copy">
              <blockquote>{testimonial.quote}</blockquote>
              <Stars />
              <div className="testimonial-review">
                {testimonial.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {testimonial.paragraphs.join(" ").length > 250 && <span className="testimonial-less">SEE LESS</span>}
              <footer>
                <cite>{testimonial.name}</cite>
                <p>{testimonial.location}</p>
              </footer>
            </div>
          </article>
        ))}
      </div>
      <div className="testimonial-pagination" aria-hidden="true">
        <span className="active" />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
