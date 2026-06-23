"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "free",
    name: "Découverte",
    price: "0",
    tagline: "Pour tester la tension",
    features: [
      "3 simulations gratuites",
      "1 analyse de Career DNA",
      "Feedback textuel Mistral",
      "Export PDF standard",
    ],
    cta: "Commencer",
    color: "slate",
  },
  {
    id: "pro",
    name: "Pro",
    price: "19",
    tagline: "Pour les candidats sérieux",
    popular: true,
    features: [
      "Simulations illimitées",
      "Analyse vocale complète",
      "Accès à Victor (Stress Mode)",
      "Export PDF Premium sans filigrane",
      "Historique de mutation",
    ],
    cta: "Démarrer le Pro",
    color: "blue",
  },
  {
    id: "expert",
    name: "Expert",
    price: "39",
    tagline: "Pour les top postes",
    features: [
      "Tout le plan Pro",
      "Coach IA personnalisé 24/7",
      "Simulations FAANG & McKinsey",
      "Analyse Culture Fit",
      "Support prioritaire",
    ],
    cta: "Devenir Expert",
    color: "purple",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section px-6 bg-transparent relative">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-6">
          <h2 className="text-4xl lg:text-7xl font-black text-white leading-tight tracking-tight">
            Investissez dans votre{" "}
            <span className="text-blue-500">mutation.</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
            Un entretien raté coûte des mois de salaire. Trajectoire est
            rentable dès votre premier oui.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col justify-between hover:shadow-2xl",
                plan.popular
                  ? "bg-blue-600 border-blue-400 shadow-blue-500/20 scale-105 z-10"
                  : "bg-white/5 border-white/10 hover:bg-white/[0.08]",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-white text-blue-600 font-black px-6 py-1.5 border-none shadow-xl">
                    LE PLUS POPULAIRE
                  </Badge>
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <p
                    className={cn(
                      "text-sm font-bold mt-1 uppercase tracking-widest",
                      plan.popular ? "text-blue-100" : "text-slate-500",
                    )}
                  >
                    {plan.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black">{plan.price}€</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      plan.popular ? "text-blue-100" : "text-slate-500",
                    )}
                  >
                    /mois
                  </span>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check
                        className={cn(
                          "w-5 h-5 flex-shrink-0 mt-0.5",
                          plan.popular ? "text-blue-200" : "text-blue-500",
                        )}
                      />
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                className={cn(
                  "mt-10 h-16 rounded-2xl font-black text-lg",
                  plan.popular
                    ? "bg-white text-blue-600 hover:bg-slate-100"
                    : "bg-blue-600 text-white hover:bg-blue-700",
                )}
              >
                <Link href="/auth/signup">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
