"use client"

import {
  useMemo,
  useState,
} from "react"

import Link from "next/link"

import {
  useRouter,
} from "next/navigation"

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  ExternalLink,
  Filter,
  Layers3,
  MapPin,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"

import {
  csrfFetch,
} from "@/lib/security/csrf-client"
type Provider =
  | "GREENHOUSE"
  | "LEVER"
  | "ASHBY"
  | "OTHER"

type Status =
  | "LIVE"
  | "STALE"
  | "CLOSED"

type TrustBand =
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "UNTRUSTED"

type SerializedSource = {
  id: string
  opportunityId: string | null
  provider: Provider
  fingerprint: string
  title: string
  company: string
  location: string | null
  department: string | null
  employmentType: string | null
  workplaceType: string | null
  description: string
  sourceUrl: string
  applyUrl: string | null
  status: Status
  publishedAt: string | null
  firstSeenAt: string
  lastSeenAt: string
}

type Trust = {
  score: number
  band: TrustBand
  reasons: string[]

  signals: {
    liveness: number
    providerAgreement: number
    recency: number
    completeness: number
    applyPath: number
  }
}

export type DiscoveryCluster = {
  fingerprint: string
  canonical: SerializedSource
  sources: SerializedSource[]
  sourceCount: number
  providers: Provider[]
  opportunityId: string | null
  trust: Trust
}

type Props = {
  initialClusters:
    DiscoveryCluster[]
}

type FilterStatus =
  | "ALL"
  | Status

type FilterProvider =
  | "ALL"
  | Provider

const PROVIDER_LABELS:
  Record<Provider, string> = {
    GREENHOUSE: "Greenhouse",
    LEVER: "Lever",
    ASHBY: "Ashby",
    OTHER: "Autre",
  }

function clusterStatus(
  cluster: DiscoveryCluster,
): Status {
  if (
    cluster.sources.some(
      (source) =>
        source.status === "LIVE",
    )
  ) {
    return "LIVE"
  }

  if (
    cluster.sources.some(
      (source) =>
        source.status === "STALE",
    )
  ) {
    return "STALE"
  }

  return "CLOSED"
}

function statusLabel(
  status: Status,
) {
  switch (status) {
    case "LIVE":
      return "Active"

    case "STALE":
      return "À vérifier"

    case "CLOSED":
      return "Clôturée"
  }
}

function statusClasses(
  status: Status,
) {
  switch (status) {
    case "LIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"

    case "STALE":
      return "border-amber-200 bg-amber-50 text-amber-700"

    case "CLOSED":
      return "border-slate-200 bg-slate-100 text-slate-500"
  }
}

function trustClasses(
  band: TrustBand,
) {
  switch (band) {
    case "HIGH":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100"

    case "MEDIUM":
      return "bg-amber-50 text-amber-700 ring-amber-100"

    case "LOW":
      return "bg-rose-50 text-rose-700 ring-rose-100"

    case "UNTRUSTED":
      return "bg-slate-100 text-slate-500 ring-slate-200"
  }
}

function trustLabel(
  band: TrustBand,
) {
  switch (band) {
    case "HIGH":
      return "Fiabilité élevée"

    case "MEDIUM":
      return "Fiabilité moyenne"

    case "LOW":
      return "Fiabilité faible"

    case "UNTRUSTED":
      return "Non fiable"
  }
}

function relativeDate(
  value: string,
) {
  const date =
    new Date(value)

  const now =
    new Date()

  const diff =
    Math.max(
      0,
      now.getTime() -
        date.getTime(),
    )

  const minutes =
    Math.floor(
      diff / 60_000,
    )

  if (minutes < 60) {
    return minutes <= 1
      ? "à l'instant"
      : `il y a ${minutes} min`
  }

  const hours =
    Math.floor(
      minutes / 60,
    )

  if (hours < 24) {
    return `il y a ${hours} h`
  }

  const days =
    Math.floor(
      hours / 24,
    )

  if (days < 30) {
    return `il y a ${days} j`
  }

  return date.toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "short",
    },
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon:
    typeof Radar

  label:
    string

  value:
    string | number

  detail:
    string
}) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_16px_45px_rgba(63,46,107,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">
            {value}
          </p>
        </div>

        <span className="grid size-10 place-items-center rounded-2xl bg-violet-50 text-violet-600">
          <Icon className="size-4" />
        </span>
      </div>

      <p className="mt-2 text-xs font-medium text-slate-400">
        {detail}
      </p>
    </div>
  )
}

