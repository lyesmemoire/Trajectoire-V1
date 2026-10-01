"use client"

import { isValidEmail, normalizeEmail } from "@/lib/auth/credentials"
import { translateAuthError } from "@/lib/auth/auth-errors"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

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

      const normalized = normalizeEmail(email)
      if (!isValidEmail(normalized)) {
        setErrorMessage("Cette adresse e-mail n'est pas valide.")
        setStatus("error")
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
      })

      if (error) {
        setErrorMessage(translateAuthError(error))
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
      className="min-h-screen bg-calm-bg text-calm-ink flex flex-col items-center justify-center p-6"
    >
      <Link
        href="/"
        className="rounded-md text-2xl font-semibold tracking-tight text-calm-ink mb-8 outline-none focus-visible:ring-2 focus-visible:ring-calm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
      >
        Trajectoire
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-calm-line bg-calm-surface p-8 shadow-2xl shadow-calm-ink/10">
        {status === "success" ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-calm-ink">
              Vérifiez vos e-mails
            </h1>
            <p role="status" className="text-sm text-calm-ink">
              Si cette adresse est associée à un compte, vous recevrez un
              e-mail dans quelques minutes.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 rounded text-sm text-calm-accent font-medium hover:text-calm-accent hover:underline focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-calm-ink mb-2">
                Mot de passe oublié
              </h1>
              <p className="text-sm text-calm-ink">
                Indiquez votre e-mail : nous vous envoyons un lien pour le
                réinitialiser.
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
                  htmlFor="forgot-password-email"
                  className="block text-sm font-medium text-calm-ink mb-1"
                >
                  Email
                </label>
                <input
                  id="forgot-password-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-calm-line bg-calm-bg p-3 text-calm-ink placeholder-calm-tertiary transition-colors focus:border-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:opacity-60"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  required
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-calm-accent px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(31,42,55,0.6)] transition-colors hover:bg-calm-accent focus:outline-none focus:ring-2 focus:ring-calm-accent focus:ring-offset-2 focus:ring-offset-calm-bg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading"
                  ? "Envoi en cours..."
                  : "Envoyer le lien de réinitialisation"}
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
