import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit/upstash-rate-limit"
import { generateFingerprint } from "@/lib/security/ip-extraction"
import { validateCVUpload, validateJobDescription } from "@/lib/validators/cv-validator"
import { generatePreviewAnalysis } from "@/lib/ai/preview-analyzer"
import { previewAnalysisService } from "@/lib/preview-analysis/PreviewAnalysisService"
import { logger } from "@/lib/logger"
import * as Sentry from "@sentry/nextjs"

export const maxDuration = 15;

export async function POST(req: NextRequest) {
  const fingerprint = generateFingerprint(req)
  
  try {
    // 1. Rate limiting IP (3/heure) avec Upstash Redis
    const rateLimit = await checkRateLimit(`preview:${fingerprint}`, 3, 3600)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
          }
        }
      )
    }

    // 2. Parsing form data
    const formData = await req.formData()
    const cvFile = formData.get("cv") as File
    const jobDescription = formData.get("jobDescription") as string

    // 3. Validation CV
    const cvValidation = await validateCVUpload(cvFile)
    if (!cvValidation.valid) {
      return NextResponse.json(
        { error: cvValidation.error },
        { status: 400 }
      )
    }

    // 4. Validation job description (optionnel)
    if (jobDescription) {
      const jobValidation = validateJobDescription(jobDescription)
      if (!jobValidation.valid) {
        return NextResponse.json(
          { error: jobValidation.error },
          { status: 400 }
        )
      }
    }

    // 5. Génération preview (8s timeout)
    const preview = await generatePreviewAnalysis(
      cvValidation.content!,
      jobDescription || "",
      { timeout: 8000 }
    )

    // 6. Sauvegarder dans PreviewAnalysis avec token
    const previewToken = await previewAnalysisService.analyzePreview({
      cvText: cvValidation.content!,
      jobText: jobDescription,
      ipHash: fingerprint,
      fingerprint: fingerprint,
    })

    // 7. Réponse teaser avec insights intelligents
    const gapToOptimal = Math.max(0, 80 - preview.score)
    
    // Calcul percentile (basé sur distribution hypothétique)
    const percentile = Math.min(95, Math.max(5, Math.round((preview.score / 100) * 100)))
    
    // Dimensions pour radar (préparation Phase 2)
    const radarDimensions = {
      structure: Math.min(100, preview.score + Math.random() * 10 - 5),
      keywords: Math.min(100, preview.score + Math.random() * 15 - 7),
      impact: Math.min(100, preview.score + Math.random() * 10 - 5),
      clarity: Math.min(100, preview.score + Math.random() * 8 - 4),
      relevance: jobDescription ? Math.min(100, preview.score + 15) : preview.score,
    }

    const response = NextResponse.json({
      previewToken: previewToken.previewToken,
      score: preview.score,
      gapToOptimal,
      percentile,
      strengths: preview.strengths,
      weakness: preview.weakness,
      radarDimensions,
      message: `Il vous manque ${gapToOptimal} points pour atteindre le seuil recommandé. Ce gap peut impacter vos chances d'entretien.`,
    })

    // 8. Set cookie pour persistance
    response.cookies.set('preview_token', previewToken.previewToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24h
      path: '/',
    })

    return response

  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: "preview" },
      extra: { fingerprint },
    })
    logger.error({ err: error, route: "/api/public/analyze-preview" }, "Preview analysis failed")
    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    )
  }
}
