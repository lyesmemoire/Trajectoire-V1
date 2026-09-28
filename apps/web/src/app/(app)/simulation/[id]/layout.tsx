import type { ReactNode } from "react"

export default function SimulationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      {children}
    </div>
  )
}