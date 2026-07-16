// @ts-nocheck
import {
  Brain,
  Shield,
  Zap,
  BarChart3,
  Target,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Analyse ATS Avancée",
    description:
      "Notre IA analyse votre CV contre 47 critères utilisés par les systèmes ATS des grandes entreprises.",
    benefits: [
      "Détection des mots-clés manquants",
      "Score de compatibilité formatage",
      "Suggestions de reformulation",
    ],
  },
  {
    icon: Target,
    title: "Optimisation Ciblée",
    description:
      "Croisement intelligent entre votre CV et l'offre d'emploi spécifique pour maximiser vos chances.",
    benefits: [
      "Adaptation au vocabulaire de l'entreprise",
      "Mise en avant des compétences pertinentes",
      "Réorganisation de l'expérience",
    ],
  },
  {
    icon: MessageSquare,
    title: "Simulation d'Entretien IA",
    description:
      "Questions sur-mesure (RH, Technique, Comportemental) adaptées à votre profil et au poste visé.",
    benefits: [
      "10 questions générées par IA",
      "Évaluation structurée de vos réponses",
      "Exemples de réponses idéales",
    ],
  },
  {
    icon: BarChart3,
    title: "Évaluation Détaillée",
    description:
      "Recevez une note sur 100 avec analyse de vos points forts, faiblesses et axes d'amélioration.",
    benefits: [
      "Feedback exploitable immédiatement",
      "Comparaison avec les meilleurs candidats",
      "Progression trackée",
    ],
  },
  {
    icon: Zap,
    title: "Résultats Instantanés",
    description:
      "Traitement ultra-rapide grâce à notre infrastructure optimisée. Pas d'attente.",
    benefits: [
      "Analyse en moins de 3 minutes",
      "Disponible 24/7",
      "Pas de file d'attente",
    ],
  },
  {
    icon: Shield,
    title: "Sécurité Maximale",
    description:
      "Vos données sont chiffrées et jamais revendues. Conformité RGPD stricte.",
    benefits: [
      "Hébergement EU (Supabase)",
      "Suppression possible à tout moment",
      "Aucune revente de données",
    ],
  },
];

export default function Features() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-4">
        {/* Titre */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Bien plus qu'un simple correcteur de CV
          </h2>
          <p className="text-xl text-gray-400">
            Une plateforme complète pour maximiser vos chances de décrocher le
            poste
          </p>
        </div>

        {/* Grille de Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-red-900/30 bg-gradient-to-br from-red-950/20 to-black p-8 transition-all hover:border-red-700/50 hover:shadow-xl hover:shadow-red-900/30"
              >
                {/* Icône */}
                <div className="mb-6 inline-flex rounded-xl bg-red-900/30 p-4 ring-1 ring-red-800/50 transition-transform group-hover:scale-110">
                  <Icon className="h-8 w-8 text-red-400" />
                </div>

                {/* Contenu */}
                <h3 className="mb-3 text-2xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mb-6 text-gray-400">{feature.description}</p>

                {/* Bénéfices */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
