"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Award,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarClock,
  Radar,
  Check,
  ChevronRight,
  Circle,
  FileSearch,
  FileText,
  History,
  Lightbulb,
  MessageSquare,
  Mic2,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react"

import type {
  DashboardAction,
  DashboardProps,
  DashboardTimelineEvent,
} from "@/types/dashboard"

const actionIcons: Record<string, LucideIcon> = {
  FileText,
  Search,
  MessageSquare,
  Mic: Mic2,
}

const timelineIcons: Record<
  DashboardTimelineEvent["type"],
  LucideIcon
> = {
  analysis: FileSearch,
  interview: Mic2,
  matching: Search,
  milestone: Trophy,
}

function getFirstName(name?: string) {
  const cleaned = name?.trim()

  if (!cleaned) {
    return "Utilisateur"
  }

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

function getActionIcon(action: DashboardAction) {
  return actionIcons[action.icon] ?? Sparkles
}

function ProgressRing({ value }: { value: number }) {
  const normalized = Math.max(0, Math.min(100, value))
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const dash = (normalized / 100) * circumference

  return (
    <div className="relative size-[122px]">
      <svg className="-rotate-90" viewBox="0 0 110 110" aria-hidden="true">
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-white/10"
        />

        <motion.circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-white"
          initial={{
            strokeDasharray: `0 ${circumference}`,
          }}
          animate={{
            strokeDasharray: `${dash} ${circumference}`,
          }}
          transition={{
            duration: 1.1,
            ease: "easeOut",
          }}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[29px] font-bold tracking-tight text-white">
            {Math.round(normalized)}
          </p>
          <p className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
            sur 100
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  eyebrow,
  value,
  description,
  icon: Icon,
  accent = "violet",
}: {
  eyebrow: string
  value: string
  description: string
  icon: LucideIcon
  accent?: "violet" | "emerald" | "amber" | "sky"
}) {
  const tones = {
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    sky: "bg-sky-50 text-sky-600 ring-sky-100",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-[22px] border border-white bg-white p-4 shadow-[0_12px_35px_rgba(54,44,90,0.055)] ring-1 ring-slate-100 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(54,44,90,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
            {eyebrow}
          </p>

          <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-950">
            {value}
          </p>
        </div>

        <span
          className={[
            "grid size-10 shrink-0 place-items-center rounded-2xl ring-1",
            tones[accent],
          ].join(" ")}
        >
          <Icon className="size-[18px]" />
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </motion.div>
  )
}

function SectionHeader({
  title,
  subtitle,
  href,
  action,
}: {
  title: string
  subtitle?: string
  href?: string
  action?: string
}) {
  return (
    <div className="flex items-start justify-between gap-5">
      <div>
        <h2 className="text-[15px] font-bold tracking-tight text-slate-950">
          {title}
        </h2>

        {subtitle ? (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      {href && action ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-violet-600 transition hover:text-violet-800"
        >
          {action}
          <ChevronRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  )
}

export function DashboardWidgets({
  userData,
  score,
  skills,
  career,
  recommendations,
  history,
  actions,
  progress,
  insights,
  timeline,
  opportunitySummary,
  discoverySummary,
}: DashboardProps) {
  const firstName = getFirstName(userData.firstName || userData.name)

  const interviewCount = timeline.filter(
    (event) => event.type === "interview",
  ).length

  const completedCount = timeline.filter(
    (event) => event.status === "completed",
  ).length

  const highPriorityRecommendations = recommendations.filter(
    (recommendation) => recommendation.priority === "high",
  )

  const topRecommendation =
    highPriorityRecommendations[0] ??
    recommendations[0]

  const trendPositive = score.trend === "up"

  const TrendIcon =
    score.trend === "down"
      ? TrendingDown
      : TrendingUp

  return (
    <div className="pb-10">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex flex-col gap-4 rounded-[24px] border border-white bg-white/75 px-5 py-4 shadow-[0_12px_35px_rgba(54,44,90,0.045)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-violet-500">
              Votre espace carriÃ¨re
            </p>

            <Sparkles className="size-3.5 text-violet-500" />
          </div>

          <h1 className="mt-1 text-[25px] font-bold tracking-[-0.035em] text-slate-950 sm:text-[29px]">
            Bonjour {firstName}
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Votre trajectoire professionnelle, pilotÃ©e par vos donnÃ©es.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/analyze"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <FileSearch className="size-4" />
            Analyser mon CV
          </Link>

          <Link
            href="/simulation/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-px hover:bg-slate-800"
          >
            <Mic2 className="size-4" />
            Simulation IA
          </Link>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#6d54d9] via-[#6a52d1] to-[#4636ad] p-6 text-white shadow-[0_24px_70px_rgba(93,69,191,0.22)] sm:p-7"
      >
        <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 backdrop-blur">
              <BrainCircuit className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/85">
                Trajectoire Intelligence
              </span>
            </div>

            <h2 className="mt-5 max-w-[650px] text-[28px] font-bold leading-[1.15] tracking-[-0.04em] sm:text-[34px]">
              Transformez votre potentiel en prochaine opportunité.
            </h2>

            <p className="mt-3 max-w-[660px] text-[13px] leading-6 text-white/72 sm:text-sm">
              Analysez votre profil, amÃ©liorez votre CV et entraÃ®nez-vous
              aux entretiens avec un parcours personnalisÃ© par lâ€™IA.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/simulation/new"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-violet-700 shadow-lg shadow-indigo-950/10 transition hover:-translate-y-0.5"
              >
                Commencer une simulation
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/matching"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-white/10 px-5 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15"
              >
                Explorer mes opportunitÃ©s
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-[24px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md sm:p-5">
            <ProgressRing value={score.currentScore} />

            <div className="min-w-[150px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                Score carriÃ¨re
              </p>

              <div className="mt-2 flex items-center gap-2">
                <TrendIcon
                  className={[
                    "size-4",
                    score.trend === "down"
                      ? "text-rose-200"
                      : "text-emerald-200",
                  ].join(" ")}
                />

                <span className="text-sm font-bold text-white">
                  {trendPositive
                    ? "En progression"
                    : score.trend === "down"
                      ? "Ã€ renforcer"
                      : "Stable"}
                </span>
              </div>

              <p className="mt-3 text-[11px] leading-5 text-white/60">
                Objectif recommandÃ© : atteindre 80/100 pour renforcer
                votre attractivitÃ©.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          eyebrow="Score ATS"
          value={`${score.currentScore}/100`}
          description={
            score.previousScore !== undefined
              ? `PrÃ©cÃ©dent : ${score.previousScore}/100`
              : "PremiÃ¨re rÃ©fÃ©rence enregistrÃ©e"
          }
          icon={Target}
          accent="violet"
        />

        <StatCard
          eyebrow="Analyses"
          value={String(history.length)}
          description="CV analysÃ©s rÃ©cemment"
          icon={FileSearch}
          accent="sky"
        />

        <StatCard
          eyebrow="Parcours"
          value={`${progress.percentage}%`}
          description={`${progress.completedSteps} Ã©tapes complÃ©tÃ©es sur ${progress.totalSteps}`}
          icon={BarChart3}
          accent="emerald"
        />

        <StatCard
          eyebrow="Opportunités"
          value={String(opportunitySummary.activeCount)}
          description={`${opportunitySummary.highMatchCount} match(es) fort(s)`}
          icon={BriefcaseBusiness}
          accent="amber"
        />
      </div>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
        <div className="rounded-[26px] border border-white bg-white p-5 shadow-[0_14px_42px_rgba(54,44,90,0.055)] ring-1 ring-slate-100 sm:p-6">
          <SectionHeader
            title="Career Command Center"
            subtitle="Pilotez vos meilleures opportunités depuis un seul endroit."
            href="/opportunities"
            action="Voir le pipeline"
          />

          {opportunitySummary.bestMatch ? (
            <div className="mt-5 rounded-[22px] bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5 ring-1 ring-violet-100">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-violet-600">
                    <Target className="size-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                      Meilleur match actif
                    </span>
                  </div>

                  <h3 className="mt-3 truncate text-lg font-bold tracking-tight text-slate-950">
                    {opportunitySummary.bestMatch.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {opportunitySummary.bestMatch.company ??
                      "Entreprise non renseignée"}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 ring-1 ring-slate-200">
                      {opportunitySummary.bestMatch.status}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                      {opportunitySummary.highMatchCount} match(es) fort(s)
                    </span>
                  </div>
                </div>

                <div className="shrink-0 rounded-[20px] bg-white px-5 py-4 text-center shadow-sm ring-1 ring-violet-100">
                  <p className="text-[30px] font-bold tracking-[-0.05em] text-violet-700">
                    {opportunitySummary.bestMatch.matchScore ?? "—"}
                  </p>

                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Match / 100
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/opportunities/${opportunitySummary.bestMatch.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Ouvrir l&apos;opportunité
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href={`/opportunities/${opportunitySummary.bestMatch.id}/workspace`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-violet-700 ring-1 ring-violet-200 transition hover:bg-violet-50"
                >
                  Préparer ma candidature
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-slate-200 bg-slate-50/70 p-7 text-center">
              <BriefcaseBusiness className="mx-auto size-6 text-slate-300" />

              <p className="mt-3 text-sm font-bold text-slate-900">
                Votre pipeline est prêt
              </p>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                Ajoutez une offre ou explorez le radar pour identifier votre prochaine opportunité.
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link
                  href="/opportunities/new"
                  className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white"
                >
                  Ajouter une offre
                </Link>

                <Link
                  href="/discovery"
                  className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-violet-700 ring-1 ring-violet-200"
                >
                  Explorer le radar
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <section className="rounded-[26px] border border-white bg-white p-5 shadow-[0_14px_42px_rgba(54,44,90,0.055)] ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Radar emploi
                </p>

                <p className="mt-2 text-[30px] font-bold tracking-[-0.05em] text-slate-950">
                  {discoverySummary.liveCount}
                </p>

                <p className="text-xs text-slate-500">
                  offres live détectées
                </p>
              </div>

              <span className="grid size-11 place-items-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                <Radar className="size-5" />
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
              <span className="text-xs text-slate-500">
                Sources actives
              </span>

              <span className="text-sm font-bold text-slate-950">
                {discoverySummary.sourceCount}
              </span>
            </div>

            <Link
              href="/discovery"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
            >
              Explorer le radar
              <ArrowRight className="size-4" />
            </Link>
          </section>

          <section className="rounded-[26px] bg-slate-950 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.17)]">
            <div className="flex items-center gap-2 text-violet-300">
              <CalendarClock className="size-4" />

              <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
                Prochaine action
              </p>
            </div>

            <h3 className="mt-4 text-base font-bold tracking-tight">
              {opportunitySummary.nextAction?.action ??
                "Identifier votre prochaine cible"}
            </h3>

            {opportunitySummary.nextAction ? (
              <>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {opportunitySummary.nextAction.title}
                  {opportunitySummary.nextAction.company
                    ? ` · ${opportunitySummary.nextAction.company}`
                    : ""}
                </p>

                <Link
                  href={`/opportunities/${opportunitySummary.nextAction.id}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-violet-50"
                >
                  Continuer
                  <ArrowRight className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Priorisez une opportunité et Trajectoire fera remonter votre prochaine action ici.
                </p>

                <Link
                  href="/opportunities"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-violet-50"
                >
                  Voir mes opportunités
                  <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </section>
        </div>
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.75fr)]">
        <div className="space-y-5">
          <section className="rounded-[26px] border border-white bg-white p-5 shadow-[0_14px_42px_rgba(54,44,90,0.055)] ring-1 ring-slate-100 sm:p-6">
            <SectionHeader
              title="PrioritÃ©s recommandÃ©es"
              subtitle="Les actions avec le plus fort impact sur votre progression."
              href="/analyze"
              action="Voir lâ€™analyse"
            />

            {recommendations.length > 0 ? (
              <div className="mt-5 space-y-3">
                {recommendations.slice(0, 4).map((recommendation, index) => {
                  const priority =
                    recommendation.priority === "high"

                  return (
                    <motion.div
                      key={recommendation.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + index * 0.05 }}
                      className="group flex gap-4 rounded-[20px] border border-slate-100 bg-slate-50/65 p-4 transition hover:border-violet-100 hover:bg-violet-50/45"
                    >
                      <div
                        className={[
                          "grid size-10 shrink-0 place-items-center rounded-2xl",
                          priority
                            ? "bg-violet-100 text-violet-600"
                            : "bg-white text-slate-500 ring-1 ring-slate-100",
                        ].join(" ")}
                      >
                        {priority ? (
                          <Zap className="size-4" />
                        ) : (
                          <Lightbulb className="size-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[13px] font-bold text-slate-900">
                            {recommendation.title}
                          </p>

                          {priority ? (
                            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-violet-700">
                              Prioritaire
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          {recommendation.description}
                        </p>
                      </div>

                      <div className="hidden shrink-0 text-right sm:block">
                        <p className="text-xs font-bold text-emerald-600">
                          +{recommendation.estimatedImpact}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          impact estimÃ©
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-5 grid min-h-[170px] place-items-center rounded-[22px] border border-dashed border-slate-200 bg-slate-50/60 px-5 text-center">
                <div>
                  <div className="mx-auto grid size-11 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                    <BrainCircuit className="size-5" />
                  </div>

                  <p className="mt-3 text-sm font-bold text-slate-900">
                    Vos recommandations apparaÃ®tront ici
                  </p>

                  <p className="mx-auto mt-1 max-w-[380px] text-xs leading-5 text-slate-500">
                    Analysez un CV pour obtenir des recommandations
                    personnalisÃ©es et classÃ©es par impact.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[26px] border border-white bg-white p-5 shadow-[0_14px_42px_rgba(54,44,90,0.055)] ring-1 ring-slate-100 sm:p-6">
            <SectionHeader
              title="ActivitÃ© rÃ©cente"
              subtitle="Vos derniÃ¨res analyses et simulations."
              href="/history"
              action="Historique"
            />

            {timeline.length > 0 ? (
              <div className="mt-5 divide-y divide-slate-100">
                {timeline.slice(0, 5).map((event) => {
                  const Icon = timelineIcons[event.type]

                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-slate-50 text-slate-500 ring-1 ring-slate-100">
                        <Icon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-slate-900">
                          {event.title}
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                          {event.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-400">
                          {formatDate(event.date)}
                        </p>

                        <span
                          className={[
                            "mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold",
                            event.status === "completed"
                              ? "bg-emerald-50 text-emerald-600"
                              : event.status === "in-progress"
                                ? "bg-violet-50 text-violet-600"
                                : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          {event.status === "completed"
                            ? "TerminÃ©"
                            : event.status === "in-progress"
                              ? "En cours"
                              : "Ã€ venir"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-5 grid min-h-[160px] place-items-center rounded-[22px] border border-dashed border-slate-200 bg-slate-50/60 text-center">
                <div>
                  <History className="mx-auto size-6 text-slate-300" />

                  <p className="mt-3 text-sm font-bold text-slate-900">
                    Aucune activitÃ© pour le moment
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Votre parcours commencera dÃ¨s votre premiÃ¨re action.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[26px] border border-white bg-white p-5 shadow-[0_14px_42px_rgba(54,44,90,0.055)] ring-1 ring-slate-100 sm:p-6">
            <SectionHeader
              title="CompÃ©tences clÃ©s"
              subtitle="Les compÃ©tences dÃ©tectÃ©es dans votre profil."
            />

            {skills.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {skills.slice(0, 6).map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-[18px] bg-slate-50 p-4 ring-1 ring-slate-100"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-xs font-bold text-slate-800">
                        {skill.name}
                      </p>

                      <p className="text-[10px] font-bold text-violet-600">
                        {skill.level}%
                      </p>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(
                            0,
                            Math.min(100, skill.level),
                          )}%`,
                        }}
                        transition={{ duration: 0.7 }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-[18px] bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                Vos compÃ©tences seront automatiquement dÃ©tectÃ©es aprÃ¨s
                votre premiÃ¨re analyse de CV.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[26px] border border-white bg-white p-5 shadow-[0_14px_42px_rgba(54,44,90,0.055)] ring-1 ring-slate-100">
            <SectionHeader
              title="Votre progression"
              subtitle={`${progress.completedSteps}/${progress.totalSteps} Ã©tapes`}
            />

            <div className="mt-5">
              <div className="flex items-end justify-between">
                <p className="text-[32px] font-bold tracking-[-0.05em] text-slate-950">
                  {progress.percentage}%
                </p>

                <p className="pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-500">
                  Parcours
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${progress.percentage}%`,
                  }}
                  transition={{ duration: 0.9 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                />
              </div>

              <div className="mt-5 space-y-2.5">
                {progress.steps.map((step) => (
                  <div
                    key={step.name}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={[
                        "grid size-7 place-items-center rounded-full",
                        step.completed
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-50 text-slate-300",
                      ].join(" ")}
                    >
                      {step.completed ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Circle className="size-3" />
                      )}
                    </span>

                    <span
                      className={[
                        "text-xs font-semibold",
                        step.completed
                          ? "text-slate-800"
                          : "text-slate-400",
                      ].join(" ")}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[26px] border border-white bg-white shadow-[0_14px_42px_rgba(54,44,90,0.055)] ring-1 ring-slate-100">
            <div className="p-5">
              <SectionHeader
                title="Trajectoire carriÃ¨re"
                subtitle="Votre niveau actuel et votre prochaine Ã©tape."
              />

              <div className="mt-5 rounded-[20px] bg-gradient-to-br from-violet-50 to-indigo-50 p-4 ring-1 ring-violet-100">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-white text-violet-600 shadow-sm">
                    <BriefcaseBusiness className="size-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-500">
                      Niveau actuel
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-900">
                      {career.currentLevel}
                    </p>
                  </div>
                </div>

                <div className="my-4 h-px bg-violet-100" />

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Prochain niveau
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-slate-800">
                      {career.nextLevel}
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-violet-600 shadow-sm">
                    {career.progressToNext}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[26px] bg-slate-950 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.17)]">
            <div className="flex items-center gap-2 text-violet-300">
              <Sparkles className="size-4" />

              <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
                Prochaine meilleure action
              </p>
            </div>

            <h3 className="mt-4 text-lg font-bold tracking-[-0.025em]">
              {topRecommendation?.title ??
                "Lancez votre premiÃ¨re simulation"}
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              {topRecommendation?.description ??
                "Obtenez un feedback personnalisÃ© sur vos rÃ©ponses et amÃ©liorez votre performance."}
            </p>

            <Link
              href={
                topRecommendation
                  ? "/analyze"
                  : "/simulation/new"
              }
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-violet-50"
            >
              Continuer mon parcours
              <ArrowRight className="size-4" />
            </Link>
          </section>

          <section className="rounded-[26px] border border-white bg-white p-5 shadow-[0_14px_42px_rgba(54,44,90,0.055)] ring-1 ring-slate-100">
            <SectionHeader title="Actions rapides" />

            <div className="mt-4 grid gap-2">
              {actions.slice(0, 4).map((action) => {
                const Icon = getActionIcon(action)

                return (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-[17px] border border-transparent bg-slate-50 px-3 py-3 transition hover:border-violet-100 hover:bg-violet-50"
                  >
                    <span className="grid size-8 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition group-hover:text-violet-600">
                      <Icon className="size-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">
                        {action.title}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {action.description}
                      </p>
                    </div>

                    <ChevronRight className="size-3.5 text-slate-300 transition group-hover:text-violet-500" />
                  </Link>
                )
              })}
            </div>
          </section>

          {insights.length > 0 ? (
            <section className="rounded-[26px] border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 shadow-[0_14px_42px_rgba(120,90,40,0.04)]">
              <div className="flex items-center gap-2 text-amber-600">
                <Award className="size-4" />

                <p className="text-[10px] font-bold uppercase tracking-[0.14em]">
                  Insight IA
                </p>
              </div>

              <p className="mt-3 text-sm font-bold text-slate-900">
                {insights[0].title}
              </p>

              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                {insights[0].description}
              </p>
            </section>
          ) : null}
        </aside>
      </div>

      <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
        <Link
          href="/simulation/new"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-2xl shadow-slate-950/25"
        >
          <Mic2 className="size-4" />
          Nouvelle simulation
        </Link>
      </div>
    </div>
  )
}