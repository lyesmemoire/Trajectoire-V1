// apps/web/src/lib/subscription/SubscriptionResolver.ts
//
// Capacités d'un utilisateur (export, copilot, historique…) et résolution d'accès
// (`canAccess`). SOURCE DE VÉRITÉ du plan : `lib/quota/plan-access` (`loadPlanAccess`) —
// période de grâce `past_due`, expiration du Pack, annulation et impayé y sont déjà
// appliqués. Ce fichier ne relit ni le statut Stripe ni `Subscription.plan` : il ne
// fait que traduire le plan effectif en capacités.
//
// Utilisé aujourd'hui par `AuthorizationModule` (contrôle d'administrateur des pages
// admin) et par la route interne `api/auth/check-access`.

import { loadPlanAccess } from '@/lib/quota/plan-access'
import { SubscriptionPlan, SubscriptionCapabilities, AccessResolution } from '@/types/subscription'

// ============================================================
// SERVICE SUBSCRIPTION RESOLVER
// ============================================================

/**
 * Service de résolution des droits d'abonnement.
 *
 * Le middleware utilise uniquement canAccess() pour vérifier les droits.
 * Les composants peuvent utiliser les méthodes spécifiques (hasPremium, canExport, etc.)
 *
 * Les plans TEAM et ENTERPRISE existent dans l'énumération mais pas dans la grille
 * tarifaire (`lib/plans.ts`) : `create()` ne peut pas les produire.
 */
export class SubscriptionResolver {
  private userId: string
  private userPlan: SubscriptionPlan
  private userRole: string | null

  /**
   * Constructeur privé - utiliser create() pour instancier
   */
  private constructor(
    userId: string,
    userPlan: SubscriptionPlan,
    userRole: string | null
  ) {
    this.userId = userId
    this.userPlan = userPlan
    this.userRole = userRole
  }

  /**
   * Crée une instance de SubscriptionResolver pour un utilisateur
   *
   * @param userId - L'ID de l'utilisateur
   * @returns Instance de SubscriptionResolver
   */
  static async create(userId: string): Promise<SubscriptionResolver> {
    const access = await loadPlanAccess(userId)

    return new SubscriptionResolver(
      userId,
      SubscriptionPlan[access.effective],
      access.role
    )
  }

  // ============================================================
  // MÉTHODES DE VÉRIFICATION DES CAPACITÉS
  // ============================================================

  /**
   * Vérifie si l'utilisateur a accès aux fonctionnalités premium
   *
   * @returns true si l'utilisateur est admin ou si son plan effectif est payant
   *          (PACK non expiré, PRO actif ou en période de grâce)
   */
  hasPremium(): boolean {
    // Les admins ont toujours accès premium
    if (this.isAdmin()) {
      return true
    }

    return this.userPlan === SubscriptionPlan.PRO ||
           this.userPlan === SubscriptionPlan.PACK ||
           this.userPlan === SubscriptionPlan.TEAM ||
           this.userPlan === SubscriptionPlan.ENTERPRISE
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
           this.userPlan === SubscriptionPlan.PACK ||
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

    // PRO : illimité (lib/plans.ts) ; TEAM et ENTERPRISE aussi. Le Pack est limité à 5.
    return this.userPlan === SubscriptionPlan.PRO ||
           this.userPlan === SubscriptionPlan.TEAM ||
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
           this.userPlan === SubscriptionPlan.PACK ||
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
           this.userPlan === SubscriptionPlan.PACK ||
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
