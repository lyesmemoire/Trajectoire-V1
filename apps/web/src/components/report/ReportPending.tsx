"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { parseReportStatus } from "@/lib/interview/report-resolution"

const POLL_MS = 3000
/** Au-delà, la génération est probablement bloquée : on propose de la relancer. */
const SLOW_AFTER_MS = 60_000

interface ReportPendingProps {
  sessionId: string
  /** `in_progress` : la séance n'est pas terminée (rien à attendre). */
  mode: "pending" | "in_progress"
}

/** État d'attente propre quand le rapport d'une séance terminée est encore en génération (jamais un 404). */
export function ReportPending({ sessionId, mode }: ReportPendingProps) {
  const router = useRouter()
  const [slow, setSlow] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const started = useRef(Date.now())

  useEffect(() => {
    if (mode !== "pending") return
    let stopped = false
    const tick = async () => {
      try {
        const res = await fetch(`/api/simulation/${sessionId}/report`, { cache: "no-store" })
        const status = parseReportStatus(res.status, await res.json().catch(() => null))
        if (stopped) return
        if (status.status === "ready") {
          router.replace(`/report/${status.reportId}`)
          return
        }
      } catch {
        /* réseau indisponible : on réessaie au prochain passage */
      }
      if (!stopped && Date.now() - started.current > SLOW_AFTER_MS) setSlow(true)
    }
    void tick()
    const timer = setInterval(() => void tick(), POLL_MS)
    return () => {
      stopped = true
      clearInterval(timer)
    }
  }, [mode, sessionId, router])

  async function retry() {
    if (retrying) return
    setRetrying(true)
    setError(null)
    try {
      const res = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
      const body = (await res.json().catch(() => null)) as { data?: { reportId?: string } } | null
      const reportId = body?.data?.reportId
      if (res.ok && typeof reportId === "string") {
        router.replace(`/report/${reportId}`)
        return
      }
      setError("Le rapport n’a pas pu être généré pour le moment. Réessayez dans un instant.")
    } catch {
      setError("Le rapport n’a pas pu être généré. Vérifiez votre connexion puis réessayez.")
    } finally {
      setRetrying(false)
    }
  }

  if (mode === "in_progress") {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-white/[0.08] bg-zinc-900 p-8 text-center">
        <h1 className="text-xl font-semibold text-white/80">Cet entretien n’est pas terminé</h1>
        <p className="mt-3 text-white/50">Le rapport sera disponible dès que vous aurez terminé la simulation.</p>
        <Link
          href={`/simulation/${sessionId}`}
          className="min-h-11 min-w-11 mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Reprendre l’entretien
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-white/[0.08] bg-zinc-900 p-8 text-center" role="status" aria-live="polite">
      <Loader2 className="mx-auto size-8 animate-spin text-indigo-400" aria-hidden="true" />
      <h1 className="mt-4 text-xl font-semibold text-white/80">Votre rapport se prépare</h1>
      <p className="mt-3 text-white/50">
        Alexandra rassemble vos réponses. Cela prend généralement moins d’une minute : cette page s’ouvrira toute seule.
      </p>
      {slow && (
        <div className="mt-6">
          <p className="text-sm text-white/50">Cela prend plus de temps que prévu.</p>
          <button
            type="button"
            onClick={() => void retry()}
            disabled={retrying}
            aria-busy={retrying}
            className="min-h-11 min-w-11 mt-3 inline-flex items-center justify-center rounded-xl border border-indigo-500 px-6 py-3 font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/10 disabled:opacity-50"
          >
            {retrying ? "Génération…" : "Relancer la génération"}
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm text-amber-300">
          {error}
        </p>
      )}
      <Link href="/dashboard" className="min-h-11 min-w-11 mt-6 inline-flex items-center justify-center text-sm text-white/50 underline underline-offset-4 hover:text-white/80">
        Retour au tableau de bord
      </Link>
    </div>
  )
}
