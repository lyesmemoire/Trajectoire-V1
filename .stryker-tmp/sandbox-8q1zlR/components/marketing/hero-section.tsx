// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/design-system";
import { HOME_STRATEGY } from "@/lib/marketing/homepage-copy";
import { PressureDemo } from "./pressure-demo";
import { useEffect } from "react";
import { WowTracker } from "@/lib/analytics/time-to-wow";
import ExposureTestButton from "./exposure-test-button";

export function HeroSection() {
  useEffect(() => {
    // Démarrage du tracking Time to Wow dès l'affichage
    WowTracker.start();
  }, []);

  const handleAction = (type: string) => {
    // Si l'utilisateur clique sur la démo ou le CTA, on peut considérer ça comme un signal d'engagement
    // Mais le vrai "Wow" sera le doute recruteur
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 px-6 overflow-hidden bg-[#050816]">
      {/* Cinematic Background Glows */}
      <div className="absolute top-[-10%] left-1/4 w-[800px] h-[800px] bg-[#7C3AED]/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-[#06B6D4]/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
        {/* Left: Psychological Messaging */}
        <div className="lg:col-span-7 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full backdrop-blur-xl"
          >
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse shadow-[0_0_12px_#7C3AED]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {HOME_STRATEGY.hero.badge}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] text-white">
              {HOME_STRATEGY.hero.headline.split(" ").map((word, i) => (
                <span
                  key={i}
                  className={
                    word.toLowerCase().includes("pression")
                      ? "text-[#7C3AED]"
                      : ""
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed">
              {HOME_STRATEGY.hero.subheadline}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Button
              asChild
              size="lg"
              className="h-16 px-10 rounded-2xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] font-black text-lg shadow-2xl shadow-[#7C3AED]/20 group"
            >
              <Link href="/onboarding" onClick={() => handleAction("primary")}>
                <span className="flex items-center gap-2">
                  {HOME_STRATEGY.hero.primaryCTA}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-16 px-10 rounded-2xl font-bold text-lg"
            >
              <Link href="/product" onClick={() => handleAction("secondary")}>
                Coller mon CV
              </Link>
            </Button>
            <ExposureTestButton />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-8 pt-12 border-t border-white/[0.05]"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-[#050816] bg-[#0B1023] flex items-center justify-center text-xs font-black text-slate-500"
                >
                  {["M", "S", "A", "L", "K"][i - 1]}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-white uppercase tracking-widest">
                {HOME_STRATEGY.hero.proof}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                Top performers d'Amazon, Google et Goldman Sachs s'entraînent
                ici
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right: Immersive Pressure Simulation */}
        <div className="lg:col-span-5 relative lg:block">
          <PressureDemo />
        </div>
      </div>
    </section>
  );
}
