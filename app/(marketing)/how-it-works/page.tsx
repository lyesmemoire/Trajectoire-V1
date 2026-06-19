"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function HowItWorksPage() {
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

  const steps = [
    {
      number: "01",
      title: "Importez votre profil",
      description:
        "Uploadez votre CV existant ou votre profil LinkedIn en quelques secondes. L'IA extrait et structure instantanément toutes vos compétences et expériences.",
      icon: "📥",
      color: "blue",
      features: [
        "Extraction PDF/Word",
        "Import LinkedIn",
        "Analyse sémantique immédiate",
      ],
    },
    {
      number: "02",
      title: "Auditez & Optimisez",
      description:
        "L'IA compare votre profil aux offres d'emploi cibles. Elle identifie les mots-clés manquants pour les ATS et reformule vos réalisations pour maximiser votre impact.",
      icon: "✨",
      color: "violet",
      features: ["Score ATS temps réel", "Méthode XYZ", "Templates optimisés"],
    },
    {
      number: "03",
      title: "Simulez l'Entretien",
      description:
        "Entraînez-vous face à des recruteurs virtuels ultra-réalistes. Obtenez un feedback immédiat sur votre communication, votre technique et votre structure.",
      icon: "🎙️",
      color: "emerald",
      features: [
        "Personas multiples",
        "Feedback 5 axes",
        "Niveaux de difficulté",
      ],
    },
    {
      number: "04",
      title: "Décrochez le job",
      description:
        "Avec un CV parfaitement aligné et une préparation sans faille, vous passez les filtres et abordez vos entretiens avec une confiance absolue.",
      icon: "🚀",
      color: "amber",
      features: [
        "+3x d'entretiens",
        "Confiance décuplée",
        "Progression mesurable",
      ],
    },
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
              Trajectoire
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/features"
              className="font-bold text-slate-600 hover:text-slate-900"
            >
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

      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.1),transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            Un processus éprouvé
          </div>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">
            Comment ça marche ?
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            De l'upload de votre vieux CV jusqu'à la signature de votre contrat.
            Découvrez comment l'accompagnement vous accompagne à chaque étape décisive.
          </p>
        </div>
      </section>

      {/* Steps Timeline */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-6 relative">
          {/* Timeline Line (Desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-violet-200 to-transparent -translate-x-1/2" />

          <div className="space-y-24">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex flex-col lg:flex-row items-center gap-12 lg:gap-24 reveal`}
                >
                  {/* Content (Left or Right) */}
                  <div
                    className={`flex-1 w-full ${isEven ? "lg:text-right lg:pr-12" : "lg:order-last lg:pl-12"}`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${step.color}-50 text-${step.color}-600 text-3xl mb-6 shadow-sm`}
                    >
                      {step.icon}
                    </div>
                    <div className="text-sm font-black text-slate-300 mb-2">
                      ÉTAPE {step.number}
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">
                      {step.title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                      {step.description}
                    </p>
                    <ul
                      className={`space-y-3 ${isEven ? "lg:flex lg:flex-col lg:items-end" : ""}`}
                    >
                      {step.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3">
                          {!isEven && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full bg-${step.color}-500`}
                            />
                          )}
                          <span className="font-semibold text-slate-700">
                            {feature}
                          </span>
                          {isEven && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full bg-${step.color}-500`}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Center Node (Desktop only) */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-slate-100 shadow-xl items-center justify-center z-10">
                    <div
                      className={`w-4 h-4 rounded-full bg-${step.color}-500`}
                    />
                  </div>

                  {/* Mockup Area (Opposite side) */}
                  <div
                    className={`flex-1 w-full p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner ${isEven ? "lg:order-last" : ""}`}
                  >
                    {/* Simplified placeholder visual for the step */}
                    <div className="w-full h-64 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
                      <div className="relative text-center">
                        <div className="text-6xl mb-4">{step.icon}</div>
                        <div className="font-bold text-slate-300 uppercase tracking-widest text-xs">
                          Aperçu
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-slate-200 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 text-center reveal">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10">
            Ils utilisent ces méthodes pour recruter
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Fake logos */}
            <div className="text-2xl font-black text-slate-800">TECH.CO</div>
            <div className="text-2xl font-black text-slate-800 tracking-tighter">
              fin<span className="text-blue-600">tech</span>
            </div>
            <div className="text-2xl font-black text-slate-800 italic">
              StartupLab
            </div>
            <div className="text-2xl font-black text-slate-800">
              GLOBAL <span className="font-light">HR</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
          <div className="p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.2),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.15),transparent_40%)]" />
            <div className="relative">
              <h2 className="text-4xl font-black tracking-tight mb-4">
                Prêt à essayer ?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Inscrivez-vous maintenant et recevez vos 2 premiers crédits
                gratuits pour tester l'analyse ATS ou la simulation d'entretien.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform"
              >
                Commencer gratuitement →
              </Link>
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
              Trajectoire
            </span>
          </Link>
          <div className="flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/features">Fonctionnalités</Link>
            <Link href="/pricing">Tarifs</Link>
            <Link href="/privacy">Confidentialité</Link>
            <Link href="/terms">Conditions</Link>
          </div>
          <div className="text-sm text-slate-400">© 2026 Trajectoire</div>
        </div>
      </div>
    </footer>
  );
}
