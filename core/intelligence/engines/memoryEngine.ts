import { MemoryEvent, CandidateProfile, ProgressionRecord } from "../types";

/**
 * Memory Engine
 * 
 * Responsibilities:
 * - Store and retrieve memory events
 * - Detect patterns across time
 * - Remember recurring errors and successes
 * - Provide contextual memory for recommendations
 * - Track long-term progress and regressions
 */

export class MemoryEngine {
  private static memory: MemoryEvent[] = [];

  /**
   * Add a memory event
   */
  static addMemory(event: MemoryEvent): void {
    this.memory.push(event);
    
    // Keep only last 1000 events to prevent memory bloat
    if (this.memory.length > 1000) {
      this.memory = this.memory.slice(-1000);
    }
  }

  /**
   * Get all memory events
   */
  static getMemory(): MemoryEvent[] {
    return [...this.memory];
  }

  /**
   * Get memory events by type
   */
  static getMemoryByType(type: MemoryEvent["type"]): MemoryEvent[] {
    return this.memory.filter(event => event.type === type);
  }

  /**
   * Get memory events related to a specific topic
   */
  static getMemoryRelatedTo(topic: string): MemoryEvent[] {
    return this.memory.filter(event => 
      event.relatedTo?.includes(topic) || 
      event.content.toLowerCase().includes(topic.toLowerCase())
    );
  }

  /**
   * Get recent memory (last N days)
   */
  static getRecentMemory(days: number = 7): MemoryEvent[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return this.memory.filter(event => event.timestamp >= cutoff);
  }

  /**
   * Detect if a pattern is recurring
   */
  static detectRecurringPattern(pattern: string, windowDays: number = 30): {
    isRecurring: boolean;
    frequency: number;
    firstOccurrence: Date;
    lastOccurrence: Date;
    severity: "low" | "medium" | "high";
  } {
    const relatedEvents = this.getMemoryRelatedTo(pattern);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - windowDays);
    
    const recentEvents = relatedEvents.filter(event => event.timestamp >= cutoff);
    
    if (recentEvents.length < 2) {
      return {
        isRecurring: false,
        frequency: 0,
        firstOccurrence: new Date(),
        lastOccurrence: new Date(),
        severity: "low",
      };
    }

    const firstOccurrence = recentEvents[0]?.timestamp ?? new Date();
    const lastOccurrence = recentEvents[recentEvents.length - 1]?.timestamp ?? new Date();
    const frequency = recentEvents.length;
    
    let severity: "low" | "medium" | "high" = "low";
    if (frequency >= 5) severity = "high";
    else if (frequency >= 3) severity = "medium";

