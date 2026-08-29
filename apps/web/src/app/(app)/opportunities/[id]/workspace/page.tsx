import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Circle,
  FileText,
  MessageSquareText,
  Sparkles,
  Target,
} from "lucide-react"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { CareerMemoryPanel } from "@/components/opportunities/CareerMemoryPanel"
import { StoryBankPanel } from "@/components/opportunities/StoryBankPanel"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
}

function scoreLabel(score: number | null) {
  if (score === null) return "À analyser"
  if (score >= 80) return "Excellent alignement"
  if (score >= 60) return "Potentiel intéressant"
  return "À challenger"
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    DISCOVERED: "Découverte",
    TO_ANALYZE: "À analyser",
    TO_APPLY: "À candidater",
    APPLIED: "Candidature envoyée",
    INTERVIEW: "Entretien",
    OFFER: "Offre",
    REJECTED: "Refusée",
    ARCHIVED: "Archivée",
  }

  return labels[status] ?? status
}

export default async function ApplicationWorkspacePage({
  params,
}: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { id } = await params

  const [opportunity, latestCV, latestInterview, careerProfile] =
    await Promise.all([
      prisma.opportunity.findFirst({
        where: { id, userId: user.id },
      }),
      prisma.cVAnalysis.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fileName: true,
          atsScoreBefore: true,
          atsScoreAfter: true,
          createdAt: true,
        },
      }),
      prisma.interviewSession.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          jobTitle: true,
          company: true,
          score: true,
          status: true,
          completedAt: true,
        },
      }),
      prisma.careerProfile.findUnique({
        where: { userId: user.id },
        select: {
          employabilityScore: true,
          leadershipScore: true,
          communicationScore: true,
          careerDNA: true,
        },
      }),
    ])

  if (!opportunity) notFound()

  const preparationSteps = [
    {
      label: "Opportunité analysée",
      complete: opportunity.matchScore !== null,
    },
    {
      label: "CV disponible",
      complete: Boolean(latestCV),
    },
    {
      label: "Candidature envoyée",
      complete: ["APPLIED", "INTERVIEW", "OFFER"].includes(
        opportunity.status,
      ),
    },
    {
      label: "Préparation entretien",
      complete: Boolean(latestInterview),
    },
  ]

  const completedSteps = preparationSteps.filter(
    (step) => step.complete,
  ).length

  const readiness = Math.round(
    (completedSteps / preparationSteps.length) * 100,
  )

  const pipelineStages = [
    {
      key: "DISCOVERED",
      label: "Découverte",
    },
    {
      key: "TO_ANALYZE",
      label: "Analyse",
    },
    {
      key: "TO_APPLY",
      label: "Candidature",
    },
    {
      key: "APPLIED",
      label: "Envoyée",
    },
    {
      key: "INTERVIEW",
      label: "Entretien",
    },
    {
      key: "OFFER",
      label: "Offre",
    },
  ] as const

  const currentPipelineIndex = pipelineStages.findIndex(
    (stage) => stage.key === opportunity.status,
  )

  const recommendedAction = (() => {
    if (opportunity.matchScore === null) {
      return {
        eyebrow: "Priorité 1",
        title: "Analyser cette opportunité",
        description:
          "Commence par mesurer ton alignement avec le poste pour identifier les écarts et les arguments à renforcer.",
        action: "Analyser maintenant",
        href: `/opportunities/${opportunity.id}`,
      }
    }

    if (!latestCV) {
      return {
        eyebrow: "Priorité 1",
        title: "Adapter ton CV à cette offre",
        description:
          "Ton opportunité est analysée. La prochaine étape est de créer une version du CV alignée sur les exigences du poste.",
        action: "Optimiser mon CV",
        href: `/analyze?opportunity=${opportunity.id}`,
      }
    }

    if (
      ["DISCOVERED", "TO_ANALYZE", "TO_APPLY"].includes(
        opportunity.status,
      )
    ) {
      return {
        eyebrow: "Priorité candidature",
        title: "Renforcer ta candidature",
        description:
          "Ton analyse et ton CV sont disponibles. Consolide maintenant tes preuves, tes histoires STAR et ta compréhension de l’entreprise.",
        action: "Préparer mes arguments",
        href: `/opportunities/${opportunity.id}/workspace#story-bank`,
      }
    }

    if (
      ["APPLIED", "INTERVIEW"].includes(opportunity.status) &&
      !latestInterview
    ) {
      return {
        eyebrow: "Priorité entretien",
        title: "Préparer ton prochain entretien",
        description:
          "Ta candidature est engagée. Lance une simulation contextualisée pour préparer tes réponses et réduire les zones de risque.",
        action: "Lancer une simulation",
        href: `/simulation/new?opportunity=${opportunity.id}`,
      }
    }

    if (opportunity.status === "OFFER") {
      return {
        eyebrow: "Décision",
        title: "Préparer ta décision",
        description:
          "Tu as atteint l’étape offre. Reviens sur les éléments clés de l’opportunité avant de décider de la prochaine étape.",
        action: "Voir l’opportunité",
        href: `/opportunities/${opportunity.id}`,
      }
    }

    return {
      eyebrow: "Prochaine action",
      title:
        opportunity.nextAction ||
        "Renforcer ta préparation",
      description:
        "Trajectoire te recommande de consolider les éléments de preuve et la préparation spécifique à cette opportunité.",
      action: "Continuer la préparation",
      href: `/opportunities/${opportunity.id}/workspace#story-bank`,
    }
  })()

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-6 px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voir la fiche opportunité
        </Link>

        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
          {statusLabel(opportunity.status)}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-7 text-white shadow-2xl sm:px-8 lg:px-10 lg:py-9">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              Application Intelligence
            </div>

            <p className="text-sm font-medium text-slate-400">
              {opportunity.company || "Entreprise à préciser"}
            </p>

            <h1 className="mt-2 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {opportunity.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Ton cockpit de candidature centralise la décision,
              le CV, la préparation entretien et les prochaines
              actions pour cette opportunité.
            </p>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Préparation
                </p>
                <p className="mt-2 text-4xl font-semibold">
                  {readiness}%
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-violet-200">
                  {completedSteps}/{preparationSteps.length}
                </p>
                <p className="text-xs text-slate-400">
                  étapes complétées
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-400"
                style={{ width: `${readiness}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] border border-violet-100 bg-white shadow-[0_20px_60px_rgba(76,29,149,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)]">
          <div className="p-6 sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
                <Sparkles className="h-3.5 w-3.5" />
                Prochaine meilleure action
              </div>

              <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                {recommendedAction.eyebrow}
              </span>
            </div>

            <h2 className="mt-5 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {recommendedAction.title}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {recommendedAction.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={recommendedAction.href}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-violet-700"
              >
                {recommendedAction.action}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`/opportunities/${opportunity.id}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Voir l&apos;opportunité
              </Link>
            </div>
          </div>

          <div className="border-t border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 sm:p-7 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-500">
              Niveau de préparation
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-[-0.05em] text-slate-950">
                {readiness}
              </span>
              <span className="pb-1.5 text-lg font-semibold text-slate-400">
                %
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {completedSteps}/{preparationSteps.length} étapes clés sont déjà complétées.
            </p>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-violet-100">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${readiness}%` }}
              />
            </div>

            <p className="mt-4 text-xs font-medium text-slate-500">
              {readiness >= 75
                ? "Candidature fortement préparée"
                : readiness >= 50
                  ? "Bonne base, encore quelques leviers"
                  : "Plusieurs leviers peuvent encore être activés"}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-5 sm:px-7">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {pipelineStages.map((stage, index) => {
              const isActive =
                index === currentPipelineIndex

              const isComplete =
                currentPipelineIndex >= 0 &&
                index < currentPipelineIndex

              return (
                <div
                  key={stage.key}
                  className={
                    isActive
                      ? "rounded-2xl bg-violet-600 px-3 py-3 text-white shadow-sm"
                      : isComplete
                        ? "rounded-2xl bg-white px-3 py-3 text-emerald-700 ring-1 ring-emerald-100"
                        : "rounded-2xl bg-white px-3 py-3 text-slate-400 ring-1 ring-slate-200"
                  }
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        isActive
                          ? "grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[10px] font-bold"
                          : isComplete
                            ? "grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600"
                            : "grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400"
                      }
                    >
                      {isComplete ? "✓" : index + 1}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
                      {stage.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Match Trajectoire"
          value={
            opportunity.matchScore !== null
              ? `${opportunity.matchScore}%`
              : "—"
          }
          detail={scoreLabel(opportunity.matchScore)}
          icon={<Target className="h-5 w-5" />}
        />

        <MetricCard
          label="CV"
          value={latestCV ? "Disponible" : "À préparer"}
          detail={latestCV?.fileName || "Aucun CV analysé"}
          icon={<FileText className="h-5 w-5" />}
        />

        <MetricCard
          label="Entretien"
          value={
            latestInterview?.score !== null &&
            latestInterview?.score !== undefined
              ? `${latestInterview.score}/100`
              : latestInterview
                ? "En cours"
                : "À préparer"
          }
          detail={
            latestInterview?.jobTitle ||
            "Aucune simulation liée"
          }
          icon={<MessageSquareText className="h-5 w-5" />}
        />

        <MetricCard
          label="Career Intelligence"
          value={
            careerProfile
              ? `${Math.round(
                  careerProfile.employabilityScore,
                )}%`
              : "—"
          }
          detail="Mémoire carrière globale"
          icon={<Sparkles className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
                  Mission control
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  Préparer ma candidature
                </h2>
              </div>

              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                {readiness}% prêt
              </span>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <ActionCard
                title="Adapter mon CV"
                description="Aligne ton CV avec les exigences spécifiques de cette offre."
                href={`/analyze?opportunity=${opportunity.id}`}
                action="Optimiser le CV"
                icon={<FileText className="h-5 w-5" />}
                complete={Boolean(latestCV)}
              />

              <ActionCard
                title="Préparer l'entretien"
                description="Lance une simulation contextualisée avec le poste et l'entreprise."
                href={`/simulation/new?opportunity=${opportunity.id}`}
                action="Lancer la préparation"
                icon={<MessageSquareText className="h-5 w-5" />}
                complete={Boolean(latestInterview)}
              />

              <ActionCard
                title="Story Bank"
                description="Prépare les histoires STAR qui prouvent tes compétences et ton impact."
                href={`/opportunities/${opportunity.id}/workspace#story-bank`}
                action="Construire mes histoires"
                icon={<BookOpen className="h-5 w-5" />}
                complete={false}
              />

              <ActionCard
                title="Recherche entreprise"
                description="Centralise les informations utiles pour personnaliser ta candidature."
                href={`/opportunities/${opportunity.id}/workspace#company-research`}
                action="Préparer ma recherche"
                icon={<Building2 className="h-5 w-5" />}
                complete={false}
              />
            </div>
          </div>

          <StoryBankPanel
            opportunityId={opportunity.id}
          />
          <div
            id="company-research"
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Company Intelligence
                </p>
                <h2 className="text-lg font-semibold text-slate-950">
                  Recherche entreprise
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                "Positionnement & produit",
                "Culture & valeurs",
                "Enjeux du poste",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <Circle className="h-4 w-4 text-slate-300" />
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <CareerMemoryPanel
            opportunityId={opportunity.id}
          />
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Progression
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">
              Checklist candidature
            </h2>

            <div className="mt-6 space-y-4">
              {preparationSteps.map((step) => (
                <div
                  key={step.label}
                  className="flex items-center gap-3"
                >
                  {step.complete ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                  )}

                  <span
                    className={
                      step.complete
                        ? "text-sm font-medium text-slate-900"
                        : "text-sm text-slate-500"
                    }
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-5 w-5 text-violet-600" />
              <h2 className="font-semibold text-slate-950">
                Prochaine action
              </h2>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {opportunity.nextAction ||
                "Choisis la prochaine action qui fera avancer cette candidature."}
            </p>

            <Link
              href={`/opportunities/${opportunity.id}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
            >
              Gérer le pipeline
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </aside>
      </section>
    </main>
  )
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string
  value: string
  detail: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>
        <div className="text-violet-600">{icon}</div>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 truncate text-sm text-slate-500">
        {detail}
      </p>
    </div>
  )
}

function ActionCard({
  title,
  description,
  href,
  action,
  icon,
  complete,
}: {
  title: string
  description: string
  href: string
  action: string
  icon: React.ReactNode
  complete: boolean
}) {
  return (
    <div className="group rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 transition hover:border-violet-200 hover:bg-violet-50/40">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-white p-3 text-violet-700 shadow-sm">
          {icon}
        </div>

        {complete && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            Disponible
          </span>
        )}
      </div>

      <h3 className="mt-5 font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700"
      >
        {action}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}