"use client"

import { createClient } from "@/lib/supabase/client"
import { normalizeEmail } from "@/lib/auth/credentials"
import { translateAuthError } from "@/lib/auth/auth-errors"

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

type SessionState = "checking" | "authenticated" | "guest"

type MeResponse = {
  authenticated: boolean
  user: {
    id: string
    email: string | null
  } | null
  error?: string
}

function sanitizeRedirect(value: string | null) {
  if (!value) return "/dashboard"

  // Only allow internal application paths.
  if (!value.startsWith("/")) return "/dashboard"
  if (value.startsWith("//")) return "/dashboard"

  return value
}

// Codes d'erreur posés par /api/auth/callback (`?error=`). Le message Supabase
// brut n'est jamais affiché : toute valeur inconnue retombe sur un message
// générique.
const CALLBACK_ERRORS: Record<string, string> = {
  link_expired:
    "Ce lien a expiré. Demandez-en un nouveau depuis « Mot de passe oublié » ou reconnectez-vous.",
  link_invalid:
    "Ce lien n'est plus valide ou a déjà été utilisé. Demandez-en un nouveau ou connectez-vous.",
  missing_code:
    "Le lien de confirmation est incomplet. Ouvrez-le depuis l'e-mail reçu ou demandez-en un nouveau.",
}

const GENERIC_CALLBACK_ERROR =
  "La confirmation a échoué. Veuillez réessayer ou vous connecter."

// `?reason=` est posé par le middleware (texte libre) : on n'affiche que des
// messages maîtrisés, jamais la valeur de l'URL.
function reasonNotice(reason: string | null): string {
  if (!reason) return ""
  if (reason === "Authentication required") {
    return "Connectez-vous pour accéder à cette page."
  }
  return "Vous n'avez pas accès à cette page avec ce compte."
}

function LoginFallback() {
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
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-calm-ink mb-2">
            Bon retour
          </h1>

          <p className="text-calm-secondary text-sm">
            Connectez-vous pour accéder à votre espace.
          </p>

          <p className="mt-3 text-xs text-calm-secondary">
            Chargement…
          </p>
        </div>

        <div className="h-[220px]" />
      </div>
    </div>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = useMemo(
    () => sanitizeRedirect(searchParams.get("redirect")),
    [searchParams]
  )

  const urlError = useMemo(() => {
    const code = searchParams.get("error")
    if (!code) return ""
    return CALLBACK_ERRORS[code] ?? GENERIC_CALLBACK_ERROR
  }, [searchParams])

  const urlNotice = useMemo(
    () => reasonNotice(searchParams.get("reason")),
    [searchParams]
  )

  const [sessionState, setSessionState] =
    useState<SessionState>("checking")

  const [sessionEmail, setSessionEmail] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "failed">("idle")

  // Server-truth session check using the current cookies.
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        })

        const data = (await res.json()) as MeResponse

        if (cancelled) return

        if (data.authenticated) {
          setSessionEmail(data.user?.email ?? "")
          setSessionState("authenticated")
          return
        }

        setSessionState("guest")
      } catch {
        if (!cancelled) {
          setSessionState("guest")
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (loading) return

    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        code?: string
      }

      if (!res.ok) {
        setNeedsConfirmation(data?.code === "email_not_confirmed")
        setError(
          data?.error ||
            "Connexion impossible pour le moment."
        )
        setLoading(false)
        return
      }

      // Authentication cookies are now available to middleware.
      window.location.href = redirectTo
    } catch {
      setError(
        "Une erreur critique est survenue. Veuillez réessayer."
      )
      setLoading(false)
    }
  }

  // Renvoi de l'e-mail de confirmation (compte créé mais adresse jamais confirmée).
  const handleResend = async () => {
    if (resendState === "sending") return
    setResendState("sending")
    try {
      const supabase = createClient()
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: normalizeEmail(email),
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
      })
      setResendState(resendError ? "failed" : "sent")
      if (resendError) setError(translateAuthError(resendError))
    } catch {
      setResendState("failed")
    }
  }

  const handleSignOut = async () => {
    if (signingOut) return

    setSigningOut(true)
    setError("")

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      })

      setSessionEmail("")
      setEmail("")
      setPassword("")
      setSessionState("guest")

      router.refresh()
    } catch {
      setError(
        "Impossible de se déconnecter pour le moment. Réessayez."
      )
    } finally {
      setSigningOut(false)
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-calm-ink mb-2">
            Bon retour
          </h1>

          <p className="text-calm-secondary text-sm">
            Connectez-vous pour accéder à votre espace.
          </p>

          {sessionState === "checking" && (
            <p role="status" className="mt-3 text-xs text-calm-secondary">
              Vérification de session…
            </p>
          )}
        </div>

        {(error || urlError) && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-calm-warn-line bg-calm-warn-soft p-4"
          >
            <p className="text-calm-warn text-sm font-medium text-center">
              {error || urlError}
            </p>
          </div>
        )}

        {needsConfirmation && (
          <div className="mb-6 text-center">
            {resendState === "sent" ? (
              <p role="status" className="text-sm text-calm-accent">
                Un nouvel e-mail de confirmation vient d&apos;être envoyé à {normalizeEmail(email)}.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendState === "sending"}
                className="text-sm font-medium text-calm-accent hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent disabled:opacity-60"
              >
                {resendState === "sending" ? "Envoi…" : "Renvoyer l'e-mail de confirmation"}
              </button>
            )}
          </div>
        )}

        {!error && !urlError && urlNotice && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-calm-accent-line bg-calm-accent-soft p-4"
          >
            <p className="text-calm-accent text-sm font-medium text-center">
              {urlNotice}
            </p>
          </div>
        )}

        {sessionState === "authenticated" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-calm-line bg-calm-bg px-4 py-4">
              <p className="text-sm font-semibold text-calm-ink">
                Vous êtes déjà connecté.
              </p>

              {sessionEmail ? (
                <p className="mt-1 text-sm text-calm-secondary">
                  Compte :{" "}
                  <span className="font-medium text-calm-ink">
                    {sessionEmail}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-calm-secondary">
                  Vous pouvez accéder à votre dashboard ou
                  vous déconnecter.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={redirectTo}
                className="inline-flex w-full items-center justify-center rounded-xl bg-calm-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(31,42,55,0.6)] transition-colors hover:bg-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
              >
                Aller au dashboard
              </a>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full rounded-xl border border-calm-line bg-calm-accent-wash px-4 py-3 text-sm font-semibold text-calm-ink transition-colors hover:bg-calm-accent-soft focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:opacity-60"
              >
                {signingOut
                  ? "Déconnexion…"
                  : "Se déconnecter"}
              </button>
            </div>
          </div>
        ) : sessionState === "guest" ? (
          <>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-calm-ink mb-1"
                >
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full rounded-xl border border-calm-line bg-calm-bg p-3 text-calm-ink placeholder-calm-tertiary transition-colors focus:border-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:opacity-60"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-calm-ink"
                  >
                    Mot de passe
                  </label>

                  <Link
                    href="/forgot-password"
                    className="rounded text-xs text-calm-accent hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-calm-line bg-calm-bg p-3 text-calm-ink placeholder-calm-tertiary transition-colors focus:border-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:opacity-60"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-calm-accent px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(31,42,55,0.6)] transition-colors hover:bg-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Connexion en cours..."
                  : "Se connecter"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-calm-secondary">
              Pas encore de compte ?{" "}
              <Link
                href="/signup"
                className="rounded text-calm-accent font-medium hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
              >
                S&apos;inscrire
              </Link>
            </p>
          </>
        ) : (
          <div className="h-[220px]" />
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
