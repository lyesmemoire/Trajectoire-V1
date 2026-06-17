"use client";

import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { CinematicBackground } from "@/components/marketing/hero/cinematic-background";
import { CheckCircle2, History } from "lucide-react";

export default function WaitlistPage() {
  return (
    <div className="relative min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6 overflow-hidden font-sans antialiased">
      <CinematicBackground />

      <main className="relative z-10 w-full max-w-4xl grid lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Copy */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-white">
              Certaines personnes veulent réussir leurs entretiens. <br />
              <span className="text-blue-600 italic">
                D’autres veulent comprendre ce qui les fait perdre en
                crédibilité.
              </span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
              StudioEntretien ouvre progressivement l’accès à une cohorte
              limitée de testeurs sérieux.
            </p>
          </div>

          <div className="space-y-6 pt-10 border-t border-white/5">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <History className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-300 leading-relaxed">
                "Les premiers utilisateurs reviennent principalement pour
                retravailler des moments précis de leur replay comportemental."
              </p>
            </div>
            <div className="flex gap-4 items-center text-[10px] font-black uppercase text-emerald-500 tracking-widest">
              <CheckCircle2 className="w-4 h-4" /> Qualité Contrôlée · Sessions
              Limitées
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Form */}
        <div className="lg:col-span-5 bg-[#0B1023] rounded-[3.5rem] border border-white/10 p-2 shadow-2xl">
          <div className="bg-[#050816] rounded-[3rem] p-10 border border-white/5">
            <WaitlistForm />
          </div>
        </div>
      </main>
    </div>
  );
}
