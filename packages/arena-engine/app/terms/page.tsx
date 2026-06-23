"use client";

import Link from "next/link";

export default function TermsPage() {
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
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-slate-500">Dernière mise à jour : 20 Mai 2026</p>
        </div>

        <div className="prose prose-slate prose-blue max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Objet du service
            </h2>
            <p className="text-slate-600 leading-relaxed">
              AI Career Copilot est un service SaaS d'aide à la candidature
              permettant l'analyse de CV, la suggestion d'optimisations basées
              sur l'intelligence artificielle, et la simulation d'entretiens. Le
              service est fourni "en l'état" pour aider les candidats dans leur
              recherche d'emploi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Utilisation des crédits
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Le service fonctionne sur un modèle de crédits. L'analyse d'un CV
              coûte 1 crédit, et une simulation d'entretien coûte 2 crédits. Les
              crédits achetés ont une validité définie lors de l'achat
              (généralement 6 mois, sauf pour le pack Elite où ils sont
              illimités). Aucun remboursement n'est effectué pour les crédits
              non utilisés après leur expiration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              3. Garantie satisfait ou remboursé
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Nous offrons une garantie de remboursement sous 7 jours à compter
              de la date du premier paiement, sous réserve que moins de 50% des
              crédits achetés aient été consommés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              4. Limites de responsabilité
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Bien que notre IA soit performante pour analyser et optimiser vos
              candidatures, AI Career Copilot ne garantit en aucun cas
              l'obtention d'un emploi, d'un entretien ou le passage effectif
              d'un filtre ATS spécifique (les algorithmes des recruteurs étant
              propriétaires et sujets à modification). L'utilisateur demeure
              seul responsable des informations qu'il soumet aux employeurs.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
