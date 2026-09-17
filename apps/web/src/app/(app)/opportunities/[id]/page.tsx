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
  AlertTriangle,
  BrainCircuit,
  MessageSquareWarning,
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import {
  FutureActions,
  OpportunityAnalysisActions,
  OpportunityStatusActions,
  RecommendationIcon,
} from "@/components/opportunities/OpportunityAnalysisActions"
import { EditOpportunityForm } from "@/components/opportunities/EditOpportunityForm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
  risks?: string[]
  interviewFocus?: string[]
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === "string")
}

function analysisValue(value: unknown): StoredAnalysis {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }
  const data = value as Record<string, unknown>
  return {
    summary: typeof data.summary === "string" ? data.summary : undefined,
    potentialScore: typeof data.potentialScore === "number" ? data.potentialScore : undefined,
    matchedKeywords: stringArray(data.matchedKeywords),
    missingKeywords: stringArray(data.missingKeywords),
    risks: stringArray(data.risks || data.candidateRisks),
    interviewFocus: stringArray(data.interviewFocus || data.focus),
  }
}

function scoreTone(score: number) {
  if (score >= 80) {
    return {
      text: "text-emerald-700",
      bg: "bg-emerald-50/50",
      bar: "bg-emerald-500",
    }
  }
  if (score >= 60) {
    return {
      text: "text-violet-700",
      bg: "bg-violet-50/50",
      bar: "bg-violet-500",
    }
  }
  return {
    text: "text-amber-700",
    bg: "bg-amber-50/50",
    bar: "bg-amber-500",
  }
}

function ScoreRow({ label, score }: { label: string; score: number | null }) {
  const safeScore = score ?? 0
  const tone = scoreTone(safeScore)

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-foreground-muted">
          {label}
        </span>
        <span className={`text-[13px] font-bold ${tone.text}`}>
          {safeScore}/100
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden bg-border/50">
        <div
          className={`h-full ${tone.bar}`}
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  )
}

