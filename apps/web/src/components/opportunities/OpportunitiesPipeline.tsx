"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  BriefcaseBusiness,
  CalendarClock,
  ExternalLink,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Target,
  CheckCircle2,
} from "lucide-react"
import { opportunityColumns, type OpportunityListItem } from "./types"
import { cn } from "@/lib/utils"

type Props = { initialOpportunities: OpportunityListItem[] }

function scoreTone(score: number) {
  if (score >= 85) return "bg-success/10 text-success"
  if (score >= 70) return "bg-primary/10 text-primary"
  if (score >= 50) return "bg-warning/10 text-warning"
  return "bg-surface-muted text-foreground-muted"
}

function formatDate(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(date)
}

function getStatusLabel(status: string) {
  return opportunityColumns.find(c => c.status === status)?.label || status
}

function OpportunityRow({ opportunity }: { opportunity: OpportunityListItem }) {
  const nextActionDate = formatDate(opportunity.nextActionAt)
  const discoveredDate = formatDate(opportunity.discoveredAt)

  return (
    <Link
      href={"/opportunities/" + opportunity.id + "/workspace"}
      className="group block border-b border-border/50 bg-surface px-6 py-5 transition-colors hover:bg-surface-muted last:border-0"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">
              {opportunity.company || "Entreprise inconnue"}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-[10px] font-medium text-foreground-muted">
              {getStatusLabel(opportunity.status)}
            </span>
          </div>

          <h3 className="truncate font-sans text-lg font-medium text-foreground">
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
              Ajoute le {discoveredDate}
            </span>
            {opportunity.sourceUrl && (
              <>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  Lien source
                  <ExternalLink className="size-3" />
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          {opportunity.matchScore !== null ? (
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              scoreTone(opportunity.matchScore),
            )}>
              <Target className="size-3" />
              Score {opportunity.matchScore}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-foreground-muted">
              <Sparkles className="size-3" />
              A analyser
            </span>
          )}

          {opportunity.nextAction && (
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground-muted">
                Prochaine etape {nextActionDate ? "(" + nextActionDate + ")" : ""}
              </p>
              <p className="mt-0.5 max-w-[200px] truncate text-xs text-foreground">
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
    const q = query.trim().toLocaleLowerCase("fr")
    if (!q) return initialOpportunities
    return initialOpportunities.filter(o =>
      [o.title, o.company, o.location]
        .filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(q)
    )
  }, [initialOpportunities, query])

  const active = initialOpportunities.filter(
    o => o.status !== "REJECTED" && o.status !== "ARCHIVED"
  )
  const highMatches = active.filter(o => o.matchScore !== null && o.matchScore >= 80).length
  const interviews  = active.filter(o => o.status === "INTERVIEW").length

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-16">

      {/* Header */}
      <header className="flex flex-col gap-6 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
            Opportunites
          </p>
          <h1 className="font-sans text-4xl font-medium tracking-tight text-foreground">
            Vos pistes actives
          </h1>
          <p className="mt-2 max-w-md text-sm text-foreground-muted">
            Centralisez vos offres et transformez chaque candidature en decision strategique.
          </p>
        </div>
        <Link
          href="/opportunities/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Ajouter une opportunite
        </Link>
      </header>

      {initialOpportunities.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-12">

          {/* Main list */}
          <div className="space-y-6 lg:col-span-8">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Dossiers en cours
              </p>
              <div className="relative w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-muted" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher une offre..."
                  className="h-8 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-xs text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              {filtered.length > 0 ? (
                filtered.map(o => <OpportunityRow key={o.id} opportunity={o} />)
              ) : (
                <div className="flex min-h-[200px] items-center justify-center p-8 text-center">
                  <p className="text-sm text-foreground-muted">
                    Aucune opportunite ne correspond a votre recherche.
                  </p>
                </div>
              )}
            </div>

            {initialOpportunities.some(o => o.status === "REJECTED" || o.status === "ARCHIVED") && (
              <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
                <CheckCircle2 className="size-3.5" />
                Les opportunites refusees ou archivees restent conservees dans votre historique.
              </div>
            )}
          </div>

          {/* Sidebar stats */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                Vue d ensemble
              </p>
              <div className="rounded-xl border border-border bg-surface overflow-hidden divide-y divide-border/60">
                {[
                  { icon: BriefcaseBusiness, label: "Actives",      value: active.length  },
                  { icon: Target,            label: "Match >= 80",   value: highMatches    },
                  { icon: BriefcaseBusiness, label: "Entretiens",    value: interviews     },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-lg bg-primary/10">
                        <Icon className="size-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground-muted">{label}</span>
                    </div>
                    <span className="font-sans text-2xl font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-20 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-primary/10">
            <BriefcaseBusiness className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Votre dossier est pret</p>
            <p className="mt-1 max-w-sm text-xs text-foreground-muted">
              Ajoutez votre premiere offre. Trajectoire l analysera et vous proposera la meilleure strategie.
            </p>
          </div>
          <Link
            href="/opportunities/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Ajouter ma premiere offre
          </Link>
        </div>
      )}
    </div>
  )
}