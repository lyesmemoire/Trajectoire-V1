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
  /** Score actuel (0-100) */
  currentScore: number
  /** Score prÃ©cÃ©dent */
  previousScore?: number
  /** Progression en pourcentage */
  progressPercentage: number
  /** Ã‰volution (up, down, stable) */
  trend: 'up' | 'down' | 'stable'
}

/**
 * CompÃ©tence
 */
export interface DashboardSkill {
  /** Nom de la compÃ©tence */
  name: string
  /** Niveau (0-100) */
  level: number
  /** CatÃ©gorie */
  category: 'technical' | 'soft' | 'language'
  /** Ã‰volution */
  trend?: 'up' | 'down' | 'stable'
}

/**
 * Progression carriÃ¨re
 */
export interface DashboardCareer {
  /** Niveau actuel */
  currentLevel: string
  /** Niveau suivant */
  nextLevel: string
  /** Progression vers le niveau suivant (0-100) */
  progressToNext: number
  /** Ã‰volution carriÃ¨re */
  evolution: {
    /** Score d'employabilitÃ© */
    employabilityScore: number
    /** Tendance */
    trend: 'up' | 'down' | 'stable'
  }
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
  /** Type d'action */
  actionType: 'improve' | 'add' | 'remove' | 'highlight'
  /** PrioritÃ© */
  priority: 'high' | 'medium' | 'low'
  /** Impact estimÃ© */
  estimatedImpact: number
}

/**
 * Historique d'analyse
 */
export interface DashboardHistoryItem {
  /** ID unique */
  id: string
  /** Nom du fichier */
  fileName: string
  /** Date de l'analyse */
  date: Date
  /** Score ATS */
  score: number
  /** Poste cible */
  targetJob?: string
}

/**
 * Action rapide
 */
export interface DashboardAction {
  /** ID unique */
  id: string
  /** Titre */
  title: string
  /** Description */
  description: string
  /** IcÃ´ne */
  icon: string
  /** URL de destination */
  href: string
  /** Couleur */
  color: 'bronze' | 'forest' | 'brick' | 'ink' | 'sky'
}

/**
 * Progression globale
 */
export interface DashboardProgress {
  /** Ã‰tapes complÃ©tÃ©es */
  completedSteps: number
  /** Total des Ã©tapes */
  totalSteps: number
  /** Pourcentage */
  percentage: number
  /** Ã‰tapes */
  steps: {
    /** Nom de l'Ã©tape */
    name: string
    /** ComplÃ©tÃ©e */
    completed: boolean
  }[]
}

/**
 * Insight / Analytics
 */
export interface DashboardInsight {
  /** Type d'insight */
  type: 'strength' | 'weakness' | 'opportunity' | 'achievement'
  /** Titre */
  title: string
  /** Description */
  description: string
  /** Valeur */
  value?: number
  /** UnitÃ© */
  unit?: string
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
  description: string
  /** Date */
  date: Date
  /** Statut */
  status: 'completed' | 'in-progress' | 'upcoming'
}

/**
 * Widget configuration
 */
export interface DashboardWidget {
  /** Type de widget */
  type: 'score' | 'skills' | 'career' | 'recommendations' | 'history' | 'actions' | 'progress' | 'insights' | 'timeline'
  /** Titre */
  title: string
  /** Position (grid) */
  position: {
    /** Colonne de dÃ©but */
    colStart: number
    /** Colonne de fin */
    colEnd: number
    /** Ligne de dÃ©but */
    rowStart: number
    /** Ligne de fin */
    rowEnd: number
  }
  /** PrioritÃ© d'affichage */
  priority: 'high' | 'medium' | 'low'
}

/**
 * Props du dashboard principal
 */
export interface DashboardOpportunitySummary {
  activeCount: number
  discoveredCount: number
  highMatchCount: number
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
  /** Progression carriÃ¨re */
  career: DashboardCareer
  /** Recommandations */
  recommendations: DashboardRecommendation[]
  /** Historique */
  history: DashboardHistoryItem[]
  /** Actions rapides */
  actions: DashboardAction[]
  /** Progression */
  progress: DashboardProgress
  /** Insights */
  insights: DashboardInsight[]
  /** Timeline */
  timeline: DashboardTimelineEvent[]
  opportunitySummary: DashboardOpportunitySummary
  discoverySummary: DashboardDiscoverySummary
  /** Widgets Ã  afficher */
  widgets?: DashboardWidget[]
  /** Preview analysis revendiquÃ©e (si applicable) */
  claimedPreview?: unknown
}
