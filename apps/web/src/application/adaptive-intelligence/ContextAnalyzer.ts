/**
 * Context Analyzer
 * Analyzes user context to determine state, needs, opportunities, and risks
 */

import {
  UserContext,
  ContextAnalysis,
  UserState,
  UserNeeds,
  UserOpportunities,
  UserRisks,
  UserProfile,
  UserHistory,
  UserGoals,
  UserScores,
  UserWeaknesses,
  ContextualFactors,
} from "./interfaces/IAdaptiveIntelligenceOrchestrator";

// ============================================================================
// CONTEXT ANALYZER CLASS
// ============================================================================

export class ContextAnalyzer {
  private static instance: ContextAnalyzer;

  private constructor() {}

  static getInstance(): ContextAnalyzer {
    if (!ContextAnalyzer.instance) {
      ContextAnalyzer.instance = new ContextAnalyzer();
    }
    return ContextAnalyzer.instance;
  }

  /**
   * Analyze user context
   */
  analyzeContext(context: UserContext): ContextAnalysis {
    const userState = this.analyzeUserState(context);
    const needs = this.analyzeNeeds(context, userState);
    const opportunities = this.analyzeOpportunities(context, userState);
    const risks = this.analyzeRisks(context, userState);
    const recommendations = this.generateRecommendations(context, userState, needs, opportunities, risks);

    return {
      userState,
      needs,
      opportunities,
      risks,
      recommendations,
    };
  }

  /**
   * Analyze user state
   */
  private analyzeUserState(context: UserContext): UserState {
    const engagement = this.calculateEngagement(context);
    const readiness = this.calculateReadiness(context);
    const capability = this.calculateCapability(context);
    const motivation = this.calculateMotivation(context);
    const stress = this.calculateStress(context);
    const confidence = this.calculateConfidence(context);

    return {
      engagement,
      readiness,
      capability,
      motivation,
      stress,
      confidence,
    };
  }

