"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { ExternalLink, Loader2, Mic2, Plus, RefreshCw, Telescope, Trash2 } from "lucide-react"
import { csrfFetch } from "@/lib/security/csrf-client"
import { CONTRACT_TYPES } from "@/lib/radar/schemas"
import { cn } from "@/lib/utils"

export type RadarSearchItem = {
  id: string
  name: string
  keywords: string
  departments: string[]
  contractTypes: string[]
  sources: string[]
  enabled: boolean
  lastRunAt: string | null
  lastRunError: string | null
}

export type RadarMatchItem = {
  id: string
  score: number | null
  scoreDetails: { matched?: string[]; missing?: string[]; reason?: string | null } | null
  state: "NEW" | "SEEN" | "SAVED" | "DISMISSED"
  opportunityId: string | null
  offer: {
    title: string
    company: string | null
    locationLabel: string | null
    contractType: string | null
    salaryLabel: string | null
    description: string
    sourceUrl: string
    applyUrl: string | null
    status: "LIVE" | "STALE" | "CLOSED"
    publishedAt: string | null
    lastSeenAt: string
  }
}

type Props = {
  initialSearches: RadarSearchItem[]
  initialMatches: RadarMatchItem[]
  initialCursor: string | null
  sourcesConfigured: boolean
  hasCv: boolean
  maxSearches: number
}

type Filter = "ACTIVE" | "SAVED" | "DISMISSED"
const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "ACTIVE", label: "À traiter" },
  { value: "SAVED", label: "Enregistrées" },
  { value: "DISMISSED", label: "Écartées" },
]

const field = "w-full rounded-xl border border-white/[0.1] bg-zinc-950 px-3 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15"

async function readError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string }
  return body.message ?? body.error ?? "Une erreur est survenue."
}

function ScoreBadge({ match }: { match: RadarMatchItem }) {
  if (match.score === null) {
    return (
      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
        {match.scoreDetails?.reason === "cv_missing" ? "Non évalué : ajoutez votre CV" : "Non évalué"}
      </span>
    )
  }
  const tone = match.score >= 70 ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : match.score >= 40 ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : "border-white/10 bg-white/5 text-white/60"
  return <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", tone)}>Compatibilité {match.score} %</span>
}

