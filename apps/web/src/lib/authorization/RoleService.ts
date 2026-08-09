// apps/web/src/lib/authorization/RoleService.ts
//
// Service de gestion des rôles
// Définit les hiérarchies et permissions des rôles

import { Role, Permission } from '@/types/permissions'

// ============================================================
// SERVICE ROLE SERVICE
// ============================================================

/**
 * Service de gestion des rôles.
 * 
 * Responsabilités :
 * - Définir la hiérarchie des rôles
 * - Vérifier si un rôle a une permission
 * - Mapper les rôles aux permissions
 */
export class RoleService {
  private static roleHierarchy: Map<Role, number> = new Map()
  private static rolePermissions: Map<Role, Permission[]> = new Map()

  /**
   * Initialise la hiérarchie des rôles
   */
  private static initializeHierarchy(): void {
    // Plus le nombre est élevé, plus le rôle est élevé
    this.roleHierarchy.set(Role.USER, 0)
    this.roleHierarchy.set(Role.ADMIN_SUPPORT, 1)
    this.roleHierarchy.set(Role.ADMIN_PRODUCT, 2)
    this.roleHierarchy.set(Role.ADMIN_FOUNDER, 3)
  }

  /**
   * Initialise les permissions par rôle
   */
  private static initializeRolePermissions(): void {
    // ============================================================
    // USER ROLE
    // ============================================================
    this.rolePermissions.set(Role.USER, [
      Permission.USE_COPILOT_BASIC,
      Permission.USE_COPILOT,
      Permission.RUN_INTERVIEW,
      Permission.ACCESS_INTERVIEW_REPORTS,
      Permission.ANALYZE_CV,
      Permission.ANALYZE_JOB,
      Permission.ACCESS_MATCHING,
      Permission.ACCESS_HISTORY_LIMITED,
      Permission.ACCESS_REPORTS_BASIC,
      Permission.ACCESS_API_BASIC,
    ])

    // ============================================================
    // ADMIN_SUPPORT ROLE
    // ============================================================
    this.rolePermissions.set(Role.ADMIN_SUPPORT, [
      Permission.EXPORT_REPORT_PDF,
      Permission.EXPORT_REPORT_DOCX,
      Permission.EXPORT_DATA_EXCEL,
      Permission.EXPORT_ANY,
      Permission.USE_COPILOT_BASIC,
      Permission.USE_COPILOT_ADVANCED,
      Permission.USE_COPILOT,
      Permission.RUN_INTERVIEW,
      Permission.RUN_UNLIMITED_INTERVIEW,
      Permission.ACCESS_INTERVIEW_REPORTS,
      Permission.ANALYZE_CV,
      Permission.ANALYZE_JOB,
      Permission.ACCESS_MATCHING,
      Permission.ACCESS_HISTORY_UNLIMITED,
      Permission.ACCESS_REPORTS_BASIC,
      Permission.ACCESS_REPORTS_ADVANCED,
      Permission.ACCESS_REPORTS_HR,
      Permission.ADMIN_DASHBOARD,
      Permission.ACCESS_API_BASIC,
      Permission.ACCESS_API_ADVANCED,
    ])

    // ============================================================
    // ADMIN_PRODUCT ROLE
    // ============================================================
    this.rolePermissions.set(Role.ADMIN_PRODUCT, [
      Permission.EXPORT_REPORT_PDF,
      Permission.EXPORT_REPORT_DOCX,
      Permission.EXPORT_DATA_EXCEL,
      Permission.EXPORT_ANY,
      Permission.USE_COPILOT_BASIC,
      Permission.USE_COPILOT_ADVANCED,
      Permission.USE_COPILOT,
      Permission.RUN_INTERVIEW,
      Permission.RUN_UNLIMITED_INTERVIEW,
      Permission.ACCESS_INTERVIEW_REPORTS,
      Permission.ANALYZE_CV,
      Permission.ANALYZE_JOB,
      Permission.ACCESS_MATCHING,
      Permission.ACCESS_HISTORY_UNLIMITED,
      Permission.ACCESS_REPORTS_BASIC,
      Permission.ACCESS_REPORTS_ADVANCED,
      Permission.ACCESS_REPORTS_HR,
      Permission.ADMIN_DASHBOARD,
      Permission.MANAGE_USERS,
      Permission.MANAGE_SUBSCRIPTIONS,
      Permission.ACCESS_LOGS,
      Permission.ACCESS_MONITORING,
      Permission.ACCESS_API_BASIC,
      Permission.ACCESS_API_ADVANCED,
    ])

    // ============================================================
    // ADMIN_FOUNDER ROLE
    // ============================================================
    this.rolePermissions.set(Role.ADMIN_FOUNDER, [
      // Toutes les permissions
      ...Array.from({ length: 100 }, (_, i) => i as any).filter(() => false), // Placeholder
    ])
  }

  /**
   * Vérifie si un rôle est supérieur ou égal à un autre
   * 
   * @param role - Le rôle à vérifier
   * @param requiredRole - Le rôle requis
   * @returns true si le rôle est supérieur ou égal
   */
  static hasRoleOrHigher(role: Role, requiredRole: Role): boolean {
    if (this.roleHierarchy.size === 0) {
      this.initializeHierarchy()
    }

    const roleLevel = this.roleHierarchy.get(role) ?? -1
    const requiredLevel = this.roleHierarchy.get(requiredRole) ?? -1

    return roleLevel >= requiredLevel
  }

  /**
   * Vérifie si un rôle a une permission spécifique
   * 
   * @param role - Le rôle
   * @param permission - La permission
   * @returns true si le rôle a la permission
   */
  static hasPermission(role: Role, permission: Permission): boolean {
    if (this.rolePermissions.size === 0) {
      this.initializeRolePermissions()
    }

    const permissions = this.rolePermissions.get(role) || []
    
    // ADMIN_FOUNDER a toutes les permissions
    if (role === Role.ADMIN_FOUNDER) {
      return true
    }

    return permissions.includes(permission)
  }

  /**
   * Retourne toutes les permissions d'un rôle
   * 
   * @param role - Le rôle
   * @returns Liste des permissions
   */
  static getRolePermissions(role: Role): Permission[] {
    if (this.rolePermissions.size === 0) {
      this.initializeRolePermissions()
    }

    // ADMIN_FOUNDER a toutes les permissions
    if (role === Role.ADMIN_FOUNDER) {
      return Object.values(Permission)
    }

    return this.rolePermissions.get(role) || []
  }

  /**
   * Vérifie si un rôle est un rôle admin
   * 
   * @param role - Le rôle
   * @returns true si c'est un rôle admin
   */
  static isAdmin(role: Role | null): boolean {
    if (!role) {
      return false
    }
    return role === Role.ADMIN_FOUNDER || 
           role === Role.ADMIN_PRODUCT || 
           role === Role.ADMIN_SUPPORT
  }

  /**
   * Retourne le niveau hiérarchique d'un rôle
   * 
   * @param role - Le rôle
   * @returns Le niveau hiérarchique
   */
  static getRoleLevel(role: Role): number {
    if (this.roleHierarchy.size === 0) {
      this.initializeHierarchy()
    }
    return this.roleHierarchy.get(role) ?? 0
  }

  /**
   * Retourne tous les rôles
   * 
   * @returns Liste de tous les rôles
   */
  static getAllRoles(): Role[] {
    return Object.values(Role)
  }
}
