"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { safeFetch, NetworkError, TimeoutError } from "@/lib/api";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  Target,
  TrendingUp,
  ListTodo,
  Rocket,
  Star,
  ShieldCheck,
  Zap
} from "lucide-react";

// ─── Données ────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: Target,
    title: "Analyse ATS complète",
    desc: "Votre CV est scanné avec la même exigence que les logiciels de recrutement.",
  },
  {
    icon: TrendingUp,
    title: "Score et progression",
    desc: "Suivez l'évolution de votre score dans le temps pour chaque itération.",
  },
  {
    icon: ListTodo,
    title: "Plan d'action priorisé",
    desc: "Obtenez les mots-clés manquants et les corrections exactes à apporter.",
  },
  {
    icon: Rocket,
    title: "Optimisation continue",
    desc: "Ajustez jusqu'à atteindre un score ultra-compétitif avant de postuler.",
  },
];

const FAQS = [
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, totalement. Vous gérez votre abonnement en un clic depuis votre espace. Aucune question posée, aucun engagement de durée.",
  },
  {
    q: "Combien d'analyses puis-je faire ?",
    a: "Dès l'abonnement Essentiel (19€), vous disposez d'analyses ATS en illimité. Testez chaque modification de votre CV sans restriction.",
  },
  {
    q: "Les analyses reflètent-elles la réalité des recruteurs ?",
    a: "Nos algorithmes d'analyse simulent les critères stricts des ATS du marché (Workday, Taleo, Greenhouse). Un score élevé chez nous garantit de passer les filtres techniques.",
  },
  {
    q: "Mes données sont-elles confidentielles ?",
    a: "Absolument. Vos CV et données personnelles sont cryptés, privés et ne sont jamais partagés à des tiers ni utilisés pour entraîner des modèles publics.",
  },
];

