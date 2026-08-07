import Image from "next/image";
import type { CommissionProductModel } from "../../../models/site";
import ProductDetails from "./ProductDetails";
const description =
  "Put your unique spin on a wardrobe essential and order your shirt designs - available as an exclusive add-on when you book your commission.";
function Content({ product }: { product: CommissionProductModel }) {
  return (
    <div className={`${product.contentClassName} pt-[7px] max-[800px]:px-0 max-[800px]:pt-7 max-[800px]:pb-[14px]`}>
      <h2 className="text-[34px] leading-[1.15] max-[800px]:text-[32px]" id={`${product.id}-heading`}>{product.title}</h2>
      <p className={`${product.descriptionClassName} mt-[29px] max-w-[365px] text-[15px] leading-[1.48] text-[#8a8a8d] max-[800px]:mt-[22px] max-[800px]:max-w-none`}>{description}</p>
      <ProductDetails className={product.detailsClassName} swatchesClassName={product.swatchesClassName} />
    </div>
  );
}
function Gallery({ product }: { product: CommissionProductModel }) {
  return (
    <div className={`${product.galleryClassName} grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-[14px] max-[800px]:order-first max-[800px]:grid-rows-none max-[480px]:grid-cols-1`}>
      {product.galleryImages?.map((src, index) => (
        <Image
          className="block h-[306px] w-full rounded-[15px] object-cover max-[800px]:h-auto max-[800px]:aspect-[385/306]"
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
      <div className={`${prefix === "phone-case" ? "phone-case-visual " : ""}${prefix}-main-visual h-[626px] overflow-hidden rounded-[15px] max-[800px]:h-auto max-[800px]:w-full max-[800px]:aspect-[385/626]`}>
        <Image
          className="block h-full w-full object-contain"
          src={product.mainImage!}
          alt={product.mainImageAlt!}
          width={385}
          height={626}
          sizes="(max-width: 800px) 100vw, 28vw"
        />
      </div>
      <div className={`${prefix}-colour-grid grid grid-rows-2 gap-[14px] max-[800px]:grid-cols-2 max-[800px]:grid-rows-none`} aria-hidden="true">
        <Image className="block h-[306px] w-full rounded-[15px] object-cover max-[800px]:h-auto max-[800px]:aspect-[385/306]" src={product.secondaryImage!} alt="" width={385} height={306} />
        <div className={`${product.toneClassName} h-[306px] w-full rounded-[15px] max-[800px]:h-auto max-[800px]:aspect-[385/306]`} />
      </div>
    </>
  );
}
export default function CommissionProductSection({ product }: { product: CommissionProductModel }) {
  const content = <Content product={product} />;
  const media = product.galleryImages ? <Gallery product={product} /> : <Visual product={product} />;
  const contentFirst = product.layout === "visual-right" || product.layout === "gallery-right";
  const isGallery = Boolean(product.galleryImages);
  return (
    <section className={`${product.sectionClassName} grid min-h-[736px] justify-center gap-4 overflow-hidden rounded-[20px] bg-white px-6 py-[55px] text-[#5b5b5d] ${isGallery ? "grid-cols-[minmax(0,786px)_minmax(0,385px)]" : "grid-cols-3"} max-[800px]:flex max-[800px]:min-h-0 max-[800px]:flex-col max-[800px]:gap-[22px] max-[800px]:rounded-2xl max-[800px]:p-[22px]`} aria-labelledby={`${product.id}-heading`}>
      {contentFirst ? content : media}
      {contentFirst ? media : content}
    </section>
  );
}
