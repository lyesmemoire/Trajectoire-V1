"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"
import { checkSimulationQuota } from "@/lib/quota/simulation-quota"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { buildInterviewPreset } from "@/lib/simulation/interview-preset"
import { SimulationQuotaExceededError, startSimulation } from "@/lib/simulation/start-simulation"

const OpportunityIdSchema = z.string().trim().min(1).max(64)

/** Une séance identique démarrée il y a moins de ce délai est reprise au lieu d'en consommer une seconde (double clic, rejeu). */
const REUSE_WINDOW_MS = 2 * 60_000

/**
 * Server Action : prépare l'entretien d'une opportunité (offre du radar suivie, opportunité saisie à la main).
 * Crée la simulation préremplie avec le service de simulation existant (quota atomique, première question avec
 * le contexte CV et offre), puis redirige vers elle : aucun formulaire intermédiaire.
 *
 * - l'identité vient uniquement de la session ; l'opportunité doit appartenir à l'utilisateur ;
 * - quota épuisé ou offre gratuite : redirection vers /pricing ;
 * - toute autre erreur est relancée et traitée par la page d'erreur de l'espace connecté.
 */
export async function prepareInterview(opportunityId: string): Promise<never> {
  const id = OpportunityIdSchema.safeParse(opportunityId)
  if (!id.success) redirect("/opportunities")

  const { supabase, user } = await getVerifiedUserWithRetry()
  if (!user) redirect("/login")

  const opportunity = await prisma.opportunity.findFirst({
    where: { id: id.data, userId: user.id },
    select: { title: true, company: true, location: true, description: true },
  })
  if (!opportunity) redirect("/opportunities")

  const profile = await prisma.user.findUnique({ where: { id: user.id }, select: { onboardingData: true } })
  const preset = buildInterviewPreset(opportunity, profile?.onboardingData)

  // Reprise d'une séance toute fraîche pour la même offre (aucun quota consommé).
  const recent = await prisma.interview_sessions.findFirst({
    where: {
      user_id: user.id,
      status: "in_progress",
      job_title: preset.jobTitle,
      job_description: preset.jobDescription,
      created_at: { gt: new Date(Date.now() - REUSE_WINDOW_MS) },
    },
    orderBy: { created_at: "desc" },
    select: { id: true },
  })
  if (recent) redirect(`/simulation/${recent.id}`)

  const quota = await checkSimulationQuota(user.id)
  if (!quota.allowed) redirect("/pricing?reason=quota")

  let sessionId: string
  try {
    sessionId = (await startSimulation({ supabase, userId: user.id, input: { ...preset, opportunityId: id.data } })).sessionId
  } catch (error) {
    if (error instanceof SimulationQuotaExceededError) redirect("/pricing?reason=quota")
    logger.error({ err: error, opportunityId: id.data }, "[prepareInterview] échec de la création de la simulation")
    throw error
  }

  // redirect() lève une exception propre à Next : toujours hors du try/catch.
  redirect(`/simulation/${sessionId}`)
}
