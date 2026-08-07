import Image from "next/image";
import type { CommissionProductModel } from "../../../models/site";
import ProductDetails from "./ProductDetails";
const description =
  "Put your unique spin on a wardrobe essential and order your shirt designs - available as an exclusive add-on when you book your commission.";
function Content({ product }: { product: CommissionProductModel }) {
  return (
    <div className={product.contentClassName}>
      <h2 id={`${product.id}-heading`}>{product.title}</h2>
      <p className={product.descriptionClassName}>{description}</p>
      <ProductDetails className={product.detailsClassName} swatchesClassName={product.swatchesClassName} />
    </div>
  );
}
function Gallery({ product }: { product: CommissionProductModel }) {
  return (
    <div className={product.galleryClassName}>
      {product.galleryImages?.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={product.galleryAlt(index)}
          width={385}
          height={306}
          sizes="(max-width: 800px) 46vw, 28vw"
        />
      ))}
    </div>
  );
}
function Visual({ product }: { product: CommissionProductModel }) {
  const prefix = product.layout === "visual-right" ? "tote-bag" : "phone-case";
  return (
    <>
      <div className={`${prefix === "phone-case" ? "phone-case-visual " : ""}${prefix}-main-visual`}>
        <Image
          src={product.mainImage!}
          alt={product.mainImageAlt!}
          width={385}
          height={626}
          sizes="(max-width: 800px) 100vw, 28vw"
        />
      </div>
      <div className={`${prefix}-colour-grid`} aria-hidden="true">
        <Image src={product.secondaryImage!} alt="" width={385} height={306} />
        <div className={product.toneClassName} />
      </div>
    </>
  );
}
export default function CommissionProductSection({ product }: { product: CommissionProductModel }) {
  const content = <Content product={product} />;
  const media = product.galleryImages ? <Gallery product={product} /> : <Visual product={product} />;
  const contentFirst = product.layout === "visual-right" || product.layout === "gallery-right";
  return (
    <section className={product.sectionClassName} aria-labelledby={`${product.id}-heading`}>
      {contentFirst ? content : media}
      {contentFirst ? media : content}
    </section>
  );
}
