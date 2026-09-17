"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ExternalLink,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react"
import {
  opportunityColumns,
  type OpportunityListItem,
  type OpportunityStatus,
} from "./types"
import { Button } from "@/components/ui/button"

type Props = {
  initialOpportunities: OpportunityListItem[]
}

function scoreClasses(score: number) {
  if (score >= 85) {
    return "text-emerald-700 bg-emerald-50/50"
  }
  if (score >= 70) {
    return "text-violet-700 bg-violet-50/50"
  }
  if (score >= 50) {
    return "text-amber-700 bg-amber-50/50"
  }
  return "text-foreground-muted bg-surface-muted"
}

function formatDate(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date)
}

function getStatusLabel(status: string) {
  const col = opportunityColumns.find(c => c.status === status)
  return col?.label || status
}

function OpportunityRow({ opportunity }: { opportunity: OpportunityListItem }) {
  const nextActionDate = formatDate(opportunity.nextActionAt)
  const discoveredDate = formatDate(opportunity.discoveredAt)

  return (
    <Link
      href={`/opportunities/${opportunity.id}/workspace`}
      className="group block border-b border-border/40 bg-surface px-6 py-5 transition-colors hover:bg-surface-muted/50 last:border-0"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">
              {opportunity.company || "Entreprise inconnue"}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-[10px] font-medium text-foreground-muted">
              {getStatusLabel(opportunity.status)}
            </span>
          </div>

          <h3 className="truncate font-serif text-xl font-medium text-foreground">
            {opportunity.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
            {opportunity.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {opportunity.location}
              </span>
            )}
            {opportunity.location && <span className="h-3 w-px bg-border" />}

            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3" />
              Ajouté le {discoveredDate}
            </span>

            {opportunity.sourceUrl && (
              <>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground">
                  Lien source
                  <ExternalLink className="size-3" />
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 sm:items-end">
          {opportunity.matchScore !== null ? (
            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${scoreClasses(opportunity.matchScore)}`}>
              <Target className="size-3" />
              Score {opportunity.matchScore}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-foreground-muted">
              <Sparkles className="size-3" />
              À analyser
            </div>
          )}

          {opportunity.nextAction && (
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted">
                Prochaine étape {nextActionDate ? `(${nextActionDate})` : ""}
              </p>
              <p className="mt-1 max-w-[200px] truncate text-xs text-foreground">
                {opportunity.nextAction}
              </p>
            </div>
          )}
        </div>

      </div>
    </Link>
  )
}

export function OpportunitiesPipeline({ initialOpportunities }: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr")
    if (!normalizedQuery) return initialOpportunities

    return initialOpportunities.filter((opportunity) => {
      const haystack = [
        opportunity.title,
        opportunity.company,
        opportunity.location,
      ].filter(Boolean).join(" ").toLocaleLowerCase("fr")
      return haystack.includes(normalizedQuery)
    })
  }, [initialOpportunities, query])

  const activeOpportunities = initialOpportunities.filter(
    (opportunity) =>
      opportunity.status !== "REJECTED" &&
      opportunity.status !== "ARCHIVED",
  )

  const highMatches = activeOpportunities.filter(
    (opportunity) =>
      opportunity.matchScore !== null &&
      opportunity.matchScore >= 80,
  ).length

  const interviews = activeOpportunities.filter(
    (opportunity) => opportunity.status === "INTERVIEW",
  ).length

  return (
    <div className="mx-auto max-w-[1100px] space-y-12 pb-16">

      {/* HEADER ÉDITORIAL */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border/60 pb-8">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
            Opportunités
          </p>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Vos pistes actives.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-foreground-muted">
            Centralisez vos offres et transformez chaque candidature en décision stratégique.
          </p>
        </div>

        <div className="shrink-0 pb-1">
          <Link href="/opportunities/new">
            <Button variant="primary">
              Ajouter une opportunité
            </Button>
          </Link>
        </div>
      </header>

      {initialOpportunities.length > 0 ? (
        <div className="grid gap-12 lg:grid-cols-12">

          <div className="space-y-8 lg:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Dossiers en cours
              </h2>

              <div className="relative w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une offre..."
                  className="h-8 w-full rounded border border-border bg-surface pl-9 pr-3 text-xs text-foreground outline-none transition focus:border-foreground"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-border/60 bg-surface">
              {filtered.length > 0 ? (
                <div className="flex flex-col">
                  {filtered.map((opportunity) => (
                    <OpportunityRow
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[200px] items-center justify-center p-8 text-center">
                  <p className="text-sm text-foreground-muted">Aucune opportunité ne correspond à votre recherche.</p>
                </div>
              )}
            </div>

            {initialOpportunities.some(
              (opportunity) =>
                opportunity.status === "REJECTED" ||
                opportunity.status === "ARCHIVED",
            ) && (
              <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
                <CheckCircle2 className="size-3.5" />
                Les opportunités refusées ou archivées restent conservées dans l'historique de votre profil.
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            {/* OVERVIEW COMPACT (STYLE SNAPSHOT) */}
            <div className="sticky top-12">
              <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Vue d'ensemble
              </h2>

              <div className="rounded-md border border-border/60 bg-surface">

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between text-foreground-muted">
                    <BriefcaseBusiness className="size-4" strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Actives</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl text-foreground">{activeOpportunities.length}</span>
                  </div>
                </div>

                <div className="mx-6 h-px bg-border/40" />

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between text-foreground-muted">
                    <Target className="size-4" strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Match ≥ 80</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl text-foreground">{highMatches}</span>
                  </div>
                </div>

                <div className="mx-6 h-px bg-border/40" />

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between text-foreground-muted">
                    <CircleDot className="size-4" strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Entretiens</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl text-foreground">{interviews}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      ) : (
        /* EMPTY STATE PREMIUM */
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-sm bg-surface p-8 text-center ring-1 ring-border/50">
          <div className="mb-6 grid size-12 place-items-center rounded-full bg-surface-muted text-foreground-muted">
            <BriefcaseBusiness className="size-5" />
          </div>
          <h2 className="mb-3 font-serif text-2xl font-medium text-foreground">
            Votre dossier est prêt.
          </h2>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-foreground-muted">
            Ajoutez votre première offre. Trajectoire pourra l'analyser,
            la comparer à votre profil et vous proposer la meilleure stratégie.
          </p>
          <Link href="/opportunities/new">
            <Button variant="primary" className="shadow-none">
              Ajouter ma première offre
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
