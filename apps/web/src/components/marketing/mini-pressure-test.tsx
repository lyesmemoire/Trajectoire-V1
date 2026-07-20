"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

const PLAYGROUND_SCENARIOS = [
  {
    id: "vague",
    label: "Réponse Vague",
    user: "J'ai géré beaucoup de projets importants dans mon ancienne boîte.",
    ai: "Trop vague. Donnez-moi un exemple concret d'un projet, sa complexité et votre rôle exact.",
    pressure: 82,
    status: "Tension Critique",
    color: "#EF4444",
  },
  {
    id: "precise",
    label: "Réponse Précise",
    user: "J'ai piloté la migration cloud de 12 microservices en 4 mois, réduisant les coûts infra de 30%.",
    ai: "Précis. Comment avez-vous assuré la continuité de service pendant cette migration ?",
    pressure: 42,
    status: "Maîtrise Calme",
    color: "#06B6D4",
  },
];

export function MiniPressureTest() {
  const [active, setActive] = useState<null | number>(null);

  return (
    <section className="py-40 px-6 bg-[#050816] relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white">
            Vivez un <span className="text-[#EF4444]">choc psychologique</span>{" "}
            immédiat.
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto italic">
            Testez vos réflexes face à Victor (Recruteur High-Stakes).
          </p>
        </div>

        <div className="bg-[#0B1023] rounded-[3.5rem] border border-white/[0.08] overflow-hidden shadow-2xl relative">
          <div className="p-8 md:p-12 space-y-10">
            {!active && active !== 0 ? (
              <div className="space-y-10">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 text-center relative overflow-hidden">
                  <h3 className="text-2xl font-bold text-slate-300 italic">
                    "Parlez-moi d'une réussite majeure dont vous êtes fier."
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActive(0)}
                    className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.08] text-center hover:bg-rose-500/10 hover:border-rose-500 transition-all font-black uppercase text-xs tracking-widest text-slate-400 hover:text-rose-500"
                  >
                    Réponse Vague
                  </button>
                  <button
                    onClick={() => setActive(1)}
                    className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.08] text-center hover:bg-emerald-500/10 hover:border-emerald-500 transition-all font-black uppercase text-xs tracking-widest text-slate-400 hover:text-emerald-500"
                  >
                    Réponse Précise
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div className="flex justify-end">
                  <div
                    className={`p-6 rounded-[2rem] rounded-tr-none max-w-[85%] border ${active === 0 ? "bg-slate-800 border-white/5 opacity-50" : "bg-[#7C3AED] border-white/20 shadow-2xl"}`}
                  >
                    <p className="text-sm font-bold text-white italic leading-relaxed">
                      "{PLAYGROUND_SCENARIOS[active]?.user}"
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.05] p-7 rounded-[2rem] rounded-tl-none max-w-[85%]">
                    <p className="text-sm font-black text-slate-300 leading-relaxed italic">
                      "{PLAYGROUND_SCENARIOS[active]?.ai}"
                    </p>
                  </div>
                </div>
                <div className="pt-10 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <span>Niveau de Tension</span>
                      <span>{PLAYGROUND_SCENARIOS[active]?.pressure}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${PLAYGROUND_SCENARIOS[active]?.pressure ?? 0}%`,
                        }}
                        transition={{ duration: 1 }}
                        className="h-full"
                        style={{
                          backgroundColor: PLAYGROUND_SCENARIOS[active]?.color,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      onClick={() => setActive(null)}
                      className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Réessayer
                    </button>
                    <a
                      href="/onboarding"
                      className="h-14 px-8 rounded-2xl bg-blue-600 text-white font-black flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                    >
                      Réclamer mon Profile DNA{" "}
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
