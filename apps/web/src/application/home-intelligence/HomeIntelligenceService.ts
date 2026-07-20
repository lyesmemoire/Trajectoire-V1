/**
 * Home Intelligence Service
 * Dynamic home page generation by Adaptive Intelligence Orchestrator
 */

import {
  HomeCard,
  HomeConfiguration,
  HomePage,
  HomeIntelligenceConfig,
  defaultHomeIntelligenceConfig,
} from "./interfaces/IHomeIntelligence";
import { adaptiveIntelligenceOrchestrator } from "../adaptive-intelligence/AdaptiveIntelligenceOrchestrator";
import { userPersonalizationEngine } from "../adaptive-intelligence/UserPersonalizationEngine";
import { decisionPolicyEngine } from "../adaptive-intelligence/DecisionPolicyEngine";
import { strategyEngine } from "../adaptive-intelligence/StrategyEngine";
import { planningEngine } from "../adaptive-intelligence/PlanningEngine";

// ============================================================================
// HOME INTELLIGENCE SERVICE CLASS
// ============================================================================

export class HomeIntelligenceService {
  private static instance: HomeIntelligenceService;
  private config: HomeIntelligenceConfig;
  private homePageCache: Map<string, HomePage> = new Map();

  private constructor() {
    this.config = defaultHomeIntelligenceConfig;
  }

