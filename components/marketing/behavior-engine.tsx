"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Database } from "lucide-react";
import { HOME_STRATEGY } from "@/lib/marketing/homepage-copy";

export function BehavioralEngineSection() {
  return (
    <section className="py-60 px-6 relative bg-[#050816]">
      <div className="max-w-7xl mx-auto space-y-32">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Mistral-Powered Core
              </span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter">
              {HOME_STRATEGY.engine.title}
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-xl">
              {HOME_STRATEGY.engine.subtitle}
            </p>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {HOME_STRATEGY.engine.features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2.5rem] bg-[#0B1023] border border-white/[0.08] space-y-4 shadow-xl hover:border-purple-500/30 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-purple-400">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The "Deep Logic" Terminal View */}
        <div className="bg-[#0B1023] rounded-[4rem] border border-white/[0.08] overflow-hidden shadow-2xl">
          <div className="bg-slate-900/50 px-8 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Terminal className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Diagnostic Comportemental v1.4.2
              </span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/5" />
              <div className="w-2 h-2 rounded-full bg-white/5" />
              <div className="w-2 h-2 rounded-full bg-white/5" />
            </div>
          </div>
          <div className="p-10 md:p-20 grid lg:grid-cols-3 gap-16 font-mono">
            <div className="space-y-6">
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-4">
                // Signals
              </p>
              <div className="space-y-2 opacity-50">
                <p className="text-xs text-slate-300">
                  DETECT_HESITATION: true
                </p>
                <p className="text-xs text-slate-300">
                  VAGUENESS_DETECTED: 84%
                </p>
                <p className="text-xs text-slate-300">FILLER_COUNT: 4</p>
                <p className="text-xs text-[#EF4444]">STATE: TENSION_RISING</p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-4">
                // Orchestration
              </p>
              <div className="space-y-2">
                <p className="text-xs text-slate-300">STRATEGY: INTERRUPTION</p>
                <p className="text-xs text-slate-300">
                  PERSONA: VICTOR_AGGRESSIVE
                </p>
                <motion.p
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-xs text-blue-400"
                >
                  &gt; ACTION: RE-CENTER_CANDIDATE
                </motion.p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-4">
                // Outcomes
              </p>
              <div className="space-y-2 opacity-50">
                <p className="text-xs text-slate-300">DNA_SHIFT: DETECTED</p>
                <p className="text-xs text-slate-300">RECOVERY_ABILITY: HIGH</p>
                <p className="text-xs text-green-400 underline">
                  PERSISTENT_MEMORY_SYNCED
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
