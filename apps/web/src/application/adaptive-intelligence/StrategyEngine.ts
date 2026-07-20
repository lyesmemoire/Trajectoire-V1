/**
 * Strategy Engine
 * Long-term strategy planning across multiple weeks
 */

import {
  StrategyObjective,
  StrategyPhase,
  StrategyActivity,
  StrategyPlan,
  StrategyRecommendation,
  StrategyConfig,
  defaultStrategyConfig,
} from "./interfaces/IStrategyEngine";

// ============================================================================
// STRATEGY ENGINE CLASS
// ============================================================================

export class StrategyEngine {
  private static instance: StrategyEngine;
  private config: StrategyConfig;
  private strategyPlans: Map<string, StrategyPlan> = new Map();
  private recommendations: Map<string, StrategyRecommendation> = new Map();

  private constructor() {
    this.config = defaultStrategyConfig;
  }

  static getInstance(): StrategyEngine {
    if (!StrategyEngine.instance) {
      StrategyEngine.instance = new StrategyEngine();
    }
    return StrategyEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<StrategyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Create strategy plan
   */
  createStrategyPlan(
    userId: string,
    objectives: StrategyObjective[],
    startDate: Date,
    endDate: Date
  ): StrategyPlan {
    const phases = this.generatePhases(objectives, startDate, endDate);
    const plan: StrategyPlan = {
      id: `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      name: `Strategy for ${userId}`,
      description: "Long-term learning and development strategy",
      startDate,
      endDate,
      phases,
      objectives,
      progress: 0,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.strategyPlans.set(plan.id, plan);
    return plan;
  }

  /**
   * Generate phases for strategy
   */
  private generatePhases(
    objectives: StrategyObjective[],
    startDate: Date,
    endDate: Date
  ): StrategyPhase[] {
    const phases: StrategyPhase[] = [];
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const phaseDuration = Math.min(totalDays, this.config.defaultPhaseDuration);
    const numPhases = Math.min(Math.ceil(totalDays / phaseDuration), this.config.maxPhases);

    // Group objectives by category
    const categories = Array.from(new Set(objectives.map(o => o.category)));
    
    for (let i = 0; i < numPhases; i++) {
      const phaseStartDate = new Date(startDate.getTime() + i * phaseDuration * 24 * 60 * 60 * 1000);
      const phaseEndDate = new Date(Math.min(
        phaseStartDate.getTime() + phaseDuration * 24 * 60 * 60 * 1000,
        endDate.getTime()
      ));

      // Select objectives for this phase
      const phaseObjectives = this.selectObjectivesForPhase(objectives, i, numPhases, categories);
      
      // Generate activities
      const activities = this.generateActivities(phaseObjectives, phaseStartDate, phaseEndDate);

      const phase: StrategyPhase = {
        id: `phase_${i}`,
        name: `Phase ${i + 1}`,
        description: `Focus on ${categories[i % categories.length]}`,
        startDate: phaseStartDate,
        endDate: phaseEndDate,
        objectives: phaseObjectives.map(o => o.id),
        activities,
        expectedOutcomes: this.generateExpectedOutcomes(phaseObjectives),
        dependencies: i > 0 ? [`phase_${i - 1}`] : [],
      };

      phases.push(phase);
    }

    return phases;
  }

  /**
   * Select objectives for a phase
   */
  private selectObjectivesForPhase(
    objectives: StrategyObjective[],
    phaseIndex: number,
    totalPhases: number,
    categories: string[]
  ): StrategyObjective[] {
    // Balance categories across phases
    const category = categories[phaseIndex % categories.length];
    const categoryObjectives = objectives.filter(o => o.category === category);
    
    // Add high priority objectives regardless of category
    const highPriorityObjectives = objectives.filter(o => o.priority === "critical" || o.priority === "high");
    
    // Combine and deduplicate
    const selected = [...new Set([...categoryObjectives, ...highPriorityObjectives])];
    
    return selected;
  }

  /**
   * Generate activities for a phase
   */
  private generateActivities(
    objectives: StrategyObjective[],
    startDate: Date,
    endDate: Date
  ): StrategyActivity[] {
    const activities: StrategyActivity[] = [];
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const activityCount = Math.min(
      Math.max(this.config.minActivitiesPerPhase, Math.floor(totalDays / 2)),
      this.config.maxActivitiesPerPhase
    );

    // Generate different types of activities
    const types: StrategyActivity["type"][] = ["simulation", "exercise", "training", "review"];
    if (this.config.includeRestDays) {
      types.push("rest");
    }

    for (let i = 0; i < activityCount; i++) {
      const type = types[i % types.length];
      const objective = objectives[i % objectives.length];
      
      const activity: StrategyActivity = {
        id: `activity_${Date.now()}_${i}`,
        type,
        name: `${type} for ${objective.name}`,
        description: `Practice ${objective.name} through ${type}`,
        duration: type === "rest" ? 30 : 45,
        category: objective.category,
        difficulty: this.determineDifficulty(objective),
        resources: this.generateResources(objective, type),
        prerequisites: [],
      };

      activities.push(activity);
    }

    return activities;
  }

  /**
   * Determine difficulty based on objective
   */
  private determineDifficulty(objective: StrategyObjective): "easy" | "medium" | "hard" {
    const progress = objective.currentValue / objective.targetValue;
    
    if (progress < 0.3) return "easy";
    if (progress < 0.7) return "medium";
    return "hard";
  }

  /**
   * Generate resources for activity
   */
  private generateResources(objective: StrategyObjective, type: StrategyActivity["type"]): string[] {
    const resources: string[] = [];
    
    if (type === "simulation") {
      resources.push("scenarios", "feedback_system");
    } else if (type === "exercise") {
      resources.push("exercises", "solutions");
    } else if (type === "training") {
      resources.push("tutorials", "examples");
    } else if (type === "review") {
      resources.push("progress_reports", "analytics");
    } else if (type === "rest") {
      resources.push("meditation", "relaxation_techniques");
    }

    return resources;
  }

  /**
   * Generate expected outcomes
   */
  private generateExpectedOutcomes(objectives: StrategyObjective[]): string[] {
    return objectives.map(o => `Improve ${o.name} from ${(o.currentValue / o.targetValue * 100).toFixed(0)}% to target`);
  }

  /**
   * Generate strategy recommendation
   */
  generateRecommendation(
    userId: string,
    currentObjectives: StrategyObjective[],
    userProgress: number
  ): StrategyRecommendation {
    // Identify areas needing focus
    const lowProgressObjectives = currentObjectives.filter(o => o.currentValue / o.targetValue < 0.5);
    const highPriorityObjectives = currentObjectives.filter(o => o.priority === "critical" || o.priority === "high");
    
    // Select category to focus on
    const category = this.selectFocusCategory(lowProgressObjectives, highPriorityObjectives);
    
    // Generate suggested activities
    const suggestedActivities = this.generateSuggestedActivities(category, userProgress);
    
    // Calculate priority
    const priority = this.calculateRecommendationPriority(lowProgressObjectives, highPriorityObjectives);
    
    // Generate reason
    const reason = this.generateRecommendationReason(category, lowProgressObjectives, highPriorityObjectives);
    
    // Calculate estimated duration and value
    const estimatedDuration = suggestedActivities.reduce((sum, a) => sum + a.duration, 0);
    const expectedValue = this.calculateExpectedValue(suggestedActivities, userProgress);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(lowProgressObjectives, highPriorityObjectives);

    const recommendation: StrategyRecommendation = {
      id: `recommendation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      category,
      priority,
      reason,
      suggestedActivities,
      estimatedDuration,
      expectedValue,
      confidence,
    };

    this.recommendations.set(recommendation.id, recommendation);
    return recommendation;
  }

  /**
   * Select focus category
   */
  private selectFocusCategory(
    lowProgressObjectives: StrategyObjective[],
    highPriorityObjectives: StrategyObjective[]
  ): string {
    if (lowProgressObjectives.length > 0) {
      return lowProgressObjectives[0].category;
    }
    if (highPriorityObjectives.length > 0) {
      return highPriorityObjectives[0].category;
    }
    return "communication"; // Default
  }

  /**
   * Generate suggested activities
   */
  private generateSuggestedActivities(category: string, userProgress: number): StrategyActivity[] {
    const activities: StrategyActivity[] = [];
    
    // Generate activities based on category
    const activityTypes: StrategyActivity["type"][] = ["simulation", "exercise", "training"];
    
    activityTypes.forEach((type, index) => {
      const activity: StrategyActivity = {
        id: `activity_${Date.now()}_${index}`,
        type,
        name: `${type} for ${category}`,
        description: `Practice ${category} through ${type}`,
        duration: 45,
        category,
        difficulty: userProgress < 0.5 ? "easy" : "medium",
        resources: this.generateResources({ name: category, category } as any, type),
        prerequisites: [],
      };
      
      activities.push(activity);
    });

    return activities;
  }

  /**
   * Calculate recommendation priority
   */
  private calculateRecommendationPriority(
    lowProgressObjectives: StrategyObjective[],
    highPriorityObjectives: StrategyObjective[]
  ): number {
    let priority = 50;
    
    priority += lowProgressObjectives.length * 10;
    priority += highPriorityObjectives.length * 15;
    
    return Math.min(100, priority);
  }

  /**
   * Generate recommendation reason
   */
  private generateRecommendationReason(
    category: string,
    lowProgressObjectives: StrategyObjective[],
    highPriorityObjectives: StrategyObjective[]
  ): string {
    const reasons: string[] = [];
    
    reasons.push(`Focus on ${category} to address key areas`);
    
    if (lowProgressObjectives.length > 0) {
      reasons.push(`${lowProgressObjectives.length} objectives need attention`);
    }
    
    if (highPriorityObjectives.length > 0) {
      reasons.push(`${highPriorityObjectives.length} high-priority objectives`);
    }
    
    return reasons.join("; ");
  }

  /**
   * Calculate expected value
   */
  private calculateExpectedValue(activities: StrategyActivity[], userProgress: number): number {
    const baseValue = activities.length * 10;
    const progressBonus = (1 - userProgress) * 20;
    return baseValue + progressBonus;
  }

  /**
   * Calculate confidence
   */
  private calculateConfidence(
    lowProgressObjectives: StrategyObjective[],
    highPriorityObjectives: StrategyObjective[]
  ): number {
    let confidence = 0.5;
    
    confidence += Math.min(0.3, lowProgressObjectives.length * 0.1);
    confidence += Math.min(0.2, highPriorityObjectives.length * 0.05);
    
    return Math.min(1, confidence);
  }

  /**
   * Get strategy plan by ID
   */
  getStrategyPlan(planId: string): StrategyPlan | null {
    return this.strategyPlans.get(planId) || null;
  }

  /**
   * Get strategy plans by user
   */
  getUserStrategyPlans(userId: string): StrategyPlan[] {
    return Array.from(this.strategyPlans.values()).filter(plan => plan.userId === userId);
  }

  /**
   * Update strategy plan progress
   */
  updatePlanProgress(planId: string, progress: number): void {
    const plan = this.strategyPlans.get(planId);
    if (plan) {
      plan.progress = progress;
      plan.updatedAt = new Date();
      
      if (progress >= 100) {
        plan.status = "completed";
      }
    }
  }

  /**
   * Activate strategy plan
   */
  activatePlan(planId: string): void {
    const plan = this.strategyPlans.get(planId);
    if (plan) {
      plan.status = "active";
      plan.updatedAt = new Date();
    }
  }

  /**
   * Pause strategy plan
   */
  pausePlan(planId: string): void {
    const plan = this.strategyPlans.get(planId);
    if (plan) {
      plan.status = "paused";
      plan.updatedAt = new Date();
    }
  }

  /**
   * Cancel strategy plan
   */
  cancelPlan(planId: string): void {
    const plan = this.strategyPlans.get(planId);
    if (plan) {
      plan.status = "cancelled";
      plan.updatedAt = new Date();
    }
  }

  /**
   * Get recommendation by ID
   */
  getRecommendation(recommendationId: string): StrategyRecommendation | null {
    return this.recommendations.get(recommendationId) || null;
  }

  /**
   * Get recommendations by user
   */
  getUserRecommendations(userId: string): StrategyRecommendation[] {
    return Array.from(this.recommendations.values()).filter(rec => rec.userId === userId);
  }

  /**
   * Get strategy statistics
   */
  getStatistics(): {
    totalPlans: number;
    activePlans: number;
    completedPlans: number;
    averageProgress: number;
    totalRecommendations: number;
    averageConfidence: number;
    categoryDistribution: Record<string, number>;
  } {
    const plans = Array.from(this.strategyPlans.values());
    const recommendations = Array.from(this.recommendations.values());
    
    const activePlans = plans.filter(p => p.status === "active").length;
    const completedPlans = plans.filter(p => p.status === "completed").length;
    const averageProgress = plans.length > 0 ? plans.reduce((sum, p) => sum + p.progress, 0) / plans.length : 0;
    const averageConfidence = recommendations.length > 0 ? recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length : 0;
    
    const categoryDistribution: Record<string, number> = {};
    plans.forEach(plan => {
      plan.objectives.forEach(obj => {
        categoryDistribution[obj.category] = (categoryDistribution[obj.category] || 0) + 1;
      });
    });

    return {
      totalPlans: plans.length,
      activePlans,
      completedPlans,
      averageProgress,
      totalRecommendations: recommendations.length,
      averageConfidence,
      categoryDistribution,
    };
  }

  /**
   * Export data
   */
  exportData(): {
    plans: StrategyPlan[];
    recommendations: StrategyRecommendation[];
    config: StrategyConfig;
  } {
    return {
      plans: Array.from(this.strategyPlans.values()),
      recommendations: Array.from(this.recommendations.values()),
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    plans: StrategyPlan[];
    recommendations: StrategyRecommendation[];
    config?: StrategyConfig;
  }): void {
    data.plans.forEach(plan => {
      this.strategyPlans.set(plan.id, plan);
    });
    data.recommendations.forEach(rec => {
      this.recommendations.set(rec.id, rec);
    });
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.strategyPlans.clear();
    this.recommendations.clear();
  }
}

export const strategyEngine = StrategyEngine.getInstance();
