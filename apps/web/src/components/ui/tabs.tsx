"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

export function Tabs({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl bg-surface-muted p-1 gap-0.5",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value

  return (
    <button
      onClick={() => context?.onValueChange(value)}
      role="tab"
      aria-selected={isActive}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-white text-foreground shadow-sm"
          : "text-foreground-muted hover:bg-white/60 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const context = React.useContext(TabsContext)
  if (context?.value !== value) return null
  return <div className={cn("mt-3", className)}>{children}</div>
}
