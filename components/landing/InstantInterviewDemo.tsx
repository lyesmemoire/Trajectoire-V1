"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/design-system";
import Link from "next/link";

export function InstantInterviewDemo() {
  const [active, setActive] = useState<null | "vague" | "structured">(null);

  const scenarios = {
    vague: {
      user: "J'ai géré beaucoup d'échecs en équipe.",
      ai: "C'est un récit. Je ne vois pas votre impact. Quelle action précise avez-vous menée ?",
      pressure: 85,
      status: "Interruption",
    },
    structured: {
      user: "J'ai identifié une baisse de 20% de productivité et j'ai instauré des Daily Scrums.",
      ai: "Précis. Comment avez-vous mesuré le succès de ce changement ?",
      pressure: 45,
      status: "Clarté validée",
    },
  };

  return (
    <section className="py-32 px-6 bg-[#050816]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-5xl font-black text-white">
            Vivez le choc psychologique.
          </h2>
          <p className="text-slate-500 font-medium italic">
            Victor (Recruteur High-Stakes) réagit à votre comportement.
          </p>
        </div>

        <div className="bg-[#0B1023] rounded-[3.5rem] border border-white/[0.08] overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12 space-y-10">
            {/* Question */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 text-center relative overflow-hidden">
              <h3 className="text-2xl font-bold text-slate-300 italic">
                "Parlez-moi d'un échec professionnel."
              </h3>
            </div>

            {!active ? (
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActive("vague")}
                  className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.08] text-center hover:bg-rose-500/10 hover:border-rose-500 transition-all font-black uppercase text-xs tracking-widest text-slate-400 hover:text-rose-500"
                >
                  Réponse Vague
                </button>
                <button
                  onClick={() => setActive("structured")}
                  className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.08] text-center hover:bg-emerald-500/10 hover:border-emerald-500 transition-all font-black uppercase text-xs tracking-widest text-slate-400 hover:text-emerald-500"
                >
                  Réponse Structurée
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-10"
              >
                <div className="flex justify-end">
                  <div
                    className={`p-6 rounded-[2rem] rounded-tr-none max-w-[85%] border ${active === "vague" ? "bg-slate-800 border-white/5 opacity-50" : "bg-[#7C3AED] border-white/20"}`}
                  >
                    <p className="text-sm font-bold text-white italic">
                      "{scenarios[active].user}"
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.05] p-7 rounded-[2rem] rounded-tl-none max-w-[85%]">
                    <p className="text-sm font-black text-slate-300 leading-relaxed italic">
                      "{scenarios[active].ai}"
                    </p>
                  </div>
                </div>
                <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-white">
                      {scenarios[active].pressure}%
                    </span>
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${scenarios[active].pressure}%` }}
                        className={`h-full ${active === "vague" ? "bg-rose-500" : "bg-emerald-500"}`}
                      />
                    </div>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="h-16 px-10 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-black"
                  >
                    <Link href="/onboarding">
                      <span className="flex items-center gap-2">
                        Démarrer le Test Complet
                        <ArrowRight className="w-5" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
