import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { checkUserQuota } from "@/lib/quota/simple-quota"
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets"
import { previewAnalysisService } from "@/lib/preview-analysis/PreviewAnalysisService"
import type { 
  DashboardUserData, 
  DashboardScore, 
  DashboardSkill, 
  DashboardCareer,
  DashboardRecommendation,
  DashboardHistoryItem,
  DashboardAction,
  DashboardProgress,
  DashboardInsight,
  DashboardTimelineEvent
} from "@/types/dashboard"

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

  // RÃ©cupÃ©rer le profil carriÃ¨re
  const careerProfile = await prisma.careerProfile.findUnique({
    where: { userId: user.id },
  })

  // RÃ©cupÃ©rer les sessions d'entretien
  const interviewSessions = await prisma.interviewSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  // VÃ©rifier quota

  // Career Command Center
  const [
    dashboardOpportunities,
    liveDiscoveryCount,
    activeDiscoverySourceCount,
  ] = await Promise.all([
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

  const quota = await checkUserQuota(user.id)

  // VÃ©rifier si l'utilisateur a une preview analysis revendiquÃ©e
  const claimedPreview = await previewAnalysisService.getUserClaimedPreview(user.id)

  // Transformer les donnÃ©es pour le nouveau dashboard
  const userData: DashboardUserData = {
    name: dbUser?.name || user.email?.split("@")[0] || "Utilisateur",
    firstName: dbUser?.name?.split(" ")[0] || user.email?.split("@")[0] || "Utilisateur",
    avatar: user.user_metadata?.avatar_url,
  }

  const score: DashboardScore = {
    currentScore: lastAnalysis?.atsScoreAfter || claimedPreview?.atsScore || 0,
    previousScore: previousAnalysis?.atsScoreAfter ?? undefined,
    progressPercentage: lastAnalysis ? Math.min(100, (lastAnalysis.atsScoreAfter || 0)) : 
                          claimedPreview ? Math.min(100, (claimedPreview.atsScore || 0)) : 0,
    trend: (lastAnalysis?.atsScoreAfter || claimedPreview?.atsScore || 0) > (previousAnalysis?.atsScoreAfter || 0) ? 'up' : 
           (lastAnalysis?.atsScoreAfter || claimedPreview?.atsScore || 0) < (previousAnalysis?.atsScoreAfter || 0) ? 'down' : 'stable',
  }

  const cvData = lastAnalysis?.cvData as any || claimedPreview?.cvExtract as any
  const skills: DashboardSkill[] = cvData?.skills?.slice(0, 6).map((skill: any, index: number) => ({
    name: skill.name || `CompÃ©tence ${index + 1}`,
    level: skill.level || 50,
    category: index % 2 === 0 ? 'technical' : 'soft',
    trend: index % 3 === 0 ? 'up' : undefined,
  })) || []

  const career: DashboardCareer = {
    currentLevel: "Junior",
    nextLevel: "Mid-level",
    progressToNext: careerProfile?.employabilityScore || 50,
    evolution: {
      employabilityScore: careerProfile?.employabilityScore || 50,
      trend: 'up',
    },
  }

  const improvements = cvData?.improvements as any[] || claimedPreview?.recommendations as any[] || []
  const recommendations: DashboardRecommendation[] = improvements.slice(0, 4).map((imp: any, index: number) => ({
    id: `rec-${index}`,
    title: imp.title || `AmÃ©lioration ${index + 1}`,
    description: imp.description || "Optimisez cette section de votre CV",
    actionType: 'improve',
    priority: index === 0 ? 'high' : 'medium',
    estimatedImpact: imp.impact || 10,
  }))

  const history: DashboardHistoryItem[] = analyses.map((analysis) => ({
    id: analysis.id,
    fileName: analysis.fileName,
    date: analysis.createdAt,
    score: analysis.atsScoreAfter || 0,
    targetJob: cvData?.targetJob,
  }))

  const actions: DashboardAction[] = [
    {
      id: 'action-1',
      title: 'Analyser un CV',
      description: 'Nouvelle analyse ATS',
      icon: 'FileText',
      href: '/analyze',
      color: 'bronze',
    },
    {
      id: 'action-2',
      title: 'Nouveau Matching',
      description: 'Trouvez des offres',
      icon: 'Search',
      href: '/matching',
      color: 'forest',
    },
    {
      id: 'action-3',
      title: 'Copilot RH',
      description: 'Discutez avec l\'IA',
      icon: 'MessageSquare',
      href: '/copilot',
      color: 'sky',
    },
    {
      id: 'action-4',
      title: 'Entretien IA',
      description: 'PrÃ©parez-vous',
      icon: 'Mic',
      href: '/interview',
      color: 'brick',
    },
  ]

  const progress: DashboardProgress = {
    completedSteps: analyses.length > 0 ? 3 : 0,
    totalSteps: 5,
    percentage: analyses.length > 0 ? 60 : 0,
    steps: [
      { name: 'Analyse ATS', completed: analyses.length > 0 },
      { name: 'Optimisation CV', completed: analyses.length > 0 },
      { name: 'Matching', completed: analyses.length > 1 },
      { name: 'Copilot', completed: false },
      { name: 'Entretien IA', completed: interviewSessions.length > 0 },
    ],
  }

  const insights: DashboardInsight[] = [
    {
      type: 'strength',
      title: 'Score en progression',
      description: 'Votre score ATS a augmentÃ© de 15 points',
      value: 15,
      unit: 'pts',
    },
    {
      type: 'opportunity',
      title: 'CompÃ©tences recherchÃ©es',
      description: '3 compÃ©tences sont trÃ¨s demandÃ©es',
      value: 3,
    },
    {
      type: 'achievement',
      title: 'Analyses complÃ©tÃ©es',
      description: 'Vous avez analysÃ© votre CV plusieurs fois',
      value: analyses.length,
    },
    {
      type: 'weakness',
      title: 'Section Ã  amÃ©liorer',
      description: 'La section expÃ©rience peut Ãªtre optimisÃ©e',
    },
  ]

  const timeline: DashboardTimelineEvent[] = [
    ...(analyses.slice(0, 2).map((analysis, index) => ({
      id: `timeline-analysis-${index}`,
      type: 'analysis' as const,
      title: `Analyse CV #${analyses.length - index}`,
      description: `Score: ${analysis.atsScoreAfter || 0}/100`,
      date: analysis.createdAt,
      status: 'completed' as const,
    }))),
    ...(interviewSessions.slice(0, 2).map((session, index) => ({
      id: `timeline-interview-${index}`,
      type: 'interview' as const,
      title: 'Entretien simulÃ©',
      description: `Score: ${session.score || 0}/100`,
      date: session.createdAt,
      status: session.completedAt ? 'completed' as const : 'in-progress' as const,
    }))),
  ]

  return (
    <DashboardWidgets
      userData={userData}
      score={score}
      skills={skills}
      career={career}
      recommendations={recommendations}
      history={history}
      actions={actions}
      progress={progress}
      insights={insights}
      timeline={timeline}
      opportunitySummary={opportunitySummary}
      discoverySummary={discoverySummary}
      claimedPreview={claimedPreview}
    />
  )
}
