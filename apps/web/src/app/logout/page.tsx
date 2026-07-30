"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    }

    logout()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivoire-50 to-ivoire-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink-400 mx-auto mb-4"></div>
        <p className="text-ink-600">Déconnexion en cours...</p>
      </div>
    </div>
  )
}
