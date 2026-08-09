// apps/web/src/lib/onboarding/OnboardingResolver.ts
//
// Résolveur principal de l'onboarding adaptatif
// MVP-010 — Adaptive Onboarding

import { UserStateResolver } from './UserStateResolver'
import { JourneyResolver } from './JourneyResolver'
import { JourneyResolution, UserOnboardingState, OnboardingStep } from '@/types/onboarding'

export class OnboardingResolver {
  /**
   * Résout l'onboarding complet pour un utilisateur
   */
  static async resolveOnboarding(userId: string): Promise<{
    userState: UserOnboardingState
    journey: JourneyResolution
    currentStep: OnboardingStep | null
    nextStep: OnboardingStep | null
    remainingSteps: OnboardingStep[]
    isCompleted: boolean
  }> {
    // Résoudre l'état utilisateur
    const userState = await UserStateResolver.resolveUserState(userId)

    // Si l'onboarding est déjà complété, retourner l'état
    if (userState.onboardingCompleted) {
      return {
        userState,
        journey: JourneyResolver.resolveJourney(userState.journeyType),
        currentStep: null,
        nextStep: null,
        remainingSteps: [],
        isCompleted: true,
      }
    }

    // Résoudre le parcours
    const journey = JourneyResolver.resolveJourney(userState.journeyType)

    // Déterminer l'étape courante
    const currentStepId = userState.currentStep ?? journey.startingStep
    const currentStep = JourneyResolver.getStepById(currentStepId, userState.journeyType)

    // Déterminer l'étape suivante
    const nextStep = currentStepId
      ? JourneyResolver.getNextStep(currentStepId, userState.journeyType)
      : JourneyResolver.getStepById(journey.startingStep, userState.journeyType)

    // Calculer les étapes restantes
    const remainingSteps = journey.steps.filter(
      step => !userState.completedSteps.includes(step.id)
    )

    return {
      userState,
      journey,
      currentStep,
      nextStep,
      remainingSteps,
      isCompleted: false,
    }
  }

  /**
   * Avance à l'étape suivante
   */
  static async advanceToNextStep(userId: string): Promise<{
    currentStep: OnboardingStep | null
    nextStep: OnboardingStep | null
  }> {
    const userState = await UserStateResolver.resolveUserState(userId)
    const journey = JourneyResolver.resolveJourney(userState.journeyType)

    // Marquer l'étape courante comme complétée
    if (userState.currentStep) {
      await UserStateResolver.completeStep(userId, userState.currentStep)
    }

    // Obtenir l'étape suivante
    const nextStepId = userState.currentStep
      ? JourneyResolver.getNextStep(userState.currentStep, userState.journeyType)?.id ?? null
      : journey.startingStep

    // Définir la nouvelle étape courante
    if (nextStepId) {
      await UserStateResolver.setCurrentStep(userId, nextStepId)
    }

    // Si plus d'étape suivante, marquer l'onboarding comme terminé
    if (!nextStepId) {
      await UserStateResolver.completeOnboarding(userId)
    }

    return {
      currentStep: nextStepId ? JourneyResolver.getStepById(nextStepId, userState.journeyType) : null,
      nextStep: nextStepId ? JourneyResolver.getNextStep(nextStepId, userState.journeyType) : null,
    }
  }

  /**
   * Saute l'étape courante
   */
  static async skipCurrentStep(userId: string): Promise<{
    currentStep: OnboardingStep | null
    nextStep: OnboardingStep | null
  }> {
    const userState = await UserStateResolver.resolveUserState(userId)

    // Vérifier si l'étape peut être sautée
    if (userState.currentStep) {
      const isSkippable = JourneyResolver.isStepSkippable(userState.currentStep, userState.journeyType)
      if (!isSkippable) {
        throw new Error(`Step ${userState.currentStep} cannot be skipped`)
      }
    }

    // Avancer à l'étape suivante
    return this.advanceToNextStep(userId)
  }

  /**
   * Revient à l'étape précédente
   */
  static async goToPreviousStep(userId: string): Promise<{
    currentStep: OnboardingStep | null
    previousStep: OnboardingStep | null
  }> {
    const userState = await UserStateResolver.resolveUserState(userId)

    if (!userState.currentStep) {
      throw new Error('No current step to go back from')
    }

    const previousStep = JourneyResolver.getPreviousStep(userState.currentStep, userState.journeyType)

    if (!previousStep) {
      throw new Error('No previous step available')
    }

    // Définir l'étape précédente comme courante
    await UserStateResolver.setCurrentStep(userId, previousStep.id)

    return {
      currentStep: previousStep,
      previousStep: JourneyResolver.getPreviousStep(previousStep.id, userState.journeyType),
    }
  }

  /**
   * Redémarre l'onboarding
   */
  static async restartOnboarding(userId: string): Promise<{
    currentStep: OnboardingStep
    journey: JourneyResolution
  }> {
    const userState = await UserStateResolver.resolveUserState(userId)
    const journey = JourneyResolver.resolveJourney(userState.journeyType)

    // Réinitialiser l'état
    await UserStateResolver.updateUserState(userId, {
      completedSteps: [],
      currentStep: journey.startingStep,
      onboardingCompleted: false,
    })

    const currentStep = JourneyResolver.getStepById(journey.startingStep, userState.journeyType)

    return {
      currentStep: currentStep!,
      journey,
    }
  }

  /**
   * Obtient le résumé de l'onboarding
   */
  static async getOnboardingSummary(userId: string): Promise<{
    totalSteps: number
    completedSteps: number
    remainingSteps: number
    progressPercentage: number
    journeyType: string
    isCompleted: boolean
  }> {
    const resolution = await this.resolveOnboarding(userId)

    const totalSteps = resolution.journey.steps.length
    const completedSteps = resolution.userState.completedSteps.length
    const remainingSteps = resolution.remainingSteps.length
    const progressPercentage = totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : 0

    return {
      totalSteps,
      completedSteps,
      remainingSteps,
      progressPercentage,
      journeyType: resolution.userState.journeyType,
      isCompleted: resolution.isCompleted,
    }
  }
}
