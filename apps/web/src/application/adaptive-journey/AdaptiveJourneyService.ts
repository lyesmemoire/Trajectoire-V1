/**
 * Adaptive Journey Service
 * Personalized user journey
 */

import {
  JourneyStep,
  AdaptiveJourney,
  JourneyContext,
  AdaptiveJourneyConfig,
  defaultAdaptiveJourneyConfig,
} from "./interfaces/IAdaptiveJourney";
import { userPersonalizationEngine } from "../adaptive-intelligence/UserPersonalizationEngine";
import { strategyEngine } from "../adaptive-intelligence/StrategyEngine";
import { planningEngine } from "../adaptive-intelligence/PlanningEngine";

// ============================================================================
// ADAPTIVE JOURNEY SERVICE CLASS
// ============================================================================

export class AdaptiveJourneyService {
  private static instance: AdaptiveJourneyService;
  private config: AdaptiveJourneyConfig;
  private userJourneys: Map<string, AdaptiveJourney> = new Map();

  private constructor() {
    this.config = defaultAdaptiveJourneyConfig;
  }

  static getInstance(): AdaptiveJourneyService {
    if (!AdaptiveJourneyService.instance) {
      AdaptiveJourneyService.instance = new AdaptiveJourneyService();
    }
    return AdaptiveJourneyService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<AdaptiveJourneyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate adaptive journey
   */
  async generateJourney(context: JourneyContext): Promise<AdaptiveJourney> {
    const steps: JourneyStep[] = [];

    // Generate next simulation step
    steps.push(await this.generateNextSimulationStep(context));

    // Generate exercise steps
    steps.push(...await this.generateExerciseSteps(context));

    // Generate skill development steps
    steps.push(...await this.generateSkillSteps(context));

    // Generate difficulty adjustment steps
    steps.push(await this.generateDifficultyStep(context));

    // Generate personality exploration steps
    steps.push(...await this.generatePersonalitySteps(context));

    // Sort steps by priority
    const sortedSteps = steps.sort((a, b) => b.priority - a.priority);

    // Limit steps
    const limitedSteps = sortedSteps.slice(0, this.config.maxStepsPerJourney);

    // Calculate overall progress
    const overallProgress = this.calculateOverallProgress(limitedSteps, context);

    // Calculate estimated completion
    const estimatedCompletion = this.calculateEstimatedCompletion(limitedSteps);

    // Track which engines were used
    const generatedBy = [
      "AdaptiveJourneyService",
      "UserPersonalizationEngine",
      "StrategyEngine",
      "PlanningEngine",
    ];

    const journey: AdaptiveJourney = {
      id: `journey_${context.userId}_${Date.now()}`,
      userId: context.userId,
      steps: limitedSteps,
      currentStepIndex: 0,
      overallProgress,
      estimatedCompletion,
      generatedBy,
      timestamp: new Date(),
    };

    this.userJourneys.set(context.userId, journey);
    return journey;
  }

  /**
   * Generate next simulation step
   */
  private async generateNextSimulationStep(context: JourneyContext): Promise<JourneyStep> {
    const userMatrix = userPersonalizationEngine.getMatrix(context.userId);
    const personalizedFactors = userMatrix ? userPersonalizationEngine.getPersonalizedFactors(context.userId) : null;

    const difficulty = this.determineDifficulty(context, personalizedFactors);
    const duration = this.determineDuration(context, personalizedFactors);

    return {
      id: `step_simulation_${Date.now()}`,
      userId: context.userId,
      type: "simulation",
      title: "Prochaine simulation",
      description: `Simulation ${difficulty} de ${duration} minutes`,
      parameters: {
        difficulty,
        duration,
        topics: context.preferences.preferredTopics,
      },
      priority: 95,
      estimatedDuration: duration,
      difficulty,
      confidence: 0.85,
      reasoning: `Basé sur votre niveau ${context.currentLevel} et vos préférences`,
      generatedBy: ["AdaptiveJourneyService", "UserPersonalizationEngine"],
      completed: false,
      timestamp: new Date(),
    };
  }

  /**
   * Generate exercise steps
   */
  private async generateExerciseSteps(context: JourneyContext): Promise<JourneyStep[]> {
    const steps: JourneyStep[] = [];

    const exercises = [
      { title: "Exercice de communication skill", duration: 15 },
      { title: "Exercice technique", duration: 20 },
      { title: "Exercice de gestion du stress", duration: 10 },
    ];

    exercises.forEach((exercise, index) => {
      steps.push({
        id: `step_exercise_${Date.now()}_${index}`,
        userId: context.userId,
        type: "exercise",
        title: exercise.title,
        description: `Exercice de ${exercise.duration} minutes`,
        parameters: {
          duration: exercise.duration,
        },
        priority: 70 - index * 10,
        estimatedDuration: exercise.duration,
        difficulty: "medium",
        confidence: 0.7,
        reasoning: "Exercice recommandé pour renforcer vos compétences",
        generatedBy: ["AdaptiveJourneyService"],
        completed: false,
        timestamp: new Date(),
      });
    });

    return steps;
  }

  /**
   * Generate skill steps
   */
  private async generateSkillSteps(context: JourneyContext): Promise<JourneyStep[]> {
    const steps: JourneyStep[] = [];

    context.preferences.preferredTopics.forEach((topic, index) => {
      steps.push({
        id: `step_skill_${Date.now()}_${index}`,
        userId: context.userId,
        type: "skill",
        title: `Développer: ${topic}`,
        description: `Focus sur la compétence ${topic}`,
        parameters: {
          skill: topic,
        },
        priority: 65 - index * 5,
        estimatedDuration: 25,
        difficulty: "adaptive",
        confidence: 0.65,
        reasoning: `Compétence prioritaire selon vos préférences`,
        generatedBy: ["AdaptiveJourneyService"],
        completed: false,
        timestamp: new Date(),
      });
    });

    return steps;
  }

  /**
   * Generate difficulty step
   */
  private async generateDifficultyStep(context: JourneyContext): Promise<JourneyStep> {
    const userMatrix = userPersonalizationEngine.getMatrix(context.userId);
    const personalizedFactors = userMatrix ? userPersonalizationEngine.getPersonalizedFactors(context.userId) : null;

    const currentDifficulty = context.currentLevel;
    const nextDifficulty = this.determineNextDifficulty(context, personalizedFactors);

    return {
      id: `step_difficulty_${Date.now()}`,
      userId: context.userId,
      type: "difficulty",
      title: "Ajustement de difficulté",
      description: `Passer de ${currentDifficulty} à ${nextDifficulty}`,
      parameters: {
        current: currentDifficulty,
        next: nextDifficulty,
      },
      priority: 60,
      estimatedDuration: 30,
      difficulty: this.mapLevelToDifficulty(nextDifficulty),
      confidence: 0.6,
      reasoning: "Ajustement progressif de la difficulté",
      generatedBy: ["AdaptiveJourneyService", "UserPersonalizationEngine"],
      completed: false,
      timestamp: new Date(),
    };
  }

  /**
   * Generate personality steps
   */
  private async generatePersonalitySteps(context: JourneyContext): Promise<JourneyStep[]> {
    const steps: JourneyStep[] = [];

    const personalities = ["friendly", "professional", "challenging", "supportive"];

    personalities.slice(0, 2).forEach((personality, index) => {
      steps.push({
        id: `step_personality_${Date.now()}_${index}`,
        userId: context.userId,
        type: "personality",
        title: `Explorer: ${personality}`,
        description: `Simulation avec recruteur ${personality}`,
        parameters: {
          personality,
        },
        priority: 55 - index * 5,
        estimatedDuration: 30,
        difficulty: "medium",
        confidence: 0.55,
        reasoning: "Explorer différents styles de recruteur",
        generatedBy: ["AdaptiveJourneyService"],
        completed: false,
        timestamp: new Date(),
      });
    });

    return steps;
  }

  /**
   * Determine difficulty
   */
  private determineDifficulty(context: JourneyContext, personalizedFactors: any): "easy" | "medium" | "hard" | "adaptive" {
    if (this.config.adaptiveDifficulty) {
      return "adaptive";
    }

    if (context.currentLevel === "beginner") return "easy";
    if (context.currentLevel === "intermediate") return "medium";
    if (context.currentLevel === "advanced") return "hard";

    return context.preferences.preferredDifficulty;
  }

  /**
   * Determine duration
   */
  private determineDuration(context: JourneyContext, personalizedFactors: any): number {
    if (this.config.considerTimeAvailable) {
      return Math.min(context.preferences.preferredDuration, context.timeAvailable);
    }

    return context.preferences.preferredDuration;
  }

  /**
   * Determine next difficulty
   */
  private determineNextDifficulty(context: JourneyContext, personalizedFactors: any): "beginner" | "intermediate" | "advanced" | "expert" {
    const levels = ["beginner", "intermediate", "advanced", "expert"];
    const currentIndex = levels.indexOf(context.currentLevel);

    if (context.averageScore > 80 && currentIndex < levels.length - 1) {
      return levels[currentIndex + 1] as "beginner" | "intermediate" | "advanced" | "expert";
    }

    if (context.averageScore < 50 && currentIndex > 0) {
      return levels[currentIndex - 1] as "beginner" | "intermediate" | "advanced" | "expert";
    }

    return context.currentLevel;
  }

  /**
   * Map level to difficulty
   */
  private mapLevelToDifficulty(level: "beginner" | "intermediate" | "advanced" | "expert"): "easy" | "medium" | "hard" | "adaptive" {
    const mapping: Record<string, "easy" | "medium" | "hard" | "adaptive"> = {
      beginner: "easy",
      intermediate: "medium",
      advanced: "hard",
      expert: "adaptive",
    };
    return mapping[level];
  }

  /**
   * Calculate overall progress
   */
  private calculateOverallProgress(steps: JourneyStep[], context: JourneyContext): number {
    const completedSteps = steps.filter(s => s.completed).length;
    return steps.length > 0 ? completedSteps / steps.length : 0;
  }

  /**
   * Calculate estimated completion
   */
  private calculateEstimatedCompletion(steps: JourneyStep[]): Date {
    const totalDuration = steps.reduce((sum, step) => sum + step.estimatedDuration, 0);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + Math.ceil(totalDuration / 60)); // Assume 1 hour per day
    return completionDate;
  }

