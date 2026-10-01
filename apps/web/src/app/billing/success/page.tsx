import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { PaymentStatus, type PaymentSnapshot } from "@/components/billing/PaymentStatus"
import { parsePaidPlan } from "@/lib/billing/checkout-plan"
import { checkSimulationQuota } from "@/lib/quota/simulation-quota"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Paiement – Trajectoire" }
export const dynamic = "force-dynamic"

type PageProps = { searchParams: Promise<{ plan?: string | string[] }> }

/**
 * Retour de Stripe Checkout (`success_url`). Le paramètre `plan` n'est qu'un indice d'affichage : l'état affiché
 * dépend du plan effectif lu en base, que met à jour le webhook.
 */
export default async function BillingSuccessPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirect=/billing/success")

  const params = await searchParams
  const expected = parsePaidPlan(Array.isArray(params.plan) ? params.plan[0] : params.plan)

  const quota = await checkSimulationQuota(user.id)
  const initial: PaymentSnapshot = {
    plan: quota.plan,
    isUnlimited: quota.isUnlimited,
    remaining: quota.remaining,
    periodEnd: quota.periodEnd ? quota.periodEnd.toISOString() : null,
  }

  return <PaymentStatus expected={expected} initial={initial} />
}
