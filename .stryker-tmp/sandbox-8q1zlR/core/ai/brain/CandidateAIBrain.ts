/**
 * Candidate AI Brain
 *
 * Memory layer for AI-generated knowledge.
 * 
 * Responsibilities:
 * - Memorize observations from AI engines
 * - Track strengths, weaknesses, patterns
 * - Monitor improvements and regressions
 * - Store goals and coaching history
 * 
 * Does NOT:
 * - Call LLMs
 * - Calculate scores
 * - Have React dependencies
 * - Have UI components
 */
// @ts-nocheck


import { BrainMemory, BrainObservation, BrainInsight, BrainGoal, BrainPattern } from "./BrainMemory";
import { BrainEvents, BrainEvent } from "./BrainEvents";
import { BrainHistory, BrainHistoryEntry } from "./BrainHistory";
import { BrainTimeline, TimelineEvent } from "./BrainTimeline";
import { BrainPatterns, PatternMatch } from "./BrainPatterns";
import { eventBus } from "../events/EventBus";
import {
  ObservationCreatedEvent,
  InterviewAnalyzedEvent,
  ATSCompletedEvent,
  CareerUpdatedEvent,
  RecommendationGeneratedEvent,
  GoalCompletedEvent,
} from "../events/BrainEvents";
import { supabase } from "../../../lib/supabase/client";

export interface BrainState {
  observations: BrainObservation[];
  patterns: PatternMatch[];
  insights: BrainInsight[];
  goals: BrainGoal[];
  summary: {
    totalObservations: number;
    totalPatterns: number;
    totalInsights: number;
    totalGoals: number;
    strengthsCount: number;
    weaknessesCount: number;
  };
}

export interface BrainHistorySummary {
  entries: BrainHistoryEntry[];
  evolution: {
    trend: "improving" | "declining" | "stable";
    averageLatency: number;
    averageCost: number;
    successRate: number;
  };
}

export interface BrainPatternsSummary {
  patterns: PatternMatch[];
  recurringPatterns: PatternMatch[];
  strengths: PatternMatch[];
  weaknesses: PatternMatch[];
  risks: PatternMatch[];
}

export interface BrainRecommendationsContext {
  currentState: BrainState;
  history: BrainHistorySummary;
  patterns: BrainPatternsSummary;
  actionableInsights: BrainInsight[];
  pendingGoals: BrainGoal[];
  recentEvents: BrainEvent[];
}

export class CandidateAIBrain {
  private memory: BrainMemory;
  private events: BrainEvents;
  private history: BrainHistory;
  private timeline: BrainTimeline;
  private userId: string | null = null;

  constructor(userId?: string) {
    this.memory = new BrainMemory();
    this.events = new BrainEvents();
    this.history = new BrainHistory();
    this.timeline = new BrainTimeline();
    this.userId = userId || null;

    // Subscribe to event bus
    this.setupEventSubscriptions();
  }

  /**
   * Set user ID for persistence
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Setup event subscriptions
   */
  private setupEventSubscriptions(): void {
    // Observation Created
    eventBus.subscribe("observation_created", async (event: ObservationCreatedEvent) => {
      this.handleObservationCreated(event);
    });

    // Interview Analyzed
    eventBus.subscribe("interview_analyzed", async (event: InterviewAnalyzedEvent) => {
      this.handleInterviewAnalyzed(event);
    });

    // ATS Completed
    eventBus.subscribe("ats_completed", async (event: ATSCompletedEvent) => {
      this.handleATSCompleted(event);
    });

    // Career Updated
    eventBus.subscribe("career_updated", async (event: CareerUpdatedEvent) => {
      this.handleCareerUpdated(event);
    });

    // Recommendation Generated
    eventBus.subscribe("recommendation_generated", async (event: RecommendationGeneratedEvent) => {
      this.handleRecommendationGenerated(event);
    });

    // Goal Completed
    eventBus.subscribe("goal_completed", async (event: GoalCompletedEvent) => {
      this.handleGoalCompleted(event);
    });
  }

