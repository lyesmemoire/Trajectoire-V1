import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 text-sm text-foreground-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
        <div>
          <h3 className="mb-2 font-sans font-bold text-foreground">
            Trajectoire
          </h3>
          <p className="max-w-[280px] leading-relaxed">
            Préparez vos entretiens avec une intelligence contextuelle basée
            sur votre CV et l&apos;offre visée.
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-foreground">
            Produit
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/analyze" className="transition-colors hover:text-foreground">
                Analyser ma candidature
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="transition-colors hover:text-foreground">
                Tarifs
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="transition-colors hover:text-foreground">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-foreground">
            Légal
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/terms" className="transition-colors hover:text-foreground">
                Conditions générales
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <a
                href="mailto:anislamine1980@gmail.com"
                className="transition-colors hover:text-foreground"
              >
                anislamine1980@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Trajectoire. Tous droits réservés.
      </div>
    </footer>
  )
}