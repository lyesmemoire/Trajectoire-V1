/** Classes partagées de la homepage (référence : docs/design/homepage-finale-apercu.html). */

/** Repère en capitales vertes (12 px, 0,16 em). Combiné avec un trait `<i>` quand il est précédé d'un filet. */
export const eyebrow = "m-0 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-calm-accent"

/** Index de section (« 01 / La méthode ») et intitulés en capitales. */
export const idx = "text-xs font-bold uppercase tracking-[0.12em] text-calm-accent"

/** Texte secondaire (couleur seulement). */
export const muted = "text-calm-secondary"

/** Bouton plein accent, rayon 4 px. */
export const btn =
  "inline-flex items-center justify-center gap-3.5 rounded-[4px] bg-calm-accent font-semibold text-white no-underline transition-colors hover:bg-calm-accent-deep"

/** Titres de section : taille fluide 40 → 76 px. */
export const h2Big = "text-[clamp(40px,5.6vw,76px)] leading-[0.95]"
