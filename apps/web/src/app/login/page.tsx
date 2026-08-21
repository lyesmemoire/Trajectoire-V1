"use client"

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

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

function LoginFallback() {
  return (
    <div className="min-h-screen bg-ivoire-50 flex flex-col items-center justify-center p-6">
      <Link
        href="/"
        className="text-2xl font-serif font-bold text-ink-900 mb-8"
      >
        Trajectoire
      </Link>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-ivoire-200 shadow-premium">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-ink-900 mb-2">
            Bon retour
          </h1>

          <p className="text-ink-600 text-sm">
            Connectez-vous pour accéder à votre espace.
          </p>

          <p className="mt-3 text-xs text-ink-500">
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

  const [sessionState, setSessionState] =
    useState<SessionState>("checking")

  const [sessionEmail, setSessionEmail] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

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
      }

      if (!res.ok) {
        setError(
          data?.error ||
            "Connexion impossible pour le moment."
        )
        setLoading(false)
        return
      }

      // Authentication cookies are now available to middleware.
      router.replace(redirectTo)
      router.refresh()
    } catch {
      setError(
        "Une erreur critique est survenue. Veuillez réessayer."
      )
      setLoading(false)
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
    <div className="min-h-screen bg-ivoire-50 flex flex-col items-center justify-center p-6">
      <Link
        href="/"
        className="text-2xl font-serif font-bold text-ink-900 mb-8"
      >
        Trajectoire
      </Link>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-ivoire-200 shadow-premium">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-ink-900 mb-2">
            Bon retour
          </h1>

          <p className="text-ink-600 text-sm">
            Connectez-vous pour accéder à votre espace.
          </p>

          {sessionState === "checking" && (
            <p className="mt-3 text-xs text-ink-500">
              Vérification de session…
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 p-4 bg-brick-50 border border-brick-100 rounded-xl"
          >
            <p className="text-brick-600 text-sm font-medium text-center">
              {error}
            </p>
          </div>
        )}

        {sessionState === "authenticated" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-ivoire-200 bg-ivoire-50 px-4 py-4">
              <p className="text-sm font-semibold text-ink-900">
                Vous êtes déjà connecté.
              </p>

              {sessionEmail ? (
                <p className="mt-1 text-sm text-ink-600">
                  Compte :{" "}
                  <span className="font-medium">
                    {sessionEmail}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-ink-600">
                  Vous pouvez accéder à votre dashboard ou
                  vous déconnecter.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={redirectTo}
                className="inline-flex w-full items-center justify-center rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-premium-lg ring-1 ring-bronze-400/25 transition hover:-translate-y-[1px]"
              >
                Aller au dashboard
              </a>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full rounded-xl border border-ivoire-200 bg-white px-4 py-3 text-sm font-semibold text-ink-900 shadow-sm transition hover:bg-ivoire-50 disabled:opacity-60"
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
                <label className="block text-sm font-medium text-ink-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full p-3 rounded-xl border-2 border-ivoire-300 text-ink-900 bg-white placeholder-ink-400 focus:outline-none focus:border-bronze-400 focus:ring-2 focus:ring-bronze-400/20 transition-all"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-ink-700">
                    Mot de passe
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-bronze-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full p-3 rounded-xl border-2 border-ivoire-300 text-ink-900 bg-white placeholder-ink-400 focus:outline-none focus:border-bronze-400 focus:ring-2 focus:ring-bronze-400/20 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="md"
              >
                {loading
                  ? "Connexion en cours..."
                  : "Se connecter"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-600">
              Pas encore de compte ?{" "}
              <Link
                href="/signup"
                className="text-bronze-600 font-medium hover:underline"
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
