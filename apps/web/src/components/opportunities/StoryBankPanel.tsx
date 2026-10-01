"use client"

import {
  BookOpen,
  BrainCircuit,
  Check,
  Link2,
  Loader2,
  Plus,
  Sparkles,
  Star,
  Unlink,
  X,
} from "lucide-react"
import {
  type FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react"

type OpportunityLink = {
  opportunityId: string
  relevance: number | null
  reason: string | null
  selected: boolean
}

type CareerStory = {
  id: string
  title: string
  situation: string
  task: string
  action: string
  result: string
  skills: string[]
  tags: string[]
  confidence: number
  isFavorite: boolean
  source: string | null
  opportunities: OpportunityLink[]
  linkedToOpportunity?: boolean
}

type StoryResponse = {
  stories?: CareerStory[]
  error?: string
}

type StoryForm = {
  title: string
  situation: string
  task: string
  action: string
  result: string
  skills: string
  tags: string
}

const EMPTY_FORM: StoryForm = {
  title: "",
  situation: "",
  task: "",
  action: "",
  result: "",
  skills: "",
  tags: "",
}

function splitValues(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  )
}

export function StoryBankPanel({
  opportunityId,
}: {
  opportunityId: string
}) {
  const [stories, setStories] = useState<CareerStory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recommending, setRecommending] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyStoryId, setBusyStoryId] =
    useState<string | null>(null)

  const [form, setForm] =
    useState<StoryForm>(EMPTY_FORM)

  const loadStories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/stories?opportunity=${encodeURIComponent(
          opportunityId,
        )}`,
        {
          cache: "no-store",
        },
      )

      const payload =
        (await response.json()) as StoryResponse

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Impossible de charger la Story Bank",
        )
      }

      setStories(
        Array.isArray(payload.stories)
          ? payload.stories
          : [],
      )
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger la Story Bank",
      )
    } finally {
      setLoading(false)
    }
  }, [opportunityId])

  useEffect(() => {
    void loadStories()
  }, [loadStories])

  async function createStory(event: FormEvent) {
    event.preventDefault()

    if (
      !form.title.trim() ||
      !form.situation.trim() ||
      !form.task.trim() ||
      !form.action.trim() ||
      !form.result.trim()
    ) {
      setError(
        "Complète les cinq éléments STAR avant d’enregistrer.",
      )
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          situation: form.situation,
          task: form.task,
          action: form.action,
          result: form.result,
          skills: splitValues(form.skills),
          tags: splitValues(form.tags),
          source: "APPLICATION_WORKSPACE",
          confidence: 100,
        }),
      })

      const payload = (await response.json()) as {
        story?: CareerStory
        error?: string
      }

      if (!response.ok || !payload.story) {
        throw new Error(
          payload.error ||
            "Impossible de créer cette histoire",
        )
      }

      const linkResponse = await fetch(
        `/api/opportunities/${opportunityId}/stories/${payload.story.id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            selected: true,
            relevance: null,
            reason:
              "Ajoutée depuis le workspace de cette opportunité.",
          }),
        },
      )

      if (!linkResponse.ok) {
        const linkPayload =
          (await linkResponse.json()) as {
            error?: string
          }

        throw new Error(
          linkPayload.error ||
            "Histoire créée mais rattachement impossible",
        )
      }

      setForm(EMPTY_FORM)
      setShowForm(false)

      await loadStories()
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d’enregistrer l’histoire",
      )
    } finally {
      setSaving(false)
    }
  }

  async function recommendStories() {
    setRecommending(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/opportunities/${opportunityId}/stories/recommend`,
        {
          method: "POST",
        },
      )

      const payload =
        (await response.json()) as {
          error?: string
          recommended?: number
        }

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Impossible d’analyser les histoires",
        )
      }

      await loadStories()
    } catch (recommendError) {
      setError(
        recommendError instanceof Error
          ? recommendError.message
          : "Impossible d’analyser les histoires",
      )
    } finally {
      setRecommending(false)
    }
  }
  async function toggleLink(story: CareerStory) {
    setBusyStoryId(story.id)
    setError(null)

    try {
      const isLinked =
        story.linkedToOpportunity === true

      const response = await fetch(
        `/api/opportunities/${opportunityId}/stories/${story.id}`,
        isLinked
          ? {
              method: "DELETE",
            }
          : {
              method: "PUT",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                selected: true,
              }),
            },
      )

      if (!response.ok) {
        const payload =
          (await response.json()) as {
            error?: string
          }

        throw new Error(
          payload.error ||
            "Impossible de modifier le rattachement",
        )
      }

      await loadStories()
    } catch (linkError) {
      setError(
        linkError instanceof Error
          ? linkError.message
          : "Impossible de modifier le rattachement",
      )
    } finally {
      setBusyStoryId(null)
    }
  }

  async function toggleFavorite(story: CareerStory) {
    setBusyStoryId(story.id)
    setError(null)

    try {
      const response = await fetch(
        `/api/stories/${story.id}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            isFavorite: !story.isFavorite,
          }),
        },
      )

      if (!response.ok) {
        const payload =
          (await response.json()) as {
            error?: string
          }

        throw new Error(
          payload.error ||
            "Impossible de modifier le favori",
        )
      }

      await loadStories()
    } catch (favoriteError) {
      setError(
        favoriteError instanceof Error
          ? favoriteError.message
          : "Impossible de modifier le favori",
      )
    } finally {
      setBusyStoryId(null)
    }
  }

  const linkedCount = stories.filter(
    (story) => story.linkedToOpportunity,
  ).length

  return (
    <section
      id="story-bank"
      className="rounded-[28px] border border-calm-line bg-calm-surface p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-calm-accent-soft p-3 text-calm-accent ring-1 ring-inset ring-calm-accent-line">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-calm-accent">
              Story Intelligence
            </p>

            <h2 className="mt-1 text-xl font-semibold text-calm-ink">
              Story Bank
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-calm-secondary">
              Construis des preuves STAR réutilisables et
              sélectionne celles qui racontent le mieux ton
              impact pour cette candidature.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={recommending || stories.length === 0}
            onClick={() => void recommendStories()}
            className="inline-flex items-center gap-2 rounded-2xl border border-calm-accent-line bg-calm-accent-soft px-4 py-2.5 text-sm font-semibold text-calm-accent transition hover:bg-calm-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {recommending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="h-4 w-4" />
            )}

            Suggérer les meilleures
          </button>

          <button
            type="button"
            onClick={() => {
              setError(null)
              setShowForm((current) => !current)
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-calm-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-accent-deep"
          >
            {showForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            {showForm
              ? "Fermer"
              : "Nouvelle histoire"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StoryMetric
          label="Histoires"
          value={stories.length}
        />

        <StoryMetric
          label="Sélectionnées"
          value={linkedCount}
        />

        <StoryMetric
          label="Favorites"
          value={
            stories.filter(
              (story) => story.isFavorite,
            ).length
          }
        />
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-calm-warn-line bg-calm-warn-soft px-4 py-3 text-sm text-calm-warn">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={createStory}
          className="mt-6 rounded-[24px] border border-calm-accent-line bg-calm-accent-soft p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 text-calm-accent">
            <Sparkles className="h-4 w-4" />
            <p className="text-sm font-semibold">
              Construire une histoire STAR
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            <Field
              label="Titre"
              value={form.title}
              placeholder="Ex. Relance d’un projet stratégique"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  title: value,
                }))
              }
            />

            <TextArea
              label="Situation"
              value={form.situation}
              placeholder="Quel était le contexte ?"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  situation: value,
                }))
              }
            />

            <TextArea
              label="Tâche"
              value={form.task}
              placeholder="Quel objectif ou problème devais-tu résoudre ?"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  task: value,
                }))
              }
            />

            <TextArea
              label="Action"
              value={form.action}
              placeholder="Qu’as-tu personnellement fait ?"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  action: value,
                }))
              }
            />

            <TextArea
              label="Résultat"
              value={form.result}
              placeholder="Quel impact concret as-tu produit ?"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  result: value,
                }))
              }
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Compétences"
                value={form.skills}
                placeholder="Leadership, SQL, négociation..."
                help="Sépare les éléments par des virgules."
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    skills: value,
                  }))
                }
              />

              <Field
                label="Tags"
                value={form.tags}
                placeholder="Transformation, conflit, croissance..."
                help="Sépare les éléments par des virgules."
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    tags: value,
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-calm-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}

              Enregistrer et sélectionner
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex min-h-44 items-center justify-center rounded-[24px] border border-dashed border-calm-line bg-calm-accent-wash">
            <Loader2 className="h-5 w-5 animate-spin text-calm-accent" />
          </div>
        ) : stories.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-calm-accent-line bg-calm-accent-soft px-6 py-10 text-center">
            <BookOpen className="mx-auto h-7 w-7 text-calm-accent" />

            <p className="mt-4 font-semibold text-calm-ink">
              Ta Story Bank est vide
            </p>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-calm-secondary">
              Commence par une réussite dont tu es fier.
              Elle pourra ensuite être réutilisée dans
              plusieurs candidatures et simulations.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {stories.map((story) => {
              const linked =
                story.linkedToOpportunity === true

              const opportunityLink =
                story.opportunities.find(
                  (link) =>
                    link.opportunityId ===
                    opportunityId,
                )

              const busy =
                busyStoryId === story.id

              return (
                <article
                  key={story.id}
                  className={
                    linked
                      ? "rounded-[24px] border border-calm-accent-line bg-calm-accent-soft p-5"
                      : "rounded-[24px] border border-calm-line bg-calm-accent-wash p-5"
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {linked && (
                          <span className="rounded-full bg-calm-accent-soft px-2.5 py-1 text-[11px] font-semibold text-calm-accent">
                            Sélectionnée
                          </span>
                        )}

                        <span className="rounded-full bg-calm-accent-wash px-2.5 py-1 text-[11px] font-semibold text-calm-secondary">
                          Confiance {story.confidence}%
                        </span>
                        {opportunityLink?.relevance !== null &&
                          opportunityLink?.relevance !== undefined && (
                            <span className="rounded-full bg-calm-accent-soft px-2.5 py-1 text-[11px] font-semibold text-calm-accent">
                              Pertinence {opportunityLink.relevance}%
                            </span>
                          )}
                      </div>

                      <h3 className="mt-3 text-base font-semibold text-calm-ink">
                        {story.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void toggleFavorite(story)
                      }
                      className="rounded-xl p-2 text-calm-tertiary transition hover:bg-calm-accent-wash hover:text-calm-warn disabled:opacity-50"
                      aria-label={
                        story.isFavorite
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"
                      }
                    >
                      <Star
                        className={
                          story.isFavorite
                            ? "h-4 w-4 fill-current text-calm-warn"
                            : "h-4 w-4"
                        }
                      />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <StarSection
                      label="Situation"
                      value={story.situation}
                    />

                    <StarSection
                      label="Action"
                      value={story.action}
                    />

                    <StarSection
                      label="Résultat"
                      value={story.result}
                    />
                  </div>

                  {opportunityLink?.reason && (
                    <div className="mt-4 rounded-2xl border border-calm-accent-line bg-calm-accent-soft px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-calm-accent">
                        Pourquoi cette histoire
                      </p>

                      <p className="mt-1 text-sm leading-5 text-calm-accent">
                        {opportunityLink.reason}
                      </p>
                    </div>
                  )}
                  {story.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {story.skills
                        .slice(0, 6)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-calm-line bg-calm-accent-wash px-2.5 py-1 text-[11px] font-medium text-calm-secondary"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void toggleLink(story)
                    }
                    className={
                      linked
                        ? "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-calm-line bg-calm-accent-wash px-4 py-2.5 text-sm font-semibold text-calm-ink transition hover:border-calm-warn-line hover:text-calm-warn disabled:opacity-50"
                        : "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-calm-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-accent-deep disabled:opacity-50"
                    }
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : linked ? (
                      <Unlink className="h-4 w-4" />
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}

                    {linked
                      ? "Retirer de cette candidature"
                      : "Utiliser pour cette candidature"}
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function StoryMetric({
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

function StarSection({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-calm-accent">
        {label}
      </p>

      <p className="mt-1 line-clamp-3 text-sm leading-6 text-calm-secondary">
        {value}
      </p>
    </div>
  )
}

function Field({
  label,
  value,
  placeholder,
  help,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  help?: string
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

      {help && (
        <span className="mt-1.5 block text-xs text-calm-tertiary">
          {help}
        </span>
      )}
    </label>
  )
}

function TextArea({
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

      <textarea
        value={value}
        rows={3}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full resize-y rounded-2xl border border-calm-line bg-calm-bg px-4 py-3 text-sm text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
      />
    </label>
  )
}