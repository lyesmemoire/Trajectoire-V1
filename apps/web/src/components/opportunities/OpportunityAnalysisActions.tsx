"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Target,
  TriangleAlert,
  XCircle,
} from "lucide-react"

type Props = {
  opportunityId: string
  hasAnalysis: boolean
}

export function OpportunityAnalysisActions({
  opportunityId,
  hasAnalysis,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  async function analyze() {
    setLoading(true)
    setError(null)
    setErrorCode(null)

    try {
      const response = await fetch(
        `/api/opportunities/${opportunityId}/analyze`,
        {
          method: "POST",
        },
      )

      const payload = (await response.json()) as {
        error?: string
        code?: string
      }

      if (!response.ok) {
        setErrorCode(payload.code ?? null)
        throw new Error(
          payload.error || "Impossible d'analyser cette opportunité.",
        )
      }

      router.refresh()
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

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={analyze}
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-calm-accent px-5 text-sm font-bold text-white shadow-lg shadow-calm-ink/10 transition hover:bg-calm-accent disabled:cursor-not-allowed disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <BrainCircuit className="h-4 w-4" />
            {hasAnalysis
              ? "Actualiser l'analyse"
              : "Analyser avec mon profil"}
          </>
        )}
      </button>

      {error ? (
        <div className="rounded-md bg-calm-warn-soft p-4 ring-1 ring-calm-warn-line">
          <div className="flex gap-3">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-calm-warn" />

            <div>
              <p className="text-sm font-semibold text-calm-warn">
                {error}
              </p>

              {errorCode === "NO_CV" ||
              errorCode === "EMPTY_CV" ? (
                <Link
                  href={`/analyze?opportunity=${opportunityId}`}
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded text-sm font-bold text-calm-accent outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
                >
                  Analyser mon CV
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function RecommendationIcon({
  recommendation,
}: {
  recommendation: string | null
}) {
  if (recommendation === "APPLY") {
    return <CheckCircle2 className="h-5 w-5 text-calm-accent" />
  }

  if (recommendation === "SKIP") {
    return <XCircle className="h-5 w-5 text-calm-warn" />
  }

  return <Target className="h-5 w-5 text-calm-warn" />
}

export function FutureActions({
  opportunityId,
}: {
  opportunityId: string
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        href={`/analyze?opportunity=${opportunityId}`}
        className="group rounded-md border border-calm-line bg-calm-surface p-4 transition hover:border-calm-accent-line outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-calm-accent-soft text-calm-accent">
          <FileText className="h-4 w-4" />
        </div>

        <p className="mt-3 text-sm font-bold text-calm-ink">
          Adapter mon CV
        </p>

        <p className="mt-1 text-xs leading-5 text-calm-secondary">
          Utiliser cette opportunité comme contexte pour renforcer le CV.
        </p>

        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-calm-accent">
          Continuer
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </div>
      </Link>

      <Link
        href={`/simulation/new?opportunity=${opportunityId}`}
        className="group rounded-md border border-calm-line bg-calm-surface p-4 transition hover:border-calm-accent-line outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-calm-accent-soft text-calm-accent">
          <Sparkles className="h-4 w-4" />
        </div>

        <p className="mt-3 text-sm font-bold text-calm-ink">
          Préparer l'entretien
        </p>

        <p className="mt-1 text-xs leading-5 text-calm-secondary">
          Préparer une simulation contextualisée sur cette opportunité.
        </p>

        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-calm-accent">
          Continuer
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </div>
      </Link>
    </div>
  )
}

type OpportunityStatus =
  | "DISCOVERED"
  | "TO_ANALYZE"
  | "TO_APPLY"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "ARCHIVED"

type StatusAction = {
  status: OpportunityStatus
  label: string
  confirm?: string
}

const STATUS_ACTIONS: Record<
  OpportunityStatus,
  StatusAction[]
> = {
  DISCOVERED: [
    {
      status: "TO_ANALYZE",
      label: "À analyser",
    },
    {
      status: "ARCHIVED",
      label: "Archiver",
    },
  ],

  TO_ANALYZE: [
    {
      status: "TO_APPLY",
      label: "Je veux candidater",
    },
    {
      status: "ARCHIVED",
      label: "Archiver",
    },
  ],

  TO_APPLY: [
    {
      status: "APPLIED",
      label: "Candidature envoyée",
    },
    {
      status: "TO_ANALYZE",
      label: "Revenir à l'analyse",
    },
    {
      status: "ARCHIVED",
      label: "Archiver",
    },
  ],

  APPLIED: [
    {
      status: "INTERVIEW",
      label: "Entretien obtenu",
    },
    {
      status: "REJECTED",
      label: "Candidature rejetée",
      confirm:
        "Marquer cette candidature comme rejetée ?",
    },
    {
      status: "ARCHIVED",
      label: "Archiver",
    },
  ],

  INTERVIEW: [
    {
      status: "OFFER",
      label: "Offre reçue",
    },
    {
      status: "REJECTED",
      label: "Candidature rejetée",
      confirm:
        "Marquer cette candidature comme rejetée ?",
    },
    {
      status: "ARCHIVED",
      label: "Archiver",
    },
  ],

  OFFER: [
    {
      status: "ARCHIVED",
      label: "Archiver",
    },
  ],

  REJECTED: [
    {
      status: "ARCHIVED",
      label: "Archiver",
    },
  ],

  ARCHIVED: [
    {
      status: "TO_ANALYZE",
      label: "Réactiver",
    },
  ],
}

export function OpportunityStatusActions({
  opportunityId,
  status,
  recommendation,
}: {
  opportunityId: string
  status: OpportunityStatus
  recommendation: string | null
}) {
  const router = useRouter()

  const [updatingStatus, setUpdatingStatus] =
    useState<OpportunityStatus | null>(null)

  const [statusError, setStatusError] =
    useState<string | null>(null)

  const actions = STATUS_ACTIONS[status]

  async function updateStatus(
    action: StatusAction,
  ) {
    if (action.confirm) {
      const accepted =
        window.confirm(action.confirm)

      if (!accepted) {
        return
      }
    }

    setUpdatingStatus(action.status)
    setStatusError(null)

    try {
      const response = await fetch(
        `/api/opportunities/${opportunityId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: action.status,
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
            "Impossible de mettre à jour l'opportunité.",
        )
      }

      router.refresh()
    } catch (caughtError) {
      setStatusError(
        caughtError instanceof Error
          ? caughtError.message
          : "Une erreur est survenue.",
      )
    } finally {
      setUpdatingStatus(null)
    }
  }

  return (
    <div className="rounded-md border border-calm-line bg-calm-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-calm-accent">
            Décision & suivi
          </p>

          <h2 className="mt-2 text-lg font-bold text-calm-ink">
            Piloter cette opportunité
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-calm-secondary">
            Trajectoire recommande. La décision et les changements
            d'étape restent toujours sous ton contrôle.
          </p>
        </div>

        <span className="rounded-full bg-calm-accent-wash px-3 py-1.5 text-xs font-bold text-calm-ink">
          {status.replaceAll("_", " ")}
        </span>
      </div>

      {recommendation === "APPLY" &&
      status === "TO_ANALYZE" ? (
        <div className="mt-5 rounded-md bg-calm-accent-soft p-4 ring-1 ring-calm-accent-line">
          <p className="text-sm font-bold text-calm-accent">
            Trajectoire recommande cette candidature.
          </p>

          <p className="mt-1 text-xs leading-5 text-calm-accent">
            Rien ne sera déplacé dans ton pipeline avant ta décision.
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {actions.map((action) => {
          const loading =
            updatingStatus === action.status

          const primary =
            action.status === "TO_APPLY" ||
            action.status === "APPLIED" ||
            action.status === "INTERVIEW" ||
            action.status === "OFFER"

          return (
            <button
              key={action.status}
              type="button"
              disabled={updatingStatus !== null}
              onClick={() =>
                updateStatus(action)
              }
              className={
                primary
                  ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-calm-accent px-4 text-sm font-bold text-white transition hover:bg-calm-accent disabled:cursor-not-allowed disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
                  : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-calm-line bg-calm-accent-wash px-4 text-sm font-bold text-calm-ink transition hover:bg-calm-accent-soft disabled:cursor-not-allowed disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
              }
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}

              {action.label}
            </button>
          )
        })}
      </div>

      {statusError ? (
        <p className="mt-4 rounded-md bg-calm-warn-soft p-3 text-sm font-semibold text-calm-warn">
          {statusError}
        </p>
      ) : null}
    </div>
  )
}
