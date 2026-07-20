// apps/web/src/app/api/cv/analyze/route.ts
// MIGRATION L2.2 — Corrigé le 19 juillet 2026
// MIGRATION L3 — Intégration HIIOS le 19 juillet 2026
// CHANGEMENTS : 
//   - Suppression du code billing non fonctionnel (lignes 93-112)
//   - Intégration CVHIIOSBridge pour initialiser le kernel HIIOS
// RAISON : 
//   - Stripe non encore câblé (L1.1 Waiting External Dependency)
//   - Création du tunnel CV → HIIOS
// TODO-BILLING : Réintégrer la vérification d'abonnement quand L1.1 est DONE

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { CVHIIOSBridge } from '@/application/services/CVHIIOSBridge'

// ============================================================
// SCHÉMA — Identique à legacy/api/cv/analyze (parité confirmée)
// ============================================================

const CvAnalysisSchema = z.object({
  personal: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  currentPosition: z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    yearsInRole: z.number().optional(),
  }).optional(),
  totalExperience: z.number().optional(),
  experiences: z.array(z.object({
    company: z.string(),
    title: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    highlights: z.array(z.string()).optional(),
  })),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string().optional(),
    field: z.string().optional(),
    year: z.number().optional(),
  })),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    languages: z.array(z.string()),
  }),
  careerDNA: z.object({
    seniority: z.enum(['junior', 'mid', 'senior', 'executive']),
    strengths: z.array(z.string()),
    patterns: z.array(z.string()),
    targetRoles: z.array(z.string()),
    industries: z.array(z.string()),
    redFlags: z.array(z.string()),
  }),
})

type CvAnalysis = z.infer<typeof CvAnalysisSchema>

// ============================================================
// PROMPT — Identique à legacy (parité confirmée)
// ============================================================

const SYSTEM_PROMPT = `Tu es un expert en analyse de parcours professionnels.
Tu analyses des CV et extrais les informations de manière structurée et objective.

Règles :
- Ne jamais inventer d'informations absentes du CV
- Être factuel et précis
- Pour les champs absents, utiliser null ou []
- Répondre UNIQUEMENT en JSON valide`

// ============================================================
// HANDLER
// ============================================================

export async function POST(request: NextRequest) {

  // 1. Authentification
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    )
  }

  // 2. Validation de l'entrée
  let body: { extractedText: string; fileName?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Corps de requête invalide — JSON attendu' },
      { status: 400 }
    )
  }

  const text = body?.extractedText?.trim()

  if (!text || text.length < 50) {
    return NextResponse.json(
      { error: 'Texte CV absent ou trop court (minimum 50 caractères)' },
      { status: 400 }
    )
  }

  // 3. Appel Mistral — identique à legacy
  let structured: CvAnalysis

  try {
    const { Mistral } = await import('@mistralai/mistralai')
    const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })

    // Timeout de 30 secondes pour l'appel IA
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const completion = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyse ce CV :\n\n${text.slice(0, 8000)}` 
        }
      ],
      responseFormat: { type: 'json_object' },
      temperature: 0.1,
    }, { signal: controller.signal })

    clearTimeout(timeout)

    const rawContent = completion.choices?.[0]?.message?.content

    if (!rawContent || typeof rawContent !== 'string') {
      throw new Error('Réponse Mistral vide')
    }

    const parsed = JSON.parse(rawContent)
    structured = CvAnalysisSchema.parse(parsed)

  } catch (err) {
    if (err instanceof z.ZodError) {
      logger.error({
        event: 'CV analyze — schema validation failed',
        errorType: 'ZOD_VALIDATION',
        fieldCount: err.issues.length,
        userId: user.id,
      })
      return NextResponse.json(
        { error: 'Structure de réponse IA invalide' },
        { status: 422 }
      )
    }

    if (err instanceof Error && err.name === 'AbortError') {
      logger.error({
        event: 'CV analyze — Mistral timeout',
        userId: user.id,
      })
      return NextResponse.json(
        { error: 'L\'analyse IA prend trop de temps. Veuillez réessayer.' },
        { status: 504 }
      )
    }

    logger.error({
      event: 'CV analyze — Mistral error',
      userId: user.id,
      message: err instanceof Error ? err.message : 'Unknown error',
    })

    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse IA' },
      { status: 502 }
    )
  }

  // 4. Sauvegarde BDD
  // NOTE : Pas de vérification billing ici
  // TODO-BILLING : Ajouter checkSubscription(userId) quand L1.1 est DONE

  try {
    await prisma.$transaction(async (tx) => {

      await tx.cVAnalysis.create({
        data: {
          userId: user.id,
          fileName: body.fileName ?? 'cv',
          originalText: text,
          optimizedText: text, // Pour la V1, pas d'optimisation
          cvData: structured,
        }
      })

      await tx.careerProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          careerDNA: structured.careerDNA,
        },
        update: {
          careerDNA: structured.careerDNA,
        }
      })

    })

  } catch (err) {
    logger.error({
      event: 'CV analyze — database error',
      userId: user.id,
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }

  // 5. Initialiser HIIOS avec les données CV (L3 - Tunnel CV → HIIOS)
  let hiiosContext: any = null
  try {
    const hiiOSContext = CVHIIOSBridge.initializeFromCV(structured, user.id)
    hiiosContext = {
      sessionId: hiiOSContext.sessionId,
      seniority: structured.careerDNA.seniority,
      strengths: structured.careerDNA.strengths,
      targetRoles: structured.careerDNA.targetRoles,
      skills: [
        ...structured.skills.technical,
        ...structured.skills.soft,
      ],
      totalExperience: structured.totalExperience ?? 0,
      // Métadonnées HIIOS
      hypothesesCount: hiiOSContext.hypothesisEngine.getAll().length,
      evidenceCount: hiiOSContext.evidenceEngine.getAll().length,
      skillCoverage: hiiOSContext.skillGraph.getCoveragePercent(),
    }
  } catch (err) {
    logger.error({
      event: 'CV analyze — HIIOS initialization error',
      userId: user.id,
      message: err instanceof Error ? err.message : 'Unknown error',
    })
    // Continuer sans HIIOS en cas d'erreur (fail open)
    hiiosContext = {
      sessionId: null,
      seniority: structured.careerDNA.seniority,
      strengths: structured.careerDNA.strengths,
      targetRoles: structured.careerDNA.targetRoles,
      skills: [
        ...structured.skills.technical,
        ...structured.skills.soft,
      ],
      totalExperience: structured.totalExperience ?? 0,
    }
  }

  // 6. Réponse
  return NextResponse.json({
    success: true,
    data: structured,
    hiiosContext,
  })
}
