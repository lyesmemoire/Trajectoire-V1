import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app/AppSidebar"
import { darkTokens } from "@/lib/theme/dark-tokens"

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
