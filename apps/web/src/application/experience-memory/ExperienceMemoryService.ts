/**
 * Experience Memory Service
 * Product memory
 */

import {
  UserPreference,
  SessionMemory,
  ExperienceMemory,
  ExperienceMemoryConfig,
  defaultExperienceMemoryConfig,
} from "./interfaces/IExperienceMemory";

// ============================================================================
// EXPERIENCE MEMORY SERVICE CLASS
// ============================================================================

export class ExperienceMemoryService {
  private static instance: ExperienceMemoryService;
  private config: ExperienceMemoryConfig;
  private memories: Map<string, ExperienceMemory> = new Map();

  private constructor() {
    this.config = defaultExperienceMemoryConfig;
  }

  static getInstance(): ExperienceMemoryService {
    if (!ExperienceMemoryService.instance) {
      ExperienceMemoryService.instance = new ExperienceMemoryService();
    }
    return ExperienceMemoryService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<ExperienceMemoryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get or create user memory
   */
  getOrCreateMemory(userId: string): ExperienceMemory {
    let memory = this.memories.get(userId);

    if (!memory) {
      memory = {
        userId,
        preferences: this.createDefaultPreferences(userId),
        sessionHistory: [],
        totalSessions: 0,
        totalDuration: 0,
        averageSatisfaction: 0,
        averageStress: 0,
        averageConfidence: 0,
        lastActivity: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.memories.set(userId, memory);
    }

    return memory;
  }

  /**
   * Create default preferences
   */
  private createDefaultPreferences(userId: string): UserPreference {
    return {
      userId,
      preferredTimeOfDay: "flexible",
      preferredDayOfWeek: 1, // Monday
      preferredDuration: 30,
      preferredDifficulty: "medium",
      preferredExerciseTypes: [],
      avoidedExerciseTypes: [],
      preferredPersonalities: [],
      avoidedPersonalities: [],
      preferredCompanies: [],
      feedbackStyle: "direct",
      learningStyle: "mixed",
    };
  }

  /**
   * Record session
   */
  recordSession(sessionMemory: SessionMemory): void {
    const memory = this.getOrCreateMemory(sessionMemory.userId);

    // Add to history
    memory.sessionHistory.push(sessionMemory);

    // Limit history size
    if (memory.sessionHistory.length > this.config.maxHistorySize) {
      memory.sessionHistory = memory.sessionHistory.slice(-this.config.maxHistorySize);
    }

    // Remove old sessions beyond retention period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.historyRetentionDays);
    memory.sessionHistory = memory.sessionHistory.filter(s => s.timestamp >= cutoffDate);

    // Update totals
    memory.totalSessions = memory.sessionHistory.length;
    memory.totalDuration = memory.sessionHistory.reduce((sum, s) => sum + s.duration, 0);
    memory.averageSatisfaction = memory.sessionHistory.reduce((sum, s) => sum + s.satisfaction, 0) / memory.sessionHistory.length;
    memory.averageStress = memory.sessionHistory.reduce((sum, s) => sum + s.stressLevel, 0) / memory.sessionHistory.length;
    memory.averageConfidence = memory.sessionHistory.reduce((sum, s) => sum + s.confidenceLevel, 0) / memory.sessionHistory.length;
    memory.lastActivity = sessionMemory.timestamp;
    memory.updatedAt = new Date();

    // Learn from session
    this.learnFromSession(memory, sessionMemory);

    this.memories.set(sessionMemory.userId, memory);
  }

  /**
   * Learn from session
   */
  private learnFromSession(memory: ExperienceMemory, session: SessionMemory): void {
    if (memory.totalSessions < this.config.minSessionsForLearning) {
      return;
    }

    // Update preferred time of day
    const sessionHour = session.timestamp.getHours();
    if (sessionHour >= 6 && sessionHour < 12) {
      this.updatePreference(memory, "preferredTimeOfDay", "morning");
    } else if (sessionHour >= 12 && sessionHour < 18) {
      this.updatePreference(memory, "preferredTimeOfDay", "afternoon");
    } else {
      this.updatePreference(memory, "preferredTimeOfDay", "evening");
    }

    // Update preferred duration
    this.updatePreference(memory, "preferredDuration", session.duration);

    // Update preferred difficulty based on satisfaction
    if (session.satisfaction > 0.7) {
      this.updatePreference(memory, "preferredDifficulty", session.difficulty);
    }

    // Update preferred personality based on satisfaction
    if (session.satisfaction > 0.7) {
      if (!memory.preferences.preferredPersonalities.includes(session.personality)) {
        memory.preferences.preferredPersonalities.push(session.personality);
      }
    }

    // Update avoided personality based on low satisfaction
    if (session.satisfaction < 0.4) {
      if (!memory.preferences.avoidedPersonalities.includes(session.personality)) {
        memory.preferences.avoidedPersonalities.push(session.personality);
      }
    }

    // Update preferred exercise type based on satisfaction
    if (session.satisfaction > 0.7) {
      if (!memory.preferences.preferredExerciseTypes.includes(session.exerciseType)) {
        memory.preferences.preferredExerciseTypes.push(session.exerciseType);
      }
    }
  }

  /**
   * Update preference with learning rate
   */
  private updatePreference(memory: ExperienceMemory, key: string, value: any): void {
    const current = (memory.preferences as any)[key];
    
    if (typeof current === 'number' && typeof value === 'number') {
      (memory.preferences as any)[key] = current * (1 - this.config.learningRate) + value * this.config.learningRate;
    } else {
      (memory.preferences as any)[key] = value;
    }
  }

  /**
   * Get user memory
   */
  getMemory(userId: string): ExperienceMemory | null {
    return this.memories.get(userId) || null;
  }

  /**
   * Get user preferences
   */
  getPreferences(userId: string): UserPreference | null {
    const memory = this.memories.get(userId);
    return memory ? memory.preferences : null;
  }

  /**
   * Get session history
   */
  getSessionHistory(userId: string): SessionMemory[] {
    const memory = this.memories.get(userId);
    return memory ? memory.sessionHistory : [];
  }

  /**
   * Get recent sessions
   */
  getRecentSessions(userId: string, limit: number): SessionMemory[] {
    const history = this.getSessionHistory(userId);
    return history.slice(-limit);
  }

  /**
   * Get sessions by type
   */
  getSessionsByType(userId: string, exerciseType: string): SessionMemory[] {
    const history = this.getSessionHistory(userId);
    return history.filter(s => s.exerciseType === exerciseType);
  }

  /**
   * Get sessions by difficulty
   */
  getSessionsByDifficulty(userId: string, difficulty: string): SessionMemory[] {
    const history = this.getSessionHistory(userId);
    return history.filter(s => s.difficulty === difficulty);
  }

  /**
   * Update user preferences
   */
  updatePreferences(userId: string, preferences: Partial<UserPreference>): void {
    const memory = this.getOrCreateMemory(userId);
    memory.preferences = { ...memory.preferences, ...preferences };
    memory.updatedAt = new Date();
    this.memories.set(userId, memory);
  }

  /**
   * Clear user memory
   */
  clearMemory(userId: string): void {
    this.memories.delete(userId);
  }

  /**
   * Clear all memories
   */
  clearAll(): void {
    this.memories.clear();
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalUsers: number;
    totalSessions: number;
    averageSessionsPerUser: number;
    averageSatisfaction: number;
    averageDuration: number;
    preferenceDistribution: Record<string, any>;
  } {
    const totalUsers = this.memories.size;
    const allMemories = Array.from(this.memories.values());
    const totalSessions = allMemories.reduce((sum, memory) => sum + memory.totalSessions, 0);
    const averageSessionsPerUser = totalUsers > 0 ? totalSessions / totalUsers : 0;

    const averageSatisfaction = allMemories.length > 0
      ? allMemories.reduce((sum, memory) => sum + memory.averageSatisfaction, 0) / allMemories.length
      : 0;

    const averageDuration = allMemories.length > 0
      ? allMemories.reduce((sum, memory) => sum + (memory.totalDuration / Math.max(1, memory.totalSessions)), 0) / allMemories.length
      : 0;

    const preferenceDistribution: Record<string, any> = {
      timeOfDay: {},
      difficulty: {},
      learningStyle: {},
    };

    allMemories.forEach(memory => {
      const timeOfDay = memory.preferences.preferredTimeOfDay;
      preferenceDistribution.timeOfDay[timeOfDay] = (preferenceDistribution.timeOfDay[timeOfDay] || 0) + 1;

      const difficulty = memory.preferences.preferredDifficulty;
      preferenceDistribution.difficulty[difficulty] = (preferenceDistribution.difficulty[difficulty] || 0) + 1;

      const learningStyle = memory.preferences.learningStyle;
      preferenceDistribution.learningStyle[learningStyle] = (preferenceDistribution.learningStyle[learningStyle] || 0) + 1;
    });

    return {
      totalUsers,
      totalSessions,
      averageSessionsPerUser,
      averageSatisfaction,
      averageDuration,
      preferenceDistribution,
    };
  }

  /**
   * Export data
   */
  exportData(): {
    memories: ExperienceMemory[];
    config: ExperienceMemoryConfig;
  } {
    return {
      memories: Array.from(this.memories.values()),
      config: this.config,
    };
  }

  /**
   * Import data
   */
  importData(data: {
    memories: ExperienceMemory[];
    config?: ExperienceMemoryConfig;
  }): void {
    data.memories.forEach(memory => {
      this.memories.set(memory.userId, memory);
    });
    if (data.config) {
      this.setConfig(data.config);
    }
  }
}

export const experienceMemoryService = ExperienceMemoryService.getInstance();
