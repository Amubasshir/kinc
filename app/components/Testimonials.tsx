import Image from "next/image";

const testimonials = [
  {
    name: "Catherine",
    location: "Sydney, Australia",
    image: "/testimonial-catherine.png",
    quote: "“look into the joy of childhood, the one my family has created”",
    paragraphs: [
      "Not just paper, colour and glue it’s layers of laughter, joy, smiles, mess, tears memories the art work makes my heart glow.",
      "Friends stop and look it offers a moment to pause and look into the joy of childhood, the one my family has created.",
      "Sophie has artistically brought together moments of my mothering journey. My love, my time with my individual children to one canvas to delve into remembering to reflect to see the moments on one canvas is magical.",
    ],
  },
  {
    name: "Matt",
    location: "Sydney, Australia",
    image: "/testimonial-matt.png",
    quote: "“it’s so much more than a collage, it’s a keepsake that we will treasure forever”",
    paragraphs: [
      "We love our KinCollage artwork so much! Sophie was amazing from the start, her passion for her work is clear and her attention to detail comes through in the finished product. She somehow brought so many separate pieces of the kids craft into one, beautiful cohesive artwork - It’s so much more than a collage, it’s a keepsake that we will treasure forever!",
    ],
  },
  {
    name: "Seb",
    location: "Sydney, Australia",
    image: "/testimonial-seb.png",
    quote: "“these special people are my brother and sister”",
    paragraphs: [
      "It’s not one persons artwork it’s a collage of multiple people, these special people are my brother and sister.",
    ],
  },
];

function Stars() {
  return (
    <div className="testimonial-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Image key={index} src="/testimonial-star.svg" alt="" width={16} height={16} aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading">Testimonials</h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <Image className="testimonial-art" src={testimonial.image} alt={`Collage artwork commissioned by ${testimonial.name}`} width={352} height={454} sizes="(max-width: 760px) 92vw, 352px" />
            <div className="testimonial-copy">
              <blockquote>{testimonial.quote}</blockquote>
              <Stars />
              <div className="testimonial-review">
                {testimonial.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
        <span className="active" /><span /><span /><span /><span /><span />
      </div>
    </section>
  );
}