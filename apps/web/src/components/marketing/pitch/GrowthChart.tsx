"use client";

import { useEffect, useRef, useState } from "react";

const dataPoints = [
  { month: "M1", users: 120, arr: 0.8 },
  { month: "M2", users: 280, arr: 1.8 },
  { month: "M3", users: 520, arr: 3.4 },
  { month: "M4", users: 890, arr: 5.8 },
  { month: "M5", users: 1340, arr: 8.7 },
  { month: "M6", users: 2100, arr: 13.6 },
  { month: "M7", users: 3200, arr: 20.8 },
  { month: "M8", users: 4800, arr: 31.2 },
  { month: "M9", users: 7200, arr: 46.8 },
  { month: "M10", users: 10500, arr: 68.2 },
  { month: "M11", users: 15000, arr: 97.5 },
  { month: "M12", users: 21000, arr: 136.5 },
];

const W = 600;
const H = 200;
const PAD = { top: 16, right: 16, bottom: 32, left: 48 };
const innerW = W - PAD.left - PAD.right;
const innerH = H - PAD.top - PAD.bottom;

function toX(i: number) {
  return PAD.left + (i / (dataPoints.length - 1)) * innerW;
}

function toY(val: number, max: number) {
  return PAD.top + innerH - (val / max) * innerH;
}

export default function GrowthChart() {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          let start: number | null = null;
          const animate = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 1200, 1);
            setProgress(p);
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const maxUsers = Math.max(...dataPoints.map((d) => d.users));
  const maxARR = Math.max(...dataPoints.map((d) => d.arr));
  const visibleCount = Math.max(2, Math.round(progress * dataPoints.length));
  const visible = dataPoints.slice(0, visibleCount);

  const usersPath = visible
    .map((d, i) => `${toX(i)},${toY(d.users, maxUsers)}`)
    .join(" ");
  const arrPath = visible
    .map((d, i) => `${toX(i)},${toY(d.arr, maxARR)}`)
    .join(" ");

  return (
    <div ref={ref} className="w-full">
      <div className="mb-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-8 rounded-full bg-[#EF4444]" />
          <span className="text-sm text-gray-400">Utilisateurs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-8 rounded-full bg-[#FB923C]" />
          <span className="text-sm text-gray-400">ARR (K€)</span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label="Courbe de croissance projetée"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = PAD.top + innerH * (1 - frac);
          return (
            <g key={frac}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + innerW}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="rgba(255,255,255,0.3)"
              >
                {Math.round((maxUsers * frac) / 1000)}K
              </text>
            </g>
          );
        })}
        {dataPoints.map((d, i) => (
          <text
            key={d.month}
            x={toX(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize={9}
            fill="rgba(255,255,255,0.3)"
          >
            {d.month}
          </text>
        ))}
        {visible.length >= 2 && (
          <polygon
            points={[
              `${toX(0)},${PAD.top + innerH}`,
              ...visible.map((d, i) => `${toX(i)},${toY(d.users, maxUsers)}`),
              `${toX(visible.length - 1)},${PAD.top + innerH}`,
            ].join(" ")}
            fill="rgba(220,38,38,0.12)"
          />
        )}
        {visible.length >= 2 && (
          <polyline
            points={usersPath}
            fill="none"
            stroke="#dc2626"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {visible.length >= 2 && (
          <polyline
            points={arrPath}
            fill="none"
            stroke="#fb923c"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 3"
          />
        )}
        {visible.length >= 2 && (
          <circle
            cx={toX(visible.length - 1)}
            cy={toY(visible[visible.length - 1]?.users ?? 0, maxUsers)}
            r={5}
            fill="#dc2626"
            stroke="white"
            strokeWidth={2}
          />
        )}
      </svg>
    </div>
  );
}
