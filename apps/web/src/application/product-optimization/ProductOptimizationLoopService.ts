/**
 * Product Optimization Loop Service
 * Automatic product improvement loop
 */

import {
  OptimizationInsight,
  OptimizationProposal,
  SessionMetrics,
  ProductOptimizationLoopConfig,
  defaultProductOptimizationLoopConfig,
} from "./interfaces/IProductOptimizationLoop";
import { experienceMemoryService } from "../experience-memory/ExperienceMemoryService";
import { productAnalyticsService } from "../product-analytics/ProductAnalyticsService";
import { adaptiveIntelligenceOrchestrator } from "../adaptive-intelligence/AdaptiveIntelligenceOrchestrator";

// ============================================================================
// PRODUCT OPTIMIZATION LOOP SERVICE CLASS
// ============================================================================

export class ProductOptimizationLoopService {
  private static instance: ProductOptimizationLoopService;
  private config: ProductOptimizationLoopConfig;
  private sessionMetrics: SessionMetrics[] = [];
  private insights: OptimizationInsight[] = [];
  private proposals: OptimizationProposal[] = [];
  private lastAnalysisTime: Date | null = null;

  private constructor() {
    this.config = defaultProductOptimizationLoopConfig;
  }

  static getInstance(): ProductOptimizationLoopService {
    if (!ProductOptimizationLoopService.instance) {
      ProductOptimizationLoopService.instance = new ProductOptimizationLoopService();
    }
    return ProductOptimizationLoopService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<ProductOptimizationLoopConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Record session metrics
   */
  recordSessionMetrics(metrics: SessionMetrics): void {
    this.sessionMetrics.push(metrics);

    // Limit metrics size
    if (this.sessionMetrics.length > 1000) {
      this.sessionMetrics = this.sessionMetrics.slice(-1000);
    }

    // Check if analysis is needed
    this.checkAnalysisNeeded();
  }

  /**
   * Check if analysis is needed
   */
  private checkAnalysisNeeded(): void {
    if (this.sessionMetrics.length < this.config.minDataPoints) {
      return;
    }

    if (!this.lastAnalysisTime) {
      this.runAnalysis();
      return;
    }

    const hoursSinceLastAnalysis = (Date.now() - this.lastAnalysisTime.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastAnalysis >= this.config.analysisInterval) {
      this.runAnalysis();
    }
  }

  /**
   * Run analysis
   */
  async runAnalysis(): Promise<void> {
    this.lastAnalysisTime = new Date();

    // Detect insights
    const newInsights = await this.detectInsights();
    this.insights.push(...newInsights);

    // Generate proposals if enabled
    if (this.config.autoGenerateProposals) {
      const newProposals = await this.generateProposals(newInsights);
      this.proposals.push(...newProposals);
    }
  }

  /**
   * Detect insights
   */
  private async detectInsights(): Promise<OptimizationInsight[]> {
    const insights: OptimizationInsight[] = [];

    // Detect unused screens
    insights.push(...this.detectUnusedScreens());

    // Detect unused features
    insights.push(...this.detectUnusedFeatures());

    // Detect inefficient engines
    insights.push(...this.detectInefficientEngines());

    // Detect unnecessary costs
    insights.push(...this.detectUnnecessaryCosts());

    // Detect ignored recommendations
    insights.push(...this.detectIgnoredRecommendations());

    // Detect repetitive questions
    insights.push(...this.detectRepetitiveQuestions());

    // Detect unnecessary notifications
    insights.push(...this.detectUnnecessaryNotifications());

    return insights;
  }

  /**
   * Detect unused screens
   */
  private detectUnusedScreens(): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];
    const screenUsage: Record<string, number> = {};

    this.sessionMetrics.forEach(metrics => {
      metrics.screensVisited.forEach(screen => {
        screenUsage[screen] = (screenUsage[screen] || 0) + 1;
      });
    });

    const totalSessions = this.sessionMetrics.length;
    Object.entries(screenUsage).forEach(([screen, count]) => {
      const usageRate = count / totalSessions;
      if (usageRate < 0.1 && count > 10) {
        insights.push({
          id: `insight_unused_screen_${Date.now()}_${screen}`,
          type: "unused_screen",
          severity: usageRate < 0.05 ? "high" : "medium",
          title: `Écran peu utilisé: ${screen}`,
          description: `L'écran ${screen} n'est visité que ${(usageRate * 100).toFixed(1)}% du temps.`,
          impact: 0.6,
          effort: 0.3,
          priority: 60,
          data: { screen, usageRate },
          detectedAt: new Date(),
        });
      }
    });

