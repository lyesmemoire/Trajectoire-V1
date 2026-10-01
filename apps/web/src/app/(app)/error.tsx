"use client"

import { useEffect } from "react"
import Link from "next/link"
import * as Sentry from "@sentry/nextjs"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"

/**
 * Erreur dans une page de l'espace connecté : le menu reste affiché (layout intact),
 * l'utilisateur peut réessayer ou revenir au tableau de bord.
 */
export default function AppError({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center px-2 py-16 text-center sm:py-24"
    >
      <p className="text-sm font-medium uppercase tracking-widest text-calm-secondary">Erreur</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-calm-ink">
        Un problème est survenu
      </h1>
      <p className="mt-3 text-base leading-relaxed text-calm-secondary">
        Cette page n&apos;a pas pu s&apos;afficher. Vos données ne sont pas affectées : réessayez, ou revenez
        au tableau de bord.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className={`inline-flex min-h-11 items-center justify-center rounded-xl bg-calm-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-calm-accent-deep ${focusRing}`}
        >
          Réessayer
        </button>
        <Link
          href="/dashboard"
          className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-calm-line bg-calm-accent-wash px-6 text-sm font-semibold text-calm-ink transition-colors hover:bg-calm-accent-soft ${focusRing}`}
        >
          Tableau de bord
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-8 text-xs text-calm-secondary">Référence à communiquer au support : {error.digest}</p>
      ) : null}
    </div>
  )
}
