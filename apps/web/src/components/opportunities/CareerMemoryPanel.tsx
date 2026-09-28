"use client"

import {
  Archive,
  BrainCircuit,
  Check,
  Link2,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Unlink,
  X,
  XCircle,
} from "lucide-react"
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type MemoryStatus =
  | "SUGGESTED"
  | "CONFIRMED"
  | "REJECTED"
  | "ARCHIVED"

type MemoryOrigin =
  | "USER_CONFIRMED"
  | "AI_DERIVED"
  | "IMPORTED"

type OpportunityMemoryLink = {
  opportunityId: string
  relevance: number | null
  reason: string | null
  selected: boolean
}

type CareerMemory = {
  id: string
  category: string
  key: string
  value: string
  origin: MemoryOrigin
  status: MemoryStatus
  confidence: number
  isFavorite: boolean
  opportunities: OpportunityMemoryLink[]
}

type MemoryForm = {
  category: string
  key: string
  value: string
}

const EMPTY_FORM: MemoryForm = {
  category: "achievement",
  key: "",
  value: "",
}

export function CareerMemoryPanel({
  opportunityId,
}: {
  opportunityId: string
}) {
  const [memories, setMemories] =
    useState<CareerMemory[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [recommending, setRecommending] =
    useState(false)

  const [showForm, setShowForm] =
    useState(false)

  const [busyId, setBusyId] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const [form, setForm] =
    useState<MemoryForm>(EMPTY_FORM)

  const loadMemories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/career-memory?opportunity=${encodeURIComponent(
          opportunityId,
        )}`,
        {
          cache: "no-store",
        },
      )

      const payload =
        (await response.json()) as {
          memories?: CareerMemory[]
          error?: string
        }

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Impossible de charger Career Memory",
        )
      }

      setMemories(
        Array.isArray(payload.memories)
          ? payload.memories
          : [],
      )
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger Career Memory",
      )
    } finally {
      setLoading(false)
    }
  }, [opportunityId])

  useEffect(() => {
    void loadMemories()
  }, [loadMemories])

  const metrics = useMemo(
    () => ({
      confirmed: memories.filter(
        (memory) =>
          memory.status === "CONFIRMED",
      ).length,

      suggested: memories.filter(
        (memory) =>
          memory.status === "SUGGESTED",
      ).length,

      selected: memories.filter(
        (memory) =>
          memory.opportunities.some(
            (link) =>
              link.opportunityId ===
                opportunityId &&
              link.selected,
          ),
      ).length,
    }),
    [memories, opportunityId],
  )

  async function createMemory(
    event: FormEvent,
  ) {
    event.preventDefault()

    if (
      !form.category.trim() ||
      !form.key.trim() ||
      !form.value.trim()
    ) {
      setError(
        "Complète la catégorie, le titre et le fait.",
      )
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch(
        "/api/career-memory",
        {
          method: "POST",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            category: form.category,
            key: form.key,
            value: form.value,
            origin: "USER_CONFIRMED",
            confidence: 100,
          }),
        },
      )

      const payload =
        (await response.json()) as {
          memory?: CareerMemory
          error?: string
        }

      if (!response.ok || !payload.memory) {
        throw new Error(
          payload.error ||
            "Impossible d’enregistrer ce fait",
        )
      }

      setForm(EMPTY_FORM)
      setShowForm(false)

      await loadMemories()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d’enregistrer ce fait",
      )
    } finally {
      setSaving(false)
    }
  }

  async function memoryAction(
    memory: CareerMemory,
    action:
      | "confirm"
      | "reject"
      | "archive",
  ) {
    setBusyId(memory.id)
    setError(null)

    try {
      const response = await fetch(
        `/api/career-memory/${memory.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        },
      )

      const payload =
        (await response.json()) as {
          error?: string
        }

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Impossible de modifier cette mémoire",
        )
      }

      await loadMemories()
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Impossible de modifier cette mémoire",
      )
    } finally {
      setBusyId(null)
    }
  }

  async function toggleFavorite(
    memory: CareerMemory,
  ) {
    setBusyId(memory.id)
    setError(null)

    try {
      const response = await fetch(
        `/api/career-memory/${memory.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            isFavorite:
              !memory.isFavorite,
          }),
        },
      )

      const payload =
        (await response.json()) as {
          error?: string
        }

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Impossible de modifier le favori",
        )
      }

      await loadMemories()
    } catch (favoriteError) {
      setError(
        favoriteError instanceof Error
          ? favoriteError.message
          : "Impossible de modifier le favori",
      )
    } finally {
      setBusyId(null)
    }
  }

  async function recommendMemories() {
    setRecommending(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/opportunities/${opportunityId}/memories/recommend`,
        {
          method: "POST",
        },
      )

      const payload =
        (await response.json()) as {
          error?: string
          recommendedCount?: number
        }

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Impossible d’analyser les mémoires utiles",
        )
      }

      await loadMemories()
    } catch (recommendError) {
      setError(
        recommendError instanceof Error
          ? recommendError.message
          : "Impossible d’analyser les mémoires utiles",
      )
    } finally {
      setRecommending(false)
    }
  }
  async function toggleSelection(
    memory: CareerMemory,
  ) {
    if (memory.status !== "CONFIRMED") {
      setError(
        "Confirme d’abord cette information avant de l’utiliser comme preuve.",
      )
      return
    }

    const link =
      memory.opportunities.find(
        (item) =>
          item.opportunityId ===
          opportunityId,
      )

    const selected =
      link?.selected === true

    setBusyId(memory.id)
    setError(null)

    try {
      const response = await fetch(
        `/api/opportunities/${opportunityId}/memories/${memory.id}`,
        {
          method: "PUT",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            selected: !selected,
            relevance:
              link?.relevance ?? null,
            reason:
              link?.reason ?? null,
          }),
        },
      )

      const payload =
        (await response.json()) as {
          error?: string
        }

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Impossible de modifier la sélection",
        )
      }

      await loadMemories()
    } catch (selectionError) {
      setError(
        selectionError instanceof Error
          ? selectionError.message
          : "Impossible de modifier la sélection",
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section
      id="career-memory"
      className="rounded-[28px] border border-white/[0.08] bg-zinc-900 p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 ring-1 ring-inset ring-indigo-400/20">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-400">
              Career Intelligence
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white/80">
              Career Memory
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              Une mémoire professionnelle durable :
              faits, forces et preuves que Trajectoire
              peut réutiliser sans inventer ton parcours.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={
              recommending ||
              metrics.confirmed === 0
            }
            onClick={() =>
              void recommendMemories()
            }
            className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/25 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {recommending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}

            Suggérer les mémoires utiles
          </button>

          <button
            type="button"
            onClick={() => {
              setError(null)
              setShowForm(
                (current) => !current,
              )
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
          {showForm ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}

            {showForm
              ? "Fermer"
              : "Ajouter un fait"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metric
          label="Confirmés"
          value={metrics.confirmed}
        />

        <Metric
          label="À confirmer"
          value={metrics.suggested}
        />

        <Metric
          label="Utilisés ici"
          value={metrics.selected}
        />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />

        <p className="text-sm leading-6 text-indigo-200">
          Une suggestion détectée par Trajectoire
          reste une hypothèse jusqu’à ta confirmation.
          Seuls les faits confirmés peuvent devenir
          des preuves actives pour cette candidature.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={createMemory}
          className="mt-6 rounded-[24px] border border-indigo-400/20 bg-indigo-500/[0.05] p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 text-indigo-300">
            <Sparkles className="h-4 w-4" />

            <p className="text-sm font-semibold">
              Ajouter un fait confirmé
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-white/80">
                Catégorie
              </span>

              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category:
                      event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-white/[0.1] bg-zinc-950 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15"
              >
                <option value="achievement">
                  Réussite
                </option>
                <option value="skill">
                  Compétence
                </option>
                <option value="experience">
                  Expérience
                </option>
                <option value="leadership">
                  Leadership
                </option>
                <option value="preference">
                  Préférence
                </option>
                <option value="career_goal">
                  Objectif de carrière
                </option>
              </select>
            </label>

            <Field
              label="Titre"
              value={form.key}
              placeholder="Ex. Management d’équipe"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  key: value,
                }))
              }
            />
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-white/80">
              Fait confirmé
            </span>

            <textarea
              rows={4}
              value={form.value}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  value:
                    event.target.value,
                }))
              }
              placeholder="Ex. J’ai dirigé une équipe de 8 personnes pendant 2 ans."
              className="mt-2 w-full resize-y rounded-2xl border border-white/[0.1] bg-zinc-950 px-4 py-3 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15"
            />
          </label>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}

              Enregistrer
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex min-h-44 items-center justify-center rounded-[24px] border border-dashed border-white/[0.1] bg-white/[0.02]">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          </div>
        ) : memories.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-indigo-400/20 bg-indigo-500/[0.05] px-6 py-10 text-center">
            <BrainCircuit className="mx-auto h-7 w-7 text-indigo-400" />

            <p className="mt-4 font-semibold text-white/80">
              Career Memory est vide
            </p>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/50">
              Ajoute une première information
              professionnelle fiable. Elle pourra
              ensuite enrichir plusieurs candidatures.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {memories.map((memory) => {
              const link =
                memory.opportunities.find(
                  (item) =>
                    item.opportunityId ===
                    opportunityId,
                )

              const selected =
                link?.selected === true

              const busy =
                busyId === memory.id

              return (
                <article
                  key={memory.id}
                  className={cardClass(
                    memory.status,
                    selected,
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                          status={memory.status}
                        />

                        <OriginBadge
                          origin={memory.origin}
                        />

                        {selected && (
                          <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">
                            Preuve active
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
                        {memory.category}
                      </p>

                      <h3 className="mt-1 text-base font-semibold text-white/80">
                        {memory.key}
                      </h3>
                    </div>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void toggleFavorite(
                          memory,
                        )
                      }
                      aria-label={
                        memory.isFavorite
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"
                      }
                      className="rounded-xl p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-amber-400 disabled:opacity-50"
                    >
                      <Star
                        className={
                          memory.isFavorite
                            ? "h-4 w-4 fill-current text-amber-500"
                            : "h-4 w-4"
                        }
                      />
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/80">
                    {memory.value}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/50">
                    <span>
                      Confiance {memory.confidence}%
                    </span>

                    {link?.relevance !== null &&
                      link?.relevance !== undefined && (
                        <span className="font-semibold text-indigo-300">
                          Pertinence {link.relevance}%
                        </span>
                      )}
                  </div>

                  {link?.reason && (
                    <div className="mt-4 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-300">
                        Contexte candidature
                      </p>

                      <p className="mt-1 text-sm leading-5 text-white/50">
                        {link.reason}
                      </p>
                    </div>
                  )}

                  {memory.status ===
                    "SUGGESTED" && (
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void memoryAction(
                            memory,
                            "confirm",
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}

                        Confirmer
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void memoryAction(
                            memory,
                            "reject",
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/25 bg-rose-500/5 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Rejeter
                      </button>
                    </div>
                  )}

                  {memory.status ===
                    "CONFIRMED" && (
                    <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void toggleSelection(
                            memory,
                          )
                        }
                        className={
                          selected
                            ? "inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-400/25 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20 disabled:opacity-50"
                            : "inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
                        }
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : selected ? (
                          <Unlink className="h-4 w-4" />
                        ) : (
                          <Link2 className="h-4 w-4" />
                        )}

                        {selected
                          ? "Retirer des preuves"
                          : "Utiliser comme preuve"}
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void memoryAction(
                            memory,
                            "archive",
                          )
                        }
                        aria-label="Archiver"
                        className="inline-flex items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.04] px-3 py-2.5 text-white/50 transition hover:bg-white/[0.08] hover:text-white/80 disabled:opacity-50"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {(memory.status ===
                    "REJECTED" ||
                    memory.status ===
                      "ARCHIVED") && (
                    <div className="mt-5 rounded-2xl bg-white/[0.05] px-4 py-3 text-xs font-medium text-white/50">
                      Cette information n’est pas
                      utilisée comme preuve active.
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function Metric({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-white/80">
        {value}
      </p>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: MemoryStatus
}) {
  if (status === "CONFIRMED") {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
        Confirmé
      </span>
    )
  }

  if (status === "SUGGESTED") {
    return (
      <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
        À confirmer
      </span>
    )
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
        Rejeté
      </span>
    )
  }

  return (
    <span className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-white/50">
      Archivé
    </span>
  )
}

function OriginBadge({
  origin,
}: {
  origin: MemoryOrigin
}) {
  const label =
    origin === "AI_DERIVED"
      ? "Suggestion IA"
      : origin === "IMPORTED"
        ? "Importé"
        : "Utilisateur"

  return (
    <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/50">
      {label}
    </span>
  )
}

function cardClass(
  status: MemoryStatus,
  selected: boolean,
) {
  if (selected) {
    return "rounded-[24px] border border-indigo-400/25 bg-indigo-500/[0.06] p-5"
  }

  if (status === "SUGGESTED") {
    return "rounded-[24px] border border-amber-400/25 bg-amber-500/[0.06] p-5"
  }

  if (
    status === "REJECTED" ||
    status === "ARCHIVED"
  ) {
    return "rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-5 opacity-75"
  }

  return "rounded-[24px] border border-emerald-400/20 bg-emerald-500/[0.04] p-5"
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/80">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/[0.1] bg-zinc-950 px-4 py-3 text-sm text-white/80 outline-none transition placeholder:text-white/30 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15"
      />
    </label>
  )
}