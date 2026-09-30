import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets"
import { previewAnalysisService } from "@/lib/preview-analysis/PreviewAnalysisService"
import type {
  DashboardUserData,
  DashboardScore,
  DashboardSkill,
  DashboardRecommendation,
  DashboardTimelineEvent,
} from "@/types/dashboard"

type NormalizedSkill = {
  name: string
  level?: number
  category?: 'technical' | 'soft' | 'language'
  trend?: 'up' | 'down' | 'stable'
}

type NormalizedImprovement = {
  title: string
  description: string
}

function parseJsonSafely(data: unknown): unknown {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }
  return data
}

function normalizeSkills(raw: unknown): NormalizedSkill[] {
  if (!raw) return []

  // Shape 1: Tableau direct (ex: string[] ou array of objects)
  if (Array.isArray(raw)) {
    const result: NormalizedSkill[] = []
    for (const item of raw) {
      if (typeof item === 'string') {
        const trimmed = item.trim()
        if (trimmed) result.push({ name: trimmed })
      } else if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>
        const name =
          typeof obj.name === 'string'
            ? obj.name
            : typeof obj.title === 'string'
            ? obj.title
            : typeof obj.skill === 'string'
            ? obj.skill
            : ''
        if (name.trim()) {
          const level = typeof obj.level === 'number' ? obj.level : undefined
          const category =
            obj.category === 'technical' ||
            obj.category === 'soft' ||
            obj.category === 'language'
              ? obj.category
              : undefined
          const trend =
            obj.trend === 'up' || obj.trend === 'down' || obj.trend === 'stable'
              ? obj.trend
              : undefined
          result.push({ name: name.trim(), level, category, trend })
        }
      }
    }
    return result
  }

  // Shape 2: ChaÃ®ne dÃ©limitÃ©e par des virgules ou retours Ã  la ligne
  if (typeof raw === 'string') {
    return raw
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name }))
  }

  // Shape 3: Objet catÃ©gorisÃ© ({ technical: string[], soft: string[], languages: string[] })
  // Forme standard issue de api/cv/analyze/route.ts (CvAnalysis)
  if (typeof raw === 'object') {
    const result: NormalizedSkill[] = []
    const obj = raw as Record<string, unknown>

    const categories: Array<{
      key: string
      category: 'technical' | 'soft' | 'language'
    }> = [
      { key: 'technical', category: 'technical' },
      { key: 'soft', category: 'soft' },
      { key: 'languages', category: 'language' },
      { key: 'language', category: 'language' },
    ]

    for (const { key, category } of categories) {
      const val = obj[key]
      if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'string') {
            const trimmed = item.trim()
            if (trimmed) result.push({ name: trimmed, category })
          } else if (item && typeof item === 'object') {
            const itemObj = item as Record<string, unknown>
            const name =
              typeof itemObj.name === 'string'
                ? itemObj.name
                : typeof itemObj.title === 'string'
                ? itemObj.title
                : typeof itemObj.skill === 'string'
                ? itemObj.skill
                : ''
            if (name.trim()) {
              const level =
                typeof itemObj.level === 'number' ? itemObj.level : undefined
              result.push({ name: name.trim(), category, level })
            }
          }
        }
      } else if (typeof val === 'string') {
        const parts = val.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)
        for (const p of parts) {
          result.push({ name: p, category })
        }
      }
    }

    // Autres clÃ©s Ã©ventuelles contenant des tableaux
    const handledKeys = new Set(['technical', 'soft', 'languages', 'language'])
    for (const [k, val] of Object.entries(obj)) {
      if (handledKeys.has(k)) continue
      if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'string') {
            const trimmed = item.trim()
            if (trimmed) result.push({ name: trimmed, category: 'technical' })
          }
        }
      }
    }

    return result
  }

  return []
}

/**
 * Recommandations enregistrées : uniquement des textes réels. Un élément sans texte est
 * ignoré (pas de titre générique, pas d'impact estimé).
 */
