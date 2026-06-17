"use client";

/**
 * /product — Flux produit P1 (1 écran = 1 émotion).
 *
 *   Écran 1 (input) → Écran 2 (loading rassurant) → Écrans 3–7 (résultat)
 *
 * État géré côté client, sur une seule route, pour une transition fluide
 * sans navigation cassante. L'UI ne consomme QUE le ProductOutput de l'API.
 */

import { useState } from "react";
import type { ProductOutput } from "@/lib/runtime/product-contract";
import { page, card, label, textarea, primaryBtn, colors } from "./_components/styles";
import LoadingState from "./_components/LoadingState";
import ResultView from "./_components/ResultView";
import { CvUpload } from "./_components/CvUpload";

type Phase = "input" | "loading" | "result";

export default function ProductPage() {
  const [phase, setPhase] = useState<Phase>("input");
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<ProductOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = cvText.trim().length > 0 && jobText.trim().length > 0;

  async function analyze() {
    setError(null);
    setPhase("loading");
    const startedAt = Date.now();
    try {
      const res = await fetch("/api/product/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobText }),
      });
      const data = await res.json();
      // Laisse le loading rassurant s'afficher un minimum (UX anti-stress).
      const elapsed = Date.now() - startedAt;
      if (elapsed < 1800) await new Promise((r) => setTimeout(r, 1800 - elapsed));

      if (!res.ok) {
        setError(data?.error ?? "Erreur inconnue.");
        setPhase("input");
      } else {
        setResult(data as ProductOutput);
        setPhase("result");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
      setPhase("input");
    }
  }

  function restart() {
    setResult(null);
    setPhase("input");
  }

  return (
    <main style={page}>
      <header style={{ marginBottom: 8 }}>
        <h1 style={{ fontSize: 26, margin: 0 }}>Passe tes entretiens sans stress</h1>
        <p style={{ color: colors.sub, marginTop: 6, fontSize: 14 }}>
          Colle ton CV et une offre. On te dit où tu en es, pourquoi, et quoi faire.
          Tu n'as rien à préparer.
        </p>
      </header>

      {phase === "input" && (
        <>
          <div style={card}>
            <label style={label} htmlFor="cv">
              📄 Étape 1 — Ton CV
            </label>
            <CvUpload onExtract={(text) => setCvText(text)} />
            <p
              style={{
                textAlign: "center",
                color: colors.sub,
                fontSize: 12,
                margin: "10px 0",
              }}
            >
              — ou colle ton CV ci-dessous —
            </p>
            <textarea
              id="cv"
              style={textarea}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Colle ici le texte de ton CV…"
            />
            <label style={{ ...label, marginTop: 18 }} htmlFor="job">
              📌 Étape 2 — L'offre d'emploi
            </label>
            <textarea
              id="job"
              style={textarea}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Colle ici la description du poste…"
            />
            <button
              style={{ ...primaryBtn, opacity: canSubmit ? 1 : 0.5 }}
              onClick={analyze}
              disabled={!canSubmit}
            >
              Analyser mon profil
            </button>
            {error && (
              <p style={{ color: colors.bad, marginTop: 14, fontSize: 14 }}>
                {error}
              </p>
            )}
          </div>
          <p
            style={{
              textAlign: "center",
              color: colors.sub,
              fontSize: 13,
              marginTop: 14,
            }}
          >
            💡 Aucune inscription requise. Juste copier-coller.
          </p>
        </>
      )}

      {phase === "loading" && <LoadingState />}

      {phase === "result" && result && (
        <ResultView result={result} onRestart={restart} />
      )}
    </main>
  );
}
