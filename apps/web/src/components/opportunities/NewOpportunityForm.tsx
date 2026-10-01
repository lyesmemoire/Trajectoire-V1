"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Link2,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react"

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"

const fieldClass =
  "w-full border border-calm-line bg-calm-bg text-sm text-calm-ink outline-none transition placeholder:text-calm-tertiary focus:border-calm-accent-line focus:ring-4 focus:ring-calm-accent-line"

export function NewOpportunityForm() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError(null)

    if (!title.trim() || !description.trim()) {
      setError("Le poste et la description de l'offre sont obligatoires.")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/opportunities", {
        method: "POST",
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
          status: "TO_ANALYZE",
          nextAction: "Analyser cette opportunité avec mon profil",
        }),
      })

      const payload = (await response.json()) as {
        opportunity?: {
          id: string
        }
        error?: string
      }

      if (!response.ok || !payload.opportunity) {
        throw new Error(payload.error || "Impossible d'ajouter l'opportunité.")
      }

      router.push("/opportunities")
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
    <div className="mx-auto max-w-5xl pb-12">
      <Link
        href="/opportunities"
        className={`mb-5 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-calm-secondary transition hover:text-calm-ink ${focusRing}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux opportunités
      </Link>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[30px] border border-calm-line bg-calm-surface p-6 sm:p-8"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-calm-accent-soft text-calm-accent ring-1 ring-inset ring-calm-accent-line">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-calm-ink sm:text-3xl">
            Ajouter une opportunité
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-calm-secondary">
            Colle une offre qui t&apos;intéresse. Elle rejoint ton pipeline et
            servira ensuite de contexte pour le matching, ton CV et tes
            simulations d&apos;entretien.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
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
                className={`h-12 rounded-2xl px-4 ${fieldClass}`}
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
                className={`h-12 rounded-2xl px-4 ${fieldClass}`}
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
                className={`h-12 rounded-2xl px-4 ${fieldClass}`}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-calm-ink">
                <Link2 className="h-4 w-4 text-calm-tertiary" />
                URL de l&apos;offre
              </span>
              <input
                type="url"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://..."
                className={`h-12 rounded-2xl px-4 ${fieldClass}`}
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-calm-ink">
              <Sparkles className="h-4 w-4 text-calm-accent" />
              Description de l&apos;offre *
            </span>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={50_000}
              rows={14}
              placeholder="Colle ici la description complète du poste, les missions, compétences attendues, séniorité, avantages..."
              className={`resize-y rounded-[22px] p-4 leading-6 ${fieldClass}`}
            />

            <div className="mt-1.5 text-right text-xs text-calm-tertiary">
              {description.length.toLocaleString("fr-FR")} / 50 000
            </div>
          </label>

          {error ? (
            <div
              role="alert"
              className="mt-4 rounded-2xl bg-calm-warn-soft px-4 py-3 text-sm font-medium text-calm-warn ring-1 ring-calm-warn-line"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/opportunities"
              className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-bold text-calm-secondary transition hover:bg-calm-accent-wash hover:text-calm-ink ${focusRing}`}
            >
              Annuler
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-calm-accent px-6 text-sm font-bold text-white shadow-lg shadow-calm-ink/10 transition hover:bg-calm-accent disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ajout...
                </>
              ) : (
                <>
                  Ajouter au pipeline
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-[26px] bg-gradient-to-br from-calm-accent-soft via-calm-accent-soft to-transparent p-5 text-calm-ink ring-1 ring-calm-accent-line">
            <Sparkles className="h-5 w-5 text-calm-accent" />

            <h2 className="mt-4 text-lg font-bold text-calm-ink">
              Bientôt : analyse intelligente
            </h2>

            <p className="mt-2 text-sm leading-6 text-calm-secondary">
              Trajectoire utilisera cette offre avec ton CV et ton profil pour
              mesurer le fit réel et identifier les écarts à traiter.
            </p>
          </div>

          <div className="rounded-[26px] border border-calm-line bg-calm-surface p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-calm-tertiary">
              Ce que nous allons connecter
            </p>

            <div className="mt-4 space-y-4">
              {[
                "Score de compatibilité",
                "Compétences fortes et manquantes",
                "Adaptation du CV",
                "Préparation entretien",
                "Prochaine meilleure action",
              ].map((item, index) => (
                <div key={item} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-calm-accent-soft text-[11px] font-bold text-calm-accent ring-1 ring-inset ring-calm-accent-line">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium leading-6 text-calm-ink">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
