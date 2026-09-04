import Image from "next/image";

export default function BrandLogos() {
  return (
    <section className="brand-logos flex min-h-[168px] flex-col items-center justify-center gap-6 overflow-hidden rounded-[20px] py-8 max-[700px]:min-h-0 max-[700px]:gap-4 max-[700px]:rounded-none max-[700px]:bg-transparent max-[700px]:py-6" aria-label="Trusted brands">
      <h2 className="text-center text-[24px] leading-none text-[#515151] max-[700px]:text-[24px]">As seen on</h2>
      <div className="grid w-full max-w-[563px] grid-cols-[198fr_86fr_115fr_68fr] items-center gap-8 max-[700px]:gap-3">
        <Image unoptimized className="block h-auto w-full" src="/brand-atlassian.svg" alt="Atlassian" width={198} height={32} />
        <Image unoptimized className="block h-auto w-full" src="/brand-hipages.svg" alt="hipages" width={86} height={31} />
        <Image unoptimized className="block h-auto w-full" src="/brand-humanforce.svg" alt="Humanforce" width={115} height={22} />
        <Image unoptimized className="block h-auto w-full" src="/brand-camilla.svg" alt="Camilla" width={68} height={25} />
      </div>
    </section>
  );
}
