// apps/web/src/types/subscription.ts
//
// Types et enums pour la gestion des abonnements
// Modèle officiel des plans et statuts d'abonnement

// ============================================================
// ENUMS
// ============================================================

/**
 * Plans d'abonnement disponibles
 */
export enum SubscriptionPlan {
  /** Plan gratuit - accès aux fonctionnalités de base */
  FREE = 'FREE',
  /** Plan Pro - fonctionnalités avancées pour les particuliers */
  PRO = 'PRO',
  /** Plan Team - fonctionnalités collaboratives pour les équipes */
  TEAM = 'TEAM',
  /** Plan Enterprise - solution personnalisée pour les grandes entreprises */
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * Statuts d'abonnement
 */
export enum SubscriptionStatus {
  /** Abonnement actif - accès complet */
  ACTIVE = 'ACTIVE',
  /** Période d'essai - accès complet temporaire */
  TRIAL = 'TRIAL',
  /** Abonnement expiré - accès suspendu */
  EXPIRED = 'EXPIRED',
  /** Abonnement annulé - accès jusqu'à la fin de la période */
  CANCELLED = 'CANCELLED',
  /** Paiement en retard - accès restreint */
  PAST_DUE = 'PAST_DUE',
}

// ============================================================
// INTERFACES
// ============================================================

/**
 * Informations d'abonnement d'un utilisateur
 */
export interface Subscription {
  /** Plan d'abonnement actuel */
  plan: SubscriptionPlan;
  /** Statut de l'abonnement */
  status: SubscriptionStatus;
  /** Date de début de l'abonnement */
  startDate: Date;
  /** Date de fin de l'abonnement (null pour les abonnements actifs sans fin) */
  endDate: Date | null;
  /** Identifiant Stripe de l'abonnement */
  stripeSubscriptionId: string | null;
  /** Identifiant Stripe du prix */
  stripePriceId: string | null;
}

/**
 * Capacités d'un utilisateur basées sur son abonnement
 */
export interface SubscriptionCapabilities {
  /** Peut accéder aux fonctionnalités premium */
  hasPremium: boolean;
  /** A un rôle administrateur */
  hasAdmin: boolean;
  /** Peut exporter des documents (PDF, DOCX, Excel) */
  canExport: boolean;
  /** Peut utiliser le copilot IA */
  canUseCopilot: boolean;
  /** Peut lancer des simulations illimitées */
  canRunUnlimitedSimulation: boolean;
  /** Peut accéder à l'historique illimité */
  hasUnlimitedHistory: boolean;
  /** Peut accéder aux rapports avancés */
  hasAdvancedReports: boolean;
  /** Peut accéder à l'API avancée */
  hasAdvancedAPI: boolean;
}

/**
 * Résolution d'accès pour une route ou fonctionnalité
 */
export interface AccessResolution {
  /** Accès autorisé */
  allowed: boolean;
  /** Raison du refus (si refusé) */
  reason?: string;
  /** Niveau d'accès requis */
  requiredLevel: 'PUBLIC' | 'AUTHENTICATED' | 'PREMIUM' | 'ADMIN';
  /** Niveau d'accès actuel */
  currentLevel: 'PUBLIC' | 'AUTHENTICATED' | 'PREMIUM' | 'ADMIN';
}