  /**
   * Handle Observation Created event
   */
  private async handleObservationCreated(event: ObservationCreatedEvent): Promise<void> {
    const obs = this.memory.addObservation({
      timestamp: event.timestamp,
      source: event.payload.source,
      type: event.payload.observationType,
      data: event.payload.data,
      confidence: event.payload.confidence,
      metadata: event.payload.metadata,
    });

    this.events.addEvent({
      timestamp: new Date(),
      type: "observation",
      description: `New ${event.payload.observationType} observation from ${event.payload.source}`,
      relatedId: event.id,
      severity: "info",
    });

    this.detectAndStorePatterns();
    this.detectAndStoreInsights();

    // Persist observation to Supabase
    if (this.userId) {
      await this.persistObservation(obs, this.userId);
    }
  }

  /**
   * Handle Interview Analyzed event
   */
  private async handleInterviewAnalyzed(event: InterviewAnalyzedEvent): Promise<void> {
    const obs = this.memory.addObservation({
      timestamp: event.timestamp,
      source: "interview-analysis",
      type: "interview",
      data: event.payload.analysis,
      confidence: 0.9,
    });

    const entry = this.history.addEntry({
      timestamp: event.timestamp,
      promptId: "interview-analysis",
      promptVersion: "v1",
      input: { interviewId: event.payload.interviewId },
      output: event.payload.analysis,
      metrics: {
        latency: event.payload.metrics.latency,
        tokens: { prompt: 0, completion: event.payload.metrics.tokens, total: event.payload.metrics.tokens },
        cost: event.payload.metrics.cost,
        retryCount: 0,
      },
      status: "success",
    });

    this.detectAndStorePatterns();
    this.detectAndStoreInsights();

    // Persist to Supabase
    if (this.userId) {
      await this.persistObservation(obs, this.userId);
      await this.persistHistoryEntry(entry, this.userId);
    }
  }

  /**
   * Handle ATS Completed event
   */
  private async handleATSCompleted(event: ATSCompletedEvent): Promise<void> {
    const obs = this.memory.addObservation({
      timestamp: event.timestamp,
      source: "ats-analysis",
      type: "ats",
      data: event.payload.analysis,
      confidence: 0.85,
    });

    const entry = this.history.addEntry({
      timestamp: event.timestamp,
      promptId: "ats-analysis",
      promptVersion: "v1",
      input: { cvId: event.payload.cvId, jobDescriptionId: event.payload.jobDescriptionId },
      output: event.payload.analysis,
      metrics: {
        latency: event.payload.metrics.latency,
        tokens: { prompt: 0, completion: event.payload.metrics.tokens, total: event.payload.metrics.tokens },
        cost: event.payload.metrics.cost,
        retryCount: 0,
      },
      status: "success",
    });

    this.detectAndStorePatterns();
    this.detectAndStoreInsights();

    // Persist to Supabase
    if (this.userId) {
      await this.persistObservation(obs, this.userId);
      await this.persistHistoryEntry(entry, this.userId);
    }
  }

  /**
   * Handle Career Updated event
   */
  private async handleCareerUpdated(event: CareerUpdatedEvent): Promise<void> {
    const obs = this.memory.addObservation({
      timestamp: event.timestamp,
      source: "career-analysis",
      type: "career",
      data: event.payload.analysis,
      confidence: 0.85,
    });

    const entry = this.history.addEntry({
      timestamp: event.timestamp,
      promptId: "career-analysis",
      promptVersion: "v1",
      input: { candidateId: event.payload.candidateId },
      output: event.payload.analysis,
      metrics: {
        latency: event.payload.metrics.latency,
        tokens: { prompt: 0, completion: event.payload.metrics.tokens, total: event.payload.metrics.tokens },
        cost: event.payload.metrics.cost,
        retryCount: 0,
      },
      status: "success",
    });

    this.detectAndStorePatterns();
    this.detectAndStoreInsights();

    // Persist to Supabase
    if (this.userId) {
      await this.persistObservation(obs, this.userId);
      await this.persistHistoryEntry(entry, this.userId);
    }
  }

