import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-900 py-24">
      {/* Pattern de fond */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative mx-auto px-4 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
          <Sparkles className="h-4 w-4" />
          <span>
            Rejoignez 1 200+ candidats qui ont transformé leur carrière
          </span>
        </div>

        {/* Titre */}
        <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
          Prêt à passer les filtres ATS ?
        </h2>

        {/* Sous-titre */}
        <p className="mb-10 text-xl text-red-100 md:text-2xl">
          Analysez votre CV gratuitement et découvrez pourquoi il est rejeté
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-lg text-red-600 hover:bg-gray-100 shadow-2xl"
          >
            <Link href="/dashboard">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white bg-transparent text-white hover:bg-white/10"
          >
            <Link href="#pricing">Voir les tarifs</Link>
          </Button>
        </div>

        {/* Proof */}
        <p className="mt-8 text-sm text-red-100">
          ✓ 1 crédit offert • ✓ Pas de carte requise • ✓ Résultats en 3 minutes
        </p>
      </div>
    </section>
  );
}
