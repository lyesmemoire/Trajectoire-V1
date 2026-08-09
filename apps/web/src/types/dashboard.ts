// apps/web/src/types/dashboard.ts
//
// Types pour le Dashboard Premium
// MVP-011 — Dashboard WOW

/**
 * Données utilisateur pour le dashboard
 */
export interface DashboardUserData {
  /** Nom de l'utilisateur */
  name: string
  /** Prénom de l'utilisateur */
  firstName: string
  /** Avatar URL */
  avatar?: string
  /** Date de dernière connexion */
  lastLogin?: Date
}

/**
 * Score ATS
 */
export interface DashboardScore {
  /** Score actuel (0-100) */
  currentScore: number
  /** Score précédent */
  previousScore?: number
  /** Progression en pourcentage */
  progressPercentage: number
  /** Évolution (up, down, stable) */
  trend: 'up' | 'down' | 'stable'
}

/**
 * Compétence
 */
export interface DashboardSkill {
  /** Nom de la compétence */
  name: string
  /** Niveau (0-100) */
  level: number
  /** Catégorie */
  category: 'technical' | 'soft' | 'language'
  /** Évolution */
  trend?: 'up' | 'down' | 'stable'
}

/**
 * Progression carrière
 */
export interface DashboardCareer {
  /** Niveau actuel */
  currentLevel: string
  /** Niveau suivant */
  nextLevel: string
  /** Progression vers le niveau suivant (0-100) */
  progressToNext: number
  /** Évolution carrière */
  evolution: {
    /** Score d'employabilité */
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
  /** Priorité */
  priority: 'high' | 'medium' | 'low'
  /** Impact estimé */
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
  /** Icône */
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
  /** Étapes complétées */
  completedSteps: number
  /** Total des étapes */
  totalSteps: number
  /** Pourcentage */
  percentage: number
  /** Étapes */
  steps: {
    /** Nom de l'étape */
    name: string
    /** Complétée */
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
  /** Unité */
  unit?: string
}

/**
 * Événement timeline
 */
export interface DashboardTimelineEvent {
  /** ID unique */
  id: string
  /** Type d'événement */
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
    /** Colonne de début */
    colStart: number
    /** Colonne de fin */
    colEnd: number
    /** Ligne de début */
    rowStart: number
    /** Ligne de fin */
    rowEnd: number
  }
  /** Priorité d'affichage */
  priority: 'high' | 'medium' | 'low'
}

/**
 * Props du dashboard principal
 */
export interface DashboardProps {
  /** Données utilisateur */
  userData: DashboardUserData
  /** Score ATS */
  score: DashboardScore
  /** Compétences */
  skills: DashboardSkill[]
  /** Progression carrière */
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
  /** Widgets à afficher */
  widgets?: DashboardWidget[]
  /** Preview analysis revendiquée (si applicable) */
  claimedPreview?: unknown
}
