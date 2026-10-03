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
  bg: "#FFFFFF", // fond
  alt: "#F4F5F2", // fond alterné des sections
  surface: "#FFFFFF", // cartes, panneaux
  line: "#E0E3DE", // filets légers
  lineSoft: "#E0E3DE", // filets discrets
  rule: "#161B19", // filet fort
  field: "#BFC4BE", // zones de dépôt (décoratif ; les champs gardent `input`)
  ink: "#161B19", // texte principal
  secondary: "#565D59", // texte secondaire
  tertiary: "#444C48", // texte d’introduction
  accent: "#195747", // sauge : actions, liens
  accentDeep: "#103C31", // survol
  accentSoft: "#DCE8DF", // pastilles, fonds d'état
  accentWash: "#F4F5F2", // aplat très léger (= fond alterné)
  onAccent: "#FFFFFF", // texte sur fond accent
  onAccent2: "#D7E3DA", // texte secondaire sur fond accent
  onAccentMark: "#CFE1D3", // repères sur fond accent
  focus: "#B0703A", // contour de focus : 3 px, décalage 4 px
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

// ─── Rayons : 4 à 6 px ─────────────────────────────────────────────
export const radius = {
  control: "rounded-lg", // 6 px : boutons, champs
  card: "rounded-xl", // 6 px : cartes
  panel: "rounded-2xl", // 6 px : grands panneaux
} as const

// ─── Typographie ──────────────────────────────────────────────────────────
export const fonts = {
  /** Texte : DM Sans (variable CSS `--font-dmsans`). */
  body: "font-sans",
  /** Titres, citations, prix : Cormorant Garamond (`--font-cormorant`), graisse 500. */
  title: "font-serif",
  /** Mots d’accent : Cormorant italique, couleur accent, un mot ou une courte phrase seulement. */
  accent: "font-accent",
} as const

/** Titres fluides (clamp) : `text-calm-display`, `text-calm-h1`, `text-calm-h2`, `text-calm-h3`. */
export const headings = ["text-calm-display", "text-calm-h1", "text-calm-h2", "text-calm-h3"] as const

// ─── Ombres : aucune, sauf le portrait (`shadow-portrait`) et la carte du rapport (`shadow-report`) ───────────────────────────────────────────────────────────────
export const shadow = {
  subtle: "shadow-subtle",
  card: "shadow-calm",
  elevated: "shadow-elevated",
} as const

/**
 * RÈGLES FONDAMENTALES
 *
 * 1. Polices : DM Sans (texte) et Cormorant Garamond (titres, citations, prix, accents), chargées par next/font dans `app/layout.tsx`.
 * 2. Une seule ambiance claire : aucune classe sombre (`bg-zinc-950`, `text-white/80`…), aucun `dark:`.
 * 3. Contraste ≥ 4,5:1 pour le texte, ≥ 3:1 pour les contours de champs et les icônes porteuses de sens.
 * 4. CTA primaire : `bg-calm-accent text-white` (survol `bg-calm-accent-deep`) ; focus visible : anneau sauge.
 * 5. Cibles tactiles ≥ 44 px ; mouvement doux, coupé si `prefers-reduced-motion`.
 * 6. Jamais de rouge vif : avertissement = `warn` / `warn-soft` / `warn-line`.
 * 7. Typographie française : espaces insécables avant « : ; ? ! % » et dans « … ».
 */
