/**
 * Design tokens — Trajectoire, design system « Calm » (ambiance Sauge, décision du 2026-10-07).
 *
 * Les valeurs vivent dans `app/globals.css` (variables `--calm-*` en RGB, jetons sémantiques en HSL) et sont
 * exposées à Tailwind par `tailwind.config.ts` (`bg-calm-bg`, `text-calm-ink`, `border-calm-line`…). Ce fichier
 * documente le système et sert de référence aux tests de contraste.
 *
 * Une seule ambiance, claire : pas de mode sombre. Aucune couleur d'alerte vive : l'avertissement est un brun
 * ambré doux (`warn`), jamais un rouge.
 */

// ─── Palette ──────────────────────────────────────────────────────────────
export const palette = {
  bg: "#FAFAF8", // fond
  surface: "#FFFFFF", // cartes, panneaux
  line: "#E6E4DE", // bordures
  lineSoft: "#ECEBE6", // bordures discrètes
  ink: "#1F2A37", // texte principal
  secondary: "#4B5563", // texte secondaire
  tertiary: "#3F4855", // texte tertiaire (≥ 4,5:1 sur le fond)
  accent: "#2F6B5E", // sauge : actions, liens, focus
  accentDeep: "#245247", // survol, texte sur fond sauge clair
  accentSoft: "#E3EFE9", // pastilles, fonds d'état
  accentWash: "#F1F7F3", // aplat très léger
  accentLine: "#B9D3C8", // bordure sauge
  warn: "#8A4B16", // avertissement doux
  warnSoft: "#FBF3E8", // fond d'avertissement (dérivé)
  warnLine: "#E8D2B4", // bordure d'avertissement (dérivée)
  input: "#7C8590", // contour de champ (≥ 3:1 sur blanc, WCAG 1.4.11)
} as const

// ─── Jetons sémantiques (variables CSS) ───────────────────────────────────
export const colors = {
  bg: { primary: "hsl(var(--background))", surface: "hsl(var(--surface))", muted: "hsl(var(--surface-muted))" },
  text: { primary: "hsl(var(--foreground))", secondary: "hsl(var(--foreground-muted))" },
  accent: { default: "hsl(var(--primary))", soft: "hsl(var(--accent))" },
  border: { default: "hsl(var(--border))" },
  state: {
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    danger: "hsl(var(--danger))", // = avertissement doux, jamais rouge
    info: "hsl(var(--info))",
  },
} as const

// ─── Rayons : 14 / 20 / 30 px ─────────────────────────────────────────────
export const radius = {
  control: "rounded-lg", // 14 px : boutons, champs, pastilles
  card: "rounded-xl", // 20 px : cartes
  panel: "rounded-2xl", // 30 px : grands panneaux, héros
} as const

// ─── Typographie ──────────────────────────────────────────────────────────
export const fonts = {
  /** Texte et titres : Figtree (variable CSS `--font-figtree`). */
  body: "font-sans",
  /** Accents : Newsreader italique, un mot ou une courte phrase seulement. */
  accent: "font-accent",
} as const

/** Titres fluides (clamp) : `text-calm-display`, `text-calm-h1`, `text-calm-h2`, `text-calm-h3`. */
export const headings = ["text-calm-display", "text-calm-h1", "text-calm-h2", "text-calm-h3"] as const

// ─── Ombres ───────────────────────────────────────────────────────────────
export const shadow = {
  subtle: "shadow-subtle",
  card: "shadow-calm",
  elevated: "shadow-elevated",
} as const

/**
 * RÈGLES FONDAMENTALES
 *
 * 1. Polices : Figtree (texte) et Newsreader italique (accents), chargées par next/font dans `app/layout.tsx`.
 * 2. Une seule ambiance claire : aucune classe sombre (`bg-zinc-950`, `text-white/80`…), aucun `dark:`.
 * 3. Contraste ≥ 4,5:1 pour le texte, ≥ 3:1 pour les contours de champs et les icônes porteuses de sens.
 * 4. CTA primaire : `bg-calm-accent text-white` (survol `bg-calm-accent-deep`) ; focus visible : anneau sauge.
 * 5. Cibles tactiles ≥ 44 px ; mouvement doux, coupé si `prefers-reduced-motion`.
 * 6. Jamais de rouge vif : avertissement = `warn` / `warn-soft` / `warn-line`.
 * 7. Typographie française : espaces insécables avant « : ; ? ! % » et dans « … ».
 */
