"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function TestimonialsPage() {
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

  const testimonials = [
    {
      name: "Marion L.",
      role: "Product Manager",
      company: "Scale-up SaaS",
      avatar: "ML",
      avatarColor: "from-blue-500 to-indigo-500",
      quote:
        "Je pensais que mon CV était solide. L'analyse ATS m'a montré que je passais à côté de mots-clés essentiels pour mon poste. Après optimisation, j'ai obtenu 4 entretiens en 2 semaines.",
      results: ["+4 entretiens", "Score ATS: 78→92", "CV optimisé en 1h"],
      rating: 5,
    },
    {
      name: "Adam K.",
      role: "Software Engineer",
      company: "Big Tech",
      avatar: "AK",
      avatarColor: "from-violet-500 to-purple-500",
      quote:
        "Le recruteur IA niveau Élite m'a mis en difficulté exactement comme en entretien final. Le débriefing sur la structure de mes réponses a été déterminant pour ma préparation.",
      results: ["Entretien réussi", "Score tech: 4.5/5", "3 offres reçues"],
      rating: 5,
    },
    {
      name: "Sofia D.",
      role: "Marketing Lead",
      company: "FinTech",
      avatar: "SD",
      avatarColor: "from-green-500 to-emerald-500",
      quote:
        "Le template Executive Navy et les reformulations XYZ ont transformé mon CV. Plus clair, plus mesurable, beaucoup plus convaincant. Mon taux de réponse a doublé.",
      results: ["+100% réponses", "Taux passer: 94%", "CV en 30min"],
      rating: 5,
    },
    {
      name: "Thomas R.",
      role: "Engineering Manager",
      company: "Startup Tech",
      avatar: "TR",
      avatarColor: "from-orange-500 to-red-500",
      quote:
        "J'ai utilisé le Mock Interview Lab chaque soir pendant 2 semaines avant mon entretien chez Google. La simulation niveau Élite était si réaliste que le vrai entretien m'a semblé familier.",
      results: ["Offre Google", "Préparé 14 jours", "Confidence: +40%"],
      rating: 5,
    },
    {
      name: "Léa M.",
      role: "UX Designer",
      company: "Agency",
      avatar: "LM",
      avatarColor: "from-pink-500 to-rose-500",
      quote:
        "Parfois on pense que notre CV est bon mais les ATS ne voient pas les mêmes choses. L'audit sémantique m'a révélé 12 mots-clés manquants. Après correction, j'ai vu la différence.",
      results: ["Audit: 12 mots-clés", "Réponse: +67%", "Design portfolio"],
      rating: 5,
    },
    {
      name: "Nicolas B.",
      role: "Data Scientist",
      company: "Enterprise",
      avatar: "NB",
      avatarColor: "from-cyan-500 to-blue-500",
      quote:
        "Le feedback multi-axes de l'entretien IA m'a permis d'identifier que ma communication était mon point faible. En 1 mois de pratique, j'ai amélioré mon score de 3.2 à 4.4.",
      results: ["Score com: 3.2→4.4", "3 entretiens", "2e place final"],
      rating: 5,
    },
  ];

  const stats = [
    { value: "94%", label: "Taux de passage ATS" },
    { value: "3x", label: "Plus d'entretiens" },
    { value: "<30s", label: "Analyse complète" },
    { value: "1 200+", label: "Candidats accompagnés" },
  ];

  const categories = [
    { label: "Tous", count: testimonials.length },
    { label: "Product Manager", count: 1 },
    { label: "Engineering", count: 2 },
    { label: "Marketing", count: 1 },
    { label: "Design", count: 1 },
    { label: "Data", count: 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
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
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-sm mb-6">
            <span className="text-lg">⭐</span>
            4.9/5 de satisfaction moyenne
          </div>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">
            Ils ont transformé
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              leurs candidatures
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-xl mx-auto">
            Découvrez comment AI Career Copilot a aidé des centaines de
            candidats à passer les filtres ATS et décrocher les entretiens
            qu'ils méritent.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-lg reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl lg:text-5xl font-black text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-500 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 reveal">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                  i === 0
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat.label}
                <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-full text-xs">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex gap-1 text-amber-400 text-lg mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 leading-relaxed mb-6">
                  "{t.quote}"
                </p>

                {/* Results */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {t.results.map((result, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full"
                    >
                      {result}
                    </span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white font-bold text-lg`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-bold mb-6">
                📖 Étude de cas
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-6">
                Comment Marion a décroché 4 entretiens en 2 semaines
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Marion postulait depuis 3 mois sans résultat. Son CV était bien
                présenté mais manquait les bons mots-clés pour passer les
                filtres ATS. Après analyse et optimisation avec AI Career
                Copilot, tout a changé.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Audit ATS : 14 mots-clés manquants identifiés",
                  "Reformulation de 3 expériences avec méthode XYZ",
                  "Changement de template pour format ATS-friendly",
                  "Entraînement Mock Interview niveau Difficile",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-white"
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
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
              >
                Je veux le même résultat →
              </Link>
            </div>
            <div className="reveal">
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white/5 rounded-xl">
                    <div className="text-4xl font-black text-green-400">
                      78→92
                    </div>
                    <div className="text-sm text-slate-400 mt-2">Score ATS</div>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-xl">
                    <div className="text-4xl font-black text-blue-400">4</div>
                    <div className="text-sm text-slate-400 mt-2">
                      Entretiens obtenus
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-xl">
                    <div className="text-4xl font-black text-violet-400">
                      2 sem.
                    </div>
                    <div className="text-sm text-slate-400 mt-2">
                      Temps nécessaire
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/5 rounded-xl">
                    <div className="text-4xl font-black text-amber-400">1</div>
                    <div className="text-sm text-slate-400 mt-2">
                      Offre reçue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.2),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.15),transparent_40%)]" />
            <div className="relative">
              <h2 className="text-4xl font-black tracking-tight mb-4">
                Rejoignez les candidats qui réussissent
              </h2>
              <p className="text-xl text-white/80 mb-8">
                2 crédits gratuits pour découvrir la différence.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform"
              >
                Créer mon compte gratuit →
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
