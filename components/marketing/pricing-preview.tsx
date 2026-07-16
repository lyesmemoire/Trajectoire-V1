"use client";

import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/design-system";
import Link from "next/link";

export function PricingPreview() {
  return (
    <section id="pricing" className="py-40 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-16">
        <div className="text-center space-y-6">
          <h2 className="text-4xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
            Un entraînement conçu pour <br />{" "}
            <span className="text-blue-600 italic">votre transformation.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto">
            Investissez dans la compétence que les recruteurs paient le plus
            cher : votre calme sous pression.
          </p>
        </div>

        <motion.div
          whileHover={{ y: -10 }}
          className="w-full max-w-lg bg-[#0B1023] rounded-[3.5rem] border-2 border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.15)] p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32" />
          </div>

          <div className="space-y-8 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-white">PLAN PRO</h3>
                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mt-1">
                  L'habit professionnel
                </p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-white">19€</span>
                <p className="text-[10px] font-black text-slate-500 uppercase">
                  Pack Unique
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                "Confrontations intensives (Victor Mode)",
                "Replay Comportemental illimité",
                "Career DNA complet et évolutif",
                "Optimisation ATS Premium",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-slate-300 font-medium"
                >
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <Button
                asChild
                size="lg"
                className="w-full h-16 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-lg"
              >
                <Link href="/auth/signup">Commencer l'entraînement</Link>
              </Button>
              <Link
                href="/pricing"
                className="block text-center text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Voir tous les détails et options →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
