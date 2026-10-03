import type { CSSProperties } from "react"

/**
 * @deprecated Le mode sombre est supprimé (design system « Calm », 2026-10-07) : une seule ambiance, claire.
 * Ne plus utiliser ces jetons ; ils ne subsistent que pour les écrans pas encore migrés et seront retirés avec
 * le dernier. Voir `.claude/decisions.md` (« Design system Calm »).
 *
 * Thème sombre (zinc-950) de l'espace authentifié et de l'onboarding.
 *
 * Les tokens sémantiques (--background, --foreground, --surface…) sont définis
 * en clair dans globals.css. On les redéfinit sur un wrapper (style inline)
 * pour que les composants qui les utilisent (bg-surface, text-foreground,
 * border-border, ui/Input…) basculent en sombre sans impacter le marketing.
 * Les valeurs sont des canaux HSL, comme dans globals.css.
 */
export const darkTokens = {
  "--background": "240 10% 4%", // zinc-950
  "--foreground": "0 0% 81%", // ≈ white/80 sur zinc-950
  "--foreground-muted": "240 5% 55%",
  "--surface": "240 6% 10%", // zinc-900
  "--surface-muted": "240 5% 13%",
  "--border": "240 4% 16%", // zinc-800
  colorScheme: "dark",
} as CSSProperties
