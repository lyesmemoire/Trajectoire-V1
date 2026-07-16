// @ts-nocheck
"use client";

/**
 * /product/interview — Simulation d'entretien TEXTE (P3).
 *
 * Flux "1 écran = 1 émotion" :
 *   1. question affichée  →  2. réponse utilisateur  →  3. feedback instantané
 *
 * Question & gap proviennent des query params (?q=...&gap=...) pour rester
 * cohérents avec l'analyse réelle du candidat (ProductOutput.interviewPrep).
 * Fallback générique si absents (accès direct à la page).
 *
 * Module indépendant : ne touche ni l'ATS, ni ProductOutput, ni l'upload.
 */

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { EvaluateAnswerResult } from "@/lib/runtime/interview/evaluate-answer";
import { page, card, textarea, primaryBtn, ghostBtn, colors } from "../_components/styles";
import { VoiceMode } from "./_components/VoiceMode";

const DEFAULT_QUESTION =
  "Parle-moi d'une situation où tu as dû résoudre un problème complexe.";

function levelColor(level: string): string {
  if (level === "fort") return colors.good;
  if (level === "moyen") return colors.warn;
  return colors.bad;
}

function StarBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        marginRight: 6,
        marginBottom: 6,
        background: ok ? colors.goodSoft : colors.soft,
        color: ok ? colors.good : colors.sub,
        border: `1px solid ${ok ? colors.good : colors.line}`,
      }}
    >
      {ok ? "✔" : "○"} {label}
    </span>
  );
}

function InterviewInner() {
  const params = useSearchParams();
  const question = params.get("q")?.trim() || DEFAULT_QUESTION;
  const gap = params.get("gap")?.trim() || undefined;

  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<EvaluateAnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function evaluate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/product/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, gap }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Erreur lors de l'évaluation.");
      } else {
        setResult(data as EvaluateAnswerResult);
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = answer.trim().length > 0 && !loading;

  return (
    <main style={page}>
      <header style={{ marginBottom: 8 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>🎤 Simulation d'entretien</h1>
        <p style={{ color: colors.sub, marginTop: 6, fontSize: 14 }}>
          Réponds comme en entretien. On te coache immédiatement, sans jugement.
        </p>
      </header>

      {/* Mode vocal optionnel (P3.3) — n'altère pas le mode texte ci-dessous */}
      <VoiceMode {...(gap ? { gap } : {})} question={question} />

      {/* Étape 1 — Question */}
      <div style={card}>
        <p style={{ margin: "0 0 6px", fontSize: 13, color: colors.sub }}>
          Question {gap ? `(autour de « ${gap} »)` : ""}
        </p>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>« {question} »</p>
      </div>

      {/* Étape 2 — Réponse */}
      <div style={card}>
        <textarea
          style={{ ...textarea, minHeight: 180 }}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Réponds ici… Pense à la méthode STAR : Situation, Tâche, Action, Résultat."
        />
        <button
          style={{ ...primaryBtn, opacity: canSubmit ? 1 : 0.5 }}
          onClick={evaluate}
          disabled={!canSubmit}
        >
          {loading ? "Évaluation…" : "Évaluer ma réponse"}
        </button>
        {error && (
          <p style={{ color: colors.bad, marginTop: 12, fontSize: 14 }}>{error}</p>
        )}
      </div>

      {/* Étape 3 — Feedback */}
      {result && (
        <div style={card}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 13, color: colors.sub }}>Score</span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: levelColor(result.feedback.level),
              }}
            >
              {result.score}/100
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: levelColor(result.feedback.level),
                textTransform: "uppercase",
              }}
            >
              {result.feedback.level}
            </span>
          </div>

          <p style={{ marginTop: 10, fontSize: 15 }}>{result.feedback.message}</p>

          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 13, color: colors.sub, margin: "0 0 6px" }}>
              Structure STAR détectée :
            </p>
            <StarBadge label="Situation" ok={result.star.situation} />
            <StarBadge label="Tâche" ok={result.star.task} />
            <StarBadge label="Action" ok={result.star.action} />
            <StarBadge label="Résultat" ok={result.star.result} />
          </div>

          {result.feedback.positives.length > 0 && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: colors.goodSoft,
                borderRadius: 10,
              }}
            >
              <h4 style={{ margin: "0 0 6px", fontSize: 14 }}>✅ Ce qui marche</h4>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {result.feedback.positives.map((p, i) => (
                  <li key={i} style={{ fontSize: 14 }}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: colors.warnSoft,
              borderRadius: 10,
            }}
          >
            <h4 style={{ margin: "0 0 6px", fontSize: 14 }}>💡 Pour progresser</h4>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.feedback.improve.map((p, i) => (
                <li key={i} style={{ fontSize: 14 }}>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={ghostBtn}
              onClick={() => {
                setResult(null);
                setAnswer("");
              }}
            >
              ↺ Réessayer
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function InterviewPage() {
  // useSearchParams nécessite une frontière Suspense en App Router.
  return (
    <Suspense fallback={<main style={page}>Chargement…</main>}>
      <InterviewInner />
    </Suspense>
  );
}
