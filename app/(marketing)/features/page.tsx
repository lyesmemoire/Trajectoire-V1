"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 1,
      icon: "📊",
      title: "Analyse ATS Avancée",
      subtitle: "Découvrez exactement pourquoi votre CV est rejeté",
      description:
        "Notre moteur d'intelligence artificielle analyse chaque aspect de votre CV : mots-clés, structure, formatage, et impact. Comparez votre profil à l'offre cible et obtenez un score de compatibilité précis.",
      benefits: [
        "Score de compatibilité 0-100",
        "Audit sémantique complet",
        "Mots-clés manquants identifiés",
        "Suggestions priorisées",
      ],
    },
    {
      id: 2,
      icon: "✍️",
      title: "Optimisation IA",
      subtitle: "Transformez votre parcours en succès mesurables",
      description:
        "Utilisez la méthode XYZ pour reformuler vos expériences. Notre IA transforme vos réalisations en preuves d'impact quantifiable qui résonnent avec les recruteurs et les ATS.",
      benefits: [
        "Reformulations méthode XYZ",
        "Alignement sémantique",
        "Templates ATS-friendly",
        "Prévisualisation temps réel",
      ],
    },
    {
      id: 3,
      icon: "🎯",
      title: "Mock Interview Lab",
      subtitle: "Entraînez-vous avec des recruteurs virtuels réalistes",
      description:
        "Simulez des entretiens avec différents profils de recruteurs : RH corporatif, fondateur startup, tech lead Big Tech. Chaque session génère un feedback détaillé sur 5 axes de performance.",
      benefits: [
        "4 personas de recruteurs",
        "3 niveaux de difficulté",
        "Feedback 5 axes",
        "Historique de progression",
      ],
    },
    {
      id: 4,
      icon: "📈",
      title: "Suivi de Progression",
      subtitle: "Mesurez votre évolution vers le succès",
      description:
        "Dashboard complet pour suivre vos analyses ATS, vos sessions d'entretien et votre progression. Visualisez vos améliorations et celebrez vos succès.",
      benefits: [
        "KPIs en temps réel",
        "Historique illimité",
        "Graphiques de progression",
        "Alertes de performance",
      ],
    },
  ];

  const techSpecs = [
    { label: "Analyse CV", value: "< 30s", icon: "⚡" },
    { label: "Score ATS", value: "94%", icon: "🎯" },
    { label: "Personas Recruteurs", value: "4", icon: "👥" },
    { label: "Axes Feedback", value: "5", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
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
          <div className="flex items-center gap-6">
            <Link href="/features" className="font-bold text-blue-600">
              Fonctionnalités
            </Link>
            <Link
              href="/pricing"
              className="font-bold text-slate-600 hover:text-slate-900"
            >
              Tarifs
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Essai gratuit →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(124,58,237,0.15),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm mb-8 shadow-lg shadow-blue-500/10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            4 technologies puissantes
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
            Le kit de survie du
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              candidat moderne
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            4 outils connectés pour passer les filtres ATS, impressionner les
            recruteurs et réussir vos entretiens du premier coup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="btn-primary text-lg px-8 py-4 shadow-xl shadow-blue-500/30"
            >
              Démarrer gratuitement →
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-4">
              Voir les démos
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="py-12 border-y border-slate-200/60 bg-white/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {techSpecs.map((spec, i) => (
              <div
                key={i}
                className="text-center reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-2">{spec.icon}</div>
                <div className="text-4xl font-black text-slate-900">
                  {spec.value}
                </div>
                <div className="text-sm font-bold text-slate-500 mt-1">
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <div className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">
              Les 4 piliers
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mt-4 mb-4">
              Chaque fonctionnalité est conçue
              <br />
              pour résoudre un problème précis
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Du CV invisble à l'entretien réussi, notre stack technologique
              vous accompagne à chaque étape.
            </p>
          </div>

          {/* Feature Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 reveal">
            {features.map((feature, i) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(i)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  activeFeature === i
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <span className="mr-2">{feature.icon}</span>
                {feature.title.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Feature Detail */}
          {(() => {
            const currentFeature = features[activeFeature];
            if (!currentFeature) return null;
            return (
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-5xl">
                {currentFeature.icon}
              </div>
              <h3 className="text-3xl lg:text-4xl font-black tracking-tight">
                {currentFeature.title}
              </h3>
              <p className="text-lg text-violet-600 font-bold">
                {currentFeature.subtitle}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {currentFeature.description}
              </p>

              <ul className="space-y-4 mt-8">
                {currentFeature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-slate-700">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className="btn-primary inline-flex mt-6 px-8 py-4"
              >
                Essayer {currentFeature.title.split(" ")[0]} →
              </Link>
            </div>

            {/* Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden min-h-[400px] flex items-center justify-center">
                <div className="absolute top-0 left-0 right-0 h-12 bg-slate-100 border-b border-slate-200 flex items-center gap-3 px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 h-7 bg-white rounded-full border border-slate-200 flex items-center px-4">
                    <span className="text-xs text-slate-400">
                      app.aicareercopilot.com/
                      {
                        currentFeature.title
                          .toLowerCase()
                          .split(" ")[0]
                      }
                    </span>
                  </div>
                </div>
                <div className="p-8 text-center mt-12">
                  <div className="text-8xl mb-4">
                    {currentFeature.icon}
                  </div>
                  <div className="font-bold text-slate-400">
                    Aperçu de {currentFeature.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
            );
          })()}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl font-black tracking-tight mb-4">
              Comparé aux méthodes traditionnelles
            </h2>
            <p className="text-lg text-slate-400">
              Pourquoi AI Career Copilot change la donne
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 reveal">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold mb-6 text-red-400">
                ❌ Sans AI Career Copilot
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span className="text-slate-300">
                    CV envoyé sans savoir s'il passe les filtres ATS
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span className="text-slate-300">
                    Mois à deviner pourquoi pas de réponse
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span className="text-slate-300">
                    Entretiens découverts sur le tard, préparation insuffisante
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span className="text-slate-300">
                    Répétition des mêmes erreurs
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/30">
              <h3 className="text-xl font-bold mb-6 text-green-400">
                ✓ Avec AI Career Copilot
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-slate-200">
                    Score ATS en temps réel, optimisations suggérées
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-slate-200">
                    Actions concrètes prioritaires pour chaque candidature
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-slate-200">
                    Entraînement avec IA avant le vrai entretien
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-slate-200">
                    Progression mesurable, amélioration continue
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.3),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.2),transparent_40%)]" />
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
                Prêt à transformer vos candidatures ?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Rejoignez 1 200+ candidats qui ont optimisé leur CV et décroché
                plus d'entretiens.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform"
              >
                Créer mon compte gratuit
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <p className="mt-4 text-sm text-white/60">
                2 crédits gratuits · sans carte bancaire
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black">
              ✦
            </div>
            <span className="font-black text-xl tracking-tight">
              AI Career Copilot
            </span>
          </Link>
          <div className="flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/features">Fonctionnalités</Link>
            <Link href="/pricing">Tarifs</Link>
            <Link href="/privacy">Confidentialité</Link>
            <Link href="/terms">Conditions</Link>
          </div>
          <div className="text-sm text-slate-400">© 2026 AI Career Copilot</div>
        </div>
      </div>
    </footer>
  );
}
