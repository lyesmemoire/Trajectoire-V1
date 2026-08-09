// apps/web/src/lib/onboarding/UserStateResolver.ts
//
// Résolution de l'état utilisateur pour l'onboarding adaptatif
// MVP-010 — Adaptive Onboarding

import { prisma } from '@/lib/prisma'
import { UserOnboardingState, JourneyType } from '@/types/onboarding'

export class UserStateResolver {
  /**
   * Résout l'état d'onboarding d'un utilisateur
   */
  static async resolveUserState(userId: string): Promise<UserOnboardingState> {
    // Récupérer l'utilisateur avec ses analyses CV
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        CVAnalysis: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        UserBehaviorProfile: true,
        careerProfile: true,
      },
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    // Vérifier si l'utilisateur a un CV
    const hasCV = (user.CVAnalysis?.length ?? 0) > 0

    // Vérifier si l'utilisateur a une analyse ATS
    const hasATSAnalysis = hasCV && 
      (user.CVAnalysis![0].atsScoreBefore !== null || user.CVAnalysis![0].atsScoreAfter !== null)

    // Vérifier si l'utilisateur a un profil carrière (indique job/matching)
    const hasJob = user.careerProfile !== null

    // Vérifier si l'utilisateur a fait un matching initial (via UserBehaviorProfile)
    const behaviorProfile = user.UserBehaviorProfile
    const hasInitialMatching = behaviorProfile?.onboardingCompleted ?? false

    // Vérifier si l'utilisateur a découvert le Copilot (via sessions d'entretien)
    const hasDiscoveredCopilot = false // À implémenter avec tracking

    // Vérifier si l'utilisateur a fait un entretien IA
    const interviewSessions = await prisma.interviewSession.findMany({
      where: { userId },
      take: 1,
    })
    const hasDoneInterview = interviewSessions.length > 0

    // Déterminer le type de parcours
    const journeyType = this.determineJourneyType({
      hasCV,
      hasATSAnalysis,
      hasJob,
      hasInitialMatching,
    })

    // Récupérer les étapes complétées depuis UserBehaviorProfile metadata
    const metadata = behaviorProfile as any
    const completedSteps = (metadata?.onboardingSteps as string[]) ?? []
    const currentStep = (metadata?.currentOnboardingStep as string) ?? null

    return {
      userId,
      onboardingCompleted: (user as any).onboardingCompleted ?? false,
      hasCV,
      hasATSAnalysis,
      hasJob,
      hasInitialMatching,
      hasDiscoveredCopilot,
      hasDoneInterview,
      completedSteps,
      currentStep,
      journeyType,
      startedAt: behaviorProfile?.createdAt ?? undefined,
      completedAt: (user as any).onboardingCompleted ? new Date() : undefined,
    }
  }

  /**
   * Détermine le type de parcours en fonction de l'état utilisateur
   */
  private static determineJourneyType(state: {
    hasCV: boolean
    hasATSAnalysis: boolean
    hasJob: boolean
    hasInitialMatching: boolean
  }): JourneyType {
    // Si l'utilisateur a déjà une analyse ATS, parcours ATS-first
    if (state.hasATSAnalysis) {
      return 'ats-first'
    }

    // Si l'utilisateur a un CV mais pas d'analyse ATS, parcours complet
    if (state.hasCV) {
      return 'full'
    }

    // Sinon, parcours complet (nouvel utilisateur)
    return 'full'
  }

  /**
   * Met à jour l'état d'onboarding d'un utilisateur
   */
  static async updateUserState(
    userId: string,
    updates: Partial<UserOnboardingState>
  ): Promise<UserOnboardingState> {
    const currentState = await this.resolveUserState(userId)

    const updatedState = {
      ...currentState,
      ...updates,
    }

    // Mettre à jour UserBehaviorProfile pour stocker l'état d'onboarding
    await prisma.userBehaviorProfile.upsert({
      where: { userId },
      create: {
        userId,
        onboardingCompleted: updatedState.onboardingCompleted,
        onboardingSteps: updatedState.completedSteps,
        currentOnboardingStep: updatedState.currentStep,
      } as any,
      update: {
        onboardingCompleted: updatedState.onboardingCompleted,
        onboardingSteps: updatedState.completedSteps,
        currentOnboardingStep: updatedState.currentStep,
      } as any,
    })

    // Mettre à jour User.onboardingCompleted si nécessaire
    if (updatedState.onboardingCompleted !== currentState.onboardingCompleted) {
      await prisma.user.update({
        where: { id: userId },
        data: { onboardingCompleted: updatedState.onboardingCompleted },
      })
    }

    return updatedState
  }

  /**
   * Marque une étape comme complétée
   */
  static async completeStep(
    userId: string,
    stepId: string
  ): Promise<UserOnboardingState> {
    const currentState = await this.resolveUserState(userId)

    if (currentState.completedSteps.includes(stepId)) {
      return currentState
    }

    const updatedCompletedSteps = [...currentState.completedSteps, stepId]

    return this.updateUserState(userId, {
      completedSteps: updatedCompletedSteps,
    })
  }

  /**
   * Définit l'étape courante
   */
  static async setCurrentStep(
    userId: string,
    stepId: string
  ): Promise<UserOnboardingState> {
    return this.updateUserState(userId, {
      currentStep: stepId,
    })
  }

  /**
   * Marque l'onboarding comme terminé
   */
  static async completeOnboarding(
    userId: string
  ): Promise<UserOnboardingState> {
    return this.updateUserState(userId, {
      onboardingCompleted: true,
      completedAt: new Date(),
      currentStep: null,
    })
  }
}
