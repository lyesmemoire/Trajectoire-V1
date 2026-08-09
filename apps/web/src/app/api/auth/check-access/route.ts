// apps/web/src/app/api/auth/check-access/route.ts
//
// USAGE : Appelée par le middleware et les composants client
// ACCÈS : Interne uniquement (vérification x-internal-request)
// RETOUR : { authenticated: boolean, accessLevel: string, subscription: object, role: string | null }
//
// COMPORTEMENT :
// - Utilise SubscriptionResolver pour toute la logique métier
// - Crée automatiquement le profil utilisateur s'il n'existe pas
// - Ne retourne jamais d'erreur pour un nouvel utilisateur
// - Assigne le plan FREE par défaut
// - Toujours renvoie une réponse valide

import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { SubscriptionResolver } from '@/lib/subscription/SubscriptionResolver'

// ============================================================
// TYPES DE RÉPONSE
// ============================================================

interface AccessCheckResponse {
  authenticated: boolean
  accessLevel: 'PUBLIC' | 'AUTHENTICATED' | 'PREMIUM' | 'ADMIN'
  subscription: {
    hasAccess: boolean
    status: string
    plan: string | null
  }
  role: string | null
  capabilities: {
    hasPremium: boolean
    hasAdmin: boolean
    canExport: boolean
    canUseCopilot: boolean
    canRunUnlimitedSimulation: boolean
    hasUnlimitedHistory: boolean
    hasAdvancedReports: boolean
    hasAdvancedAPI: boolean
  }
}

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

/**
 * Génère un code de parrainage unique
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ============================================================
// ENDPOINT PRINCIPAL
// ============================================================

export async function GET(request: NextRequest) {
  // Vérifier que c'est bien le middleware qui appelle
  const isInternal = request.headers.get('x-internal-request') === 'middleware'
  if (!isInternal) {
    return NextResponse.json(
      { error: 'Accès non autorisé' },
      { status: 403 }
    )
  }

  // Récupérer le user ID depuis les headers (mis par le middleware)
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    // Fallback : essayer via Supabase
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      // Utilisateur non authentifié
      const response: AccessCheckResponse = {
        authenticated: false,
        accessLevel: 'PUBLIC',
        subscription: {
          hasAccess: false,
          status: 'none',
          plan: null
        },
        role: null,
        capabilities: {
          hasPremium: false,
          hasAdmin: false,
          canExport: false,
          canUseCopilot: false,
          canRunUnlimitedSimulation: false,
          hasUnlimitedHistory: false,
          hasAdvancedReports: false,
          hasAdvancedAPI: false,
        }
      }
      return NextResponse.json(response)
    }

    // Utilisateur authentifié mais pas de userId dans header
    return await handleAuthenticatedUser(user.id, user.email)
  }

  // Utilisateur authentifié avec userId dans header
  return await handleAuthenticatedUser(userId)
}

// ============================================================
// GESTION DE L'UTILISATEUR AUTHENTIFIÉ
// ============================================================

/**
 * Gère la logique pour un utilisateur authentifié.
 * Crée automatiquement le profil s'il n'existe pas.
 * Utilise SubscriptionResolver pour la logique métier.
 * 
 * @param userId - L'ID de l'utilisateur Supabase
 * @param email - L'email de l'utilisateur (optionnel, pour la création)
 * @returns Response avec les informations d'accès
 */
async function handleAuthenticatedUser(userId: string, email?: string | null): Promise<NextResponse> {
  try {
    // 1. Chercher l'utilisateur en base de données
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        referralCode: true,
        onboardingCompleted: true
      }
    })

    // 2. Si l'utilisateur n'existe pas, le créer automatiquement
    if (!user) {
      logger.info({ userId, email }, 'Creating user profile automatically')
      
      user = await prisma.user.create({
        data: {
          id: userId,
          email: email || '',
          name: null, // Sera complété lors de l'onboarding
          plan: 'FREE', // Plan par défaut
          referralCode: generateReferralCode(),
          onboardingCompleted: false, // Par défaut, onboarding non terminé
        },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          role: true,
          referralCode: true,
          onboardingCompleted: true
        }
      })
    }

    // 3. Utiliser SubscriptionResolver pour déterminer les capacités
    const resolver = await SubscriptionResolver.create(userId)
    const capabilities = resolver.getCapabilities()
    
    // 4. Résoudre l'accès pour le niveau PREMIUM (pour compatibilité)
    const premiumAccess = resolver.canAccess('PREMIUM')

    // 5. Construire la réponse
    const response: AccessCheckResponse = {
      authenticated: true,
      accessLevel: premiumAccess.allowed ? 'PREMIUM' : (resolver.hasAdmin() ? 'ADMIN' : 'AUTHENTICATED'),
      subscription: {
        hasAccess: premiumAccess.allowed,
        status: 'active', // Simplifié pour compatibilité
        plan: user.plan || 'FREE'
      },
      role: user.role,
      capabilities
    }

    return NextResponse.json(response)

  } catch (error) {
    logger.error({ err: error, userId }, 'Error in check-access endpoint')
    
    // En cas d'erreur, retourner une réponse par défaut (fail-open)
    // Réponse par défaut pour les utilisateurs non authentifiés
    const defaultResponse: AccessCheckResponse = {
      authenticated: false,
      accessLevel: 'PUBLIC',
      subscription: {
        hasAccess: false,
        status: 'INACTIVE',
        plan: null,
      },
      role: null,
      capabilities: {
        hasPremium: false,
        hasAdmin: false,
        canExport: false,
        canUseCopilot: false,
        canRunUnlimitedSimulation: false,
        hasUnlimitedHistory: false,
        hasAdvancedReports: false,
        hasAdvancedAPI: false,
      },
    }
    
    return NextResponse.json(defaultResponse)
  }
}
