import Image from "next/image";

export default function BrandLogos() {
  return (
    <section className="brand-logos flex h-[168px] items-center justify-center overflow-hidden rounded-[20px] max-[700px]:h-[130px] max-[700px]:rounded-none max-[700px]:bg-transparent" aria-label="Trusted brands">
      <Image
        className="block h-auto w-full max-w-[1360px] max-[700px]:w-[350px] max-[700px]:max-w-full"
        src="/brand-logos.png"
        alt="Atlassian, hipages, Humanforce and Camilla"
        width={1360}
        height={168}
        sizes="100vw"
      />
    </section>
  );
}
