"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  ShieldAlert,
  WifiOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  status:
    | "idle"
    | "requesting"
    | "granted"
    | "denied"
    | "error"
    | "disconnected";
  isSilent: boolean;
  isRecording: boolean;
  onRetry: () => void;
}

export function MobileVoiceInterface({
  status,
  isSilent,
  isRecording,
  onRetry,
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 p-6 pb-10 z-50 rounded-t-[2.5rem]">
      <div className="max-w-md mx-auto flex flex-col items-center space-y-6">
        {/* Status Indicator */}
        <AnimatePresence mode="wait">
          {status === "requesting" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-blue-400"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Configuration Micro...
              </span>
            </motion.div>
          )}

          {status === "denied" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3"
            >
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <p className="text-xs font-bold text-rose-100">
                Accès micro bloqué. Autorisez StudioEntretien dans Safari.
              </p>
              <Button
                size="sm"
                onClick={onRetry}
                className="bg-rose-600 text-[8px] h-6"
              >
                Réessayer
              </Button>
            </motion.div>
          )}

          {status === "disconnected" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-amber-500"
            >
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Lien perdu avec le micro
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Visualizer / Interaction */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-blue-600/20 rounded-full animate-ping" />
          <motion.div
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative z-10 ${
              isRecording
                ? "bg-red-600 shadow-red-500/40"
                : "bg-blue-600 shadow-blue-500/40"
            }`}
          >
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </motion.div>

          {isSilent && isRecording && (
            <div className="absolute -top-12 bg-amber-500 text-[#050816] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce">
              On ne vous entend plus
            </div>
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-white font-black text-sm uppercase tracking-widest">
            {isRecording ? "L'IA vous écoute" : "Prêt pour l'élocution"}
          </p>
          <p className="text-slate-500 text-[10px] font-medium italic">
            Optimisé pour iOS Safari & Android Chrome
          </p>
        </div>
      </div>
    </div>
  );
}
