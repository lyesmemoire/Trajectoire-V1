"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { darkTokens } from "@/lib/theme/dark-tokens"
import { usePreviewStorage } from "@/hooks/usePreviewStorage"
import { PreviewTokenManager } from "@/lib/preview-analysis/previewTokenManager"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptCGU, setAcceptCGU] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { token: previewToken, claimPreview, hasToken } = usePreviewStorage()

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
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
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
          // Session ouverte : le claim peut se faire tout de suite.
          if (hasToken()) await claimPreview()
          window.location.href = '/simulation/new'
          return
        }
      }

      if (hasToken()) {
        if (signUpData.session) {
          // Confirmation d'e-mail désactivée : la session existe déjà.
          await claimPreview()
        } else if (previewToken) {
          // Pas de session avant la confirmation : le token voyage par cookie
          // (le sessionStorage ne survit pas à un autre onglet) et
          // /api/auth/callback fait le claim une fois la session créée.
          PreviewTokenManager.setLinkCookie(previewToken)
        }
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        style={darkTokens}
        className="min-h-screen bg-zinc-950 text-white/80 flex flex-col items-center justify-center p-6"
      >
        <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-900 p-8 text-center shadow-2xl shadow-black/40 space-y-4">
          <div className="text-emerald-400 text-5xl mb-4" aria-hidden="true">✉️</div>
          <h2 className="text-2xl font-semibold tracking-tight text-white/80">Vérifiez vos emails</h2>
          <p className="text-white/50">
            Un lien de confirmation a été envoyé à <span className="font-medium text-white/80">{email}</span>.
            Cliquez dessus pour activer votre compte.
          </p>
          <Link href="/login" className="block mt-6 rounded text-sm text-indigo-400 font-medium hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
        style={darkTokens}
        className="min-h-screen bg-zinc-950 text-white/80 flex flex-col items-center justify-center p-6"
      >
      <Link href="/" className="rounded-md text-2xl font-semibold tracking-tight text-white/80 mb-8 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950">
        Trajectoire
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-900 p-8 shadow-2xl shadow-black/40">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white/80 mb-2">Créer un compte</h1>
          <p className="text-white/50 text-sm">Rejoignez la plateforme d'entraînement stratégique.</p>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4">
            <p className="text-rose-300 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white/80 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-white/80 mb-1">Mot de passe</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              aria-describedby="pw-hint"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white/80 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              placeholder="••••••••"
              required
            />
            <p id="pw-hint" className="mt-1 text-xs text-zinc-500">
              6 caractères minimum.
            </p>
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-white/80 mb-1">Confirmer le mot de passe</label>
            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white/80 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
              className="mt-1 h-4 w-4 cursor-pointer rounded border-white/[0.2] bg-zinc-950 accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            />
            <label htmlFor="cgu" className="text-sm text-white/50 cursor-pointer leading-tight">
              J'accepte les <Link href="/terms" className="rounded text-indigo-400 hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900">conditions d'utilisation</Link> et la <Link href="/privacy" className="rounded text-indigo-400 hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900">politique de confidentialité</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Déjà un compte ? <Link href="/login" className="rounded text-indigo-400 font-medium hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