  /**
   * Handle Recommendation Generated event
   */
  private async handleRecommendationGenerated(event: RecommendationGeneratedEvent): Promise<void> {
    const obs = this.memory.addObservation({
      timestamp: event.timestamp,
      source: "recommendations",
      type: "general",
      data: event.payload.recommendations,
      confidence: 0.8,
    });

    const entry = this.history.addEntry({
      timestamp: event.timestamp,
      promptId: "recommendations",
      promptVersion: "v1",
      input: { candidateId: event.payload.candidateId },
      output: event.payload.recommendations,
      metrics: {
        latency: event.payload.metrics.latency,
        tokens: { prompt: 0, completion: event.payload.metrics.tokens, total: event.payload.metrics.tokens },
        cost: event.payload.metrics.cost,
        retryCount: 0,
      },
      status: "success",
    });

    this.detectAndStorePatterns();
    this.detectAndStoreInsights();

    // Persist to Supabase
    if (this.userId) {
      await this.persistObservation(obs, this.userId);
      await this.persistHistoryEntry(entry, this.userId);
    }
  }

  /**
   * Handle Goal Completed event
   */
  private async handleGoalCompleted(event: GoalCompletedEvent): Promise<void> {
    this.events.addEvent({
      timestamp: new Date(),
      type: "goal_achieved",
      description: `Goal achieved: ${event.payload.description}`,
      relatedId: event.payload.goalId,
      severity: "success",
    });

    const timelineEvent = this.timeline.addEvent({
      timestamp: new Date(),
      type: "milestone",
      title: "Goal Achieved",
      description: event.payload.description,
      impact: "high",
      relatedIds: [event.payload.goalId],
    });

    // Persist timeline event to Supabase
    if (this.userId) {
      await this.persistTimelineEvent(timelineEvent, this.userId);
    }
  }

  /**
   * Add an observation from an AI engine
   */
  addObservation(observation: Omit<BrainObservation, "id">): BrainObservation {
    const obs = this.memory.addObservation(observation);

    // Log event
    this.events.addEvent({
      timestamp: new Date(),
      type: "observation",
      description: `New ${observation.type} observation from ${observation.source}`,
      relatedId: obs.id,
      severity: "info",
    });

    // Detect patterns
    this.detectAndStorePatterns();

    // Detect insights
    this.detectAndStoreInsights();

    return obs;
  }

  /**
   * Add a history entry from AI execution
   */
  addHistoryEntry(entry: Omit<BrainHistoryEntry, "id">): BrainHistoryEntry {
    const historyEntry = this.history.addEntry(entry);

    // Log event
    this.events.addEvent({
      timestamp: new Date(),
      type: "observation",
      description: `AI execution: ${entry.promptId} (${entry.status})`,
      severity: entry.status === "success" ? "success" : "error",
    });

    return historyEntry;
  }

  /**
   * Add a goal
   */
  addGoal(goal: Omit<BrainGoal, "id" | "createdAt" | "updatedAt">): BrainGoal {
    const newGoal = this.memory.addGoal(goal);

    // Log event
    this.events.addEvent({
      timestamp: new Date(),
      type: "goal_created",
      description: `Goal created: ${goal.description}`,
      relatedId: newGoal.id,
      severity: "info",
    });

    // Add to timeline
    this.timeline.addEvent({
      timestamp: new Date(),
      type: "goal",
      title: "New Goal",
      description: goal.description,
      impact: "medium",
      relatedIds: [newGoal.id],
    });

    return newGoal;
  }

  /**
   * Update goal progress
   */
  updateGoalProgress(goalId: string, current: number): void {
    this.memory.updateGoalProgress(goalId, current);

    const goal = this.memory.getGoals().find((g) => g.id === goalId);
    if (goal && goal.status === "achieved") {
      // Log achievement
      this.events.addEvent({
        timestamp: new Date(),
        type: "goal_achieved",
        description: `Goal achieved: ${goal.description}`,
        relatedId: goalId,
        severity: "success",
      });

      // Add to timeline
      this.timeline.addEvent({
        timestamp: new Date(),
        type: "milestone",
        title: "Goal Achieved",
        description: goal.description,
        impact: "high",
        relatedIds: [goalId],
      });
    }
  }

