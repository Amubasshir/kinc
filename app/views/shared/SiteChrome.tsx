"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import PromoBanner from "./PromoBanner";

export default function SiteChrome({ fontClassName = "" }: { fontClassName?: string }) {
  const [isOverlapping, setIsOverlapping] = useState(false);

  useEffect(() => {
    const updateOverlapState = () => setIsOverlapping(window.scrollY > 0);
    updateOverlapState();
    window.addEventListener("scroll", updateOverlapState, { passive: true });
    return () => window.removeEventListener("scroll", updateOverlapState);
  }, []);

  return (
    <div className={`site-chrome${isOverlapping ? " is-overlapping" : ""}`}>
      <Header />
      <PromoBanner fontClassName={fontClassName} />
    </div>
  );
}
