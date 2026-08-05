import Image from "next/image";
import Link from "next/link";

const productCategories = [
  "TRAVEL TUMBLER",
  "POSTCARD",
  "SPECIAL CARD",
  "CANVAS PRINTS",
  "PHONE CASE",
  "LINEN JOURNAL",
  "T-SHIRT",
  "TOTE BAG",
];

export default function CommissionsPage() {
  return (
    <>
      <section className="commission-intro" aria-labelledby="commission-heading">
        <div className="commission-intro-copy">
          <h1 id="commission-heading">Commission it. Print it. Love it</h1>
          <p>
            Share the magic with family. We can print your child&apos;s custom creation onto a limited<br />
            collection of premium everyday objects, creating an unforgettable keepsake for<br />
            grandparents and loved ones.
          </p>
          <p className="commission-intro-note">Start your commission to add any of these below as add ons.</p>
          <Link className="commission-intro-cta" href="#product-options">START YOUR COMMISSION</Link>
        </div>
      </section>

      <section id="product-options" className="product-menu" aria-label="Commission product categories">
        <nav>
          {productCategories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </nav>
      </section>

      <section className="phone-case-product" aria-labelledby="phone-case-heading">
        <div className="phone-case-visual phone-case-main-visual">
          <Image src="/phone-case-art.png" alt="Custom floral phone case" width={385} height={626} sizes="(max-width: 800px) 100vw, 28vw" />
        </div>

        <div className="phone-case-colour-grid" aria-hidden="true">
          <Image src="/phone-case-yellow.png" alt="" width={385} height={306} />
          <div className="phone-case-tone-card" />
        </div>

        <div className="phone-case-content">
          <h2 id="phone-case-heading">Phone Case</h2>
          <p className="phone-case-description">
            Put your unique spin on a wardrobe essential and order your shirt designs - available as an exclusive add-on when you book your commission.
          </p>

          <div className="phone-case-swatches" aria-label="Available colours">
            {[1, 2, 3, 4, 5].map((swatch) => (
              <Image key={swatch} src={`/phone-case-swatch-${swatch}.svg`} alt={`Colour option ${swatch}`} width={24} height={24} />
            ))}
          </div>

          <div className="phone-case-details">
            <details open>
              <summary>PRODUCT DETAILS</summary>
              <p>
                Quantity depends on your chosen canvas size, but typically 20 to 50 pieces allow for a diverse range of colours and textures. During our consultation, we will discuss the &quot;hero&quot; pieces you definitely want included versus the &quot;texture&quot; pieces I can use for background layering.
              </p>
            </details>
            <details>
              <summary>LOREM IPSUM</summary>
              <p>Additional product information will be available here.</p>
            </details>
            <details>
              <summary>LOREM IPSUM</summary>
              <p>Additional product information will be available here.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="tote-bag-product" aria-labelledby="tote-bag-heading">
        <div className="tote-bag-content">
          <h2 id="tote-bag-heading">Tote Bag</h2>
          <p className="tote-bag-description">
            Put your unique spin on a wardrobe essential and order your shirt designs - available as an exclusive add-on when you book your commission.
          </p>

          <div className="tote-bag-swatches" aria-label="Available colours">
            {[1, 2, 3, 4, 5].map((swatch) => (
              <Image key={swatch} src={`/phone-case-swatch-${swatch}.svg`} alt={`Colour option ${swatch}`} width={24} height={24} />
            ))}
          </div>

          <div className="tote-bag-details">
            <details open>
              <summary>PRODUCT DETAILS</summary>
              <p>
                Quantity depends on your chosen canvas size, but typically 20 to 50 pieces allow for a diverse range of colours and textures. During our consultation, we will discuss the &quot;hero&quot; pieces you definitely want included versus the &quot;texture&quot; pieces I can use for background layering.
              </p>
            </details>
            <details>
              <summary>LOREM IPSUM</summary>
              <p>Additional product information will be available here.</p>
            </details>
            <details>
              <summary>LOREM IPSUM</summary>
              <p>Additional product information will be available here.</p>
            </details>
          </div>
        </div>

        <div className="tote-bag-main-visual">
          <Image src="/tote-bag-art.png" alt="Natural canvas tote bag" width={385} height={626} sizes="(max-width: 800px) 100vw, 28vw" />
        </div>

        <div className="tote-bag-colour-grid" aria-hidden="true">
          <Image src="/tote-bag-neutral.png" alt="" width={385} height={306} />
          <div className="tote-bag-tone-card" />
        </div>
      </section>

      <section className="phone-case-product travel-tumbler-product" aria-labelledby="travel-tumbler-heading">
        <div className="phone-case-visual phone-case-main-visual">
          <Image src="/travel-tumbler-art.png" alt="Natural travel tumbler" width={385} height={626} sizes="(max-width: 800px) 100vw, 28vw" />
        </div>

        <div className="phone-case-colour-grid" aria-hidden="true">
          <Image src="/travel-tumbler-neutral.png" alt="" width={385} height={306} />
          <div className="phone-case-tone-card" />
        </div>

        <div className="phone-case-content">
          <h2 id="travel-tumbler-heading">Travel Tumbler</h2>
          <p className="phone-case-description">
            Put your unique spin on a wardrobe essential and order your shirt designs - available as an exclusive add-on when you book your commission.
          </p>

          <div className="phone-case-swatches" aria-label="Available colours">
            {[1, 2, 3, 4, 5].map((swatch) => (
              <Image key={swatch} src={`/phone-case-swatch-${swatch}.svg`} alt={`Colour option ${swatch}`} width={24} height={24} />
            ))}
          </div>

          <div className="phone-case-details">
            <details open>
              <summary>PRODUCT DETAILS</summary>
              <p>
                Quantity depends on your chosen canvas size, but typically 20 to 50 pieces allow for a diverse range of colours and textures. During our consultation, we will discuss the &quot;hero&quot; pieces you definitely want included versus the &quot;texture&quot; pieces I can use for background layering.
              </p>
            </details>
            <details>
              <summary>LOREM IPSUM</summary>
              <p>Additional product information will be available here.</p>
            </details>
            <details>
              <summary>LOREM IPSUM</summary>
              <p>Additional product information will be available here.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="tshirt-product" aria-labelledby="tshirt-heading">
        <div className="tote-bag-content tshirt-content">
          <h2 id="tshirt-heading">T-shirt</h2>
          <p className="tote-bag-description">
            Put your unique spin on a wardrobe essential and order your shirt designs - available as an exclusive add-on when you book your commission.
          </p>

          <div className="tote-bag-swatches" aria-label="Available colours">
            {[1, 2, 3, 4, 5].map((swatch) => (
              <Image key={swatch} src={`/phone-case-swatch-${swatch}.svg`} alt={`Colour option ${swatch}`} width={24} height={24} />
            ))}
          </div>

          <div className="tote-bag-details">
            <details open>
              <summary>PRODUCT DETAILS</summary>
              <p>
                Quantity depends on your chosen canvas size, but typically 20 to 50 pieces allow for a diverse range of colours and textures. During our consultation, we will discuss the &quot;hero&quot; pieces you definitely want included versus the &quot;texture&quot; pieces I can use for background layering.
              </p>
            </details>
            <details>
              <summary>LOREM IPSUM</summary>
              <p>Additional product information will be available here.</p>
            </details>
            <details>
              <summary>LOREM IPSUM</summary>
              <p>Additional product information will be available here.</p>
            </details>
          </div>
        </div>

        <div className="tshirt-gallery">
          {[1, 2, 3, 4].map((image) => (
            <Image
              key={image}
              src={`/tshirt-product-${image}.png`}
              alt={`Custom printed T-shirt example ${image}`}
              width={385}
              height={306}
              sizes="(max-width: 800px) 46vw, 28vw"
            />
          ))}
        </div>
      </section>
    </>
  );
}