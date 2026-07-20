/**
 * User Personalization Engine
 * Creates personalized matrix for each user
 */

import {
  UserPersonalityMatrix,
  ToleranceProfile,
  MotivationProfile,
  ExperienceProfile,
  ObjectivesProfile,
  HistoryProfile,
  PersonalityProfile,
  PreferencesProfile,
  AdaptationProfile,
  AdaptationRecord,
  PersonalizationConfig,
  defaultPersonalizationConfig,
} from "./interfaces/IUserPersonalizationEngine";

// ============================================================================
// USER PERSONALIZATION ENGINE CLASS
// ============================================================================

export class UserPersonalizationEngine {
  private static instance: UserPersonalizationEngine;
  private config: PersonalizationConfig;
  private matrices: Map<string, UserPersonalityMatrix> = new Map();

  private constructor() {
    this.config = defaultPersonalizationConfig;
  }

  static getInstance(): UserPersonalizationEngine {
    if (!UserPersonalizationEngine.instance) {
      UserPersonalizationEngine.instance = new UserPersonalizationEngine();
    }
    return UserPersonalizationEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<PersonalizationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Create or update user personality matrix
   */
  createOrUpdateMatrix(
    userId: string,
    userData: {
      tolerance?: Partial<ToleranceProfile>;
      motivation?: Partial<MotivationProfile>;
      experience?: Partial<ExperienceProfile>;
      objectives?: Partial<ObjectivesProfile>;
      history?: Partial<HistoryProfile>;
      personality?: Partial<PersonalityProfile>;
      preferences?: Partial<PreferencesProfile>;
    }
  ): UserPersonalityMatrix {
    const existingMatrix = this.matrices.get(userId);
    
    const matrix: UserPersonalityMatrix = {
      userId,
      tolerance: this.updateProfile(existingMatrix?.tolerance, userData.tolerance, this.getDefaultTolerance()),
      motivation: this.updateProfile(existingMatrix?.motivation, userData.motivation, this.getDefaultMotivation()),
      experience: this.updateProfile(existingMatrix?.experience, userData.experience, this.getDefaultExperience()),
      objectives: this.updateProfile(existingMatrix?.objectives, userData.objectives, this.getDefaultObjectives()),
      history: this.updateProfile(existingMatrix?.history, userData.history, this.getDefaultHistory()),
      personality: this.updateProfile(existingMatrix?.personality, userData.personality, this.getDefaultPersonality()),
      preferences: this.updateProfile(existingMatrix?.preferences, userData.preferences, this.getDefaultPreferences()),
      adaptation: existingMatrix?.adaptation || this.getDefaultAdaptation(),
      timestamp: new Date(),
    };

    this.matrices.set(userId, matrix);
    return matrix;
  }

  /**
   * Update profile with new data
   */
  private updateProfile<T>(
    existing: T | undefined,
    newData: Partial<T> | undefined,
    defaultData: T
  ): T {
    if (!existing) {
      return { ...defaultData, ...newData };
    }

    if (!newData) {
      return existing;
    }

    // Apply learning rate to blend existing and new data
    return this.blendProfiles(existing, newData, this.config.learningRate);
  }

  /**
   * Blend existing and new profiles
   */
  private blendProfiles<T>(existing: T, newData: Partial<T>, learningRate: number): T {
    const blended = { ...existing };

    Object.keys(newData).forEach(key => {
      const existingValue = (existing as any)[key];
      const newValue = (newData as any)[key];

      if (typeof existingValue === 'number' && typeof newValue === 'number') {
        (blended as any)[key] = existingValue * (1 - learningRate) + newValue * learningRate;
      } else {
        (blended as any)[key] = newValue;
      }
    });

    return blended;
  }

  /**
   * Get user matrix
   */
  getMatrix(userId: string): UserPersonalityMatrix | null {
    return this.matrices.get(userId) || null;
  }

  /**
   * Record adaptation
   */
  recordAdaptation(
    userId: string,
    adaptationType: string,
    success: boolean,
    impact: number
  ): void {
    const matrix = this.matrices.get(userId);
    if (!matrix) {
      return;
    }

    const record: AdaptationRecord = {
      timestamp: new Date(),
      adaptationType,
      success,
      impact,
    };

    matrix.adaptation.adaptationHistory.push(record);

    // Update adaptation metrics
    this.updateAdaptationMetrics(matrix);

    this.matrices.set(userId, matrix);
  }

  /**
   * Update adaptation metrics
   */
  private updateAdaptationMetrics(matrix: UserPersonalityMatrix): void {
    const history = matrix.adaptation.adaptationHistory;
    const recentHistory = history.slice(-20); // Last 20 adaptations

    if (recentHistory.length === 0) {
      return;
    }

    // Calculate adaptation speed (average time between adaptations)
    const successfulAdaptations = recentHistory.filter(r => r.success);
    matrix.adaptation.adaptationSpeed = successfulAdaptations.length / recentHistory.length;

    // Calculate adaptation accuracy
    matrix.adaptation.adaptationAccuracy = successfulAdaptations.length / recentHistory.length;
  }

  /**
   * Get personalized decision factors
   */
  getPersonalizedFactors(userId: string): {
    stressWeight: number;
    confidenceWeight: number;
    difficultyWeight: number;
    feedbackWeight: number;
    challengeWeight: number;
  } {
    const matrix = this.matrices.get(userId);
    if (!matrix) {
      return this.getDefaultFactors();
    }

    return {
      stressWeight: this.calculateStressWeight(matrix),
      confidenceWeight: this.calculateConfidenceWeight(matrix),
      difficultyWeight: this.calculateDifficultyWeight(matrix),
      feedbackWeight: this.calculateFeedbackWeight(matrix),
      challengeWeight: this.calculateChallengeWeight(matrix),
    };
  }

  /**
   * Calculate stress weight based on tolerance
   */
  private calculateStressWeight(matrix: UserPersonalityMatrix): number {
    // Lower stress tolerance = higher stress weight
    return 1 - matrix.tolerance.stressTolerance;
  }

  /**
   * Calculate confidence weight based on motivation
   */
  private calculateConfidenceWeight(matrix: UserPersonalityMatrix): number {
    // Higher achievement motivation = higher confidence weight
    return matrix.motivation.achievementMotivation;
  }

  /**
   * Calculate difficulty weight based on experience
   */
  private calculateDifficultyWeight(matrix: UserPersonalityMatrix): number {
    // Higher skill level = higher difficulty tolerance
    return matrix.experience.skillLevel;
  }

  /**
   * Calculate feedback weight based on tolerance
   */
  private calculateFeedbackWeight(matrix: UserPersonalityMatrix): number {
    // Higher feedback tolerance = higher feedback weight
    return matrix.tolerance.feedbackTolerance;
  }

  /**
   * Calculate challenge weight based on preferences
   */
  private calculateChallengeWeight(matrix: UserPersonalityMatrix): number {
    const challengeLevels = { easy: 0.3, medium: 0.5, hard: 0.8, adaptive: 0.6 };
    return challengeLevels[matrix.preferences.challengeLevel];
  }

  /**
   * Get default factors
   */
  private getDefaultFactors(): {
    stressWeight: number;
    confidenceWeight: number;
    difficultyWeight: number;
    feedbackWeight: number;
    challengeWeight: number;
  } {
    return {
      stressWeight: 0.5,
      confidenceWeight: 0.5,
      difficultyWeight: 0.5,
      feedbackWeight: 0.5,
      challengeWeight: 0.5,
    };
  }

  /**
   * Get default tolerance profile
   */
  private getDefaultTolerance(): ToleranceProfile {
    return {
      stressTolerance: 0.5,
      difficultyTolerance: 0.5,
      feedbackTolerance: 0.5,
      changeTolerance: 0.5,
      failureTolerance: 0.5,
    };
  }

  /**
   * Get default motivation profile
   */
  private getDefaultMotivation(): MotivationProfile {
    return {
      intrinsicMotivation: 0.5,
      extrinsicMotivation: 0.5,
      achievementMotivation: 0.5,
      socialMotivation: 0.5,
      growthMotivation: 0.5,
    };
  }

  /**
   * Get default experience profile
   */
  private getDefaultExperience(): ExperienceProfile {
    return {
      totalSessions: 0,
      totalHours: 0,
      skillLevel: 0.3,
      expertiseAreas: [],
      learningRate: 0.5,
      retentionRate: 0.5,
    };
  }

  /**
   * Get default objectives profile
   */
  private getDefaultObjectives(): ObjectivesProfile {
    return {
      primaryObjective: "general_improvement",
      secondaryObjectives: [],
      objectivePriority: 0.5,
      timeHorizon: "medium",
      flexibility: 0.5,
    };
  }

  /**
   * Get default history profile
   */
  private getDefaultHistory(): HistoryProfile {
    return {
      recentPerformance: 0.5,
      performanceTrend: "stable",
      engagementLevel: 0.5,
      consistency: 0.5,
      preferredActivities: [],
      avoidedActivities: [],
    };
  }

  /**
   * Get default personality profile
   */
  private getDefaultPersonality(): PersonalityProfile {
    return {
      openness: 0.5,
      conscientiousness: 0.5,
      extraversion: 0.5,
      agreeableness: 0.5,
      neuroticism: 0.5,
    };
  }

  /**
   * Get default preferences profile
   */
  private getDefaultPreferences(): PreferencesProfile {
    return {
      learningStyle: "mixed",
      feedbackStyle: "direct",
      challengeLevel: "medium",
      sessionLength: 45,
      timeOfDay: "flexible",
    };
  }

  /**
   * Get default adaptation profile
   */
  private getDefaultAdaptation(): AdaptationProfile {
    return {
      adaptationSpeed: 0.5,
      adaptationAccuracy: 0.5,
      adaptationHistory: [],
    };
  }

  /**
   * Compare two users for similarity
   */
  compareUsers(userId1: string, userId2: string): number {
    const matrix1 = this.matrices.get(userId1);
    const matrix2 = this.matrices.get(userId2);

    if (!matrix1 || !matrix2) {
      return 0;
    }

    // Compare personality profiles
    const personalitySimilarity = this.compareProfiles(
      matrix1.personality,
      matrix2.personality
    );

    // Compare preferences
    const preferencesSimilarity = this.compareProfiles(
      matrix1.preferences,
      matrix2.preferences
    );

    // Compare objectives
    const objectivesSimilarity = this.compareProfiles(
      matrix1.objectives,
      matrix2.objectives
    );

    return (personalitySimilarity + preferencesSimilarity + objectivesSimilarity) / 3;
  }

  /**
   * Compare two profiles
   */
  private compareProfiles(profile1: any, profile2: any): number {
    const keys = Object.keys(profile1);
    let similarity = 0;

    keys.forEach(key => {
      const value1 = profile1[key];
      const value2 = profile2[key];

      if (typeof value1 === 'number' && typeof value2 === 'number') {
        similarity += 1 - Math.abs(value1 - value2);
      } else if (value1 === value2) {
        similarity += 1;
      }
    });

    return similarity / keys.length;
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalUsers: number;
    averageTolerance: number;
    averageMotivation: number;
    averageExperience: number;
    averageAdaptationSpeed: number;
    averageAdaptationAccuracy: number;
  } {
    const matrices = Array.from(this.matrices.values());
    const totalUsers = matrices.length;

    const averageTolerance = totalUsers > 0
      ? matrices.reduce((sum, m) => sum + this.averageProfile(m.tolerance), 0) / totalUsers
      : 0;

    const averageMotivation = totalUsers > 0
      ? matrices.reduce((sum, m) => sum + this.averageProfile(m.motivation), 0) / totalUsers
      : 0;

    const averageExperience = totalUsers > 0
      ? matrices.reduce((sum, m) => sum + this.averageProfile(m.experience), 0) / totalUsers
      : 0;

    const averageAdaptationSpeed = totalUsers > 0
      ? matrices.reduce((sum, m) => sum + m.adaptation.adaptationSpeed, 0) / totalUsers
      : 0;

    const averageAdaptationAccuracy = totalUsers > 0
      ? matrices.reduce((sum, m) => sum + m.adaptation.adaptationAccuracy, 0) / totalUsers
      : 0;

    return {
      totalUsers,
      averageTolerance,
      averageMotivation,
      averageExperience,
      averageAdaptationSpeed,
      averageAdaptationAccuracy,
    };
  }

  /**
   * Average profile values
   */
  private averageProfile(profile: any): number {
    const values = Object.values(profile).filter(v => typeof v === 'number');
    return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  }

  /**
   * Export data
   */
  exportData(): {
    matrices: UserPersonalityMatrix[];
    config: PersonalizationConfig;
  } {
    return {
      matrices: Array.from(this.matrices.values()),
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    matrices: UserPersonalityMatrix[];
    config?: PersonalizationConfig;
  }): void {
    data.matrices.forEach(matrix => {
      this.matrices.set(matrix.userId, matrix);
    });
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Clear all matrices
   */
  clearAll(): void {
    this.matrices.clear();
  }

  /**
   * Delete user matrix
   */
  deleteMatrix(userId: string): void {
    this.matrices.delete(userId);
  }
}

export const userPersonalizationEngine = UserPersonalizationEngine.getInstance();