// ─── Animations ─────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Composants internes ─────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border border-white/10 rounded-xl px-6 py-5
                 hover:border-white/20 transition-colors bg-white/[0.02]"
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
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    try {
      setLoadingPlan(plan);
      const data = await safeFetch<{ url?: string; error?: string }>(
        "/api/stripe/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        }
      );
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Une erreur est survenue");
        setLoadingPlan(null);
      }
    } catch (err) {
      if (err instanceof NetworkError) {
        toast.error("Connexion impossible. Vérifiez votre réseau.");
      } else if (err instanceof TimeoutError) {
        toast.error("Le serveur met trop de temps à répondre.");
      } else {
        toast.error("Une erreur est survenue lors du paiement.");
      }
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white selection:bg-indigo-500/30">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center
                           px-6 pt-32 pb-24 overflow-hidden">
        {/* Glow background */}
        <div className="absolute inset-0 -z-10 flex justify-center items-start pt-20">
          <div className="w-[800px] h-[400px] bg-indigo-600/15
                           blur-[120px] rounded-full" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <Zap size={14} className="text-indigo-400" />
              Impact Carrière
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1]
                       tracking-tight mb-8">
            Optimisez votre CV <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              comme un professionnel.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-6">
            Analysez, améliorez et suivez la progression de votre CV face aux systèmes ATS utilisés par les recruteurs.
          </motion.p>
          
          <motion.p variants={fadeUp}
            className="text-sm font-medium text-indigo-200/80 max-w-xl mx-auto mb-10 border-l-2 border-indigo-500/50 pl-4 py-1">
            Une seule amélioration stratégique peut faire la différence entre un refus automatique et un entretien.
          </motion.p>

          <motion.div variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#plans"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500
                         rounded-xl font-bold text-white transition-all
                         shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]">
              Voir les plans
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. MÉCANIQUE ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto border-t border-white/5">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2 variants={fadeUp}
            className="text-2xl md:text-3xl font-extrabold text-center mb-16">
            Comment ça fonctionne
          </motion.h2>

          <motion.div variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div key={i} variants={fadeUp}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{i + 1}. {item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── 3. LES PLANS ────────────────────────────────────────────────── */}
      <section id="plans" className="px-6 py-24 max-w-7xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="grid lg:grid-cols-3 gap-8">

            {/* 🟢 19€ — Essentiel */}
            <motion.div variants={fadeUp}
              className="rounded-3xl border border-white/10 bg-white/[0.02]
                         p-8 lg:p-10 flex flex-col hover:border-white/20 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2">Essentiel</h3>
                <p className="text-white/50 text-sm h-10">Pour optimiser efficacement votre CV.</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-extrabold">19€</span>
                  <span className="text-white/40 mb-2">/mois</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Analyses ATS illimitées",
                  "Score détaillé",
                  "Plan d'action priorisé",
                  "Réécriture IA avancée",
                  "Historique & suivi de progression",
                  "Export optimisé ATS",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/80 font-medium">
                    <CheckCircle2 size={18} className="text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout("essentiel")}
                disabled={loadingPlan === "essentiel"}
                className="block w-full text-center py-4 rounded-xl border border-white/10 hover:bg-white/5 font-bold transition-colors disabled:opacity-50">
                {loadingPlan === "essentiel" ? "Chargement..." : "Commencer"}
              </button>
            </motion.div>

            {/* 🟣 29€ — Performance (Le plus choisi) */}
            <motion.div variants={fadeUp}
              className="relative rounded-3xl border border-indigo-500
                         bg-gradient-to-b from-indigo-900/40 to-transparent
                         p-8 lg:p-10 flex flex-col shadow-[0_0_80px_-20px_rgba(79,70,229,0.3)]
                         transform lg:-translate-y-4">
              
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-indigo-500 text-white text-xs font-black
                                 px-4 py-1.5 rounded-full tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                  <Star size={12} className="fill-white" />
                  Le plus choisi par les cadres
                </span>
              </div>

              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-black mb-2 text-indigo-100">Performance</h3>
                <p className="text-indigo-200/60 text-sm h-10">Pour maximiser vos chances face aux recruteurs.</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-extrabold text-white">29€</span>
                  <span className="text-indigo-300/60 mb-2">/mois</span>
                </div>
              </div>

              <div className="mb-4 text-xs font-bold text-indigo-300 uppercase tracking-wider">Tout Essentiel +</div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Adaptation automatique à chaque offre",
                  "Comparaison entre versions de CV",
                  "Score de compétitivité avancé",
                  "Analyse stratégique des mots-clés",
                  "Priorisation intelligente des actions",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-indigo-50 font-medium">
                    <CheckCircle2 size={18} className="text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout("performance")}
                disabled={loadingPlan === "performance"}
                className="block w-full text-center py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-900/50 disabled:opacity-50">
                {loadingPlan === "performance" ? "Chargement..." : "Passer en mode Performance"}
              </button>
            </motion.div>

            {/* 🟡 39€ — Stratégique */}
            <motion.div variants={fadeUp}
              className="rounded-3xl border border-white/10 bg-white/[0.02]
                         p-8 lg:p-10 flex flex-col hover:border-white/20 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2">Stratégique</h3>
                <p className="text-white/50 text-sm h-10">Pour une approche carrière haut niveau.</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-extrabold">39€</span>
                  <span className="text-white/40 mb-2">/mois</span>
                </div>
              </div>

              <div className="mb-4 text-xs font-bold text-white/40 uppercase tracking-wider">Tout Performance +</div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Simulation multi-ATS",
                  "Benchmark marché (Top 10%)",
                  "Optimisation ciblée postes direction",
                  "Support prioritaire",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/80 font-medium">
                    <CheckCircle2 size={18} className="text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout("strategique")}
                disabled={loadingPlan === "strategique"}
                className="block w-full text-center py-4 rounded-xl border border-white/10 hover:bg-white/5 font-bold transition-colors disabled:opacity-50">
                {loadingPlan === "strategique" ? "Chargement..." : "Optimisation stratégique"}
              </button>
            </motion.div>

          </div>
          
          <motion.div variants={fadeUp} className="mt-16 max-w-xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center text-center">
              <p className="text-white/70 font-medium text-sm mb-4">
                Pas encore convaincu ? Testez gratuitement.
              </p>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
                 <li className="flex items-center gap-1.5 text-xs text-white/40"><CheckCircle2 size={14}/> 1 analyse ATS</li>
                 <li className="flex items-center gap-1.5 text-xs text-white/40"><CheckCircle2 size={14}/> Score global</li>
                 <li className="flex items-center gap-1.5 text-xs text-white/40"><XCircle size={14}/> Plan d'action</li>
              </ul>
              <Link
                href="/auth/signup"
                className="text-indigo-400 hover:text-indigo-300 font-bold text-sm underline underline-offset-4">
                Commencer gratuitement
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 4. RATIONNEL ────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <ShieldCheck className="w-12 h-12 text-indigo-400/50" />
          </motion.div>
          <motion.h2 variants={fadeUp}
            className="text-3xl font-extrabold mb-6">
            Un investissement rationnel.
          </motion.h2>
          <motion.p variants={fadeUp}
            className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Une amélioration de CV peut représenter plusieurs milliers d'euros de différence salariale sur une carrière. Investir 19 à 29€ pour maximiser vos chances de décrocher l'entretien face aux filtres algorithmiques est un choix purement stratégique.
          </motion.p>
        </motion.div>
      </section>

      {/* ── 5. FAQ ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-3xl mx-auto">
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

    </main>
  );
}
