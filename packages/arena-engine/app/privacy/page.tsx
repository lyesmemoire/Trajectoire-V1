"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-900/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25">
              ✦
            </div>
            <span className="font-black text-xl tracking-tight">
              AI Career Copilot
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-bold text-slate-500 hover:text-slate-900"
          >
            Retour au site
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-slate-500">Dernière mise à jour : 20 Mai 2026</p>
        </div>

        <div className="prose prose-slate prose-blue max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Collecte des données
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Chez AI Career Copilot, la confidentialité de vos données
              professionnelles est notre priorité absolue. Nous collectons
              uniquement les informations nécessaires au fonctionnement du
              service :
            </p>
            <ul className="list-disc list-inside mt-4 text-slate-600 space-y-2">
              <li>Informations de compte (email, mot de passe chiffré)</li>
              <li>
                Données de profil (CV téléchargés, expériences, compétences)
              </li>
              <li>
                Données d'utilisation (scores ATS, historique des entretiens
                simulés)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Utilisation de l'Intelligence Artificielle
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Vos CV et données de profil sont traités par nos modèles d'IA
              partenaires (comme OpenAI) dans le but exclusif de générer des
              retours, des scores ATS et des simulations d'entretiens.
              <strong className="text-slate-900">
                {" "}
                Vos données ne sont en aucun cas utilisées pour entraîner les
                modèles publics de ces partenaires.
              </strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Sécurité
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Toutes les communications sont chiffrées via TLS/SSL. Vos fichiers
              (CV) sont stockés de manière sécurisée et ne sont accessibles que
              par vous. Nous utilisons Supabase pour une gestion sécurisée de
              l'authentification et des autorisations via RLS (Row Level
              Security).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Vos droits (RGPD)
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Conformément à la réglementation, vous disposez d'un droit
              d'accès, de rectification, et de suppression de vos données. Vous
              pouvez supprimer l'intégralité de votre compte et de vos données
              associées à tout moment depuis les paramètres de votre compte, ou
              en nous contactant à privacy@aicareercopilot.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
