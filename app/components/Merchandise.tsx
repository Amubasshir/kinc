import Image from "next/image";

const products = [
  { name: "Phone Case", price: "$70 AUD", image: "/merch-phone-case.png", bestseller: true },
  { name: "Tote Bag", price: "$70 AUD", image: "/merch-tote-bag.png" },
  { name: "Travel Tumbler", price: "$70 AUD", image: "/merch-tumbler.png" },
  { name: "T-shirt", price: "$70 AUD", image: "/merch-tshirt.png" },
  { name: "Linen Journal", price: "$70 AUD", image: "/merch-journal.png" },
  { name: "Canvas prints", price: "$70 AUD", image: "/merch-canvas.png" },
  { name: "Special Card", price: "$70 AUD", image: "/merch-card.png" },
  { name: "Postcard", price: "$70 AUD", image: "/merch-postcard.png" },
];

export default function Merchandise() {
  return (
    <section id="merchandise" className="merchandise" aria-labelledby="merchandise-heading">
      <header className="merchandise-header">
        <h2 id="merchandise-heading">Commission it. Print it. <mark>Use it.</mark></h2>
        <p>
          Share the magic with family. Print your child&apos;s custom collage onto a limited collection of<br />
          premium everyday objects, creating an unforgettable keepsake for grandparents and loved<br /> ones.
        </p>
      </header>

      <div className="merchandise-grid">
        {products.map((product) => (
          <article className="merchandise-card" key={product.name}>
            <div className="merchandise-image">
              <Image src={product.image} alt={product.name} width={306} height={306} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 306px" />
              {product.bestseller && (
                <>
                  <Image className="merchandise-bestseller" src="/merch-bestseller.png" alt="Bestseller" width={197} height={97} />
                  <Image className="merchandise-eyelash" src="/merch-eyelash.svg" alt="" width={75} height={88} aria-hidden="true" />
                  <Image className="merchandise-accent" src="/merch-accent.svg" alt="" width={86} height={84} aria-hidden="true" />
                </>
              )}
            </div>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}