const categoryLinks = [
  { label: "TRAVEL TUMBLER", href: "#travel-tumbler" },
  { label: "POSTCARD", href: "#postcard" },
  { label: "SPECIAL CARD", href: "#special-card" },
  { label: "CANVAS PRINTS", href: "#canvas-prints" },
  { label: "PHONE CASE", href: "#phone-case" },
  { label: "LINEN JOURNAL", href: "#linen-journal" },
  { label: "T-SHIRT", href: "#tshirt" },
  { label: "TOTE BAG", href: "#tote-bag" },
] as const;

export default function ProductMenu({ categories }: { categories: string[] }) {
  return (
    <section id="product-options" className="product-menu flex min-h-20 items-center justify-center rounded-[20px] bg-white px-6 text-[#5b5b5d] max-[900px]:rounded-2xl max-[900px]:px-5 max-[900px]:py-6" aria-label="Commission product categories">
      <nav className="flex items-center justify-center gap-[18px] whitespace-nowrap text-[14px] max-[900px]:flex-wrap max-[900px]:gap-x-[22px] max-[900px]:gap-y-[17px] max-[900px]:whitespace-normal max-[900px]:text-[12px]">
        {categories.map((category, index) => (
          <a className="transition hover:text-[#008d91] focus-visible:outline-none focus-visible:underline" key={category} href={categoryLinks[index]?.href ?? "#product-options"}>
            {category}
          </a>
        ))}
      </nav>
    </section>
  );
}
