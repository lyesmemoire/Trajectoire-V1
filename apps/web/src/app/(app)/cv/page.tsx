import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCVAnalyses } from "@/lib/cv/queries"
import { ScoreBadge } from "@/components/cv/CvScore"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Mes analyses de CV – Trajectoire",
  description: "Retrouvez vos analyses de CV et leur score ATS.",
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

export default async function CVListPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const analyses = await getCVAnalyses(user.id)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link href="/dashboard" className="mb-4 inline-flex items-center text-sm text-calm-secondary transition-colors hover:text-calm-ink">
          ← Retour au tableau de bord
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-calm-ink">Mes analyses de CV</h1>
            <p className="text-calm-secondary">Score ATS et pistes d&apos;amélioration de chaque CV analysé.</p>
          </div>
          {analyses.length > 0 && (
            <Link href="/analyze">
              <Button variant="dark" size="md">
                Nouvelle analyse
              </Button>
            </Link>
          )}
        </div>
      </div>

      {analyses.length === 0 ? (
        <div className="rounded-2xl border border-calm-accent-line bg-gradient-to-br from-calm-accent-soft via-calm-accent-soft to-transparent p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold text-calm-ink">Aucune analyse pour le moment</h2>
          <p className="mb-6 text-calm-secondary">Importez votre CV et, si vous en avez une, une offre : le score apparaîtra ici.</p>
          <Link href="/analyze">
            <Button variant="dark" size="md">
              Lancer une analyse
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {analyses.map((analysis) => {
            const delta =
              analysis.atsScoreBefore !== null && analysis.atsScoreAfter !== null
                ? analysis.atsScoreAfter - analysis.atsScoreBefore
                : null
            return (
              <li key={analysis.id}>
                <Link
                  href={`/cv/${analysis.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-calm-line bg-calm-surface p-5 transition-colors hover:bg-calm-accent-wash focus-visible:outline focus-visible:outline-2 focus-visible:outline-calm-accent"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-calm-accent-soft text-calm-accent">
                    <FileText className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-calm-ink">{analysis.fileName.trim() || "CV sans titre"}</span>
                    <span className="block text-sm text-calm-secondary">{formatDate(analysis.createdAt)}</span>
                  </span>
                  {delta !== null && (
                    <span className={`text-sm font-medium tabular-nums ${delta >= 0 ? "text-calm-accent-deep" : "text-calm-warn"}`}>
                      {delta >= 0 ? "+" : ""}
                      {delta} pts
                    </span>
                  )}
                  {analysis.atsScoreAfter !== null ? (
                    <ScoreBadge score={analysis.atsScoreAfter} />
                  ) : (
                    <span className="text-sm text-calm-tertiary">Pas de score</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
