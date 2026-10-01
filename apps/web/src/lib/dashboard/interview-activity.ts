import { prisma } from "@/lib/prisma"
import type { DashboardTimelineEvent } from "@/types/dashboard"

/**
 * Activité d'entretien du tableau de bord, lue dans `interview_sessions` : la table où `POST /api/simulation/create`
 * et le flux vocal écrivent réellement. (L'ancienne table `InterviewSession` n'est plus alimentée : la lire laissait
 * le compteur et l'historique du tableau de bord à zéro après de vraies simulations.)
 *
 * - le compteur = séances terminées ;
 * - la chronologie montre aussi les séances en cours, avec une action « Reprendre » ;
 * - une séance terminée renvoie vers son rapport quand il existe.
 */

export const RECENT_SESSIONS_LIMIT = 3

export type ActivityRow = {
  id: string
  job_title: string | null
  score: number | null
  status: string
  created_at: Date
  reports: { id: string } | null
}

/** Événement de chronologie, ou null pour un statut qui n'a pas à y figurer (échec, abandon…). */
export function toInterviewEvent(row: ActivityRow): DashboardTimelineEvent | null {
  if (row.status !== "completed" && row.status !== "in_progress") return null

  const completed = row.status === "completed"
  const job = row.job_title?.trim()

  return {
    id: `timeline-interview-${row.id}`,
    type: "interview",
    title: job ? `Entretien simulé · ${job}` : "Entretien simulé",
    description: completed && row.score !== null ? `Score : ${row.score}/100` : undefined,
    date: row.created_at,
    status: completed ? "completed" : "in-progress",
    ...(completed
      ? row.reports
        ? { href: `/report/${row.reports.id}`, actionLabel: "Voir le rapport" }
        : {}
      : { href: `/simulation/${row.id}`, actionLabel: "Reprendre" }),
  }
}

export async function loadInterviewActivity(userId: string): Promise<{ completedCount: number; events: DashboardTimelineEvent[] }> {
  const [completedCount, rows] = await Promise.all([
    prisma.interview_sessions.count({ where: { user_id: userId, status: "completed" } }),
    prisma.interview_sessions.findMany({
      where: { user_id: userId, status: { in: ["completed", "in_progress"] } },
      orderBy: { created_at: "desc" },
      take: RECENT_SESSIONS_LIMIT,
      select: {
        id: true,
        job_title: true,
        score: true,
        status: true,
        created_at: true,
        reports: { select: { id: true } },
      },
    }),
  ])

  const events = rows.map(toInterviewEvent).filter((event): event is DashboardTimelineEvent => event !== null)
  return { completedCount, events }
}
