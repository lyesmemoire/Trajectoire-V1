import type { SupabaseClient } from "@supabase/supabase-js"
import { Container, ServiceTokens } from "@/infrastructure/di"
import { initializeContainer } from "@/infrastructure/di/bootstrap"
import type { SimulationService } from "@/application/services"
import { UnifiedInterviewContextService } from "@/application/interview-context/UnifiedInterviewContextService"
import { InterviewService } from "@/lib/ai/services/interview.service"
import { parseDifficulty, parsePersona, sanitizeMandatoryQuestion, withSessionSetup } from "@/lib/interview/session-setup"
import { consumeSimulation, releaseSimulation, type SimulationQuota } from "@/lib/quota/simulation-quota"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import type { Prisma } from "@prisma/client"
import { MAX_JOB_DESCRIPTION_LENGTH, type InterviewType, type StartSimulationInput } from "./types"

export { MAX_JOB_DESCRIPTION_LENGTH }
export type { InterviewType, StartSimulationInput }

/**
 * Création d'une simulation : une seule implémentation, partagée par `POST /api/simulation/create`
 * (formulaire /simulation/new) et par la Server Action `prepareInterview` (offre du radar, opportunité).
 *
 * Ordre : consommation atomique du quota → création de la séance (le quota est rendu si elle échoue) →
 * enrichissement (offre, réglages, lien avec l'opportunité) → première question. Une simulation n'arrive jamais
 * sur la page sans première question.
 */

/** Plafond de simulations atteint (FREE : 0, Pack épuisé ou expiré), y compris quand la course est perdue. */
export class SimulationQuotaExceededError extends Error {
  constructor(readonly quota: SimulationQuota) {
    super("SIMULATION_QUOTA_EXCEEDED")
  }
}

export function buildFallbackFirstQuestion(params: { jobTitle: string; interviewType: string }): string {
  const { jobTitle, interviewType } = params

  if (interviewType === "Technique") {
    return `Bonjour. Pour commencer cet entretien pour le poste de ${jobTitle}, pouvez-vous me présenter brièvement votre parcours puis me parler de l'expérience technique la plus pertinente pour ce poste ?`
  }
  if (interviewType === "Manager") {
    return `Bonjour. Pour commencer cet entretien pour le poste de ${jobTitle}, pouvez-vous me présenter votre parcours et me donner un exemple récent où vous avez dû prendre une décision importante avec votre équipe ?`
  }
  return `Bonjour. Pour commencer cet entretien pour le poste de ${jobTitle}, pouvez-vous vous présenter en quelques minutes et m'expliquer ce qui vous motive particulièrement dans cette opportunité ?`
}

/** Idempotent : si une première question existe déjà, n'en crée pas une seconde. */
export async function ensureFirstQuestion(params: {
  supabase: SupabaseClient
  userId: string
  sessionId: string
  jobTitle: string
  level: string
  interviewType: InterviewType
}): Promise<void> {
  const { supabase, userId, sessionId, jobTitle, level, interviewType } = params

  const { data: existingMessages, error: existingMessagesError } = await supabase
    .from("interview_messages")
    .select("id,role")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(1)

  if (existingMessagesError) {
    logger.warn({ err: existingMessagesError, sessionId }, "[start-simulation] could not verify existing messages")
  }
  if (Array.isArray(existingMessages) && existingMessages.length > 0) return

  // Contexte unifié (CV, offre, risques). Son échec n'empêche pas la séance.
  let unifiedContext = null
  try {
    unifiedContext = await new UnifiedInterviewContextService(supabase).build({ userId, sessionId })
  } catch (error) {
    logger.warn({ err: error, sessionId }, "[start-simulation] unified context unavailable for first question")
  }

  // Génération IA ; si le fournisseur est indisponible, la séance démarre quand même avec une question de repli.
  let firstQuestion: string
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)

  try {
    firstQuestion = (
      await InterviewService.generateFirstQuestion({
        jobTitle,
        level,
        interviewType,
        sessionId,
        userId,
        signal: controller.signal,
        unifiedContext,
      })
    ).trim()
    if (!firstQuestion) throw new Error("EMPTY_FIRST_QUESTION")
  } catch (error) {
    logger.error({ err: error, sessionId }, "[start-simulation] AI first question failed, using fallback")
    firstQuestion = buildFallbackFirstQuestion({ jobTitle, interviewType })
  } finally {
    clearTimeout(timeout)
  }

  const { error: insertError } = await supabase.from("interview_messages").insert({
    session_id: sessionId,
    role: "assistant",
    content: firstQuestion,
  })
  if (insertError) throw new Error(`FIRST_QUESTION_INSERT_FAILED:${insertError.message}`)

  logger.info({ sessionId, contextual: Boolean(unifiedContext) }, "[start-simulation] first recruiter question created")
}

