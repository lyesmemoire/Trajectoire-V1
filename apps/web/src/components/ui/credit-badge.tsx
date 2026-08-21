"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

interface CreditBadgeProps {
  userId: string
  className?: string
}

export function CreditBadge({ userId, className = "" }: CreditBadgeProps) {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    async function loadCredits() {
      const { data, error } = await supabase
        .from("users")
        .select("credits")
        .eq("id", userId)
        .maybeSingle()

      if (!mounted) return

      if (error) {
        console.error("[CreditBadge] Failed to load credits:", error)
        setCredits(0)
      } else {
        const userRow = data as { credits: number } | null
        setCredits(userRow?.credits ?? 0)
      }

      setLoading(false)
    }

    void loadCredits()

    const channel = supabase
      .channel(`user-credits-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const updatedUser = payload.new as { credits?: number }

          if (typeof updatedUser.credits === "number") {
            setCredits(updatedUser.credits)
          }
        },
      )
      .subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [userId])

  if (loading) {
    return (
      <div
        className={`h-6 w-16 animate-pulse rounded-full bg-ivoire-200 ${className}`}
      />
    )
  }

  const balance = credits ?? 0
  const isLow = balance <= 1
  const isEmpty = balance === 0

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium
        ${
          isEmpty
            ? "bg-brick-50 text-brick-700 ring-1 ring-brick-100"
            : isLow
              ? "bg-terracotta-50 text-terracotta-600 ring-1 ring-terracotta-100"
              : "bg-forest-50 text-forest-600 ring-1 ring-forest-100"
        }
        ${className}
      `}
    >
      <span className="text-base leading-none">
        {isEmpty ? "âš ï¸" : isLow ? "ðŸŸ¡" : "âœ¨"}
      </span>

      <span>
        {balance} crÃ©dit{balance !== 1 ? "s" : ""}
      </span>
    </div>
  )
}