  /**
   * Get current brain state
   */
  getCurrentState(): BrainState {
    const observations = this.memory.getObservations();
    const patterns = BrainPatterns.detectPatterns(observations);
    const insights = this.memory.getInsights();
    const goals = this.memory.getGoals();

    const strengthsCount = patterns.filter((p) => p.category === "strength").length;
    const weaknessesCount = patterns.filter((p) => p.category === "weakness").length;

    return {
      observations,
      patterns,
      insights,
      goals,
      summary: {
        totalObservations: observations.length,
        totalPatterns: patterns.length,
        totalInsights: insights.length,
        totalGoals: goals.length,
        strengthsCount,
        weaknessesCount,
      },
    };
  }

  /**
   * Get brain history
   */
  getHistory(): BrainHistorySummary {
    const entries = this.history.getHistory();
    const evolution = this.history.getEvolution("all");

    return {
      entries,
      evolution,
    };
  }

  /**
   * Get brain patterns
   */
  getPatterns(): BrainPatternsSummary {
    const observations = this.memory.getObservations();
    const patterns = BrainPatterns.detectPatterns(observations);

    return {
      patterns,
      recurringPatterns: patterns.filter((p) => p.occurrences >= 3),
      strengths: patterns.filter((p) => p.category === "strength"),
      weaknesses: patterns.filter((p) => p.category === "weakness"),
      risks: patterns.filter((p) => p.category === "risk"),
    };
  }

  /**
   * Get recommendations context
   */
  getRecommendationsContext(): BrainRecommendationsContext {
    const currentState = this.getCurrentState();
    const history = this.getHistory();
    const patterns = this.getPatterns();
    const actionableInsights = this.memory.getActionableInsights();
    const pendingGoals = this.memory.getGoalsByStatus("pending");
    const recentEvents = this.events.getRecentEvents(20);

    return {
      currentState,
      history,
      patterns,
      actionableInsights,
      pendingGoals,
      recentEvents,
    };
  }

  /**
   * Get coaching history
   */
  getCoachingHistory(): BrainInsight[] {
    return this.memory.getInsights().filter((i) => i.coaching);
  }

  /**
   * Get strengths
   */
  getStrengths(): PatternMatch[] {
    return this.getPatterns().strengths;
  }

  /**
   * Get weaknesses
   */
  getWeaknesses(): PatternMatch[] {
    return this.getPatterns().weaknesses;
  }

  /**
   * Get recurring patterns
   */
  getRecurringPatterns(): PatternMatch[] {
    return this.getPatterns().recurringPatterns;
  }

  /**
   * Get improvements
   */
  getImprovements(): BrainInsight[] {
    return this.memory.getInsightsByType("progress");
  }

  /**
   * Get regressions
   */
  getRegressions(): BrainInsight[] {
    return this.memory.getInsightsByType("regression");
  }

  /**
   * Get timeline
   */
  getTimeline(): TimelineEvent[] {
    return this.timeline.getEvents();
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 10): BrainEvent[] {
    return this.events.getRecentEvents(limit);
  }

  /**
   * Get goals from memory
   */
  getGoals(): BrainGoal[] {
    return this.memory.getGoals();
  }

  /**
   * Get insights from memory
   */
  getInsights(): BrainInsight[] {
    return this.memory.getInsights();
  }

  /**
   * Get observations from memory
   */
  getObservations(): BrainObservation[] {
    return this.memory.getObservations();
  }

