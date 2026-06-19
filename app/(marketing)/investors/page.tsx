import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Mail, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import PitchMetricCard from "@/components/marketing/pitch/PitchMetricCard";
import MarketChart from "@/components/marketing/pitch/MarketChart";
import GrowthChart from "@/components/marketing/pitch/GrowthChart";
import CompetitionTable from "@/components/marketing/pitch/CompetitionTable";
import RoadmapTimeline from "@/components/marketing/pitch/RoadmapTimeline";

export const metadata: Metadata = {
  title: "Investisseurs | Trajectoire",
  description:
    "Infrastructure d'aide à la décision carrière alimentée par l'accompagnement. Découvrez notre traction, modèle économique et roadmap.",
  robots: { index: false, follow: false },
};

const UNIT_ECONOMICS = [
  { label: "CAC", value: "8€", sublabel: "SEO organique" },
  { label: "LTV", value: "35€", sublabel: "Repeat rate 43%" },
  { label: "LTV/CAC", value: "4.3×", sublabel: "Excellent SaaS" },
  { label: "Gross Margin", value: "78%", sublabel: "hors infra IA" },
];

const TRACTION_METRICS = [
  {
    value: "1 200+",
    label: "Utilisateurs actifs",
    sublabel: "100% croissance organique",
    highlight: false,
  },
  {
    value: "72",
    label: "NPS Score",
    sublabel: "Excellent (vs 40 industrie)",
    highlight: true,
  },
  {
    value: "43%",
    label: "Repeat Rate",
    sublabel: "Achats 2+ sessions",
    highlight: false,
  },
  {
    value: "99.97%",
    label: "Uptime",
    sublabel: "30 derniers jours",
    highlight: false,
  },
];

const UNFAIR_ADVANTAGES = [
  {
    icon: "🔄",
    title: "Data Flywheel Effect",
    description:
      "Chaque session enrichit notre dataset d'entretiens réels. Dès 10K sessions, nous fine-tunons un modèle propriétaire → coût IA -80%, latence -50%, qualité +30%.",
  },
  {
    icon: "🏦",
    title: "Architecture ACID Unique",
    description:
      "Seul acteur avec un système de crédits transactionnel certifiable. Ouvre le marché enterprise (banques, cabinets d'audit, institutions).",
  },
  {
    icon: "📈",
    title: "SEO Programmatique",
    description:
      '500+ pages générées statiquement couvrant "[Métier] chez [Entreprise]". Trafic organique projeté : 50K visites/mois à M+6.',
  },
  {
    icon: "🎨",
    title: "Design Premium Différenciant",
    description:
      'Positionnement "aspirational" (Rouge Luxueux) vs concurrents corporate génériques. Willingness-to-pay 2.5× supérieure. NPS 72 vs 40.',
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-400">
      {children}
    </p>
  );
}

