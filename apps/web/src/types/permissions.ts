// apps/web/src/types/permissions.ts
//
// Types et enums pour le système d'autorisation
// Modèle déclaratif des permissions

// ============================================================
// ENUMS DE PERMISSIONS
// ============================================================

/**
 * Permissions disponibles dans le système
 * Chaque permission représente une action ou une ressource spécifique
 */
export enum Permission {
  // ============================================================
  // EXPORT
  // ============================================================
  /** Exporter un rapport en PDF */
  EXPORT_REPORT_PDF = 'export-report-pdf',
  /** Exporter un rapport en DOCX */
  EXPORT_REPORT_DOCX = 'export-report-docx',
  /** Exporter des données en Excel */
  EXPORT_DATA_EXCEL = 'export-data-excel',
  /** Exporter n'importe quel format */
  EXPORT_ANY = 'export-any',

  // ============================================================
  // COPILOT
  // ============================================================
  /** Utiliser le copilot IA de base */
  USE_COPILOT_BASIC = 'use-copilot-basic',
  /** Utiliser le copilot IA avancé */
  USE_COPILOT_ADVANCED = 'use-copilot-advanced',
  /** Utiliser le copilot IA (toutes versions) */
  USE_COPILOT = 'use-copilot',

  // ============================================================
  // SIMULATION / INTERVIEW
  // ============================================================
  /** Lancer une simulation d'entretien */
  RUN_INTERVIEW = 'run-interview',
  /** Lancer des simulations illimitées */
  RUN_UNLIMITED_INTERVIEW = 'run-unlimited-interview',
  /** Accéder aux rapports de simulation */
  ACCESS_INTERVIEW_REPORTS = 'access-interview-reports',

  // ============================================================
  // ANALYSE
  // ============================================================
  /** Analyser un CV */
  ANALYZE_CV = 'analyze-cv',
  /** Analyser une offre d'emploi */
  ANALYZE_JOB = 'analyze-job',
  /** Accéder au matching CV/Job */
  ACCESS_MATCHING = 'access-matching',

  // ============================================================
  // HISTORIQUE
  // ============================================================
  /** Accéder à l'historique limité */
  ACCESS_HISTORY_LIMITED = 'access-history-limited',
  /** Accéder à l'historique illimité */
  ACCESS_HISTORY_UNLIMITED = 'access-history-unlimited',

  // ============================================================
  // RAPPORTS
  // ============================================================
  /** Accéder aux rapports de base */
  ACCESS_REPORTS_BASIC = 'access-reports-basic',
  /** Accéder aux rapports avancés */
  ACCESS_REPORTS_ADVANCED = 'access-reports-advanced',
  /** Accéder aux rapports RH */
  ACCESS_REPORTS_HR = 'access-reports-hr',

  // ============================================================
  // ADMIN
  // ============================================================
  /** Accéder au dashboard admin */
  ADMIN_DASHBOARD = 'admin-dashboard',
  /** Gérer les utilisateurs */
  MANAGE_USERS = 'manage-users',
  /** Gérer les abonnements */
  MANAGE_SUBSCRIPTIONS = 'manage-subscriptions',
  /** Accéder aux logs */
  ACCESS_LOGS = 'access-logs',
  /** Accéder au monitoring */
  ACCESS_MONITORING = 'access-monitoring',
  /** Modifier la configuration */
  MODIFY_CONFIG = 'modify-config',

  // ============================================================
  // API
  // ============================================================
  /** Accéder à l'API de base */
  ACCESS_API_BASIC = 'access-api-basic',
  /** Accéder à l'API avancée */
  ACCESS_API_ADVANCED = 'access-api-advanced',
}

/**
 * Rôles disponibles dans le système
 */
export enum Role {
  /** Utilisateur standard sans rôle spécial */
  USER = 'USER',
  /** Fondateur de l'entreprise */
  ADMIN_FOUNDER = 'ADMIN_FOUNDER',
  /** Administrateur produit */
  ADMIN_PRODUCT = 'ADMIN_PRODUCT',
  /** Administrateur support */
  ADMIN_SUPPORT = 'ADMIN_SUPPORT',
}

/**
 * Ressources protégées
 */
export enum Resource {
  /** Rapports */
  REPORT = 'report',
  /** Données utilisateur */
  USER_DATA = 'user-data',
  /** Configuration système */
  SYSTEM_CONFIG = 'system-config',
  /** Logs */
  LOGS = 'logs',
}

/**
 * Actions possibles sur les ressources
 */
export enum Action {
  /** Lire */
  READ = 'read',
  /** Créer */
  CREATE = 'create',
  /** Mettre à jour */
  UPDATE = 'update',
  /** Supprimer */
  DELETE = 'delete',
  /** Exporter */
  EXPORT = 'export',
}

// ============================================================
// INTERFACES
// ============================================================

/**
 * Règle de permission
 */
export interface PermissionRule {
  /** Permission requise */
  permission: Permission
  /** Plans autorisés */
  allowedPlans: string[]
  /** Rôles autorisés */
  allowedRoles: string[]
  /** Description de la permission */
  description: string
}

/**
 * Politique d'accès pour une ressource
 */
export interface AccessPolicy {
  /** Ressource concernée */
  resource: Resource
  /** Actions autorisées par rôle */
  rolePermissions: Record<Role, Action[]>
  /** Permissions requises par action */
  actionPermissions: Record<Action, Permission[]>
}

/**
 * Résolution d'autorisation
 */
export interface AuthorizationResult {
  /** Autorisation accordée */
  allowed: boolean
  /** Raison du refus (si refusé) */
  reason?: string
  /** Permission requise */
  requiredPermission?: Permission
  /** Rôle requis */
  requiredRole?: Role
}
