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
      className="rounded-[28px] border border-calm-line bg-calm-surface p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-calm-accent-soft p-3 text-calm-accent ring-1 ring-inset ring-calm-accent-line">
            <BrainCircuit className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-calm-accent">
              Career Intelligence
            </p>

            <h2 className="mt-1 text-xl font-semibold text-calm-ink">
              Career Memory
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-calm-secondary">
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
            className="inline-flex items-center gap-2 rounded-2xl border border-calm-accent-line bg-calm-accent-soft px-4 py-2.5 text-sm font-semibold text-calm-accent transition hover:bg-calm-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
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
            className="inline-flex items-center gap-2 rounded-2xl bg-calm-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-accent"
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

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-calm-accent-line bg-calm-accent-soft px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-calm-accent" />

        <p className="text-sm leading-6 text-calm-accent">
          Une suggestion détectée par Trajectoire
          reste une hypothèse jusqu’à ta confirmation.
          Seuls les faits confirmés peuvent devenir
          des preuves actives pour cette candidature.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-calm-warn-line bg-calm-warn-soft px-4 py-3 text-sm text-calm-warn">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={createMemory}
          className="mt-6 rounded-[24px] border border-calm-accent-line bg-calm-accent-soft p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 text-calm-accent">
            <Sparkles className="h-4 w-4" />

            <p className="text-sm font-semibold">
              Ajouter un fait confirmé
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-calm-ink">
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
                className="mt-2 w-full rounded-2xl border border-calm-line bg-calm-bg px-4 py-3 text-sm text-calm-ink outline-none transition focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
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
            <span className="text-sm font-semibold text-calm-ink">
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
              className="mt-2 w-full resize-y rounded-2xl border border-calm-line bg-calm-bg px-4 py-3 text-sm text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
            />
          </label>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-calm-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-accent disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="flex min-h-44 items-center justify-center rounded-[24px] border border-dashed border-calm-line bg-calm-accent-wash">
            <Loader2 className="h-5 w-5 animate-spin text-calm-accent" />
          </div>
        ) : memories.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-calm-accent-line bg-calm-accent-soft px-6 py-10 text-center">
            <BrainCircuit className="mx-auto h-7 w-7 text-calm-accent" />

            <p className="mt-4 font-semibold text-calm-ink">
              Career Memory est vide
            </p>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-calm-secondary">
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
                          <span className="rounded-full bg-calm-accent-soft px-2.5 py-1 text-[11px] font-semibold text-calm-accent">
                            Preuve active
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-calm-tertiary">
                        {memory.category}
                      </p>

                      <h3 className="mt-1 text-base font-semibold text-calm-ink">
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
                      className="rounded-xl p-2 text-calm-tertiary transition hover:bg-calm-accent-wash hover:text-calm-warn disabled:opacity-50"
                    >
                      <Star
                        className={
                          memory.isFavorite
                            ? "h-4 w-4 fill-current text-calm-warn"
                            : "h-4 w-4"
                        }
                      />
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-calm-ink">
                    {memory.value}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 text-xs text-calm-secondary">
                    <span>
                      Confiance {memory.confidence}%
                    </span>

                    {link?.relevance !== null &&
                      link?.relevance !== undefined && (
                        <span className="font-semibold text-calm-accent">
                          Pertinence {link.relevance}%
                        </span>
                      )}
                  </div>

                  {link?.reason && (
                    <div className="mt-4 rounded-2xl border border-calm-accent-line bg-calm-accent-soft px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-calm-accent">
                        Contexte candidature
                      </p>

                      <p className="mt-1 text-sm leading-5 text-calm-secondary">
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
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-calm-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-accent disabled:opacity-50"
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
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-calm-warn-line bg-calm-warn-soft px-4 py-2.5 text-sm font-semibold text-calm-warn transition hover:bg-calm-warn-soft disabled:opacity-50"
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
                            ? "inline-flex items-center justify-center gap-2 rounded-2xl border border-calm-accent-line bg-calm-accent-soft px-4 py-2.5 text-sm font-semibold text-calm-accent transition hover:bg-calm-accent-soft disabled:opacity-50"
                            : "inline-flex items-center justify-center gap-2 rounded-2xl bg-calm-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-accent disabled:opacity-50"
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
                        className="inline-flex items-center justify-center rounded-2xl border border-calm-line bg-calm-accent-wash px-3 py-2.5 text-calm-secondary transition hover:bg-calm-accent-soft hover:text-calm-ink disabled:opacity-50"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {(memory.status ===
                    "REJECTED" ||
                    memory.status ===
                      "ARCHIVED") && (
                    <div className="mt-5 rounded-2xl bg-calm-accent-wash px-4 py-3 text-xs font-medium text-calm-secondary">
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
    <div className="rounded-2xl border border-calm-line bg-calm-accent-wash px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-calm-tertiary">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-calm-ink">
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
      <span className="rounded-full bg-calm-accent-soft px-2.5 py-1 text-[11px] font-semibold text-calm-accent">
        Confirmé
      </span>
    )
  }

  if (status === "SUGGESTED") {
    return (
      <span className="rounded-full bg-calm-warn-soft px-2.5 py-1 text-[11px] font-semibold text-calm-warn">
        À confirmer
      </span>
    )
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-calm-warn-soft px-2.5 py-1 text-[11px] font-semibold text-calm-warn">
        Rejeté
      </span>
    )
  }

  return (
    <span className="rounded-full bg-calm-accent-soft px-2.5 py-1 text-[11px] font-semibold text-calm-secondary">
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
    <span className="rounded-full border border-calm-line bg-calm-accent-wash px-2.5 py-1 text-[11px] font-semibold text-calm-secondary">
      {label}
    </span>
  )
}

function cardClass(
  status: MemoryStatus,
  selected: boolean,
) {
  if (selected) {
    return "rounded-[24px] border border-calm-accent-line bg-calm-accent-soft p-5"
  }

  if (status === "SUGGESTED") {
    return "rounded-[24px] border border-calm-warn-line bg-calm-warn-soft p-5"
  }

  if (
    status === "REJECTED" ||
    status === "ARCHIVED"
  ) {
    return "rounded-[24px] border border-calm-line bg-calm-accent-wash p-5 opacity-75"
  }

  return "rounded-[24px] border border-calm-accent-line bg-calm-accent-soft p-5"
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
      <span className="text-sm font-semibold text-calm-ink">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-calm-line bg-calm-bg px-4 py-3 text-sm text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
      />
    </label>
  )
}