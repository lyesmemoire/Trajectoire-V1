"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Activity } from "lucide-react";

export function PressureDemo() {
  return (
    <div className="relative rounded-[3.5rem] border border-white/[0.08] bg-[#0B1023] p-3 shadow-2xl">
      <div className="bg-[#050816] rounded-[3rem] overflow-hidden p-10 space-y-10 min-h-[500px] flex flex-col justify-center relative border border-white/[0.03]">
        {/* Recruiter Message: Victor (Stress Mode) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex gap-5 items-start"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EF4444] flex items-center justify-center text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="bg-[#0B1023] rounded-[1.75rem] rounded-tl-none p-6 border border-white/[0.05] shadow-xl">
            <p className="text-sm font-bold text-slate-200 leading-relaxed">
              "Vous parlez d'amélioration... C'est un concept abstrait.
              Donnez-moi l'impact exact sur la productivité de votre équipe."
            </p>
          </div>
        </motion.div>

        {/* User Answer (Simulated Typing) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="flex gap-5 items-start justify-end"
        >
          <div className="bg-[#7C3AED] rounded-[1.75rem] rounded-tr-none p-6 shadow-2xl border border-white/10">
            <p className="text-sm font-black text-white leading-relaxed italic">
              "Nous avons automatisé le cycle de test, ce qui a réduit le
              Time-to-Market de 24% et libéré 15h/semaine par développeur."
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0 border border-white/10">
            MOI
          </div>
        </motion.div>

        {/* Real-time Analysis Cockpit */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5, duration: 1 }}
          className="bg-[#0B1023]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/[0.08] space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent opacity-50" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-[#06B6D4] animate-pulse" />
              <span className="text-[10px] font-black text-[#06B6D4] uppercase tracking-[0.25em]">
                Behavioral Cockpit Active
              </span>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Model: Mistral-Large-v2
            </span>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Tension Psychologique</span>
                <span className="text-[#EF4444] animate-pulse">84%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "20%" }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 2, delay: 5.2, ease: "easeOut" }}
                  className="h-full bg-[#EF4444]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 pt-2">
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Evolution
                </p>
                <p className="text-sm font-black text-[#22C55E]">
                  Recovery Detected ✓
                </p>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Career DNA
                </p>
                <p className="text-sm font-black text-[#7C3AED]">
                  Strategic Leader
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Tactical Badges */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-8 -right-8 bg-[#0B1023] border border-white/10 p-5 rounded-[2.5rem] shadow-2xl flex items-center gap-4 backdrop-blur-xl"
      >
        <div className="w-12 h-12 rounded-[1.25rem] bg-[#06B6D4]/20 flex items-center justify-center text-2xl shadow-inner border border-[#06B6D4]/30">
          🎯
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Score de Clarté
          </p>
          <p className="text-lg font-black text-white">91/100</p>
          <p className="text-[9px] font-bold text-[#06B6D4] uppercase">
            +46 points
          </p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 5,
          delay: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-10 -left-10 bg-[#0B1023] border border-white/10 p-5 rounded-[2.5rem] shadow-2xl flex items-center gap-4 backdrop-blur-xl"
      >
        <div className="w-12 h-12 rounded-[1.25rem] bg-[#7C3AED]/20 flex items-center justify-center text-2xl shadow-inner border border-[#7C3AED]/30">
          🎙️
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Débit Vocal
          </p>
          <p className="text-lg font-black text-white">
            128 <span className="text-xs text-slate-500">wpm</span>
          </p>
          <p className="text-[9px] font-bold text-[#22C55E] uppercase">
            Zone Idéale ✓
          </p>
        </div>
      </motion.div>
    </div>
  );
}
