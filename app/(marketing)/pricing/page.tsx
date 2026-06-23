"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Lock,
  Zap,
  Star,
  ChevronDown,
} from "lucide-react";

// ─── Données ────────────────────────────────────────────────────────────────

const GAP_ROWS = [
  {
    without: "Improvisation le jour J",
    with:    "Structure et méthode prouvée",
  },
  {
    without: "Stress non maîtrisé",
    with:    "Confiance installée avant d'entrer",
  },
  {
    without: "Réponses génériques oubliables",
    with:    "Storytelling qui marque les esprits",
  },
  {
    without: "Silence radio après l'entretien",
    with:    "Taux de retour positif multiplié par 2",
  },
  {
    without: "Préparation solitaire et floue",
    with:    "Feedback immédiat, précis, actionnable",
  },
];

const SESSIONS = [
  { n: 1, title: "Diagnostic & Structure",    desc: "Identifie tes lacunes réelles. Bâtis un discours solide." },
  { n: 2, title: "Storytelling & Impact",     desc: "Transforme tes expériences en preuves convaincantes." },
  { n: 3, title: "Stress & Questions pièges", desc: "Entraîne-toi aux situations qui font craquer." },
  { n: 4, title: "Grand Jury Final",          desc: "Simulation complète. Tu arrives préparé. Tu repartes confiant." },
];

const TESTIMONIALS = [
  {
    name:   "Amira K.",
    role:   "Chargée de projet — recrutée en 3 semaines",
    quote:  "J'avais peur des questions sur mes lacunes. Après 2 sessions, je les anticipais. J'ai eu une offre à J+18.",
    stars:  5,
  },
  {
    name:   "Thomas R.",
    role:   "Développeur senior — reconversion réussie",
    quote:  "Le feedback vocal m'a montré que je parlais trop vite sous stress. Je ne le savais même pas. Ça a tout changé.",
    stars:  5,
  },
  {
    name:   "Sofia M.",
    role:   "Manager RH — poste décroché après 4 refus",
    quote:  "4 refus en 2 mois, puis Trajectoire. À la 5ème tentative, j'avais les arguments. J'ai signé la semaine suivante.",
    stars:  5,
  },
];

const FAQS = [
  {
    q: "4 entretiens par mois, c'est suffisant ?",
    a: "Un boxeur professionnel ne fait pas 1000 combats. Il fait les bons sparrings, au bon moment. 4 sessions structurées valent plus que 20 répétitions à l'aveugle.",
  },
  {
    q: "Est-ce mieux qu'un coach humain ?",
    a: "Un coach humain de qualité facture 150€/h. Trajectoire te donne le même niveau d'exigence — disponible à 3h du matin, sans jugement, avec un feedback instantané.",
  },
  {
    q: "Et si je veux annuler ?",
    a: "Sans engagement. Tu résilie en un clic depuis ton espace. Mais la plupart restent parce que le prochain entretien est toujours plus proche qu'on ne croit.",
  },
  {
    q: "Ça fonctionne pour quel type de poste ?",
    a: "Tous. Cadre, technique, commercial, reconversion. L'IA adapte les scénarios à ton secteur et ton niveau d'expérience.",
  },
];

