import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

/**
 * Lecture des séances d'entretien dans `interview_sessions`, la table que la simulation alimente (l'ancienne
 * table `InterviewSession` n'est plus lue par le produit).
 */

/** Identifiant de séance bien formé (uuid) : `interview_sessions.id` est un uuid, un autre format ferait échouer la requête. */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value)
}

export type OpportunityInterview = {
  id: string
  jobTitle: string | null
  score: number | null
  status: "completed" | "in_progress"
  completedAt: Date | null
}

type OpportunityInterviewRow = {
  id: string
  job_title: string | null
  score: number | null
  status: string
  completed_at: Date | null
}

/** Statuts qui comptent pour une préparation : terminée, ou en cours (l'utilisateur peut la reprendre). */
export function toOpportunityInterview(row: OpportunityInterviewRow): OpportunityInterview | null {
  if (row.status !== "completed" && row.status !== "in_progress") return null
  return { id: row.id, jobTitle: row.job_title, score: row.score, status: row.status, completedAt: row.completed_at }
}

/**
 * Séance liée à une opportunité (`interview_sessions.opportunityId`, renseigné à la création de la simulation) :
 * la dernière terminée, à défaut la dernière en cours. Filtrée sur l'utilisateur. Retourne null s'il n'y en a pas,
 * ou si la lecture échoue : la colonne `opportunityId` vient d'une migration (20261006) et l'écran de préparation
 * ne doit jamais tomber pour cela.
 *
 * Requête SQL directe : le modèle Prisma de `interview_sessions` ne déclare pas encore `opportunityId` sur cette
 * branche (à remplacer par le client typé une fois le schéma à jour).
 */
export async function findOpportunityInterview(userId: string, opportunityId: string): Promise<OpportunityInterview | null> {
  try {
    const rows = await prisma.$queryRaw<OpportunityInterviewRow[]>`
      SELECT id::text AS id, job_title, score, status, completed_at
      FROM public.interview_sessions
      WHERE user_id = ${userId}::uuid
        AND "opportunityId" = ${opportunityId}
        AND status IN ('completed', 'in_progress')
      ORDER BY (status = 'completed') DESC, created_at DESC
      LIMIT 1`
    return rows[0] ? toOpportunityInterview(rows[0]) : null
  } catch (error) {
    logger.warn({ err: error, opportunityId }, "[session-reader] séance liée à l'opportunité indisponible")
    return null
  }
}
