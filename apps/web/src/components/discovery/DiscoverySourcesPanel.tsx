"use client"

import { FormEvent, useMemo, useState } from "react"
import {
  CheckCircle2, ChevronDown, CircleAlert, CloudCog,
  Loader2, Pause, Play, Plus, RefreshCw, Server, Trash2, X,
} from "lucide-react"
import { csrfFetch } from "@/lib/security/csrf-client"
import { cn } from "@/lib/utils"

type Provider = "GREENHOUSE" | "LEVER" | "ASHBY"

type DiscoverySource = {
  id: string; provider: Provider | "OTHER"; company: string
  boardKey: string; enabled: boolean; lastSyncAt: string | null
  lastSyncStatus: string | null; lastSyncError: string | null
  createdAt: string; updatedAt: string
}

type Props = { initialSources: DiscoverySource[] }

type ApiPayload = {
  source?: DiscoverySource; sources?: DiscoverySource[]
  deleted?: boolean; error?: string
}

const PROVIDER_LABELS: Record<Provider, string> = {
  GREENHOUSE: "Greenhouse", LEVER: "Lever", ASHBY: "Ashby",
}

const PROVIDER_HELP: Record<Provider, string> = {
  GREENHOUSE: "Identifiant du job board Greenhouse",
  LEVER:      "Identifiant du site Lever",
  ASHBY:      "Nom du job board Ashby",
}

const PROVIDER_ABBR: Record<string, string> = {
  GREENHOUSE: "GH", LEVER: "LV", ASHBY: "AS",
}

function relativeDate(value: string | null) {
  if (!value) return "Jamais"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Inconnue"
  const diff    = Math.max(0, Date.now() - date.getTime())
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1)  return "A l instant"
  if (minutes < 60) return "Il y a " + minutes + " min"
  const hours = Math.floor(minutes / 60)
  if (hours < 24)   return "Il y a " + hours + " h"
  const days = Math.floor(hours / 24)
  if (days < 30)    return "Il y a " + days + " j"
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
}

function sourceStatus(s: DiscoverySource) {
  if (!s.enabled)                     return { label: "En pause",      tone: "bg-surface-muted text-foreground-muted ring-border"       }
  if (s.lastSyncStatus === "SUCCESS") return { label: "Synchronisee",  tone: "bg-calm-accent-soft text-calm-accent ring-success/20"               }
  if (s.lastSyncStatus === "ERROR")   return { label: "Erreur",        tone: "bg-danger/10 text-danger ring-danger/20"                  }
  return                                     { label: "Prete",         tone: "bg-calm-accent-soft text-calm-accent ring-calm-accent-line"               }
}

async function readPayload(res: Response): Promise<ApiPayload> {
  try { return await res.json() as ApiPayload } catch { return {} }
}

