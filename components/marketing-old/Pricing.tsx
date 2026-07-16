"use client";

import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/design-system";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    credits: 3,
    price: 9,
    pricePerCredit: 3,
    description: "Parfait pour tester le service",
    features: [
      "3 optimisations CV ou simulations",
      "Analyse ATS complète",
      "Support email",
      "Accès 30 jours",
    ],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Pro",
    credits: 10,
    price: 25,
    pricePerCredit: 2.5,
    description: "Idéal pour une recherche active",
    features: [
      "10 optimisations CV ou simulations",
      "Analyse ATS complète",
      "Support prioritaire",
      "Accès 90 jours",
      "Économie de 30%",
    ],
    cta: "Choisir Pro",
    popular: true,
  },
  {
    name: "Expert",
    credits: 25,
    price: 50,
    pricePerCredit: 2,
    description: "Pour reconversion ou multiples postes",
    features: [
      "25 optimisations CV ou simulations",
      "Analyse ATS complète",
      "Support prioritaire + appel conseil",
      "Accès illimité",
      "Économie de 50%",
    ],
    cta: "Choisir Expert",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-gradient-to-b from-red-950/20 to-black py-24"
    >
      <div className="container mx-auto px-4">
        {/* Titre */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Tarification Transparente
          </h2>
          <p className="text-xl text-gray-400">
            Pas d'abonnement piège. Payez uniquement ce que vous utilisez.
          </p>
        </div>

        {/* Grille de Plans */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-red-600 bg-gradient-to-br from-red-950/50 to-black shadow-2xl shadow-red-900/50 ring-2 ring-red-600"
                  : "border-red-900/30 bg-gradient-to-br from-red-950/20 to-black"
              }`}
            >
              {/* Badge Popular */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-1 text-sm font-semibold text-white shadow-xl">
                    <Sparkles className="h-4 w-4" />
                    Plus Populaire
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-8 text-center">
                <h3 className="mb-2 text-2xl font-bold text-white">
                  {plan.name}
                </h3>
                <p className="mb-6 text-gray-400">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}€
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {plan.pricePerCredit}€ par crédit
                </p>
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                className={`w-full ${
                  plan.popular
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-900/30 hover:bg-red-800/50"
                }`}
                size="lg"
              >
                <Link href={`/dashboard?plan=${plan.name.toLowerCase()}`}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Informations Supplémentaires */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-gray-400">
            <strong className="text-white">1 crédit</strong> = 1 optimisation CV{" "}
            <strong className="text-white">OU</strong> 1 simulation entretien
          </p>
          <p className="text-sm text-gray-500">
            💡 Garantie satisfait ou remboursé 30 jours • Paiement sécurisé par
            Stripe
          </p>
        </div>
      </div>
    </section>
  );
}
