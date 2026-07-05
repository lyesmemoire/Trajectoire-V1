"use client";

/**
 * VoiceMode — Mode entretien vocal optionnel (P3.3).
 *
 * UI state machine : idle -> connecting -> listening -> thinking -> speaking -> error.
 * S'appuie sur lib/voice/client. N'altère PAS le mode texte (composant additionnel).
 *
 * Le gateway WS est configuré via NEXT_PUBLIC_VOICE_WS_URL. Si absent, le mode
 * vocal affiche un message clair et le mode texte reste pleinement utilisable.
 */

import { useRef, useState } from "react";
import { VoiceClient, type VoiceClientState } from "@/lib/voice/client";
import { card, colors, primaryBtn, ghostBtn } from "../../_components/styles";
import { envClient } from "@/lib/env.client";

const WS_URL = envClient.NEXT_PUBLIC_VOICE_WS_URL ?? "";

const STATE_LABEL: Record<VoiceClientState, string> = {
  idle: "Prêt",
  connecting: "Connexion…",
  listening: "🎙️ À toi de parler…",
  thinking: "Analyse de ta réponse…",
  speaking: "🔊 L'interviewer répond…",
  error: "Incident",
};

function stateColor(s: VoiceClientState): string {
  if (s === "error") return colors.bad;
  if (s === "listening") return colors.good;
  if (s === "speaking" || s === "thinking") return colors.warn;
  return colors.sub;
}

export function VoiceMode({ gap, question }: { gap?: string; question?: string }) {
  const [state, setState] = useState<VoiceClientState>("idle");
  const [transcript, setTranscript] = useState("");
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<VoiceClient | null>(null);

  const available = WS_URL.length > 0;

  async function startVoice() {
    setError(null);
    setLastFeedback(null);
    const client = new VoiceClient(
      { url: WS_URL, ...(gap ? { gap } : {}), ...(question ? { question } : {}) },
      {
        onState: setState,
        onTranscript: (text, final) => {
          if (final) setTranscript(text);
        },
        onFeedback: (f) => {
          setLastFeedback(`${f.feedback} (score ${f.score}/100)`);
        },
        onError: (msg) => setError(msg),
      },
    );
    clientRef.current = client;
    await client.start();
  }

  function endTurn() {
    clientRef.current?.endSpeech();
  }

  function stopVoice() {
    clientRef.current?.stop();
    clientRef.current = null;
  }

  if (!available) {
    return (
      <div style={{ ...card, background: colors.soft }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>🎤 Mode vocal</h3>
        <p style={{ margin: 0, fontSize: 13, color: colors.sub }}>
          Le mode vocal n'est pas activé sur cet environnement
          (<code>NEXT_PUBLIC_VOICE_WS_URL</code> non défini). Utilise le mode
          texte ci-dessous — il fonctionne déjà parfaitement.
        </p>
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>🎤 Mode vocal</h3>
        <span style={{ fontSize: 13, color: stateColor(state), fontWeight: 600 }}>
          {STATE_LABEL[state]}
        </span>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {state === "idle" || state === "error" ? (
          <button style={{ ...primaryBtn, width: "auto" }} onClick={startVoice}>
            🎤 Démarrer l'entretien vocal
          </button>
        ) : (
          <>
            <button style={{ ...primaryBtn, width: "auto" }} onClick={endTurn}>
              ✅ J'ai fini de répondre
            </button>
            <button style={ghostBtn} onClick={stopVoice}>
              ⏹ Arrêter
            </button>
          </>
        )}
      </div>

      {transcript && (
        <p style={{ marginTop: 12, fontSize: 14 }}>
          <strong>Ce que j'ai entendu :</strong> « {transcript} »
        </p>
      )}
      {lastFeedback && (
        <p
          style={{
            marginTop: 8,
            padding: 10,
            background: colors.brandSoft,
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {lastFeedback}
        </p>
      )}
      {error && (
        <p style={{ marginTop: 8, fontSize: 13, color: colors.bad }}>
          ⚠ {error} — tu peux continuer en mode texte ci-dessous.
        </p>
      )}
    </div>
  );
}
