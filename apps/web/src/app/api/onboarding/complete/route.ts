// apps/web/src/app/api/onboarding/complete/route.ts
//
// USAGE : Appelée par OnboardingWizard à la fin de l'étape 3.
// ACCÈS : Utilisateur authentifié (session Supabase).
//
// SÉCURITÉ :
// - L'identité vient UNIQUEMENT de la session : aucun identifiant n'est lu dans le corps
//   (le schéma Zod est strict() et rejette toute clé inattendue, dont `userId`).
// - L'écriture ne peut concerner que la ligne de l'utilisateur authentifié.
//
// RETOUR :
// - 200 { success: true }
// - 400 corps illisible ou données invalides
// - 401 non authentifié
// - 409 profil utilisateur absent
// - 500 erreur inattendue
//
// Rejouer l'appel écrase les réponses précédentes (la page /onboarding redirige
// déjà vers /dashboard quand l'onboarding est terminé).

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { CompleteOnboardingSchema } from '@/validation/CompleteOnboardingSchema'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const NO_STORE = { 'Cache-Control': 'no-store' }

// Version du format stocké dans users.onboardingData (permet de le faire évoluer).
const ONBOARDING_DATA_VERSION = 1

function errorResponse(
  status: 400 | 401 | 409 | 500,
  code: string,
  message: string,
  details?: Array<{ path: string; message: string }>,
) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status, headers: NO_STORE },
  )
}

export async function POST(request: NextRequest) {
  // 1. Authentification : la session est la seule source de l'identité
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return errorResponse(401, 'UNAUTHORIZED', 'Authentification requise')
  }

  // 2. Lecture du corps
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse(400, 'INVALID_JSON', 'Corps de requête invalide')
  }

  // 3. Validation (strict : refuse les clés inattendues)
  const parsed = CompleteOnboardingSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(
      400,
      'VALIDATION_ERROR',
      'Données invalides',
      parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    )
  }

  const { targetJob, name, goal, cvProvided } = parsed.data

  // 4. Écriture sur l'utilisateur authentifié uniquement
  try {
    const result = await prisma.user.updateMany({
      where: { id: user.id },
      data: {
        name,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        onboardingData: {
          version: ONBOARDING_DATA_VERSION,
          targetJob,
          goal,
          cvProvided,
        },
      },
    })

    if (result.count === 0) {
      return errorResponse(409, 'PROFILE_NOT_FOUND', 'Profil utilisateur introuvable')
    }

    return NextResponse.json({ success: true }, { headers: NO_STORE })
  } catch (error) {
    // On ne journalise que l'identifiant : pas de données saisies (nom, poste).
    logger.error({ err: error, userId: user.id }, 'Error in onboarding/complete endpoint')
    return errorResponse(500, 'INTERNAL_ERROR', 'Erreur serveur')
  }
}
