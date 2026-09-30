"use client"

import "./globals.css"
import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Dernier filet : une erreur dans le layout racine remplace toute la page, donc ni les styles ni la
 * police du layout ne sont chargés. La feuille de style est importée ici, et la page n'utilise que
 * des classes Tailwind et des tokens (pas de dépendance au layout).
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="fr">
      <body className="bg-background text-foreground antialiased">
        <main
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center"
        >
          <h1 className="text-2xl font-semibold tracking-tight">Une erreur est survenue</h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-foreground-muted">
            Une erreur inattendue s&apos;est produite. Veuillez réessayer.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Réessayer
          </button>
          {error.digest ? (
            <p className="mt-8 text-xs text-foreground-muted">
              Référence à communiquer au support : {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  )
}
