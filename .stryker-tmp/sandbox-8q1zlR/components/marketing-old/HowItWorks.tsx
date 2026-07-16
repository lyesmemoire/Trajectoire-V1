// @ts-nocheck
import { Upload, Search, Target, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Uploadez votre CV",
    description:
      "Format PDF accepté. Extraction automatique du texte en 30 secondes.",
    time: "30 sec",
  },
  {
    icon: Search,
    title: "Collez l'offre d'emploi",
    description: "Copiez-collez la description du poste qui vous intéresse.",
    time: "1 min",
  },
  {
    icon: Target,
    title: "Recevez votre analyse",
    description:
      "Score ATS, mots-clés manquants, suggestions d'amélioration précises.",
    time: "3 min",
  },
  {
    icon: TrendingUp,
    title: "Entraînez-vous aux entretiens",
    description:
      "Questions sur-mesure générées par IA selon votre profil et l'offre.",
    time: "15 min",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-black to-red-950/20 py-24"
    >
      <div className="container mx-auto px-4">
        {/* Titre de Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Simple, Rapide, Efficace
          </h2>
          <p className="text-xl text-gray-400">
            4 étapes pour un CV optimisé et une préparation complète
          </p>
        </div>

        {/* Étapes */}
        <div className="relative grid gap-12 md:grid-cols-4">
          {/* Ligne de connexion (desktop only) */}
          <div className="absolute left-0 top-16 hidden h-0.5 w-full bg-gradient-to-r from-red-600 via-red-400 to-red-600 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center"
              >
                {/* Numéro + Icône */}
                <div className="relative z-10 mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-2xl shadow-red-900/50 ring-4 ring-black">
                  <Icon className="h-12 w-12 text-white" />
                  <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-red-600">
                    {index + 1}
                  </div>
                </div>

                {/* Badge Temps */}
                <div className="mb-4 rounded-full bg-red-900/30 px-3 py-1 text-sm font-semibold text-red-300">
                  {step.time}
                </div>

                {/* Contenu */}
                <h3 className="mb-2 text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Temps Total */}
        <div className="mt-16 text-center">
          <p className="text-2xl text-gray-300">
            <span className="font-bold text-red-400">Temps total :</span> 15
            minutes pour un CV optimisé + 30 min de simulation
          </p>
        </div>
      </div>
    </section>
  );
}
