/**
 * Design tokens — Trajectoire (Career Intelligence Workspace)
 *
 * Ce fichier documente le système de tokens SÉMANTIQUES.
 * Toutes les pages et composants de l'espace authentifié DOIVENT utiliser
 * ces tokens plutôt que des couleurs hardcodées.
 *
 * Les couleurs Tailwind old-school (ivoire, ink, bronze, terracotta, forest)
 * restent disponibles dans tailwind.config.ts pour la compatibilité avec
 * les composants marketing et landing — ne pas les supprimer.
 */

// ─── Palette sémantique applicative ───────────────────────────────────────
export const colors = {
  bg: {
    primary: "hsl(var(--background))",    // #FAFAFC — fond global
    surface: "hsl(var(--surface))",       // #FFFFFF — fond carte
    muted: "hsl(var(--surface-muted))",   // #F3F4F6 — fond subtil
  },
  text: {
    primary: "hsl(var(--foreground))",         // #0F172A — texte principal
    secondary: "hsl(var(--foreground-muted))", // #64748B — texte secondaire
  },
  accent: {
    violet: "#7C3AED",      // primary — Trajectoire brand
    violetLight: "#F5F3FF", // primary-50
  },
  border: {
    default: "hsl(var(--border))",  // #E2E8F0
  },
  state: {
    success: "hsl(var(--success))", // #10B981 Emerald
    warning: "hsl(var(--warning))", // #F59E0B Amber
    danger: "hsl(var(--danger))",   // #EF4444 Rose
    info: "hsl(var(--info))",       // #0EA5E9 Sky
  },
} as const

// ─── Radius ───────────────────────────────────────────────────────────────
export const radius = {
  sm: "rounded-md",   // 0.5rem  — inputs, badges
  md: "rounded-lg",   // 0.75rem — buttons, small cards
  lg: "rounded-xl",   // 1rem    — standard cards
  xl: "rounded-2xl",  // 1.5rem  — modals, hero sections
} as const

// ─── Shadow ───────────────────────────────────────────────────────────────
export const shadow = {
  subtle:   "shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]",
  card:     "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]",
  elevated: "shadow-[0_4px_12px_-2px_rgba(30,27,75,0.08),0_2px_4px_-2px_rgba(30,27,75,0.04)]",
} as const

// ─── Typography ───────────────────────────────────────────────────────────
export const fonts = {
  /** App : tous les titres fonctionnels */
  heading: "font-sans",
  /** Corps de texte */
  body: "font-sans",
  /** Marketing / moments de marque uniquement */
  brand: "font-serif",
} as const

// ─── Spacing scale (px) ───────────────────────────────────────────────────
// Rythme recommandé : 8 / 12 / 16 / 20 / 24 / 32 / 48
export const spacing = {
  cardPadding: "p-5",       // standard card inner padding
  sectionGap: "gap-6",      // gap between page sections
  pageHeader: "pb-5",       // page header bottom spacing
} as const

/**
 * RÈGLES FONDAMENTALES
 *
 * 1. Espace app : font-sans partout (titres, labels, valeurs)
 * 2. Fraunces (font-serif) : UNIQUEMENT marketing/landing et
 *    moments de marque explicitement justifiés (ex: logo sidebar)
 * 3. CTA primaire : bg-primary text-white (violet) — jamais bg-ink-900 dans l'app
 * 4. Densité : paddings 20–24px pour les cartes, 16–20px pour les items de liste
 * 5. Ombres ultra-subtiles — max shadow-sm sur cards normales
 */
