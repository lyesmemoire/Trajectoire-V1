import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
}

/**
 * Un visiteur connecté retrouve son espace ; un visiteur anonyme ne doit jamais être envoyé
 * vers une page privée (le middleware le renverrait sur /login) : accueil et connexion.
 * Un échec de lecture de la session est traité comme « anonyme ».
 */
async function isSignedIn(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return Boolean(user)
  } catch {
    return false
  }
}

const primaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const secondaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export default async function NotFound() {
  const signedIn = await isSignedIn()

  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-foreground"
    >
      <div className="max-w-md text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50"
          aria-hidden="true"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-primary-600">
            <path
              d="M6 16h4M22 16h4M16 6v4M16 22v4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
        </div>

        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-foreground-muted">
          Erreur 404
        </p>

        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
          Page introuvable
        </h1>

        <p className="mb-8 text-base leading-relaxed text-foreground-muted">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {signedIn ? (
            <>
              <Link href="/dashboard" className={primaryLink}>
                Retour à mon espace
              </Link>
              <Link href="/" className={secondaryLink}>
                Accueil
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className={primaryLink}>
                Retour à l&apos;accueil
              </Link>
              <Link href="/login" className={secondaryLink}>
                Se connecter
              </Link>
            </>
          )}
        </div>

        <p className="mt-8 text-xs text-foreground-muted">
          Trajectoire · Préparation d&apos;entretien et analyse de CV
        </p>
      </div>
    </main>
  )
}
