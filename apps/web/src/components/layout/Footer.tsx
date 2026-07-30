import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-ivoire-200 mt-20 py-10 text-sm text-ink-600 bg-ivoire-50">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        <div>
          <h3 className="font-serif font-semibold text-ink-900 mb-2">
            Trajectoire
          </h3>
          <p>
            Préparez vos entretiens avec une IA personnalisée.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-ink-900 mb-2">
            Produit
          </h4>
          <ul className="space-y-2">
            <li><Link href="/pricing" className="hover:text-ink-900 transition-colors">Tarifs</Link></li>
            <li><Link href="/dashboard" className="hover:text-ink-900 transition-colors">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-ink-900 mb-2">
            Légal
          </h4>
          <ul className="space-y-2">
            <li><Link href="/terms" className="hover:text-ink-900 transition-colors">Conditions générales</Link></li>
            <li><Link href="/privacy" className="hover:text-ink-900 transition-colors">Politique de confidentialité</Link></li>
            <li>
              <a href="mailto:support@trajectoire.app" className="hover:text-ink-900 transition-colors">
                support@trajectoire.app
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-ink-400">
        © {new Date().getFullYear()} Trajectoire. Tous droits réservés.
      </div>
    </footer>
  )
}