/**
 * Consommation atomique du quota puis création de la séance. Exécutée une seule fois, y compris avec une clé
 * d'idempotence côté route (un rejeu ne redécompte pas). Si la création échoue, la simulation est rendue.
 */
export async function createSimulationRecord(params: {
  userId: string
  jobTitle: string
  level: string
  interviewType: InterviewType
  duration: number
}) {
  const { userId, ...command } = params
  initializeContainer()
  const simulationService = (await Container.resolve(ServiceTokens.SimulationService)) as SimulationService

  const consumed = await consumeSimulation(userId)
  if (!consumed.ok) throw new SimulationQuotaExceededError(consumed.quota)

  try {
    return await simulationService.createSimulation({ userId, ...command })
  } catch (creationError) {
    await releaseSimulation(userId).catch(releaseError =>
      logger.error({ err: releaseError }, "[start-simulation] release failed"),
    )
    throw creationError
  }
}

/** Enrichissement après création : offre, réglages de séance, lien avec l'opportunité, puis première question. */
export async function finalizeSimulation(params: {
  supabase: SupabaseClient
  userId: string
  sessionId: string
  input: StartSimulationInput
}): Promise<void> {
  const { supabase, userId, sessionId, input } = params
  const jobDescription = input.jobDescription.trim().slice(0, MAX_JOB_DESCRIPTION_LENGTH)

  if (jobDescription) {
    const { error } = await supabase
      .from("interview_sessions")
      .update({ job_description: jobDescription })
      .eq("id", sessionId)
      .eq("user_id", userId)
    if (error) logger.warn({ err: error, sessionId }, "[start-simulation] job_description update failed")
  }

  // Réglages (difficulté, style, question imposée) : fusionnés dans `analysis` (JSONB existant). Non bloquant.
  try {
    const current = await prisma.interview_sessions.findFirst({
      where: { id: sessionId, user_id: userId },
      select: { analysis: true },
    })
    if (current) {
      await prisma.interview_sessions.update({
        where: { id: sessionId },
        select: { id: true },
        data: {
          analysis: withSessionSetup(current.analysis, {
            difficulty: parseDifficulty(input.difficulty),
            persona: parsePersona(input.persona),
            mandatoryQuestion: sanitizeMandatoryQuestion(input.mandatoryQuestion),
          }) as Prisma.InputJsonValue,
        },
      })
    }
  } catch (error) {
    logger.warn({ err: error, sessionId }, "[start-simulation] setup update failed")
  }

  // Lien avec l'opportunité : jamais fait confiance à l'identifiant du client, propriété revérifiée.
  const opportunityId = input.opportunityId?.trim()
  if (opportunityId) {
    const verified = await prisma.opportunity.findFirst({ where: { id: opportunityId, userId }, select: { id: true } })
    if (verified) {
      try {
        // Colonne ajoutée par la migration « opportunity_id sur interview_sessions » (voir tasks.md) : tant
        // qu'elle n'existe pas, l'échec est consigné et la séance continue sans lien.
        await prisma.$executeRaw`UPDATE "public"."interview_sessions" SET "opportunityId" = ${verified.id} WHERE "id" = ${sessionId}::uuid AND "user_id" = ${userId}::uuid`
      } catch (error) {
        logger.warn({ err: error, sessionId }, "[start-simulation] opportunity link failed")
      }
    } else {
      logger.warn({ userId, opportunityId }, "[start-simulation] opportunity ownership check failed, link refused")
    }
  }

  await ensureFirstQuestion({
    supabase,
    userId,
    sessionId,
    jobTitle: input.jobTitle,
    level: input.level,
    interviewType: input.interviewType,
  })
}

/** Création complète (quota, séance, enrichissement, première question) : utilisée par la Server Action. */
export async function startSimulation(params: { supabase: SupabaseClient; userId: string; input: StartSimulationInput }): Promise<{ sessionId: string }> {
  const { supabase, userId, input } = params
  const created = await createSimulationRecord({
    userId,
    jobTitle: input.jobTitle,
    level: input.level,
    interviewType: input.interviewType,
    duration: input.duration,
  })
  await finalizeSimulation({ supabase, userId, sessionId: created.sessionId, input })
  return { sessionId: created.sessionId }
}
