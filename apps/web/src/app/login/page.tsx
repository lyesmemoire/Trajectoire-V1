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
import { darkTokens } from "@/lib/theme/dark-tokens"

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

      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-900 p-8 shadow-2xl shadow-black/40">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white/80 mb-2">
            Bon retour
          </h1>

          <p className="text-white/50 text-sm">
            Connectez-vous pour accéder à votre espace.
          </p>

          <p className="mt-3 text-xs text-white/50">
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
      window.location.href = redirectTo
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

      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-900 p-8 shadow-2xl shadow-black/40">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white/80 mb-2">
            Bon retour
          </h1>

          <p className="text-white/50 text-sm">
            Connectez-vous pour accéder à votre espace.
          </p>

          {sessionState === "checking" && (
            <p role="status" className="mt-3 text-xs text-white/50">
              Vérification de session…
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4"
          >
            <p className="text-rose-300 text-sm font-medium text-center">
              {error}
            </p>
          </div>
        )}

        {sessionState === "authenticated" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.08] bg-zinc-950 px-4 py-4">
              <p className="text-sm font-semibold text-white/80">
                Vous êtes déjà connecté.
              </p>

              {sessionEmail ? (
                <p className="mt-1 text-sm text-white/50">
                  Compte :{" "}
                  <span className="font-medium text-white/80">
                    {sessionEmail}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-white/50">
                  Vous pouvez accéder à votre dashboard ou
                  vous déconnecter.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={redirectTo}
                className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                Aller au dashboard
              </a>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-60"
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
                  className="block text-sm font-medium text-white/80 mb-1"
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
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white/80 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-60"
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
                    className="block text-sm font-medium text-white/80"
                  >
                    Mot de passe
                  </label>

                  <Link
                    href="/forgot-password"
                    className="rounded text-xs text-indigo-400 hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white/80 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-60"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Connexion en cours..."
                  : "Se connecter"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/50">
              Pas encore de compte ?{" "}
              <Link
                href="/signup"
                className="rounded text-indigo-400 font-medium hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
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
