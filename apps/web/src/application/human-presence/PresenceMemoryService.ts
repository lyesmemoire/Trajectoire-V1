/**
 * Presence Memory Service
 * Donne l'impression que le recruteur se souvient naturellement
 * Références naturelles, jamais artificielles ou systématiques
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

// ============================================================================
// MEMORY REFERENCE
// ============================================================================

interface MemoryReference {
  type: "recent" | "earlier" | "connection" | "link";
  content: string;
  timestamp: Date;
  naturalness: number; // 0-1, score de naturalité
}

// ============================================================================
// PRESENCE MEMORY SERVICE CLASS
// ============================================================================

export class PresenceMemoryService {
  private static instance: PresenceMemoryService;
  private conversationHistory: Map<string, string[]> = new Map();
  private topicHistory: Map<string, string[]> = new Map();
  private referenceCount: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): PresenceMemoryService {
    if (!PresenceMemoryService.instance) {
      PresenceMemoryService.instance = new PresenceMemoryService();
    }
    return PresenceMemoryService.instance;
  }

  /**
   * Modify with natural memory references
   * Donne l'impression que le recruteur se souvient naturellement
   */
  async modifyMemory(context: PresenceContext): Promise<{
    modified: string;
    continuityScore: number;
    references: MemoryReference[];
  }> {
    // Étape 1 : Stocker le contexte actuel dans l'historique
    this.storeConversationHistory(context);

    // Étape 2 : Générer des références naturelles
    const references = this.generateNaturalReferences(context);

    // Étape 3 : Appliquer les références de manière naturelle
    const modified = this.applyNaturalReferences(context.originalDecision, references, context);

    return {
      modified,
      continuityScore: this.calculateContinuityScore(references),
      references,
    };
  }

  /**
   * Store conversation history
   */
  private storeConversationHistory(context: PresenceContext): void {
    const history = this.conversationHistory.get(context.userId) || [];
    history.push(context.originalDecision);

    // Garder seulement les 10 derniers messages
    if (history.length > 10) {
      history.shift();
    }

    this.conversationHistory.set(context.userId, history);

    // Extraire et stocker les topics
    const topics = this.extractTopics(context.originalDecision);
    const topicHistory = this.topicHistory.get(context.userId) || [];
    topics.forEach(topic => {
      if (!topicHistory.includes(topic)) {
        topicHistory.push(topic);
      }
    });
    this.topicHistory.set(context.userId, topicHistory);
  }

  /**
   * Extract topics from text
   */
  private extractTopics(text: string): string[] {
    // Placeholder pour l'extraction réelle de topics
    // Dans une implémentation réelle, cela utiliserait NLP
    const words = text.split(" ");
    return words.filter(word => word.length > 5).slice(0, 3);
  }

  /**
   * Generate natural references
   * Références naturelles, jamais artificielles ou systématiques
   */
  private generateNaturalReferences(context: PresenceContext): MemoryReference[] {
    const references: MemoryReference[] = [];
    const history = this.conversationHistory.get(context.userId) || [];
    const referenceCount = this.referenceCount.get(context.userId) || 0;

    // Ne pas faire de références systématiques
    // Seulement 30% de chance de faire une référence
    if (Math.random() > 0.7 || referenceCount > 2) {
      return references;
    }

    // Références récentes (tout à l'heure)
    if (history.length > 1 && Math.random() > 0.6) {
      const recentReference = this.createRecentReference(history);
      if (recentReference) {
        references.push(recentReference);
      }
    }

    // Références antérieures (il y a quelques minutes)
    if (history.length > 3 && Math.random() > 0.8) {
      const earlierReference = this.createEarlierReference(history);
      if (earlierReference) {
        references.push(earlierReference);
      }
    }

    // Références de connexion (faire le lien)
    if (history.length > 2 && Math.random() > 0.85) {
      const connectionReference = this.createConnectionReference(history);
      if (connectionReference) {
        references.push(connectionReference);
      }
    }

    // Incrémenter le compteur de références
    this.referenceCount.set(context.userId, referenceCount + 1);

    // Réinitialiser le compteur après 3 références
    if (referenceCount + 1 > 3) {
      this.referenceCount.set(context.userId, 0);
    }

    return references;
  }

  /**
   * Create recent reference
   * "Tout à l'heure tu disais..."
   */
  private createRecentReference(history: string[]): MemoryReference | null {
    const recentMessage = history[history.length - 2];
    if (!recentMessage) return null;

    const templates = [
      "Tout à l'heure tu disais...",
      "Tu as évoqué tout à l'heure...",
      "Comme on disait tout à l'heure...",
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const excerpt = this.extractExcerpt(recentMessage);

    return {
      type: "recent",
      content: `${template} ${excerpt}`,
      timestamp: new Date(),
      naturalness: 0.85,
    };
  }

  /**
   * Create earlier reference
   * "Il y a quelques minutes tu parlais de..."
   */
  private createEarlierReference(history: string[]): MemoryReference | null {
    const earlierMessage = history[Math.floor(Math.random() * (history.length - 2))];
    if (!earlierMessage) return null;

    const templates = [
      "Il y a quelques minutes tu parlais de...",
      "Plus tôt tu as mentionné...",
      "Au début tu disais...",
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const excerpt = this.extractExcerpt(earlierMessage);

    return {
      type: "earlier",
      content: `${template} ${excerpt}`,
      timestamp: new Date(),
      naturalness: 0.8,
    };
  }

  /**
   * Create connection reference
   * "Je fais le lien avec ce que tu racontais."
   */
  private createConnectionReference(history: string[]): MemoryReference | null {
    const previousMessage = history[Math.floor(Math.random() * history.length)];
    if (!previousMessage) return null;

    const templates = [
      "Je fais le lien avec ce que tu racontais.",
      "Ça me fait penser à ce que tu disais.",
      "Je reviens sur un point que tu as évoqué.",
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];

    return {
      type: "connection",
      content: template,
      timestamp: new Date(),
      naturalness: 0.9,
    };
  }

  /**
   * Extract excerpt from message
   */
  private extractExcerpt(message: string): string {
    const words = message.split(" ");
    if (words.length <= 5) return message;
    return words.slice(0, 5).join(" ") + "...";
  }

  /**
   * Apply natural references
   * Applique les références de manière naturelle, pas artificielle
   */
  private applyNaturalReferences(
    original: string,
    references: MemoryReference[],
    context: PresenceContext
  ): string {
    if (references.length === 0) {
      return original;
    }

    // Choisir une référence aléatoire (jamais systématique)
    const reference = references[Math.floor(Math.random() * references.length)];

    // Intégrer la référence naturellement
    // Pas toujours au début, parfois au milieu ou à la fin
    const position = Math.random();

    if (position < 0.4) {
      // Au début
      return `${reference.content} ${original}`;
    } else if (position < 0.7) {
      // Au milieu
      const sentences = original.split(/[.!?]/);
      if (sentences.length > 1) {
        const midPoint = Math.floor(sentences.length / 2);
        sentences.splice(midPoint, 0, reference.content);
        return sentences.join(". ");
      }
      return `${original} ${reference.content}`;
    } else {
      // À la fin
      return `${original} ${reference.content}`;
    }
  }

  /**
   * Calculate continuity score
   */
  private calculateContinuityScore(references: MemoryReference[]): number {
    if (references.length === 0) return 0.7;

    const averageNaturalness = references.reduce(
      (sum, ref) => sum + ref.naturalness,
      0
    ) / references.length;

    return averageNaturalness;
  }

  /**
   * Get conversation history
   */
  getConversationHistory(userId: string): string[] {
    return this.conversationHistory.get(userId) || [];
  }

  /**
   * Get topic history
   */
  getTopicHistory(userId: string): string[] {
    return this.topicHistory.get(userId) || [];
  }

  /**
   * Clear user history
   */
  clearUserHistory(userId: string): void {
    this.conversationHistory.delete(userId);
    this.topicHistory.delete(userId);
    this.referenceCount.delete(userId);
  }

  /**
   * Clear all history
   */
  clearAllHistory(): void {
    this.conversationHistory.clear();
    this.topicHistory.clear();
    this.referenceCount.clear();
  }
}

export const presenceMemoryService = PresenceMemoryService.getInstance();
