import Image from "next/image";
const copy =
  'Quantity depends on your chosen canvas size, but typically 20 to 50 pieces allow for a diverse range of colours and textures. During our consultation, we will discuss the "hero" pieces you definitely want included versus the "texture" pieces I can use for background layering.';
export default function ProductDetails({
  className,
  swatchesClassName,
}: {
  className: string;
  swatchesClassName: string;
}) {
  return (
    <>
      <div className={`${swatchesClassName} mt-7 flex items-center`} aria-label="Available colours">
        {[1, 2, 3, 4, 5].map((n) => (
          <Image unoptimized className="-mr-[5px] block h-6 w-6" key={n} src={`/phone-case-swatch-${n}.svg`} alt={`Colour option ${n}`} width={24} height={24} />
        ))}
      </div>
      <div className={`${className} mt-[30px]`}>
        <details open>
          <summary className="relative cursor-pointer list-none border-b border-[#b8b8ba] py-[22px] pr-[34px] text-[13px]">PRODUCT DETAILS</summary>
          <p className="m-0 py-0 pr-7 pb-[21px] text-[13px] leading-[1.42] text-[#515151]">{copy}</p>
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
    </>
  );
}
