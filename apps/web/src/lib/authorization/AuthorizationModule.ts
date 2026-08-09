// apps/web/src/lib/authorization/AuthorizationModule.ts
//
// Module d'autorisation centralisé
// Regroupe tous les services d'autorisation

import { PermissionService } from './PermissionService'
import { AccessPolicyService } from './AccessPolicyService'
import { RoleService } from './RoleService'
import { SubscriptionService } from './SubscriptionService'
import { SubscriptionResolver } from '../subscription/SubscriptionResolver'
import { Permission, Role, Resource, Action } from '@/types/permissions'
import { AuthorizationResult } from '@/types/permissions'
import { SubscriptionPlan } from '@/types/subscription'

// ============================================================
// AUTHORIZATION MODULE
// ============================================================

/**
 * Module d'autorisation centralisé.
 * 
 * Responsabilités :
 * - Fournir une interface unique pour vérifier les autorisations
 * - Coordonner les différents services d'autorisation
 * - Simplifier l'utilisation du système de permissions
 * 
 * Utilisation :
 * ```ts
 * const auth = await AuthorizationModule.create(userId)
 * const canExport = auth.can(Permission.EXPORT_REPORT_PDF)
 * ```
 */
export class AuthorizationModule {
  private userId: string
  private plan: SubscriptionPlan
  private role: Role | null
  private resolver: SubscriptionResolver | null = null

  private constructor(userId: string, plan: SubscriptionPlan, role: Role | null) {
    this.userId = userId
    this.plan = plan
    this.role = role
  }

  /**
   * Crée une instance du module d'autorisation pour un utilisateur
   * 
   * @param userId - L'ID de l'utilisateur
   * @returns Instance d'AuthorizationModule
   */
  static async create(userId: string): Promise<AuthorizationModule> {
    // Créer le SubscriptionResolver pour récupérer les infos utilisateur
    const resolver = await SubscriptionResolver.create(userId)
    const capabilities = resolver.getCapabilities()

    // Déterminer le plan et le rôle
    // Pour simplifier, on utilise les valeurs du resolver
    // Dans une implémentation réelle, on pourrait récupérer ces valeurs depuis la BDD
    const plan = capabilities.hasPremium ? SubscriptionPlan.PRO : SubscriptionPlan.FREE
    const role = capabilities.hasAdmin ? Role.ADMIN_FOUNDER : Role.USER

    const authModule = new AuthorizationModule(userId, plan, role)
    authModule.resolver = resolver

    return authModule
  }

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   * Méthode principale et la plus simple à utiliser
   * 
   * @param permission - La permission à vérifier
   * @returns true si la permission est accordée
   */
  can(permission: Permission): boolean {
    return PermissionService.hasPermission(permission, this.plan, this.role)
  }

