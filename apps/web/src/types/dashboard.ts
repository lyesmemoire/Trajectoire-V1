// apps/web/src/types/dashboard.ts
//
// Types pour le Dashboard Premium
// MVP-011 â€” Dashboard WOW

/**
 * DonnÃ©es utilisateur pour le dashboard
 */
export interface DashboardUserData {
  /** Nom de l'utilisateur */
  name: string
  /** PrÃ©nom de l'utilisateur */
  firstName: string
  /** Avatar URL */
  avatar?: string
  /** Date de derniÃ¨re connexion */
  lastLogin?: Date
}

/**
 * Score ATS
 */
export interface DashboardScore {
  /** Score actuel (0-100) ; null si aucune analyse notée */
  currentScore: number | null
  /** Score prÃ©cÃ©dent */
  previousScore?: number
}

/**
 * CompÃ©tence
 */
export interface DashboardSkill {
  /** Nom de la compÃ©tence */
  name: string
  /** Niveau (0-100), absent s'il n'est pas dans les données */
  level?: number
  /** CatÃ©gorie, absente si inconnue */
  category?: 'technical' | 'soft' | 'language'
  /** Ã‰volution */
  trend?: 'up' | 'down' | 'stable'
}

/**
 * Recommandation
 */
export interface DashboardRecommendation {
  /** ID unique */
  id: string
  /** Titre */
  title: string
  /** Description */
  description: string
}

/**
 * Ã‰vÃ©nement timeline
 */
export interface DashboardTimelineEvent {
  /** ID unique */
  id: string
  /** Type d'Ã©vÃ©nement */
  type: 'analysis' | 'interview' | 'matching' | 'milestone'
  /** Titre */
  title: string
  /** Description */
  description?: string
  /** Date */
  date: Date
  /** Statut */
  status: 'completed' | 'in-progress' | 'upcoming'
}

/**
 * Props du dashboard principal
 */
export interface DashboardOpportunitySummary {
  activeCount: number
  discoveredCount: number
  highMatchCount: number
  pipeline: {
    discovered: number
    toAnalyze: number
    toApply: number
    applied: number
    interview: number
    offer: number
  }
  bestMatch: {
    id: string
    title: string
    company: string | null
    matchScore: number | null
    status: string
  } | null
  nextAction: {
    id: string
    title: string
    company: string | null
    action: string
    at: Date | null
  } | null
}

export interface DashboardDiscoverySummary {
  liveCount: number
  sourceCount: number
}
export interface DashboardProps {
  /** DonnÃ©es utilisateur */
  userData: DashboardUserData
  /** Score ATS */
  score: DashboardScore
  /** CompÃ©tences */
  skills: DashboardSkill[]
  /** Recommandations */
  recommendations: DashboardRecommendation[]
  /** Timeline */
  timeline: DashboardTimelineEvent[]
  opportunitySummary: DashboardOpportunitySummary
  discoverySummary: DashboardDiscoverySummary
  /** Statistiques réelles agrégées */
  stats?: {
    analysesCount: number
    simulationsCount: number
  }
  /** Preview analysis revendiquée (si applicable) */
  claimedPreview?: unknown
}
