// apps/web/src/lib/subscription/SubscriptionResolver.ts
//
// Service de résolution des droits d'abonnement
// Centralise toute la logique métier liée aux abonnements
// Le middleware ne fait qu'appeler canAccess() pour vérifier les droits

import { prisma } from '@/lib/prisma'
import { SubscriptionPlan, SubscriptionStatus, SubscriptionCapabilities, AccessResolution } from '@/types/subscription'

// ============================================================
// SERVICE SUBSCRIPTION RESOLVER
// ============================================================

/**
 * Service de résolution des droits d'abonnement.
 * 
 * Responsabilités :
 * - Déterminer les capacités d'un utilisateur basées sur son abonnement
 * - Résoudre l'accès aux fonctionnalités
 * - Centraliser la logique métier des abonnements
 * 
 * Le middleware utilise uniquement canAccess() pour vérifier les droits.
 * Les composants peuvent utiliser les méthodes spécifiques (hasPremium, canExport, etc.)
 */
export class SubscriptionResolver {
  private userId: string
  private userPlan: SubscriptionPlan
  private userRole: string | null
  private subscriptionStatus: SubscriptionStatus | null

  /**
   * Constructeur privé - utiliser create() pour instancier
   */
  private constructor(
    userId: string,
    userPlan: SubscriptionPlan,
    userRole: string | null,
    subscriptionStatus: SubscriptionStatus | null
  ) {
    this.userId = userId
    this.userPlan = userPlan
    this.userRole = userRole
    this.subscriptionStatus = subscriptionStatus
  }