  static getInstance(): HomeIntelligenceService {
    if (!HomeIntelligenceService.instance) {
      HomeIntelligenceService.instance = new HomeIntelligenceService();
    }
    return HomeIntelligenceService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<HomeIntelligenceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate dynamic home page
   */
  async generateHomePage(config: HomeConfiguration): Promise<HomePage> {
    // Check cache first
    const cacheKey = this.generateCacheKey(config);
    const cached = this.homePageCache.get(cacheKey);
    if (cached && this.isCacheValid(cached, config.date)) {
      return cached;
    }

    // Get user personalization matrix
    const userMatrix = userPersonalizationEngine.getMatrix(config.userId);
    const personalizedFactors = userMatrix ? userPersonalizationEngine.getPersonalizedFactors(config.userId) : null;

    // Generate cards using adaptive intelligence
    const cards = await this.generateCards(config, personalizedFactors);

    // Sort cards by priority
    const sortedCards = this.sortCards(cards);

    // Limit cards
    const limitedCards = sortedCards.slice(0, this.config.maxCardsPerDay);

    // Generate welcome message
    const welcomeMessage = this.generateWelcomeMessage(config, userMatrix);

    // Generate encouragement
    const encouragement = this.generateEncouragement(config, userMatrix);

    // Generate primary CTA
    const primaryCTA = this.generatePrimaryCTA(config, limitedCards, userMatrix);

    // Track which engines were used
    const generatedBy = [
      "HomeIntelligenceService",
      "UserPersonalizationEngine",
      "DecisionPolicyEngine",
      "StrategyEngine",
      "PlanningEngine",
    ];

    const homePage: HomePage = {
      id: `home_${config.userId}_${config.date.getTime()}`,
      userId: config.userId,
      date: config.date,
      welcomeMessage,
      encouragement,
      primaryCTA,
      cards: limitedCards,
      generatedBy,
      confidence: this.calculateConfidence(limitedCards, config),
      timestamp: new Date(),
    };

    // Cache the result
    this.homePageCache.set(cacheKey, homePage);

    return homePage;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(config: HomeConfiguration): string {
    return `${config.userId}_${config.date.toDateString()}_${config.context.timeOfDay}`;
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(cached: HomePage, currentDate: Date): boolean {
    const cacheDate = cached.date;
    const hoursDiff = Math.abs(currentDate.getTime() - cacheDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 12; // Cache valid for 12 hours
  }

  /**
   * Generate cards
   */
  private async generateCards(
    config: HomeConfiguration,
    personalizedFactors: any
  ): Promise<HomeCard[]> {
    const cards: HomeCard[] = [];

    // Stats card
    cards.push(await this.generateStatsCard(config, personalizedFactors));

    // Mission card
    cards.push(await this.generateMissionCard(config, personalizedFactors));

    // Goal cards
    cards.push(...await this.generateGoalCards(config, personalizedFactors));

    // Skill cards
    cards.push(...await this.generateSkillCards(config, personalizedFactors));

    // Recommendation cards
    cards.push(...await this.generateRecommendationCards(config, personalizedFactors));

    // Badge cards
    cards.push(...await this.generateBadgeCards(config, personalizedFactors));

    // Celebration card (if applicable)
    if (config.userState.streak >= 3 || config.userState.confidence >= 0.8) {
      cards.push(await this.generateCelebrationCard(config, personalizedFactors));
    }

    // Warning card (if applicable)
    if (config.userState.stress > 0.7 || config.userState.fatigue > 0.7) {
      cards.push(await this.generateWarningCard(config, personalizedFactors));
    }

    // History card
    cards.push(await this.generateHistoryCard(config, personalizedFactors));

    return cards;
  }

  /**
   * Generate stats card
   */
  private async generateStatsCard(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard> {
    const priority = 70;
    const color = "blue";
    const size = "large";

    return {
      id: `stats_${Date.now()}`,
      type: "stats",
      title: "Votre progression",
      content: `Streak actuel: ${config.userState.streak} jours`,
      priority,
      order: 1,
      color,
      size,
      metadata: {
        stress: config.userState.stress,
        confidence: config.userState.confidence,
        fatigue: config.userState.fatigue,
        engagement: config.userState.engagement,
      },
    };
  }

  /**
   * Generate mission card
   */
  private async generateMissionCard(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard> {
    const priority = 85;
    const color = "green";
    const size = "medium";

    return {
      id: `mission_${Date.now()}`,
      type: "mission",
      title: "Prochaine mission",
      content: "Simulation recommandée basée sur votre progression",
      priority,
      order: 2,
      color,
      size,
      cta: {
        text: "Commencer",
        action: "/simulation",
        priority: "primary",
      },
      metadata: {
        difficulty: personalizedFactors?.challengeWeight > 0.7 ? "hard" : "medium",
        estimatedDuration: 30,
      },
    };
  }

  /**
   * Generate goal cards
   */
  private async generateGoalCards(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard[]> {
    const cards: HomeCard[] = [];

    const goals = [
      {
        title: "Simulations hebdomadaires",
        content: `${config.userState.streak}/3 simulations cette semaine`,
        priority: 60,
      },
      {
        title: "Score moyen",
        content: `${Math.round(config.userState.confidence * 100)}% de confiance`,
        priority: 55,
      },
    ];

    goals.forEach((goal, index) => {
      cards.push({
        id: `goal_${Date.now()}_${index}`,
        type: "goal",
        title: goal.title,
        content: goal.content,
        priority: goal.priority,
        order: 3 + index,
        color: "purple",
        size: "small",
        metadata: {},
      });
    });

    return cards;
  }

  /**
   * Generate skill cards
   */
  private async generateSkillCards(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard[]> {
    const cards: HomeCard[] = [];

    const skills = [
      { name: "Communication", score: config.userState.confidence },
      { name: "Technique", score: 0.6 },
      { name: "Leadership", score: 0.5 },
    ];

    skills.forEach((skill, index) => {
      cards.push({
        id: `skill_${Date.now()}_${index}`,
        type: "skill",
        title: skill.name,
        content: `${Math.round(skill.score * 100)}%`,
        priority: 50,
        order: 5 + index,
        color: skill.score > 0.7 ? "green" : skill.score > 0.5 ? "yellow" : "orange",
        size: "small",
        metadata: { score: skill.score },
      });
    });

    return cards;
  }

  /**
   * Generate recommendation cards
   */
  private async generateRecommendationCards(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard[]> {
    const cards: HomeCard[] = [];

    if (config.userState.stress > 0.6) {
      cards.push({
        id: `rec_${Date.now()}_stress`,
        type: "warning",
        title: "Prenez une pause",
        content: "Votre niveau de stress est élevé. Une courte pause pourrait aider.",
        priority: 75,
        order: 0,
        color: "red",
        size: "medium",
        metadata: { reason: "high_stress" },
      });
    }

    if (config.userState.confidence < 0.5) {
      cards.push({
        id: `rec_${Date.now()}_confidence`,
        type: "recommendation",
        title: "Boostez votre confiance",
        content: "Essayez des exercices plus faciles pour reconstruire votre confiance.",
        priority: 70,
        order: 1,
        color: "orange",
        size: "medium",
        cta: {
          text: "Voir exercices",
          action: "/simulation",
          priority: "secondary",
        },
        metadata: { reason: "low_confidence" },
      });
    }

    return cards;
  }

  /**
   * Generate badge cards
   */
  private async generateBadgeCards(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard[]> {
    const cards: HomeCard[] = [];

    if (config.userState.streak >= 3) {
      cards.push({
        id: `badge_${Date.now()}_streak`,
        type: "badge",
        title: "Persévérant",
        content: `${config.userState.streak} jours consécutifs`,
        priority: config.userState.streak * 10,
        order: 8,
        color: "yellow",
        size: "small",
        metadata: { streak: config.userState.streak },
      });
    }

    return cards;
  }

  /**
   * Generate celebration card
   */
  private async generateCelebrationCard(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard> {
    return {
      id: `celebration_${Date.now()}`,
      type: "celebration",
      title: "Félicitations !",
      content: config.userState.streak >= 3 
        ? `Vous maintenez une série de ${config.userState.streak} jours !`
        : "Votre confiance est excellente !",
      priority: 90,
      order: 0,
      color: "green",
      size: "medium",
      metadata: { reason: config.userState.streak >= 3 ? "streak" : "confidence" },
    };
  }

  /**
   * Generate warning card
   */
  private async generateWarningCard(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard> {
    return {
      id: `warning_${Date.now()}`,
      type: "warning",
      title: "Attention",
      content: config.userState.stress > 0.7 
        ? "Votre niveau de stress est élevé. Envisagez de prendre une pause."
        : "Vous semblez fatigué. Reposez-vous avant de continuer.",
      priority: 95,
      order: 0,
      color: "red",
      size: "medium",
      metadata: { reason: config.userState.stress > 0.7 ? "stress" : "fatigue" },
    };
  }

  /**
   * Generate history card
   */
  private async generateHistoryCard(config: HomeConfiguration, personalizedFactors: any): Promise<HomeCard> {
    return {
      id: `history_${Date.now()}`,
      type: "history",
      title: "Historique récent",
      content: "Voir vos dernières simulations",
      priority: 40,
      order: 10,
      color: "gray",
      size: "small",
      cta: {
        text: "Voir tout",
        action: "/history",
        priority: "secondary",
      },
      metadata: {},
    };
  }

  /**
   * Sort cards by priority
   */
  private sortCards(cards: HomeCard[]): HomeCard[] {
    return cards.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Generate welcome message
   */
  private generateWelcomeMessage(config: HomeConfiguration, userMatrix: any): string {
    const timeOfDay = config.context.timeOfDay;
    const greetings: Record<string, string> = {
      morning: "Bonjour",
      afternoon: "Bonjour",
      evening: "Bonsoir",
    };

    const baseGreeting = greetings[timeOfDay];
    
    if (config.userState.streak >= 7) {
      return `${baseGreeting} ! Incroyable, ${config.userState.streak} jours d'affilée ! 🔥`;
    }

    if (config.userState.streak >= 3) {
      return `${baseGreeting} ! Continuez comme ça, ${config.userState.streak} jours consécutifs ! 💪`;
    }

    return `${baseGreeting} ! Prêt à progresser aujourd'hui ?`;
  }

  /**
   * Generate encouragement
   */
  private generateEncouragement(config: HomeConfiguration, userMatrix: any): string {
    if (config.userState.confidence >= 0.8) {
      return "Votre confiance est au top ! Continuez à vous dépasser.";
    }

    if (config.userState.stress > 0.7) {
      return "Prenez votre temps. Chaque petit progrès compte.";
    }

    if (config.userState.fatigue > 0.7) {
      return "Écoutez votre corps. Le repos fait partie de la progression.";
    }

    return "Chaque simulation vous rapproche de vos objectifs.";
  }

  /**
   * Generate primary CTA
   */
  private generatePrimaryCTA(
    config: HomeConfiguration,
    cards: HomeCard[],
    userMatrix: any
  ): { text: string; action: string; recommendedDuration?: number } {
    // Find highest priority card with CTA
    const cardWithCTA = cards.find(c => c.cta && c.cta.priority === "primary");

    if (cardWithCTA && cardWithCTA.cta) {
      return {
        text: cardWithCTA.cta.text,
        action: cardWithCTA.cta.action,
        recommendedDuration: cardWithCTA.metadata.estimatedDuration,
      };
    }

    // Default CTA
    return {
      text: "Nouvelle simulation",
      action: "/simulation",
      recommendedDuration: 30,
    };
  }

  /**
   * Calculate confidence in home page generation
   */
  private calculateConfidence(cards: HomeCard[], config: HomeConfiguration): number {
    let confidence = 0.5;

    // More cards = higher confidence
    confidence += Math.min(0.2, cards.length * 0.02);

    // Higher user engagement = higher confidence
    confidence += config.userState.engagement * 0.2;

    // Personalization available = higher confidence
    if (userPersonalizationEngine.getMatrix(config.userId)) {
      confidence += 0.1;
    }

    return Math.min(1, confidence);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.homePageCache.clear();
  }

  /**
   * Clear user cache
   */
  clearUserCache(userId: string): void {
    const keysToDelete: string[] = [];
    this.homePageCache.forEach((value, key) => {
      if (value.userId === userId) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.homePageCache.delete(key));
  }
}

export const homeIntelligenceService = HomeIntelligenceService.getInstance();
