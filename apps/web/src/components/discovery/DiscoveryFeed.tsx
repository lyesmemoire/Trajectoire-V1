"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight, BriefcaseBusiness, Building2, Check,
  ChevronDown, CircleCheck, Clock3, ExternalLink,
  Filter, Layers3, MapPin, Radar, RefreshCw,
  Search, ShieldCheck, Sparkles, Target, Zap,
} from "lucide-react"
import { csrfFetch } from "@/lib/security/csrf-client"
import { cn } from "@/lib/utils"

type Provider  = "GREENHOUSE" | "LEVER" | "ASHBY" | "OTHER"
type Status    = "LIVE" | "STALE" | "CLOSED"
type TrustBand = "HIGH" | "MEDIUM" | "LOW" | "UNTRUSTED"

type SerializedSource = {
  id: string; opportunityId: string | null; provider: Provider
  fingerprint: string; title: string; company: string
  location: string | null; department: string | null
  employmentType: string | null; workplaceType: string | null
  description: string; sourceUrl: string; applyUrl: string | null
  status: Status; publishedAt: string | null
  firstSeenAt: string; lastSeenAt: string
}

type Trust = {
  score: number; band: TrustBand; reasons: string[]
  signals: { liveness: number; providerAgreement: number; recency: number; completeness: number; applyPath: number }
}

export type DiscoveryCluster = {
  fingerprint: string; canonical: SerializedSource
  sources: SerializedSource[]; sourceCount: number
  providers: Provider[]; opportunityId: string | null; trust: Trust
}

type Props         = { initialClusters: DiscoveryCluster[] }
type FilterStatus   = "ALL" | Status
type FilterProvider = "ALL" | Provider

const PROVIDER_LABELS: Record<Provider, string> = {
  GREENHOUSE: "Greenhouse", LEVER: "Lever", ASHBY: "Ashby", OTHER: "Autre",
}

function clusterStatus(c: DiscoveryCluster): Status {
  if (c.sources.some(s => s.status === "LIVE"))  return "LIVE"
  if (c.sources.some(s => s.status === "STALE")) return "STALE"
  return "CLOSED"
}

function statusLabel(s: Status)  {
  return s === "LIVE" ? "Active" : s === "STALE" ? "A verifier" : "Cloturee"
}

function statusTone(s: Status) {
  if (s === "LIVE")  return "border-success/30 bg-success/8 text-success"
  if (s === "STALE") return "border-warning/30 bg-warning/8 text-warning"
  return "border-border bg-surface-muted text-foreground-muted"
}

function trustTone(b: TrustBand) {
  if (b === "HIGH")     return "bg-success/10 text-success ring-success/20"
  if (b === "MEDIUM")   return "bg-warning/10 text-warning ring-warning/20"
  if (b === "LOW")      return "bg-danger/10 text-danger ring-danger/20"
  return "bg-surface-muted text-foreground-muted ring-border"
}

function trustLabel(b: TrustBand) {
  if (b === "HIGH")     return "Fiabilite elevee"
  if (b === "MEDIUM")   return "Fiabilite moyenne"
  if (b === "LOW")      return "Fiabilite faible"
  return "Non fiable"
}

function relativeDate(value: string) {
  const diff    = Math.max(0, Date.now() - new Date(value).getTime())
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60)  return minutes <= 1 ? "a l instant" : "il y a " + minutes + " min"
  const hours = Math.floor(minutes / 60)
  if (hours < 24)    return "il y a " + hours + " h"
  const days = Math.floor(hours / 24)
  if (days < 30)     return "il y a " + days + " j"
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

function MetricCard({ icon: Icon, label, value, detail }: {
  icon: typeof Radar; label: string; value: string | number; detail: string
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-muted">{label}</p>
        <div className="grid size-7 place-items-center rounded-lg bg-primary/10">
          <Icon className="size-3.5 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="mt-1 text-xs text-foreground-muted">{detail}</p>
    </div>
  )
}

