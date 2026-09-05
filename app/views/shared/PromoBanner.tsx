"use client";

import { useEffect, useState } from "react";

const LAUNCH_DEADLINE = new Date("2027-01-01T00:00:00").getTime();

function getTimeLeft() {
  const diff = Math.max(0, LAUNCH_DEADLINE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="promo-banner flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-b-[20px] bg-[#ffe500] px-4 py-2.5 text-center max-[700px]:rounded-b-[18px] max-[700px]:px-3 max-[700px]:py-2"
      role="status"
      aria-live="off"
    >
      <span className="font-[var(--font-montserrat)] text-[13px] font-extrabold tracking-[0.2px] text-[#171717] max-[820px]:text-[11px] max-[460px]:text-[10px]">
        SAVE 40% WITH LOCKED-IN 2026 LAUNCH RATES BEFORE OUR 2027 PRICE INCREASE
      </span>
      <span
        className="font-[var(--font-montserrat)] text-[13px] font-extrabold tracking-[0.2px] text-[#171717] tabular-nums max-[820px]:text-[11px] max-[460px]:text-[10px]"
        suppressHydrationWarning
      >
        {timeLeft.days}D : {pad(timeLeft.hours)}H : {pad(timeLeft.minutes)}M
      </span>
    </div>
  );
}
