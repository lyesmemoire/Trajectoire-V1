// apps/web/src/lib/onboarding/FlowEngine.ts
//
// Moteur de flow pour l'onboarding adaptatif
// MVP-010 — Adaptive Onboarding

import { OnboardingStep, JourneyType, FlowConfig } from '@/types/onboarding'
import { OnboardingResolver } from './OnboardingResolver'
import { JourneyResolver } from './JourneyResolver'
import { ProgressEngine } from './ProgressEngine'

export class FlowEngine {
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
   * Initialise le flow d'onboarding pour un utilisateur
   */
  static async initializeFlow(
    userId: string,
    config: FlowConfig = this.DEFAULT_CONFIG
  ): Promise<{
    currentStep: OnboardingStep | null
    journey: JourneyType
    canSkip: boolean
    canGoBack: boolean
    showProgress: boolean
    estimatedTotalTime: number
  }> {
    const resolution = await OnboardingResolver.resolveOnboarding(userId)
    const journey = JourneyResolver.resolveJourney(resolution.userState.journeyType)

    // Estimation du temps total
    const estimatedTotalTime = this.estimateTotalTime(journey.steps, config)

    return {
      currentStep: resolution.currentStep,
      journey: resolution.userState.journeyType,
      canSkip: config.allowSkip,
      canGoBack: config.allowBack,
      showProgress: config.showProgress,
      estimatedTotalTime,
    }
  }

  /**
   * Estime le temps total du parcours en minutes
   */
  private static estimateTotalTime(
    steps: OnboardingStep[],
    config: FlowConfig
  ): number {
    let totalMinutes = 0

    for (const step of steps) {
      const stepTime = config.estimatedTimePerStep[step.id] ?? 2
      totalMinutes += stepTime
    }

    return totalMinutes
  }

  /**
   * Exécute une action de flow (next, back, skip, restart)
   */
  static async executeFlowAction(
    userId: string,
    action: 'next' | 'back' | 'skip' | 'restart',
    config: FlowConfig = this.DEFAULT_CONFIG
  ): Promise<{
    currentStep: OnboardingStep | null
    previousStep: OnboardingStep | null
    nextStep: OnboardingStep | null
    isCompleted: boolean
  }> {
    switch (action) {
      case 'next':
        return this.handleNext(userId)
      case 'back':
        return this.handleBack(userId)
      case 'skip':
        return this.handleSkip(userId, config)
      case 'restart':
        return this.handleRestart(userId)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }

  /**
   * Gère l'action "next"
   */
  private static async handleNext(userId: string): Promise<{
    currentStep: OnboardingStep | null
    previousStep: OnboardingStep | null
    nextStep: OnboardingStep | null
    isCompleted: boolean
  }> {
    const result = await OnboardingResolver.advanceToNextStep(userId)
    const resolution = await OnboardingResolver.resolveOnboarding(userId)

    return {
      currentStep: result.currentStep,
      previousStep: result.currentStep
        ? JourneyResolver.getPreviousStep(result.currentStep.id, resolution.userState.journeyType)
        : null,
      nextStep: result.nextStep,
      isCompleted: resolution.isCompleted,
    }
  }

  /**
   * Gère l'action "back"
   */
  private static async handleBack(userId: string): Promise<{
    currentStep: OnboardingStep | null
    previousStep: OnboardingStep | null
    nextStep: OnboardingStep | null
    isCompleted: boolean
  }> {
    const result = await OnboardingResolver.goToPreviousStep(userId)
    const resolution = await OnboardingResolver.resolveOnboarding(userId)

    return {
      currentStep: result.currentStep,
      previousStep: result.previousStep,
      nextStep: result.currentStep
        ? JourneyResolver.getNextStep(result.currentStep.id, resolution.userState.journeyType)
        : null,
      isCompleted: resolution.isCompleted,
    }
  }

  /**
   * Gère l'action "skip"
   */
  private static async handleSkip(
    userId: string,
    config: FlowConfig
  ): Promise<{
    currentStep: OnboardingStep | null
    previousStep: OnboardingStep | null
    nextStep: OnboardingStep | null
    isCompleted: boolean
  }> {
    if (!config.allowSkip) {
      throw new Error('Skip is not allowed in this configuration')
    }

    const result = await OnboardingResolver.skipCurrentStep(userId)
    const resolution = await OnboardingResolver.resolveOnboarding(userId)

    return {
      currentStep: result.currentStep,
      previousStep: result.currentStep
        ? JourneyResolver.getPreviousStep(result.currentStep.id, resolution.userState.journeyType)
        : null,
      nextStep: result.nextStep,
      isCompleted: resolution.isCompleted,
    }
  }

  /**
   * Gère l'action "restart"
   */
  private static async handleRestart(userId: string): Promise<{
    currentStep: OnboardingStep | null
    previousStep: OnboardingStep | null
    nextStep: OnboardingStep | null
    isCompleted: boolean
  }> {
    const result = await OnboardingResolver.restartOnboarding(userId)
    const resolution = await OnboardingResolver.resolveOnboarding(userId)

    return {
      currentStep: result.currentStep,
      previousStep: null,
      nextStep: JourneyResolver.getNextStep(result.currentStep.id, resolution.userState.journeyType),
      isCompleted: false,
    }
  }

  /**
   * Obtient le contexte du flow pour l'étape courante
   */
  static async getFlowContext(
    userId: string,
    config: FlowConfig = this.DEFAULT_CONFIG
  ): Promise<{
    step: OnboardingStep | null
    progress: {
      current: number
      total: number
      percentage: number
    }
    canSkip: boolean
    canGoBack: boolean
    hasNext: boolean
    hasPrevious: boolean
    estimatedTimeRemaining: number
  }> {
    const resolution = await OnboardingResolver.resolveOnboarding(userId)
    const userState = resolution.userState

    if (!resolution.currentStep) {
      return {
        step: null,
        progress: { current: 0, total: 0, percentage: 100 },
        canSkip: false,
        canGoBack: false,
        hasNext: false,
        hasPrevious: false,
        estimatedTimeRemaining: 0,
      }
    }

    const stepProgress = ProgressEngine.getStepProgress(
      resolution.currentStep.id,
      userState.journeyType
    )

    const canSkip = config.allowSkip && JourneyResolver.isStepSkippable(
      resolution.currentStep.id,
      userState.journeyType
    )

    const canGoBack = config.allowBack && stepProgress.stepIndex > 0

    const hasNext = resolution.nextStep !== null
    const hasPrevious = stepProgress.stepIndex > 0

    const progressState = ProgressEngine.calculateProgress(
      userState.completedSteps,
      userState.currentStep,
      userState.journeyType,
      config
    )

    return {
      step: resolution.currentStep,
      progress: {
        current: stepProgress.stepIndex + 1,
        total: stepProgress.totalSteps,
        percentage: stepProgress.stepProgress,
      },
      canSkip,
      canGoBack,
      hasNext,
      hasPrevious,
      estimatedTimeRemaining: progressState.estimatedTimeRemaining ?? 0,
    }
  }

  /**
   * Valide si une action est possible
   */
  static canExecuteAction(
    action: 'next' | 'back' | 'skip' | 'restart',
    userId: string,
    config: FlowConfig = this.DEFAULT_CONFIG
  ): boolean {
    switch (action) {
      case 'next':
        return true // Toujours possible sauf si terminé
      case 'back':
        return config.allowBack
      case 'skip':
        return config.allowSkip
      case 'restart':
        return true // Toujours possible
      default:
        return false
    }
  }
}