function normalizeImprovements(
  rawImprovements: unknown,
  rawRecommendations: unknown
): NormalizedImprovement[] {
  const source = rawImprovements ?? rawRecommendations
  if (!Array.isArray(source)) return []

  const out: NormalizedImprovement[] = []
  for (const item of source) {
    if (typeof item === 'string') {
      const text = item.trim()
      if (text) out.push({ title: text, description: text })
    } else if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>
      const title = typeof obj.title === 'string' ? obj.title.trim() : ''
      const text = typeof obj.description === 'string' ? obj.description.trim()
        : typeof obj.text === 'string' ? obj.text.trim() : ''
      if (title || text) out.push({ title: title || text, description: text || title })
    }
  }
  return out
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // VÃ©rifier si l'utilisateur a complÃ©tÃ© l'onboarding
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true },
  })

  // Si l'utilisateur n'a pas complÃ©tÃ© l'onboarding, rediriger vers onboarding

  // RÃ©cupÃ©rer les analyses CV
  const analyses = await prisma.cVAnalysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const lastAnalysis = analyses[0]
  const previousAnalysis = analyses[1]

  // RÃ©cupÃ©rer les sessions d'entretien
  const interviewSessions = await prisma.interviewSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  // VÃ©rifier quota

  // Career Command Center
  const [
    analysesCount,
    interviewSessionsCount,
    dashboardOpportunities,
    liveDiscoveryCount,
    activeDiscoverySourceCount,
  ] = await Promise.all([
    prisma.cVAnalysis.count({
      where: { userId: user.id },
    }),
    prisma.interviewSession.count({
      where: { userId: user.id },
    }),
    prisma.opportunity.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        {
          matchScore: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
      take: 50,
      select: {
        id: true,
        title: true,
        company: true,
        status: true,
        matchScore: true,
        nextAction: true,
        nextActionAt: true,
        updatedAt: true,
      },
    }),
    prisma.discoveredJob.count({
      where: {
        userId: user.id,
        status: "LIVE",
      },
    }),
    prisma.discoverySource.count({
      where: {
        userId: user.id,
        enabled: true,
      },
    }),
  ])

  const terminalOpportunityStatuses = new Set([
    "REJECTED",
    "ARCHIVED",
  ])

  const activeOpportunities =
    dashboardOpportunities.filter(
      (opportunity) =>
        !terminalOpportunityStatuses.has(opportunity.status),
    )

  const bestMatch =
    activeOpportunities.find(
      (opportunity) =>
        opportunity.matchScore !== null,
    ) ?? null

  const nextActionOpportunity =
    [...activeOpportunities]
      .filter(
        (opportunity) =>
          Boolean(opportunity.nextAction),
      )
      .sort((a, b) => {
        if (a.nextActionAt && b.nextActionAt) {
          return (
            a.nextActionAt.getTime() -
            b.nextActionAt.getTime()
          )
        }

        if (a.nextActionAt) return -1
        if (b.nextActionAt) return 1

        return (
          b.updatedAt.getTime() -
          a.updatedAt.getTime()
        )
      })[0] ?? null

  const opportunitySummary = {
    activeCount: activeOpportunities.length,
    discoveredCount:
      activeOpportunities.filter(
        (opportunity) =>
          opportunity.status === "DISCOVERED",
      ).length,
    highMatchCount:
      activeOpportunities.filter(
        (opportunity) =>
          (opportunity.matchScore ?? 0) >= 75,
      ).length,
    pipeline: {
      discovered: activeOpportunities.filter(
        (opportunity) =>
          opportunity.status === "DISCOVERED",
      ).length,
      toAnalyze: activeOpportunities.filter(
        (opportunity) =>
          opportunity.status === "TO_ANALYZE",
      ).length,
      toApply: activeOpportunities.filter(
        (opportunity) =>
          opportunity.status === "TO_APPLY",
      ).length,
      applied: activeOpportunities.filter(
        (opportunity) =>
          opportunity.status === "APPLIED",
      ).length,
      interview: activeOpportunities.filter(
        (opportunity) =>
          opportunity.status === "INTERVIEW",
      ).length,
      offer: activeOpportunities.filter(
        (opportunity) =>
          opportunity.status === "OFFER",
      ).length,
    },
    bestMatch: bestMatch
      ? {
          id: bestMatch.id,
          title: bestMatch.title,
          company: bestMatch.company,
          matchScore: bestMatch.matchScore,
          status: bestMatch.status,
        }
      : null,
    nextAction: nextActionOpportunity?.nextAction
      ? {
          id: nextActionOpportunity.id,
          title: nextActionOpportunity.title,
          company: nextActionOpportunity.company,
          action: nextActionOpportunity.nextAction,
          at: nextActionOpportunity.nextActionAt,
        }
      : null,
  }

  const discoverySummary = {
    liveCount: liveDiscoveryCount,
    sourceCount: activeDiscoverySourceCount,
  }

  // Aperçu revendiqué (si applicable)
  const claimedPreview = await previewAnalysisService.getUserClaimedPreview(user.id)

  const userData: DashboardUserData = {
    name: dbUser?.name || user.email?.split("@")[0] || "Utilisateur",
    firstName: dbUser?.name?.split(" ")[0] || user.email?.split("@")[0] || "Utilisateur",
    avatar: user.user_metadata?.avatar_url,
  }

  // Score : uniquement une valeur enregistrée (analyse ou aperçu revendiqué), sinon null.
  const lastScore = lastAnalysis?.atsScoreAfter ?? null
  const score: DashboardScore = {
    currentScore: lastScore ?? claimedPreview?.atsScore ?? null,
    // Comparaison seulement entre deux analyses réellement notées.
    previousScore: lastScore !== null ? (previousAnalysis?.atsScoreAfter ?? undefined) : undefined,
  }

  const cvData = (parseJsonSafely(lastAnalysis?.cvData) || parseJsonSafely(claimedPreview?.cvExtract)) as any
  const skills: DashboardSkill[] = normalizeSkills(cvData?.skills)
    .slice(0, 6)
    .map((skill) => ({
      name: skill.name,
      // Niveau, catégorie et tendance : uniquement s'ils figurent dans les données, jamais déduits.
      ...(skill.level !== undefined ? { level: skill.level } : {}),
      ...(skill.category ? { category: skill.category } : {}),
      ...(skill.trend ? { trend: skill.trend } : {}),
    }))

  const rawImprovements = parseJsonSafely(lastAnalysis?.improvements)
  const rawRecommendations = parseJsonSafely(claimedPreview?.recommendations)
  const recommendations: DashboardRecommendation[] = normalizeImprovements(rawImprovements, rawRecommendations)
    .slice(0, 4)
    .map((imp, index) => ({
      id: `rec-${index}`,
      title: imp.title,
      description: imp.description,
    }))

  const timeline: DashboardTimelineEvent[] = [
    ...analyses.slice(0, 2).map((analysis, index) => ({
      id: `timeline-analysis-${analysis.id}`,
      type: 'analysis' as const,
      title: `Analyse CV #${analysesCount - index}`,
      description: analysis.atsScoreAfter !== null ? `Score : ${analysis.atsScoreAfter}/100` : undefined,
      date: analysis.createdAt,
      status: 'completed' as const,
    })),
    ...interviewSessions.slice(0, 2).map((session) => ({
      id: `timeline-interview-${session.id}`,
      type: 'interview' as const,
      title: 'Entretien simulé',
      description: session.score !== null ? `Score : ${session.score}/100` : undefined,
      date: session.createdAt,
      status: session.completedAt ? ('completed' as const) : ('in-progress' as const),
    })),
  ]

  return (
    <DashboardWidgets
      userData={userData}
      score={score}
      skills={skills}
      recommendations={recommendations}
      timeline={timeline}
      opportunitySummary={opportunitySummary}
      discoverySummary={discoverySummary}
      stats={{
        analysesCount,
        simulationsCount: interviewSessionsCount,
      }}
      claimedPreview={claimedPreview}
    />
  )
}
