// apps/web/src/lib/authorization/PermissionService.ts
//
// Service de gestion des permissions
// Définit les règles de permissions pour chaque action

import { Permission, PermissionRule, Role } from '@/types/permissions'
import { SubscriptionPlan } from '@/types/subscription'

// ============================================================
// SERVICE PERMISSION SERVICE
// ============================================================

/**
 * Service de gestion des permissions.
 * 
 * Responsabilités :
 * - Définir les règles de permissions
 * - Vérifier si une permission est accordée
 * - Mapper les permissions aux plans et rôles
 */
export class PermissionService {
  private static rules: Map<Permission, PermissionRule> = new Map()

  /**
   * Initialise les règles de permissions
   */
  private static initializeRules(): void {
    // ============================================================
    // EXPORT PERMISSIONS
    // ============================================================
    this.rules.set(Permission.EXPORT_REPORT_PDF, {
      permission: Permission.EXPORT_REPORT_PDF,
      allowedPlans: [SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Export PDF des rapports'
    })

    this.rules.set(Permission.EXPORT_REPORT_DOCX, {
      permission: Permission.EXPORT_REPORT_DOCX,
      allowedPlans: [SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Export DOCX des rapports'
    })

    this.rules.set(Permission.EXPORT_DATA_EXCEL, {
      permission: Permission.EXPORT_DATA_EXCEL,
      allowedPlans: [SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Export Excel des données'
    })

    this.rules.set(Permission.EXPORT_ANY, {
      permission: Permission.EXPORT_ANY,
      allowedPlans: [SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Export dans tous les formats'
    })

    // ============================================================
    // COPILOT PERMISSIONS
    // ============================================================
    this.rules.set(Permission.USE_COPILOT_BASIC, {
      permission: Permission.USE_COPILOT_BASIC,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Utiliser le copilot IA de base'
    })

    this.rules.set(Permission.USE_COPILOT_ADVANCED, {
      permission: Permission.USE_COPILOT_ADVANCED,
      allowedPlans: [SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Utiliser le copilot IA avancé'
    })

    this.rules.set(Permission.USE_COPILOT, {
      permission: Permission.USE_COPILOT,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Utiliser le copilot IA'
    })

    // ============================================================
    // SIMULATION / INTERVIEW PERMISSIONS
    // ============================================================
    this.rules.set(Permission.RUN_INTERVIEW, {
      permission: Permission.RUN_INTERVIEW,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Lancer une simulation d\'entretien'
    })

    this.rules.set(Permission.RUN_UNLIMITED_INTERVIEW, {
      permission: Permission.RUN_UNLIMITED_INTERVIEW,
      allowedPlans: [SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Lancer des simulations illimitées'
    })

    this.rules.set(Permission.ACCESS_INTERVIEW_REPORTS, {
      permission: Permission.ACCESS_INTERVIEW_REPORTS,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder aux rapports de simulation'
    })

    // ============================================================
    // ANALYZE PERMISSIONS
    // ============================================================
    this.rules.set(Permission.ANALYZE_CV, {
      permission: Permission.ANALYZE_CV,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Analyser un CV'
    })

    this.rules.set(Permission.ANALYZE_JOB, {
      permission: Permission.ANALYZE_JOB,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Analyser une offre d\'emploi'
    })

    this.rules.set(Permission.ACCESS_MATCHING, {
      permission: Permission.ACCESS_MATCHING,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder au matching CV/Job'
    })

    // ============================================================
    // HISTORY PERMISSIONS
    // ============================================================
    this.rules.set(Permission.ACCESS_HISTORY_LIMITED, {
      permission: Permission.ACCESS_HISTORY_LIMITED,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder à l\'historique limité'
    })

    this.rules.set(Permission.ACCESS_HISTORY_UNLIMITED, {
      permission: Permission.ACCESS_HISTORY_UNLIMITED,
      allowedPlans: [SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder à l\'historique illimité'
    })

    // ============================================================
    // REPORTS PERMISSIONS
    // ============================================================
    this.rules.set(Permission.ACCESS_REPORTS_BASIC, {
      permission: Permission.ACCESS_REPORTS_BASIC,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder aux rapports de base'
    })

    this.rules.set(Permission.ACCESS_REPORTS_ADVANCED, {
      permission: Permission.ACCESS_REPORTS_ADVANCED,
      allowedPlans: [SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder aux rapports avancés'
    })

    this.rules.set(Permission.ACCESS_REPORTS_HR, {
      permission: Permission.ACCESS_REPORTS_HR,
      allowedPlans: [SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder aux rapports RH'
    })

    // ============================================================
    // ADMIN PERMISSIONS
    // ============================================================
    this.rules.set(Permission.ADMIN_DASHBOARD, {
      permission: Permission.ADMIN_DASHBOARD,
      allowedPlans: [],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder au dashboard admin'
    })

    this.rules.set(Permission.MANAGE_USERS, {
      permission: Permission.MANAGE_USERS,
      allowedPlans: [],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT],
      description: 'Gérer les utilisateurs'
    })

    this.rules.set(Permission.MANAGE_SUBSCRIPTIONS, {
      permission: Permission.MANAGE_SUBSCRIPTIONS,
      allowedPlans: [],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT],
      description: 'Gérer les abonnements'
    })

    this.rules.set(Permission.ACCESS_LOGS, {
      permission: Permission.ACCESS_LOGS,
      allowedPlans: [],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT],
      description: 'Accéder aux logs'
    })

    this.rules.set(Permission.ACCESS_MONITORING, {
      permission: Permission.ACCESS_MONITORING,
      allowedPlans: [],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT],
      description: 'Accéder au monitoring'
    })

    this.rules.set(Permission.MODIFY_CONFIG, {
      permission: Permission.MODIFY_CONFIG,
      allowedPlans: [],
      allowedRoles: [Role.ADMIN_FOUNDER],
      description: 'Modifier la configuration'
    })

    // ============================================================
    // API PERMISSIONS
    // ============================================================
    this.rules.set(Permission.ACCESS_API_BASIC, {
      permission: Permission.ACCESS_API_BASIC,
      allowedPlans: [SubscriptionPlan.FREE, SubscriptionPlan.PRO, SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.USER, Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder à l\'API de base'
    })

    this.rules.set(Permission.ACCESS_API_ADVANCED, {
      permission: Permission.ACCESS_API_ADVANCED,
      allowedPlans: [SubscriptionPlan.TEAM, SubscriptionPlan.ENTERPRISE],
      allowedRoles: [Role.ADMIN_FOUNDER, Role.ADMIN_PRODUCT, Role.ADMIN_SUPPORT],
      description: 'Accéder à l\'API avancée'
    })
  }

  /**
   * Vérifie si une permission est accordée pour un plan et un rôle
   * 
   * @param permission - La permission à vérifier
   * @param plan - Le plan de l'utilisateur
   * @param role - Le rôle de l'utilisateur
   * @returns true si la permission est accordée
   */
  static hasPermission(
    permission: Permission,
    plan: SubscriptionPlan,
    role: Role | null
  ): boolean {
    // Initialiser les règles si nécessaire
    if (this.rules.size === 0) {
      this.initializeRules()
    }

    const rule = this.rules.get(permission)
    if (!rule) {
      // Permission inconnue : refuser par défaut
      return false
    }

    // Vérifier le rôle
    if (role && rule.allowedRoles.includes(role)) {
      return true
    }

    // Vérifier le plan
    return rule.allowedPlans.includes(plan)
  }

  /**
   * Retourne la règle pour une permission
   * 
   * @param permission - La permission
   * @returns La règle ou undefined
   */
  static getRule(permission: Permission): PermissionRule | undefined {
    if (this.rules.size === 0) {
      this.initializeRules()
    }
    return this.rules.get(permission)
  }

  /**
   * Retourne toutes les permissions
   * 
   * @returns Toutes les règles de permissions
   */
  static getAllRules(): PermissionRule[] {
    if (this.rules.size === 0) {
      this.initializeRules()
    }
    return Array.from(this.rules.values())
  }

  /**
   * Retourne les permissions autorisées pour un plan et régime
   * 
   * @param plan - Le plan de l'utilisateur
   * @param role - Le rôle de l'utilisateur
   * @returns Liste des permissions autorisées
   */
  static getAuthorizedPermissions(plan: SubscriptionPlan, role: Role | null): Permission[] {
    if (this.rules.size === 0) {
      this.initializeRules()
    }

    const authorized: Permission[] = []
    for (const [permission, rule] of this.rules.entries()) {
      if (this.hasPermission(permission, plan, role)) {
        authorized.push(permission)
      }
    }
    return authorized
  }
}
