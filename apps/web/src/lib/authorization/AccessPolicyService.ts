// apps/web/src/lib/authorization/AccessPolicyService.ts
//
// Service de gestion des politiques d'accès
// Définit les politiques d'accès pour les ressources

import { AccessPolicy, Resource, Action, Permission, Role } from '@/types/permissions'

// ============================================================
// SERVICE ACCESS POLICY SERVICE
// ============================================================

/**
 * Service de gestion des politiques d'accès.
 * 
 * Responsabilités :
 * - Définir les politiques d'accès pour les ressources
 * - Vérifier l'accès à une ressource avec une action
 * - Mapper les actions aux permissions requises
 */
export class AccessPolicyService {
  private static policies: Map<Resource, AccessPolicy> = new Map()

  /**
   * Initialise les politiques d'accès
   */
  private static initializePolicies(): void {
    // ============================================================
    // REPORT RESOURCE
    // ============================================================
    this.policies.set(Resource.REPORT, {
      resource: Resource.REPORT,
      rolePermissions: {
        [Role.USER]: [Action.READ],
        [Role.ADMIN_FOUNDER]: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE, Action.EXPORT],
        [Role.ADMIN_PRODUCT]: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE, Action.EXPORT],
        [Role.ADMIN_SUPPORT]: [Action.READ, Action.CREATE, Action.UPDATE, Action.EXPORT],
      },
      actionPermissions: {
        [Action.READ]: [Permission.ACCESS_REPORTS_BASIC],
        [Action.CREATE]: [Permission.ACCESS_REPORTS_ADVANCED],
        [Action.UPDATE]: [Permission.ACCESS_REPORTS_ADVANCED],
        [Action.DELETE]: [Permission.MANAGE_USERS],
        [Action.EXPORT]: [Permission.EXPORT_ANY],
      },
    })

    // ============================================================
    // USER_DATA RESOURCE
    // ============================================================
    this.policies.set(Resource.USER_DATA, {
      resource: Resource.USER_DATA,
      rolePermissions: {
        [Role.USER]: [Action.READ, Action.UPDATE],
        [Role.ADMIN_FOUNDER]: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
        [Role.ADMIN_PRODUCT]: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
        [Role.ADMIN_SUPPORT]: [Action.READ, Action.UPDATE],
      },
      actionPermissions: {
        [Action.READ]: [Permission.ACCESS_API_BASIC],
        [Action.CREATE]: [Permission.MANAGE_USERS],
        [Action.UPDATE]: [Permission.ACCESS_API_BASIC],
        [Action.DELETE]: [Permission.MANAGE_USERS],
        [Action.EXPORT]: [Permission.EXPORT_DATA_EXCEL],
      },
    })

    // ============================================================
    // SYSTEM_CONFIG RESOURCE
    // ============================================================
    this.policies.set(Resource.SYSTEM_CONFIG, {
      resource: Resource.SYSTEM_CONFIG,
      rolePermissions: {
        [Role.USER]: [],
        [Role.ADMIN_FOUNDER]: [Action.READ, Action.CREATE, Action.UPDATE, Action.DELETE],
        [Role.ADMIN_PRODUCT]: [Action.READ, Action.UPDATE],
        [Role.ADMIN_SUPPORT]: [Action.READ],
      },
      actionPermissions: {
        [Action.READ]: [Permission.ADMIN_DASHBOARD],
        [Action.CREATE]: [Permission.MODIFY_CONFIG],
        [Action.UPDATE]: [Permission.MODIFY_CONFIG],
        [Action.DELETE]: [Permission.MODIFY_CONFIG],
        [Action.EXPORT]: [Permission.ACCESS_LOGS],
      },
    })

    // ============================================================
    // LOGS RESOURCE
    // ============================================================
    this.policies.set(Resource.LOGS, {
      resource: Resource.LOGS,
      rolePermissions: {
        [Role.USER]: [],
        [Role.ADMIN_FOUNDER]: [Action.READ, Action.EXPORT],
        [Role.ADMIN_PRODUCT]: [Action.READ, Action.EXPORT],
        [Role.ADMIN_SUPPORT]: [Action.READ],
      },
      actionPermissions: {
        [Action.READ]: [Permission.ACCESS_LOGS],
        [Action.CREATE]: [],
        [Action.UPDATE]: [],
        [Action.DELETE]: [],
        [Action.EXPORT]: [Permission.ACCESS_LOGS],
      },
    })
  }

  /**
   * Vérifie si une action est autorisée sur une ressource pour un rôle
   * 
   * @param resource - La ressource
   * @param action - L'action
   * @param role - Le rôle de l'utilisateur
   * @returns true si l'action est autorisée
   */
  static canPerformAction(resource: Resource, action: Action, role: Role | null): boolean {
    // Initialiser les politiques si nécessaire
    if (this.policies.size === 0) {
      this.initializePolicies()
    }

    const policy = this.policies.get(resource)
    if (!policy) {
      // Politique inconnue : refuser par défaut
      return false
    }

    // Si pas de rôle, refuser
    if (!role) {
      return false
    }

    // Vérifier si le rôle peut effectuer l'action
    const allowedActions = policy.rolePermissions[role] || []
    return allowedActions.includes(action)
  }

  /**
   * Retourne les permissions requises pour une action sur une ressource
   * 
   * @param resource - La ressource
   * @param action - L'action
   * @returns Liste des permissions requises
   */
  static getRequiredPermissions(resource: Resource, action: Action): Permission[] {
    if (this.policies.size === 0) {
      this.initializePolicies()
    }

    const policy = this.policies.get(resource)
    if (!policy) {
      return []
    }

    return policy.actionPermissions[action] || []
  }

  /**
   * Retourne toutes les politiques
   * 
   * @returns Toutes les politiques d'accès
   */
  static getAllPolicies(): AccessPolicy[] {
    if (this.policies.size === 0) {
      this.initializePolicies()
    }
    return Array.from(this.policies.values())
  }

  /**
   * Retourne la politique pour une ressource
   * 
   * @param resource - La ressource
   * @returns La politique ou undefined
   */
  static getPolicy(resource: Resource): AccessPolicy | undefined {
    if (this.policies.size === 0) {
      this.initializePolicies()
    }
    return this.policies.get(resource)
  }
}
