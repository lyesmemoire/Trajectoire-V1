// @ts-nocheck
"use client";

/**
 * ResultView — Écrans 3 → 7 : le résultat, "1 écran = 1 émotion".
 *  3. Score principal + barre
 *  4. Pourquoi ce score (forces / manques / risques)
 *  5. Ce que tu dois faire + impact estimé
 *  6. Préparation entretien (question + STAR)
 *  7. Plan d'action récapitulatif
 */
import type { ProductOutput } from "@/lib/runtime/product-contract";
import { card, colors, ghostBtn, scoreColor } from "./styles";

function Block({
  title,
  tone = "neutral",
  items,
}: {
  title: string;
  tone?: "good" | "warn" | "bad" | "neutral";
  items: string[];
}) {
  if (!items || items.length === 0) return null;
  const bg =
    tone === "good"
      ? colors.goodSoft
      : tone === "warn"
        ? colors.warnSoft
        : tone === "bad"
          ? colors.badSoft
          : colors.soft;
  return (
    <div style={{ marginTop: 14, padding: 14, background: bg, borderRadius: 12 }}>
      <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>{title}</h4>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 14, marginBottom: 2 }}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResultView({
  result,
  onRestart,
}: {
  result: ProductOutput;
  onRestart: () => void;
}) {
  const c = scoreColor(result.matchScore);

  return (
    <div>
      {/* Écran 3 — Score principal */}
      <div style={{ ...card, textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, color: colors.sub, letterSpacing: 0.5 }}>
          TON MATCH AVEC CE POSTE
        </p>
        <div style={{ fontSize: 56, fontWeight: 800, color: c, lineHeight: 1.1 }}>
          {result.matchScore}%
        </div>
        <div
          style={{
            height: 12,
            borderRadius: 999,
            background: colors.line,
            overflow: "hidden",
            margin: "12px auto 0",
            maxWidth: 360,
          }}
        >
          <div
            style={{
              width: `${result.matchScore}%`,
              height: "100%",
              background: c,
              transition: "width .6s ease",
            }}
          />
        </div>
        {result.interpretation && (
          <p style={{ marginTop: 16, fontSize: 15, color: colors.ink }}>
            🧠 {result.interpretation}
          </p>
        )}
      </div>

      {/* Écran 4 — Pourquoi ce score */}
      <div style={card}>
        <h3 style={{ margin: "0 0 4px", fontSize: 17 }}>🔍 Pourquoi ce score ?</h3>
        <Block title="✅ Tes forces" tone="good" items={result.strengths} />
        <Block title="❌ Ce qui manque" tone="warn" items={result.gaps} />
        <Block title="⚠️ Points de vigilance" tone="bad" items={result.risks} />
        <Block title="Détail" tone="neutral" items={result.explanation} />
      </div>

      {/* Écran 5 — Ce que tu dois faire */}
      <div style={card}>
        <h3 style={{ margin: "0 0 10px", fontSize: 17 }}>
          🚀 Pour augmenter tes chances
        </h3>
        <ol style={{ margin: 0, paddingLeft: 22 }}>
          {result.actions.map((a, i) => (
            <li key={i} style={{ fontSize: 14, marginBottom: 6 }}>
              {a}
            </li>
          ))}
        </ol>
        {typeof result.estimatedImpact === "number" &&
          result.estimatedImpact > 0 && (
            <p
              style={{
                marginTop: 14,
                padding: "12px 14px",
                background: colors.goodSoft,
                borderRadius: 10,
                fontSize: 14,
                color: colors.good,
                fontWeight: 600,
              }}
            >
              📈 Impact estimé : +{result.estimatedImpact}% de chances d'entretien
            </p>
          )}
      </div>

      {/* Écran 6 — Préparation entretien */}
      {result.interviewPrep && (
        <div style={card}>
          <h3 style={{ margin: "0 0 10px", fontSize: 17 }}>
            🎤 Prépare ton entretien
          </h3>
          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>
            Question probable :
          </p>
          <p
            style={{
              fontSize: 15,
              fontStyle: "italic",
              padding: "12px 14px",
              background: colors.brandSoft,
              borderRadius: 10,
              margin: "0 0 12px",
            }}
          >
            « {result.interviewPrep.question} »
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>
            👉 Structure ta réponse :
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {result.interviewPrep.structure.map((s, i) => (
              <li key={i} style={{ fontSize: 14, marginBottom: 2 }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Écran 7 — Plan d'action récap */}
      <div style={{ ...card, background: colors.soft }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 17 }}>
          📌 Ton plan pour réussir
        </h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li style={{ fontSize: 14 }}>Optimiser ton CV sur les manques identifiés</li>
          {result.gaps[0] && (
            <li style={{ fontSize: 14 }}>
              Renforcer ton expérience sur « {result.gaps[0]} »
            </li>
          )}
          <li style={{ fontSize: 14 }}>Préparer l'entretien avec la méthode STAR</li>
        </ul>
        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href={`/product/interview?q=${encodeURIComponent(
              result.interviewPrep?.question ?? "",
            )}&gap=${encodeURIComponent(result.gaps[0] ?? "")}`}
            style={{ ...ghostBtn, textDecoration: "none", display: "inline-block" }}
          >
            🎤 S'entraîner à l'entretien
          </a>
          <button style={ghostBtn} onClick={onRestart}>
            ↺ Analyser un autre poste
          </button>
        </div>
      </div>
    </div>
  );
}
