/**
 * Brain Memory
 *
 * Stores AI observations, patterns, strengths, weaknesses, contradictions,
 * progress, regressions, recurring points, goals, and coaching.
 */
// @ts-nocheck


export interface BrainObservation {
  id: string;
  timestamp: Date;
  source: string; // promptId
  type: "interview" | "ats" | "communication" | "leadership" | "career" | "general";
  data: unknown;
  confidence: number; // 0-1
  metadata?: Record<string, unknown>;
  // Evolution tracking fields
  previousValue?: number; // Value before this observation
  currentValue?: number; // Value after this observation (for metrics)
  change?: number; // Difference between previous and current
  evolutionSource?: string; // What caused this change (e.g., "interview", "cv_update")
}

export interface BrainPattern {
  id: string;
  pattern: string;
  frequency: number;
  firstSeen: Date;
  lastSeen: Date;
  observations: string[]; // observation IDs
  category: "strength" | "weakness" | "behavior" | "skill" | "risk";
}

export interface BrainInsight {
  id: string;
  timestamp: Date;
  type: "strength" | "weakness" | "contradiction" | "progress" | "regression" | "recurring";
  description: string;
  evidence: string[];
  confidence: number;
  actionable: boolean;
  coaching?: string;
}

export interface BrainGoal {
  id: string;
  description: string;
  target: string;
  current: number;
  targetValue: number;
  unit: string;
  deadline?: Date;
  status: "pending" | "in_progress" | "achieved" | "abandoned";
  createdAt: Date;
  updatedAt: Date;
}

export class BrainMemory {
  private observations: Map<string, BrainObservation> = new Map();
  private patterns: Map<string, BrainPattern> = new Map();
  private insights: Map<string, BrainInsight> = new Map();
  private goals: Map<string, BrainGoal> = new Map();

  /**
   * Add an observation to memory
   */
  addObservation(observation: Omit<BrainObservation, "id">): BrainObservation {
    const fullObservation: BrainObservation = {
      ...observation,
      id: this.generateId(),
    };

    this.observations.set(fullObservation.id, fullObservation);
    return fullObservation;
  }

  /**
   * Get observation by ID
   */
  getObservation(id: string): BrainObservation | undefined {
    return this.observations.get(id);
  }

  /**
   * Get all observations
   */
  getObservations(): BrainObservation[] {
    return Array.from(this.observations.values());
  }

  /**
   * Get observations by type
   */
  getObservationsByType(type: BrainObservation["type"]): BrainObservation[] {
    return this.getObservations().filter((obs) => obs.type === type);
  }

  /**
   * Get observations by source
   */
  getObservationsBySource(source: string): BrainObservation[] {
    return this.getObservations().filter((obs) => obs.source === source);
  }

  /**
   * Get observations in date range
   */
  getObservationsByDateRange(start: Date, end: Date): BrainObservation[] {
    return this.getObservations().filter(
      (obs) => obs.timestamp >= start && obs.timestamp <= end
    );
  }

  /**
   * Add a pattern
   */
  addPattern(pattern: Omit<BrainPattern, "id">): BrainPattern {
    const fullPattern: BrainPattern = {
      ...pattern,
      id: this.generateId(),
    };

    this.patterns.set(fullPattern.id, fullPattern);
    return fullPattern;
  }

  /**
   * Get all patterns
   */
  getPatterns(): BrainPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get patterns by category
   */
  getPatternsByCategory(category: BrainPattern["category"]): BrainPattern[] {
    return this.getPatterns().filter((p) => p.category === category);
  }

