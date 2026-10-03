"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BriefcaseBusiness,
  Building2,
  Link2,
  Loader2,
  MapPin,
  Pencil,
  Sparkles,
} from "lucide-react"
import { Modal } from "@/components/ui/modal"

type OpportunityData = {
  id: string
  title: string
  company: string | null
  location: string | null
  sourceUrl: string | null
  description: string
}

export function EditOpportunityForm({
  opportunity,
}: {
  opportunity: OpportunityData
}) {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(opportunity.title)
  const [company, setCompany] = useState(opportunity.company || "")
  const [location, setLocation] = useState(opportunity.location || "")
  const [sourceUrl, setSourceUrl] = useState(opportunity.sourceUrl || "")
  const [description, setDescription] = useState(opportunity.description || "")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpen() {
    setTitle(opportunity.title)
    setCompany(opportunity.company || "")
    setLocation(opportunity.location || "")
    setSourceUrl(opportunity.sourceUrl || "")
    setDescription(opportunity.description || "")
    setError(null)
    setIsOpen(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!title.trim() || !description.trim()) {
      setError("Le poste et la description de l'offre sont obligatoires.")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/opportunities/${opportunity.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          company,
          location,
          sourceUrl,
          source: sourceUrl ? "URL" : "MANUAL",
          description,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || "Impossible de modifier l'opportunité.")
      }

      setIsOpen(false)
      router.refresh()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Une erreur est survenue.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-calm-surface px-4 text-sm font-bold text-calm-ink ring-1 ring-inset ring-calm-line transition hover:bg-calm-accent-wash outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line"
      >
        <Pencil className="h-4 w-4 text-calm-tertiary" />
        Modifier
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => !submitting && setIsOpen(false)}
        title="Modifier l'opportunité"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-calm-ink">
                <BriefcaseBusiness className="h-4 w-4 text-calm-tertiary" />
                Poste *
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={200}
                placeholder="Ex. Product Manager Senior"
                className="h-11 w-full rounded-xl border border-calm-line bg-calm-bg px-4 text-sm text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-calm-ink">
                <Building2 className="h-4 w-4 text-calm-tertiary" />
                Entreprise
              </span>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                maxLength={200}
                placeholder="Ex. Qonto"
                className="h-11 w-full rounded-xl border border-calm-line bg-calm-bg px-4 text-sm text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-calm-ink">
                <MapPin className="h-4 w-4 text-calm-tertiary" />
                Localisation
              </span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                maxLength={200}
                placeholder="Ex. Paris · Hybride"
                className="h-11 w-full rounded-xl border border-calm-line bg-calm-bg px-4 text-sm text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-calm-ink">
                <Link2 className="h-4 w-4 text-calm-tertiary" />
                URL de l'offre
              </span>
              <input
                type="url"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://..."
                className="h-11 w-full rounded-xl border border-calm-line bg-calm-bg px-4 text-sm text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-calm-ink">
              <Sparkles className="h-4 w-4 text-calm-accent" />
              Description de l'offre *
            </span>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={50_000}
              rows={10}
              placeholder="Description complète du poste..."
              className="w-full resize-y rounded-xl border border-calm-line bg-calm-bg p-4 text-sm leading-6 text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"
            />
          </label>

          {error ? (
            <div
              role="alert"
              className="rounded-xl bg-calm-warn-soft px-4 py-3 text-sm font-medium text-calm-warn ring-1 ring-calm-warn-line"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold text-calm-secondary transition hover:bg-calm-accent-wash hover:text-calm-ink disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-calm-accent px-6 text-sm font-bold text-white shadow-md shadow-calm-ink/10 transition hover:bg-calm-accent-deep disabled:cursor-not-allowed disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
