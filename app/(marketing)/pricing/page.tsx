import Link from "next/link";

export default async function PricingPage() {
  return (
    <main className="bg-white text-black">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25">
              ✦
            </div>
            <span className="font-black text-xl tracking-tight">
              StudioEntretien.fr
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#how"
              className="font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Comment ça marche
            </Link>
            <Link href="/pricing" className="font-bold text-blue-600">
              Tarifs
            </Link>
            <Link
              href="/auth/login"
              className="font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2.5 rounded-full bg-black text-white font-bold hover:bg-gray-900 transition-all shadow-md hover:shadow-lg"
            >
              Essai gratuit →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-24 px-6">
        <h1 className="text-4xl font-bold">
          Choisis ton niveau d&apos;entraînement
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Commence gratuitement. Passe en Premium quand tu veux progresser
          sérieusement.
        </p>
      </section>

      {/* SESSION PREMIUM OFFERTE */}
      <section className="px-6 mb-16">
        <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            🎁 1 session Premium offerte
          </h2>

          <p className="mt-4 text-gray-600">
            Teste l&apos;expérience complète avant de t&apos;engager. Simulation
            vocale, analyse détaillée et score structuré inclus.
          </p>

          <div className="mt-6">
            <Link
              href="/auth/signup?trial=premium"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition inline-block"
            >
              Essayer la version Premium
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500 font-medium">
            Offre disponible pour les nouveaux inscrits.
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* FREE */}
          <div className="border p-10 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-4">Gratuit</h3>

            <ul className="space-y-3 text-gray-600 mb-8">
              <li>✅ 1 mini entretien texte</li>
              <li>✅ Score global simplifié</li>
              <li>✅ Aperçu du feedback</li>
              <li>✅ Accès immédiat</li>
              <li className="opacity-60">❌ Pas d&apos;entretien vocal</li>
              <li className="opacity-60">❌ Pas d&apos;analyse détaillée</li>
              <li className="opacity-60">❌ Pas d&apos;historique complet</li>
            </ul>

            <Link
              href="/auth/signup"
              className="w-full block text-center bg-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Découvrir gratuitement
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="border-2 border-black p-10 rounded-2xl shadow-lg relative">
            <span className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-sm rounded-bl-lg font-bold">
              Le plus choisi
            </span>

            <h3 className="text-2xl font-semibold mb-2">Premium</h3>

            <p className="text-4xl font-bold mb-6">
              9,99€{" "}
              <span className="text-lg font-normal text-gray-500">/ mois</span>
            </p>

            <ul className="space-y-3 text-gray-600 mb-8">
              <li>✅ 4 entretiens vocaux complets / mois</li>
              <li>✅ 7 questions structurées</li>
              <li>✅ Adaptation à ton CV</li>
              <li>✅ Adaptation au poste ciblé</li>
              <li>✅ Analyse globale détaillée</li>
              <li>✅ Analyse par question</li>
              <li>✅ Score structuré sur 5 critères</li>
              <li>✅ Historique complet</li>
              <li>✅ Graphique d&apos;évolution</li>
              <li>✅ Conseils personnalisés actionnables</li>
            </ul>

            <p className="text-sm text-gray-500 mb-6">
              Idéal pour préparer 1 à 2 entretiens par semaine.
            </p>

            <Link
              href="/api/stripe/checkout"
              className="w-full block text-center bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              Commencer mon entraînement Premium
            </Link>

            <p className="mt-4 text-sm text-gray-400 text-center">
              Sans engagement. Annulation à tout moment.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-8 text-gray-700">
            <div>
              <h4 className="font-semibold">Puis-je annuler à tout moment ?</h4>
              <p className="mt-2 text-gray-600">
                Oui. L&apos;abonnement est sans engagement et peut être annulé à
                tout moment.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">
                Les 4 sessions sont-elles cumulables ?
              </h4>
              <p className="mt-2 text-gray-600">
                Non. Elles se renouvellent chaque mois pour encourager une
                progression régulière.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">
                La session Premium offerte est-elle complète ?
              </h4>
              <p className="mt-2 text-gray-600">
                Oui. Elle inclut la simulation vocale complète, l&apos;analyse
                détaillée et le score structuré.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow">
              ✦
            </div>
            <span className="font-black tracking-tight">
              StudioEntretien.fr
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Entraîne-toi. Progresse. Réussis.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a
              href="/privacy"
              className="hover:text-gray-900 transition-colors"
            >
              Confidentialité
            </a>
            <a href="/terms" className="hover:text-gray-900 transition-colors">
              Conditions
            </a>
          </div>
          <p className="text-gray-400 text-xs">
            © 2026 StudioEntretien.fr. Tous droits réservés.
          </p>
        </div>
      </footer>
    </main>
  );
}