  /**
   * Calculate engagement
   */
  private calculateEngagement(context: UserContext): number {
    let score = 0.5; // Base score

    // Time spent
    if (context.history.timeSpent > 1000) score += 0.2;
    else if (context.history.timeSpent > 500) score += 0.1;

    // Streak
    score += Math.min(0.3, context.history.streak * 0.05);

    // Recent activity
    const daysSinceLastActivity = Math.floor(
      (Date.now() - context.history.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastActivity < 1) score += 0.2;
    else if (daysSinceLastActivity < 7) score += 0.1;
    else score -= 0.2;

    // Session count
    score += Math.min(0.2, context.context.sessionCount * 0.02);

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate readiness
   */
  private calculateReadiness(context: UserContext): number {
    let score = 0.5;

    // Confidence
    score += (context.profile.personality.confidence - 5) * 0.05;

    // Stress tolerance
    score += (context.profile.personality.stressTolerance - 5) * 0.03;

    // Current simulation state
    if (context.currentSimulation) {
      score += context.currentSimulation.confidence * 0.1;
      score -= context.currentSimulation.stress * 0.1;
    }

    // Recent performance
    if (context.context.recentPerformance === "improving") score += 0.2;
    else if (context.context.recentPerformance === "declining") score -= 0.2;

    // Motivation
    score += (context.context.motivation - 5) * 0.04;

    // Fatigue
    score -= context.context.fatigue * 0.05;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate capability
   */
  private calculateCapability(context: UserContext): number {
    let score = 0.5;

    // Overall score
    score += (context.scores.overall - 50) * 0.005;

    // Employability
    score += (context.scores.employability - 50) * 0.003;

    // Experience
    score += Math.min(0.2, context.profile.careerProfile.experience * 0.02);

    // Skills count
    score += Math.min(0.2, context.profile.careerProfile.skills.length * 0.02);

    // Confidence score
    score += (context.scores.confidence - 50) * 0.003;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate motivation
   */
  private calculateMotivation(context: UserContext): number {
    let score = 0.5;

    // Goal progress
    score += context.goals.progress * 0.003;

    // Goal priority
    if (context.goals.priority === "high") score += 0.2;
    else if (context.goals.priority === "medium") score += 0.1;

    // Context motivation
    score += (context.context.motivation - 5) * 0.05;

    // Recent performance
    if (context.context.recentPerformance === "improving") score += 0.15;
    else if (context.context.recentPerformance === "declining") score -= 0.15;

    // Streak
    score += Math.min(0.15, context.history.streak * 0.03);

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate stress
   */
  private calculateStress(context: UserContext): number {
    let score = 0.3;

    // Personality stress tolerance (inverse)
    score += (10 - context.profile.personality.stressTolerance) * 0.05;

    // Current simulation stress
    if (context.currentSimulation) {
      score += context.currentSimulation.stress * 0.3;
    }

    // Context fatigue
    score += context.context.fatigue * 0.1;

    // Session count (more sessions = more potential stress)
    score += Math.min(0.2, context.context.sessionCount * 0.02);

    // Environment
    if (context.context.environment === "noisy") score += 0.2;
    else if (context.context.environment === "moderate") score += 0.1;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Calculate confidence
   */
  private calculateConfidence(context: UserContext): number {
    let score = 0.5;

    // Personality confidence
    score += (context.profile.personality.confidence - 5) * 0.05;

    // Score confidence
    score += (context.scores.confidence - 50) * 0.005;

    // Recent performance
    if (context.context.recentPerformance === "improving") score += 0.15;
    else if (context.context.recentPerformance === "declining") score -= 0.15;

    // Current simulation confidence
    if (context.currentSimulation) {
      score += (context.currentSimulation.confidence - 5) * 0.05;
    }

    // Strengths count
    score += Math.min(0.15, context.scores.strengths.length * 0.03);

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Analyze needs
   */
  private analyzeNeeds(context: UserContext, userState: UserState): UserNeeds {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];
    const priority: string[] = [];

    // Immediate needs based on current state
    if (userState.stress > 0.7) {
      immediate.push("stress_relief");
      priority.push("stress_relief");
    }

    if (userState.confidence < 0.4) {
      immediate.push("confidence_building");
      priority.push("confidence_building");
    }

    if (userState.engagement < 0.4) {
      immediate.push("engagement_boost");
      priority.push("engagement_boost");
    }

    if (context.currentSimulation && context.currentSimulation.currentScore < 50) {
      immediate.push("immediate_feedback");
      priority.push("immediate_feedback");
    }

    // Short-term needs based on goals and weaknesses
    if (context.goals.progress < 0.5) {
      shortTerm.push("goal_support");
      priority.push("goal_support");
    }

    context.weaknesses.identified.forEach(weakness => {
      const severity = context.weaknesses.severity[weakness];
      if (severity === "high") {
        shortTerm.push(`address_${weakness}`);
        priority.push(`address_${weakness}`);
      }
    });

    // Long-term needs based on career profile
    if (context.profile.careerProfile.experience < 2) {
      longTerm.push("skill_development");
    }

    if (context.scores.employability < 60) {
      longTerm.push("employability_improvement");
    }

    context.scores.areasForImprovement.forEach(area => {
      longTerm.push(`improve_${area}`);
    });

    return {
      immediate,
      shortTerm,
      longTerm,
      priority,
    };
  }

  /**
   * Analyze opportunities
   */
  private analyzeOpportunities(context: UserContext, userState: UserState): UserOpportunities {
    const skillDevelopment: string[] = [];
    const careerAdvancement: string[] = [];
    const performanceImprovement: string[] = [];
    const learning: string[] = [];

    // Skill development opportunities
    context.scores.areasForImprovement.forEach(area => {
      skillDevelopment.push(area);
    });

    context.weaknesses.identified.forEach(weakness => {
      if (!context.weaknesses.addressed.includes(weakness)) {
        skillDevelopment.push(weakness);
      }
    });

    // Career advancement opportunities
    if (context.scores.employability > 70) {
      careerAdvancement.push("promotion_ready");
    }

    if (context.profile.careerProfile.experience > 5) {
      careerAdvancement.push("senior_roles");
    }

    if (context.scores.overall > 80) {
      careerAdvancement.push("expert_level");
    }

    // Performance improvement opportunities
    if (userState.engagement > 0.7 && userState.readiness > 0.7) {
      performanceImprovement.push("advanced_training");
    }

    if (context.context.recentPerformance === "improving") {
      performanceImprovement.push("momentum_capitalization");
    }

    if (context.history.streak > 5) {
      performanceImprovement.push("streak_extension");
    }

    // Learning opportunities
    context.history.learningProgress.forEach(progress => {
      if (progress.progress < 0.8) {
        learning.push(progress.topic);
      }
    });

    context.profile.careerProfile.interests.forEach(interest => {
      if (!context.profile.careerProfile.skills.includes(interest)) {
        learning.push(interest);
      }
    });

    return {
      skillDevelopment,
      careerAdvancement,
      performanceImprovement,
      learning,
    };
  }

  /**
   * Analyze risks
   */
  private analyzeRisks(context: UserContext, userState: UserState): UserRisks {
    const skillAtrophy: string[] = [];
    let disengagement = 0;
    let burnout = 0;
    let goalAbandonment = 0;

    // Disengagement risk
    if (userState.engagement < 0.3) disengagement = 0.8;
    else if (userState.engagement < 0.5) disengagement = 0.5;
    else if (userState.engagement < 0.7) disengagement = 0.3;

    if (context.context.sessionCount < 3) disengagement += 0.2;
    if (context.history.streak === 0) disengagement += 0.3;

    disengagement = Math.min(1, disengagement);

    // Burnout risk
    if (userState.stress > 0.7) burnout = 0.7;
    else if (userState.stress > 0.5) burnout = 0.4;

    if (context.context.fatigue > 0.7) burnout += 0.3;
    if (context.context.sessionCount > 10) burnout += 0.2;

    burnout = Math.min(1, burnout);

    // Skill atrophy
    context.scores.areasForImprovement.forEach(area => {
      if (context.scores.skillGaps[area] > 0.7) {
        skillAtrophy.push(area);
      }
    });

    context.weaknesses.recurring.forEach(weakness => {
      if (!skillAtrophy.includes(weakness)) {
        skillAtrophy.push(weakness);
      }
    });

    // Goal abandonment risk
    if (context.goals.progress < 0.2) goalAbandonment = 0.6;
    else if (context.goals.progress < 0.4) goalAbandonment = 0.3;

    if (userState.motivation < 0.3) goalAbandonment += 0.4;
    if (context.context.recentPerformance === "declining") goalAbandonment += 0.3;

    goalAbandonment = Math.min(1, goalAbandonment);

    return {
      disengagement,
      burnout,
      skillAtrophy,
      goalAbandonment,
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    context: UserContext,
    userState: UserState,
    needs: UserNeeds,
    opportunities: UserOpportunities,
    risks: UserRisks
  ): string[] {
    const recommendations: string[] = [];

    // Risk mitigation recommendations
    if (risks.disengagement > 0.5) {
      recommendations.push("Implement engagement boost strategies");
    }

    if (risks.burnout > 0.5) {
      recommendations.push("Suggest break or reduce session intensity");
    }

    if (risks.goalAbandonment > 0.5) {
      recommendations.push("Reassess goals and provide motivation");
    }

    // Need-based recommendations
    needs.immediate.forEach(need => {
      if (need === "stress_relief") {
        recommendations.push("Provide stress management techniques");
      } else if (need === "confidence_building") {
        recommendations.push("Implement confidence-building exercises");
      } else if (need === "engagement_boost") {
        recommendations.push("Introduce gamification elements");
      } else if (need === "immediate_feedback") {
        recommendations.push("Provide real-time feedback and guidance");
      }
    });

    // Opportunity-based recommendations
    if (opportunities.performanceImprovement.length > 0) {
      recommendations.push("Leverage current momentum for advanced training");
    }

    if (opportunities.careerAdvancement.length > 0) {
      recommendations.push("Prepare for career advancement opportunities");
    }

    // Context-based recommendations
    if (context.context.timeOfDay === "evening" && context.context.fatigue > 0.6) {
      recommendations.push("Suggest lighter evening sessions");
    }

    if (context.context.environment === "noisy") {
      recommendations.push("Recommend quieter environment for focus sessions");
    }

    return recommendations;
  }
}

export const contextAnalyzer = ContextAnalyzer.getInstance();
