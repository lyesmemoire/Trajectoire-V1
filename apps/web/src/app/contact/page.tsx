"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-ivoire-50">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-8 transition-colors"
        >
          ← Retour à l'accueil
        </Link>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-ivoire-200 p-8 shadow-premium">
          <h1 className="text-3xl font-serif font-bold text-ink-900 mb-4">Contactez-nous</h1>
          <p className="text-ink-600 mb-8">
            Une question ? Nous répondons sous 24h.
          </p>

          <div className="bg-ivoire-50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-bronze-100 p-3 rounded-xl" aria-hidden="true">
                <Mail className="w-6 h-6 text-bronze-600" />
              </div>
              <div>
                <h3 className="font-semibold text-ink-900 mb-1">Email</h3>
                <a
                  href="mailto:support@trajectoire.app"
                  className="text-bronze-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-bronze-400 rounded"
                >
                  support@trajectoire.app
                </a>
              </div>
            </div>
          </div>

          {user && (
            <div className="mt-8 pt-8 border-t border-ivoire-200">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Retour au tableau de bord
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
