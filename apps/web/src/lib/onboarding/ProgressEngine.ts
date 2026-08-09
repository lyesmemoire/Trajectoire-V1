// apps/web/src/lib/onboarding/ProgressEngine.ts
//
// Moteur de progression pour l'onboarding adaptatif
// MVP-010 — Adaptive Onboarding

import { OnboardingStep, JourneyType, ProgressState, FlowConfig } from '@/types/onboarding'
import { JourneyResolver } from './JourneyResolver'

export class ProgressEngine {
  /**
   * Configuration par défaut du flow
   */
  private static readonly DEFAULT_CONFIG: FlowConfig = {
    adaptiveEnabled: true,
    allowSkip: true,
    allowBack: true,
    showProgress: true,
    estimatedTimePerStep: {
      welcome: 1,
      'upload-cv': 2,
      'upload-job': 2,
      matching: 3,
      copilot: 2,
      interview: 5,
      'ats-analysis': 2,
    },
  }

  /**
   * Calcule l'état de progression
   */
  static calculateProgress(
    completedSteps: string[],
    currentStep: string | null,
    journeyType: JourneyType,
    config: FlowConfig = this.DEFAULT_CONFIG
  ): ProgressState {
    const journey = JourneyResolver.resolveJourney(journeyType)
    const allSteps = journey.steps

    // Étapes complétées
    const completed = allSteps.filter(step => completedSteps.includes(step.id))

    // Étapes restantes
    const remaining = allSteps.filter(step => !completedSteps.includes(step.id))

    // Étape courante
    const current = currentStep
      ? JourneyResolver.getStepById(currentStep, journeyType)
      : null

    // Pourcentage de progression
    const progressPercentage = allSteps.length > 0
      ? Math.round((completed.length / allSteps.length) * 100)
      : 0

    // Estimation du temps restant
    const estimatedTimeRemaining = this.estimateRemainingTime(remaining, config)

    return {
      currentStep: currentStep ?? '',
      completedSteps: completed.map(s => s.id),
      remainingSteps: remaining.map(s => s.id),
      progressPercentage,
      estimatedTimeRemaining,
    }
  }

  /**
   * Estime le temps restant en minutes
   */
  private static estimateRemainingTime(
    remainingSteps: OnboardingStep[],
    config: FlowConfig
  ): number {
    let totalMinutes = 0

    for (const step of remainingSteps) {
      const stepTime = config.estimatedTimePerStep[step.id] ?? 2 // Default 2 minutes
      totalMinutes += stepTime
    }

    return totalMinutes
  }

  /**
   * Obtient le pourcentage de progression pour une étape spécifique
   */
  static getStepProgress(
    stepId: string,
    journeyType: JourneyType
  ): {
    stepIndex: number
    totalSteps: number
    stepProgress: number
  } {
    const journey = JourneyResolver.resolveJourney(journeyType)
    const stepIndex = journey.steps.findIndex(step => step.id === stepId)

    if (stepIndex === -1) {
      return {
        stepIndex: 0,
        totalSteps: journey.steps.length,
        stepProgress: 0,
      }
    }

    const stepProgress = journey.steps.length > 0
      ? Math.round(((stepIndex + 1) / journey.steps.length) * 100)
      : 0

    return {
      stepIndex,
      totalSteps: journey.steps.length,
      stepProgress,
    }
  }

  /**
   * Vérifie si l'onboarding est complet
   */
  static isOnboardingComplete(
    completedSteps: string[],
    journeyType: JourneyType
  ): boolean {
    const journey = JourneyResolver.resolveJourney(journeyType)
    const requiredSteps = journey.steps.filter(step => !step.optional)

    return requiredSteps.every(step => completedSteps.includes(step.id))
  }

  /**
   * Obtient les étapes bloquantes (étapes requises non complétées)
   */
  static getBlockingSteps(
    completedSteps: string[],
    journeyType: JourneyType
  ): OnboardingStep[] {
    const journey = JourneyResolver.resolveJourney(journeyType)
    return journey.steps.filter(
      step => !step.optional && !completedSteps.includes(step.id)
    )
  }

  /**
   * Obtient les étapes optionnelles restantes
   */
  static getOptionalSteps(
    completedSteps: string[],
    journeyType: JourneyType
  ): OnboardingStep[] {
    const journey = JourneyResolver.resolveJourney(journeyType)
    return journey.steps.filter(
      step => step.optional && !completedSteps.includes(step.id)
    )
  }

  /**
   * Formate le temps restant en texte lisible
   */
  static formatTimeRemaining(minutes: number): string {
    if (minutes < 1) {
      return 'Moins d\'une minute'
    }

    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours} heure${hours > 1 ? 's' : ''}`
    }

    return `${hours} heure${hours > 1 ? 's' : ''} et ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`
  }

  /**
   * Obtient les statistiques de progression
   */
  static getProgressStats(
    completedSteps: string[],
    journeyType: JourneyType,
    config: FlowConfig = this.DEFAULT_CONFIG
  ): {
    totalSteps: number
    completedCount: number
    remainingCount: number
    optionalCount: number
    requiredCount: number
    progressPercentage: number
    estimatedTimeRemaining: number
    formattedTimeRemaining: string
  } {
    const progress = this.calculateProgress(completedSteps, null, journeyType, config)
    const journey = JourneyResolver.resolveJourney(journeyType)

    const optionalCount = journey.steps.filter(s => s.optional).length
    const requiredCount = journey.steps.filter(s => !s.optional).length

    return {
      totalSteps: journey.steps.length,
      completedCount: progress.completedSteps.length,
      remainingCount: progress.remainingSteps.length,
      optionalCount,
      requiredCount,
      progressPercentage: progress.progressPercentage,
      estimatedTimeRemaining: progress.estimatedTimeRemaining ?? 0,
      formattedTimeRemaining: this.formatTimeRemaining(progress.estimatedTimeRemaining ?? 0),
    }
  }
}
