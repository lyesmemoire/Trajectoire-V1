"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { usePreviewStorage } from "@/hooks/usePreviewStorage"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptCGU, setAcceptCGU] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { claimPreview, hasToken, clearToken } = usePreviewStorage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.")
      return
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.")
      return
    }
    if (!acceptCGU) {
      setError("Vous devez accepter les conditions d'utilisation.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          // Skip email confirmation in development
          ...(process.env.NODE_ENV === 'development' ? { data: { skip_email_confirmation: true } } : {}),
        },
      })

      if (signUpError) throw signUpError

      // In development, auto-signin after signup
      if (process.env.NODE_ENV === 'development') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (!signInError) {
          window.location.href = '/dashboard'
          return
        }
      }

      setSuccess(true)

      // Auto-claim de la preview si un token existe
      if (hasToken()) {
        await claimPreview()
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-ivoire-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-ivoire-200 shadow-premium text-center space-y-4">
          <div className="text-forest-500 text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-serif font-bold text-ink-900">Vérifiez vos emails</h2>
          <p className="text-ink-600">
            Un lien de confirmation a été envoyé à <span className="font-medium text-ink-900">{email}</span>.
            Cliquez dessus pour activer votre compte.
          </p>
          <Link href="/login" className="block mt-6 text-sm text-bronze-600 font-medium hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivoire-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="text-2xl font-serif font-bold text-ink-900 mb-8">
        Trajectoire
      </Link>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-ivoire-200 shadow-premium">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-ink-900 mb-2">Créer un compte</h1>
          <p className="text-ink-600 text-sm">Rejoignez la plateforme d'entraînement stratégique.</p>
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
            <label className="block text-sm font-medium text-ink-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-ivoire-300 text-ink-900 bg-white placeholder-ink-400 focus:outline-none focus:border-bronze-400 focus:ring-2 focus:ring-bronze-400/20 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-ivoire-300 text-ink-900 bg-white placeholder-ink-400 focus:outline-none focus:border-bronze-400 focus:ring-2 focus:ring-bronze-400/20 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-start gap-3 py-2">
            <input
              type="checkbox"
              id="cgu"
              checked={acceptCGU}
              onChange={(e) => setAcceptCGU(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-ivoire-300 text-bronze-600 focus:ring-bronze-400 cursor-pointer"
            />
            <label htmlFor="cgu" className="text-sm text-ink-600 cursor-pointer leading-tight">
              J'accepte les <Link href="/terms" className="text-bronze-600 hover:underline">conditions d'utilisation</Link> et la <Link href="/privacy" className="text-bronze-600 hover:underline">politique de confidentialité</Link>.
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="md">
            {loading ? "Création en cours..." : "S'inscrire"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          Déjà un compte ? <Link href="/login" className="text-bronze-600 font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
