"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionTemplate,
  useMotionValue,
  type Variants,
} from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  Code,
  FileSearch,
  FileText,
  Globe,
  History,
  Mic2,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

import type {
  DashboardProps,
  DashboardTimelineEvent,
} from "@/types/dashboard"

/* -------------------------------------------------------------------------- */
/*  Design tokens (dark / Raycast–Linear)                                      */
/*  bg zinc-950 · primary indigo-500 · texte white/80                          */
/*  Hiérarchie : white/80 (principal) › white/50 (secondaire) › white/35 (meta)*/
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

const timelineIcons: Record<DashboardTimelineEvent["type"], LucideIcon> = {
  analysis: FileSearch,
  interview: Mic2,
  matching: Radar,
  milestone: Target,
}

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"

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

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

/** Nombre qui compte de 0 à `value` quand il entre dans le viewport. */
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}

/** Carte avec halo indigo qui suit le curseur (effet « spotlight »). */
function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgba(31,42,55,0.14), transparent 70%)`

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - rect.left)
        y.set(e.clientY - rect.top)
      }}
      onMouseLeave={() => {
        x.set(-200)
        y.set(-200)
      }}
      className={`group relative overflow-hidden rounded-xl bg-calm-accent-wash ring-1 ring-calm-line transition-colors duration-200 hover:bg-calm-accent-wash hover:ring-calm-line ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="grid size-9 place-items-center rounded-lg bg-calm-accent-soft text-calm-accent ring-1 ring-inset ring-calm-accent-line transition-transform duration-200 group-hover:scale-105">
      <Icon className="size-4" strokeWidth={1.75} />
    </div>
  )
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl bg-calm-accent-wash ring-1 ring-calm-line">
      <header className="flex items-center justify-between gap-4 border-b border-calm-line px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-calm-ink">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-calm-tertiary">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}

function TextLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-md text-xs font-medium text-calm-accent transition-colors hover:text-calm-accent ${focusRing}`}
    >
      {children}
    </Link>
  )
}

/** Anneau de progression animé (score ATS). */
function ScoreRing({ value }: { value: number }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })
  const clamped = Math.max(0, Math.min(100, value))
  const radius = 34
  const circumference = 2 * Math.PI * radius

  return (
    <svg
      ref={ref}
      viewBox="0 0 84 84"
      className="size-20 shrink-0 -rotate-90"
      role="img"
      aria-label={`Score ATS ${clamped} sur 100`}
    >
      <circle
        cx="42"
        cy="42"
        r={radius}
        fill="none"
        strokeWidth="6"
        className="stroke-calm-tertiary"
      />
      <motion.circle
        cx="42"
        cy="42"
        r={radius}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        className="stroke-calm-accent"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{
          strokeDashoffset: inView
            ? circumference * (1 - clamped / 100)
            : circumference,
        }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

const pipelineStages = [
  { key: "discovered", label: "Découvertes" },
  { key: "toAnalyze", label: "À analyser" },
  { key: "toApply", label: "À postuler" },
  { key: "applied", label: "Postulées" },
  { key: "interview", label: "Entretien" },
  { key: "offer", label: "Offre" },
] as const

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
  const topRecommendation = recommendations[0]

  const totalAnalyses = stats?.analysesCount ?? (score.currentScore !== null ? 1 : 0)
  const totalSimulations = stats?.simulationsCount ?? 0
  // Un score n'existe que s'il a été enregistré : jamais de 0 par défaut.
  const hasCVAnalysis = score.currentScore !== null
  const currentScore = score.currentScore ?? 0

  const nextAction = opportunitySummary.nextAction
  const pipelineMax = Math.max(
    1,
    ...pipelineStages.map((s) => opportunitySummary.pipeline[s.key]),
  )

  const heroLabel = nextAction
    ? "Prochaine étape stratégique"
    : topRecommendation
      ? "Recommandation prioritaire"
      : "Démarrage recommandé"

  const heroTitle = nextAction
    ? nextAction.action
    : topRecommendation
      ? topRecommendation.title
      : "Analysez votre CV pour évaluer votre compatibilité ATS"

  const heroHref = nextAction
    ? `/opportunities/${nextAction.id}/workspace`
    : "/analyze"

  const heroCta = nextAction
    ? "Ouvrir le workspace de l'offre"
    : topRecommendation
      ? "Mettre en œuvre l'action"
      : "Lancer mon analyse CV"

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-[calc(100dvh-4rem)] text-calm-ink">
        {/* Halo d'ambiance (le fond zinc-950 vient du layout (app)) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-8 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(31,42,55,0.16),transparent_70%)]"
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-[1200px] space-y-8"
        >
          {/* Header */}
          <motion.header
            variants={item}
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-calm-accent-wash px-2.5 py-1 text-[11px] font-medium text-calm-secondary ring-1 ring-calm-line">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-calm-accent-soft motion-reduce:animate-none" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-calm-accent" />
                </span>
                Career Command Center
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-calm-ink sm:text-3xl">
                Bonjour {firstName}
              </h1>
              <p className="mt-1.5 max-w-xl text-sm text-calm-secondary">
                Voici où vous en êtes dans votre préparation et vos prochaines
                étapes.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              <Link
                href="/analyze"
                className={`inline-flex h-9 items-center gap-2 rounded-lg bg-calm-accent-wash px-3.5 text-sm font-medium text-calm-ink ring-1 ring-calm-line transition-colors hover:bg-calm-accent-wash hover:ring-calm-accent-line ${focusRing}`}
              >
                <FileText className="size-4 text-calm-secondary" />
                Analyser un CV
              </Link>
              <Link
                href="/simulation/new"
                className={`inline-flex h-9 items-center gap-2 rounded-lg bg-calm-accent px-3.5 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(241,247,243,0.08)_inset,0_8px_24px_-8px_rgba(31,42,55,0.6)] transition-colors hover:bg-calm-accent-deep ${focusRing}`}
              >
                <Mic2 className="size-4" />
                Nouvel entretien IA
              </Link>
            </div>
          </motion.header>

          {/* Metrics */}
          <motion.section
            variants={item}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Score ATS */}
            <SpotlightCard className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-calm-secondary">
                  Score ATS
                </span>
                <IconTile icon={Target} />
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                {hasCVAnalysis ? (
                  <>
                    <span className="text-3xl font-semibold tracking-tight text-calm-ink">
                      <AnimatedNumber value={currentScore} />
                    </span>
                    <span className="text-sm text-calm-tertiary">/100</span>
                  </>
                ) : (
                  <span className="text-lg font-medium text-calm-ink">
                    {totalAnalyses > 0 ? "Score indisponible" : "Non analysé"}
                  </span>
                )}
              </div>
              <div className="mt-2.5 text-xs text-calm-secondary">
                {hasCVAnalysis ? (
                  score.previousScore !== undefined ? (
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        currentScore >= score.previousScore
                          ? "text-calm-accent"
                          : "text-calm-warn"
                      }`}
                    >
                      <TrendingUp
                        className={`size-3.5 ${
                          currentScore < score.previousScore
                            ? "-scale-y-100"
                            : ""
                        }`}
                      />
                      {currentScore >= score.previousScore ? "+" : ""}
                      {currentScore - score.previousScore} pts vs avant
                    </span>
                  ) : (
                    "Diagnostic de référence"
                  )
                ) : (
                  <TextLink href="/analyze">
                    Lancer l&apos;audit ATS <ArrowRight className="size-3" />
                  </TextLink>
                )}
              </div>
            </SpotlightCard>

            {/* Opportunités */}
            <SpotlightCard className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-calm-secondary">
                  Opportunités suivies
                </span>
                <IconTile icon={BriefcaseBusiness} />
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight text-calm-ink">
                  <AnimatedNumber value={opportunitySummary.activeCount} />
                </span>
                <span className="text-xs text-calm-tertiary">en cours</span>
              </div>
              <div className="mt-2.5 text-xs text-calm-secondary">
                {opportunitySummary.highMatchCount > 0 ? (
                  <span className="font-medium text-calm-accent">
                    {opportunitySummary.highMatchCount} à fort matching (≥75%)
                  </span>
                ) : opportunitySummary.activeCount > 0 ? (
                  "Candidatures dans le pipeline"
                ) : (
                  <TextLink href="/opportunities">
                    Ajouter une offre <ArrowRight className="size-3" />
                  </TextLink>
                )}
              </div>
            </SpotlightCard>

            {/* Simulations */}
            <SpotlightCard className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-calm-secondary">
                  Simulations d&apos;entretien
                </span>
                <IconTile icon={Mic2} />
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                {totalSimulations > 0 ? (
                  <>
                    <span className="text-3xl font-semibold tracking-tight text-calm-ink">
                      <AnimatedNumber value={totalSimulations} />
                    </span>
                    <span className="text-xs text-calm-tertiary">
                      réalisée{totalSimulations > 1 ? "s" : ""}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-medium text-calm-ink">
                    À démarrer
                  </span>
                )}
              </div>
              <div className="mt-2.5 text-xs text-calm-secondary">
                {totalSimulations > 0 ? (
                  "Entraînements vocaux IA"
                ) : (
                  <TextLink href="/simulation/new">
                    Tester ma première réponse{" "}
                    <ArrowRight className="size-3" />
                  </TextLink>
                )}
              </div>
            </SpotlightCard>

            {/* Radar */}
            <SpotlightCard className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-calm-secondary">
                  Radar de marché
                </span>
                <IconTile icon={Radar} />
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight text-calm-ink">
                  <AnimatedNumber value={discoverySummary.liveCount} />
                </span>
                <span className="text-xs text-calm-tertiary">offres détectées</span>
              </div>
              <div className="mt-2.5 text-xs text-calm-secondary">
                {discoverySummary.sourceCount} source
                {discoverySummary.sourceCount > 1 ? "s" : ""} active
                {discoverySummary.sourceCount > 1 ? "s" : ""}
              </div>
            </SpotlightCard>
          </motion.section>

          {/* Main grid */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <motion.div
              variants={item}
              className="space-y-6 lg:col-span-7 xl:col-span-8"
            >
              {/* Hero next best action */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-calm-accent-soft via-calm-accent-soft to-transparent p-6 ring-1 ring-calm-accent-line sm:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-calm-accent-soft blur-3xl transition-opacity duration-500 group-hover:opacity-80"
                />
                <div className="relative flex flex-col gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-calm-accent-soft px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-calm-accent ring-1 ring-inset ring-calm-accent-line">
                      <Sparkles className="size-3.5" />
                      {heroLabel}
                    </div>

                    <h2 className="text-xl font-semibold tracking-tight text-calm-ink sm:text-2xl">
                      {heroTitle}
                    </h2>

                    <p className="max-w-2xl text-sm leading-relaxed text-calm-secondary">
                      {nextAction ? (
                        <>
                          Pour le poste{" "}
                          <span className="font-medium text-calm-ink">
                            {nextAction.title}
                          </span>
                          {nextAction.company ? (
                            <>
                              {" "}
                              chez{" "}
                              <span className="font-medium text-calm-ink">
                                {nextAction.company}
                              </span>
                            </>
                          ) : null}
                          . Préparez vos arguments ciblés dans le workspace
                          dédié.
                        </>
                      ) : topRecommendation ? (
                        topRecommendation.description
                      ) : (
                        "Importez votre CV et une annonce pour obtenir un audit ATS instantané, détecter les compétences manquantes et optimiser vos chances d'entretien."
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={heroHref}
                      className={`inline-flex h-10 items-center gap-2 rounded-lg bg-calm-accent px-4 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(241,247,243,0.08)_inset,0_10px_30px_-10px_rgba(31,42,55,0.7)] transition-colors hover:bg-calm-accent-deep ${focusRing}`}
                    >
                      {heroCta}
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>

                    {nextAction ? (
                      <Link
                        href="/opportunities"
                        className={`inline-flex h-10 items-center rounded-lg px-3 text-xs font-medium text-calm-secondary transition-colors hover:bg-calm-accent-wash hover:text-calm-ink ${focusRing}`}
                      >
                        Voir toutes les opportunités
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Activity */}
              <Panel
                title="Activité récente"
                subtitle="Vos dernières analyses et simulations enregistrées"
                action={
                  <TextLink href="/history">
                    Historique complet <ArrowRight className="size-3" />
                  </TextLink>
                }
              >
                {timeline.length > 0 ? (
                  <ul className="divide-y divide-calm-line">
                    {timeline.slice(0, 4).map((event) => {
                      const Icon = timelineIcons[event.type] ?? History

                      return (
                        <li
                          key={event.id}
                          className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-calm-accent-wash"
                        >
                          <div className="flex min-w-0 items-center gap-3.5">
                            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-calm-accent-wash text-calm-secondary ring-1 ring-inset ring-calm-line transition-colors group-hover:text-calm-accent">
                              <Icon className="size-4" strokeWidth={1.75} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-calm-ink">
                                {event.title}
                              </p>
                              {event.description && (
                                <p className="mt-0.5 truncate text-xs text-calm-tertiary">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <span className="hidden text-xs tabular-nums text-calm-tertiary sm:inline">
                              {formatDate(event.date)}
                            </span>
                            {event.status === "completed" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-calm-accent-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-calm-accent ring-1 ring-inset ring-calm-accent-line">
                                <span className="size-1.5 rounded-full bg-calm-accent" />
                                Terminé
                              </span>
                            ) : event.status === "in-progress" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-calm-accent-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-calm-accent ring-1 ring-inset ring-calm-accent-line">
                                <span className="size-1.5 rounded-full bg-calm-accent" />
                                En cours
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-calm-accent-wash px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-calm-secondary ring-1 ring-inset ring-calm-line">
                                <span className="size-1.5 rounded-full bg-calm-accent-line" />
                                Planifié
                              </span>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="flex min-h-[150px] flex-col items-center justify-center px-6 py-8 text-center">
                    <CalendarClock className="mb-2 size-7 text-calm-tertiary" />
                    <p className="text-sm font-medium text-calm-ink">
                      Aucune activité récente
                    </p>
                    <p className="mt-1 max-w-sm text-xs text-calm-tertiary">
                      Vos analyses ATS et simulations d&apos;entretien
                      apparaîtront ici dès que vous les aurez lancées.
                    </p>
                  </div>
                )}
              </Panel>
            </motion.div>

            {/* Progression */}
            <motion.aside
              variants={item}
              className="lg:col-span-5 xl:col-span-4"
            >
              <Panel
                title="Votre progression"
                subtitle="État actuel de votre dossier"
                action={
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                      currentScore >= 75
                        ? "bg-calm-accent-soft text-calm-accent ring-calm-accent-line"
                        : hasCVAnalysis
                          ? "bg-calm-accent-soft text-calm-accent ring-calm-accent-line"
                          : "bg-calm-accent-wash text-calm-secondary ring-calm-line"
                    }`}
                  >
                    {currentScore >= 75
                      ? "Profil solide"
                      : hasCVAnalysis
                        ? "En optimisation"
                        : "À initialiser"}
                  </span>
                }
              >
                <div className="space-y-5 p-5">
                  {/* ATS */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <ScoreRing value={hasCVAnalysis ? currentScore : 0} />
                      <span className="absolute inset-0 grid place-items-center text-sm font-semibold tabular-nums text-calm-ink">
                        {hasCVAnalysis ? `${currentScore}%` : "—"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-calm-ink">
                        Optimisation ATS du CV
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-calm-tertiary">
                        {currentScore >= 75
                          ? "Score élevé : profil prêt pour les candidatures directes."
                          : hasCVAnalysis
                            ? "Recommandations disponibles pour augmenter votre score."
                            : "Analysez un CV pour générer votre premier diagnostic."}
                      </p>
                    </div>
                  </div>

                  {/* Pipeline */}
                  <div className="space-y-3 border-t border-calm-line pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-calm-ink">
                        Pipeline d&apos;opportunités
                      </span>
                      <TextLink href="/opportunities">
                        Voir <ArrowUpRight className="size-3" />
                      </TextLink>
                    </div>

                    <ul className="space-y-2">
                      {pipelineStages.map((stage, index) => {
                        const count = opportunitySummary.pipeline[stage.key]
                        return (
                          <li
                            key={stage.key}
                            className="flex items-center gap-3 text-xs"
                          >
                            <span className="w-20 shrink-0 text-calm-secondary">
                              {stage.label}
                            </span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-calm-accent-wash">
                              <motion.div
                                className="h-full rounded-full bg-calm-accent"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(count / pipelineMax) * 100}%`,
                                }}
                                transition={{
                                  duration: 0.7,
                                  ease: EASE,
                                  delay: 0.3 + index * 0.05,
                                }}
                              />
                            </div>
                            <span className="w-5 shrink-0 text-right font-medium tabular-nums text-calm-ink">
                              {count}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3 border-t border-calm-line pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-calm-ink">
                        Compétences identifiées
                      </span>
                      {skills.length > 4 ? (
                        <span className="text-[11px] text-calm-tertiary">
                          +{skills.length - 4} autres
                        </span>
                      ) : null}
                    </div>

                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 4).map((skill) => {
                          const Icon =
                            skill.category === "technical"
                              ? Code
                              : skill.category === "soft"
                                ? Users
                                : skill.category === "language"
                                  ? Globe
                                  : null

                          return (
                            <span
                              key={skill.name}
                              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                skill.category === "technical"
                                  ? "bg-calm-accent-soft text-calm-accent ring-calm-accent-line"
                                  : "bg-calm-accent-wash text-calm-secondary ring-calm-line"
                              }`}
                            >
                              {Icon && <Icon className="size-3 shrink-0" />}
                              <span className="max-w-[130px] truncate">
                                {skill.name}
                              </span>
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-calm-tertiary">
                        Vos compétences clés apparaîtront ici après analyse de
                        votre CV.
                      </p>
                    )}
                  </div>
                </div>
              </Panel>
            </motion.aside>
          </div>

          {/* Quick actions */}
          <motion.section variants={item} className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight text-calm-ink">
              Continuer votre préparation
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                {
                  href: "/analyze",
                  icon: FileText,
                  title: "Analyser un CV",
                  text: "Diagnostic de compatibilité ATS et recommandations concrètes par rapport à une annonce cible.",
                },
                {
                  href: "/simulation/new",
                  icon: Mic2,
                  title: "Préparer un entretien",
                  text: "Simulation vocale IA avec questions de recruteurs ciblées et debriefing personnalisé immédiat.",
                },
                {
                  href: "/opportunities",
                  icon: BriefcaseBusiness,
                  title: "Gérer mes opportunités",
                  text: "Suivez votre pipeline de candidatures, relances et étapes de recrutement en un seul endroit.",
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group block rounded-xl ${focusRing}`}
                >
                  <SpotlightCard className="h-full p-5">
                    <div className="flex items-center justify-between">
                      <IconTile icon={action.icon} />
                      <ArrowUpRight className="size-4 text-calm-tertiary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-calm-accent" />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-calm-ink">
                        {action.title}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-calm-tertiary">
                        {action.text}
                      </p>
                    </div>
                  </SpotlightCard>
                </Link>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </MotionConfig>
  )
}