  /**
   * Crée une instance de SubscriptionResolver pour un utilisateur
   * 
   * @param userId - L'ID de l'utilisateur
   * @returns Instance de SubscriptionResolver
   */
  static async create(userId: string): Promise<SubscriptionResolver> {
    // Récupérer les données utilisateur et abonnement
    const [user, subscription] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true, role: true }
      }),
      prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { status: true, plan: true }
      })
    ])

    // Déterminer le plan (priorité : subscription > user plan > FREE)
    const plan = subscription?.plan 
      ? this.mapStringToPlan(subscription.plan)
      : user?.plan 
        ? this.mapStringToPlan(user.plan)
        : SubscriptionPlan.FREE

    // Déterminer le statut
    const status = subscription?.status 
      ? this.mapStringToStatus(subscription.status)
      : SubscriptionStatus.ACTIVE

    return new SubscriptionResolver(
      userId,
      plan,
      user?.role || null,
      status
    )
  }

  /**
   * Mappe une chaîne de caractères vers SubscriptionPlan
   */
  private static mapStringToPlan(plan: string): SubscriptionPlan {
    const upperPlan = plan.toUpperCase()
    if (Object.values(SubscriptionPlan).includes(upperPlan as SubscriptionPlan)) {
      return upperPlan as SubscriptionPlan
    }
    return SubscriptionPlan.FREE
  }

  /**
   * Mappe une chaîne de caractères vers SubscriptionStatus
   */
  private static mapStringToStatus(status: string): SubscriptionStatus {
    const upperStatus = status.toUpperCase()
    if (Object.values(SubscriptionStatus).includes(upperStatus as SubscriptionStatus)) {
      return upperStatus as SubscriptionStatus
    }
    return SubscriptionStatus.ACTIVE
  }

  // ============================================================
  // MÉTHODES DE VÉRIFICATION DES CAPACITÉS
  // ============================================================

  /**
   * Vérifie si l'utilisateur a accès aux fonctionnalités premium
   * 
   * @returns true si l'utilisateur a un abonnement actif ou est admin
   */
  hasPremium(): boolean {
    // Les admins ont toujours accès premium
    if (this.isAdmin()) {
      return true
    }

    // Vérifier si l'abonnement est actif
    const isActiveSubscription = this.subscriptionStatus === SubscriptionStatus.ACTIVE ||
                                  this.subscriptionStatus === SubscriptionStatus.TRIAL

    // Les plans PRO, TEAM, ENTERPRISE ont accès premium
    const isPremiumPlan = this.userPlan === SubscriptionPlan.PRO ||
                         this.userPlan === SubscriptionPlan.TEAM ||
                         this.userPlan === SubscriptionPlan.ENTERPRISE

    return isActiveSubscription && isPremiumPlan
  }

  /**
   * Vérifie si l'utilisateur a un rôle administrateur
   * 
   * @returns true si l'utilisateur est admin
   */
  hasAdmin(): boolean {
    return this.isAdmin()
  }

  /**
   * Vérifie si l'utilisateur peut exporter des documents
   * 
   * @returns true si l'utilisateur peut exporter (PDF, DOCX, Excel)
   */
  canExport(): boolean {
    // Les admins peuvent toujours exporter
    if (this.isAdmin()) {
      return true
    }

    // Les plans PRO, TEAM, ENTERPRISE peuvent exporter
    return this.userPlan === SubscriptionPlan.PRO ||
           this.userPlan === SubscriptionPlan.TEAM ||
           this.userPlan === SubscriptionPlan.ENTERPRISE
  }

  /**
   * Vérifie si l'utilisateur peut utiliser le copilot IA
   * 
   * @returns true si l'utilisateur peut utiliser le copilot
   */
  canUseCopilot(): boolean {
    // Tous les utilisateurs authentifiés peuvent utiliser le copilot de base
    // Les fonctionnalités avancées nécessitent un plan premium
    return this.userPlan !== SubscriptionPlan.FREE || this.hasPremium()
  }

  /**
   * Vérifie si l'utilisateur peut lancer des simulations illimitées
   * 
   * @returns true si l'utilisateur a des simulations illimitées
   */
  canRunUnlimitedSimulation(): boolean {
    // Les admins peuvent lancer des simulations illimitées
    if (this.isAdmin()) {
      return true
    }

    // Les plans TEAM et ENTERPRISE ont des simulations illimitées
    return this.userPlan === SubscriptionPlan.TEAM ||
           this.userPlan === SubscriptionPlan.ENTERPRISE
  }

  /**
   * Vérifie si l'utilisateur a un historique illimité
   * 
   * @returns true si l'utilisateur a un historique illimité
   */
  hasUnlimitedHistory(): boolean {
    // Les admins ont un historique illimité
    if (this.isAdmin()) {
      return true
    }

    // Les plans PRO, TEAM, ENTERPRISE ont un historique illimité
    return this.userPlan === SubscriptionPlan.PRO ||
           this.userPlan === SubscriptionPlan.TEAM ||
           this.userPlan === SubscriptionPlan.ENTERPRISE
  }

  /**
   * Vérifie si l'utilisateur peut accéder aux rapports avancés
   * 
   * @returns true si l'utilisateur peut accéder aux rapports avancés
   */
  hasAdvancedReports(): boolean {
    // Les admins ont accès aux rapports avancés
    if (this.isAdmin()) {
      return true
    }

    // Les plans PRO, TEAM, ENTERPRISE ont accès aux rapports avancés
    return this.userPlan === SubscriptionPlan.PRO ||
           this.userPlan === SubscriptionPlan.TEAM ||
           this.userPlan === SubscriptionPlan.ENTERPRISE
  }

  /**
   * Vérifie si l'utilisateur peut accéder à l'API avancée
   * 
   * @returns true si l'utilisateur peut accéder à l'API avancée
   */
  hasAdvancedAPI(): boolean {
    // Les admins ont accès à l'API avancée
    if (this.isAdmin()) {
      return true
    }

    // Seuls les plans TEAM et ENTERPRISE ont accès à l'API avancée
    return this.userPlan === SubscriptionPlan.TEAM ||
           this.userPlan === SubscriptionPlan.ENTERPRISE
  }

  // ============================================================
  // MÉTHODES DE RÉSOLUTION D'ACCÈS
  // ============================================================

  /**
   * Résout l'accès pour une route ou fonctionnalité
   * Méthode principale utilisée par le middleware
   * 
   * @param requiredLevel - Niveau d'accès requis
   * @returns Résolution d'accès
   */
  canAccess(requiredLevel: 'PUBLIC' | 'AUTHENTICATED' | 'PREMIUM' | 'ADMIN'): AccessResolution {
    const currentLevel = this.getCurrentAccessLevel()

    // PUBLIC : toujours autorisé
    if (requiredLevel === 'PUBLIC') {
      return {
        allowed: true,
        requiredLevel,
        currentLevel
      }
    }

    // AUTHENTICATED : nécessite une authentification
    if (requiredLevel === 'AUTHENTICATED') {
      return {
        allowed: true,
        requiredLevel,
        currentLevel
      }
    }

    // PREMIUM : nécessite un abonnement premium ou admin
    if (requiredLevel === 'PREMIUM') {
      if (this.hasPremium()) {
        return {
          allowed: true,
          requiredLevel,
          currentLevel
        }
      }
      return {
        allowed: false,
        reason: 'Premium subscription required',
        requiredLevel,
        currentLevel
      }
    }

    // ADMIN : nécessite un rôle admin
    if (requiredLevel === 'ADMIN') {
      if (this.isAdmin()) {
        return {
          allowed: true,
          requiredLevel,
          currentLevel
        }
      }
      return {
        allowed: false,
        reason: 'Admin role required',
        requiredLevel,
        currentLevel
      }
    }

    // Par défaut : autorisé
    return {
      allowed: true,
      requiredLevel,
      currentLevel
    }
  }

  /**
   * Retourne toutes les capacités de l'utilisateur
   * 
   * @returns Capacités de l'utilisateur
   */
  getCapabilities(): SubscriptionCapabilities {
    return {
      hasPremium: this.hasPremium(),
      hasAdmin: this.hasAdmin(),
      canExport: this.canExport(),
      canUseCopilot: this.canUseCopilot(),
      canRunUnlimitedSimulation: this.canRunUnlimitedSimulation(),
      hasUnlimitedHistory: this.hasUnlimitedHistory(),
      hasAdvancedReports: this.hasAdvancedReports(),
      hasAdvancedAPI: this.hasAdvancedAPI(),
    }
  }

  // ============================================================
  // MÉTHODES PRIVÉES
  // ============================================================

  /**
   * Vérifie si l'utilisateur est admin
   */
  private isAdmin(): boolean {
    return this.userRole !== null && 
           ['ADMIN_FOUNDER', 'ADMIN_PRODUCT', 'ADMIN_SUPPORT'].includes(this.userRole)
  }

  /**
   * Détermine le niveau d'accès actuel de l'utilisateur
   */
  private getCurrentAccessLevel(): 'PUBLIC' | 'AUTHENTICATED' | 'PREMIUM' | 'ADMIN' {
    if (this.isAdmin()) {
      return 'ADMIN'
    }
    if (this.hasPremium()) {
      return 'PREMIUM'
    }
    return 'AUTHENTICATED'
  }
}