function EmptyFeed({
  filtered,
  clearFilters,
}: {
  filtered:
    boolean

  clearFilters:
    () => void
}) {
  return (
    <div className="rounded-[30px] border border-dashed border-violet-200 bg-white/80 px-6 py-16 text-center shadow-sm">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-50 text-violet-600">
        <Radar className="size-6" />
      </div>

      <h2 className="mt-5 text-lg font-black tracking-tight text-slate-950">
        {filtered
          ? "Aucune offre ne correspond"
          : "Votre radar est prêt"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? "Modifiez vos filtres pour retrouver davantage d'opportunités."
          : "Les offres détectées par vos sources ATS apparaîtront ici, dédupliquées et classées par fiabilité."}
      </p>

      {filtered ? (
        <button
          type="button"
          onClick={
            clearFilters
          }
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
        >
          Réinitialiser les filtres
        </button>
      ) : (
        <Link
          href="/opportunities/new"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/15 transition hover:bg-violet-700"
        >
          Ajouter une opportunité

          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  )
}

function OpportunityCard({
  cluster,
  promoting,
  onPromote,
}: {
  cluster:
    DiscoveryCluster

  promoting:
    boolean

  onPromote: (
    cluster: DiscoveryCluster,
  ) => Promise<void>
}) {
  const canonical =
    cluster.canonical

  const status =
    clusterStatus(
      cluster,
    )

  const promoted =
    Boolean(
      cluster.opportunityId,
    )

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-[0_18px_55px_rgba(63,46,107,0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_65px_rgba(63,46,107,0.11)]">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em]",
                  statusClasses(
                    status,
                  ),
                ].join(" ")}
              >
                <span className="size-1.5 rounded-full bg-current" />

                {statusLabel(
                  status,
                )}
              </span>

              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1",
                  trustClasses(
                    cluster.trust.band,
                  ),
                ].join(" ")}
              >
                <ShieldCheck className="size-3" />

                {trustLabel(
                  cluster.trust.band,
                )}
              </span>

              {cluster.sourceCount > 1 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold text-indigo-700 ring-1 ring-indigo-100">
                  <Layers3 className="size-3" />

                  {cluster.sourceCount} sources concordantes
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-950 to-slate-700 text-white shadow-lg shadow-slate-900/10 sm:grid">
                <Building2 className="size-5" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-black tracking-[-0.025em] text-slate-950 sm:text-xl">
                  {canonical.title}
                </h2>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
                  <span>
                    {canonical.company}
                  </span>

                  {canonical.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />
                      {canonical.location}
                    </span>
                  ) : null}

                  {canonical.employmentType ? (
                    <span>
                      {canonical.employmentType}
                    </span>
                  ) : null}

                  {canonical.workplaceType ? (
                    <span>
                      {canonical.workplaceType}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <p className="mt-4 line-clamp-3 max-w-3xl text-[13px] leading-6 text-slate-500">
              {canonical.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {cluster.providers.map(
                (provider) => (
                  <span
                    key={
                      provider
                    }
                    className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-100"
                  >
                    {PROVIDER_LABELS[
                      provider
                    ]}
                  </span>
                ),
              )}

              <span className="inline-flex items-center gap-1.5 px-1 text-[11px] font-semibold text-slate-400">
                <Clock3 className="size-3" />

                Vérifiée{" "}
                {relativeDate(
                  canonical.lastSeenAt,
                )}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 xl:flex-col xl:items-end">
            <div className="flex size-[76px] shrink-0 flex-col items-center justify-center rounded-[22px] bg-[#faf9fe] ring-1 ring-violet-100">
              <span className="text-2xl font-black tracking-[-0.06em] text-violet-700">
                {cluster.trust.score}
              </span>

              <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Trust
              </span>
            </div>

            <div className="hidden max-w-[210px] text-right xl:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Pourquoi ce score ?
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                {cluster.trust.reasons
                  .slice(0, 2)
                  .join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <Sparkles className="size-3.5 text-violet-500" />

          {promoted
            ? "Déjà intégrée à votre pipeline"
            : status === "CLOSED"
              ? "Cette offre n'est plus active"
              : "Prête à être qualifiée dans votre pipeline"}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={
              canonical.sourceUrl
            }
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
          >
            Voir l'offre

            <ExternalLink className="size-3.5" />
          </a>

          {promoted &&
          cluster.opportunityId ? (
            <Link
              href={`/opportunities/${cluster.opportunityId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2.5 text-[11px] font-bold text-white transition hover:bg-slate-800"
            >
              Ouvrir l'opportunité

              <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              disabled={
                promoting ||
                status === "CLOSED"
              }
              onClick={() =>
                void onPromote(
                  cluster,
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-2.5 text-[11px] font-bold text-white shadow-lg shadow-violet-600/15 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {promoting ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <Zap className="size-3.5" />
              )}

              {promoting
                ? "Ajout..."
                : "Ajouter à mes opportunités"}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export function DiscoveryFeed({
  initialClusters,
}: Props) {
  const router =
    useRouter()

  const [
    clusters,
    setClusters,
  ] =
    useState(
      initialClusters,
    )

  const [
    query,
    setQuery,
  ] =
    useState("")

  const [
    status,
    setStatus,
  ] =
    useState<FilterStatus>(
      "ALL",
    )

  const [
    provider,
    setProvider,
  ] =
    useState<FilterProvider>(
      "ALL",
    )

  const [
    minimumTrust,
    setMinimumTrust,
  ] =
    useState(0)

  const [
    promotingId,
    setPromotingId,
  ] =
    useState<string | null>(
      null,
    )

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    )

  const metrics =
    useMemo(
      () => {
        const active =
          clusters.filter(
            (cluster) =>
              clusterStatus(
                cluster,
              ) === "LIVE",
          ).length

        const highTrust =
          clusters.filter(
            (cluster) =>
              cluster.trust.band ===
              "HIGH",
          ).length

        const promoted =
          clusters.filter(
            (cluster) =>
              Boolean(
                cluster.opportunityId,
              ),
          ).length

        const sources =
          clusters.reduce(
            (total, cluster) =>
              total +
              cluster.sourceCount,
            0,
          )

        return {
          active,
          highTrust,
          promoted,
          sources,
        }
      },
      [clusters],
    )

  const filtered =
    useMemo(
      () => {
        const normalizedQuery =
          query
            .trim()
            .toLocaleLowerCase(
              "fr",
            )

        return clusters.filter(
          (cluster) => {
            const canonical =
              cluster.canonical

            const matchesQuery =
              !normalizedQuery ||
              [
                canonical.title,
                canonical.company,
                canonical.location ?? "",
                canonical.department ?? "",
              ].some(
                (value) =>
                  value
                    .toLocaleLowerCase(
                      "fr",
                    )
                    .includes(
                      normalizedQuery,
                    ),
              )

            const matchesStatus =
              status === "ALL" ||
              clusterStatus(
                cluster,
              ) === status

            const matchesProvider =
              provider === "ALL" ||
              cluster.providers.includes(
                provider,
              )

            const matchesTrust =
              cluster.trust.score >=
              minimumTrust

            return (
              matchesQuery &&
              matchesStatus &&
              matchesProvider &&
              matchesTrust
            )
          },
        )
      },
      [
        clusters,
        minimumTrust,
        provider,
        query,
        status,
      ],
    )

  const filtersActive =
    Boolean(
      query ||
      status !== "ALL" ||
      provider !== "ALL" ||
      minimumTrust > 0,
    )

  function clearFilters() {
    setQuery("")
    setStatus("ALL")
    setProvider("ALL")
    setMinimumTrust(0)
  }

  async function promote(
    cluster: DiscoveryCluster,
  ) {
    if (
      promotingId ||
      cluster.opportunityId
    ) {
      return
    }

    setError(null)

    setPromotingId(
      cluster.canonical.id,
    )

    try {
      const response =
        await csrfFetch(`/api/discovery/${cluster.canonical.id}/promote`,
          {
            method:
              "POST",

            headers: {
              Accept:
                "application/json",
            },
          },
        )

      const payload =
        (await response.json()) as {
          opportunity?: {
            id?: string
          }

          error?: string
        }

      if (
        !response.ok ||
        !payload.opportunity?.id
      ) {
        throw new Error(
          payload.error ||
            "Impossible d'ajouter cette opportunité.",
        )
      }

      const opportunityId =
        payload.opportunity.id

      setClusters(
        (current) =>
          current.map(
            (item) =>
              item.fingerprint ===
              cluster.fingerprint
                ? {
                    ...item,
                    opportunityId,
                  }
                : item,
          ),
      )

      router.refresh()
    }
    catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Une erreur est survenue.",
      )
    }
    finally {
      setPromotingId(
        null,
      )
    }
  }

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden rounded-[32px] border border-white/80 bg-gradient-to-br from-white via-white to-violet-50/80 px-5 py-7 shadow-[0_20px_60px_rgba(63,46,107,0.07)] sm:px-7 lg:px-8">
        <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-32 top-20 size-40 rounded-full bg-indigo-200/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-violet-700 ring-1 ring-violet-100">
              <Radar className="size-3.5" />

              Opportunity Intelligence
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
              Discovery
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Un radar unique pour détecter, dédupliquer et qualifier les offres avant de les intégrer à votre pipeline.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
            >
              <BriefcaseBusiness className="size-4" />

              Mon pipeline
            </Link>

            <Link
              href="/opportunities/new"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
            >
              <Target className="size-4" />

              Ajouter manuellement
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Radar}
          label="Offres actives"
          value={
            metrics.active
          }
          detail="Détectées et encore disponibles"
        />

        <MetricCard
          icon={ShieldCheck}
          label="Haute confiance"
          value={
            metrics.highTrust
          }
          detail="Sources jugées fiables"
        />

        <MetricCard
          icon={Layers3}
          label="Sources"
          value={
            metrics.sources
          }
          detail="Avant déduplication"
        />

        <MetricCard
          icon={CircleCheck}
          label="Qualifiées"
          value={
            metrics.promoted
          }
          detail="Ajoutées au pipeline"
        />
      </section>

      <section className="mt-5 rounded-[26px] border border-white/80 bg-white/90 p-4 shadow-[0_16px_45px_rgba(63,46,107,0.06)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              value={
                query
              }
              onChange={
                (event) =>
                  setQuery(
                    event.target.value,
                  )
              }
              placeholder="Rechercher un poste, une entreprise, un lieu..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />

              <select
                value={
                  status
                }
                onChange={
                  (event) =>
                    setStatus(
                      event.target
                        .value as FilterStatus,
                    )
                }
                className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-[11px] font-bold text-slate-600 outline-none focus:border-violet-300"
              >
                <option value="ALL">
                  Tous les statuts
                </option>

                <option value="LIVE">
                  Actives
                </option>

                <option value="STALE">
                  À vérifier
                </option>

                <option value="CLOSED">
                  Clôturées
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={
                  provider
                }
                onChange={
                  (event) =>
                    setProvider(
                      event.target
                        .value as FilterProvider,
                    )
                }
                className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-[11px] font-bold text-slate-600 outline-none focus:border-violet-300"
              >
                <option value="ALL">
                  Toutes les sources
                </option>

                <option value="GREENHOUSE">
                  Greenhouse
                </option>

                <option value="LEVER">
                  Lever
                </option>

                <option value="ASHBY">
                  Ashby
                </option>

                <option value="OTHER">
                  Autre
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={
                  minimumTrust
                }
                onChange={
                  (event) =>
                    setMinimumTrust(
                      Number(
                        event.target.value,
                      ),
                    )
                }
                className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-[11px] font-bold text-slate-600 outline-none focus:border-violet-300"
              >
                <option value={0}>
                  Tout Trust Score
                </option>

                <option value={50}>
                  Trust ≥ 50
                </option>

                <option value={70}>
                  Trust ≥ 70
                </option>

                <option value={85}>
                  Trust ≥ 85
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {filtersActive ? (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="h-11 rounded-xl px-3 text-[11px] font-bold text-violet-600 transition hover:bg-violet-50"
              >
                Réinitialiser
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold text-slate-400">
            {filtered.length} opportunité
            {filtered.length > 1
              ? "s"
              : ""} affichée
            {filtered.length > 1
              ? "s"
              : ""}
          </p>

          <p className="hidden items-center gap-1.5 text-[10px] font-bold text-slate-400 sm:flex">
            <Check className="size-3 text-emerald-500" />

            Doublons regroupés automatiquement
          </p>
        </div>
      </section>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700"
        >
          {error}
        </div>
      ) : null}

      <section className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <EmptyFeed
            filtered={
              filtersActive
            }
            clearFilters={
              clearFilters
            }
          />
        ) : (
          filtered.map(
            (cluster) => (
              <OpportunityCard
                key={
                  cluster.fingerprint
                }
                cluster={
                  cluster
                }
                promoting={
                  promotingId ===
                  cluster.canonical.id
                }
                onPromote={
                  promote
                }
              />
            ),
          )
        )}
      </section>
    </div>
  )
}