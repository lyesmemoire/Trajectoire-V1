"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { darkTokens } from "@/lib/theme/dark-tokens"

type SessionState = "checking" | "ready" | "invalid"
type Status = "idle" | "loading" | "success" | "error"

const MIN_PASSWORD_LENGTH = 8

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
  // évènement PASSWORD_RECOVERY. On couvre les deux cas.
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
        current === "ready" ? current : data.session ? "ready" : "invalid"
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

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`
      )
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
        setErrorMessage(error.message)
        setStatus("error")
        return
      }

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
      style={darkTokens}
      className="min-h-screen bg-zinc-950 text-white/80 flex flex-col items-center justify-center p-6"
    >
      <Link
        href="/"
        className="rounded-md text-2xl font-semibold tracking-tight text-white/80 mb-8 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        Trajectoire
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/40">
        {sessionState === "checking" ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-white/80">
              Réinitialisation du mot de passe
            </h1>
            <p role="status" className="text-sm text-zinc-300">
              Vérification du lien…
            </p>
          </div>
        ) : sessionState === "invalid" ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-white/80">
              Lien invalide ou expiré
            </h1>
            <p role="alert" className="text-sm text-zinc-300">
              Ce lien de réinitialisation n&apos;est plus valide. Demandez-en
              un nouveau.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block mt-2 rounded text-sm text-indigo-400 font-medium hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Demander un nouveau lien
            </Link>
          </div>
        ) : status === "success" ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-white/80">
              Mot de passe mis à jour
            </h1>
            <p role="status" className="text-sm text-zinc-300">
              Redirection vers la connexion…
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-white/80 mb-2">
                Nouveau mot de passe
              </h1>
              <p className="text-sm text-zinc-300">
                Choisissez un nouveau mot de passe pour votre compte.
              </p>
            </div>

            {status === "error" && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4"
              >
                <p className="text-rose-300 text-sm font-medium text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-password-new"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="reset-password-new"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white/80 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-60"
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
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="reset-password-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white/80 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-60"
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
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading"
                  ? "Mise à jour en cours..."
                  : "Réinitialiser le mot de passe"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-300">
              <Link
                href="/login"
                className="rounded text-indigo-400 font-medium hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
