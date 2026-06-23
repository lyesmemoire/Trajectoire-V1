"use client";

/**
 * InterviewRoom.tsx — Salle d'entretien vocal en temps réel.
 * Correction B5 :
 * Le useEffect qui ouvre la connexion WebSocket retourne maintenant une
 * fonction de cleanup qui :
 * 1. Marque le composant comme démonté (évite les setState sur composant mort)
 * 2. Ferme la socket proprement (ws.close())
 * 3. Annule tous les listeners (ws.onmessage, ws.onerror, ws.onclose)
 * Sans ce cleanup :
 * En développement (React 19 StrictMode) : deux connexions WS simultanées
 * s'ouvrent pour la même session (mount → unmount → mount).
 * En production : démontage du composant laisse la socket active,
 * qui continue d'émettre vers un composant mort et empêche le
 * garbage collection de la session côté gateway.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────

interface InterviewRoomProps {
  sessionId: string;
  token: string;
  gatewayUrl: string;
}

type RoomStatus =
  | "connecting"
  | "authenticating"
  | "ready"
  | "interviewing"
  | "completing"
  | "completed"
  | "error";

interface WsMessage {
  type: string;
  code?: string;
  audio?: string; // base64 TTS audio
  text?: string; // texte de la question
  sessionId?: string;
  reportId?: string;
}

// ── Composant ─────────────────────────────────────────────────────────────

export default function InterviewRoom({
  sessionId,
  token,
  gatewayUrl,
}: InterviewRoomProps) {
  const router = useRouter();

  const [status, setStatus] = useState<RoomStatus>("connecting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Ref pour accéder à la socket depuis les handlers sans recréer l'effet
  const wsRef = useRef<WebSocket | null>(null);
  // Flag pour éviter les setState sur composant démonté
  const mountedRef = useRef(true);

  // ── Envoi de transcription ──────────────────────────────────────────────

  const sendTranscript = useCallback((transcript: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "transcript",
        sessionId,
        transcript,
        isFinal: true,
      })
    );
  }, [sessionId]);

  // ── Connexion WebSocket ─────────────────────────────────────────────────

  useEffect(() => {
    mountedRef.current = true;

    const ws = new WebSocket(gatewayUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setStatus("authenticating");

      // Authentification immédiate à l'ouverture
      ws.send(JSON.stringify({ type: "auth", token, sessionId }));
    };

    ws.onmessage = (event: MessageEvent) => {
      if (!mountedRef.current) return;

      let msg: WsMessage;
      try {
        msg = JSON.parse(event.data as string);
      } catch {
        return;
      }

      switch (msg.type) {
        case "auth_ok":
          setStatus("ready");
          break;

        case "question_start":
          setStatus("interviewing");
          setCurrentQuestion(msg.text ?? null);
          break;

        case "tts_audio":
          // Lecture audio TTS (base64 → ArrayBuffer → AudioContext)
          if (msg.audio) playAudio(msg.audio);
          break;

        case "interview_complete":
          setStatus("completing");
          break;

        case "report_ready":
          setStatus("completed");
          if (msg.reportId) {
            router.push(`/dashboard/report/${msg.reportId}`);
          }
          break;

        case "error":
          setStatus("error");
          setErrorMessage(
            `Erreur gateway : ${msg.code ?? "UNKNOWN"}`
          );
          break;
      }
    };

    ws.onerror = () => {
      if (!mountedRef.current) return;
      setStatus("error");
      setErrorMessage("Connexion perdue. Veuillez réessayer.");
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      // Fermeture normale en fin d'entretien — pas d'erreur affichée
      if (status !== "completed" && status !== "completing") {
        setStatus("error");
        setErrorMessage("Connexion fermée de manière inattendue.");
      }
    };

    // ── Cleanup — B5 ───────────────────────────────────────────────────
    // Exécuté quand le composant est démonté OU quand les deps changent.
    // Couvre : StrictMode double-mount, navigation, erreur de rendu parent.
    return () => {
      mountedRef.current = false;

      // Annuler tous les listeners avant de fermer pour éviter que
      // onclose/onerror ne triggrent des setState sur composant mort
      ws.onopen    = null;
      ws.onmessage = null;
      ws.onerror   = null;
      ws.onclose   = null;

      // Fermeture propre uniquement si la socket est encore ouverte
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close(1000, "Component unmounted");
      }

      wsRef.current = null;
    };
    // status intentionnellement absent des deps pour ne pas recréer la socket
    // à chaque changement de statut
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatewayUrl, token, sessionId]);

  // ── Lecture audio TTS ───────────────────────────────────────────────────

  function playAudio(base64: string): void {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const audioCtx = new AudioContext();
      audioCtx.decodeAudioData(bytes.buffer, (buffer) => {
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      });
    } catch {
      // Lecture audio non critique — on logue silencieusement
      console.warn("[InterviewRoom] Erreur lecture audio TTS");
    }
  }

  // ── Rendu ───────────────────────────────────────────────────────────────

  if (status === "error") {
    return (
      <div className="interview-room interview-room--error">
        <p className="interview-room__error-icon">⚠</p>
        <h2 className="interview-room__error-title">Connexion interrompue</h2>
        <p className="interview-room__error-message">
          {errorMessage ?? "Une erreur est survenue."}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/dashboard")}
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  if (status === "connecting" || status === "authenticating") {
    return (
      <div className="interview-room interview-room--loading">
        <div className="spinner" aria-label="Connexion en cours" />
        <p className="interview-room__status">
          {status === "connecting"
            ? "Connexion à la salle d'entretien…"
            : "Authentification…"}
        </p>
      </div>
    );
  }

  if (status === "completing" || status === "completed") {
    return (
      <div className="interview-room interview-room--completing">
        <div className="spinner" />
        <p className="interview-room__status">
          Génération de votre rapport en cours…
        </p>
      </div>
    );
  }

  return (
    <div className="interview-room">
      <div className="interview-room__header">
        <span className="interview-room__session-id">
          Session {sessionId.slice(0, 8).toUpperCase()}
        </span>
        <span
          className={`interview-room__status-badge ${ isRecording ? "interview-room__status-badge--recording" : "" }`}
        >
          {isRecording ? "● Enregistrement" : "En attente"}
        </span>
      </div>

      {currentQuestion && (
        <div className="interview-room__question">
          <p className="interview-room__question-label">Question</p>
          <p className="interview-room__question-text">{currentQuestion}</p>
        </div>
      )}

      <div className="interview-room__controls">
        <button
          className={`btn ${isRecording ? "btn-danger" : "btn-primary"}`}
          onClick={() => setIsRecording((r) => !r)}
          aria-pressed={isRecording}
        >
          {isRecording ? "⏹ Arrêter" : "🎙 Parler"}
        </button>
      </div>
    </div>
  );
}
