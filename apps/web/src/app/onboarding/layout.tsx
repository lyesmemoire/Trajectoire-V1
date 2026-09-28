import type { ReactNode } from "react"
import { darkTokens } from "@/lib/theme/dark-tokens"

/**
 * Layout plein écran de l'onboarding : hors de l'app shell (pas de sidebar).
 * Même principe que simulation/[id]/layout.tsx, mais /onboarding n'est pas sous
 * (app)/ : on applique donc ici les tokens sombres, sinon les composants
 * tokenisés (ui/Input, bg-surface…) resteraient en clair.
 */
export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={darkTokens}
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950 text-white/80 selection:bg-indigo-500/30 selection:text-white"
    >
      {children}
    </div>
  )
}
