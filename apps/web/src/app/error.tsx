"use client"

import { useEffect } from "react"
import Link from "next/link"
import * as Sentry from "@sentry/nextjs"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/** Erreur dans une page du site public (thème clair). */
export default function RootError({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <main
      id="main"
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center text-foreground"
    >
      <p className="text-sm font-medium uppercase tracking-widest text-foreground-muted">Erreur</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Un problème est survenu</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-foreground-muted">
        Cette page n&apos;a pas pu s&apos;afficher. Réessayez dans un instant ou revenez à l&apos;accueil.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={reset}
          className={`inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-700 ${focus}`}
        >
          Réessayer
        </button>
        <Link
          href="/"
          className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted ${focus}`}
        >
          Retour à l&apos;accueil
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-8 text-xs text-foreground-muted">Référence à communiquer au support : {error.digest}</p>
      ) : null}
    </main>
  )
}
