import Image from "next/image";
import type { MerchandiseProductModel } from "../../../models/site";
export default function Merchandise({ products }: { products: MerchandiseProductModel[] }) {
  return (
    <section id="merchandise" className="merchandise min-h-[1100px] rounded-[20px] bg-white pt-[75px] pb-20 text-[#555] max-[700px]:min-h-0 max-[700px]:rounded-none max-[700px]:bg-transparent max-[700px]:pt-0 max-[700px]:pb-3" aria-labelledby="merchandise-heading">
      <header className="merchandise-header text-center max-[700px]:px-[23px] max-[700px]:pt-[41px] max-[700px]:text-left">
        <h2 id="merchandise-heading">
          Commission it. Print it. <mark>Use it.</mark>
        </h2>
        <p>
          Share the magic with family. Print your child&apos;s custom collage onto a limited collection of
          <br />
          premium everyday objects, creating an unforgettable keepsake for grandparents and loved
          <br /> ones.
        </p>
      </header>

      <div className="merchandise-grid mx-auto mt-[60px] grid w-full max-w-[1280px] grid-cols-4 gap-6 max-[700px]:mt-[33px] max-[700px]:flex max-[700px]:flex-col max-[700px]:gap-0">
        {products.map((product) => (
          <article className="merchandise-card rounded-[18px] bg-white p-8 max-[700px]:min-h-[554px] max-[700px]:w-full max-[700px]:px-11 max-[700px]:pt-12 max-[700px]:pb-[27px] max-[700px]:[&:not(:first-child)]:hidden" key={product.name}>
            <div className="merchandise-image">
              <Image unoptimized
                src={product.image}
                alt={product.name}
                width={306}
                height={306}
                sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 306px"
              />
              {product.bestseller && (
                <>
                  <Image unoptimized
                    className="merchandise-bestseller"
                    style={{ left: "204px" }}
                    src="/merch-bestseller.png"
                    alt="Bestseller"
                    width={197}
                    height={97}
                  />

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
