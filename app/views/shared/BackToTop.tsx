"use client";

import Image from "next/image";
import type { MouseEvent } from "react";

export default function BackToTop() {
  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("page-top");
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "#page-top");
  };

  return (
    <a className="back-to-top fixed right-[22px] bottom-[18px] z-[100] block h-[66px] w-[63px] transition-transform duration-150 hover:-translate-y-[3px] focus-visible:-translate-y-[3px] max-[700px]:right-3 max-[700px]:bottom-2.5 max-[700px]:h-auto max-[700px]:w-[55px]" href="#page-top" onClick={scrollToTop} aria-label="Back to top">
      <Image unoptimized className="block h-full w-full" src="/up-button.svg" alt="" width={63} height={66} aria-hidden="true" />
    </a>
  );
}
