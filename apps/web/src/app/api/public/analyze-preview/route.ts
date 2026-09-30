import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit/upstash-rate-limit"
import { generateFingerprint } from "@/lib/security/ip-extraction"
import { readCvFile } from "@/lib/cv/cv-file"
import { validateJobDescription } from "@/lib/validators/cv-validator"
import { buildFreePreview } from "@/lib/cv-analysis/preview"
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
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json(
        { error: "Requête invalide : envoyez le CV en multipart/form-data." },
        { status: 415 },
      )
    }
    const cvFile = formData.get("cv") as File
    const jobDescription = formData.get("jobDescription") as string

    // 3. Validation et lecture du CV (même validateur que api/cv/upload : lib/cv/cv-file.ts)
    const cv = await readCvFile(cvFile instanceof File ? cvFile : null)
    if (!cv.ok) {
      return NextResponse.json(
        { error: cv.error, ...(cv.hint ? { hint: cv.hint } : {}) },
        { status: cv.status }
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

    // 5. Aperçu : analyse déterministe (aucune IA, aucun coût, résultat reproductible)
    const preview = buildFreePreview(cv.text, jobDescription || "")

    // 6. Sauvegarder le RÉSULTAT (jamais le texte du CV ni de l'offre) avec un token
    const { previewToken } = await previewAnalysisService.savePreviewAnalysis({
      result: preview,
      ipHash: fingerprint,
      fingerprint: fingerprint,
    })

    // 7. Réponse : uniquement ce qui est réellement calculé (score, forces, faiblesse).
    // Percentile, écart « au seuil » et dimensions du radar étaient inventés
    // (dérivés du score, ou aléatoires) : ils ont été retirés.
    const response = NextResponse.json({
      previewToken,
      score: preview.score,
      strengths: preview.strengths,
      weakness: preview.weakness,
      mode: preview.mode,
      confidence: preview.confidence,
      warnings: preview.warnings,
    })

    // 8. Set cookie pour persistance
    response.cookies.set('preview_token', previewToken, {
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
