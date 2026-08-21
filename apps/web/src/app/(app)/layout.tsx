import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app/AppSidebar"

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-73px)] bg-ivoire-50 text-ink-900">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="flex gap-6">
          <AppSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}
