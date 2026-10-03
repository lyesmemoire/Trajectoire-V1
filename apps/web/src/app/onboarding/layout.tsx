import type { ReactNode } from "react"

/**
 * Layout plein écran de l'onboarding : hors de l'app shell (pas de sidebar).
 * Même principe que simulation/[id]/layout.tsx, mais /onboarding n'est pas sous
 * (app)/ : le layout pose donc lui-même le fond et la couleur de texte Calm.
 */
export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-calm-bg text-calm-ink selection:bg-calm-accent-soft selection:text-calm-ink"
    >
      {children}
    </div>
  )
}
