"use client";

import { motion } from "framer-motion";
import { IdentityCardData } from "@/lib/share/identity-card";
import { Sparkles, Zap, Shield, Share2 } from "lucide-react";

export function CareerDNACard({ data }: { data: IdentityCardData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative w-full max-w-[400px] aspect-[4/5] bg-slate-950 rounded-[3rem] p-10 overflow-hidden shadow-2xl border border-white/10"
    >
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="share-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#share-grid)" />
        </svg>
      </div>

      <div className="relative h-full flex flex-col z-10">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
              Career DNA
            </p>
            <p className="text-[10px] font-bold text-slate-500">
              studioentretien.fr
            </p>
          </div>
          <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Identity Section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-5xl shadow-inner backdrop-blur-md"
          >
            {data.icon}
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-white leading-tight tracking-tight">
              {data.label}
            </h3>
            <p className="text-sm font-bold text-blue-400/80 italic">
              "{data.viralTitle}"
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-2">
            <span className="text-xs font-black text-white uppercase tracking-widest">
              Top {data.percentile}% Mondial
            </span>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-blue-500" /> Résilience
            </p>
            <p className="text-xl font-black text-white">
              {data.stats.stressResilience}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-500" /> Interruptions
            </p>
            <p className="text-xl font-black text-white">
              {data.stats.interruptionsHandled}
            </p>
          </div>
        </div>
      </div>

      {/* Share UI Overlay (Hover only) */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-6 p-10">
        <Share2 className="w-12 h-12 text-blue-500" />
        <p className="text-center text-white font-black text-lg">
          Partagez votre identité sur LinkedIn
        </p>
        <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-transform active:scale-95">
          Copier la carte
        </button>
      </div>
    </motion.div>
  );
}
