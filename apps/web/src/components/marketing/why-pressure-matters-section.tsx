"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Zap, Target } from "lucide-react";

export function WhyPressureMattersSection() {
  return (
    <section className="py-40 px-6 bg-[#050816] relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-500/20"
        >
          <ShieldAlert className="w-3 h-3" /> Philosophie d'Entraînement
        </motion.div>

        <h2 className="text-4xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter">
          L'aisance n'est pas le talent. <br />
          <span className="text-slate-600">La résilience l'est.</span>
        </h2>

        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
          Les entretiens faciles ne révèlent rien de votre potentiel. Votre
          valeur réelle n'apparaît qu'au moment où vous perdez le contrôle.
          StudioEntretien est conçu pour ces secondes critiques.
        </p>

        <div className="grid md:grid-cols-3 gap-8 pt-12">
          {[
            {
              title: "Tension Utile",
              desc: "La pression de Victor force votre cerveau à sortir des scripts appris par cœur.",
              icon: <Zap className="w-5 h-5" />,
            },
            {
              title: "Points de Rupture",
              desc: "Identifiez le moment exact où votre structure s'effondre sous le stress.",
              icon: <Target className="w-5 h-5" />,
            },
            {
              title: "Mutation Réelle",
              desc: "Transformez vos automatismes de défense en leadership affirmé.",
              icon: <ShieldAlert className="w-5 h-5" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] text-left space-y-4"
            >
              <div className="text-blue-500">{item.icon}</div>
              <h3 className="font-black text-white uppercase tracking-widest text-xs">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
