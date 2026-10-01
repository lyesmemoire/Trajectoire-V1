"use client"

import { validatePassword, MIN_PASSWORD_LENGTH } from "@/lib/auth/credentials"
import { translateAuthError } from "@/lib/auth/auth-errors"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type SessionState = "checking" | "ready" | "invalid"
type Status = "idle" | "loading" | "success" | "error"


// Témoin posé par /api/auth/callback quand le lien de réinitialisation a été
// consommé (voir app/api/auth/callback/route.ts). Garde d'usage : Supabase reste l'autorité.
const RECOVERY_COOKIE = "pw_recovery"

function hasRecoveryMarker() {
  return document.cookie
    .split("; ")
    .some((entry) => entry === `${RECOVERY_COOKIE}=1`)
}

function clearRecoveryMarker() {
  document.cookie = `${RECOVERY_COOKIE}=; Max-Age=0; path=/`
}

export default function ResetPasswordPage() {
  const router = useRouter()

  const [sessionState, setSessionState] = useState<SessionState>("checking")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Le lien de réinitialisation aboutit ici soit via /api/auth/callback
  // (PKCE : la session est déjà posée en cookie), soit — selon la
  // configuration du template Supabase — avec un jeton de récupération dans
  // le hash de l'URL, que le client détecte automatiquement et traduit en
  // évènement PASSWORD_RECOVERY. On couvre les deux cas. Une session ouverte
  // « normalement » (sans témoin de récupération) est refusée : la page ne
  // sert pas à changer le mot de passe d'un compte déjà connecté.
  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return
      if (event === "PASSWORD_RECOVERY") {
        setSessionState("ready")
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSessionState((current) =>
        current === "ready"
          ? current
          : data.session && hasRecoveryMarker()
            ? "ready"
            : "invalid"
      )
    })

    return () => {
      cancelled = true
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (status === "loading") return

    setErrorMessage("")

    const passwordError = validatePassword(password)
    if (passwordError) {
      setErrorMessage(passwordError)
      setStatus("error")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.")
      setStatus("error")
      return
    }

    setStatus("loading")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setErrorMessage(translateAuthError(error))
        setStatus("error")
        return
      }

      // La session de récupération ne doit pas rester ouverte : sinon /login
      // afficherait « déjà connecté » juste après la réinitialisation.
      clearRecoveryMarker()
      await supabase.auth.signOut().catch(() => undefined)

      setStatus("success")
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch {
      setErrorMessage("Une erreur critique est survenue. Veuillez réessayer.")
      setStatus("error")
    }
  }

  return (
    <div
      className="min-h-screen bg-calm-bg text-calm-ink flex flex-col items-center justify-center p-6"
    >
      <Link
        href="/"
        className="rounded-md text-2xl font-semibold tracking-tight text-calm-ink mb-8 outline-none focus-visible:ring-2 focus-visible:ring-calm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
      >
        Trajectoire
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-calm-line bg-calm-surface p-8 shadow-2xl shadow-calm-ink/10">
        {sessionState === "checking" ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-calm-ink">
              Réinitialisation du mot de passe
            </h1>
            <p role="status" className="text-sm text-calm-ink">
              Vérification du lien…
            </p>
          </div>
        ) : sessionState === "invalid" ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-calm-ink">
              Lien invalide ou expiré
            </h1>
            <p role="alert" className="text-sm text-calm-ink">
              Ce lien de réinitialisation n&apos;est plus valide. Demandez-en
              un nouveau.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block mt-2 rounded text-sm text-calm-accent font-medium hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
            >
              Demander un nouveau lien
            </Link>
          </div>
        ) : status === "success" ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-calm-ink">
              Mot de passe mis à jour
            </h1>
            <p role="status" className="text-sm text-calm-ink">
              Redirection vers la connexion…
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-calm-ink mb-2">
                Nouveau mot de passe
              </h1>
              <p className="text-sm text-calm-ink">
                Choisissez un nouveau mot de passe pour votre compte.
              </p>
            </div>

            {status === "error" && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-calm-warn-line bg-calm-warn-soft p-4"
              >
                <p className="text-calm-warn text-sm font-medium text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-password-new"
                  className="block text-sm font-medium text-calm-ink mb-1"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="reset-password-new"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-calm-line bg-calm-bg p-3 text-calm-ink placeholder-calm-tertiary transition-colors focus:border-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:opacity-60"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  disabled={status === "loading"}
                />
              </div>

              <div>
                <label
                  htmlFor="reset-password-confirm"
                  className="block text-sm font-medium text-calm-ink mb-1"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="reset-password-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-calm-line bg-calm-bg p-3 text-calm-ink placeholder-calm-tertiary transition-colors focus:border-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:opacity-60"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-calm-accent px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(31,42,55,0.6)] transition-colors hover:bg-calm-accent-deep focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading"
                  ? "Mise à jour en cours..."
                  : "Réinitialiser le mot de passe"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-calm-ink">
              <Link
                href="/login"
                className="rounded text-calm-accent font-medium hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
              >
                Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
