"use client"

import {
  FormEvent,
  useMemo,
  useState,
} from "react"

import {
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CloudCog,
  Loader2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Server,
  Trash2,
  X,
} from "lucide-react"

import {
  csrfFetch,
} from "@/lib/security/csrf-client"

type Provider =
  | "GREENHOUSE"
  | "LEVER"
  | "ASHBY"

type DiscoverySource = {
  id: string
  provider: Provider | "OTHER"
  company: string
  boardKey: string
  enabled: boolean
  lastSyncAt: string | null
  lastSyncStatus: string | null
  lastSyncError: string | null
  createdAt: string
  updatedAt: string
}

type Props = {
  initialSources:
    DiscoverySource[]
}

type ApiPayload = {
  source?: DiscoverySource
  sources?: DiscoverySource[]
  deleted?: boolean
  error?: string
}

const PROVIDER_LABELS:
  Record<Provider, string> = {
    GREENHOUSE:
      "Greenhouse",

    LEVER:
      "Lever",

    ASHBY:
      "Ashby",
  }

const PROVIDER_HELP:
  Record<Provider, string> = {
    GREENHOUSE:
      "Identifiant du job board Greenhouse",

    LEVER:
      "Identifiant du site Lever",

    ASHBY:
      "Nom du job board Ashby",
  }

function relativeDate(
  value: string | null,
) {
  if (!value) {
    return "Jamais"
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Inconnue"
  }

  const now =
    Date.now()

  const diff =
    Math.max(
      0,
      now -
        date.getTime(),
    )

  const minutes =
    Math.floor(
      diff / 60_000,
    )

  if (minutes < 1) {
    return "À l'instant"
  }

  if (minutes < 60) {
    return `Il y a ${minutes} min`
  }

  const hours =
    Math.floor(
      minutes / 60,
    )

  if (hours < 24) {
    return `Il y a ${hours} h`
  }

  const days =
    Math.floor(
      hours / 24,
    )

  if (days < 30) {
    return `Il y a ${days} j`
  }

  return date.toLocaleDateString(
    "fr-FR",
    {
      day:
        "numeric",

      month:
        "short",

      year:
        "numeric",
    },
  )
}

function statusText(
  source: DiscoverySource,
) {
  if (!source.enabled) {
    return "En pause"
  }

  if (
    source.lastSyncStatus ===
    "SUCCESS"
  ) {
    return "Synchronisée"
  }

  if (
    source.lastSyncStatus ===
    "ERROR"
  ) {
    return "Erreur"
  }

  return "Prête"
}

function statusClasses(
  source: DiscoverySource,
) {
  if (!source.enabled) {
    return "bg-slate-100 text-slate-500 ring-slate-200"
  }

  if (
    source.lastSyncStatus ===
    "SUCCESS"
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100"
  }

  if (
    source.lastSyncStatus ===
    "ERROR"
  ) {
    return "bg-rose-50 text-rose-700 ring-rose-100"
  }

  return "bg-violet-50 text-violet-700 ring-violet-100"
}

async function readPayload(
  response: Response,
): Promise<ApiPayload> {
  try {
    return (
      await response.json()
    ) as ApiPayload
  }
  catch {
    return {}
  }
}

