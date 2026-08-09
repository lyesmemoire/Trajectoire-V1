// apps/web/src/lib/authorization/SubscriptionService.ts
//
// Service de gestion des abonnements
// Définit les capacités et limites par plan

import { Permission } from '@/types/permissions'
import { SubscriptionPlan } from '@/types/subscription'

// ============================================================
// SERVICE SUBSCRIPTION SERVICE
// ============================================================

/**
 * Service de gestion des abonnements.
 * 
 * Responsabilités :
 * - Définir les capacités par plan
 * - Vérifier les limites d'un plan
 * - Mapper les plans aux permissions
 */
export class SubscriptionService {
  private static planCapabilities: Map<SubscriptionPlan, any> = new Map()

  /**
   * Initialise les capacités par plan
   */
  private static initializeCapabilities(): void {
    // ============================================================
    // FREE PLAN
    // ============================================================
    this.planCapabilities.set(SubscriptionPlan.FREE, {
      name: 'Free',
      monthlyQuota: {
        cvAnalysis: 3,
        jobAnalysis: 5,
        simulations: 2,
      },
      historyRetention: 30, // jours
      features: {
        basicAnalysis: true,
        matching: true,
        copilotBasic: true,
        export: false,
        advancedReports: false,
        unlimitedHistory: false,
        apiAccess: 'basic',
      },
    })

    // ============================================================
    // PRO PLAN
    // ============================================================
    this.planCapabilities.set(SubscriptionPlan.PRO, {
      name: 'Pro',
      monthlyQuota: {
        cvAnalysis: 50,
        jobAnalysis: 100,
        simulations: 20,
      },
      historyRetention: 365, // jours
      features: {
        basicAnalysis: true,
        matching: true,
        copilotBasic: true,
        copilotAdvanced: true,
        export: true,
        advancedReports: true,
        unlimitedHistory: true,
        apiAccess: 'basic',
      },
    })

    // ============================================================
    // TEAM PLAN
    // ============================================================
    this.planCapabilities.set(SubscriptionPlan.TEAM, {
      name: 'Team',
      monthlyQuota: {
        cvAnalysis: 500,
        jobAnalysis: 1000,
        simulations: 200,
      },
      historyRetention: null, // illimité
      features: {
        basicAnalysis: true,
        matching: true,
        copilotBasic: true,
        copilotAdvanced: true,
        export: true,
        advancedReports: true,
        unlimitedHistory: true,
        apiAccess: 'advanced',
        teamCollaboration: true,
      },
    })

    // ============================================================
    // ENTERPRISE PLAN
    // ============================================================
    this.planCapabilities.set(SubscriptionPlan.ENTERPRISE, {
      name: 'Enterprise',
      monthlyQuota: {
        cvAnalysis: null, // illimité
        jobAnalysis: null, // illimité
        simulations: null, // illimité
      },
      historyRetention: null, // illimité
      features: {
        basicAnalysis: true,
        matching: true,
        copilotBasic: true,
        copilotAdvanced: true,
        export: true,
        advancedReports: true,
        unlimitedHistory: true,
        apiAccess: 'advanced',
        teamCollaboration: true,
        customBranding: true,
        dedicatedSupport: true,
        sso: true,
      },
    })
  }

  /**
   * Vérifie si un plan a une capacité spécifique
   * 
   * @param plan - Le plan d'abonnement
   * @param capability - La capacité à vérifier
   * @returns true si le plan a la capacité
   */
  static hasCapability(plan: SubscriptionPlan, capability: string): boolean {
    if (this.planCapabilities.size === 0) {
      this.initializeCapabilities()
    }

    const capabilities = this.planCapabilities.get(plan)
    if (!capabilities) {
      return false
    }

    // Vérifier dans features
    if (capability in capabilities.features) {
      return capabilities.features[capability] === true
    }

    return false
  }

  /**
   * Retourne le quota mensuel pour une ressource
   * 
   * @param plan - Le plan d'abonnement
   * @param resource - La ressource (cvAnalysis, jobAnalysis, simulations)
   * @returns Le quota ou null si illimité
   */
  static getMonthlyQuota(plan: SubscriptionPlan, resource: string): number | null {
    if (this.planCapabilities.size === 0) {
      this.initializeCapabilities()
    }

    const capabilities = this.planCapabilities.get(plan)
    if (!capabilities) {
      return 0
    }

    return capabilities.monthlyQuota[resource] ?? 0
  }

  /**
   * Retourne la rétention d'historique en jours
   * 
   * @param plan - Le plan d'abonnement
   * @returns La rétention en jours ou null si illimitée
   */
  static getHistoryRetention(plan: SubscriptionPlan): number | null {
    if (this.planCapabilities.size === 0) {
      this.initializeCapabilities()
    }

    const capabilities = this.planCapabilities.get(plan)
    if (!capabilities) {
      return 30
    }

    return capabilities.historyRetention
  }

  /**
   * Retourne toutes les capacités d'un plan
   * 
   * @param plan - Le plan d'abonnement
   * @returns Les capacités du plan
   */
  static getPlanCapabilities(plan: SubscriptionPlan): any {
    if (this.planCapabilities.size === 0) {
      this.initializeCapabilities()
    }

    return this.planCapabilities.get(plan)
  }

  /**
   * Mappe un plan d'abonnement vers les permissions associées
   * 
   * @param plan - Le plan d'abonnement
   * @returns Liste des permissions
   */
  static getPlanPermissions(plan: SubscriptionPlan): Permission[] {
    const permissions: Permission[] = []

    switch (plan) {
      case SubscriptionPlan.FREE:
        permissions.push(
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
        )
        break

      case SubscriptionPlan.PRO:
        permissions.push(
          Permission.EXPORT_REPORT_PDF,
          Permission.EXPORT_REPORT_DOCX,
          Permission.EXPORT_DATA_EXCEL,
          Permission.EXPORT_ANY,
          Permission.USE_COPILOT_BASIC,
          Permission.USE_COPILOT_ADVANCED,
          Permission.USE_COPILOT,
          Permission.RUN_INTERVIEW,
          Permission.ACCESS_INTERVIEW_REPORTS,
          Permission.ANALYZE_CV,
          Permission.ANALYZE_JOB,
          Permission.ACCESS_MATCHING,
          Permission.ACCESS_HISTORY_UNLIMITED,
          Permission.ACCESS_REPORTS_BASIC,
          Permission.ACCESS_REPORTS_ADVANCED,
          Permission.ACCESS_REPORTS_HR,
          Permission.ACCESS_API_BASIC,
        )
        break

      case SubscriptionPlan.TEAM:
        permissions.push(
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
          Permission.ACCESS_API_BASIC,
          Permission.ACCESS_API_ADVANCED,
        )
        break

      case SubscriptionPlan.ENTERPRISE:
        permissions.push(
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
          Permission.ACCESS_API_BASIC,
          Permission.ACCESS_API_ADVANCED,
        )
        break
    }

    return permissions
  }

  /**
   * Convertit un string en SubscriptionPlan
   * 
   * @param plan - Le plan en string
   * @returns Le SubscriptionPlan ou FREE par défaut
   */
  static fromString(plan: string): SubscriptionPlan {
    const upperPlan = plan.toUpperCase()
    if (Object.values(SubscriptionPlan).includes(upperPlan as SubscriptionPlan)) {
      return upperPlan as SubscriptionPlan
    }
    return SubscriptionPlan.FREE
  }

  /**
   * Retourne tous les plans disponibles
   * 
   * @returns Liste de tous les plans
   */
  static getAllPlans(): SubscriptionPlan[] {
    return Object.values(SubscriptionPlan)
  }
}
