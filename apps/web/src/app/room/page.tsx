"use client";

import { useEffect, useState } from "react";
import { useVoiceInterview, InterviewState } from "@/hooks/useVoiceInterview";
import { createClient } from "@/lib/supabase/client";
import { getWsUrl } from "@/lib/api";

export default function RoomPage() {
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        setToken(data.session.access_token);
        // On récupère le paramètre role s'il y a lieu dans l'url, sinon par défaut on lance.
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get("role") || "generic";
        setWsUrl(getWsUrl(data.session.access_token, role));
      }
    };
    init();
  }, []);

  if (!wsUrl || !token) {
    return (
      <div className="room-layout">
        <div className="loading-container">
          <div className="spinner" />
          <p style={{ marginLeft: "1rem", color: "var(--text-secondary)" }}>
            Préparation de la salle...
          </p>
        </div>
      </div>
    );
  }

  return <InterviewRoom wsUrl={wsUrl} token={token} />;
}

function InterviewRoom({ wsUrl, token }: { wsUrl: string; token: string }) {
  const { state, transcript, stopSpeaking, interruptAI } = useVoiceInterview(wsUrl, token);

  const getStateLabel = (s: InterviewState) => {
    switch (s) {
      case "connecting": return "Connexion...";
      case "user_speaking": return "À toi de parler";
      case "ai_speaking": return "L'IA te parle";
      case "processing": return "L'IA réfléchit...";
      case "finished": return "Entretien terminé";
      case "error": return "Erreur de connexion";
    }
  };

  return (
    <div className="room-layout">
      <div className="room-header">
        <a href="/dashboard" className="btn-logout" style={{ textDecoration: "none" }}>
          Quitter
        </a>
        <div className={`status-badge status-${state}`}>
          <div className="status-dot" />
          {getStateLabel(state)}
        </div>
      </div>

      <div className="room-content">
        {/* Visualizer simulé ou wave animée selon le state */}
        <div className={`wave-container state-${state}`}>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>

        <div className="transcript-box">
          {transcript ? (
            <p className="transcript-text">"{transcript}"</p>
          ) : (
            <p className="transcript-placeholder">
              {state === "user_speaking"
                ? "Je t'écoute..."
                : state === "processing"
                ? "Analyse en cours..."
                : "La transcription apparaîtra ici."}
            </p>
          )}
        </div>
      </div>

      <div className="room-controls">
        {state === "user_speaking" && (
          <button className="btn-action primary" onClick={stopSpeaking}>
            J'ai terminé ma réponse
          </button>
        )}

        {state === "ai_speaking" && (
          <button className="btn-action secondary" onClick={interruptAI}>
            🛑 Interrompre l'IA
          </button>
        )}

        {state === "finished" && (
          <a href="/dashboard" className="btn-action primary">
            Voir le rapport d'entretien
          </a>
        )}
      </div>
    </div>
  );
}
