/**
 * User Journey Analytics
 * Analytics for user journey tracking
 * Tracks: user paths, common journeys, drop-off points
 */

// Journey Step
export interface JourneyStep {
  stepId: string;
  stepName: string;
  pageUrl: string;
  timestamp: Date;
  duration?: number; // seconds spent on this step
  metadata?: Record<string, unknown>;
}

// User Journey Data
export interface UserJourneyData {
  journeyId: string;
  userId: string;
  sessionId: string;
  steps: JourneyStep[];
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  journeyType: string;
}

// Journey Metrics
export interface JourneyMetrics {
  totalJourneys: number;
  averageStepsPerJourney: number;
  averageJourneyDuration: number; // seconds
  completionRate: number; // 0-1
  commonJourneys: Array<{
    journeyType: string;
    count: number;
    percentage: number;
    averageSteps: number;
  }>;
  dropOffPoints: Array<{
    stepName: string;
    dropOffCount: number;
    dropOffRate: number;
  }>;
  mostCommonPaths: Array<{
    path: string[];
    count: number;
    percentage: number;
  }>;
  journeyDistribution: Array<{
    journeyType: string;
    completed: number;
    abandoned: number;
    completionRate: number;
  }>;
}

export class UserJourneyAnalytics {
  private static instance: UserJourneyAnalytics;
  private journeys: Map<string, UserJourneyData> = new Map();

  private constructor() {}

  static getInstance(): UserJourneyAnalytics {
    if (!UserJourneyAnalytics.instance) {
      UserJourneyAnalytics.instance = new UserJourneyAnalytics();
    }
    return UserJourneyAnalytics.instance;
  }

  /**
   * Start a new journey
   */
  startJourney(
    userId: string,
    sessionId: string,
    journeyType: string
  ): UserJourneyData {
    const journeyId = this.generateJourneyId();
    const journey: UserJourneyData = {
      journeyId,
      userId,
      sessionId,
      steps: [],
      startTime: new Date(),
      completed: false,
      journeyType,
    };

    this.journeys.set(journeyId, journey);
    return journey;
  }

  /**
   * Add step to journey
   */
  addStep(
    journeyId: string,
    stepName: string,
    pageUrl: string,
    duration?: number,
    metadata?: Record<string, unknown>
  ): void {
    const journey = this.journeys.get(journeyId);
    if (!journey) return;

    const step: JourneyStep = {
      stepId: this.generateStepId(),
      stepName,
      pageUrl,
      timestamp: new Date(),
      duration,
      metadata,
    };

    journey.steps.push(step);
  }

  /**
   * Complete journey
   */
  completeJourney(journeyId: string): void {
    const journey = this.journeys.get(journeyId);
    if (!journey) return;

    journey.completed = true;
    journey.endTime = new Date();
  }

  /**
   * Abandon journey
   */
  abandonJourney(journeyId: string): void {
    const journey = this.journeys.get(journeyId);
    if (!journey) return;

    journey.completed = false;
    journey.endTime = new Date();
  }

  /**
   * Get journey
   */
  getJourney(journeyId: string): UserJourneyData | null {
    return this.journeys.get(journeyId) || null;
  }

  /**
   * Get user journeys
   */
  getUserJourneys(userId: string): UserJourneyData[] {
    return Array.from(this.journeys.values()).filter(j => j.userId === userId);
  }