  /**
   * Update pattern frequency
   */
  updatePatternFrequency(patternId: string): void {
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      pattern.frequency += 1;
      pattern.lastSeen = new Date();
    }
  }

  /**
   * Add an insight
   */
  addInsight(insight: Omit<BrainInsight, "id">): BrainInsight {
    const fullInsight: BrainInsight = {
      ...insight,
      id: this.generateId(),
    };

    this.insights.set(fullInsight.id, fullInsight);
    return fullInsight;
  }

  /**
   * Get all insights
   */
  getInsights(): BrainInsight[] {
    return Array.from(this.insights.values());
  }

  /**
   * Get insights by type
   */
  getInsightsByType(type: BrainInsight["type"]): BrainInsight[] {
    return this.getInsights().filter((i) => i.type === type);
  }

  /**
   * Get actionable insights
   */
  getActionableInsights(): BrainInsight[] {
    return this.getInsights().filter((i) => i.actionable);
  }

  /**
   * Add a goal
   */
  addGoal(goal: Omit<BrainGoal, "id" | "createdAt" | "updatedAt">): BrainGoal {
    const now = new Date();
    const fullGoal: BrainGoal = {
      ...goal,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };

    this.goals.set(fullGoal.id, fullGoal);
    return fullGoal;
  }

  /**
   * Update goal progress
   */
  updateGoalProgress(goalId: string, current: number): void {
    const goal = this.goals.get(goalId);
    if (goal) {
      goal.current = current;
      goal.updatedAt = new Date();

      if (current >= goal.targetValue) {
        goal.status = "achieved";
      } else if (current > 0) {
        goal.status = "in_progress";
      }
    }
  }

  /**
   * Get all goals
   */
  getGoals(): BrainGoal[] {
    return Array.from(this.goals.values());
  }

  /**
   * Get goals by status
   */
  getGoalsByStatus(status: BrainGoal["status"]): BrainGoal[] {
    return this.getGoals().filter((g) => g.status === status);
  }

  /**
   * Detect contradictions from observations
   */
  detectContradictions(): BrainInsight[] {
    const contradictions: BrainInsight[] = [];
    const observations = this.getObservations();

    // Group observations by type
    const byType = new Map<string, BrainObservation[]>();
    for (const obs of observations) {
      const existing = byType.get(obs.type) || [];
      existing.push(obs);
      byType.set(obs.type, existing);
    }

    // Look for contradictions within same type
    const typeEntries = Array.from(byType.entries());
    for (const [type, typeObs] of typeEntries) {
      if (typeObs.length < 2) continue;

      // Simple contradiction detection: opposite scores
      for (let i = 0; i < typeObs.length; i++) {
        for (let j = i + 1; j < typeObs.length; j++) {
          const obs1 = typeObs[i];
          const obs2 = typeObs[j];
          
          if (!obs1 || !obs2) continue;

          // Check if data contains scores that contradict
          const data1 = obs1.data as Record<string, unknown>;
          const data2 = obs2.data as Record<string, unknown>;

          if (data1.score && data2.score) {
            const score1 = data1.score as number;
            const score2 = data2.score as number;

            // If scores differ by more than 30, flag as potential contradiction
            if (Math.abs(score1 - score2) > 30) {
              contradictions.push({
                id: this.generateId(),
                timestamp: new Date(),
                type: "contradiction",
                description: `Contradictory ${type} scores: ${score1} vs ${score2}`,
                evidence: [obs1.id, obs2.id],
                confidence: 0.7,
                actionable: true,
                coaching: "Review the context of these conflicting assessments",
              });
            }
          }
        }
      }
    }

    return contradictions;
  }

  /**
   * Detect progress/regression
   */
  detectProgress(): BrainInsight[] {
    const insights: BrainInsight[] = [];
    const observations = this.getObservations().sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Group by type
    const byType = new Map<string, BrainObservation[]>();
    for (const obs of observations) {
      const existing = byType.get(obs.type) || [];
      existing.push(obs);
      byType.set(obs.type, existing);
    }

    const typeEntries2 = Array.from(byType.entries());
    for (const [type, typeObs] of typeEntries2) {
      if (typeObs.length < 2) continue;

      const first = typeObs[0];
      const last = typeObs[typeObs.length - 1];
      
      if (!first || !last) continue;

      const data1 = first.data as Record<string, unknown>;
      const data2 = last.data as Record<string, unknown>;

      if (data1.score && data2.score) {
        const score1 = data1.score as number;
        const score2 = data2.score as number;
        const diff = score2 - score1;

        if (diff > 10) {
          insights.push({
            id: this.generateId(),
            timestamp: new Date(),
            type: "progress",
            description: `Progress in ${type}: ${score1} → ${score2} (+${diff})`,
            evidence: [first.id, last.id],
            confidence: 0.8,
            actionable: true,
            coaching: "Continue focusing on this area",
          });
        } else if (diff < -10) {
          insights.push({
            id: this.generateId(),
            timestamp: new Date(),
            type: "regression",
            description: `Regression in ${type}: ${score1} → ${score2} (${diff})`,
            evidence: [first.id, last.id],
            confidence: 0.8,
            actionable: true,
            coaching: "Review what changed and address the decline",
          });
        }
      }
    }

    return insights;
  }

  /**
   * Clear all memory
   */
  clear(): void {
    this.observations.clear();
    this.patterns.clear();
    this.insights.clear();
    this.goals.clear();
  }

  /**
   * Export memory as JSON
   */
  export(): string {
    return JSON.stringify({
      observations: Array.from(this.observations.values()),
      patterns: Array.from(this.patterns.values()),
      insights: Array.from(this.insights.values()),
      goals: Array.from(this.goals.values()),
    }, null, 2);
  }

  /**
   * Import memory from JSON
   */
  import(json: string): void {
    const data = JSON.parse(json) as {
      observations: BrainObservation[];
      patterns: BrainPattern[];
      insights: BrainInsight[];
      goals: BrainGoal[];
    };

    for (const obs of data.observations) {
      this.observations.set(obs.id, { ...obs, timestamp: new Date(obs.timestamp) });
    }
    for (const pattern of data.patterns) {
      this.patterns.set(pattern.id, {
        ...pattern,
        firstSeen: new Date(pattern.firstSeen),
        lastSeen: new Date(pattern.lastSeen),
      });
    }
    for (const insight of data.insights) {
      this.insights.set(insight.id, { ...insight, timestamp: new Date(insight.timestamp) });
    }
    for (const goal of data.goals) {
      this.goals.set(goal.id, {
        ...goal,
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt),
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
      });
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
