// apps/web/src/app/privacy/page.tsx
//
// Politique de Confidentialité

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-black text-slate-900 mb-8">
          Politique de Confidentialité
        </h1>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Données collectées
            </h2>
            <p className="text-slate-700">
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Informations d'inscription (email, nom)</li>
              <li>CV et documents uploadés</li>
              <li>Historique des simulations d'entretien</li>
              <li>Données de paiement (traitées via Stripe)</li>
              <li>Données d'utilisation et analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Finalité du traitement
            </h2>
            <p className="text-slate-700">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Fournir le service Trajectoire</li>
              <li>Améliorer nos algorithmes d'IA</li>
              <li>Personnaliser votre expérience</li>
              <li>Assurer la sécurité du service</li>
              <li>Facturation et support client</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Conservation des données
            </h2>
            <p className="text-slate-700">
              Vos données sont conservées :
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>CV et simulations : 2 ans après votre dernière activité</li>
              <li>Données de paiement : conformément aux obligations légales</li>
              <li>Données analytics : 13 mois maximum</li>
              <li>Compte utilisateur : jusqu'à sa suppression</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Paiement et Stripe
            </h2>
            <p className="text-slate-700">
              Les paiements sont sécurisés via Stripe. Nous ne stockons aucune
              information de carte bancaire sur nos serveurs. Stripe est conforme
              PCI DSS et traite vos données de paiement selon ses propres
              politiques de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              5. Vos droits
            </h2>
            <p className="text-slate-700">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement (droit à l'oubli)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
              <li>Droit de limitation du traitement</li>
            </ul>
            <p className="text-slate-700 mt-4">
              Pour exercer ces droits, contactez-nous à : contact@trajectoire.fr
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              6. Sécurité
            </h2>
            <p className="text-slate-700">
              Vos données sont chiffrées en transit et au repos. Nous mettons en
              œuvre des mesures de sécurité techniques et organisationnelles
              appropriées pour protéger vos données contre tout accès non autorisé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              7. Partage des données
            </h2>
            <p className="text-slate-700">
              Nous ne partageons jamais vos données personnelles avec des tiers
              à des fins commerciales. Vos données peuvent être partagées avec :
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Stripe (traitement des paiements)</li>
              <li>Fournisseurs d'infrastructure cloud</li>
              <li>Prestataires de services techniques (dans la limite nécessaire)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              8. Cookies
            </h2>
            <p className="text-slate-700">
              Nous utilisons des cookies pour améliorer votre expérience et
              analyser l'utilisation du service. Vous pouvez gérer vos préférences
              cookies via votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              9. Contact
            </h2>
            <p className="text-slate-700">
              Pour toute question relative à cette politique de confidentialité,
              contactez-nous à : contact@trajectoire.fr
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
