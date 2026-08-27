import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app/AppSidebar"

export default function AppGroupLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-[calc(100dvh-73px)] bg-[#f8f7fc] text-slate-950">
      <div className="mx-auto flex w-full max-w-[1600px] gap-5 px-4 py-5 sm:px-6 lg:px-7">
        <AppSidebar />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}