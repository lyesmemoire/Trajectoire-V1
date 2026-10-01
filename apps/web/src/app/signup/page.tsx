"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { usePreviewStorage } from "@/hooks/usePreviewStorage"
import { PreviewTokenManager } from "@/lib/preview-analysis/previewTokenManager"
import { isValidEmail, normalizeEmail, validatePassword, MIN_PASSWORD_LENGTH } from "@/lib/auth/credentials"
import { translateAuthError } from "@/lib/auth/auth-errors"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptCGU, setAcceptCGU] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "failed">("idle")
  const [cooldown, setCooldown] = useState(0)

  const { token: previewToken, claimPreview, hasToken } = usePreviewStorage()

  // Utilisateur déjà connecté : inutile de créer un compte, on l'envoie sur son espace.
  useEffect(() => {
    let cancelled = false
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => {
        if (!cancelled && data.authenticated) window.location.replace("/dashboard")
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  // Délai avant un nouvel envoi (limite d'envoi d'e-mails côté Supabase).
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = async () => {
    if (resendState === "sending" || cooldown > 0) return
    setResendState("sending")
    try {
      const supabase = createClient()
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: normalizeEmail(email),
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
      })
      if (resendError) {
        setResendState("failed")
        setError(translateAuthError(resendError))
        return
      }
      setError("")
      setResendState("sent")
      setCooldown(60)
    } catch {
      setResendState("failed")
      setError(translateAuthError(null))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.")
      return
    }
    const normalizedEmail = normalizeEmail(email)
    if (!isValidEmail(normalizedEmail)) {
      setError("Cette adresse e-mail n'est pas valide.")
      return
    }
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
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
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      // Même comportement dans tous les environnements : si Supabase renvoie une session
      // (confirmation d'e-mail désactivée dans le projet), on entre directement ; sinon on
      // attend le clic sur le lien de confirmation. Plus de chemin propre au développement.
      if (signUpData.session) {
        if (hasToken()) await claimPreview()
        window.location.href = "/dashboard"
        return
      }

      if (hasToken()) {
        if (previewToken) {
          // Pas de session avant la confirmation : le token voyage par cookie
          // (le sessionStorage ne survit pas à un autre onglet) et
          // /api/auth/callback fait le claim une fois la session créée.
          PreviewTokenManager.setLinkCookie(previewToken)
        }
      }

      setEmail(normalizedEmail)
      setSuccess(true)
      setCooldown(60)
    } catch (err: unknown) {
      setError(translateAuthError(err as { code?: string; message?: string; status?: number }))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        className="min-h-screen bg-calm-bg text-calm-ink flex flex-col items-center justify-center p-6"
      >
        <div className="w-full max-w-md rounded-2xl border border-calm-line bg-calm-surface p-8 text-center shadow-2xl shadow-calm-ink/10 space-y-4">
          <div className="text-calm-accent text-5xl mb-4" aria-hidden="true">✉️</div>
          <h2 className="text-2xl font-semibold tracking-tight text-calm-ink">Vérifiez vos emails</h2>
          <p className="text-calm-secondary">
            Un lien de confirmation a été envoyé à <span className="font-medium text-calm-ink">{email}</span>.
            Cliquez dessus pour activer votre compte.
          </p>
          <p className="text-xs text-calm-secondary">
            Rien reçu ? Regardez dans vos courriers indésirables. Si un compte existe déjà avec cette adresse,
            connectez-vous ou réinitialisez votre mot de passe.
          </p>
          {error && (
            <p role="alert" className="text-sm text-calm-warn">{error}</p>
          )}
          {resendState === "sent" && cooldown > 0 && (
            <p role="status" className="text-sm text-calm-accent">Un nouvel e-mail vient d&apos;être envoyé.</p>
          )}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendState === "sending" || cooldown > 0}
            className="text-sm font-medium text-calm-accent hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
          >
            {resendState === "sending"
              ? "Envoi…"
              : cooldown > 0
                ? `Renvoyer l'e-mail (${cooldown} s)`
                : "Renvoyer l'e-mail de confirmation"}
          </button>
          <Link href="/login" className="block mt-6 rounded text-sm text-calm-accent font-medium hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg">
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
        className="min-h-screen bg-calm-bg text-calm-ink flex flex-col items-center justify-center p-6"
      >
      <Link href="/" className="inline-flex min-h-11 items-center rounded-md text-2xl font-semibold tracking-tight text-calm-ink mb-8 outline-none focus-visible:ring-2 focus-visible:ring-calm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg">
        Trajectoire
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-calm-line bg-calm-surface p-8 shadow-2xl shadow-calm-ink/10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-calm-ink mb-2">Créer un compte</h1>
          <p className="text-calm-secondary text-sm">Rejoignez la plateforme d'entraînement stratégique.</p>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-calm-warn-line bg-calm-warn-soft p-4">
            <p className="text-calm-warn text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-calm-ink mb-1">Email</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-calm-line bg-calm-bg p-3 text-calm-ink placeholder-calm-tertiary transition-colors focus:border-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-calm-ink mb-1">Mot de passe</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              aria-describedby="pw-hint"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-calm-line bg-calm-bg p-3 text-calm-ink placeholder-calm-tertiary transition-colors focus:border-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
              placeholder="••••••••"
              required
            />
            <p id="pw-hint" className="mt-1 text-xs text-calm-secondary">
              {MIN_PASSWORD_LENGTH} caractères minimum.
            </p>
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-calm-ink mb-1">Confirmer le mot de passe</label>
            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-calm-line bg-calm-bg p-3 text-calm-ink placeholder-calm-tertiary transition-colors focus:border-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex min-h-11 items-start gap-3 py-2">
            <input
              type="checkbox"
              id="cgu"
              checked={acceptCGU}
              onChange={(e) => setAcceptCGU(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-calm-accent-line bg-calm-bg accent-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
            />
            <label htmlFor="cgu" className="text-sm text-calm-secondary cursor-pointer leading-tight">
              J'accepte les <Link href="/terms" className="rounded text-calm-accent hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-zinc-900">conditions d'utilisation</Link> et la <Link href="/privacy" className="rounded text-calm-accent hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg">politique de confidentialité</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-calm-accent px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(31,42,55,0.6)] transition-colors hover:bg-calm-accent-deep focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-calm-secondary">
          Déjà un compte ? <Link href="/login" className="inline-flex min-h-11 items-center rounded px-1 text-calm-accent font-medium hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
