"use client";

import { ArrowRight, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-black to-black">
      {/* Grille de fond luxueuse */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Colonne Gauche : Proposition de Valeur */}
          <div className="flex flex-col gap-8">
            {/* Badge Attention */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-red-900/30 px-4 py-2 text-sm font-medium text-red-200 ring-1 ring-red-800/50">
              <Sparkles className="h-4 w-4" />
              <span>Plus de 1 200 candidats déjà préparés</span>
            </div>

            {/* Titre Principal (Orienté Bénéfice) */}
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Passez enfin les{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                filtres ATS
              </span>{" "}
              et décrochez l'entretien
            </h1>

            {/* Sous-titre (Pain Point) */}
            <p className="text-xl text-gray-300 md:text-2xl">
              <strong className="text-red-400">75% des CV</strong> sont rejetés
              automatiquement par des robots avant d'atteindre un recruteur
              humain.
              <br />
              <span className="text-gray-400">
                Découvrez pourquoi et comment corriger le vôtre en 15 minutes.
              </span>
            </p>

            {/* CTA Principal */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-red-600 text-lg hover:bg-red-700 shadow-xl shadow-red-900/50"
              >
                <Link href="/dashboard">
                  <span className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Analysez votre CV gratuitement
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-950"
              >
                <Link href="#how-it-works">Voir comment ça marche</Link>
              </Button>
            </div>

            {/* Proof Elements */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Pas de carte requise</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>1 crédit offert</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Résultats en 3 minutes</span>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Mockup Produit */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-600 to-orange-600 opacity-20 blur-3xl" />

            {/* Screenshot Mockup */}
            <div className="relative rounded-2xl border border-red-800/50 bg-black/50 p-8 shadow-2xl backdrop-blur">
              <div className="space-y-4">
                {/* Faux Upload */}
                <div className="flex items-center gap-4 rounded-lg border border-dashed border-red-600 bg-red-950/20 p-6">
                  <Upload className="h-8 w-8 text-red-400" />
                  <div>
                    <p className="font-semibold text-white">CV_John_Doe.pdf</p>
                    <p className="text-sm text-gray-400">245 KB</p>
                  </div>
                </div>

                {/* Faux Résultat */}
                <div className="space-y-3 rounded-lg bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Score ATS</span>
                    <span className="text-3xl font-bold text-red-400">
                      67/100
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                    <div className="h-full w-[67%] bg-gradient-to-r from-red-600 to-orange-500" />
                  </div>
                  <p className="text-sm text-gray-400">
                    🔍{" "}
                    <strong className="text-white">
                      12 mots-clés manquants
                    </strong>{" "}
                    détectés
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
