"use client";

import { motion } from "framer-motion";
import { Mic, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";


interface Props {
  isOpen: boolean;
  onRetry: () => void;
  onSwitchToText: () => void;
  reason: "SILENT_FAILURE" | "CONTEXT_SUSPENDED" | "PERMISSION_LOST" | string;
  aiCredits?: number;
}

export function MicrophoneRecoveryModal({
  isOpen,
  onRetry,
  onSwitchToText,
  reason,
  aiCredits,
}: Props) {
  if (!isOpen) return null;

  const messages: Record<string, { title: string; desc: string }> = {
    SILENT_FAILURE: {
      title: "On ne vous entend pas",
      desc: "Le micro est actif mais aucun son n'est détecté. Vérifiez votre micro ou vos AirPods.",
    },
    CONTEXT_SUSPENDED: {
      title: "Audio interrompu",
      desc: "Votre navigateur a suspendu l'audio (possible appel ou mise en veille).",
    },
    WINDOW_BLUR: {
      title: "Session en pause",
      desc: "Vous avez quitté la fenêtre. Pour garantir le réalisme, l'entretien est en pause.",
    },
    default: {
      title: "Problème audio",
      desc: "Une interruption technique a eu lieu.",
    },
  };

  const msg = messages[reason] ?? messages.default;
  if (!msg) return null;
  const { title, desc } = msg;
  return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl space-y-8 text-center"
      >
        <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 mx-auto border border-amber-100 shadow-inner">
          <Mic className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{title}</h2>
          <p className="text-slate-500 font-medium">{desc}</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onRetry}
            variant="primary"
            className="w-full py-8 rounded-2xl text-lg font-black shadow-xl"
          >
            <RefreshCw className="w-5 h-5 mr-2" /> Relancer le micro
          </Button>
          <Button
            onClick={onSwitchToText}
            variant="ghost"
            className="w-full font-bold text-slate-400 hover:text-slate-600"
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Continuer par écrit
          </Button>
        </div>

        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
          Votre progression est sauvegardée
        </p>
      </motion.div>

  );
}