  /**
   * Detect and store patterns from observations
   */
  private async detectAndStorePatterns(): Promise<void> {
    const observations = this.memory.getObservations();
    const patterns = BrainPatterns.detectPatterns(observations);

    for (const pattern of patterns) {
      // Check if pattern already exists
      const existing = this.memory.getPatterns().find((p) => p.pattern === pattern.pattern);
      if (existing) {
        this.memory.updatePatternFrequency(existing.id);
        // Persist updated pattern
        if (this.userId) {
          await this.persistPattern(existing, this.userId);
        }
      } else {
        const newPattern = this.memory.addPattern({
          pattern: pattern.pattern,
          frequency: pattern.occurrences,
          firstSeen: new Date(),
          lastSeen: new Date(),
          observations: pattern.examples,
          category: pattern.category,
        });

        // Log pattern discovery as insight event
        this.events.addEvent({
          timestamp: new Date(),
          type: "insight",
          description: `Pattern detected: ${pattern.pattern} (${pattern.category})`,
          severity: pattern.category === "risk" ? "warning" : "info",
        });

        // Persist new pattern
        if (this.userId) {
          await this.persistPattern(newPattern, this.userId);
        }
      }
    }
  }

  /**
   * Detect and store insights from observations
   */
  private async detectAndStoreInsights(): Promise<void> {
    // Detect contradictions
    const contradictions = this.memory.detectContradictions();
    for (const contradiction of contradictions) {
      this.memory.addInsight(contradiction);
      this.events.addEvent({
        timestamp: new Date(),
        type: "contradiction",
        description: contradiction.description,
        relatedId: contradiction.id,
        severity: "warning",
      });

      // Persist insight
      if (this.userId) {
        await this.persistInsight(contradiction, this.userId);
      }
    }

    // Detect progress/regression
    const progressInsights = this.memory.detectProgress();
    for (const insight of progressInsights) {
      this.memory.addInsight(insight);
      
      // Map insight type to valid event type
      const eventType: BrainEvent["type"] = 
        insight.type === "contradiction" || insight.type === "progress" || insight.type === "regression"
          ? insight.type
          : "insight";
      
      this.events.addEvent({
        timestamp: new Date(),
        type: eventType,
        description: insight.description,
        relatedId: insight.id,
        severity: insight.type === "progress" ? "success" : insight.type === "regression" ? "warning" : "info",
      });

      // Persist insight
      if (this.userId) {
        await this.persistInsight(insight, this.userId);
      }
    }
  }

  /**
   * Export brain data
   */
  export(): string {
    return JSON.stringify({
      memory: this.memory.export(),
      events: this.events.getEvents(),
      history: this.history.getHistory(),
      timeline: this.timeline.getEvents(),
    }, null, 2);
  }

  /**
   * Import brain data
   */
  import(json: string): void {
    const data = JSON.parse(json) as {
      memory: string;
      events: BrainEvent[];
      history: BrainHistoryEntry[];
      timeline: TimelineEvent[];
    };

    this.memory.import(data.memory);
    // Note: events, history, timeline would need similar import methods
  }

  /**
   * Clear all brain data
   */
  clear(): void {
    this.memory.clear();
    this.events.clear();
    this.history.clear();
    this.timeline.clear();
  }

