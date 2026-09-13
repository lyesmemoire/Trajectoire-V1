import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkSimulationQuota } from "@/lib/quota/simulation-quota"

export const dynamic = "force-dynamic"

/**
 * GET /api/quota/simulations
 *
 * Retourne le quota mensuel de simulations pour l'utilisateur connecté.
 * Sécurisé : userId résolu depuis la session serveur, jamais depuis le client.
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  const quota = await checkSimulationQuota(user.id)

  return NextResponse.json({
    plan:        quota.plan,
    resource:    quota.resource,
    limit:       quota.limit,
    used:        quota.used,
    remaining:   quota.remaining,
    isUnlimited: quota.isUnlimited,
    allowed:     quota.allowed,
    periodStart: quota.periodStart,
    periodEnd:   quota.periodEnd,
  })
}