    return {
      isRecurring: true,
      frequency,
      firstOccurrence,
      lastOccurrence,
      severity,
    };
  }

  /**
   * Generate contextual memory insights
   */
  static generateMemoryInsights(_profile: CandidateProfile): string[] {
    const insights: string[] = [];
    const recentMemory = this.getRecentMemory(14); // Last 2 weeks

    // Check for recurring errors
    const errorMemories = recentMemory.filter(m => m.type === "error");
    const errorPatterns = new Map<string, number>();
    
    errorMemories.forEach(memory => {
      const pattern = memory.content;
      errorPatterns.set(pattern, (errorPatterns.get(pattern) || 0) + 1);
    });

    errorPatterns.forEach((frequency, pattern) => {
      if (frequency >= 2) {
        insights.push(`Vous avez fait cette erreur ${frequency} fois récemment : ${pattern}`);
      }
    });

    // Check for progress patterns
    const progressMemories = recentMemory.filter(m => m.type === "progression");
    if (progressMemories.length >= 3) {
      const positiveProgress = progressMemories.filter(m => m.content.includes("amélioré") || m.content.includes("progressé")).length;
      if (positiveProgress >= progressMemories.length * 0.7) {
        insights.push("Vous êtes sur une trajectoire d'amélioration constante");
      }
    }

    // Check for skill-specific patterns
    const skillMemories = this.getMemoryRelatedTo("compétence");
    if (skillMemories.length >= 2) {
      const lastSkillMemory = skillMemories[skillMemories.length - 1];
      if (lastSkillMemory && lastSkillMemory.confidence >= 80) {
        insights.push("Votre progression sur les compétences est solide et consistante");
      }
    }

    return insights;
  }

  /**
   * Remember an error
   */
  static rememberError(error: string, context?: string[]): void {
    this.addMemory({
      id: `mem-error-${Date.now()}`,
      type: "error",
      content: error,
      timestamp: new Date(),
      relatedTo: context,
      confidence: 80,
    });
  }

  /**
   * Remember a success
   */
  static rememberSuccess(success: string, context?: string[]): void {
    this.addMemory({
      id: `mem-success-${Date.now()}`,
      type: "success",
      content: success,
      timestamp: new Date(),
      relatedTo: context,
      confidence: 90,
    });
  }

  /**
   * Remember a progression
   */
  static rememberProgression(metric: string, from: number, to: number, context?: string[]): void {
    const change = to - from;
    const trend = change > 0 ? "amélioré" : change < 0 ? "régressé" : "stagné";
    
    this.addMemory({
      id: `mem-progression-${Date.now()}`,
      type: "progression",
      content: `${metric} : ${trend} de ${from} à ${to}`,
      timestamp: new Date(),
      relatedTo: context,
      confidence: 85,
    });
  }

  /**
   * Remember a pattern
   */
  static rememberPattern(pattern: string, confidence: number, context?: string[]): void {
    this.addMemory({
      id: `mem-pattern-${Date.now()}`,
      type: "pattern",
      content: pattern,
      timestamp: new Date(),
      relatedTo: context,
      confidence,
    });
  }

  /**
   * Remember an insight
   */
  static rememberInsight(insight: string, confidence: number, context?: string[]): void {
    this.addMemory({
      id: `mem-insight-${Date.now()}`,
      type: "insight",
      content: insight,
      timestamp: new Date(),
      relatedTo: context,
      confidence,
    });
  }

  /**
   * Check if a specific error has been seen before
   */
  static hasSeenErrorBefore(error: string, days: number = 30): boolean {
    const related = this.getMemoryRelatedTo(error);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return related.some(event => 
      event.type === "error" && 
      event.timestamp >= cutoff &&
      event.confidence >= 70
    );
  }

  /**
   * Get memory about a specific skill
   */
  static getSkillMemory(skillName: string): {
    progression: ProgressionRecord[];
    errors: string[];
    successes: string[];
    lastAssessment?: Date;
  } {
    const related = this.getMemoryRelatedTo(skillName);
    
    const progression = related
      .filter(m => m.type === "progression")
      .map(m => ({
        date: m.timestamp,
        metric: skillName,
        previousValue: 0, // Would need to parse from content
        newValue: 0, // Would need to parse from content
        change: 0, // Would need to parse from content
        trend: "stagnation" as const,
      }));

    const errors = related
      .filter(m => m.type === "error")
      .map(m => m.content);

    const successes = related
      .filter(m => m.type === "success")
      .map(m => m.content);

    const lastAssessment = related.length > 0 
      ? related[related.length - 1]?.timestamp 
      : undefined;

    return {
      progression,
      errors,
      successes,
      lastAssessment,
    };
  }

  /**
   * Generate memory-based recommendations
   */
  static generateMemoryBasedRecommendations(_profile: CandidateProfile): string[] {
    const recommendations: string[] = [];
    const recentMemory = this.getRecentMemory(21); // Last 3 weeks

    // Check for errors that haven't been resolved
    const errorMemories = recentMemory.filter(m => m.type === "error");
    const errorPatterns = new Map<string, number>();
    
    errorMemories.forEach(memory => {
      errorPatterns.set(memory.content, (errorPatterns.get(memory.content) || 0) + 1);
    });

    errorPatterns.forEach((frequency, error) => {
      if (frequency >= 3) {
        recommendations.push(`Cette erreur se répète (${frequency} fois) : ${error}. Considérez une approche différente.`);
      }
    });

    // Check for skills that are regressing
    const progressionMemories = recentMemory.filter(m => m.type === "progression");
    const regressingSkills = new Set<string>();
    
    progressionMemories.forEach(memory => {
      if (memory.content.includes("régressé")) {
        const skill = memory.relatedTo?.[0] || "compétence";
        regressingSkills.add(skill);
      }
    });

    regressingSkills.forEach(skill => {
      recommendations.push(`Attention : ${skill} est en régression. Revoyez votre approche.`);
    });

    // Check for successful patterns to reinforce
    const successMemories = recentMemory.filter(m => m.type === "success");
    const successPatterns = new Map<string, number>();
    
    successMemories.forEach(memory => {
      successPatterns.set(memory.content, (successPatterns.get(memory.content) || 0) + 1);
    });

    successPatterns.forEach((frequency, success) => {
      if (frequency >= 2) {
        recommendations.push(`Cette approche fonctionne bien (${frequency} succès) : ${success}. Continuez dans cette direction.`);
      }
    });

    return recommendations;
  }

  /**
   * Clear old memory (older than specified days)
   */
  static clearOldMemory(days: number = 90): void {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    this.memory = this.memory.filter(event => event.timestamp >= cutoff);
  }

  /**
   * Get memory statistics
   */
  static getMemoryStats(): {
    totalEvents: number;
    byType: Record<string, number>;
    recentEvents: number;
    oldestEvent?: Date;
    newestEvent?: Date;
  } {
    const byType: Record<string, number> = {};
    
    this.memory.forEach(event => {
      byType[event.type] = (byType[event.type] || 0) + 1;
    });

    const recentEvents = this.getRecentMemory(7).length;
    const oldestEvent = this.memory.length > 0 ? this.memory[0]?.timestamp : undefined;
    const newestEvent = this.memory.length > 0 ? this.memory[this.memory.length - 1]?.timestamp : undefined;

    return {
      totalEvents: this.memory.length,
      byType,
      recentEvents,
      oldestEvent,
      newestEvent,
    };
  }

  /**
   * Export memory for backup
   */
  static exportMemory(): MemoryEvent[] {
    return [...this.memory];
  }

  /**
   * Import memory from backup
   */
  static importMemory(events: MemoryEvent[]): void {
    this.memory = [...events];
  }
}
