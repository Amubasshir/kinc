"use client";

import { useEffect, useRef, useState } from "react";
import type { StatModel } from "../../../models/site";

const getTarget = (value: string) => Number.parseInt(value, 10) || 0;
const getSuffix = (value: string) => value.replace(/^\d+/, "");

export default function Stats({ stats }: { stats: StatModel[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let animationFrame = 0;
    let hasAnimated = false;
    const targets = stats.map((stat) => getTarget(stat.value));

    const animate = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCounts(targets);
        return;
      }

      const duration = 1800;
      const startTime = performance.now();

      const updateCounts = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;

        setCounts(targets.map((target) => Math.round(target * easedProgress)));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCounts);
        }
      };

      animationFrame = requestAnimationFrame(updateCounts);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [stats]);

  return (
    <section ref={sectionRef} className="stats min-h-[534px] rounded-[20px] px-6 pt-[111px] pb-20 text-[#263443] max-[700px]:rounded-[18px] max-[700px]:px-6 max-[700px]:pt-[43px] max-[700px]:pb-[54px]" aria-label="KinCollage statistics">
      <div className="stats-grid mx-auto grid w-full max-w-[1120px] grid-cols-3 gap-16 max-[700px]:grid-cols-1 max-[700px]:gap-[58px]">
        {stats.map((stat, index) => (
          <article className="stat text-left [overflow-wrap:anywhere]" key={stat.title}>
            <div className="stat-value grid h-[96px] w-[96px] place-items-center rounded-full bg-[#97ff77] text-[72px] leading-none tabular-nums max-[700px]:h-[76px] max-[700px]:w-[76px] max-[700px]:text-[64px]">
              {counts[index]}{getSuffix(stat.value)}
            </div>
            <h2 className="mt-7 text-[29px] max-[700px]:mt-6 max-[700px]:text-[27px]">{stat.title}</h2>
            <p className="mt-4 text-[16px] leading-[1.45] max-[700px]:mt-[17px] max-[700px]:text-[15px] max-[700px]:leading-[1.48]">{stat.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
