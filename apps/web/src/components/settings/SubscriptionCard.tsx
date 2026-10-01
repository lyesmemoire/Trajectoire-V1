"use client"

import { useState } from "react"
import Link from "next/link"
import type { SubscriptionSummary } from "@/lib/quota/subscription-summary"

const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-calm-accent focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"

export function SubscriptionCard({ summary }: { summary: SubscriptionSummary }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paid = summary.plan !== "FREE"

  const openPortal = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/customer-portal", { method: "POST" })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.url) {
        window.location.href = data.url
        return
      }
      setError(data?.error || "Impossible d'ouvrir le portail de facturation.")
    } catch {
      setError("Impossible de se connecter au service de paiement.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      aria-labelledby="subscription-title"
      className="rounded-2xl border border-calm-line bg-calm-surface p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="subscription-title"
            className="text-xl font-semibold tracking-tight text-calm-ink"
          >
            Abonnement
          </h2>
          <p className="mt-1 text-sm text-calm-secondary">{summary.priceLabel}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            paid
              ? "border border-calm-accent-line bg-calm-accent-soft text-calm-accent"
              : "border border-calm-line bg-calm-accent-wash text-calm-ink"
          }`}
        >
          {summary.planName}
        </span>
      </div>

      <div className="mt-8 rounded-xl border border-calm-line bg-calm-bg p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-calm-tertiary">
          Simulations
        </p>
        <p className="mt-2 text-lg font-semibold text-calm-ink">{summary.headline}</p>

        {summary.progress && (
          <div
            role="progressbar"
            aria-label="Simulations utilisées"
            aria-valuemin={0}
            aria-valuemax={summary.progress.limit}
            aria-valuenow={summary.progress.used}
            className="mt-4 h-2 overflow-hidden rounded-full bg-calm-accent-wash"
          >
            <div
              className="h-full rounded-full bg-calm-accent transition-[width] duration-500"
              style={{
                width: `${
                  summary.progress.limit === 0
                    ? 0
                    : Math.round((summary.progress.used / summary.progress.limit) * 100)
                }%`,
              }}
            />
          </div>
        )}

        {summary.detail && (
          <p className="mt-3 text-sm text-calm-secondary">{summary.detail}</p>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-calm-warn-line bg-calm-warn-soft p-4 text-sm font-medium text-calm-warn"
        >
          {error}
        </div>
      )}

      {(summary.showUpgrade || summary.showPortal) && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {summary.showUpgrade && (
            <Link
              href="/pricing"
              className={`inline-flex h-11 items-center justify-center rounded-xl bg-calm-accent px-5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(31,42,55,0.6)] transition-colors hover:bg-calm-accent ${FOCUS}`}
            >
              Voir les offres
            </Link>
          )}
          {summary.showPortal && (
            <button
              type="button"
              onClick={openPortal}
              disabled={loading}
              className={`inline-flex h-11 items-center justify-center rounded-xl border border-calm-line bg-calm-accent-wash px-5 text-sm font-semibold text-calm-ink transition-colors hover:bg-calm-accent-soft disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`}
            >
              {loading ? "Ouverture…" : "Gérer la facturation"}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
