"use client";

import { useVoiceInterview }  from "@/hooks/useVoiceInterview";
import { VoiceErrorDisplay }  from "@/components/interview/VoiceErrorDisplay";
import { Loader2 }            from "lucide-react";
import { cn }                 from "@/lib/utils";

interface Props {
  sessionId:   string;
  wsUrl:       string;
  token:       string;
  atsReportId: string | null;
}

function ConnectionDot({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    connected:    { color: "bg-green-500",                label: "Connecté" },
    connecting:   { color: "bg-yellow-500 animate-pulse", label: "Connexion..." },
    reconnecting: { color: "bg-orange-500 animate-pulse", label: "Reconnexion..." },
    disconnected: { color: "bg-gray-500",                 label: "Déconnecté" },
    idle:         { color: "bg-gray-600",                 label: "En attente" },
  };
  const c = config[status] ?? config.idle;
  return (
    <div className="flex items-center gap-1.5" title={c.label}>
      <div className={cn("w-2 h-2 rounded-full", c.color)} />
      <span className="text-xs text-gray-500 hidden sm:inline">
        {c.label}
      </span>
    </div>
  );
}

export function InterviewSimulationV3({
  sessionId,
  wsUrl,
  token,
  atsReportId,
}: Props) {
  const {
    state,
    transcript,
    stopSpeaking,
    interruptAI,
    connectionStatus,
    error,
    reconnectAttempt,
    maxReconnectAttempts,
  } = useVoiceInterview(wsUrl, token);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between
                         px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-sm font-medium text-gray-300">
            Simulation d'entretien
          </span>
          {atsReportId && (
            <span className="text-xs text-blue-400 bg-blue-950
                             border border-blue-800 rounded px-2 py-0.5">
              Basé sur votre analyse ATS
            </span>
          )}
        </div>
        <ConnectionDot status={connectionStatus} />
      </header>

      {/* ── Bandeau reconnexion ────────────────────────────────────── */}
      {connectionStatus === "reconnecting" && (
        <div className="flex items-center justify-center gap-3
                        bg-yellow-950 border-b border-yellow-800
                        px-4 py-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-yellow-400
                              shrink-0" />
          <span className="text-yellow-300">
            Reconnexion en cours...
            <span className="text-yellow-600 ml-1">
              ({reconnectAttempt}/{maxReconnectAttempts})
            </span>
          </span>
        </div>
      )}

      {/* ── Corps ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center
                       justify-center px-4 py-8 gap-8
                       max-w-2xl mx-auto w-full">

        {/* Erreur typée */}
        {state === "error" && error && (
          <VoiceErrorDisplay
            error={error}
            onRetry={() => window.location.reload()}
          />
        )}
        {state === "error" && !error && (
          <div className="text-red-400 text-center p-6
                          bg-red-950 border border-red-800 rounded-xl">
            Une erreur est survenue. Rechargez la page.
          </div>
        )}

        {/* Connexion initiale */}
        {connectionStatus === "connecting" && state !== "error" && (
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Connexion au recruteur...</p>
          </div>
        )}

        {/* IA parle */}
        {state === "ai_speaking" && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-end gap-1.5 h-12">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1.5 bg-blue-400 rounded-full
                             animate-bounce"
                  style={{
                    animationDelay:    `${i * 100}ms`,
                    animationDuration: "600ms",
                    height: `${24 + Math.abs(Math.sin(i)) * 20}px`,
                  }}
                />
              ))}
            </div>
            <p className="text-blue-400 text-sm font-medium">
              Le recruteur parle...
            </p>
            <button
              onClick={interruptAI}
              className="text-xs text-gray-500 hover:text-gray-300
                         underline transition-colors duration-200"
            >
              Interrompre
            </button>
          </div>
        )}

        {/* Utilisateur parle */}
        {state === "user_speaking" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full bg-red-600
                              flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-white/90" />
              </div>
              <div className="absolute inset-0 rounded-full
                              border-2 border-red-400 animate-ping" />
            </div>
            <p className="text-red-400 text-sm font-medium">
              En écoute... Parlez maintenant
            </p>
            <button
              onClick={stopSpeaking}
              className="bg-gray-800 hover:bg-gray-700 text-white
                         px-4 py-2 rounded-lg text-sm
                         transition-all duration-200"
            >
              Terminer ma réponse
            </button>
          </div>
        )}

        {/* Traitement IA */}
        {state === "processing" && (
          <div className="flex flex-col items-center gap-3
                          text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Analyse de votre réponse...</p>
          </div>
        )}

        {/* Transcription courante */}
        {transcript && state !== "error" && (
          <div className="w-full bg-gray-900 border border-gray-700
                          rounded-xl p-4 max-h-48 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-2
                          uppercase tracking-widest">
              Transcription
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {transcript}
            </p>
          </div>
        )}

        {/* Session terminée */}
        {state === "finished" && (
          <div className="flex flex-col items-center gap-6
                          text-center">
            <div className="w-16 h-16 rounded-full bg-green-900
                            border border-green-700
                            flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <p className="text-green-400 font-semibold text-lg">
                Simulation terminée
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Votre rapport est en cours de génération.
              </p>
            </div>
            <a
              href={`/interview/session/${sessionId}/report`}
              className="bg-blue-600 hover:bg-blue-500 text-white
                         px-6 py-3 rounded-xl font-semibold
                         transition-all duration-200
                         hover:scale-105"
            >
              Voir mon rapport
            </a>
          </div>
        )}

      </main>
    </div>
  );
}
