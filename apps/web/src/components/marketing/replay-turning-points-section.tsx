"use client";

import { motion } from "framer-motion";
import { History, AlertCircle, CheckCircle2 } from "lucide-react";

const TURNING_POINTS = [
  {
    time: "04:32",
    event: "Scepticisme de Victor",
    desc: "C'est ici que vous avez cessé d'expliquer pour commencer à vous justifier.",
    impact: "Perte de 14% de crédibilité perçue.",
    status: "critical",
  },
  {
    time: "08:15",
    event: "Moment de Recovery",
    desc: "Excellente reprise après l'interruption. Votre clarté est revenue à 100%.",
    impact: "Signal de leadership fort détecté.",
    status: "success",
  },
];

export function ReplayTurningPointsSection() {
  return (
    <section className="py-40 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
            <History className="w-3 h-3" /> Replay Comportemental
          </div>
          <h2 className="text-4xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter">
            Le miroir qui ne <br />{" "}
            <span className="text-blue-500 italic">ment jamais.</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            StudioEntretien identifie vos points de bascule psychologique. Ne
            relisez pas vos mots, étudiez vos réactions.
          </p>
        </div>

        <div className="space-y-6">
          {TURNING_POINTS.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-[2.5rem] bg-[#0B1023] border border-white/[0.08] relative overflow-hidden group shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-blue-500 font-bold bg-blue-500/10 px-2 py-1 rounded">
                    {point.time}
                  </span>
                  <h4 className="font-black text-white uppercase tracking-widest text-xs">
                    {point.event}
                  </h4>
                </div>
                {point.status === "critical" ? (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </div>

              <p className="text-sm font-medium text-slate-300 leading-relaxed mb-4 italic">
                "{point.desc}"
              </p>

              <p
                className={`text-[10px] font-black uppercase tracking-widest ${point.status === "critical" ? "text-rose-400" : "text-emerald-400"}`}
              >
                {point.impact}
              </p>

              {/* Timeline connection */}
              {i === 0 && (
                <div className="absolute bottom-0 left-12 w-px h-10 bg-gradient-to-b from-white/10 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
