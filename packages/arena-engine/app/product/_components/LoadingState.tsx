"use client";

/**
 * LoadingState — Écran 2 : loading humain anti-stress.
 * Affiche des étapes qui se "valident" progressivement pour transformer
 * l'attente en accompagnement. Purement visuel (le vrai appel tourne en parallèle).
 */
import { useEffect, useState } from "react";
import { card, colors } from "./styles";

const STEPS = [
  "Lecture du CV",
  "Analyse du poste",
  "Comparaison des compétences",
  "Simulation du matching",
  "Génération du rapport",
];

export default function LoadingState() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a < STEPS.length ? a + 1 : a));
    }, 650);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ ...card, background: colors.soft }}>
      <h2 style={{ fontSize: 18, margin: "0 0 16px" }}>⏳ Analyse en cours…</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {STEPS.map((step, i) => {
          const done = i < active;
          return (
            <li
              key={step}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 0",
                color: done ? colors.ink : colors.sub,
                transition: "color .3s",
              }}
            >
              <span
                style={{
                  width: 20,
                  textAlign: "center",
                  color: done ? colors.good : colors.sub,
                }}
              >
                {done ? "✔" : "○"}
              </span>
              <span style={{ fontSize: 14 }}>{step}</span>
            </li>
          );
        })}
      </ul>
      <p
        style={{
          marginTop: 16,
          padding: "12px 14px",
          background: colors.brandSoft,
          borderRadius: 10,
          fontSize: 13,
          color: colors.brand,
        }}
      >
        💡 On cherche tes points forts, pas tes erreurs.
      </p>
    </div>
  );
}
