/**
 * Verrou d'achat des offres payantes. Faux tant que la production ne peut pas livrer une simulation et son rapport de
 * bout en bout et que le paiement n'a pas été testé avec un vrai achat. Lu par la homepage, /pricing et
 * POST /api/stripe/checkout : à passer à true seulement quand c'est vrai (une seule ligne, un seul endroit).
 */
export const PURCHASE_ENABLED = false

export const PURCHASE_SOON_LABEL = "Bientôt disponible"

export const PURCHASE_DISABLED_MESSAGE =
  "L’achat des offres payantes n’est pas encore ouvert. Le diagnostic gratuit de votre CV reste disponible."
