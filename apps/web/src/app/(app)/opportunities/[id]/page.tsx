import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  ExternalLink,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import {
  FutureActions,
  OpportunityAnalysisActions,
  OpportunityStatusActions,
  RecommendationIcon,
} from "@/components/opportunities/OpportunityAnalysisActions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

type StoredAnalysis = {
  summary?: string
  potentialScore?: number
  matchedKeywords?: string[]
  missingKeywords?: string[]
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value.filter(
    (item): item is string => typeof item === "string",
  )
}

function analysisValue(value: unknown): StoredAnalysis {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  const data = value as Record<string, unknown>

  return {
    summary:
      typeof data.summary === "string"
        ? data.summary
        : undefined,
    potentialScore:
      typeof data.potentialScore === "number"
        ? data.potentialScore
        : undefined,
    matchedKeywords: stringArray(data.matchedKeywords),
    missingKeywords: stringArray(data.missingKeywords),
  }
}

function scoreTone(score: number) {
  if (score >= 80) {
    return {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      bar: "bg-emerald-500",
    }
  }

  if (score >= 60) {
    return {
      text: "text-violet-700",
      bg: "bg-violet-50",
      bar: "bg-violet-500",
    }
  }

  return {
    text: "text-amber-700",
    bg: "bg-amber-50",
    bar: "bg-amber-500",
  }
}

function ScoreRow({
  label,
  score,
}: {
  label: string
  score: number | null
}) {
  const safeScore = score ?? 0
  const tone = scoreTone(safeScore)

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-700">
          {label}
        </span>

        <span className={`text-sm font-bold ${tone.text}`}>
          {safeScore}/100
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${tone.bar}`}
          style={{
            width: `${safeScore}%`,
          }}
        />
      </div>
    </div>
  )
}

export default async function OpportunityDetailPage({
  params,
}: PageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  const opportunity = await prisma.opportunity.findFirst({
    where: {
      id,
      userId: user.id,
    },
  })

  if (!opportunity) {
    notFound()
  }

  const analysis = analysisValue(opportunity.analysis)
  const strengths = stringArray(opportunity.strengths)
  const gaps = stringArray(opportunity.gaps)

  const hasAnalysis =
    opportunity.matchScore !== null &&
    opportunity.analyzedAt !== null

  const score = opportunity.matchScore ?? 0
  const tone = scoreTone(score)

  return (
    <div className="space-y-5 pb-12">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au pipeline
      </Link>

      <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                Opportunity Intelligence
              </span>

              {opportunity.source ? (
                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  {opportunity.source}
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {opportunity.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              {opportunity.company ? (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {opportunity.company}
                </span>
              ) : null}

              {opportunity.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {opportunity.location}
                </span>
              ) : null}

              {opportunity.sourceUrl ? (
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-violet-700"
                >
                  Voir l'offre
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>

            {hasAnalysis && analysis.summary ? (
              <div className="mt-7 rounded-[22px] bg-violet-50/70 p-5 ring-1 ring-violet-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                      Lecture Trajectoire
                    </p>

                    <p className="mt-2 text-sm font-medium leading-6 text-violet-950">
                      {analysis.summary}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-7 rounded-[22px] border border-dashed border-violet-200 bg-violet-50/40 p-5">
                <p className="text-sm font-semibold text-violet-900">
                  Cette opportunité n'a pas encore été comparée à ton CV.
                </p>

                <p className="mt-1 text-sm leading-6 text-violet-700/80">
                  Lance l'analyse pour savoir si cette offre mérite réellement ton temps.
                </p>
              </div>
            )}
          </div>

          <aside className="bg-gradient-to-br from-violet-700 to-indigo-700 p-6 text-white sm:p-8">
            {hasAnalysis ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-200">
                  Compatibilité
                </p>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-6xl font-bold tracking-tight">
                    {score}
                  </span>
                  <span className="pb-2 text-lg font-semibold text-violet-200">
                    /100
                  </span>
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <RecommendationIcon
                    recommendation={opportunity.recommendation}
                  />

                  <p className="text-sm font-bold">
                    {opportunity.recommendationLabel ||
                      "Analyse terminée"}
                  </p>
                </div>

                {analysis.potentialScore !== undefined &&
                analysis.potentialScore > score ? (
                  <div className="mt-4 flex items-center gap-2 text-sm text-violet-100">
                    <TrendingUp className="h-4 w-4" />
                    Potentiel après optimisation :
                    <strong>{analysis.potentialScore}/100</strong>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <Target className="h-7 w-7 text-violet-200" />

                <h2 className="mt-5 text-xl font-bold">
                  Est-ce que cette offre vaut ton temps ?
                </h2>

                <p className="mt-2 text-sm leading-6 text-violet-100">
                  Compare cette opportunité à ton dernier CV analysé.
                </p>
              </>
            )}

            <div className="mt-6">
              <OpportunityAnalysisActions
                opportunityId={opportunity.id}
                hasAnalysis={hasAnalysis}
              />
            </div>
          </aside>
        </div>
      </section>

      {hasAnalysis ? (
        <>
          <OpportunityStatusActions
            opportunityId={opportunity.id}
            status={opportunity.status}
            recommendation={opportunity.recommendation}
          />

          <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">
                Détail du score
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Les principaux signaux détectés entre ton CV et cette offre.
              </p>

              <div className="mt-6 space-y-5">
                <ScoreRow
                  label="Compétences"
                  score={opportunity.skillsScore}
                />

                <ScoreRow
                  label="Expérience"
                  score={opportunity.experienceScore}
                />

                <ScoreRow
                  label="Séniorité"
                  score={opportunity.seniorityScore}
                />

                <ScoreRow
                  label="Pertinence CV / offre"
                  score={opportunity.relevanceScore}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-violet-600" />

                <h2 className="text-lg font-bold text-slate-950">
                  Prochaine meilleure action
                </h2>
              </div>

              <p className="mt-4 text-sm font-semibold leading-6 text-slate-800">
                {opportunity.nextAction ||
                  "Continuer à qualifier cette opportunité."}
              </p>

              <div className="mt-6">
                <Link
                  href={`/opportunities/${opportunity.id}/workspace`}
                  className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Ouvrir le workspace
                  <span aria-hidden="true">→</span>
                </Link>
                <FutureActions opportunityId={opportunity.id} />
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">
                Tes forces pour ce poste
              </h2>

              <div className="mt-5 space-y-3">
                {strengths.map((strength) => (
                  <div
                    key={strength}
                    className="flex gap-3 rounded-2xl bg-emerald-50/70 p-4"
                  >
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                    <p className="text-sm font-medium leading-6 text-emerald-950">
                      {strength}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-amber-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">
                Écarts à traiter
              </h2>

              <div className="mt-5 space-y-3">
                {gaps.map((gap) => (
                  <div
                    key={gap}
                    className="flex gap-3 rounded-2xl bg-amber-50/70 p-4"
                  >
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />

                    <p className="text-sm font-medium leading-6 text-amber-950">
                      {gap}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {analysis.matchedKeywords &&
          analysis.matchedKeywords.length > 0 ? (
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">
                Signaux détectés
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.matchedKeywords.slice(0, 16).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">
          Description de l'offre
        </h2>

        <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {opportunity.description}
        </div>
      </section>
    </div>
  )
}