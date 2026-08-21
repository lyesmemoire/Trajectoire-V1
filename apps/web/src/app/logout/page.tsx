"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.replace("/login")
      router.refresh()
    })()
  }, [router])

  return <div className="min-h-screen bg-ivoire-50" />
}