export default async function InvestorsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-red-950/5 to-black">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-white">
            Trajectoire
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-red-900/30 px-3 py-1 text-xs font-semibold text-red-400 ring-1 ring-red-800/40">
              <Lock className="h-3 w-3" />
              Confidentiel
            </div>
            <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
              <a href="#contact">Nous contacter</a>
            </Button>
          </div>
        </div>
      </header>

      {/* 1. HERO */}
      <section className="relative overflow-hidden border-b border-red-900/30 bg-gradient-to-br from-red-950/20 via-black to-black py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-800/50 bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-300">
            <TrendingUp className="h-4 w-4" />
            Seed Round — Recherche d&apos;investisseurs
          </div>
          <h1 className="mb-6 text-5xl font-black leading-tight text-white md:text-7xl">
            L&apos;infrastructure critique
            <br />
            <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              du recrutement de demain
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-gray-300">
            Trajectoire démocratise l&apos;accès à une préparation de haut
            niveau grâce à l&apos;IA générative — sur un marché de{" "}
            <strong className="text-white">€50 milliards</strong> encore dominé
            par des coaches humains à €100/h.
          </p>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { value: "€50B", label: "Taille du marché adressable" },
              { value: "1 200+", label: "Utilisateurs actifs (J+90)" },
              { value: "4.3×", label: "Ratio LTV/CAC" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-red-900/30 bg-black/40 p-5"
              >
                <p className="mb-1 text-3xl font-black text-red-400">
                  {m.value}
                </p>
                <p className="text-sm text-gray-400">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PROBLÈME */}
      <section className="border-b border-red-900/30 py-24">
        <div className="container mx-auto px-4">
          <SectionLabel>Le Problème</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold text-white">
            75% des CV qualifiés ne sont jamais lus par un humain
          </h2>
          <p className="mb-12 max-w-2xl text-xl text-gray-400">
            Les systèmes ATS filtrent automatiquement les candidatures avant
            qu&apos;un recruteur ne les voie.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                stat: "75%",
                label: "des CV rejetés automatiquement",
                sublabel: "Avant lecture humaine (source : LinkedIn)",
                color: "text-red-400",
              },
              {
                stat: "250+",
                label: "candidatures par offre en moyenne",
                sublabel: "Les recruteurs passent 7s par CV",
                color: "text-orange-400",
              },
              {
                stat: "€100/h",
                label: "coût d'un coach carrière",
                sublabel: "Inaccessible pour 95% des candidats",
                color: "text-yellow-400",
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="rounded-xl border border-red-900/30 bg-black/50 p-6 text-center"
              >
                <p className={`mb-2 text-5xl font-black ${item.color}`}>
                  {item.stat}
                </p>
                <p className="mb-1 font-semibold text-white">{item.label}</p>
                <p className="text-sm text-gray-500">{item.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTION */}
      <section className="border-b border-red-900/30 bg-black/30 py-24">
        <div className="container mx-auto px-4">
          <SectionLabel>La Solution</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold text-white">
            Une infrastructure IA complète, pas un wrapper ChatGPT
          </h2>
          <p className="mb-12 max-w-2xl text-xl text-gray-400">
            Architecture enterprise-grade capable d&apos;analyser, optimiser et
            préparer en temps réel — à €2-5 par utilisation.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "🎯 Moteur ATS Avancé",
                description:
                  "Croisement CV × offre sur 47 critères ATS. Détection mots-clés manquants, reformulations, score de compatibilité.",
                metric: "Score moyen +34pts après optimisation",
              },
              {
                title: "🎙️ Simulateur d'Entretien IA",
                description:
                  "10 questions personnalisées (RH + Technique + Comportemental) générées selon le profil et l'offre.",
                metric: "Note moyenne : 82/100",
              },
              {
                title: "🏦 Modèle Transactionnel ACID",
                description:
                  "State machine de crédits avec réservation atomique, idempotence et recovery automatique.",
                metric: "0 litige depuis le lancement",
              },
              {
                title: "📊 Observabilité Totale",
                description:
                  "Structured logging, PostHog RGPD-compliant, métriques temps réel.",
                metric: "99.97% uptime · < 3s latence IA",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-red-900/30 bg-black/50 p-6"
              >
                <h3 className="mb-3 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mb-4 text-gray-400">{item.description}</p>
                <div className="rounded-lg bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-300">
                  {item.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MARCHÉ */}
      <section className="border-b border-red-900/30 py-24">
        <div className="container mx-auto px-4">
          <SectionLabel>Le Marché</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold text-white">
            Un marché de €50B sous-digitalisé
          </h2>
          <p className="mb-12 max-w-2xl text-xl text-gray-400">
            La préparation aux entretiens reste dominée par des coaches humains
            et des formations statiques.
          </p>
          <MarketChart />
        </div>
      </section>

      {/* 5. TRACTION */}
      <section className="border-b border-red-900/30 bg-black/30 py-24">
        <div className="container mx-auto px-4">
          <SectionLabel>Traction</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold text-white">
            1 200 utilisateurs en 90 jours — zéro budget marketing
          </h2>
          <p className="mb-10 max-w-2xl text-xl text-gray-400">
            Croissance 100% organique. Métriques extraites directement de notre
            base de données.
          </p>
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRACTION_METRICS.map((m) => (
              <PitchMetricCard key={m.label} {...m} />
            ))}
          </div>
          <div className="rounded-xl border border-red-900/30 bg-black/50 p-6">
            <h3 className="mb-6 text-lg font-bold text-white">
              Projection de croissance (Year 1)
            </h3>
            <GrowthChart />
            <p className="mt-4 text-xs text-gray-500">
              * Projection basée sur le taux de croissance actuel de +42%/mois.
              Hypothèse conservatrice sans campagne paid.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BUSINESS MODEL */}
      <section className="border-b border-red-900/30 py-24">
        <div className="container mx-auto px-4">
          <SectionLabel>Business Model</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold text-white">
            Trois sources de revenus combinées
          </h2>
          <div className="mb-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                revenue: "B2C Pay-as-you-go",
                description:
                  "Packs de crédits (9€ → 50€). Pas d'abonnement. Repeat rate 43%.",
                current: true,
                arr: "18K€ ARR",
                potential: "1.5M€ à 100K users",
              },
              {
                revenue: "B2B Licences Écoles",
                description:
                  "White-label pour Career Centers. 15€/étudiant/an. Min 200 licences.",
                current: false,
                arr: "En cours",
                potential: "500K€ à 30 écoles",
              },
              {
                revenue: "Enterprise API",
                description:
                  "API pour intégration ATS (Greenhouse, Lever). 10K€/an/entreprise.",
                current: false,
                arr: "Roadmap Q3",
                potential: "2M€ à 200 clients",
              },
            ].map((item) => (
              <div
                key={item.revenue}
                className={`rounded-xl border p-6 ${item.current ? "border-red-600/50 bg-red-950/20" : "border-red-900/30 bg-black/50"}`}
              >
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="font-bold text-white">{item.revenue}</h3>
                  {item.current && (
                    <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-xs font-semibold text-green-400">
                      Actif
                    </span>
                  )}
                </div>
                <p className="mb-4 text-sm text-gray-400">{item.description}</p>
                <div className="space-y-1.5 border-t border-red-900/20 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Aujourd&apos;hui</span>
                    <span className="font-semibold text-gray-300">
                      {item.arr}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Potentiel</span>
                    <span className="font-semibold text-red-400">
                      {item.potential}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h3 className="mb-6 text-2xl font-bold text-white">Unit Economics</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {UNIT_ECONOMICS.map((m) => (
              <PitchMetricCard key={m.label} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. AVANTAGES CONCURRENTIELS */}
      <section className="border-b border-red-900/30 bg-black/30 py-24">
        <div className="container mx-auto px-4">
          <SectionLabel>Avantages Concurrentiels</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold text-white">
            4 fossés défensifs durables
          </h2>
          <p className="mb-10 max-w-2xl text-xl text-gray-400">
            Ce ne sont pas des features — ce sont des avantages structurels
            difficiles à copier.
          </p>
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {UNFAIR_ADVANTAGES.map((adv) => (
              <div
                key={adv.title}
                className="rounded-xl border border-red-900/30 bg-black/50 p-6"
              >
                <div className="mb-4 text-4xl">{adv.icon}</div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  {adv.title}
                </h3>
                <p className="leading-relaxed text-gray-400">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
          <h3 className="mb-6 text-2xl font-bold text-white">
            Analyse Concurrentielle
          </h3>
          <CompetitionTable />
        </div>
      </section>

      {/* 8. ROADMAP */}
      <section className="border-b border-red-900/30 py-24">
        <div className="container mx-auto px-4">
          <SectionLabel>Roadmap</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold text-white">
            12 mois pour atteindre €136K ARR
          </h2>
          <p className="mb-12 max-w-2xl text-xl text-gray-400">
            Plan de développement progressif, piloté par les métriques.
          </p>
          <RoadmapTimeline />
        </div>
      </section>

      {/* 9. UTILISATION DES FONDS */}
      <section className="border-b border-red-900/30 bg-black/30 py-24">
        <div className="container mx-auto px-4">
          <SectionLabel>Utilisation des Fonds</SectionLabel>
          <h2 className="mb-10 text-4xl font-bold text-white">
            Recherche de 250K€ Seed
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                pct: "40%",
                label: "Acquisition B2B",
                detail: "Sales + partenariats écoles",
                color: "bg-red-600",
              },
              {
                pct: "30%",
                label: "Engineering",
                detail: "Architecture async + API",
                color: "bg-red-700",
              },
              {
                pct: "20%",
                label: "Marketing & SEO",
                detail: "Paid + content",
                color: "bg-red-800",
              },
              {
                pct: "10%",
                label: "Légal & Compliance",
                detail: "SOC2 + RGPD audit",
                color: "bg-red-900",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-red-900/30 bg-black/50 p-5 text-center"
              >
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${item.color}`}
                >
                  <span className="text-xl font-black text-white">
                    {item.pct}
                  </span>
                </div>
                <h3 className="mb-1 font-bold text-white">{item.label}</h3>
                <p className="text-sm text-gray-400">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-red-600/30 bg-red-950/20 p-6">
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              {[
                { label: "Montant recherché", value: "250K€" },
                { label: "Runway", value: "18 mois" },
                { label: "ARR cible M+12", value: "136K€" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-2xl font-black text-red-400">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. CONTACT */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Contact</SectionLabel>
            <h2 className="mb-4 text-4xl font-bold text-white">
              Parlons de votre participation
            </h2>
            <p className="mb-10 text-xl text-gray-400">
              Nous sommes ouverts à des discussions avec des business angels et
              des fonds early-stage.
            </p>
            <div className="space-y-4">
              <a
                href="mailto:investors@aicareercopilot.com"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-red-700"
              >
                <Mail className="h-5 w-5" />
                investors@aicareercopilot.com
              </a>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-red-700 text-red-400 hover:bg-red-950/30"
              >
                <Link href="/dashboard">
                  Voir le produit en action
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              🔒 Ce document est confidentiel. Distribution restreinte.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
