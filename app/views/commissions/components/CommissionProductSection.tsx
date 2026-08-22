import Image from "next/image";
import Link from "next/link";
import type { CommissionProductModel } from "../../../models/site";
import ProductDetails from "./ProductDetails";
const description =
  "Put your unique spin on a wardrobe essential and order your shirt designs - available as an exclusive add-on when you book your commission.";
function Content({ product }: { product: CommissionProductModel }) {
  return (
    <div className={`${product.contentClassName} pt-[7px] max-[800px]:px-0 max-[800px]:pt-7 max-[800px]:pb-[14px]`}>
      <h2 className="text-[34px] leading-[1.15] max-[800px]:text-[32px]" id={`${product.id}-heading`}>{product.title}</h2>
      <p className={`${product.descriptionClassName} mt-[29px] max-w-[365px] text-[15px] leading-[1.48] text-[#515151] max-[800px]:mt-[22px] max-[800px]:max-w-none`}>{description}</p>
      <ProductDetails className={product.detailsClassName} swatchesClassName={product.swatchesClassName} />
      <Link
        className="commission-buy-now mx-auto mt-[30px] flex min-h-[52px] min-w-[187px] items-center justify-center rounded-full bg-[#97ff77] font-[Georgia] text-[15px] text-[#263443] no-underline shadow-[0_4px_5px_rgb(25_93_69/28%)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(25_93_69/30%)]"
        href={`/start-your-commission?addOn=${product.id}`}
      >
        Buy Now — $45
      </Link>
    </div>
  );
}
function Gallery({ product }: { product: CommissionProductModel }) {
  return (
    <div className={`${product.galleryClassName} grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-[14px] max-[800px]:order-first max-[800px]:grid-rows-none max-[480px]:grid-cols-1`}>
      {product.galleryImages?.map((src, index) =>
        src ? (
          <Image unoptimized
            className="block h-[306px] w-full rounded-[15px] object-cover max-[800px]:h-auto max-[800px]:aspect-[385/306]"
            key={src}
            src={src}
            alt={product.galleryAlt(index)}
            width={385}
            height={306}
            sizes="(max-width: 800px) 46vw, 28vw"
          />
        ) : (
          <div className={`${product.toneClassName} h-[306px] w-full rounded-[15px] max-[800px]:h-auto max-[800px]:aspect-[385/306]`} key={`placeholder-${index}`} />
        ),
      )}
    </div>
  );
}
function Visual({ product }: { product: CommissionProductModel }) {
  const prefix = product.layout === "visual-right" ? "tote-bag" : "phone-case";
  return (
    <>
      <div className={`${prefix === "phone-case" ? "phone-case-visual " : ""}${prefix}-main-visual h-[626px] overflow-hidden rounded-[15px] max-[800px]:h-auto max-[800px]:w-full max-[800px]:aspect-[385/626]`}>
        <Image unoptimized
          className="block h-full w-full object-contain"
          src={product.mainImage!}
          alt={product.mainImageAlt!}
          width={385}
          height={626}
          sizes="(max-width: 800px) 100vw, 28vw"
        />
      </div>
      <div className={`${prefix}-colour-grid grid grid-rows-2 gap-[14px] max-[800px]:grid-cols-2 max-[800px]:grid-rows-none`} aria-hidden="true">
        <Image unoptimized className="block h-[306px] w-full rounded-[15px] object-cover max-[800px]:h-auto max-[800px]:aspect-[385/306]" src={product.secondaryImage!} alt="" width={385} height={306} />
        {product.id === "phone-case" ? (
          <Image unoptimized className="block h-[306px] w-full rounded-[15px] object-cover max-[800px]:h-auto max-[800px]:aspect-[385/306]" src={product.secondaryImage!} alt="" width={385} height={306} />
        ) : (
          <div className={`${product.toneClassName} h-[306px] w-full rounded-[15px] max-[800px]:h-auto max-[800px]:aspect-[385/306]`} />
        )}
      </div>
    </>
  );
}
export default function CommissionProductSection({ product }: { product: CommissionProductModel }) {
  const content = <Content product={product} />;
  const media = product.galleryImages ? <Gallery product={product} /> : <Visual product={product} />;
  const contentFirst = product.layout === "visual-right" || product.layout === "gallery-right";
  const isGallery = Boolean(product.galleryImages);
  const gridColumns = isGallery
    ? contentFirst
      ? "grid-cols-[385px_786px]"
      : "grid-cols-[786px_385px]"
    : "grid-cols-[repeat(3,385px)] max-[1250px]:grid-cols-3";
  return (
    <section id={product.id} className={`${product.sectionClassName} grid min-h-[736px] justify-center gap-4 overflow-hidden rounded-[20px] bg-white px-6 py-[55px] text-[#5b5b5d] ${gridColumns} max-[800px]:flex max-[800px]:min-h-0 max-[800px]:flex-col max-[800px]:gap-[22px] max-[800px]:rounded-2xl max-[800px]:p-[22px]`} aria-labelledby={`${product.id}-heading`}>
      {contentFirst ? content : media}
      {contentFirst ? media : content}
    </section>
  );
}