export function DiscoverySourcesPanel({
  initialSources,
}: Props) {
  const [
    sources,
    setSources,
  ] =
    useState(
      initialSources,
    )

  const [
    provider,
    setProvider,
  ] =
    useState<Provider>(
      "GREENHOUSE",
    )

  const [
    company,
    setCompany,
  ] =
    useState("")

  const [
    boardKey,
    setBoardKey,
  ] =
    useState("")

  const [
    showForm,
    setShowForm,
  ] =
    useState(
      initialSources.length === 0,
    )

  const [
    creating,
    setCreating,
  ] =
    useState(false)

  const [
    pendingId,
    setPendingId,
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

  const [
    syncingAll,
    setSyncingAll,
  ] =
    useState(false)

  const activeCount =
    useMemo(
      () =>
        sources.filter(
          (source) =>
            source.enabled,
        ).length,
      [sources],
    )

  async function createSource(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      creating
    ) {
      return
    }

    const cleanCompany =
      company.trim()

    const cleanBoardKey =
      boardKey.trim()

    if (
      !cleanCompany ||
      !cleanBoardKey
    ) {
      setError(
        "Renseignez l'entreprise et l'identifiant du job board.",
      )

      return
    }

    setError(null)
    setCreating(true)

    try {
      const response =
        await csrfFetch(
          "/api/discovery/sources",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body:
              JSON.stringify({
                provider,
                company:
                  cleanCompany,
                boardKey:
                  cleanBoardKey,
              }),
          },
        )

      const payload =
        await readPayload(
          response,
        )

      if (
        !response.ok ||
        !payload.source
      ) {
        throw new Error(
          payload.error ||
            "Impossible d'ajouter cette source.",
        )
      }

      setSources(
        (current) => {
          const withoutExisting =
            current.filter(
              (source) =>
                source.id !==
                payload.source!.id,
            )

          return [
            payload.source!,
            ...withoutExisting,
          ]
        },
      )

      setCompany("")
      setBoardKey("")
      setShowForm(false)
    }
    catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Une erreur est survenue.",
      )
    }
    finally {
      setCreating(false)
    }
  }

  async function toggleSource(
    source: DiscoverySource,
  ) {
    if (pendingId) {
      return
    }

    setError(null)
    setPendingId(
      source.id,
    )

    try {
      const response =
        await csrfFetch(
          `/api/discovery/sources/${source.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body:
              JSON.stringify({
                enabled:
                  !source.enabled,
              }),
          },
        )

      const payload =
        await readPayload(
          response,
        )

      if (
        !response.ok ||
        !payload.source
      ) {
        throw new Error(
          payload.error ||
            "Impossible de modifier cette source.",
        )
      }

      setSources(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              source.id
                ? payload.source!
                : item,
          ),
      )
    }
    catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Une erreur est survenue.",
      )
    }
    finally {
      setPendingId(null)
    }
  }

  async function syncAllSources() {
    if (
      syncingAll ||
      pendingId ||
      activeCount === 0
    ) {
      return
    }

    setError(null)
    setSyncingAll(true)

    try {
      const response =
        await csrfFetch(
          "/api/discovery/sources/sync-all",
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
          total?: number
          succeeded?: number
          failed?: number
          error?: string
        }

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "La synchronisation globale a échoué.",
        )
      }

      window.location.reload()
    }
    catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "La synchronisation globale a échoué.",
      )
    }
    finally {
      setSyncingAll(false)
    }
  }

  async function syncSource(
    source: DiscoverySource,
  ) {
    if (
      pendingId ||
      !source.enabled
    ) {
      return
    }

    setError(null)
    setPendingId(
      source.id,
    )

    try {
      const response =
        await csrfFetch(
          `/api/discovery/sources/${source.id}/sync`,
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
        await readPayload(
          response,
        )

      if (
        !response.ok ||
        !payload.source
      ) {
        throw new Error(
          payload.error ||
            "La synchronisation a échoué.",
        )
      }

      setSources(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              source.id
                ? payload.source!
                : item,
          ),
      )

      window.location.reload()
    }
    catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "La synchronisation a échoué.",
      )
    }
    finally {
      setPendingId(null)
    }
  }

  async function deleteSource(
    source: DiscoverySource,
  ) {
    if (pendingId) {
      return
    }

    const confirmed =
      window.confirm(
        `Supprimer la source ${source.company} ? Les offres déjà découvertes seront conservées.`,
      )

    if (!confirmed) {
      return
    }

    setError(null)
    setPendingId(
      source.id,
    )

    try {
      const response =
        await csrfFetch(
          `/api/discovery/sources/${source.id}`,
          {
            method:
              "DELETE",

            headers: {
              Accept:
                "application/json",
            },
          },
        )

      const payload =
        await readPayload(
          response,
        )

      if (
        !response.ok ||
        !payload.deleted
      ) {
        throw new Error(
          payload.error ||
            "Impossible de supprimer cette source.",
        )
      }

      setSources(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              source.id,
          ),
      )
    }
    catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Une erreur est survenue.",
      )
    }
    finally {
      setPendingId(null)
    }
  }

  return (
    <section className="mt-5 overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-[0_18px_55px_rgba(63,46,107,0.07)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-600">
            <CloudCog className="size-4.5" />
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-black tracking-tight text-slate-950">
                Sources Discovery
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                {activeCount} active
                {activeCount > 1
                  ? "s"
                  : ""}
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Connectez vos job boards ATS pour alimenter automatiquement votre radar.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={
              syncingAll ||
              activeCount === 0
            }
            onClick={() =>
              void syncAllSources()
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-50 px-4 text-[11px] font-bold text-violet-700 ring-1 ring-violet-100 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:ring-slate-100"
          >
            {syncingAll ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}

            {syncingAll
              ? "Synchronisation..."
              : "Synchroniser tout"}
          </button>

          <button
            type="button"
            onClick={() => {
              setError(null)

              setShowForm(
                (current) =>
                  !current,
              )
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-[11px] font-bold text-white transition hover:bg-slate-800"
          >
            {showForm ? (
              <X className="size-3.5" />
            ) : (
              <Plus className="size-3.5" />
            )}

            {showForm
              ? "Fermer"
              : "Ajouter une source"}
          </button>
        </div>
      </div>

      {showForm ? (
        <form
          onSubmit={
            createSource
          }
          className="border-b border-slate-100 bg-slate-50/60 p-5 sm:p-6"
        >
          <div className="grid gap-3 lg:grid-cols-[0.8fr_1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                ATS
              </span>

              <div className="relative">
                <select
                  value={
                    provider
                  }
                  onChange={
                    (event) =>
                      setProvider(
                        event.target
                          .value as Provider,
                      )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100/60"
                >
                  <option value="GREENHOUSE">
                    Greenhouse
                  </option>

                  <option value="LEVER">
                    Lever
                  </option>

                  <option value="ASHBY">
                    Ashby
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                Entreprise
              </span>

              <input
                value={
                  company
                }
                onChange={
                  (event) =>
                    setCompany(
                      event.target.value,
                    )
                }
                placeholder="Ex. OpenAI"
                maxLength={120}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100/60"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                Board key
              </span>

              <input
                value={
                  boardKey
                }
                onChange={
                  (event) =>
                    setBoardKey(
                      event.target.value,
                    )
                }
                placeholder="Identifiant du job board"
                maxLength={120}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100/60"
              />

              <span className="mt-1.5 block text-[10px] font-medium text-slate-400">
                {PROVIDER_HELP[
                  provider
                ]}
              </span>
            </label>

            <button
              type="submit"
              disabled={
                creating
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-[11px] font-bold text-white shadow-lg shadow-violet-600/15 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {creating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}

              {creating
                ? "Ajout..."
                : "Connecter"}
            </button>
          </div>
        </form>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mx-5 mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-semibold text-rose-700 sm:mx-6"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />

          <span>
            {error}
          </span>
        </div>
      ) : null}

      {sources.length === 0 ? (
        <div className="px-5 py-10 text-center sm:px-6">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-50 text-slate-400">
            <Server className="size-5" />
          </span>

          <h3 className="mt-4 text-sm font-black text-slate-900">
            Aucune source connectée
          </h3>

          <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
            Ajoutez un job board Greenhouse, Lever ou Ashby pour commencer la découverte automatique.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {sources.map(
            (source) => {
              const pending =
                pendingId ===
                source.id

              return (
                <div
                  key={
                    source.id
                  }
                  className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50/50 sm:px-6 xl:flex-row xl:items-center xl:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-[10px] font-black text-white">
                      {source.provider ===
                      "GREENHOUSE"
                        ? "GH"
                        : source.provider ===
                            "LEVER"
                          ? "LV"
                          : source.provider ===
                              "ASHBY"
                            ? "AS"
                            : "ATS"}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-xs font-black text-slate-900">
                          {source.company}
                        </p>

                        <span
                          className={[
                            "rounded-full px-2 py-1 text-[9px] font-extrabold ring-1",
                            statusClasses(
                              source,
                            ),
                          ].join(" ")}
                        >
                          {statusText(
                            source,
                          )}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-slate-400">
                        <span>
                          {source.provider ===
                          "OTHER"
                            ? "Autre"
                            : PROVIDER_LABELS[
                                source.provider
                              ]}
                        </span>

                        <span>
                          •
                        </span>

                        <span className="font-mono">
                          {source.boardKey}
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          Dernier scan :{" "}
                          {relativeDate(
                            source.lastSyncAt,
                          )}
                        </span>
                      </div>

                      {source.lastSyncError ? (
                        <p className="mt-1.5 max-w-2xl truncate text-[10px] font-semibold text-rose-600">
                          {source.lastSyncError}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        pending
                      }
                      onClick={() =>
                        void toggleSource(
                          source,
                        )
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {pending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : source.enabled ? (
                        <Pause className="size-3.5" />
                      ) : (
                        <Play className="size-3.5" />
                      )}

                      {source.enabled
                        ? "Mettre en pause"
                        : "Activer"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        pending ||
                        !source.enabled ||
                        source.provider ===
                          "OTHER"
                      }
                      onClick={() =>
                        void syncSource(
                          source,
                        )
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-violet-50 px-3 text-[10px] font-bold text-violet-700 ring-1 ring-violet-100 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:ring-slate-100"
                    >
                      {pending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : source.lastSyncStatus ===
                        "SUCCESS" ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <RefreshCw className="size-3.5" />
                      )}

                      Synchroniser
                    </button>

                    <button
                      type="button"
                      disabled={
                        pending
                      }
                      aria-label={`Supprimer ${source.company}`}
                      title="Supprimer la source"
                      onClick={() =>
                        void deleteSource(
                          source,
                        )
                      }
                      className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )
            },
          )}
        </div>
      )}
    </section>
  )
}