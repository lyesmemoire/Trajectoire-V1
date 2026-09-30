import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { analyzeOpportunity } from "@/lib/opportunities/analyzeOpportunity"
import { requireFullCvAnalysis } from "@/lib/quota/plan-access"
import { RateLimitScope, RouteType } from "@/lib/rate-limiting/centralized-rate-limit.service"
import { rateLimit } from "@/lib/rate-limiting/rate-limit.middleware"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

async function handleAnalyze(
  _request: Request,
  context: RouteContext,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      {
        error: "Non authentifié.",
      },
      {
        status: 401,
      },
    )
  }

  // Analyse par IA : réservée au Pack Entretien et à Pro (403 avant tout appel d'IA),
  // comme l'analyse complète du CV.
  const denied = await requireFullCvAnalysis(user.id)
  if (denied) return denied

  const { id } = await context.params

  const opportunity = await prisma.opportunity.findFirst({
    where: {
      id,
      userId: user.id,
    },
  })

  if (!opportunity) {
    return NextResponse.json(
      {
        error: "Opportunité introuvable.",
      },
      {
        status: 404,
      },
    )
  }

  const cv = await prisma.cVAnalysis.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      originalText: true,
      optimizedText: true,
      createdAt: true,
    },
  })

  if (!cv) {
    return NextResponse.json(
      {
        error:
          "Aucun CV analysé n'est disponible. Analyse d'abord ton CV avant d'évaluer cette opportunité.",
        code: "NO_CV",
      },
      {
        status: 409,
      },
    )
  }

  const cvText =
    cv.optimizedText?.trim() ||
    cv.originalText?.trim() ||
    ""

  if (!cvText) {
    return NextResponse.json(
      {
        error:
          "Ton dernier CV ne contient pas assez de texte exploitable pour cette analyse.",
        code: "EMPTY_CV",
      },
      {
        status: 409,
      },
    )
  }

  const result = await analyzeOpportunity({
    cvText,
    jobTitle: opportunity.title,
    jobDescription: opportunity.description,
  })

  const updated = await prisma.opportunity.update({
    where: {
      id: opportunity.id,
    },
    data: {
      matchScore: result.matchScore,
      skillsScore: result.skillsScore,
      experienceScore: result.experienceScore,
      seniorityScore: result.seniorityScore,
      relevanceScore: result.relevanceScore,
      recommendation: result.recommendation,
      recommendationLabel: result.recommendationLabel,
      strengths: result.strengths,
      gaps: result.gaps,
      analysis: {
        version: 1,
        engine: result.semanticAnalysis
          ? "trajectoire-semantic-llm"
          : "trajectoire-opportunity-intelligence",
        summary: result.summary,
        potentialScore: result.potentialScore,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords,
        cvAnalysisId: cv.id,
        cvAnalyzedAt: cv.createdAt.toISOString(),
        ...(result.semanticAnalysis
          ? { semanticAnalysis: result.semanticAnalysis }
          : {}),
      },
      analyzedAt: new Date(),
      nextAction:
        result.recommendation === "APPLY"
          ? "Décider si je souhaite candidater"
          : result.recommendation === "CAUTION"
            ? "Examiner les écarts avant de candidater"
            : "Comparer avec une opportunité plus alignée",
    },
  })

  return NextResponse.json({
    opportunity: {
      id: updated.id,
      matchScore: updated.matchScore,
      skillsScore: updated.skillsScore,
      experienceScore: updated.experienceScore,
      seniorityScore: updated.seniorityScore,
      relevanceScore: updated.relevanceScore,
      recommendation: updated.recommendation,
      recommendationLabel: updated.recommendationLabel,
      strengths: updated.strengths,
      gaps: updated.gaps,
      analysis: updated.analysis,
      analyzedAt: updated.analyzedAt?.toISOString() ?? null,
      status: updated.status,
      nextAction: updated.nextAction,
    },
  })
}

// Chaque appel peut déclencher une analyse par IA : limite de débit par utilisateur et par IP.
export const POST = rateLimit(RouteType.AI, handleAnalyze, {
  scopes: [RateLimitScope.USER, RateLimitScope.IP],
})