  /**
   * Persist observation to Supabase
   */
  private async persistObservation(observation: BrainObservation, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("brain_observations")
        .insert({
          id: observation.id,
          user_id: userId,
          timestamp: observation.timestamp.toISOString(),
          source: observation.source,
          type: observation.type,
          data: observation.data,
          confidence: observation.confidence,
          metadata: observation.metadata,
        });

      if (error) {
        console.error("Error persisting observation:", error);
      }
    } catch (error) {
      console.error("Error persisting observation:", error);
    }
  }

  /**
   * Persist pattern to Supabase
   */
  private async persistPattern(pattern: BrainPattern, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("brain_patterns")
        .upsert({
          id: pattern.id,
          user_id: userId,
          pattern: pattern.pattern,
          frequency: pattern.frequency,
          first_seen: pattern.firstSeen.toISOString(),
          last_seen: pattern.lastSeen.toISOString(),
          observations: pattern.observations,
          category: pattern.category,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "id",
        });

      if (error) {
        console.error("Error persisting pattern:", error);
      }
    } catch (error) {
      console.error("Error persisting pattern:", error);
    }
  }

  /**
   * Persist insight to Supabase
   */
  private async persistInsight(insight: BrainInsight, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("brain_insights")
        .insert({
          id: insight.id,
          user_id: userId,
          timestamp: insight.timestamp.toISOString(),
          type: insight.type,
          description: insight.description,
          evidence: insight.evidence,
          confidence: insight.confidence,
          actionable: insight.actionable,
          coaching: insight.coaching,
        });

      if (error) {
        console.error("Error persisting insight:", error);
      }
    } catch (error) {
      console.error("Error persisting insight:", error);
    }
  }

  /**
   * Persist goal to Supabase
   */
  private async persistGoal(goal: BrainGoal, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("brain_goals")
        .upsert({
          id: goal.id,
          user_id: userId,
          description: goal.description,
          target: goal.target,
          current: goal.current,
          target_value: goal.targetValue,
          unit: goal.unit,
          deadline: goal.deadline?.toISOString(),
          status: goal.status,
          updated_at: goal.updatedAt.toISOString(),
        }, {
          onConflict: "id",
        });

      if (error) {
        console.error("Error persisting goal:", error);
      }
    } catch (error) {
      console.error("Error persisting goal:", error);
    }
  }

  /**
   * Persist history entry to Supabase
   */
  private async persistHistoryEntry(entry: BrainHistoryEntry, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("brain_history")
        .insert({
          id: entry.id,
          user_id: userId,
          timestamp: entry.timestamp.toISOString(),
          prompt_id: entry.promptId,
          prompt_version: entry.promptVersion,
          input: entry.input,
          output: entry.output,
          metrics: entry.metrics,
          status: entry.status,
        });

      if (error) {
        console.error("Error persisting history entry:", error);
      }
    } catch (error) {
      console.error("Error persisting history entry:", error);
    }
  }

  /**
   * Persist timeline event to Supabase
   */
  private async persistTimelineEvent(event: TimelineEvent, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("brain_timeline")
        .insert({
          id: event.id,
          user_id: userId,
          timestamp: event.timestamp.toISOString(),
          type: event.type,
          title: event.title,
          description: event.description,
          impact: event.impact,
          related_ids: event.relatedIds,
        });

      if (error) {
        console.error("Error persisting timeline event:", error);
      }
    } catch (error) {
      console.error("Error persisting timeline event:", error);
    }
  }

  /**
   * Find latest analysis by promptId (pure retrieval, no decision logic)
   */
  findLatest(promptId: string): BrainHistoryEntry | null {
    const history = this.history.getHistory();
    const entries = history
      .filter((entry: BrainHistoryEntry) => entry.promptId === promptId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return entries[0] || null;
  }

  /**
   * Find analysis by promptId and inputHash (pure retrieval, no decision logic)
   */
  findAnalysis(promptId: string, inputHash?: string): BrainHistoryEntry | null {
    const history = this.history.getHistory();
    return history.find(
      (entry: BrainHistoryEntry) => entry.promptId === promptId && 
      (!inputHash || this.hashInput(entry.input) === inputHash)
    ) || null;
  }

  /**
   * Find history entries by promptId (pure retrieval)
   */
  findHistory(promptId: string, limit?: number): BrainHistoryEntry[] {
    const history = this.history.getHistory();
    const entries = history
      .filter((entry: BrainHistoryEntry) => entry.promptId === promptId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? entries.slice(0, limit) : entries;
  }

  /**
   * Find observations by type (pure retrieval)
   */
  findByType(type: string): BrainObservation[] {
    return this.memory.getObservations().filter(obs => obs.type === type);
  }

  /**
   * Find observations after a given timestamp (pure retrieval)
   */
  findAfter(timestamp: Date): BrainObservation[] {
    return this.memory.getObservations().filter(obs => obs.timestamp > timestamp);
  }

  /**
   * Find observations before a given timestamp (pure retrieval)
   */
  findBefore(timestamp: Date): BrainObservation[] {
    return this.memory.getObservations().filter(obs => obs.timestamp < timestamp);
  }

  /**
   * Find goals by status (pure retrieval)
   */
  findGoals(status?: "pending" | "in_progress" | "achieved" | "abandoned"): BrainGoal[] {
    const goals = this.memory.getGoals();
    return status ? goals.filter(g => g.status === status) : goals;
  }

  /**
   * Find recommendations (from history) (pure retrieval)
   */
  findRecommendations(limit?: number): BrainHistoryEntry[] {
    return this.findHistory("recommendations", limit);
  }

  /**
   * Simple hash function for input comparison
   */
  private hashInput(input: unknown): string {
    return JSON.stringify(input);
  }

  /**
   * Load brain data from Supabase
   */
  async load(userId: string): Promise<void> {
    this.userId = userId;

    try {
      // Load observations
      const { data: observations, error: obsError } = await supabase
        .from("brain_observations")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (obsError) {
        console.error("Error loading observations:", obsError);
      } else if (observations) {
        for (const obs of observations) {
          this.memory.addObservation({
            timestamp: new Date(obs.timestamp),
            source: obs.source,
            type: obs.type,
            data: obs.data,
            confidence: obs.confidence,
            metadata: obs.metadata,
          });
        }
      }

      // Load patterns
      const { data: patterns, error: patternError } = await supabase
        .from("brain_patterns")
        .select("*")
        .eq("user_id", userId);

      if (patternError) {
        console.error("Error loading patterns:", patternError);
      } else if (patterns) {
        for (const pattern of patterns) {
          this.memory.addPattern({
            pattern: pattern.pattern,
            frequency: pattern.frequency,
            firstSeen: new Date(pattern.first_seen),
            lastSeen: new Date(pattern.last_seen),
            observations: pattern.observations,
            category: pattern.category,
          });
        }
      }

      // Load insights
      const { data: insights, error: insightError } = await supabase
        .from("brain_insights")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (insightError) {
        console.error("Error loading insights:", insightError);
      } else if (insights) {
        for (const insight of insights) {
          this.memory.addInsight({
            timestamp: new Date(insight.timestamp),
            type: insight.type,
            description: insight.description,
            evidence: insight.evidence,
            confidence: insight.confidence,
            actionable: insight.actionable,
            coaching: insight.coaching,
          });
        }
      }

      // Load goals
      const { data: goals, error: goalError } = await supabase
        .from("brain_goals")
        .select("*")
        .eq("user_id", userId);

      if (goalError) {
        console.error("Error loading goals:", goalError);
      } else if (goals) {
        for (const goal of goals) {
          this.memory.addGoal({
            description: goal.description,
            target: goal.target,
            current: goal.current,
            targetValue: goal.target_value,
            unit: goal.unit,
            deadline: goal.deadline ? new Date(goal.deadline) : undefined,
            status: goal.status,
          });
        }
      }

      // Load history
      const { data: history, error: historyError } = await supabase
        .from("brain_history")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (historyError) {
        console.error("Error loading history:", historyError);
      } else if (history) {
        for (const entry of history) {
          this.history.addEntry({
            timestamp: new Date(entry.timestamp),
            promptId: entry.prompt_id,
            promptVersion: entry.prompt_version,
            input: entry.input,
            output: entry.output,
            metrics: entry.metrics,
            status: entry.status,
          });
        }
      }

      // Load timeline
      const { data: timeline, error: timelineError } = await supabase
        .from("brain_timeline")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (timelineError) {
        console.error("Error loading timeline:", timelineError);
      } else if (timeline) {
        for (const event of timeline) {
          this.timeline.addEvent({
            timestamp: new Date(event.timestamp),
            type: event.type,
            title: event.title,
            description: event.description,
            impact: event.impact,
            relatedIds: event.related_ids,
          });
        }
      }

      console.log(`Brain data loaded for user ${userId}`);
    } catch (error) {
      console.error("Error loading brain data:", error);
    }
  }
}

// Singleton instance (without userId, will be set via setUserId)
export const candidateAIBrain = new CandidateAIBrain();