// ─── Animations ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Composants internes ─────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border border-white/10 rounded-xl px-6 py-5
                 hover:border-white/20 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-white">{q}</span>
        <ChevronDown
          className={`shrink-0 text-white/40 transition-transform duration-300
                      ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </div>
      {open && (
        <p className="mt-3 text-white/60 text-sm leading-relaxed">{a}</p>
      )}
    </button>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center
                           px-6 pt-28 pb-24 overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2
                           w-[700px] h-[400px] bg-indigo-600/20
                           blur-[120px] rounded-full" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p variants={fadeUp}
            className="text-indigo-400 font-semibold tracking-widest
                       text-xs uppercase mb-6">
            Trajectoire · Coach de Performance
          </motion.p>

          <motion.h1 variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold leading-tight
                       tracking-tight mb-6">
            Un entretien raté,<br />
            <span className="text-indigo-400">c'est 6 mois de recherche perdus.</span>
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-lg text-white/60 max-w-xl mx-auto mb-10">
            Trajectoire t'entraîne comme un athlète avant la compétition
            qui compte vraiment — avec un feedback vocal immédiat,
            une analyse CV précise, et un scoring ATS sans filtre.
          </motion.p>

          <motion.div variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#plans"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500
                         rounded-xl font-bold text-white transition-colors">
              Commencer mon programme
            </a>
            <a
              href="#gap"
              className="px-8 py-4 border border-white/10 hover:border-white/30
                         rounded-xl font-semibold text-white/70 transition-colors">
              Voir comment ça marche
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. LE GAP ───────────────────────────────────────────────────── */}
      <section id="gap" className="px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2 variants={fadeUp}
            className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            La différence entre ceux qui décrochent le poste
            <br />
            <span className="text-white/40">et ceux qui attendent encore.</span>
          </motion.h2>

          <motion.p variants={fadeUp}
            className="text-center text-white/50 mb-14 max-w-lg mx-auto">
            Ce n'est pas le diplôme. Ce n'est pas l'expérience.
            C'est la préparation.
          </motion.p>

          <motion.div variants={stagger}
            className="grid grid-cols-2 gap-3 md:gap-4">
            {/* Header */}
            <div className="col-span-1 rounded-xl bg-white/5 px-5 py-3
                             flex items-center gap-2">
              <XCircle className="text-red-400 shrink-0" size={16} />
              <span className="font-semibold text-sm text-white/60">
                Sans Trajectoire
              </span>
            </div>
            <div className="col-span-1 rounded-xl bg-indigo-600/20
                             border border-indigo-500/30 px-5 py-3
                             flex items-center gap-2">
              <CheckCircle2 className="text-indigo-400 shrink-0" size={16} />
              <span className="font-semibold text-sm text-indigo-300">
                Avec Trajectoire
              </span>
            </div>

            {/* Rows */}
            {GAP_ROWS.map((row, i) => (
              <>
                <motion.div key={`w-${i}`} variants={fadeUp}
                  className="rounded-xl bg-white/[0.03] border border-white/5
                               px-5 py-4 text-sm text-white/50 flex items-center gap-3">
                  <XCircle className="shrink-0 text-red-500/60" size={14} />
                  {row.without}
                </motion.div>
                <motion.div key={`g-${i}`} variants={fadeUp}
                  className="rounded-xl bg-indigo-600/10 border border-indigo-500/20
                               px-5 py-4 text-sm text-indigo-200 flex items-center gap-3">
                  <CheckCircle2 className="shrink-0 text-indigo-400" size={14} />
                  {row.with}
                </motion.div>
              </>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── 3. LES PLANS ────────────────────────────────────────────────── */}
      <section id="plans" className="px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2 variants={fadeUp}
            className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            Choisir Trajectoire,
            <br />
            <span className="text-indigo-400">c'est choisir de ne plus improviser.</span>
          </motion.h2>

          <motion.p variants={fadeUp}
            className="text-center text-white/50 mb-14">
            Pas un abonnement. Un investissement de carrière.
          </motion.p>

          <motion.div variants={stagger}
            className="grid md:grid-cols-2 gap-6">

            {/* Plan FREE */}
            <motion.div variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-white/[0.03]
                           p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest text-white/40
                               uppercase mb-2">
                  L'Évaluation
                </p>
                <p className="text-4xl font-extrabold">Gratuit</p>
                <p className="text-white/40 text-sm mt-1">
                  Pour mesurer le fossé
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "1 audit CV — score + 1 conseil",
                  "1 scan ATS — compatibilité + 1 recommandation",
                  "3 minutes d'entretien vocal",
                  "Rapport partiel — aperçu du diagnostic",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/60">
                    <CheckCircle2 size={15} className="text-white/30 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
                {[
                  "Feedback vocal complet",
                  "Conseils CV détaillés",
                  "Historique & progression",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/30">
                    <Lock size={15} className="text-white/20 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className="block text-center py-3.5 rounded-xl border
                             border-white/15 hover:border-white/30 text-white/70
                             font-semibold text-sm transition-colors">
                Mesurer mon niveau maintenant
              </Link>
            </motion.div>

            {/* Plan PRO */}
            <motion.div variants={fadeUp}
              className="relative rounded-2xl border border-indigo-500/50
                           bg-gradient-to-b from-indigo-950/60 to-[#0A0A0F]
                           p-8 flex flex-col shadow-[0_0_60px_-12px_rgba(99,102,241,0.4)]">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-600 text-white text-xs font-bold
                                   px-4 py-1.5 rounded-full tracking-wide uppercase">
                  Le plus choisi
                </span>
              </div>

              <div className="mb-6 mt-2">
                <p className="text-xs font-bold tracking-widest text-indigo-400
                               uppercase mb-2">
                  La Maîtrise
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-extrabold">19,99€</p>
                  <p className="text-white/40 text-sm mb-1">/mois</p>
                </div>
                <p className="text-white/40 text-sm mt-1">
                  Soit 5€ par session — moins qu'un café pour transformer ta carrière
                </p>
              </div>

              {/* Sessions */}
              <div className="mb-6 space-y-3">
                {SESSIONS.map((s) => (
                  <div key={s.n}
                    className="flex items-start gap-4 rounded-xl bg-white/5
                                 border border-white/8 px-4 py-3">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-indigo-600/30
                                     border border-indigo-500/40 flex items-center
                                     justify-center text-xs font-bold text-indigo-300">
                      {s.n}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {s.title}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "CV illimité — feedback complet",
                  "ATS illimité — optimisation totale",
                  "Historique & suivi de progression",
                  "Accès prioritaire aux nouvelles fonctionnalités",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                    <CheckCircle2 size={15} className="text-indigo-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="/api/stripe/checkout?plan=pro"
                className="block text-center py-4 rounded-xl bg-indigo-600
                             hover:bg-indigo-500 text-white font-bold text-sm
                             transition-colors shadow-lg shadow-indigo-900/50">
                Commencer mon programme
              </a>

              <p className="text-center text-white/30 text-xs mt-3">
                Sans engagement · Résiliable à tout moment
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 4. TÉMOIGNAGES ──────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2 variants={fadeUp}
            className="text-3xl md:text-4xl font-extrabold text-center mb-14">
            Ils ont arrêté d'improviser.
            <br />
            <span className="text-white/40">Résultats en moins de 30 jours.</span>
          </motion.h2>

          <motion.div variants={stagger}
            className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} variants={fadeUp}
                className="rounded-2xl border border-white/8 bg-white/[0.03]
                             p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14}
                      className="fill-indigo-400 text-indigo-400" />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── 5. FAQ ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-2xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2 variants={fadeUp}
            className="text-3xl font-extrabold text-center mb-12">
            Questions fréquentes
          </motion.h2>

          <motion.div variants={stagger} className="space-y-3">
            {FAQS.map((faq) => (
              <motion.div key={faq.q} variants={fadeUp}>
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── 6. CTA FINAL ────────────────────────────────────────────────── */}
      <section className="relative px-6 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2
                           w-[600px] h-[300px] bg-indigo-600/15
                           blur-[100px] rounded-full" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl mx-auto"
        >
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 bg-indigo-600/20
                         border border-indigo-500/30 rounded-full px-4 py-2 mb-8">
            <Zap size={13} className="text-indigo-400" />
            <span className="text-indigo-300 text-xs font-semibold">
              Résultats mesurables en 7 jours
            </span>
          </motion.div>

          <motion.h2 variants={fadeUp}
            className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Tu peux continuer à improviser.
            <br />
            <span className="text-indigo-400">
              Ou décider que le prochain entretien sera différent.
            </span>
          </motion.h2>

          <motion.p variants={fadeUp}
            className="text-white/50 mb-10 text-lg">
            Le poste que tu vises ne t'attendra pas.
          </motion.p>

          <motion.div variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/api/stripe/checkout?plan=pro"
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500
                           rounded-xl font-bold text-white transition-colors
                           shadow-lg shadow-indigo-900/40">
              Commencer mon programme — 19,99€/mois
            </a>
            <Link
              href="/auth/signup"
              className="px-10 py-4 border border-white/10 hover:border-white/25
                           rounded-xl font-semibold text-white/60 transition-colors">
              Commencer gratuitement
            </Link>
          </motion.div>

          <motion.p variants={fadeUp}
            className="text-white/25 text-xs mt-6">
            Sans engagement · Paiement sécurisé · Résiliable en un clic
          </motion.p>
        </motion.div>
      </section>

    </main>
  );
}
