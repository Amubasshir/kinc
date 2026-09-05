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

const socialIcons = [
  { src: "/footer-instagram.svg", name: "Instagram" },
  { src: "/footer-tiktok.svg", name: "TikTok" },
  { src: "/footer-facebook.svg", name: "Facebook" },
  { src: "/footer-pinterest.svg", name: "Pinterest" },
  { src: "/footer-youtube.svg", name: "YouTube" },
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
        <Image unoptimized className="max-[700px]:h-auto max-[700px]:w-[100px]" src="/logo.svg" alt="KinCollage" width={144} height={26} priority />
      </Link>
      <nav className="desktop-nav flex items-center gap-[33px] max-[820px]:hidden" aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link
            className={`${navLinkClass} ${!item.href.includes("#") && pathname === item.href ? "!font-semibold" : ""}`}
            key={item.href}
            href={item.href}
            onClick={item.href.startsWith("/#") ? scrollToHomeSection(item.href) : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <details className="mobile-nav group static hidden max-[820px]:block" ref={mobileNavRef}>
        <summary className="grid h-9 w-9 cursor-pointer list-none place-content-center gap-[5px] [&::-webkit-details-marker]:hidden" aria-label="Toggle navigation menu">
          <span className="block h-[1.5px] w-[22px] bg-[#008d60] transition-transform duration-150 group-open:bg-[#777782] group-open:translate-y-[6.5px] group-open:rotate-45 group-open:w-[15px]" />
          <span className="block h-[1.5px] w-[22px] bg-[#008d60] transition-opacity duration-150 group-open:opacity-0" />
          <span className="block h-[1.5px] w-[22px] bg-[#008d60] transition-transform duration-150 group-open:bg-[#777782] group-open:-translate-y-[6.5px] group-open:-rotate-45 group-open:w-[15px]" />
        </summary>
        <nav className="absolute top-[58px] right-0 left-0 flex flex-col rounded-b-[18px] bg-white px-6 pt-[3px] pb-[17px] shadow-[0_10px_24px_rgb(0_0_0/6%)]" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              className={`${navLinkClass} py-[10px] ${!item.href.includes("#") && pathname === item.href ? "!font-semibold" : ""}`}
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
          <div className="mt-[15px] flex items-center justify-between" aria-label="Social media">
            {socialIcons.map((icon) => (
              <span className="button-social" key={icon.name} title={icon.name}>
                <Image unoptimized className="h-[31px] w-[31px] object-contain" src={icon.src} alt={icon.name} width={31} height={31} />
              </span>
            ))}
          </div>
          <Link
            className="button-contact mt-[17px] flex h-[58px] w-full box-border items-center justify-center gap-1 rounded-full font-[Georgia] text-[12px] no-underline"
            href="/#contact"
            onClick={(event) => {
              scrollToHomeSection("/#contact")(event);
              closeMobileNav();
            }}
          >
            CONTACT <Image unoptimized src="/footer-arrow.svg" alt="" width={9} height={9} aria-hidden="true" />
          </Link>
        </nav>
      </details>
    </header>
  );
}
