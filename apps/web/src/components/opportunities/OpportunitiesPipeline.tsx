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

type Props = {
  initialOpportunities: OpportunityListItem[]
}

function scoreClasses(score: number) {
  if (score >= 85) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100"
  }

  if (score >= 70) {
    return "bg-violet-50 text-violet-700 ring-violet-100"
  }

  if (score >= 50) {
    return "bg-amber-50 text-amber-700 ring-amber-100"
  }

  return "bg-slate-100 text-slate-600 ring-slate-200"
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

function OpportunityCard({
  opportunity,
}: {
  opportunity: OpportunityListItem
}) {
  const nextActionDate = formatDate(opportunity.nextActionAt)

  return (
    <article className="group rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
          <Building2 className="h-5 w-5" />
        </div>

        {opportunity.matchScore !== null ? (
          <div
            className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${scoreClasses(
              opportunity.matchScore,
            )}`}
          >
            {opportunity.matchScore}% match
          </div>
        ) : (
          <div className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-100">
            Non analysée
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-violet-600">
          {opportunity.company || "Entreprise"}
        </p>

        <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-5 text-slate-950">
          {opportunity.title}
        </h3>

        {opportunity.location ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{opportunity.location}</span>
          </div>
        ) : null}
      </div>

      {opportunity.recommendationLabel ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-violet-50/70 p-3">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
          <p className="text-xs font-medium leading-5 text-violet-900">
            {opportunity.recommendationLabel}
          </p>
        </div>
      ) : null}

      {opportunity.nextAction ? (
        <div className="mt-3 rounded-2xl border border-slate-100 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            <CalendarClock className="h-3 w-3" />
            Prochaine action
            {nextActionDate ? ` · ${nextActionDate}` : ""}
          </div>

          <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-slate-700">
            {opportunity.nextAction}
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        {opportunity.sourceUrl ? (
          <a
            href={opportunity.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Offre
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400">
            {opportunity.source || "Ajout manuel"}
          </span>
        )}

        <Link
          href={`/opportunities/${opportunity.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-violet-700"
        >
          Ouvrir
          <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

export function OpportunitiesPipeline({
  initialOpportunities,
}: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr")

    if (!normalizedQuery) {
      return initialOpportunities
    }

    return initialOpportunities.filter((opportunity) => {
      const haystack = [
        opportunity.title,
        opportunity.company,
        opportunity.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("fr")

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

  const offers = activeOpportunities.filter(
    (opportunity) => opportunity.status === "OFFER",
  ).length

  return (
    <div className="space-y-6 pb-12">
      <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 p-6 text-white shadow-[0_22px_70px_-28px_rgba(109,40,217,0.55)] sm:p-8">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15">
              <Sparkles className="h-3.5 w-3.5" />
              Opportunity Intelligence
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Les bonnes opportunités,
              <br />
              au bon moment.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
              Centralise tes offres, priorise celles qui méritent vraiment ton
              temps et transforme chaque candidature en plan d&apos;action.
            </p>
          </div>

          <Link
            href="/opportunities/new"
            className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-2xl bg-white px-5 text-sm font-bold text-violet-700 shadow-lg shadow-violet-950/10 transition hover:-translate-y-0.5 hover:bg-violet-50 xl:self-auto"
          >
            <Plus className="h-4 w-4" />
            Ajouter une opportunité
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Actives",
              value: activeOpportunities.length,
              icon: BriefcaseBusiness,
            },
            {
              label: "Match ≥ 80",
              value: highMatches,
              icon: Target,
            },
            {
              label: "Entretiens",
              value: interviews,
              icon: CircleDot,
            },
            {
              label: "Offres reçues",
              value: offers,
              icon: Trophy,
            },
          ].map((metric) => {
            const Icon = metric.icon

            return (
              <div
                key={metric.label}
                className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur"
              >
                <div className="flex items-center gap-2 text-violet-100">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-semibold">{metric.label}</span>
                </div>

                <p className="mt-2 text-2xl font-bold">{metric.value}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">
            Pipeline
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            De la découverte jusqu&apos;à l&apos;offre.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />
        </div>
      </section>

      {initialOpportunities.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-violet-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-950">
            Ton pipeline commence ici
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Ajoute une première offre. Trajectoire pourra ensuite l&apos;analyser,
            la comparer à ton profil et te proposer la meilleure prochaine action.
          </p>

          <Link
            href="/opportunities/new"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            Ajouter ma première offre
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="grid min-w-[1480px] grid-cols-6 gap-4">
            {opportunityColumns.map((column) => {
              const items = filtered.filter(
                (opportunity) => opportunity.status === column.status,
              )

              return (
                <section
                  key={column.status}
                  className="rounded-[26px] bg-slate-100/70 p-3 ring-1 ring-slate-200/70"
                >
                  <header className="px-1 pb-3 pt-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        {column.label}
                      </h3>

                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[11px] font-bold text-slate-600 shadow-sm">
                        {items.length}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      {column.description}
                    </p>
                  </header>

                  <div className="space-y-3">
                    {items.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                      />
                    ))}

                    {items.length === 0 ? (
                      <div className="flex min-h-24 items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-white/50 px-4 text-center text-xs text-slate-400">
                        Aucune opportunité
                      </div>
                    ) : null}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      )}

      {initialOpportunities.some(
        (opportunity) =>
          opportunity.status === "REJECTED" ||
          opportunity.status === "ARCHIVED",
      ) ? (
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <CheckCircle2 className="h-4 w-4" />
          Les opportunités refusées ou archivées restent conservées dans ton
          historique.
        </div>
      ) : null}
    </div>
  )
}