export function DiscoverySourcesPanel({ initialSources }: Props) {
  const [sources, setSources]   = useState(initialSources)
  const [provider, setProvider] = useState<Provider>("GREENHOUSE")
  const [company, setCompany]   = useState("")
  const [boardKey, setBoardKey] = useState("")
  const [showForm, setShowForm] = useState(initialSources.length === 0)
  const [creating, setCreating] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const [syncingAll, setSyncingAll] = useState(false)

  const activeCount = useMemo(() => sources.filter(s => s.enabled).length, [sources])

  async function createSource(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (creating) return
    const cleanCompany  = company.trim()
    const cleanBoardKey = boardKey.trim()
    if (!cleanCompany || !cleanBoardKey) {
      setError("Renseignez l entreprise et l identifiant du job board.")
      return
    }
    setError(null); setCreating(true)
    try {
      const res     = await csrfFetch("/api/discovery/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ provider, company: cleanCompany, boardKey: cleanBoardKey }),
      })
      const payload = await readPayload(res)
      if (!res.ok || !payload.source) throw new Error(payload.error || "Impossible d ajouter cette source.")
      setSources(curr => [payload.source!, ...curr.filter(s => s.id !== payload.source!.id)])
      setCompany(""); setBoardKey(""); setShowForm(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.")
    } finally { setCreating(false) }
  }

  async function toggleSource(source: DiscoverySource) {
    if (pendingId) return
    setError(null); setPendingId(source.id)
    try {
      const res     = await csrfFetch("/api/discovery/sources/" + source.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ enabled: !source.enabled }),
      })
      const payload = await readPayload(res)
      if (!res.ok || !payload.source) throw new Error(payload.error || "Impossible de modifier cette source.")
      setSources(curr => curr.map(s => s.id === source.id ? payload.source! : s))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.")
    } finally { setPendingId(null) }
  }

  async function syncAllSources() {
    if (syncingAll || pendingId || activeCount === 0) return
    setError(null); setSyncingAll(true)
    try {
      const res     = await csrfFetch("/api/discovery/sources/sync-all", {
        method: "POST", headers: { Accept: "application/json" },
      })
      const payload = await res.json() as { total?: number; error?: string }
      if (!res.ok) throw new Error(payload.error || "La synchronisation globale a echoue.")
      window.location.reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : "La synchronisation globale a echoue.")
    } finally { setSyncingAll(false) }
  }

  async function syncSource(source: DiscoverySource) {
    if (pendingId || !source.enabled) return
    setError(null); setPendingId(source.id)
    try {
      const res     = await csrfFetch("/api/discovery/sources/" + source.id + "/sync", {
        method: "POST", headers: { Accept: "application/json" },
      })
      const payload = await readPayload(res)
      if (!res.ok || !payload.source) throw new Error(payload.error || "La synchronisation a echoue.")
      setSources(curr => curr.map(s => s.id === source.id ? payload.source! : s))
      window.location.reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : "La synchronisation a echoue.")
    } finally { setPendingId(null) }
  }

  async function deleteSource(source: DiscoverySource) {
    if (pendingId) return
    if (!window.confirm("Supprimer la source " + source.company + " ?")) return
    setError(null); setPendingId(source.id)
    try {
      const res     = await csrfFetch("/api/discovery/sources/" + source.id, {
        method: "DELETE", headers: { Accept: "application/json" },
      })
      const payload = await readPayload(res)
      if (!res.ok || !payload.deleted) throw new Error(payload.error || "Impossible de supprimer cette source.")
      setSources(curr => curr.filter(s => s.id !== source.id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.")
    } finally { setPendingId(null) }
  }

  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-border bg-surface">

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-calm-accent-soft">
            <CloudCog className="size-4 text-calm-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans text-sm font-semibold text-foreground tracking-normal">Sources Discovery</h2>
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-foreground-muted">
                {activeCount} active{activeCount > 1 ? "s" : ""}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-foreground-muted">
              Connectez vos job boards ATS pour alimenter votre radar automatiquement.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={syncingAll || activeCount === 0}
            onClick={() => void syncAllSources()}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            {syncingAll ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            {syncingAll ? "Synchronisation..." : "Synchroniser tout"}
          </button>
          <button
            type="button"
            onClick={() => { setError(null); setShowForm(v => !v) }}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-calm-accent px-3 text-xs font-semibold text-white transition-colors hover:bg-calm-accent-deep"
          >
            {showForm ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
            {showForm ? "Fermer" : "Ajouter une source"}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={createSource} className="border-b border-border/60 bg-surface-muted p-5 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[0.8fr_1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">ATS</span>
              <div className="relative">
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value as Provider)}
                  className="h-10 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-8 text-xs font-medium text-foreground outline-none focus:border-calm-accent-line focus:ring-2 focus:ring-calm-accent-line"
                >
                  <option value="GREENHOUSE">Greenhouse</option>
                  <option value="LEVER">Lever</option>
                  <option value="ASHBY">Ashby</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground-muted" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">Entreprise</span>
              <input
                value={company} onChange={e => setCompany(e.target.value)}
                placeholder="Ex. OpenAI" maxLength={120}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-xs text-foreground placeholder:text-foreground-muted/50 outline-none focus:border-calm-accent-line focus:ring-2 focus:ring-calm-accent-line"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">Board key</span>
              <input
                value={boardKey} onChange={e => setBoardKey(e.target.value)}
                placeholder="Identifiant du job board" maxLength={120}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-xs text-foreground placeholder:text-foreground-muted/50 outline-none focus:border-calm-accent-line focus:ring-2 focus:ring-calm-accent-line"
              />
              <span className="mt-1 block text-[10px] text-foreground-muted">{PROVIDER_HELP[provider]}</span>
            </label>
            <button
              type="submit" disabled={creating}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-calm-accent px-4 text-xs font-semibold text-white transition-colors hover:bg-calm-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              {creating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              {creating ? "Ajout..." : "Connecter"}
            </button>
          </div>
        </form>
      )}

      {/* Error */}
      {error && (
        <div role="alert" className="mx-5 mt-4 flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/5 px-3.5 py-3 text-xs font-medium text-danger sm:mx-6">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Empty */}
      {sources.length === 0 ? (
        <div className="px-5 py-12 text-center sm:px-6">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface-muted">
            <Server className="size-5 text-foreground-muted" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">Aucune source connectee</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-foreground-muted">
            Ajoutez un job board Greenhouse, Lever ou Ashby pour commencer la decouverte automatique.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {sources.map(source => {
            const pending = pendingId === source.id
            const status  = sourceStatus(source)
            return (
              <div
                key={source.id}
                className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-surface-muted sm:px-6 xl:flex-row xl:items-center xl:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-calm-accent-soft text-[10px] font-bold text-calm-ink">
                    {PROVIDER_ABBR[source.provider] ?? "ATS"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{source.company}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1", status.tone)}>
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-foreground-muted">
                      <span>{source.provider === "OTHER" ? "Autre" : PROVIDER_LABELS[source.provider as Provider]}</span>
                      <span>·</span>
                      <span className="font-mono">{source.boardKey}</span>
                      <span>·</span>
                      <span>Dernier scan : {relativeDate(source.lastSyncAt)}</span>
                    </div>
                    {source.lastSyncError && (
                      <p className="mt-1 max-w-lg truncate text-[11px] text-danger">{source.lastSyncError}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button" disabled={pending}
                    onClick={() => void toggleSource(source)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-[11px] font-medium text-foreground-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {pending ? <Loader2 className="size-3.5 animate-spin" />
                      : source.enabled ? <Pause className="size-3.5" />
                      : <Play className="size-3.5" />}
                    {source.enabled ? "Mettre en pause" : "Activer"}
                  </button>
                  <button
                    type="button"
                    disabled={pending || !source.enabled || source.provider === "OTHER"}
                    onClick={() => void syncSource(source)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-calm-accent-soft px-3 text-[11px] font-medium text-calm-accent ring-1 ring-calm-accent-line transition-colors hover:bg-calm-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {pending ? <Loader2 className="size-3.5 animate-spin" />
                      : source.lastSyncStatus === "SUCCESS" ? <CheckCircle2 className="size-3.5" />
                      : <RefreshCw className="size-3.5" />}
                    Synchroniser
                  </button>
                  <button
                    type="button" disabled={pending}
                    aria-label={"Supprimer " + source.company}
                    onClick={() => void deleteSource(source)}
                    className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-foreground-muted transition-colors hover:border-danger/30 hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}