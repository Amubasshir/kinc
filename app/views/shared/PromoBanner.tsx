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

export default function PromoBanner({ fontClassName = "" }: { fontClassName?: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`${fontClassName} promo-banner flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-b-[20px] bg-[#ffe500] px-4 py-2.5 text-center max-[700px]:rounded-b-[18px] max-[700px]:px-3 max-[700px]:py-2`}
      role="status"
      aria-live="off"
    >
      <span className="text-[16px] tracking-[0.2px] text-[#2E2E38] max-[700px]:text-[14px]">
        <strong style={{ fontWeight: 700, fontVariationSettings: '"wght" 700' }}>SAVE 40%</strong><span style={{ fontWeight: 500, fontVariationSettings: '"wght" 500' }}> WITH LOCKED-IN 2026 LAUNCH RATES BEFORE OUR 2027 PRICE INCREASE</span>
      </span>
      <span
        className="text-[16px] tracking-[0.2px] text-[#2E2E38] tabular-nums max-[700px]:text-[14px]"
        style={{ fontWeight: 700, fontVariationSettings: '"wght" 700' }}
        suppressHydrationWarning
      >
        {timeLeft.days}D : {pad(timeLeft.hours)}H : {pad(timeLeft.minutes)}M
      </span>
    </div>
  );
}
