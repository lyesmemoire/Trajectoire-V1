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
      <section className="mt-6 overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
              CV Tailoring IA
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-950">
              Optimiser pour cette opportunité
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Trajectoire va relire ton CV avec cette offre comme
              contexte et identifier précisément ce qu'il faut mieux
              mettre en avant.
            </p>

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-50 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

              <p className="text-xs leading-5 text-emerald-900">
                Les recommandations doivent rester strictement basées
                sur les preuves présentes dans ton CV. Les compétences
                ou résultats absents seront signalés comme des écarts,
                jamais inventés.
              </p>
            </div>

            {error ? (
              <div className="mt-4 flex gap-2 rounded-2xl bg-rose-50 p-3">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />

                <p className="text-sm font-semibold text-rose-800">
                  {error}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={generateTailoring}
              disabled={loading}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Optimisation en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
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
    <section className="mt-6 rounded-[28px] border border-violet-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            CV Tailoring terminé
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            Recommandations pour {opportunity.title}
          </h2>

          {opportunity.company ? (
            <p className="mt-1 text-sm text-slate-500">
              {opportunity.company}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={copyResult}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              Copié
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4" />
              Copier
            </>
          )}
        </button>
      </div>

      <div className="mt-6 whitespace-pre-wrap rounded-[22px] bg-slate-50 p-5 text-sm leading-7 text-slate-700">
        {result}
      </div>

      <button
        type="button"
        onClick={generateTailoring}
        disabled={loading}
        className="mt-5 inline-flex h-10 items-center gap-2 text-sm font-bold text-violet-700 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}

        Régénérer les recommandations
      </button>
    </section>
  )
}