export default async function OpportunityDetailPage({ params }: PageProps) {
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
    opportunity.matchScore !== null && opportunity.analyzedAt !== null

  const score = opportunity.matchScore ?? 0
  const tone = scoreTone(score)

  return (
    <div className="mx-auto max-w-[1100px] space-y-12 pb-16">

      <Link
        href="/opportunities"
        className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Retour au pipeline
      </Link>

      {/* HEADER ÉDITORIAL */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border/60 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
              Opportunité
            </p>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-foreground-muted">
              {opportunity.status.replace("_", " ")}
            </span>
          </div>

          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {opportunity.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
            {opportunity.company && (
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Building2 className="size-4" />
                {opportunity.company}
              </span>
            )}

            {opportunity.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {opportunity.location}
              </span>
            )}

            {opportunity.sourceUrl && (
              <>
                <span className="h-4 w-px bg-border/60" />
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary transition hover:underline"
                >
                  Voir l'offre
                  <ExternalLink className="size-3.5" />
                </a>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 pb-1 flex items-center gap-3">
           <EditOpportunityForm
             opportunity={{
               id: opportunity.id,
               title: opportunity.title,
               company: opportunity.company,
               location: opportunity.location,
               sourceUrl: opportunity.sourceUrl,
               description: opportunity.description,
             }}
           />
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-12">

        {/* COLONNE PRINCIPALE (ANALYSE & OFFRE) */}
        <div className="space-y-12 lg:col-span-8">

          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Analyse CV × Offre
              </h2>
            </div>

            {hasAnalysis ? (
              <div className="space-y-8">

                {/* FIT GLOBAL */}
                <div className="rounded-md border border-border/60 bg-surface p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
                    <div className="shrink-0 space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">
                        Match Score
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-5xl text-foreground">
                          {score}
                        </span>
                        <span className="text-sm font-medium text-foreground-muted">
                          /100
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground-muted">
                        <RecommendationIcon recommendation={opportunity.recommendation} />
                        {opportunity.recommendationLabel || "Analyse terminée"}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                       <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-foreground">
                         Lecture Trajectoire
                       </h3>
                       <p className="text-[15px] leading-relaxed text-foreground-muted">
                         {analysis.summary || "Compatibilité confirmée avec votre profil actuel."}
                       </p>

                       {analysis.potentialScore !== undefined && analysis.potentialScore > score && (
                         <div className="mt-4 flex items-center gap-2 text-[13px] text-primary">
                           <TrendingUp className="size-4" />
                           Potentiel après optimisation de votre candidature : <strong>{analysis.potentialScore}/100</strong>
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                {/* FORCES / ÉCARTS */}
                {(strengths.length > 0 || gaps.length > 0) && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {strengths.length > 0 && (
                      <div className="rounded-md border border-border/60 bg-surface p-6">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-foreground">
                          Forces détectées
                        </h3>
                        <ul className="space-y-3">
                          {strengths.map((strength) => (
                            <li key={strength} className="flex gap-3 text-[13px] leading-relaxed text-foreground-muted">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/80" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {gaps.length > 0 && (
                      <div className="rounded-md border border-border/60 bg-surface p-6">
                        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-foreground">
                          Écarts à traiter
                        </h3>
                        <ul className="space-y-3">
                          {gaps.map((gap) => (
                            <li key={gap} className="flex gap-3 text-[13px] leading-relaxed text-foreground-muted">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/80" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* RISQUES CANDIDAT (Différenciateur Trajectoire) */}
                {analysis.risks && analysis.risks.length > 0 && (
                  <div className="rounded-md border border-border/60 bg-surface p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-600/80" />
                      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
                        Hypothèses de risques (Préparation)
                      </h3>
                    </div>
                    <p className="mb-5 text-[13px] text-foreground-muted">
                      Ces points représentent des doutes probables que le recruteur pourrait avoir à la lecture du profil. Ce ne sont pas des faits, mais des éléments à anticiper.
                    </p>
                    <ul className="space-y-3">
                      {analysis.risks.map((risk) => (
                        <li key={risk} className="flex gap-3 text-[13px] leading-relaxed text-foreground-muted">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-border" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* FOCUS ENTRETIEN (Mène vers Simulation) */}
                {analysis.interviewFocus && analysis.interviewFocus.length > 0 && (
                  <div className="relative overflow-hidden rounded-md border border-primary/20 bg-primary/5 p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <MessageSquareWarning className="size-4 text-primary" />
                      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                        Focus Entretien
                      </h3>
                    </div>
                    <ul className="mb-6 space-y-3">
                      {analysis.interviewFocus.map((focus) => (
                        <li key={focus} className="flex gap-3 text-[13px] leading-relaxed text-foreground-muted">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                          {focus}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/simulation/new?opportunity=${opportunity.id}`}>
                       <Button variant="primary" size="sm">
                         <Sparkles className="mr-2 size-3.5" />
                         Démarrer une simulation sur ces points
                       </Button>
                    </Link>
                  </div>
                )}

              </div>
            ) : (
              <div className="rounded-md border border-border/60 bg-surface p-12 text-center">
                <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-surface-muted">
                  <BrainCircuit className="size-5 text-foreground-muted" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-medium text-foreground">
                  Analyser cette opportunité
                </h3>
                <p className="mx-auto mb-6 max-w-sm text-sm text-foreground-muted">
                  Comparez cette offre à votre profil pour identifier vos points forts et vos axes de préparation.
                </p>
                <div className="mx-auto max-w-xs">
                  <OpportunityAnalysisActions
                    opportunityId={opportunity.id}
                    hasAnalysis={hasAnalysis}
                  />
                </div>
              </div>
            )}
          </section>

          <div className="h-px w-full bg-border/40" />

          {/* DESCRIPTION DE L'OFFRE */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
              Description originale
            </h2>
            <div className="rounded-md border border-border/60 bg-surface p-8 text-[14px] leading-relaxed text-foreground-muted whitespace-pre-wrap">
              {opportunity.description}
            </div>
          </section>

        </div>

        {/* COLONNE LATÉRALE (DÉCISION & MÉTRIQUES) */}
        <div className="lg:col-span-4 space-y-8">

          <div className="sticky top-12 space-y-8">

            {hasAnalysis && (
              <section>
                <OpportunityStatusActions
                  opportunityId={opportunity.id}
                  status={opportunity.status}
                  recommendation={opportunity.recommendation}
                />
              </section>
            )}

            {hasAnalysis && (
              <section className="rounded-md border border-border/60 bg-surface p-6">
                <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                  Prochaines Étapes
                </h3>
                <FutureActions opportunityId={opportunity.id} />
              </section>
            )}

            {hasAnalysis && (
              <section className="rounded-md border border-border/60 bg-surface p-6">
                <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                  Détail du Match
                </h3>
                <div className="space-y-5">
                  <ScoreRow label="Compétences" score={opportunity.skillsScore} />
                  <ScoreRow label="Expérience" score={opportunity.experienceScore} />
                  <ScoreRow label="Séniorité" score={opportunity.seniorityScore} />
                  <ScoreRow label="Pertinence globale" score={opportunity.relevanceScore} />
                </div>
              </section>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
