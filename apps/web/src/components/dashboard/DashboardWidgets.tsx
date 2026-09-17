"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CircleDot,
  FileSearch,
  FileText,
  History,
  Mic2,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Code,
  Globe,
} from "lucide-react"

import type {
  DashboardProps,
  DashboardTimelineEvent,
  DashboardSkill,
} from "@/types/dashboard"
import { Button } from "@/components/ui/button"

const timelineIcons: Record<DashboardTimelineEvent["type"], any> = {
  analysis: FileSearch,
  interview: Mic2,
  matching: Radar,
  milestone: Target,
}

function getFirstName(name?: string) {
  const cleaned = name?.trim()
  if (!cleaned) return "Utilisateur"
  return cleaned.split(/\s+/)[0]
}

function formatDate(date: Date) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(new Date(date))
  } catch {
    return ""
  }
}

export function DashboardWidgets({
  userData,
  score,
  skills = [],
  recommendations = [],
  timeline = [],
  opportunitySummary,
  discoverySummary,
  stats,
}: DashboardProps) {
  const firstName = getFirstName(userData.firstName || userData.name)
  const topRecommendation =
    recommendations.find((r) => r.priority === "high") ?? recommendations[0]

  const totalAnalyses = stats?.analysesCount ?? (score.currentScore > 0 ? 1 : 0)
  const totalSimulations = stats?.simulationsCount ?? 0
  const hasCVAnalysis = totalAnalyses > 0 || score.currentScore > 0

  return (
    <div className="w-full space-y-8 pb-12">
      {/* 1. HEADER PRODUIT COMPACT & SANS-SERIF */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6"
      >
        <div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Bonjour {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Voici où vous en êtes dans votre préparation et vos prochaines étapes.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link href="/analyze">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border/80 hover:border-primary-300 hover:bg-primary-50/50"
            >
              <FileText className="size-4 text-primary-600" />
              Analyser un CV
            </Button>
          </Link>
          <Link href="/simulation/new">
            <Button variant="primary" size="sm" className="gap-2 shadow-sm">
              <Mic2 className="size-4" />
              Nouvel entretien IA
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* 2. METRIC CARDS — 4 COLONNES HARMONIEUSES */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Card 1: Score ATS */}
        <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-primary-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground-muted">
              Score ATS
            </span>
            <div className="grid size-9 place-items-center rounded-lg border border-primary-100/80 bg-primary-50 text-primary-600 transition-transform duration-200 group-hover:scale-105">
              <Target className="size-4.5" strokeWidth={1.75} />
            </div>
          </div>

          <div className="mt-3">
            {hasCVAnalysis ? (
              <div className="flex items-baseline gap-1">
                <span className="font-sans text-3xl font-bold text-foreground">
                  {score.currentScore}
                </span>
                <span className="text-sm font-semibold text-foreground-muted">
                  /100
                </span>
              </div>
            ) : (
              <span className="font-sans text-lg font-semibold text-foreground">
                Non analysé
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-foreground-muted">
            {hasCVAnalysis ? (
              score.previousScore !== undefined ? (
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                  <TrendingUp className="size-3.5" />
                  {score.currentScore >= score.previousScore ? "+" : ""}
                  {score.currentScore - score.previousScore} pts vs avant
                </span>
              ) : (
                <span>Diagnostic de référence</span>
              )
            ) : (
              <Link
                href="/analyze"
                className="font-medium text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1"
              >
                Lancer l'audit ATS <ArrowRight className="size-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Card 2: Opportunités cibles */}
        <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-sky-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground-muted">
              Opportunités suivies
            </span>
            <div className="grid size-9 place-items-center rounded-lg border border-sky-100/80 bg-sky-50 text-sky-600 transition-transform duration-200 group-hover:scale-105">
              <BriefcaseBusiness className="size-4.5" strokeWidth={1.75} />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-3xl font-bold text-foreground">
                {opportunitySummary.activeCount}
              </span>
              <span className="text-xs font-medium text-foreground-muted">
                en cours
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-foreground-muted">
            {opportunitySummary.highMatchCount > 0 ? (
              <span className="font-medium text-sky-700">
                {opportunitySummary.highMatchCount} à fort matching (≥75%)
              </span>
            ) : opportunitySummary.activeCount > 0 ? (
              <span>Candidatures dans le pipeline</span>
            ) : (
              <Link
                href="/opportunities"
                className="font-medium text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1"
              >
                Ajouter une offre <ArrowRight className="size-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Card 3: Simulations d'entretien */}
        <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-emerald-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground-muted">
              Simulations d'entretien
            </span>
            <div className="grid size-9 place-items-center rounded-lg border border-emerald-100/80 bg-emerald-50 text-emerald-600 transition-transform duration-200 group-hover:scale-105">
              <Mic2 className="size-4.5" strokeWidth={1.75} />
            </div>
          </div>

          <div className="mt-3">
            {totalSimulations > 0 ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans text-3xl font-bold text-foreground">
                  {totalSimulations}
                </span>
                <span className="text-xs font-medium text-foreground-muted">
                  réalisée{totalSimulations > 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <span className="font-sans text-lg font-semibold text-foreground">
                À démarrer
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-foreground-muted">
            {totalSimulations > 0 ? (
              <span className="font-medium text-emerald-700">
                Entraînements vocaux IA
              </span>
            ) : (
              <Link
                href="/simulation/new"
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                Tester ma première réponse <ArrowRight className="size-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Card 4: Radar de marché */}
        <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-amber-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground-muted">
              Radar de marché
            </span>
            <div className="grid size-9 place-items-center rounded-lg border border-amber-100/80 bg-amber-50 text-amber-600 transition-transform duration-200 group-hover:scale-105">
              <Radar className="size-4.5" strokeWidth={1.75} />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-3xl font-bold text-foreground">
                {discoverySummary.liveCount}
              </span>
              <span className="text-xs font-medium text-foreground-muted">
                offres détectées
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-foreground-muted">
            <span>
              {discoverySummary.sourceCount} source{discoverySummary.sourceCount > 1 ? "s" : ""} active{discoverySummary.sourceCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </motion.section>

      {/* 3 & 4. GRILLE CENTRALE : NEXT BEST ACTION (2/3) & VOTRE PROGRESSION (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* COLONNE GAUCHE (7-8 colonnes) : NEXT BEST ACTION */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 xl:col-span-8 space-y-6"
        >
          {/* HERO LUMINEUX TRAJECTOIRE */}
          <div className="relative overflow-hidden rounded-xl border border-primary-200/80 bg-gradient-to-br from-primary-50/50 via-white to-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-primary-300 hover:shadow-md group">
            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-200/60 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-700 shadow-sm backdrop-blur-sm">
                  <Sparkles className="size-3.5 text-primary-600" />
                  <span>
                    {opportunitySummary.nextAction
                      ? "PROCHAINE ÉTAPE STRATÉGIQUE"
                      : topRecommendation
                      ? "RECOMMANDATION PRIORITAIRE"
                      : "DÉMARRAGE RECOMMANDÉ"}
                  </span>
                </div>

                <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {opportunitySummary.nextAction
                    ? opportunitySummary.nextAction.action
                    : topRecommendation
                    ? topRecommendation.title
                    : "Analysez votre CV pour évaluer votre compatibilité ATS"}
                </h2>

                <p className="max-w-2xl text-sm leading-relaxed text-foreground-muted">
                  {opportunitySummary.nextAction ? (
                    <>
                      Pour le poste{" "}
                      <span className="font-medium text-foreground">
                        {opportunitySummary.nextAction.title}
                      </span>
                      {opportunitySummary.nextAction.company ? (
                        <>
                          {" "}
                          chez{" "}
                          <span className="font-medium text-foreground">
                            {opportunitySummary.nextAction.company}
                          </span>
                        </>
                      ) : null}
                      . Préparez vos arguments ciblés dans le workspace dédié.
                    </>
                  ) : topRecommendation ? (
                    topRecommendation.description
                  ) : (
                    "Importez votre CV et une annonce pour obtenir un audit ATS instantané, détecter les compétences manquantes et optimiser vos chances d'entretien."
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={
                    opportunitySummary.nextAction
                      ? `/opportunities/${opportunitySummary.nextAction.id}/workspace`
                      : topRecommendation
                      ? "/analyze"
                      : "/analyze"
                  }
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="gap-2 shadow-sm font-semibold"
                  >
                    {opportunitySummary.nextAction
                      ? "Ouvrir le workspace de l'offre"
                      : topRecommendation
                      ? "Mettre en œuvre l'action"
                      : "Lancer mon analyse CV"}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>

                {opportunitySummary.nextAction && (
                  <Link href="/opportunities">
                    <Button variant="ghost" size="md" className="text-xs text-foreground-muted hover:text-foreground">
                      Voir toutes les opportunités
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 5. ACTIVITÉ RÉCENTE ÉPURÉE */}
          <div className="rounded-xl border border-border/80 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <h3 className="font-sans text-base font-bold text-foreground">
                  Activité récente
                </h3>
                <p className="text-xs text-foreground-muted mt-0.5">
                  Vos dernières analyses et simulations enregistrées
                </p>
              </div>
              <Link
                href="/history"
                className="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700 hover:underline inline-flex items-center gap-1"
              >
                Voir l'historique complet <ArrowRight className="size-3" />
              </Link>
            </div>

            {timeline.length > 0 ? (
              <div className="divide-y divide-border/50">
                {timeline.slice(0, 4).map((event) => {
                  const Icon = timelineIcons[event.type] || History

                  const iconColor =
                    event.type === "interview"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : event.type === "analysis"
                      ? "bg-primary-50 text-primary-600 border-primary-100"
                      : "bg-sky-50 text-sky-600 border-sky-100"

                  return (
                    <div
                      key={event.id}
                      className="group flex items-center justify-between p-4 sm:p-5 transition-colors hover:bg-surface-muted/30"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`grid size-9 shrink-0 place-items-center rounded-lg border ${iconColor}`}
                        >
                          <Icon className="size-4" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-foreground-muted truncate mt-0.5">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 pl-4">
                        <span className="text-xs font-medium text-foreground-muted hidden sm:inline">
                          {formatDate(event.date)}
                        </span>
                        <div>
                          {event.status === "completed" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                              <CircleDot className="size-2 fill-current" /> Terminé
                            </span>
                          ) : event.status === "in-progress" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-700 border border-primary-100">
                              <CircleDot className="size-2 fill-current" /> En cours
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted border border-border/60">
                              <CircleDot className="size-2" /> Planifié
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-[140px] flex-col items-center justify-center p-6 text-center">
                <CalendarClock className="size-8 text-foreground-muted/50 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Aucune activité récente
                </p>
                <p className="text-xs text-foreground-muted mt-1 max-w-sm">
                  Vos analyses ATS et simulations d'entretien apparaîtront ici dès que vous les aurez lancées.
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* COLONNE DROITE (4-5 colonnes) : VOTRE PROGRESSION */}
        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-5 xl:col-span-4 space-y-6"
        >
          <div className="rounded-xl border border-border/80 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h3 className="font-sans text-base font-bold text-foreground">
                  Votre progression
                </h3>
                <p className="text-xs text-foreground-muted mt-0.5">
                  État actuel de votre dossier
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  score.currentScore >= 75
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : score.currentScore > 0
                    ? "bg-primary-50 text-primary-700 border border-primary-100"
                    : "bg-surface-muted text-foreground-muted border border-border/60"
                }`}
              >
                {score.currentScore >= 75
                  ? "Profil solide"
                  : score.currentScore > 0
                  ? "En optimisation"
                  : "À initialiser"}
              </span>
            </div>

            {/* Block ATS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">Optimisation ATS du CV</span>
                <span className="font-bold text-foreground">
                  {hasCVAnalysis ? `${score.currentScore}%` : "0%"}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    score.currentScore >= 75
                      ? "bg-emerald-500"
                      : score.currentScore >= 50
                      ? "bg-primary-600"
                      : "bg-primary-500"
                  }`}
                  style={{ width: `${score.currentScore}%` }}
                />
              </div>
              <p className="text-[11px] text-foreground-muted">
                {score.currentScore >= 75
                  ? "Score élevé : profil prêt pour les candidatures directes."
                  : score.currentScore > 0
                  ? "Recommandations disponibles pour augmenter votre score."
                  : "Analysez un CV pour générer votre premier diagnostic."}
              </p>
            </div>

            {/* Block Pipeline Opportunités */}
            <div className="space-y-2 border-t border-border/50 pt-4">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">Pipeline d'opportunités</span>
                <Link
                  href="/opportunities"
                  className="font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-0.5"
                >
                  Voir <ArrowUpRight className="size-3" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-surface-muted/60 p-2 border border-border/50">
                  <span className="block text-sm font-bold text-foreground">
                    {opportunitySummary.pipeline.toApply}
                  </span>
                  <span className="text-[10px] text-foreground-muted">
                    À postuler
                  </span>
                </div>
                <div className="rounded-lg bg-surface-muted/60 p-2 border border-border/50">
                  <span className="block text-sm font-bold text-foreground">
                    {opportunitySummary.pipeline.interview}
                  </span>
                  <span className="text-[10px] text-foreground-muted">
                    Entretien
                  </span>
                </div>
                <div className="rounded-lg bg-surface-muted/60 p-2 border border-border/50">
                  <span className="block text-sm font-bold text-foreground">
                    {opportunitySummary.pipeline.offer}
                  </span>
                  <span className="text-[10px] text-foreground-muted">
                    Offre
                  </span>
                </div>
              </div>
            </div>

            {/* Block Compétences Normalisées */}
            <div className="space-y-2.5 border-t border-border/50 pt-4">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">Compétences identifiées</span>
                {skills.length > 4 && (
                  <span className="text-[11px] text-foreground-muted">
                    +{skills.length - 4} autres
                  </span>
                )}
              </div>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.slice(0, 4).map((skill) => {
                    const pillColor =
                      skill.category === "technical"
                        ? "bg-primary-50/80 text-primary-700 border-primary-100"
                        : skill.category === "soft"
                        ? "bg-emerald-50/80 text-emerald-700 border-emerald-100"
                        : "bg-sky-50/80 text-sky-700 border-sky-100"

                    const Icon =
                      skill.category === "technical"
                        ? Code
                        : skill.category === "soft"
                        ? Users
                        : Globe

                    return (
                      <span
                        key={skill.name}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium border ${pillColor}`}
                      >
                        <Icon className="size-3 shrink-0" />
                        <span className="truncate max-w-[130px]">
                          {skill.name}
                        </span>
                      </span>
                    )
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-foreground-muted">
                  Vos compétences clés apparaîtront ici après analyse de votre CV.
                </p>
              )}
            </div>
          </div>
        </motion.aside>
      </div>

      {/* 6. QUICK ACTIONS : 3 COLONNES INTERACTIVES */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 pt-2"
      >
        <h3 className="font-sans text-base font-bold text-foreground">
          Continuer votre préparation
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Action 1 */}
          <Link href="/analyze" className="group block">
            <div className="h-full rounded-xl border border-border/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-primary-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="grid size-9 place-items-center rounded-lg border border-primary-100 bg-primary-50 text-primary-600 transition-transform duration-200 group-hover:scale-105">
                  <FileText className="size-4.5" strokeWidth={1.75} />
                </div>
                <ArrowUpRight className="size-4 text-foreground-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-600" />
              </div>

              <div className="mt-4">
                <h4 className="font-sans text-sm font-bold text-foreground group-hover:text-primary-600 transition-colors">
                  Analyser un CV
                </h4>
                <p className="mt-1 text-xs text-foreground-muted leading-relaxed">
                  Diagnostic de compatibilité ATS et recommandations concrètes par rapport à une annonce cible.
                </p>
              </div>
            </div>
          </Link>

          {/* Action 2 */}
          <Link href="/simulation/new" className="group block">
            <div className="h-full rounded-xl border border-border/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="grid size-9 place-items-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 transition-transform duration-200 group-hover:scale-105">
                  <Mic2 className="size-4.5" strokeWidth={1.75} />
                </div>
                <ArrowUpRight className="size-4 text-foreground-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600" />
              </div>

              <div className="mt-4">
                <h4 className="font-sans text-sm font-bold text-foreground group-hover:text-emerald-700 transition-colors">
                  Préparer un entretien
                </h4>
                <p className="mt-1 text-xs text-foreground-muted leading-relaxed">
                  Simulation vocale IA avec questions de recruteurs ciblées et debriefing personnalisé immédiat.
                </p>
              </div>
            </div>
          </Link>

          {/* Action 3 */}
          <Link href="/opportunities" className="group block">
            <div className="h-full rounded-xl border border-border/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-sky-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="grid size-9 place-items-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600 transition-transform duration-200 group-hover:scale-105">
                  <BriefcaseBusiness className="size-4.5" strokeWidth={1.75} />
                </div>
                <ArrowUpRight className="size-4 text-foreground-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-600" />
              </div>

              <div className="mt-4">
                <h4 className="font-sans text-sm font-bold text-foreground group-hover:text-sky-700 transition-colors">
                  Gérer mes opportunités
                </h4>
                <p className="mt-1 text-xs text-foreground-muted leading-relaxed">
                  Suivez votre pipeline de candidatures, relances et étapes de recrutement en un seul endroit.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
