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

export interface CVRewriteItem {
  id: string
  action: string
  createdAt: Date
  originalContent: string
  rewrittenContent: string
}

/**
 * Réécritures rattachées à une analyse (colonne `analysis_id`, renseignée par `api/cv/rewrite`
 * quand l'appelant fournit `analysisId`). Filtrées aussi par utilisateur. Les lignes créées
 * avant la colonne, ou sans analyse, n'y figurent pas. `expires_at` ne gouverne que le rejeu
 * idempotent : la ligne reste lisible tant que le compte existe.
 */
export async function getCVRewrites(analysisId: string, userId: string, limit = 20): Promise<CVRewriteItem[]> {
  return prisma.cvRewrite.findMany({
    where: { analysisId, userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, action: true, createdAt: true, originalContent: true, rewrittenContent: true },
  })
}
