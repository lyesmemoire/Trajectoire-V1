/**
 * Lecture des analyses de CV d'un utilisateur (pages /cv et /cv/[id]).
 *
 * Accès par Prisma (les types viennent du schéma, `CVAnalysis` / `CvRewrite`) : les
 * types Supabase générés ne contiennent pas ces tables. Toute lecture est filtrée par
 * `userId` (le rôle Prisma contourne la RLS) ; le texte du CV n'est jamais sélectionné.
 */

import { prisma } from "@/lib/prisma"
import { readStoredAts } from "@/lib/cv-analysis/persistence"
import type { CvAnalysisResult } from "@/lib/cv-analysis"

export interface CVAnalysisListItem {
  id: string
  fileName: string
  createdAt: Date
  atsScoreBefore: number | null
  atsScoreAfter: number | null
}

export interface CVAnalysisDetail extends CVAnalysisListItem {
  /** Résultat complet du moteur ; `null` pour une analyse antérieure au moteur. */
  ats: CvAnalysisResult | null
  /** Recommandations enregistrées (liste de textes) ; vide si absentes ou d'une autre forme. */
  improvements: string[]
}

const LIST_SELECT = {
  id: true,
  fileName: true,
  createdAt: true,
  atsScoreBefore: true,
  atsScoreAfter: true,
} as const

export async function getCVAnalyses(userId: string, limit = 50): Promise<CVAnalysisListItem[]> {
  return prisma.cVAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: LIST_SELECT,
  })
}

export async function getCVAnalysis(id: string, userId: string): Promise<CVAnalysisDetail | null> {
  const row = await prisma.cVAnalysis.findFirst({
    where: { id, userId },
    select: { ...LIST_SELECT, improvements: true, keywords: true },
  })
  if (!row) return null

  const improvements = Array.isArray(row.improvements)
    ? row.improvements.filter((item): item is string => typeof item === "string" && item.trim() !== "")
    : []

  return {
    id: row.id,
    fileName: row.fileName,
    createdAt: row.createdAt,
    atsScoreBefore: row.atsScoreBefore,
    atsScoreAfter: row.atsScoreAfter,
    ats: readStoredAts(row.keywords),
    improvements,
  }
}

// TODO(rewrites) : `getCVRewrites(analysisId)` n'est pas réalisable aujourd'hui. La table
// `cv_rewrites` ne porte aucune colonne vers `CVAnalysis` (seulement user_id, action,
// contenus, dates ; lignes purgées à `expires_at`). Il faut d'abord une colonne
// `analysis_id` (migration soumise à accord) et que `api/cv/rewrite` la renseigne.
