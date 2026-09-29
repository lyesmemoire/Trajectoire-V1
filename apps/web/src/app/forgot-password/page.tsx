"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { darkTokens } from "@/lib/theme/dark-tokens"

type Status = "idle" | "loading" | "success" | "error"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (status === "loading") return

    setStatus("loading")
    setErrorMessage("")

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
      })

      if (error) {
        setErrorMessage(error.message)
        setStatus("error")
        return
      }

      setStatus("success")
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
        {status === "success" ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-white/80">
              Vérifiez vos e-mails
            </h1>
            <p role="status" className="text-sm text-zinc-300">
              Si cette adresse est associée à un compte, vous recevrez un
              e-mail dans quelques minutes.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 rounded text-sm text-indigo-400 font-medium hover:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-white/80 mb-2">
                Mot de passe oublié
              </h1>
              <p className="text-sm text-zinc-300">
                Indiquez votre e-mail : nous vous envoyons un lien pour le
                réinitialiser.
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
                  htmlFor="forgot-password-email"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="forgot-password-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white/80 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-60"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  required
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading"
                  ? "Envoi en cours..."
                  : "Envoyer le lien de réinitialisation"}
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
