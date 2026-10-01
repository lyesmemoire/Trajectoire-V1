import type { ReactNode } from "react"
import { darkTokens } from "@/lib/theme/dark-tokens"

/**
 * Pages de facturation (retour de paiement) : hors de `(app)/`, donc sans la garde d'onboarding du layout
 * `(app)` (qui renverrait un compte neuf vers /onboarding en perdant la page de confirmation). Même principe
 * que /onboarding : plein écran, jetons sombres appliqués ici.
 */
export default function BillingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={darkTokens}
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950 text-white/80 selection:bg-indigo-500/30 selection:text-white"
    >
      {children}
    </div>
  )
}
