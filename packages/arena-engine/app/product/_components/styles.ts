/**
 * styles.ts — Tokens de style partagés pour le flux produit (P1).
 * Styles inline volontaires : rendu fiable même sans CSS externe (preview sandbox).
 * Design "minimal-stress" : doux, aéré, couleurs rassurantes.
 */
import type { CSSProperties } from "react";

export const colors = {
  ink: "#0f172a",
  sub: "#64748b",
  line: "#e2e8f0",
  soft: "#f8fafc",
  brand: "#4f46e5",
  brandSoft: "#eef2ff",
  good: "#16a34a",
  warn: "#ca8a04",
  bad: "#dc2626",
  goodSoft: "#f0fdf4",
  warnSoft: "#fefce8",
  badSoft: "#fef2f2",
};

export function scoreColor(score: number): string {
  if (score >= 65) return colors.good;
  if (score >= 45) return colors.warn;
  return colors.bad;
}

export const page: CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "40px 20px 80px",
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  color: colors.ink,
  lineHeight: 1.55,
};

export const card: CSSProperties = {
  border: `1px solid ${colors.line}`,
  borderRadius: 16,
  padding: 24,
  background: "#fff",
  marginTop: 20,
};

export const label: CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: 8,
  fontSize: 14,
};

export const textarea: CSSProperties = {
  width: "100%",
  minHeight: 150,
  padding: 14,
  border: `1px solid #cbd5e1`,
  borderRadius: 12,
  fontSize: 14,
  resize: "vertical",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export const primaryBtn: CSSProperties = {
  width: "100%",
  marginTop: 20,
  padding: "16px 24px",
  background: colors.brand,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

export const ghostBtn: CSSProperties = {
  padding: "12px 20px",
  background: "#fff",
  color: colors.brand,
  border: `1px solid ${colors.brand}`,
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};
