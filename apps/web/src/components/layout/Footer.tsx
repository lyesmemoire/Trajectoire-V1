import Link from "next/link"
import { canShowLegalNotice, contactEmail } from "@/lib/legal/publisher"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 text-sm text-foreground-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
        <div>
          <h2 className="mb-2 font-sans font-bold text-foreground">
            Trajectoire
          </h2>
          <p className="max-w-[280px] leading-relaxed">
            Préparez vos entretiens avec une intelligence contextuelle basée
            sur votre CV et l&apos;offre visée.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-foreground">
            Produit
          </h3>
          <ul className="space-y-0">
            <li>
              <Link href="/analyze" className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground">
                Analyser ma candidature
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground">
                Tarifs
              </Link>
            </li>
            <li>
              <Link href="/dashboard" prefetch={false} className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-foreground">
            Légal
          </h3>
          <ul className="space-y-0">
            <li>
              <Link href="/terms" className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground">
                Conditions générales
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground">
                Politique de confidentialité
              </Link>
            </li>
            {canShowLegalNotice() && (
              <li>
                <Link href="/mentions-legales" className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground">
                  Mentions légales
                </Link>
              </li>
            )}
            <li>
              <a
                href={`mailto:${contactEmail()}`}
                className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-foreground"
              >
                {contactEmail()}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-foreground-muted">
        © {new Date().getFullYear()} Trajectoire. Tous droits réservés.
      </div>
    </footer>
  )
}