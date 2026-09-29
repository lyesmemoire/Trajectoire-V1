import { redirect } from "next/navigation"

import { DangerZone } from "@/components/settings/DangerZone"
import { SubscriptionCard } from "@/components/settings/SubscriptionCard"
import { checkSimulationQuota } from "@/lib/quota/simulation-quota"
import { buildSubscriptionSummary } from "@/lib/quota/subscription-summary"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const summary = buildSubscriptionSummary(await checkSimulationQuota(user.id))

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight text-white/80 sm:text-4xl">
        Paramètres
      </h1>
      <p className="mb-10 text-base text-zinc-400">
        Gérez votre compte et votre abonnement.
      </p>

      <div className="space-y-6">
        <SubscriptionCard summary={summary} />
        <DangerZone />
      </div>
    </div>
  )
}
