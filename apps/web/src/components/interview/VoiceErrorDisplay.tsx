"use client";

import { MicOff, AlertTriangle, WifiOff, Clock, XCircle } from "lucide-react";
import type { VoiceInterviewError } from "@/hooks/useVoiceInterview";

interface VoiceErrorDisplayProps {
  error: NonNullable<VoiceInterviewError>;
  onRetry: () => void;
}

const CONFIG = {
  MIC_DENIED: {
    icon:    MicOff,
    title:   "Accès au microphone refusé",
    message: "Autorisez l'accès dans les paramètres de votre navigateur puis réessayez.",
    canRetry: true,
  },
  MIC_NOT_FOUND: {
    icon:    MicOff,
    title:   "Aucun microphone détecté",
    message: "Branchez un microphone et réessayez.",
    canRetry: true,
  },
  WORKLET_UNSUPPORTED: {
    icon:    AlertTriangle,
    title:   "Navigateur non compatible",
    message: "Utilisez Chrome ou Edge pour la simulation vocale.",
    canRetry: false,
  },
  WS_FAILED: {
    icon:    WifiOff,
    title:   "Connexion perdue",
    message: "Vérifiez votre connexion internet puis réessayez.",
    canRetry: true,
  },
  WS_TIMEOUT: {
    icon:    Clock,
    title:   "Délai de connexion dépassé",
    message: "Le serveur ne répond pas. Réessayez dans quelques secondes.",
    canRetry: true,
  },
  RECONNECT_EXHAUSTED: {
    icon:    XCircle,
    title:   "Connexion définitivement perdue",
    message: "Impossible de se reconnecter après 3 tentatives.",
    canRetry: false,
  },
} as const;

export function VoiceErrorDisplay({ error, onRetry }: VoiceErrorDisplayProps) {
  const config = CONFIG[error];
  const Icon   = config.icon;

  return (
    <div className="flex flex-col items-center gap-4 p-6
                    bg-red-950 border border-red-800 rounded-xl text-center
                    max-w-sm mx-auto">
      <Icon className="w-10 h-10 text-red-400" />
      <div className="space-y-1">
        <p className="text-red-300 font-semibold">{config.title}</p>
        <p className="text-gray-400 text-sm">{config.message}</p>
      </div>
      {config.canRetry ? (
        <button
          onClick={onRetry}
          className="bg-red-700 hover:bg-red-600 text-white
                     px-4 py-2 rounded-lg text-sm font-medium
                     transition-all duration-200"
        >
          Réessayer
        </button>
      ) : (
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-700 hover:bg-gray-600 text-white
                     px-4 py-2 rounded-lg text-sm font-medium
                     transition-all duration-200"
        >
          Recharger la page
        </button>
      )}
    </div>
  );
}
