"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect.")
        } else {
          setError("Veuillez vérifier vos identifiants ou valider votre email.")
        }
        setLoading(false)
        return
      }

      if (!data.user) {
        setError("Erreur inattendue lors de la connexion.")
        setLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Une erreur critique est survenue. Veuillez réessayer.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivoire-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="text-2xl font-serif font-bold text-ink-900 mb-8">
        Trajectoire
      </Link>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-ivoire-200 shadow-premium">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-ink-900 mb-2">Bon retour</h1>
          <p className="text-ink-600 text-sm">Connectez-vous pour accéder à votre espace.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brick-50 border border-brick-100 rounded-xl">
            <p className="text-brick-600 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-ivoire-300 text-ink-900 bg-white placeholder-ink-400 focus:outline-none focus:border-bronze-400 focus:ring-2 focus:ring-bronze-400/20 transition-all"
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-ink-700">Mot de passe</label>
              <Link href="/forgot-password" className="text-xs text-bronze-600 hover:underline">Mot de passe oublié ?</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-ivoire-300 text-ink-900 bg-white placeholder-ink-400 focus:outline-none focus:border-bronze-400 focus:ring-2 focus:ring-bronze-400/20 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="md">
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-bronze-600 font-medium hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