  /**
   * Vérifie si l'utilisateur peut effectuer une action sur une ressource
   * 
   * @param resource - La ressource
   * @param action - L'action
   * @returns true si l'action est autorisée
   */
  canPerform(resource: Resource, action: Action): boolean {
    return AccessPolicyService.canPerformAction(resource, action, this.role)
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique ou supérieur
   * 
   * @param requiredRole - Le rôle requis
   * @returns true si l'utilisateur a le rôle ou un rôle supérieur
   */
  hasRole(requiredRole: Role): boolean {
    if (!this.role) {
      return false
    }
    return RoleService.hasRoleOrHigher(this.role, requiredRole)
  }

  /**
   * Vérifie si l'utilisateur est admin
   * 
   * @returns true si l'utilisateur est admin
   */
  isAdmin(): boolean {
    return RoleService.isAdmin(this.role)
  }

  /**
   * Vérifie si l'utilisateur a une capacité spécifique de son plan
   * 
   * @param capability - La capacité à vérifier
   * @returns true si le plan a la capacité
   */
  hasCapability(capability: string): boolean {
    return SubscriptionService.hasCapability(this.plan, capability)
  }

  /**
   * Retourne le quota mensuel pour une ressource
   * 
   * @param resource - La ressource
   * @returns Le quota ou null si illimité
   */
  getQuota(resource: string): number | null {
    return SubscriptionService.getMonthlyQuota(this.plan, resource)
  }

  /**
   * Retourne toutes les permissions de l'utilisateur
   * 
   * @returns Liste des permissions
   */
  getPermissions(): Permission[] {
    const rolePermissions = RoleService.getRolePermissions(this.role || Role.USER)
    const planPermissions = SubscriptionService.getPlanPermissions(this.plan)
    
    // Fusionner et dédupliquer
    const allPermissions = new Set([...rolePermissions, ...planPermissions])
    return Array.from(allPermissions)
  }

  /**
   * Retourne toutes les capacités du plan de l'utilisateur
   * 
   * @returns Les capacités du plan
   */
  getCapabilities(): any {
    return SubscriptionService.getPlanCapabilities(this.plan)
  }

  /**
   * Résout une autorisation avec un résultat détaillé
   * 
   * @param permission - La permission à vérifier
   * @returns Résultat d'autorisation détaillé
   */
  resolve(permission: Permission): AuthorizationResult {
    const allowed = this.can(permission)

    if (allowed) {
      return {
        allowed: true,
      }
    }

    const rule = PermissionService.getRule(permission)
    return {
      allowed: false,
      reason: `Permission ${permission} not granted for plan ${this.plan}`,
      requiredPermission: permission,
      requiredRole: rule?.allowedRoles[0] as Role,
    }
  }

  /**
   * Vérifie plusieurs permissions à la fois
   * 
   * @param permissions - Liste des permissions à vérifier
   * @returns Map des permissions et leur statut
   */
  canMultiple(permissions: Permission[]): Map<Permission, boolean> {
    const results = new Map<Permission, boolean>()
    for (const permission of permissions) {
      results.set(permission, this.can(permission))
    }
    return results
  }

  /**
   * Vérifie si toutes les permissions sont accordées
   * 
   * @param permissions - Liste des permissions à vérifier
   * @returns true si toutes les permissions sont accordées
   */
  canAll(permissions: Permission[]): boolean {
    return permissions.every(permission => this.can(permission))
  }

  /**
   * Vérifie si au moins une permission est accordée
   * 
   * @param permissions - Liste des permissions à vérifier
   * @returns true si au moins une permission est accordée
   */
  canAny(permissions: Permission[]): boolean {
    return permissions.some(permission => this.can(permission))
  }

  /**
   * Retourne les informations de l'utilisateur
   * 
   * @returns Informations de l'utilisateur
   */
  getUserInfo() {
    return {
      userId: this.userId,
      plan: this.plan,
      role: this.role,
    }
  }

  /**
   * Retourne le SubscriptionResolver sous-jacent
   * 
   * @returns SubscriptionResolver ou null
   */
  getResolver(): SubscriptionResolver | null {
    return this.resolver
  }
}

// ============================================================
// FONCTIONS CONVENIENCE (pour usage rapide)
// ============================================================

/**
 * Fonction de commodité pour vérifier une permission
 * 
 * @param userId - L'ID de l'utilisateur
 * @param permission - La permission à vérifier
 * @returns true si la permission est accordée
 */
export async function can(userId: string, permission: Permission): Promise<boolean> {
  const auth = await AuthorizationModule.create(userId)
  return auth.can(permission)
}

/**
 * Fonction de commodité pour vérifier si un utilisateur est admin
 * 
 * @param userId - L'ID de l'utilisateur
 * @returns true si l'utilisateur est admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const auth = await AuthorizationModule.create(userId)
  return auth.isAdmin()
}

/**
 * Fonction de commodité pour vérifier plusieurs permissions
 * 
 * @param userId - L'ID de l'utilisateur
 * @param permissions - Liste des permissions à vérifier
 * @returns Map des permissions et leur statut
 */
export async function canMultiple(
  userId: string,
  permissions: Permission[]
): Promise<Map<Permission, boolean>> {
  const auth = await AuthorizationModule.create(userId)
  return auth.canMultiple(permissions)
}
