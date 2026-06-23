"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export type VisualType =
  | "radar"
  | "progress"
  | "list"
  | "bar"
  | "play"
  | "feedback";

export default function BenefitVisual({ type }: { type: VisualType }) {
  switch (type) {
    case "radar":    return <RadarMini />;
    case "progress": return <ProgressMini />;
    case "list":     return <ListMini />;
    case "bar":      return <BarMini />;
    case "play":     return <PlayMini />;
    case "feedback": return <FeedbackMini />;
    default:         return null;
  }
}

/* ── Radar ── */
function RadarMini() {
  const size   = 110;
  const cx     = size / 2;
  const cy     = size / 2;
  const r      = 40;
  const values = [82, 75, 88, 68, 79, 91, 73, 85];
  const n      = values.length;

  const pt = (val: number, idx: number) => {
    const angle = (idx * 2 * Math.PI) / n - Math.PI / 2;
    const d     = (val / 100) * r;
    return { x: cx + d * Math.cos(angle), y: cy + d * Math.sin(angle) };
  };

  const gridPts = (scale: number) =>
    Array.from({ length: n }, (_, i) => {
      const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
      return `${cx + scale * r * Math.cos(angle)},${cy + scale * r * Math.sin(angle)}`;
    }).join(" ");

  const polyPts = values
    .map((v, i) => {
      const p = pt(v, i);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className="flex justify-center" aria-label="Radar des compétences">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {[0.33, 0.67, 1].map((s) => (
          <polygon
            key={s}
            points={gridPts(s)}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}
        <motion.polygon
          points={polyPts}
          fill="rgba(26,60,52,0.15)"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ scale: 0, transformOrigin: `${cx}px ${cy}px` }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/* ── Circular progress ── */
function ProgressMini() {
  const [val, setVal] = useState(0);
  const target        = 78;
  const size          = 72;
  const sw            = 7;
  const rad           = (size - sw) / 2;
  const circ          = rad * 2 * Math.PI;
  const offset        = circ - (val / 100) * circ;

  useEffect(() => {
    const t = setTimeout(() => setVal(target), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-center gap-3" aria-label={`Score de confiance : ${target}%`}>
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={rad}
            fill="none"
            stroke="var(--border)"
            strokeWidth={sw}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={rad}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {target}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
          Score de confiance
        </p>
        <p className="text-xs" style={{ color: "var(--success)" }}>
          ↑ +26 pts ce mois
        </p>
      </div>
    </div>
  );
}

/* ── Priority list ── */
function ListMini() {
  const items = [
    { label: "Communication",     color: "var(--success)" },
    { label: "Gestion du stress", color: "var(--warning)" },
    { label: "Assertivité",       color: "var(--accent)"  },
  ];

  return (
    <div
      className="space-y-2"
      role="list"
      aria-label="Axes de progression prioritaires"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="flex items-center justify-between p-2 rounded-lg"
          style={{ backgroundColor: "rgba(248,245,240,0.8)" }}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          role="listitem"
        >
          <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
            {item.label}
          </span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Bar mini ── */
function BarMini() {
  const weeks = [40, 52, 58, 63, 67, 72, 76, 81];
  const max   = Math.max(...weeks);

  return (
    <div
      className="flex items-end gap-1.5"
      style={{ height: 40 }}
      role="img"
      aria-label="Progression sur 8 semaines"
    >
      {weeks.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor:
              i === weeks.length - 1
                ? "var(--primary)"
                : "rgba(26,60,52,0.2)",
          }}
          initial={{ scaleY: 0, transformOrigin: "bottom" }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
          aria-label={`Semaine ${i + 1} : ${v}%`}
        />
      ))}
    </div>
  );
}

/* ── Play ── */
function PlayMini() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--primary)" }}
        aria-hidden="true"
      >
        <Play size={14} fill="currentColor" />
      </div>
      <div>
        <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
          Simulation entretien
        </p>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Scénario adapté à votre profil
        </p>
      </div>
    </div>
  );
}

/* ── Feedback ── */
function FeedbackMini() {
  return (
    <blockquote
      className="p-3 rounded-xl border-l-2"
      style={{
        backgroundColor: "rgba(26,60,52,0.04)",
        borderLeftColor: "var(--primary)",
      }}
    >
      <p
        className="text-xs leading-relaxed italic"
        style={{ color: "var(--text)" }}
      >
        &ldquo;Votre clarté décisionnelle est votre atout. Travaillez la gestion
        du silence en négociation.&rdquo;
      </p>
      <footer
        className="text-xs mt-1.5 font-medium"
        style={{ color: "var(--primary)" }}
      >
        — Rapport IA personnalisé
      </footer>
    </blockquote>
  );
}
