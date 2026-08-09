// apps/web/src/lib/onboarding/JourneyResolver.ts
//
// Résolution du parcours utilisateur
// MVP-010 — Adaptive Onboarding

import { OnboardingStep, JourneyType, JourneyResolution, OnboardingConfig } from '@/types/onboarding'

export class JourneyResolver {
  /**
   * Configuration par défaut de l'onboarding
   */
  private static readonly DEFAULT_CONFIG: OnboardingConfig = {
    fullJourney: [
      {
        id: 'welcome',
        title: 'Bienvenue',
        description: 'Découvrez Trajectoire',
        order: 1,
        optional: false,
        skippable: false,
      },
      {
        id: 'upload-cv',
        title: 'Upload CV',
        description: 'Importez votre CV',
        order: 2,
        optional: false,
        skippable: false,
      },
      {
        id: 'upload-job',
        title: 'Upload Job',
        description: 'Importez une offre',
        order: 3,
        optional: false,
        skippable: true,
      },
      {
        id: 'matching',
        title: 'Matching',
        description: 'Matching initial',
        order: 4,
        optional: false,
        skippable: true,
      },
      {
        id: 'copilot',
        title: 'Copilot RH',
        description: 'Découvrez le Copilot',
        order: 5,
        optional: false,
        skippable: true,
      },
      {
        id: 'interview',
        title: 'Interview IA',
        description: 'Entretien simulé',
        order: 6,
        optional: false,
        skippable: true,
      },
    ],
    atsFirstJourney: [
      {
        id: 'welcome',
        title: 'Bienvenue',
        description: 'Votre analyse est prête',
        order: 1,
        optional: false,
        skippable: false,
      },
      {
        id: 'ats-analysis',
        title: 'Votre analyse',
        description: 'Consultez votre rapport ATS',
        order: 2,
        optional: false,
        skippable: false,
      },
      {
        id: 'matching',
        title: 'Matching',
        description: 'Lancez un matching',
        order: 3,
        optional: false,
        skippable: true,
      },
      {
        id: 'copilot',
        title: 'Copilot RH',
        description: 'Discutez avec le Copilot',
        order: 4,
        optional: false,
        skippable: true,
      },
      {
        id: 'interview',
        title: 'Interview IA',
        description: 'Préparez vos entretiens',
        order: 5,
        optional: false,
        skippable: true,
      },
    ],
    minimalJourney: [
      {
        id: 'welcome',
        title: 'Bienvenue',
        description: 'Découvrez Trajectoire',
        order: 1,
        optional: false,
        skippable: false,
      },
      {
        id: 'copilot',
        title: 'Copilot RH',
        description: 'Découvrez le Copilot',
        order: 2,
        optional: false,
        skippable: true,
      },
    ],
  }

  /**
   * Résout le parcours en fonction du type de journey
   */
  static resolveJourney(
    journeyType: JourneyType,
    config: OnboardingConfig = this.DEFAULT_CONFIG
  ): JourneyResolution {
    let steps: OnboardingStep[]
    let startingStep: string
    let reason: string

    switch (journeyType) {
      case 'ats-first':
        steps = config.atsFirstJourney
        startingStep = 'welcome'
        reason = 'Utilisateur avec analyse ATS existante - parcours optimisé'
        break
      case 'minimal':
        steps = config.minimalJourney
        startingStep = 'welcome'
        reason = 'Parcours minimal pour utilisateur expérimenté'
        break
      case 'full':
      default:
        steps = config.fullJourney
        startingStep = 'welcome'
        reason = 'Parcours complet pour nouvel utilisateur'
        break
    }

    // Filtrer les étapes en fonction des dépendances
    const filteredSteps = this.filterStepsByDependencies(steps)

    return {
      journeyType,
      steps: filteredSteps,
      startingStep,
      reason,
    }
  }

  /**
   * Filtre les étapes en fonction des dépendances
   */
  private static filterStepsByDependencies(steps: OnboardingStep[]): OnboardingStep[] {
    const stepMap = new Map<string, OnboardingStep>()
    steps.forEach(step => stepMap.set(step.id, step))

    const filteredSteps: OnboardingStep[] = []

    for (const step of steps) {
      // Si l'étape a des dépendances, vérifier si elles sont dans la liste
      if (step.requiredSteps && step.requiredSteps.length > 0) {
        const allRequiredPresent = step.requiredSteps.every(requiredId =>
          stepMap.has(requiredId)
        )
        if (!allRequiredPresent) {
          continue // Skip cette étape si les dépendances ne sont pas présentes
        }
      }
      filteredSteps.push(step)
    }

    return filteredSteps.sort((a, b) => a.order - b.order)
  }

  /**
   * Obtient l'étape suivante
   */
  static getNextStep(
    currentStepId: string,
    journeyType: JourneyType,
    config: OnboardingConfig = this.DEFAULT_CONFIG
  ): OnboardingStep | null {
    const resolution = this.resolveJourney(journeyType, config)
    const currentIndex = resolution.steps.findIndex(step => step.id === currentStepId)

    if (currentIndex === -1 || currentIndex === resolution.steps.length - 1) {
      return null // Pas d'étape suivante
    }

    return resolution.steps[currentIndex + 1]
  }

  /**
   * Obtient l'étape précédente
   */
  static getPreviousStep(
    currentStepId: string,
    journeyType: JourneyType,
    config: OnboardingConfig = this.DEFAULT_CONFIG
  ): OnboardingStep | null {
    const resolution = this.resolveJourney(journeyType, config)
    const currentIndex = resolution.steps.findIndex(step => step.id === currentStepId)

    if (currentIndex <= 0) {
      return null // Pas d'étape précédente
    }

    return resolution.steps[currentIndex - 1]
  }

  /**
   * Obtient une étape par son ID
   */
  static getStepById(
    stepId: string,
    journeyType: JourneyType,
    config: OnboardingConfig = this.DEFAULT_CONFIG
  ): OnboardingStep | null {
    const resolution = this.resolveJourney(journeyType, config)
    return resolution.steps.find(step => step.id === stepId) ?? null
  }

  /**
   * Vérifie si une étape peut être sautée
   */
  static isStepSkippable(
    stepId: string,
    journeyType: JourneyType,
    config: OnboardingConfig = this.DEFAULT_CONFIG
  ): boolean {
    const step = this.getStepById(stepId, journeyType, config)
    return step?.skippable ?? false
  }

  /**
   * Obtient toutes les étapes skippables
   */
  static getSkippableSteps(
    journeyType: JourneyType,
    config: OnboardingConfig = this.DEFAULT_CONFIG
  ): OnboardingStep[] {
    const resolution = this.resolveJourney(journeyType, config)
    return resolution.steps.filter(step => step.skippable)
  }
}
