import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCVAnalysis, getCVRewrites } from "@/lib/cv/queries"
import { buildRemarks } from "@/lib/cv-analysis/preview"
import { ScoreRingDark, scoreTone } from "@/components/cv/CvScore"
import { CvRewriteForm } from "@/components/cv/CvRewriteForm"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Détail de l'analyse – Trajectoire",
}

const REWRITE_LABELS: Record<string, string> = {
  rewrite_summary: "Résumé",
  improve_experience: "Expérience",
  generate_impact_metrics: "Métriques d'impact",
  tailor_opportunity: "Adaptation à une offre",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-zinc-900 p-6">
      <h2 className="mb-4 text-lg font-semibold text-zinc-50">{title}</h2>
      {children}
    </section>
  )
}

function Bullets({ items, tone }: { items: string[]; tone: string }) {
  return (
    <ul className="space-y-2 text-sm text-zinc-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className={`mt-2 size-1.5 shrink-0 rounded-full ${tone}`} aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Chips({ items, className }: { items: string[]; className: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={`rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

export default async function CVDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const analysis = await getCVAnalysis(id, user.id)
  if (!analysis) notFound()

  const { ats } = analysis
  const rewrites = await getCVRewrites(id, user.id)
  const remarks = ats ? buildRemarks(ats, { strengths: 4, weaknesses: 6 }) : null
  const recommendations = analysis.improvements
  const delta =
    analysis.atsScoreBefore !== null && analysis.atsScoreAfter !== null ? analysis.atsScoreAfter - analysis.atsScoreBefore : null

  const dimensions: Array<{ label: string; value: number }> = []
  if (ats) {
    const d = ats.dimensions
    if (d.keywordCoverage !== null) dimensions.push({ label: "Couverture de l'offre", value: d.keywordCoverage })
    if (d.experienceFit !== null) dimensions.push({ label: "Expérience demandée", value: d.experienceFit })
    dimensions.push({ label: "Réalisations chiffrées", value: d.impact }, { label: "Lisibilité pour un ATS", value: d.format })
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/cv" className="mb-4 inline-flex items-center text-sm text-zinc-400 transition-colors hover:text-zinc-50">
        ← Mes analyses
      </Link>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="mb-1 truncate text-3xl font-bold text-zinc-50">{analysis.fileName.trim() || "CV sans titre"}</h1>
          <p className="text-zinc-400">
            Analysé le {analysis.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            {ats?.mode === "cv_only" && " · sans offre (CV seul)"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="#reecrire">
            <Button variant="dark" size="md">
              Réécrire ce CV
            </Button>
          </Link>
          <Link href={`/cv/${analysis.id}/export`}>
            <Button variant="dark" size="md">
              Exporter (DOCX, PDF)
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {analysis.atsScoreAfter !== null && (
          <Section title="Score ATS">
            <div className="flex flex-wrap items-center gap-8">
              <ScoreRingDark score={analysis.atsScoreAfter} />
              <div className="space-y-1 text-sm">
                <p className={`text-base font-medium ${scoreTone(analysis.atsScoreAfter).text}`}>{scoreTone(analysis.atsScoreAfter).label}</p>
                {analysis.atsScoreBefore !== null && (
                  <p className="text-zinc-400">
                    Avant : {analysis.atsScoreBefore}/100
                    {delta !== null && <span className={delta >= 0 ? " text-emerald-300" : " text-rose-300"}> ({delta >= 0 ? "+" : ""}{delta} pts)</span>}
                  </p>
                )}
              </div>
            </div>
          </Section>
        )}

        {dimensions.length > 0 && (
          <Section title="Détail du score">
            <ul className="space-y-4">
              {dimensions.map(({ label, value }) => (
                <li key={label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-zinc-300">{label}</span>
                    <span className={`font-semibold tabular-nums ${scoreTone(value).text}`}>{Math.round(value)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.round(value)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {remarks && remarks.strengths.length > 0 && (
          <Section title="Points forts">
            <Bullets items={remarks.strengths} tone="bg-emerald-400" />
          </Section>
        )}
        {remarks && remarks.weaknesses.length > 0 && (
          <Section title="Points à corriger">
            <Bullets items={remarks.weaknesses} tone="bg-amber-400" />
          </Section>
        )}

        {ats && ats.matchedKeywords.length > 0 && (
          <Section title="Mots-clés détectés">
            <Chips items={ats.matchedKeywords} className="bg-emerald-500/10 text-emerald-300 ring-emerald-400/20" />
          </Section>
        )}
        {ats && ats.missingKeywords.length > 0 && (
          <Section title="Mots-clés manquants">
            <Chips items={ats.missingKeywords} className="bg-amber-500/10 text-amber-300 ring-amber-400/20" />
          </Section>
        )}

        {recommendations.length > 0 && (
          <Section title="Recommandations">
            <Bullets items={recommendations} tone="bg-indigo-400" />
          </Section>
        )}

        {ats && ats.warnings.length > 0 && (
          <Section title="Limites de l'analyse">
            <Bullets items={ats.warnings} tone="bg-zinc-500" />
          </Section>
        )}

        <div id="reecrire" className="scroll-mt-20">
          <Section title="Réécrire un passage">
            <CvRewriteForm analysisId={analysis.id} />
          </Section>
        </div>

        {rewrites.length > 0 && (
          <Section title="Réécritures">
            <ul className="space-y-3">
              {rewrites.map((rewrite) => (
                <li key={rewrite.id} className="rounded-xl border border-white/[0.06] bg-zinc-950/50">
                  <details>
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400">
                      <span className="font-medium text-zinc-50">{REWRITE_LABELS[rewrite.action] ?? "Réécriture"}</span>
                      <span className="text-xs text-zinc-500">
                        {rewrite.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </summary>
                    <div className="space-y-4 border-t border-white/[0.06] px-4 py-4 text-sm">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Avant</p>
                        <p className="whitespace-pre-wrap text-zinc-400">{rewrite.originalContent}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">Après</p>
                        <p className="whitespace-pre-wrap text-zinc-200">{rewrite.rewrittenContent}</p>
                      </div>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {!ats && (
          <p className="rounded-2xl border border-white/[0.08] bg-zinc-900 p-6 text-sm text-zinc-400">
            Cette analyse est antérieure au moteur de score actuel : seul le score enregistré est disponible. Relancez une analyse pour
            obtenir le détail.
          </p>
        )}
      </div>

    </div>
  )
}
