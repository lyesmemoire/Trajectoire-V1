import type { CSSProperties, ReactNode } from "react"
import { AppSidebar } from "@/components/app/AppSidebar"

/**
 * Thème sombre de l'espace authentifié (zinc-950).
 *
 * Les tokens sémantiques (--background, --foreground, --surface…) sont définis
 * en clair dans globals.css. On les redéfinit ici, sur ce wrapper uniquement,
 * pour que les pages qui les utilisent (bg-background, text-foreground,
 * bg-surface, border-border…) basculent en sombre sans impacter le marketing.
 * Les valeurs sont des canaux HSL, comme dans globals.css.
 */
const darkTokens = {
  "--background": "240 10% 4%", // zinc-950
  "--foreground": "0 0% 81%", // ≈ white/80 sur zinc-950
  "--foreground-muted": "240 5% 55%",
  "--surface": "240 6% 10%", // zinc-900
  "--surface-muted": "240 5% 13%",
  "--border": "240 4% 16%", // zinc-800
  colorScheme: "dark",
} as CSSProperties

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={darkTokens}
      className="min-h-dvh bg-zinc-950 text-white/80 selection:bg-indigo-500/30 selection:text-white"
    >
      <div className="mx-auto flex w-full max-w-[1440px]">
        <AppSidebar />

        <main
          id="main"
          className="min-w-0 flex-1 px-6 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
