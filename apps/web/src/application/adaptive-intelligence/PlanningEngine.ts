/**
 * Planning Engine
 * Multi-day planning with intelligent scheduling
 */

import {
  DailyPlan,
  PlannedActivity,
  WeeklyPlan,
  PlanningConstraints,
  PlanningConfig,
  PlanningSuggestion,
  defaultPlanningConfig,
} from "./interfaces/IPlanningEngine";

// ============================================================================
// PLANNING ENGINE CLASS
// ============================================================================

export class PlanningEngine {
  private static instance: PlanningEngine;
  private config: PlanningConfig;
  private weeklyPlans: Map<string, WeeklyPlan> = new Map();
  private dailyPlans: Map<string, DailyPlan> = new Map();
  private suggestions: Map<string, PlanningSuggestion> = new Map();

  private constructor() {
    this.config = defaultPlanningConfig;
  }

  static getInstance(): PlanningEngine {
    if (!PlanningEngine.instance) {
      PlanningEngine.instance = new PlanningEngine();
    }
    return PlanningEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<PlanningConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      constraints: { ...this.config.constraints, ...config.constraints },
    };
  }

  /**
   * Create weekly plan
   */
  createWeeklyPlan(
    userId: string,
    startDate: Date,
    focusAreas: string[]
  ): WeeklyPlan {
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dailyPlans = this.generateDailyPlans(userId, startDate, endDate, focusAreas);
    
    const totalActivities = dailyPlans.reduce((sum, day) => sum + day.activities.length, 0);
    const totalDuration = dailyPlans.reduce((sum, day) => sum + day.totalDuration, 0);

    const plan: WeeklyPlan = {
      id: `weekly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      startDate,
      endDate,
      dailyPlans,
      totalActivities,
      totalDuration,
      focusAreas,
      status: "draft",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.weeklyPlans.set(plan.id, plan);
    return plan;
  }

  /**
   * Generate daily plans for a week
   */
  private generateDailyPlans(
    userId: string,
    startDate: Date,
    endDate: Date,
    focusAreas: string[]
  ): DailyPlan[] {
    const dailyPlans: DailyPlan[] = [];
    const constraints = this.config.constraints;
    let consecutiveWorkDays = 0;

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayOfWeek = currentDate.getDay();

      // Check if this should be a rest day
      const isRestDay = this.shouldBeRestDay(consecutiveWorkDays, constraints);

      if (isRestDay) {
        const restPlan = this.createRestDay(userId, currentDate);
        dailyPlans.push(restPlan);
        consecutiveWorkDays = 0;
      } else {
        const workPlan = this.createWorkDay(userId, currentDate, focusAreas, constraints);
        dailyPlans.push(workPlan);
        consecutiveWorkDays++;
      }
    }

    return dailyPlans;
  }

  /**
   * Check if day should be a rest day
   */
  private shouldBeRestDay(consecutiveWorkDays: number, constraints: PlanningConstraints): boolean {
    return consecutiveWorkDays >= constraints.maxConsecutiveWorkDays;
  }

  /**
   * Create rest day plan
   */
  private createRestDay(userId: string, date: Date): DailyPlan {
    const restActivity: PlannedActivity = {
      id: `activity_${Date.now()}_rest`,
      type: "rest",
      name: "Rest Day",
      description: "Take a break and recharge",
      startTime: "10:00",
      duration: 30,
      category: "wellness",
      difficulty: "easy",
      priority: 50,
      completed: false,
      resources: ["meditation", "relaxation"],
    };

    const dailyPlan: DailyPlan = {
      id: `daily_${Date.now()}_rest`,
      userId,
      date,
      activities: [restActivity],
      totalDuration: 30,
      priority: "low",
      status: "draft",
      notes: "Rest day for recovery",
    };

    return dailyPlan;
  }

  /**
   * Create work day plan
   */
  private createWorkDay(
    userId: string,
    date: Date,
    focusAreas: string[],
    constraints: PlanningConstraints
  ): DailyPlan {
    const activities = this.generateActivitiesForDay(date, focusAreas, constraints);
    const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);

    const dailyPlan: DailyPlan = {
      id: `daily_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      date,
      activities,
      totalDuration,
      priority: this.determineDayPriority(activities),
      status: "draft",
      notes: "",
    };

    return dailyPlan;
  }

  /**
   * Generate activities for a day
   */
  private generateActivitiesForDay(
    date: Date,
    focusAreas: string[],
    constraints: PlanningConstraints
  ): PlannedActivity[] {
    const activities: PlannedActivity[] = [];
    const activityTypes: PlannedActivity["type"][] = ["simulation", "exercise", "mock_interview", "stress_interview", "review"];
    const difficulties: PlannedActivity["difficulty"][] = ["easy", "medium", "hard"];

    const numActivities = Math.floor(
      (constraints.maxDailyDuration - constraints.minDailyDuration) / 30 + Math.random() * 2
    );

    let currentTime = this.parseTime(constraints.preferredStartTime);

    for (let i = 0; i < numActivities; i++) {
      const type = activityTypes[i % activityTypes.length];
      const category = focusAreas[i % focusAreas.length];
      const difficulty = difficulties[i % difficulties.length];

      const activity: PlannedActivity = {
        id: `activity_${Date.now()}_${i}`,
        type,
        name: `${type} - ${category}`,
        description: `Practice ${category} through ${type}`,
        startTime: this.formatTime(currentTime),
        duration: 45,
        category,
        difficulty,
        priority: this.calculateActivityPriority(type, difficulty),
        completed: false,
        resources: this.generateActivityResources(type, category),
      };

      activities.push(activity);
      currentTime += activity.duration + 15; // Add 15 min break between activities
    }

    return activities;
  }

  /**
   * Parse time string to minutes
   */
  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Format minutes to time string
   */
  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }

  /**
   * Determine day priority based on activities
   */
  private determineDayPriority(activities: PlannedActivity[]): "high" | "medium" | "low" {
    const avgPriority = activities.reduce((sum, a) => sum + a.priority, 0) / activities.length;
    
    if (avgPriority >= 70) return "high";
    if (avgPriority >= 40) return "medium";
    return "low";
  }

  /**
   * Calculate activity priority
   */
  private calculateActivityPriority(type: PlannedActivity["type"], difficulty: PlannedActivity["difficulty"]): number {
    let priority = 50;

    // Type-based priority
    const typePriority: Record<PlannedActivity["type"], number> = {
      simulation: 70,
      exercise: 50,
      mock_interview: 80,
      stress_interview: 90,
      rest: 30,
      review: 60,
    };
    priority += typePriority[type] - 50;

    // Difficulty-based priority
    const difficultyPriority: Record<PlannedActivity["difficulty"], number> = {
      easy: 30,
      medium: 50,
      hard: 70,
    };
    priority += difficultyPriority[difficulty] - 50;

    return Math.min(100, Math.max(0, priority));
  }

  /**
   * Generate activity resources
   */
  private generateActivityResources(type: PlannedActivity["type"], category: string): string[] {
    const resources: string[] = [];
    
    if (type === "simulation") {
      resources.push("scenarios", "feedback_system");
    } else if (type === "exercise") {
      resources.push("exercises", "solutions");
    } else if (type === "mock_interview") {
      resources.push("interview_questions", "evaluation_criteria");
    } else if (type === "stress_interview") {
      resources.push("stress_scenarios", "pressure_techniques");
    } else if (type === "review") {
      resources.push("progress_reports", "analytics");
    } else if (type === "rest") {
      resources.push("meditation", "relaxation_techniques");
    }

    return resources;
  }

  /**
   * Generate planning suggestion
   */
  generateSuggestion(
    userId: string,
    date: Date,
    userPreferences: {
      availableTime: number;
      preferredActivities: PlannedActivity["type"][];
      focusAreas: string[];
    }
  ): PlanningSuggestion {
    const suggestedActivities = this.generateSuggestedActivities(
      date,
      userPreferences.availableTime,
      userPreferences.preferredActivities,
      userPreferences.focusAreas
    );

    const reason = this.generateSuggestionReason(suggestedActivities, userPreferences);
    const confidence = this.calculateSuggestionConfidence(suggestedActivities, userPreferences);
    const alternatives = this.generateAlternatives(suggestedActivities, userPreferences);

    const suggestion: PlanningSuggestion = {
      id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      date,
      suggestedActivities,
      reason,
      confidence,
      alternatives,
    };

    this.suggestions.set(suggestion.id, suggestion);
    return suggestion;
  }

  /**
   * Generate suggested activities
   */
  private generateSuggestedActivities(
    date: Date,
    availableTime: number,
    preferredTypes: PlannedActivity["type"][],
    focusAreas: string[]
  ): PlannedActivity[] {
    const activities: PlannedActivity[] = [];
    let currentTime = this.parseTime(this.config.constraints.preferredStartTime);
    const endTime = this.parseTime(this.config.constraints.preferredEndTime);

    while (currentTime + 45 <= endTime && activities.length < this.config.constraints.maxActivitiesPerDay) {
      const type = preferredTypes[activities.length % preferredTypes.length];
      const category = focusAreas[activities.length % focusAreas.length];

      const activity: PlannedActivity = {
        id: `activity_${Date.now()}_${activities.length}`,
        type,
        name: `${type} - ${category}`,
        description: `Practice ${category} through ${type}`,
        startTime: this.formatTime(currentTime),
        duration: 45,
        category,
        difficulty: "medium",
        priority: 60,
        completed: false,
        resources: this.generateActivityResources(type, category),
      };

      activities.push(activity);
      currentTime += activity.duration + 15;
    }

    return activities;
  }

  /**
   * Generate suggestion reason
   */
  private generateSuggestionReason(activities: PlannedActivity[], preferences: any): string {
    const reasons: string[] = [];
    
    reasons.push(`Generated ${activities.length} activities based on preferences`);
    reasons.push(`Total duration: ${activities.reduce((sum, a) => sum + a.duration, 0)} minutes`);
    reasons.push(`Focus areas: ${Array.from(new Set(activities.map(a => a.category))).join(", ")}`);

    return reasons.join("; ");
  }

  /**
   * Calculate suggestion confidence
   */
  private calculateSuggestionConfidence(activities: PlannedActivity[], preferences: any): number {
    let confidence = 0.5;
    
    // More activities matching preferences = higher confidence
    const matchingActivities = activities.filter(a => (preferences as any).preferredActivities.includes(a.type));
    confidence += (matchingActivities.length / activities.length) * 0.3;

    return Math.min(1, confidence);
  }

  /**
   * Generate alternatives
   */
  private generateAlternatives(activities: PlannedActivity[], preferences: any): PlannedActivity[][] {
    const alternatives: PlannedActivity[][] = [];

    // Alternative 1: Fewer activities
    if (activities.length > 2) {
      alternatives.push(activities.slice(0, activities.length - 1));
    }

    // Alternative 2: Different activity types
    const alternativeTypes: PlannedActivity["type"][] = ["exercise", "review"];
    const alternativeActivities = activities.slice(0, Math.min(3, activities.length)).map((a, i) => ({
      ...a,
      type: alternativeTypes[i % alternativeTypes.length],
    }));
    alternatives.push(alternativeActivities);

    return alternatives;
  }

  /**
   * Get weekly plan by ID
   */
  getWeeklyPlan(planId: string): WeeklyPlan | null {
    return this.weeklyPlans.get(planId) || null;
  }

  /**
   * Get weekly plans by user
   */
  getUserWeeklyPlans(userId: string): WeeklyPlan[] {
    return Array.from(this.weeklyPlans.values()).filter(plan => plan.userId === userId);
  }

  /**
   * Get daily plan by date
   */
  getDailyPlan(userId: string, date: Date): DailyPlan | null {
    return Array.from(this.dailyPlans.values()).find(
      plan => plan.userId === userId && plan.date.toDateString() === date.toDateString()
    ) || null;
  }

  /**
   * Update daily plan status
   */
  updateDailyPlanStatus(planId: string, status: DailyPlan["status"]): void {
    const plan = this.dailyPlans.get(planId);
    if (plan) {
      plan.status = status;
    }
  }

  /**
   * Mark activity as completed
   */
  markActivityCompleted(dailyPlanId: string, activityId: string): void {
    const dailyPlan = this.dailyPlans.get(dailyPlanId);
    if (dailyPlan) {
      const activity = dailyPlan.activities.find(a => a.id === activityId);
      if (activity) {
        activity.completed = true;
      }
    }
  }

  /**
   * Get planning suggestion by ID
   */
  getSuggestion(suggestionId: string): PlanningSuggestion | null {
    return this.suggestions.get(suggestionId) || null;
  }

  /**
   * Get suggestions by user
   */
  getUserSuggestions(userId: string): PlanningSuggestion[] {
    return Array.from(this.suggestions.values()).filter(s => s.userId === userId);
  }

  /**
   * Get planning statistics
   */
  getStatistics(): {
    totalWeeklyPlans: number;
    totalDailyPlans: number;
    totalActivities: number;
    averageActivitiesPerDay: number;
    averageDailyDuration: number;
    completionRate: number;
    typeDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
  } {
    const weeklyPlans = Array.from(this.weeklyPlans.values());
    const dailyPlans = Array.from(this.dailyPlans.values());
    
    const totalActivities = dailyPlans.reduce((sum, day) => sum + day.activities.length, 0);
    const averageActivitiesPerDay = dailyPlans.length > 0 ? totalActivities / dailyPlans.length : 0;
    const averageDailyDuration = dailyPlans.length > 0 
      ? dailyPlans.reduce((sum, day) => sum + day.totalDuration, 0) / dailyPlans.length 
      : 0;

    const completedActivities = dailyPlans.reduce((sum, day) => 
      sum + day.activities.filter(a => a.completed).length, 0);
    const completionRate = totalActivities > 0 ? completedActivities / totalActivities : 0;

    const typeDistribution: Record<string, number> = {};
    const categoryDistribution: Record<string, number> = {};

    dailyPlans.forEach(day => {
      day.activities.forEach(activity => {
        typeDistribution[activity.type] = (typeDistribution[activity.type] || 0) + 1;
        categoryDistribution[activity.category] = (categoryDistribution[activity.category] || 0) + 1;
      });
    });

    return {
      totalWeeklyPlans: weeklyPlans.length,
      totalDailyPlans: dailyPlans.length,
      totalActivities,
      averageDailyDuration,
      averageActivitiesPerDay,
      completionRate,
      typeDistribution,
      categoryDistribution,
    };
  }

  /**
   * Export data
   */
  exportData(): {
    weeklyPlans: WeeklyPlan[];
    dailyPlans: DailyPlan[];
    suggestions: PlanningSuggestion[];
    config: PlanningConfig;
  } {
    return {
      weeklyPlans: Array.from(this.weeklyPlans.values()),
      dailyPlans: Array.from(this.dailyPlans.values()),
      suggestions: Array.from(this.suggestions.values()),
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    weeklyPlans: WeeklyPlan[];
    dailyPlans: DailyPlan[];
    suggestions: PlanningSuggestion[];
    config?: PlanningConfig;
  }): void {
    data.weeklyPlans.forEach(plan => {
      this.weeklyPlans.set(plan.id, plan);
    });
    data.dailyPlans.forEach(plan => {
      this.dailyPlans.set(plan.id, plan);
    });
    data.suggestions.forEach(suggestion => {
      this.suggestions.set(suggestion.id, suggestion);
    });
    if (data.config) {
      this.setConfig(data.config);
    }
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.weeklyPlans.clear();
    this.dailyPlans.clear();
    this.suggestions.clear();
  }
}

export const planningEngine = PlanningEngine.getInstance();
