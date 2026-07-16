// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";

interface MarketSegment {
  label: string;
  value: string;
  size: number;
  color: string;
  description: string;
}

const segments: MarketSegment[] = [
  {
    label: "TAM",
    value: "€50B",
    size: 140,
    color: "rgba(220,38,38,0.15)",
    description: "50M candidats actifs/an (EU + US)",
  },
  {
    label: "SAM",
    value: "€8B",
    size: 96,
    color: "rgba(220,38,38,0.30)",
    description: "8M early adopters tech/finance",
  },
  {
    label: "SOM",
    value: "€3.5M",
    size: 52,
    color: "rgba(220,38,38,0.65)",
    description: "100K users Year 1",
  },
];

export default function MarketChart() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16"
    >
      <div
        className="relative flex shrink-0 items-center justify-center"
        style={{ width: 300, height: 300 }}
      >
        {segments.map((seg, i) => (
          <div
            key={seg.label}
            className="absolute rounded-full border transition-all duration-700"
            style={{
              width: visible ? seg.size * 2 : 0,
              height: visible ? seg.size * 2 : 0,
              background: seg.color,
              borderColor: "rgba(220,38,38,0.4)",
              transitionDelay: `${i * 150}ms`,
            }}
          />
        ))}
        <div className="relative z-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
            Marché
          </p>
          <p className="text-2xl font-black text-white">€50B</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-start gap-4">
            <div
              className="mt-1 h-4 w-4 shrink-0 rounded-full border border-red-600/50"
              style={{ background: seg.color }}
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white">
                  {seg.value}
                </span>
                <span className="text-sm font-bold text-red-400">
                  {seg.label}
                </span>
              </div>
              <p className="text-sm text-gray-400">{seg.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
