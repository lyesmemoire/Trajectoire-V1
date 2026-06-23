"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CircularProgressProps {
  value: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
  delay?: number;
}

function CircularProgress({
  value,
  size,
  strokeWidth,
  color,
  label,
  delay = 0,
}: CircularProgressProps) {
  const [current, setCurrent] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (current / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        start = Math.round(eased * value);
        setCurrent(start);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(229, 221, 210, 0.5)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-label={`${label}: ${current}%`}
        >
          <span
            className="text-lg font-bold"
            style={{ color: "var(--text)", lineHeight: 1 }}
          >
            {current}%
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-center" style={{ color: "var(--muted)" }}>
        {label}
      </span>
    </div>
  );
}

interface BarProps {
  value: number;
  color: string;
  label: string;
  delay?: number;
}

function AnimatedBar({ value, color, label, delay = 0 }: BarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>
          {value}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(229, 221, 210, 0.5)" }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            width: `${width}%`,
            transition: `width 1s ease-out ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function SparkLine() {
  const points = [52, 58, 61, 67, 70, 74, 76, 78];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min;
  const width = 180;
  const height = 48;
  const padding = 4;

  const coords = points.map((p, i) => ({
    x: padding + (i / (points.length - 1)) * (width - padding * 2),
    y: height - padding - ((p - min) / range) * (height - padding * 2),
  }));

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  const areaPath = `${path} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  return (
    <div className="w-full" aria-label="Courbe de progression sur 8 semaines">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#sparkGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
        />
        {coords.map((c, i) => (
          <motion.circle
            key={i}
            cx={c.x}
            cy={c.y}
            r="3"
            fill="var(--primary)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 + (i / points.length) * 1.2 }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function HeroDashboard() {
  return (
    <div
      className="relative bg-white rounded-2xl p-6 shadow-hero border border-border"
      style={{
        transform: "perspective(1000px) rotateY(-2deg) rotateX(1deg)",
        transition: "transform 0.4s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "perspective(1000px) rotateY(0deg) rotateX(0deg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "perspective(1000px) rotateY(-2deg) rotateX(1deg)";
      }}
      role="img"
      aria-label="Aperçu du tableau de bord Trajectoire"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>
            Tableau de bord
          </p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text)" }}>
            Sophie M. — Directrice Marketing
          </p>
        </div>
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-success/10 text-success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.4 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
          Prêt
        </motion.div>
      </div>

      {/* Circular metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <CircularProgress
          value={78}
          size={80}
          strokeWidth={6}
          color="var(--primary)"
          label="Confiance"
          delay={300}
        />
        <CircularProgress
          value={32}
          size={80}
          strokeWidth={6}
          color="var(--accent)"
          label="Stress"
          delay={500}
        />
        <CircularProgress
          value={85}
          size={80}
          strokeWidth={6}
          color="var(--success)"
          label="Préparation"
          delay={700}
        />
      </div>

      {/* Stress bars */}
      <div className="mb-6 p-4 rounded-xl bg-surface-muted/80">
        <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Gestion de la pression
        </p>
        <div className="flex flex-col gap-2.5">
          <AnimatedBar value={72} color="var(--primary)" label="Prise de parole" delay={600} />
          <AnimatedBar value={81} color="var(--success)" label="Décision rapide" delay={750} />
          <AnimatedBar value={65} color="var(--warning)" label="Feedback difficile" delay={900} />
        </div>
      </div>

      {/* Sparkline */}
      <div className="p-4 rounded-xl bg-surface-muted/80">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
            Progression (8 semaines)
          </p>
          <span className="text-xs font-semibold" style={{ color: "var(--success)" }}>
            +26pts
          </span>
        </div>
        <SparkLine />
      </div>
    </div>
  );
}