function OpportunityCard({ cluster, promoting, onPromote }: {
  cluster: DiscoveryCluster; promoting: boolean
  onPromote: (c: DiscoveryCluster) => Promise<void>
}) {
  const canonical = cluster.canonical
  const status    = clusterStatus(cluster)
  const promoted  = Boolean(cluster.opportunityId)

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-elevated">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                statusTone(status),
              )}>
                <span className="size-1.5 rounded-full bg-current" />
                {statusLabel(status)}
              </span>
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1",
                trustTone(cluster.trust.band),
              )}>
                <ShieldCheck className="size-3" />
                {trustLabel(cluster.trust.band)}
              </span>
              {cluster.sourceCount > 1 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary ring-1 ring-primary/20">
                  <Layers3 className="size-3" />
                  {cluster.sourceCount} sources
                </span>
              )}
            </div>

            <div className="flex items-start gap-4">
              <div className="hidden size-10 shrink-0 place-items-center rounded-xl bg-foreground text-background sm:grid">
                <Building2 className="size-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-foreground">{canonical.title}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
                  <span>{canonical.company}</span>
                  {canonical.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />{canonical.location}
                    </span>
                  )}
                  {canonical.employmentType && <span>{canonical.employmentType}</span>}
                </div>
              </div>
            </div>

            <p className="mt-4 line-clamp-2 text-sm text-foreground-muted">
              {canonical.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {cluster.providers.map(p => (
                <span key={p} className="rounded-lg bg-surface-muted px-2.5 py-1 text-[10px] font-medium text-foreground-muted ring-1 ring-border">
                  {PROVIDER_LABELS[p]}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground-muted">
                <Clock3 className="size-3" />
                Verifie {relativeDate(canonical.lastSeenAt)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 xl:flex-col xl:items-end">
            <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
              <span className="text-xl font-bold tabular-nums text-primary">{cluster.trust.score}</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground-muted">Trust</span>
            </div>
            {cluster.trust.reasons.length > 0 && (
              <p className="hidden max-w-[180px] text-right text-[11px] text-foreground-muted xl:block">
                {cluster.trust.reasons.slice(0, 2).join(" · ")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/60 bg-surface-muted px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2 text-[11px] text-foreground-muted">
          <Sparkles className="size-3.5 text-primary" />
          {promoted ? "Deja integree a votre pipeline"
            : status === "CLOSED" ? "Cette offre n est plus active"
            : "Prete a etre qualifiee"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={canonical.sourceUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-[11px] font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            Voir l offre <ExternalLink className="size-3.5" />
          </a>
          {promoted && cluster.opportunityId ? (
            <Link
              href={"/opportunities/" + cluster.opportunityId + "/workspace"}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-[11px] font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              Preparer ma candidature <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              disabled={promoting || status === "CLOSED"}
              onClick={() => void onPromote(cluster)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {promoting ? <RefreshCw className="size-3.5 animate-spin" /> : <Zap className="size-3.5" />}
              {promoting ? "Ajout..." : "Ajouter a mes opportunites"}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export function DiscoveryFeed({ initialClusters }: Props) {
  const router = useRouter()
  const [clusters, setClusters]     = useState(initialClusters)
  const [query, setQuery]           = useState("")
  const [status, setStatus]         = useState<FilterStatus>("ALL")
  const [provider, setProvider]     = useState<FilterProvider>("ALL")
  const [minimumTrust, setMinimumTrust] = useState(0)
  const [promotingId, setPromotingId]   = useState<string | null>(null)
  const [error, setError]           = useState<string | null>(null)

  const metrics = useMemo(() => ({
    active:    clusters.filter(c => clusterStatus(c) === "LIVE").length,
    highTrust: clusters.filter(c => c.trust.band === "HIGH").length,
    promoted:  clusters.filter(c => Boolean(c.opportunityId)).length,
    sources:   clusters.reduce((t, c) => t + c.sourceCount, 0),
  }), [clusters])

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fr")
    return clusters.filter(c => {
      const canon = c.canonical
      const matchQuery    = !q || [canon.title, canon.company, canon.location ?? "", canon.department ?? ""]
        .some(v => v.toLocaleLowerCase("fr").includes(q))
      const matchStatus   = status === "ALL" || clusterStatus(c) === status
      const matchProvider = provider === "ALL" || c.providers.includes(provider)
      const matchTrust    = c.trust.score >= minimumTrust
      return matchQuery && matchStatus && matchProvider && matchTrust
    })
  }, [clusters, query, status, provider, minimumTrust])

  const filtersActive = Boolean(query || status !== "ALL" || provider !== "ALL" || minimumTrust > 0)

  function clearFilters() {
    setQuery(""); setStatus("ALL"); setProvider("ALL"); setMinimumTrust(0)
  }

  async function promote(cluster: DiscoveryCluster) {
    if (promotingId || cluster.opportunityId) return
    setError(null)
    setPromotingId(cluster.canonical.id)
    try {
      const res = await csrfFetch("/api/discovery/" + cluster.canonical.id + "/promote", {
        method: "POST", headers: { Accept: "application/json" },
      })
      const payload = await res.json() as { opportunity?: { id?: string }; error?: string }
      if (!res.ok || !payload.opportunity?.id) throw new Error(payload.error || "Impossible d ajouter cette opportunite.")
      const id = payload.opportunity.id
      setClusters(curr => curr.map(c => c.fingerprint === cluster.fingerprint ? { ...c, opportunityId: id } : c))
      router.push("/opportunities/" + id + "/workspace")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.")
    } finally {
      setPromotingId(null)
    }
  }

  return (
    <div className="pb-12">

      {/* Header */}
      <header className="mb-8 border-b border-border/60 pb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
            Opportunity Intelligence
          </p>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            Discovery
          </h1>
          <p className="mt-1.5 max-w-lg text-sm text-foreground-muted">
            Detectez, dedupliclez et qualifiez les offres avant de les integrer a votre pipeline.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
          >
            <BriefcaseBusiness className="size-4" />
            Mon pipeline
          </Link>
          <Link
            href="/opportunities/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Target className="size-4" />
            Ajouter manuellement
          </Link>
        </div>
      </header>

      {/* Metrics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Radar}       label="Offres actives"  value={metrics.active}    detail="Detectees et disponibles" />
        <MetricCard icon={ShieldCheck} label="Haute confiance" value={metrics.highTrust} detail="Sources jugees fiables"    />
        <MetricCard icon={Layers3}     label="Sources"         value={metrics.sources}   detail="Avant deduplication"       />
        <MetricCard icon={CircleCheck} label="Qualifiees"      value={metrics.promoted}  detail="Ajoutees au pipeline"      />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un poste, une entreprise..."
              className="h-10 w-full rounded-lg border border-border bg-surface-muted pl-10 pr-4 text-xs text-foreground outline-none transition placeholder:text-foreground-muted focus:border-primary/40 focus:bg-surface focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: status,      onChange: (v: string) => setStatus(v as FilterStatus),
                options: [["ALL","Tous statuts"],["LIVE","Actives"],["STALE","A verifier"],["CLOSED","Cloturees"]] },
              { value: provider,    onChange: (v: string) => setProvider(v as FilterProvider),
                options: [["ALL","Toutes sources"],["GREENHOUSE","Greenhouse"],["LEVER","Lever"],["ASHBY","Ashby"],["OTHER","Autre"]] },
              { value: minimumTrust, onChange: (v: string) => setMinimumTrust(Number(v)),
                options: [["0","Tout Trust"],["50","Trust >= 50"],["70","Trust >= 70"],["85","Trust >= 85"]] },
            ].map((sel, i) => (
              <div key={i} className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 size-3 -translate-y-1/2 text-foreground-muted" />
                <select
                  value={String(sel.value)}
                  onChange={e => sel.onChange(e.target.value)}
                  className="h-10 appearance-none rounded-lg border border-border bg-surface pl-8 pr-7 text-xs font-medium text-foreground outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                >
                  {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-foreground-muted" />
              </div>
            ))}
            {filtersActive && (
              <button type="button" onClick={clearFilters} className="h-10 rounded-lg px-3 text-xs font-medium text-primary hover:bg-primary/5 transition-colors">
                Reinitialiser
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
          <p className="text-[11px] text-foreground-muted">
            {filtered.length} opportunite{filtered.length > 1 ? "s" : ""} affichee{filtered.length > 1 ? "s" : ""}
          </p>
          <p className="hidden items-center gap-1.5 text-[10px] text-foreground-muted sm:flex">
            <Check className="size-3 text-success" />
            Doublons regroupes automatiquement
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-xs font-medium text-danger">
          {error}
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border py-16 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-primary/10">
              <Radar className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {filtersActive ? "Aucune offre ne correspond" : "Votre radar est pret"}
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                {filtersActive ? "Modifiez vos filtres." : "Les offres detectees apparaitront ici."}
              </p>
            </div>
            {filtersActive ? (
              <button type="button" onClick={clearFilters} className="rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors">
                Reinitialiser les filtres
              </button>
            ) : (
              <Link href="/opportunities/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Ajouter une opportunite <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        ) : (
          filtered.map(cluster => (
            <OpportunityCard
              key={cluster.fingerprint}
              cluster={cluster}
              promoting={promotingId === cluster.canonical.id}
              onPromote={promote}
            />
          ))
        )}
      </div>
    </div>
  )
}