export function RadarBoard({ initialSearches, initialMatches, initialCursor, sourcesConfigured, hasCv, maxSearches }: Props) {
  const [searches, setSearches] = useState(initialSearches)
  const [matches, setMatches] = useState(initialMatches)
  const [cursor, setCursor] = useState(initialCursor)
  const [filter, setFilter] = useState<Filter>("ACTIVE")
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(initialSearches.length === 0)

  const [form, setForm] = useState({ name: "", keywords: "", departments: "", contractTypes: [] as string[] })

  const loadMatches = useCallback(async (state: Filter, after?: string | null) => {
    const qs = new URLSearchParams({ state, limit: "30" })
    if (after) qs.set("cursor", after)
    const res = await csrfFetch(`/api/radar/matches?${qs}`)
    if (!res.ok) throw new Error(await readError(res))
    return (await res.json()) as { matches: RadarMatchItem[]; nextCursor: string | null }
  }, [])

  async function changeFilter(next: Filter) {
    setFilter(next)
    setBusy("list")
    try {
      const data = await loadMatches(next)
      setMatches(data.matches)
      setCursor(data.nextCursor)
    } catch (e) {
      setMessage({ kind: "error", text: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  async function more() {
    if (!cursor) return
    setBusy("more")
    try {
      const data = await loadMatches(filter, cursor)
      setMatches(curr => [...curr, ...data.matches])
      setCursor(data.nextCursor)
    } catch (e) {
      setMessage({ kind: "error", text: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  async function createSearch(e: React.FormEvent) {
    e.preventDefault()
    setBusy("create")
    setMessage(null)
    try {
      const departments = form.departments.split(/[\s,;]+/).map(d => d.trim().toUpperCase()).filter(Boolean)
      const res = await csrfFetch("/api/radar/searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, keywords: form.keywords, departments, contractTypes: form.contractTypes }),
      })
      if (!res.ok) throw new Error(res.status === 400 ? "Vérifiez les champs (départements : 75, 2A, 971…)." : await readError(res))
      const { search } = (await res.json()) as { search: RadarSearchItem }
      setSearches(curr => [...curr, search])
      setForm({ name: "", keywords: "", departments: "", contractTypes: [] })
      setShowForm(false)
      setMessage({ kind: "ok", text: "Recherche enregistrée." })
    } catch (err) {
      setMessage({ kind: "error", text: (err as Error).message })
    } finally {
      setBusy(null)
    }
  }

  async function toggleSearch(s: RadarSearchItem) {
    setBusy(s.id)
    const res = await csrfFetch(`/api/radar/searches/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !s.enabled }) })
    if (res.ok) setSearches(curr => curr.map(x => (x.id === s.id ? { ...x, enabled: !s.enabled } : x)))
    else setMessage({ kind: "error", text: await readError(res) })
    setBusy(null)
  }

  async function deleteSearch(s: RadarSearchItem) {
    setBusy(s.id)
    const res = await csrfFetch(`/api/radar/searches/${s.id}`, { method: "DELETE" })
    if (res.ok) setSearches(curr => curr.filter(x => x.id !== s.id))
    else setMessage({ kind: "error", text: await readError(res) })
    setBusy(null)
  }

  async function runSearch(s: RadarSearchItem) {
    setBusy(s.id)
    setMessage(null)
    try {
      const res = await csrfFetch(`/api/radar/searches/${s.id}/run`, { method: "POST" })
      if (!res.ok) throw new Error(await readError(res))
      const { result } = (await res.json()) as { result: { matched: number; failedSources: unknown[] } }
      setMessage({ kind: "ok", text: `${result.matched} nouvelle(s) offre(s)${result.failedSources.length ? " (une source n'a pas répondu)" : ""}.` })
      await changeFilter(filter)
    } catch (err) {
      setMessage({ kind: "error", text: (err as Error).message })
    } finally {
      setBusy(null)
    }
  }

  async function setState(match: RadarMatchItem, state: "SAVED" | "DISMISSED" | "SEEN") {
    setBusy(match.id)
    const res = await csrfFetch(`/api/radar/matches/${match.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state }) })
    if (res.ok) {
      setMatches(curr => (state === "DISMISSED" && filter !== "DISMISSED" ? curr.filter(x => x.id !== match.id) : curr.map(x => (x.id === match.id ? { ...x, state } : x))))
    } else setMessage({ kind: "error", text: await readError(res) })
    setBusy(null)
  }

  async function track(match: RadarMatchItem) {
    setBusy(match.id)
    const res = await csrfFetch(`/api/radar/matches/${match.id}/track`, { method: "POST" })
    if (res.ok) {
      const { opportunityId } = (await res.json()) as { opportunityId: string }
      setMatches(curr => curr.map(x => (x.id === match.id ? { ...x, state: "SAVED", opportunityId } : x)))
      setMessage({ kind: "ok", text: "Offre ajoutée à vos opportunités." })
    } else setMessage({ kind: "error", text: await readError(res) })
    setBusy(null)
  }

  const canAdd = searches.length < maxSearches
  const empty = useMemo(() => matches.length === 0, [matches])

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 text-white">
      <header className="mb-6 flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"><Telescope className="size-5" aria-hidden /></div>
        <div>
          <h1 className="text-2xl font-bold">Radar des offres</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/60">
            Enregistrez une recherche : le radar retrouve des offres en France et les compare à votre CV. La compatibilité mesure la part des exigences de l&apos;offre que votre CV mentionne ; elle ne prédit pas le résultat d&apos;une candidature.
          </p>
        </div>
      </header>

      {!sourcesConfigured && (
        <p role="status" className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          Les sources d&apos;offres ne sont pas encore connectées : vous pouvez préparer vos recherches, elles s&apos;exécuteront dès l&apos;activation.
        </p>
      )}
      {!hasCv && (
        <p role="status" className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          Sans CV analysé, les offres ne sont pas évaluées.{" "}
          <Link href="/cv" className="font-medium text-indigo-300 underline-offset-2 hover:underline">Analyser mon CV</Link>
        </p>
      )}
      {message && (
        <p role="status" className={cn("mb-4 rounded-xl border px-4 py-3 text-sm", message.kind === "ok" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-red-400/20 bg-red-400/10 text-red-200")}>
          {message.text}
        </p>
      )}

      <section aria-labelledby="searches-title" className="mb-8 rounded-2xl border border-white/10 bg-zinc-900 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="searches-title" className="text-base font-semibold text-white/90">Mes recherches ({searches.length}/{maxSearches})</h2>
          {canAdd && !showForm && (
            <button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
              <Plus className="size-4" aria-hidden /> Nouvelle recherche
            </button>
          )}
        </div>

        {searches.length > 0 && (
          <ul className="mb-4 space-y-2">
            {searches.map(s => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/90">{s.name}{!s.enabled && <span className="ml-2 text-xs text-white/50">(en pause)</span>}</p>
                  <p className="truncate text-xs text-white/60">
                    {s.keywords}{s.departments.length ? ` · dép. ${s.departments.join(", ")}` : ""}{s.contractTypes.length ? ` · ${s.contractTypes.join(", ")}` : ""}
                  </p>
                  {s.lastRunError && <p className="mt-1 text-xs text-amber-200">Dernière actualisation incomplète : {s.lastRunError}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => runSearch(s)} disabled={busy === s.id || !sourcesConfigured} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-40">
                    {busy === s.id ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <RefreshCw className="size-3.5" aria-hidden />} Actualiser
                  </button>
                  <button type="button" onClick={() => toggleSearch(s)} disabled={busy === s.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-40">
                    {s.enabled ? "Mettre en pause" : "Reprendre"}
                  </button>
                  <button type="button" onClick={() => deleteSearch(s)} disabled={busy === s.id} aria-label={`Supprimer la recherche ${s.name}`} className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/60 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40">
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {showForm && (
          <form onSubmit={createSearch} className="grid gap-3 md:grid-cols-2">
            <label className="text-xs text-white/60">Nom
              <input required maxLength={80} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex. Développeur à Paris" className={cn(field, "mt-1 h-11")} />
            </label>
            <label className="text-xs text-white/60">Mots-clés
              <input required minLength={2} maxLength={120} value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} placeholder="Ex. développeur typescript" className={cn(field, "mt-1 h-11")} />
            </label>
            <label className="text-xs text-white/60">Départements (facultatif)
              <input value={form.departments} onChange={e => setForm(f => ({ ...f, departments: e.target.value }))} placeholder="75, 92, 2A" className={cn(field, "mt-1 h-11")} />
            </label>
            <fieldset className="text-xs text-white/60">
              <legend className="mb-1">Contrats (facultatif)</legend>
              <div className="flex flex-wrap gap-2">
                {CONTRACT_TYPES.map(c => (
                  <label key={c} className="cursor-pointer">
                    <input type="checkbox" className="peer sr-only" checked={form.contractTypes.includes(c)} onChange={e => setForm(f => ({ ...f, contractTypes: e.target.checked ? [...f.contractTypes, c] : f.contractTypes.filter(x => x !== c) }))} />
                    <span className="inline-flex h-9 items-center rounded-lg border border-white/10 bg-zinc-950 px-3 text-xs text-white/60 transition peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 peer-checked:text-indigo-300 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/40">{c}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" disabled={busy === "create"} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50">
                {busy === "create" && <Loader2 className="size-4 animate-spin" aria-hidden />} Enregistrer la recherche
              </button>
              {searches.length > 0 && (
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/10">Annuler</button>
              )}
            </div>
          </form>
        )}
      </section>

      <section aria-labelledby="offers-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="offers-title" className="text-base font-semibold text-white/90">Offres</h2>
          <div role="group" aria-label="Filtrer les offres" className="flex gap-2">
            {FILTERS.map(f => (
              <button key={f.value} type="button" onClick={() => changeFilter(f.value)} aria-pressed={filter === f.value} className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition", filter === f.value ? "border-indigo-500 bg-indigo-500/10 text-indigo-300" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10")}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {busy === "list" ? (
          <p className="flex items-center gap-2 text-sm text-white/60"><Loader2 className="size-4 animate-spin" aria-hidden /> Chargement…</p>
        ) : empty ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-sm text-white/60">
            {filter === "ACTIVE" ? "Aucune offre pour le moment. Actualisez une recherche pour en trouver." : "Rien ici."}
          </p>
        ) : (
          <ul className="space-y-3">
            {matches.map(m => (
              <li key={m.id} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white/90">{m.offer.title}</h3>
                    <p className="text-sm text-white/60">
                      {[m.offer.company, m.offer.locationLabel, m.offer.contractType].filter(Boolean).join(" · ")}
                      {m.offer.salaryLabel ? ` · ${m.offer.salaryLabel}` : ""}
                    </p>
                  </div>
                  <ScoreBadge match={m} />
                </div>
                {m.offer.status !== "LIVE" && (
                  <p className="mt-2 text-xs text-amber-200">{m.offer.status === "CLOSED" ? "Offre probablement pourvue : plus revue depuis plus d'une semaine." : "Offre non revue depuis quelques jours : vérifiez qu'elle est toujours ouverte."}</p>
                )}
                {m.scoreDetails && m.score !== null && (
                  <div className="mt-3 space-y-1.5 text-xs">
                    {!!m.scoreDetails.matched?.length && <p className="text-emerald-300/90"><span className="text-white/50">Retrouvés dans votre CV : </span>{m.scoreDetails.matched.slice(0, 6).join(", ")}</p>}
                    {!!m.scoreDetails.missing?.length && <p className="text-amber-200/90"><span className="text-white/50">Absents de votre CV : </span>{m.scoreDetails.missing.slice(0, 6).join(", ")}</p>}
                  </div>
                )}
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{m.offer.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a href={m.offer.applyUrl ?? m.offer.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={() => m.state === "NEW" && void setState(m, "SEEN")} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10">
                    Voir l&apos;offre <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                  {m.opportunityId ? (
                    <>
                      <Link href={`/opportunities/${m.opportunityId}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10">Ouvrir l&apos;opportunité</Link>
                      <Link href={`/simulation/new?opportunity=${m.opportunityId}`} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400">
                        <Mic2 className="size-3.5" aria-hidden /> Simuler cet entretien
                      </Link>
                    </>
                  ) : (
                    <button type="button" onClick={() => track(m)} disabled={busy === m.id} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50">
                      {busy === m.id && <Loader2 className="size-3.5 animate-spin" aria-hidden />} Suivre cette offre
                    </button>
                  )}
                  {m.state !== "DISMISSED" && (
                    <button type="button" onClick={() => setState(m, "DISMISSED")} disabled={busy === m.id} className="rounded-lg px-3 py-2 text-xs text-white/60 transition hover:text-white/90 disabled:opacity-40">Écarter</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {cursor && busy !== "list" && (
          <div className="mt-4 text-center">
            <button type="button" onClick={more} disabled={busy === "more"} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-50">
              {busy === "more" ? "Chargement…" : "Voir plus"}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
