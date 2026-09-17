import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app/AppSidebar"

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground selection:bg-primary-50 selection:text-primary-700">
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