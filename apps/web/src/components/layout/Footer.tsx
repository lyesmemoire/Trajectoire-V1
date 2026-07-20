import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-20 py-10 text-sm text-muted-foreground">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        <div>
          <h3 className="font-semibold text-foreground mb-2">
            Trajectoire
          </h3>
          <p>
            Préparez vos entretiens avec une IA personnalisée.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Produit
          </h4>
          <ul className="space-y-2">
            <li><Link href="/pricing">Tarifs</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Légal
          </h4>
          <ul className="space-y-2">
            <li><Link href="/terms">Conditions générales</Link></li>
            <li><Link href="/privacy">Politique de confidentialité</Link></li>
            <li>
              <a href="mailto:support@trajectoire.app">
                support@trajectoire.app
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Trajectoire. Tous droits réservés.
      </div>
    </footer>
  );
}
