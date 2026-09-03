"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import type { MouseEvent } from "react";

const navigation = [
  { label: "HOW IT WORKS", href: "/#how-it-works" },
  { label: "THE ARTIST", href: "/the-artist" },
  { label: "GALLERY", href: "/gallery" },
  { label: "TESTIMONIALS", href: "/#testimonials" },
  { label: "CONTACT", href: "/#contact" },
];

export default function Header() {
  const mobileNavRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const navLinkClass =
    "whitespace-nowrap font-[var(--font-tenor-sans)] text-[14px] leading-none font-normal text-[#7B7B7B] no-underline transition-colors duration-150 hover:text-[#008d60] focus-visible:text-[#008d60]";
  const closeMobileNav = () => {
    if (mobileNavRef.current) mobileNavRef.current.open = false;
  };
  const scrollToHomeSection = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" || !href.startsWith("/#")) return;

    const id = href.slice(2);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="site-header relative z-50 flex min-h-[61px] items-center justify-between rounded-t-[20px] bg-white px-10 max-[820px]:min-h-[60px] max-[820px]:px-5 max-[700px]:!w-[calc(100vw-28px)] max-[700px]:!max-w-[calc(100vw-28px)] max-[700px]:min-h-[58px] max-[700px]:rounded-[18px] max-[700px]:px-4">
      <Link className="site-logo flex shrink-0" href="/" aria-label="KinCollage home">
        <Image unoptimized src="/logo.svg" alt="KinCollage" width={144} height={26} priority />
      </Link>
      <nav className="desktop-nav flex items-center gap-[33px] max-[820px]:hidden" aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link
            className={navLinkClass}
            key={item.href}
            href={item.href}
            onClick={item.href.startsWith("/#") ? scrollToHomeSection(item.href) : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <details className="mobile-nav group static hidden max-[820px]:block" ref={mobileNavRef}>
        <summary className="grid h-9 w-9 cursor-pointer list-none place-content-center gap-[5px] [&::-webkit-details-marker]:hidden" aria-label="Open navigation menu">
          <span className="block h-[1.5px] w-[22px] bg-[#008d60] transition-transform duration-150 group-open:translate-y-[6.5px] group-open:rotate-45" />
          <span className="block h-[1.5px] w-[22px] bg-[#008d60] transition-opacity duration-150 group-open:opacity-0" />
          <span className="block h-[1.5px] w-[22px] bg-[#008d60] transition-transform duration-150 group-open:-translate-y-[6.5px] group-open:-rotate-45" />
        </summary>
        <nav className="absolute top-[60px] right-0 left-0 flex flex-col border-t border-[#f0f0ed] bg-white px-5 pt-2.5 pb-5 shadow-[0_10px_24px_rgb(0_0_0/6%)]" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              className={`${navLinkClass} py-[13px]`}
              key={item.href}
              href={item.href}
              onClick={(event) => {
                if (item.href.startsWith("/#")) scrollToHomeSection(item.href)(event);
                closeMobileNav();
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