    return insights;
  }

  /**
   * Detect unused features
   */
  private detectUnusedFeatures(): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];
    const featureUsage: Record<string, number> = {};

    this.sessionMetrics.forEach(metrics => {
      metrics.featuresUsed.forEach(feature => {
        featureUsage[feature] = (featureUsage[feature] || 0) + 1;
      });
    });

    const totalSessions = this.sessionMetrics.length;
    Object.entries(featureUsage).forEach(([feature, count]) => {
      const usageRate = count / totalSessions;
      if (usageRate < 0.15) {
        insights.push({
          id: `insight_unused_feature_${Date.now()}_${feature}`,
          type: "unused_feature",
          severity: usageRate < 0.05 ? "high" : "medium",
          title: `Fonctionnalité peu utilisée: ${feature}`,
          description: `La fonctionnalité ${feature} n'est utilisée que ${(usageRate * 100).toFixed(1)}% du temps.`,
          impact: 0.5,
          effort: 0.4,
          priority: 55,
          data: { feature, usageRate },
          detectedAt: new Date(),
        });
      }
    });

    return insights;
  }

  /**
   * Detect inefficient engines
   */
  private detectInefficientEngines(): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];
    const allEngineStats = adaptiveIntelligenceOrchestrator.getAllEngineStatistics();

    Object.entries(allEngineStats).forEach(([engineName, stats]) => {
      const successRate = (stats as any).overallSuccessRate || 0.8;
      const cost = (stats as any).totalCost || 0;

      if (successRate < 0.6) {
        insights.push({
          id: `insight_inefficient_engine_${Date.now()}_${engineName}`,
          type: "inefficient_engine",
          severity: successRate < 0.4 ? "high" : "medium",
          title: `Moteur inefficace: ${engineName}`,
          description: `Le moteur ${engineName} a un taux de succès de ${(successRate * 100).toFixed(1)}%.`,
          impact: 0.7,
          effort: 0.5,
          priority: 70,
          data: { engineName, successRate },
          detectedAt: new Date(),
        });
      }

      if (cost > 50) {
        insights.push({
          id: `insight_costly_engine_${Date.now()}_${engineName}`,
          type: "unnecessary_cost",
          severity: cost > 100 ? "high" : "medium",
          title: `Coût élevé: ${engineName}`,
          description: `Le moteur ${engineName} a un coût de $${cost.toFixed(2)}.`,
          impact: 0.6,
          effort: 0.4,
          priority: 65,
          data: { engineName, cost },
          detectedAt: new Date(),
        });
      }
    });

    return insights;
  }

  /**
   * Detect unnecessary costs
   */
  private detectUnnecessaryCosts(): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];
    const costStats = productAnalyticsService.getSummary();

    if (costStats.totalCost > 1000) {
      insights.push({
        id: `insight_high_cost_${Date.now()}`,
        type: "unnecessary_cost",
        severity: "high",
        title: "Coût total élevé",
        description: `Le coût total est de $${costStats.totalCost.toFixed(2)}. Envisagez d'optimiser.`,
        impact: 0.8,
        effort: 0.6,
        priority: 80,
        data: { totalCost: costStats.totalCost },
        detectedAt: new Date(),
      });
    }

    return insights;
  }

  /**
   * Detect ignored recommendations
   */
  private detectIgnoredRecommendations(): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];
    const recommendationIgnorance: Record<string, number> = {};

    this.sessionMetrics.forEach(metrics => {
      metrics.recommendationsIgnored.forEach(rec => {
        recommendationIgnorance[rec] = (recommendationIgnorance[rec] || 0) + 1;
      });
    });

    const totalSessions = this.sessionMetrics.length;
    Object.entries(recommendationIgnorance).forEach(([recommendation, count]) => {
      const ignoreRate = count / totalSessions;
      if (ignoreRate > 0.5) {
        insights.push({
          id: `insight_ignored_recommendation_${Date.now()}_${recommendation}`,
          type: "ignored_recommendation",
          severity: ignoreRate > 0.7 ? "high" : "medium",
          title: `Recommandation ignorée: ${recommendation}`,
          description: `La recommandation ${recommendation} est ignorée ${(ignoreRate * 100).toFixed(1)}% du temps.`,
          impact: 0.5,
          effort: 0.3,
          priority: 50,
          data: { recommendation, ignoreRate },
          detectedAt: new Date(),
        });
      }
    });

    return insights;
  }

  /**
   * Detect repetitive questions
   */
  private detectRepetitiveQuestions(): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];
    // Placeholder implementation
    // In a real implementation, this would analyze question patterns
    
    return insights;
  }

  /**
   * Detect unnecessary notifications
   */
  private detectUnnecessaryNotifications(): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];
    const notificationIgnorance: Record<string, number> = {};

    this.sessionMetrics.forEach(metrics => {
      metrics.notificationsIgnored.forEach(notif => {
        notificationIgnorance[notif] = (notificationIgnorance[notif] || 0) + 1;
      });
    });

    const totalSessions = this.sessionMetrics.length;
    Object.entries(notificationIgnorance).forEach(([notification, count]) => {
      const ignoreRate = count / totalSessions;
      if (ignoreRate > 0.6) {
        insights.push({
          id: `insight_unnecessary_notification_${Date.now()}_${notification}`,
          type: "unnecessary_notification",
          severity: ignoreRate > 0.8 ? "high" : "medium",
          title: `Notification inutile: ${notification}`,
          description: `La notification ${notification} est ignorée ${(ignoreRate * 100).toFixed(1)}% du temps.`,
          impact: 0.4,
          effort: 0.2,
          priority: 45,
          data: { notification, ignoreRate },
          detectedAt: new Date(),
        });
      }
    });

    return insights;
  }

  /**
   * Generate proposals
   */
  private async generateProposals(insights: OptimizationInsight[]): Promise<OptimizationProposal[]> {
    const proposals: OptimizationProposal[] = [];

    // Sort insights by priority
    const sortedInsights = insights.sort((a, b) => b.priority - a.priority);

    // Generate proposals for top insights
    const topInsights = sortedInsights.slice(0, this.config.maxProposalsPerCycle);

    topInsights.forEach(insight => {
      const proposal = this.generateProposalForInsight(insight);
      if (proposal) {
        proposals.push(proposal);
      }
    });

    return proposals;
  }

  /**
   * Generate proposal for insight
   */
  private generateProposalForInsight(insight: OptimizationInsight): OptimizationProposal | null {
    let proposal: OptimizationProposal | null = null;

    switch (insight.type) {
      case "unused_screen":
        proposal = this.generateUnusedScreenProposal(insight);
        break;
      case "unused_feature":
        proposal = this.generateUnusedFeatureProposal(insight);
        break;
      case "inefficient_engine":
        proposal = this.generateInefficientEngineProposal(insight);
        break;
      case "unnecessary_cost":
        proposal = this.generateCostOptimizationProposal(insight);
        break;
      case "ignored_recommendation":
        proposal = this.generateRecommendationOptimizationProposal(insight);
        break;
      case "unnecessary_notification":
        proposal = this.generateNotificationOptimizationProposal(insight);
        break;
    }

    return proposal;
  }

  /**
   * Generate unused screen proposal
   */
  private generateUnusedScreenProposal(insight: OptimizationInsight): OptimizationProposal {
    return {
      id: `proposal_${Date.now()}_${insight.id}`,
      insightId: insight.id,
      type: "product_improvement",
      title: `Optimiser ou supprimer l'écran ${insight.data.screen}`,
      description: insight.description,
      implementationSteps: [
        "Analyser pourquoi l'écran est peu utilisé",
        "Considérer l'intégrer dans un autre écran",
        "Ou le supprimer si non essentiel",
      ],
      expectedImpact: insight.impact,
      estimatedEffort: insight.effort,
      priority: insight.priority,
      status: "pending",
      generatedAt: new Date(),
    };
  }

  /**
   * Generate unused feature proposal
   */
  private generateUnusedFeatureProposal(insight: OptimizationInsight): OptimizationProposal {
    return {
      id: `proposal_${Date.now()}_${insight.id}`,
      insightId: insight.id,
      type: "feature_evolution",
      title: `Améliorer la fonctionnalité ${insight.data.feature}`,
      description: insight.description,
      implementationSteps: [
        "Analyser pourquoi la fonctionnalité est peu utilisée",
        "Améliorer l'UX ou la découverte",
        "Ou la supprimer si non essentielle",
      ],
      expectedImpact: insight.impact,
      estimatedEffort: insight.effort,
      priority: insight.priority,
      status: "pending",
      generatedAt: new Date(),
    };
  }

  /**
   * Generate inefficient engine proposal
   */
  private generateInefficientEngineProposal(insight: OptimizationInsight): OptimizationProposal {
    return {
      id: `proposal_${Date.now()}_${insight.id}`,
      insightId: insight.id,
      type: "rule_adjustment",
      title: `Optimiser le moteur ${insight.data.engineName}`,
      description: insight.description,
      implementationSteps: [
        "Analyser les raisons du faible taux de succès",
        "Ajuster les paramètres du moteur",
        "Considérer une alternative",
      ],
      expectedImpact: insight.impact,
      estimatedEffort: insight.effort,
      priority: insight.priority,
      status: "pending",
      generatedAt: new Date(),
    };
  }

  /**
   * Generate cost optimization proposal
   */
  private generateCostOptimizationProposal(insight: OptimizationInsight): OptimizationProposal {
    return {
      id: `proposal_${Date.now()}_${insight.id}`,
      insightId: insight.id,
      type: "product_improvement",
      title: "Optimiser les coûts",
      description: insight.description,
      implementationSteps: [
        "Analyser les coûts par moteur",
        "Optimiser l'utilisation du cache",
        "Ajuster les paramètres de coût",
      ],
      expectedImpact: insight.impact,
      estimatedEffort: insight.effort,
      priority: insight.priority,
      status: "pending",
      generatedAt: new Date(),
    };
  }

  /**
   * Generate recommendation optimization proposal
   */
  private generateRecommendationOptimizationProposal(insight: OptimizationInsight): OptimizationProposal {
    return {
      id: `proposal_${Date.now()}_${insight.id}`,
      insightId: insight.id,
      type: "journey_optimization",
      title: "Optimiser les recommandations",
      description: insight.description,
      implementationSteps: [
        "Analyser pourquoi les recommandations sont ignorées",
        "Améliorer la pertinence",
        "Ajuster le timing",
      ],
      expectedImpact: insight.impact,
      estimatedEffort: insight.effort,
      priority: insight.priority,
      status: "pending",
      generatedAt: new Date(),
    };
  }

  /**
   * Generate notification optimization proposal
   */
  private generateNotificationOptimizationProposal(insight: OptimizationInsight): OptimizationProposal {
    return {
      id: `proposal_${Date.now()}_${insight.id}`,
      insightId: insight.id,
      type: "rule_adjustment",
      title: "Optimiser les notifications",
      description: insight.description,
      implementationSteps: [
        "Analyser pourquoi les notifications sont ignorées",
        "Ajuster le timing et le contenu",
        "Réduire la fréquence",
      ],
      expectedImpact: insight.impact,
      estimatedEffort: insight.effort,
      priority: insight.priority,
      status: "pending",
      generatedAt: new Date(),
    };
  }

  /**
   * Get insights
   */
  getInsights(): OptimizationInsight[] {
    return this.insights;
  }

  /**
   * Get proposals
   */
  getProposals(): OptimizationProposal[] {
    return this.proposals;
  }

  /**
   * Update proposal status
   */
  updateProposalStatus(proposalId: string, status: "pending" | "in_progress" | "implemented" | "rejected"): void {
    const proposal = this.proposals.find(p => p.id === proposalId);
    if (proposal) {
      proposal.status = status;
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalSessions: number;
    totalInsights: number;
    totalProposals: number;
    insightDistribution: Record<string, number>;
    proposalStatusDistribution: Record<string, number>;
  } {
    const totalSessions = this.sessionMetrics.length;
    const totalInsights = this.insights.length;
    const totalProposals = this.proposals.length;

    const insightDistribution: Record<string, number> = {};
    this.insights.forEach(insight => {
      insightDistribution[insight.type] = (insightDistribution[insight.type] || 0) + 1;
    });

    const proposalStatusDistribution: Record<string, number> = {};
    this.proposals.forEach(proposal => {
      proposalStatusDistribution[proposal.status] = (proposalStatusDistribution[proposal.status] || 0) + 1;
    });

    return {
      totalSessions,
      totalInsights,
      totalProposals,
      insightDistribution,
      proposalStatusDistribution,
    };
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.sessionMetrics = [];
    this.insights = [];
    this.proposals = [];
    this.lastAnalysisTime = null;
  }
}

export const productOptimizationLoopService = ProductOptimizationLoopService.getInstance();
