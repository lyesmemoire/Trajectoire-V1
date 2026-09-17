"use client"

import {
  useState,
} from "react"

import {
  Check,
  Clipboard,
  Loader2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react"

type OpportunityContext = {
  id: string
  title: string
  company: string | null
  description: string
  matchScore: number | null
  recommendationLabel: string | null
  strengths: string[]
  gaps: string[]
}

type Props = {
  file: File
  opportunity: OpportunityContext
}

export function OpportunityCVTailoring({
  file,
  opportunity,
}: Props) {
  const [loading, setLoading] =
    useState(false)

  const [result, setResult] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const [copied, setCopied] =
    useState(false)

  async function generateTailoring() {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const uploadForm =
        new FormData()

      uploadForm.append(
        "file",
        file,
      )

      const uploadResponse =
        await fetch(
          "/api/cv/upload",
          {
            method: "POST",
            body: uploadForm,
          },
        )

      const uploadPayload =
        (await uploadResponse.json()) as {
          error?: string
          extractedText?: string
        }

      if (
        !uploadResponse.ok ||
        !uploadPayload.extractedText
      ) {
        throw new Error(
          uploadPayload.error ||
            "Impossible de lire le CV.",
        )
      }


      const contextResponse =
        await fetch(
          `/api/opportunities/${opportunity.id}/application-context`,
          {
            method: "GET",
            cache: "no-store",
          },
        )

      const contextPayload =
        (await contextResponse.json()) as {
          success?: boolean
          context?: {
            plainText?: string
            evidenceCount?: number
          }
          error?: string
        }

      if (
        !contextResponse.ok ||
        !contextPayload.success ||
        !contextPayload.context?.plainText
      ) {
        throw new Error(
          contextPayload.error ||
            "Impossible de charger le contexte de candidature.",
        )
      }

      const context =
        contextPayload.context.plainText

      const rewriteResponse =
        await fetch(
          "/api/cv/rewrite",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              action:
                "tailor_opportunity",

              content:
                uploadPayload.extractedText,

              role:
                opportunity.title,

              context,
            }),
          },
        )

      const rewritePayload =
        (await rewriteResponse.json()) as {
          success?: boolean
          data?: string
          error?: string
        }

      if (
        !rewriteResponse.ok ||
        !rewritePayload.data
      ) {
        throw new Error(
          rewritePayload.error ||
            "Impossible de générer les recommandations ciblées.",
        )
      }

      setResult(
        rewritePayload.data,
      )
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Une erreur est survenue.",
      )
    } finally {
      setLoading(false)
    }
  }

  async function copyResult() {
    if (!result) return

    await navigator.clipboard.writeText(
      result,
    )

    setCopied(true)

    window.setTimeout(
      () =>
        setCopied(false),
      1800,
    )
  }

  if (!result) {
    return (
      <section className="mt-2 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Étape suivante — CV Tailoring IA
            </p>
            <h2 className="mt-1 font-serif text-xl font-medium text-foreground">
              Optimisez votre CV pour cette opportunité
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
              Trajectoire analyse votre CV au regard de cette offre et identifie
              précisément ce qu'il faut mieux mettre en avant pour maximiser vos chances.
            </p>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <p className="text-xs leading-relaxed text-emerald-800">
                Les recommandations sont basées exclusivement sur les preuves
                présentes dans votre CV — aucune expérience fictive ne sera ajoutée.
              </p>
            </div>

            {error ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-rose-600" />
                <p className="text-sm font-medium text-rose-800">{error}</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={generateTailoring}
              disabled={loading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Optimisation en cours...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Générer mes recommandations ciblées
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-2 rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
            CV Tailoring terminé
          </p>
          <h2 className="mt-1 font-serif text-xl font-medium text-foreground">
            Recommandations pour {opportunity.title}
          </h2>
          {opportunity.company ? (
            <p className="mt-0.5 text-sm text-foreground-muted">{opportunity.company}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={copyResult}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
        >
          {copied ? (
            <><Check className="size-4 text-emerald-600" />Copié</>
          ) : (
            <><Clipboard className="size-4" />Copier</>
          )}
        </button>
      </div>

      <div className="mt-5 whitespace-pre-wrap rounded-xl border border-border bg-background p-5 text-sm leading-7 text-foreground-muted">
        {result}
      </div>

      <button
        type="button"
        onClick={generateTailoring}
        disabled={loading}
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-600 transition hover:text-violet-800 disabled:opacity-50"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        Régénérer les recommandations
      </button>
    </section>
  )
}