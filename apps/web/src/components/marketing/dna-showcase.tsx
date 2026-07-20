"use client";

import { motion } from "framer-motion";
import { ARCHETYPES_META } from "@/lib/archetypes/career-archetypes";
import { ShieldCheck } from "lucide-react";

export function DNAShowcase() {
  const sampleArchetypes = [
    "strategic_leader",
    "analytical_operator",
    "confident_performer",
  ];

  return (
    <section className="py-40 px-6 bg-[#050816] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#7C3AED]/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="text-5xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Votre Career DNA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] italic">
              révélé par la donnée.
            </span>
          </h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Chaque interruption et chaque rebond alimente un algorithme de
            classification comportementale unique.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {sampleArchetypes.map((id, i) => {
            const meta = ARCHETYPES_META[id as keyof typeof ARCHETYPES_META];
            return (
              <motion.div
                key={id}
                whileHover={{ scale: 1.02, y: -10 }}
                className="relative aspect-[4/5.5] bg-[#0B1023] rounded-[3.5rem] p-12 overflow-hidden border border-white/[0.08] shadow-2xl group cursor-default"
              >
                {/* Holographic Glows */}
                <div
                  className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10 transition-all duration-700 group-hover:opacity-30 ${
                    i === 0
                      ? "bg-blue-600"
                      : i === 1
                        ? "bg-[#7C3AED]"
                        : "bg-[#06B6D4]"
                  }`}
                />

                <div className="relative h-full flex flex-col items-center text-center space-y-10">
                  <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-5xl shadow-inner backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {meta.icon}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white tracking-tight">
                      {meta.label.split(" ")[0]}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C3AED]">
                      Identité Comportementale
                    </p>
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-8 py-3 backdrop-blur-xl">
                    <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                      Top {8 + i * 4}% Mondial
                    </span>
                  </div>

                  <div className="pt-8 space-y-4 text-left w-full border-t border-white/[0.05]">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Capacités Détectées
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {meta.strengths.slice(0, 2).map((s) => (
                        <div
                          key={s}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/[0.05]"
                        >
                          <ShieldCheck className="w-3 h-3 text-[#06B6D4]" />
                          <span className="text-[10px] font-bold text-slate-300">
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Animated Shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-6 pt-12">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            8 Archétypes Persistants à Découvrir
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
