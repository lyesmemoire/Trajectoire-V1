"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrivacyConsent({ onAccept }: { onAccept: () => void }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 space-y-8 text-center shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Lock className="w-24 h-24" />
      </div>

      <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] border border-blue-600/20 flex items-center justify-center mx-auto mb-4 text-blue-400">
        <ShieldCheck className="w-10 h-10" />
      </div>

      <div className="space-y-4 relative z-10">
        <h3 className="text-2xl font-black text-white">
          Transparence & Vie Privée
        </h3>
        <p className="text-slate-400 font-medium leading-relaxed text-sm max-w-sm mx-auto">
          StudioEntretien analyse vos signaux de communication pour générer
          votre Replay et votre Career DNA. Vos données sont cryptées et nous ne
          stockons pas l'audio brut au-delà de 7 jours.
        </p>
      </div>

      <div className="pt-4 space-y-4 relative z-10">
        <Button
          onClick={onAccept}
          variant="primary"
          className="w-full h-16 rounded-2xl font-black text-lg"
        >
          J'accepte et je commence <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Conforme RGPD · Vos données vous appartiennent
        </p>
      </div>
    </div>
  );
}
