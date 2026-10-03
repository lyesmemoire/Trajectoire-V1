"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Loader2 } from "lucide-react"
import { z } from "zod"
import { pollUntil } from "@/lib/billing/poll-until"
import { resolvePaymentStatus } from "@/lib/billing/resolve-payment-status"
import type { PaidPlan } from "@/lib/billing/checkout-plan"

export type PaymentSnapshot = {
  plan: "FREE" | "PACK" | "PRO"
  isUnlimited: boolean
  remaining: number | null
  /** Expiration du Pack ou fin de période PRO (ISO), ou null. */
  periodEnd: string | null
}

const QuotaResponseSchema = z.object({
  plan: z.enum(["FREE", "PACK", "PRO"]),
  isUnlimited: z.boolean(),
  remaining: z.number().nullable(),
  periodEnd: z.string().nullable(),
})

const POLL_INTERVAL_MS = 2_000
const POLL_TIMEOUT_MS = 30_000

type View = "pending" | "activated" | "timeout"

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" })

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : dateFormat.format(date)
}

function Summary({ snapshot }: { snapshot: PaymentSnapshot }) {
  const end = formatDate(snapshot.periodEnd)

  if (snapshot.plan === "PRO") {
    return <p className="mt-3 text-sm text-calm-secondary">Pro activé : simulations illimitées{end ? `, période en cours jusqu'au ${end}` : ""}.</p>
  }
  const remaining = snapshot.remaining
  return (
    <p className="mt-3 text-sm text-calm-secondary">
      Pack Entretien activé
      {remaining !== null ? ` : ${remaining} simulation${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""}` : ""}
      {end ? `, valable${remaining !== null && remaining > 1 ? "s" : ""} jusqu'au ${end}` : ""}.
    </p>
  )
}

/**
 * Écran de retour de paiement. L'état « confirmé » vient uniquement du plan lu en base (voir
 * `resolvePaymentStatus`) : si le webhook Stripe est en retard, on attend jusqu'à 30 secondes puis on rassure
 * sans rien affirmer. Aucune action n'est requise de l'utilisateur pour que l'accès s'active.
 */
export function PaymentStatus({ expected, initial }: { expected: PaidPlan | null; initial: PaymentSnapshot }) {
  const [snapshot, setSnapshot] = useState(initial)
  const [view, setView] = useState<View>(resolvePaymentStatus({ expected, effectivePlan: initial.plan }) === "activated" ? "activated" : "pending")

  useEffect(() => {
    if (view !== "pending") return
    const controller = new AbortController()

    void pollUntil<PaymentSnapshot>(
      async () => {
        const response = await fetch("/api/quota/simulations", { cache: "no-store", signal: controller.signal })
        if (!response.ok) return null
        const parsed = QuotaResponseSchema.safeParse(await response.json())
        if (!parsed.success) return null
        return resolvePaymentStatus({ expected, effectivePlan: parsed.data.plan }) === "activated" ? parsed.data : null
      },
      { intervalMs: POLL_INTERVAL_MS, timeoutMs: POLL_TIMEOUT_MS, signal: controller.signal },
    ).then(result => {
      if (result.kind === "value") {
        setSnapshot(result.value)
        setView("activated")
      } else if (result.kind === "timeout") {
        setView("timeout")
      }
    })

    return () => controller.abort()
  }, [view, expected])

  return (
    <main className="mx-auto flex min-h-full max-w-lg items-center px-6 py-16">
      <section aria-live="polite" className="w-full rounded-2xl border border-calm-line bg-calm-surface p-8 text-center">
        {view === "activated" ? (
          <>
            <CheckCircle2 className="mx-auto size-10 text-calm-accent" aria-hidden />
            <h1 className="font-sans mt-4 text-2xl font-semibold text-calm-ink tracking-normal">Paiement confirmé</h1>
            <Summary snapshot={snapshot} />
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/simulation/new" className="rounded-xl bg-calm-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-calm-accent">
                Lancer une simulation
              </Link>
              <Link href="/dashboard" className="rounded-xl border border-calm-line bg-calm-accent-wash px-5 py-3 text-sm font-medium text-calm-ink transition hover:bg-calm-accent-soft">
                Aller au tableau de bord
              </Link>
            </div>
          </>
        ) : view === "pending" ? (
          <>
            <Loader2 className="mx-auto size-10 animate-spin text-calm-accent" aria-hidden />
            <h1 className="font-sans mt-4 text-2xl font-semibold text-calm-ink tracking-normal">Nous confirmons votre paiement…</h1>
            <p className="mt-3 text-sm text-calm-secondary">Cela prend en général quelques secondes. Ne fermez pas cette page.</p>
          </>
        ) : (
          <>
            <Clock className="mx-auto size-10 text-calm-warn" aria-hidden />
            <h1 className="font-sans mt-4 text-2xl font-semibold text-calm-ink tracking-normal">Confirmation en cours</h1>
            <p className="mt-3 text-sm text-calm-secondary">
              Nous n&apos;avons pas encore reçu la confirmation de votre paiement. Si vous avez bien été débité, votre accès
              s&apos;activera automatiquement dans quelques minutes : aucune action n&apos;est nécessaire.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-calm-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-calm-accent"
              >
                Actualiser
              </button>
              <Link href="/dashboard" className="rounded-xl border border-calm-line bg-calm-accent-wash px-5 py-3 text-sm font-medium text-calm-ink transition hover:bg-calm-accent-soft">
                Aller au tableau de bord
              </Link>
              <Link href="/settings" className="text-sm text-calm-accent underline-offset-2 hover:underline">
                Voir mon abonnement
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