  /**
   * Complete step
   */
  completeStep(userId: string, stepId: string): void {
    const journey = this.userJourneys.get(userId);
    if (!journey) return;

    const step = journey.steps.find(s => s.id === stepId);
    if (step) {
      step.completed = true;
      step.completedAt = new Date();
    }

    // Update current step index
    const nextUncompletedIndex = journey.steps.findIndex(s => !s.completed);
    journey.currentStepIndex = nextUncompletedIndex >= 0 ? nextUncompletedIndex : journey.steps.length;

    // Recalculate overall progress
    journey.overallProgress = this.calculateOverallProgress(journey.steps, { userId, currentLevel: "intermediate", currentSkills: [], completedSimulations: 0, averageScore: 0, streak: 0, timeAvailable: 0, objective: "", preferences: { preferredDifficulty: "medium", preferredDuration: 30, preferredTopics: [], avoidTopics: [] } });

    this.userJourneys.set(userId, journey);
  }

  /**
   * Recalculate journey after action
   */
  async recalculateJourney(userId: string, context: JourneyContext): Promise<AdaptiveJourney> {
    return this.generateJourney(context);
  }

  /**
   * Get user journey
   */
  getUserJourney(userId: string): AdaptiveJourney | null {
    return this.userJourneys.get(userId) || null;
  }

