"use client";

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
    <a className="back-to-top fixed right-[22px] bottom-[18px] z-[100] block h-[66px] w-[63px] transition-transform duration-150 hover:-translate-y-[3px] active:brightness-75 focus-visible:-translate-y-[3px] max-[700px]:right-3 max-[700px]:bottom-2.5 max-[700px]:h-auto max-[700px]:w-[55px]" href="#page-top" onClick={scrollToTop} aria-label="Back to top">
      <svg className="back-to-top-icon block h-full w-full" viewBox="0 0 63 66" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="28.77" cy="26" r="26" fill="#97FF77" />
        <path d="M28.77 35V18.5M22.5 24.77l6.27-6.27 6.27 6.27" stroke="#2E2E38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