  /**
   * Calculate journey metrics
   */
  calculateMetrics(): JourneyMetrics {
    const journeys = Array.from(this.journeys.values());

    if (journeys.length === 0) {
      return {
        totalJourneys: 0,
        averageStepsPerJourney: 0,
        averageJourneyDuration: 0,
        completionRate: 0,
        commonJourneys: [],
        dropOffPoints: [],
        mostCommonPaths: [],
        journeyDistribution: [],
      };
    }

    const totalJourneys = journeys.length;
    const totalSteps = journeys.reduce((sum, j) => sum + j.steps.length, 0);
    const averageStepsPerJourney = totalSteps / totalJourneys;

    const completedJourneys = journeys.filter(j => j.completed && j.endTime);
    const totalDuration = completedJourneys.reduce((sum, j) => {
      if (j.endTime) {
        return sum + (j.endTime.getTime() - j.startTime.getTime()) / 1000;
      }
      return sum;
    }, 0);
    const averageJourneyDuration = completedJourneys.length > 0 ? totalDuration / completedJourneys.length : 0;

    const completedCount = journeys.filter(j => j.completed).length;
    const completionRate = completedCount / totalJourneys;

    // Common journeys
    const journeyTypeCounts: Map<string, { count: number; totalSteps: number }> = new Map();
    journeys.forEach(journey => {
      const existing = journeyTypeCounts.get(journey.journeyType);
      if (existing) {
        existing.count++;
        existing.totalSteps += journey.steps.length;
      } else {
        journeyTypeCounts.set(journey.journeyType, {
          count: 1,
          totalSteps: journey.steps.length,
        });
      }
    });

    const commonJourneys = Array.from(journeyTypeCounts.entries())
      .map(([journeyType, data]) => ({
        journeyType,
        count: data.count,
        percentage: (data.count / totalJourneys) * 100,
        averageSteps: data.count > 0 ? data.totalSteps / data.count : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Drop-off points
    const stepDropOffs: Map<string, { total: number; dropped: number }> = new Map();
    journeys.forEach(journey => {
      journey.steps.forEach((step, index) => {
        const existing = stepDropOffs.get(step.stepName);
        if (existing) {
          existing.total++;
          if (index === journey.steps.length - 1 && !journey.completed) {
            existing.dropped++;
          }
        } else {
          stepDropOffs.set(step.stepName, {
            total: 1,
            dropped: index === journey.steps.length - 1 && !journey.completed ? 1 : 0,
          });
        }
      });
    });

    const dropOffPoints = Array.from(stepDropOffs.entries())
      .map(([stepName, data]) => ({
        stepName,
        dropOffCount: data.dropped,
        dropOffRate: data.total > 0 ? data.dropped / data.total : 0,
      }))
      .filter(d => d.dropOffCount > 0)
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
      .slice(0, 10);

    // Most common paths
    const pathCounts: Map<string, number> = new Map();
    journeys.forEach(journey => {
      const pathString = journey.steps.map((s: JourneyStep) => s.stepName).join(' -> ');
      pathCounts.set(pathString, (pathCounts.get(pathString) || 0) + 1);
    });

    const mostCommonPaths = Array.from(pathCounts.entries())
      .map(([path, count]) => ({
        path: path.split(' -> '),
        count,
        percentage: (count / totalJourneys) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Journey distribution
    const journeyDistribution = Array.from(journeyTypeCounts.entries())
      .map(([journeyType, data]) => {
        const typeJourneys = journeys.filter(j => j.journeyType === journeyType);
        const completed = typeJourneys.filter(j => j.completed).length;
        const abandoned = typeJourneys.length - completed;

        return {
          journeyType,
          completed,
          abandoned,
          completionRate: typeJourneys.length > 0 ? completed / typeJourneys.length : 0,
        };
      })
      .sort((a, b) => b.completed - a.completed);

    return {
      totalJourneys,
      averageStepsPerJourney,
      averageJourneyDuration,
      completionRate,
      commonJourneys,
      dropOffPoints,
      mostCommonPaths,
      journeyDistribution,
    };
  }

  /**
   * Get journey for specific type
   */
  getJourneysByType(journeyType: string): UserJourneyData[] {
    return Array.from(this.journeys.values()).filter(j => j.journeyType === journeyType);
  }

  /**
   * Generate journey ID
   */
  private generateJourneyId(): string {
    return `jrn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate step ID
   */
  private generateStepId(): string {
    return `stp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear journey
   */
  clearJourney(journeyId: string): void {
    this.journeys.delete(journeyId);
  }

  /**
   * Clear all journeys
   */
  clearAllJourneys(): void {
    this.journeys.clear();
  }
}

export const userJourney = UserJourneyAnalytics.getInstance();
