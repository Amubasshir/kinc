import Image from "next/image";

export default function BrandLogos() {
  return (
    <section className="brand-logos" aria-label="Trusted brands">
      <Image
        src="/brand-logos.png"
        alt="Atlassian, hipages, Humanforce and Camilla"
        width={1360}
        height={168}
        sizes="100vw"
      />
    </section>
  );
}