  /**
   * Get current step
   */
  getCurrentStep(userId: string): JourneyStep | null {
    const journey = this.userJourneys.get(userId);
    if (!journey || journey.currentStepIndex >= journey.steps.length) {
      return null;
    }

    return journey.steps[journey.currentStepIndex];
  }

  /**
   * Clear user journey
   */
  clearUserJourney(userId: string): void {
    this.userJourneys.delete(userId);
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalJourneys: number;
    totalSteps: number;
    averageStepsPerJourney: number;
    completionRate: number;
    stepTypeDistribution: Record<string, number>;
  } {
    const totalJourneys = this.userJourneys.size;
    const allJourneys = Array.from(this.userJourneys.values());
    const totalSteps = allJourneys.reduce((sum, journey) => sum + journey.steps.length, 0);
    const averageStepsPerJourney = totalJourneys > 0 ? totalSteps / totalJourneys : 0;

    const allSteps = allJourneys.flatMap(j => j.steps);
    const completedSteps = allSteps.filter(s => s.completed).length;
    const completionRate = totalSteps > 0 ? completedSteps / totalSteps : 0;

    const stepTypeDistribution: Record<string, number> = {};
    allSteps.forEach(step => {
      stepTypeDistribution[step.type] = (stepTypeDistribution[step.type] || 0) + 1;
    });

    return {
      totalJourneys,
      totalSteps,
      averageStepsPerJourney,
      completionRate,
      stepTypeDistribution,
    };
  }
}

export const adaptiveJourneyService = AdaptiveJourneyService.getInstance();
