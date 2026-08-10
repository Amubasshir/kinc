import Image from "next/image";

export default function BrandLogos() {
  return (
    <section className="brand-logos flex h-[168px] items-center justify-center overflow-hidden rounded-[20px] max-[700px]:h-[130px] max-[700px]:rounded-none max-[700px]:bg-transparent" aria-label="Trusted brands">
      <div className="grid w-full max-w-[563px] grid-cols-[198fr_86fr_115fr_68fr] items-center gap-8 max-[700px]:gap-3">
        <Image className="block h-auto w-full" src="/brand-atlassian.svg" alt="Atlassian" width={198} height={32} />
        <Image className="block h-auto w-full" src="/brand-hipages.svg" alt="hipages" width={86} height={31} />
        <Image className="block h-auto w-full" src="/brand-humanforce.svg" alt="Humanforce" width={115} height={22} />
        <Image className="block h-auto w-full" src="/brand-camilla.svg" alt="Camilla" width={68} height={25} />
      </div>
    </section>
  );
}
