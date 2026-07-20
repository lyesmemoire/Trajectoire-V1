// apps/web/src/app/terms/page.tsx
//
// Conditions Générales de Vente (CGV)

import Link from "next/link";

export default function TermsPage() {
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
          Conditions Générales de Vente
        </h1>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Éditeur du service
            </h2>
            <p className="text-slate-700">
              Le service Trajectoire est édité par Trajectoire SAS, société au capital
              social de [montant] euros, immatriculée au RCS de [ville] sous le numéro
              [numéro SIRET], dont le siège social est situé à [adresse].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Description du service
            </h2>
            <p className="text-slate-700">
              Trajectoire est une plateforme SaaS de préparation à l'entretien
              d'embauche qui propose des simulations d'entretien, des analyses de CV
              et des recommandations personnalisées générées par intelligence
              artificielle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Abonnements et tarifs
            </h2>
            <p className="text-slate-700">
              Les abonnements sont proposés aux tarifs indiqués sur la page
              /pricing. Les paiements sont sécurisés via Stripe. L'abonnement est
              renouvelé automatiquement chaque mois ou chaque année selon le plan
              choisi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Résiliation
            </h2>
            <p className="text-slate-700">
              Vous pouvez résilier votre abonnement à tout moment depuis votre
              portail client. L'accès au service reste actif jusqu'à la fin de la
              période facturée. Aucun remboursement n'est effectué pour la période
              en cours.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              5. Responsabilité
            </h2>
            <p className="text-slate-700">
              Trajectoire s'efforce de fournir un service de qualité mais ne peut
              garantir les résultats obtenus lors des entretiens réels. Les
              recommandations fournies par l'IA sont indicatives et ne constituent
              pas un conseil juridique ou professionnel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              6. Données personnelles
            </h2>
            <p className="text-slate-700">
              Vos données sont traitées conformément à notre Politique de
              Confidentialité et au RGPD. Vous disposez d'un droit d'accès,
              de rectification et de suppression de vos données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              7. Contact
            </h2>
            <p className="text-slate-700">
              Pour toute question relative aux présentes CGV, vous pouvez nous
              contacter à l'adresse email : contact@trajectoire.fr
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              8. Modification des CGV
            </h2>
            <p className="text-slate-700">
              Trajectoire se réserve le droit de modifier les présentes CGV à tout
              moment. Les modifications prendront effet dès leur publication sur
              le site.
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
