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
      <div className={swatchesClassName} aria-label="Available colours">
        {[1, 2, 3, 4, 5].map((n) => (
          <Image key={n} src={`/phone-case-swatch-${n}.svg`} alt={`Colour option ${n}`} width={24} height={24} />
        ))}
      </div>
      <div className={className}>
        <details open>
          <summary>PRODUCT DETAILS</summary>
          <p>{copy}</p>
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
