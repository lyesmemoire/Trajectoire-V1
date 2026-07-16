/**
 * Brain Events
 *
 * Business events for AI-driven candidate intelligence.
 * Engines publish events, Brain subscribes to events.
 */

export interface BaseEvent {
  id: string;
  timestamp: Date;
  correlationId?: string; // For tracking related events
}

/**
 * Observation Created Event
 * Fired when a new AI observation is created
 */
export interface ObservationCreatedEvent extends BaseEvent {
  type: "observation_created";
  payload: {
    source: string; // promptId
    observationType: "interview" | "ats" | "communication" | "leadership" | "career" | "general";
    data: unknown;
    confidence: number;
    metadata?: Record<string, unknown>;
  };
}

/**
 * Interview Analyzed Event
 * Fired when an interview analysis is completed
 */
export interface InterviewAnalyzedEvent extends BaseEvent {
  type: "interview_analyzed";
  payload: {
    interviewId: string;
    transcript: string;
    analysis: unknown; // Use unknown to match actual InterviewAnalysisOutput structure
    metrics: {
      latency: number;
      tokens: number;
      cost: number;
    };
  };
}

/**
 * ATS Completed Event
 * Fired when ATS analysis is completed
 */
export interface ATSCompletedEvent extends BaseEvent {
  type: "ats_completed";
  payload: {
    cvId: string;
    jobDescriptionId: string;
    analysis: unknown; // Use unknown to match actual ATS analysis structure
    metrics: {
      latency: number;
      tokens: number;
      cost: number;
    };
  };
}

/**
 * Career Updated Event
 * Fired when career analysis is updated
 */
export interface CareerUpdatedEvent extends BaseEvent {
  type: "career_updated";
  payload: {
    candidateId: string;
    analysis: unknown; // Use unknown to match actual career analysis structure
    metrics: {
      latency: number;
      tokens: number;
      cost: number;
    };
  };
}

/**
 * Recommendation Generated Event
 * Fired when recommendations are generated
 */
export interface RecommendationGeneratedEvent extends BaseEvent {
  type: "recommendation_generated";
  payload: {
    candidateId: string;
    recommendations: unknown; // Use unknown to match actual recommendations structure
    metrics: {
      latency: number;
      tokens: number;
      cost: number;
    };
  };
}

/**
 * Goal Completed Event
 * Fired when a development goal is achieved
 */
export interface GoalCompletedEvent extends BaseEvent {
  type: "goal_completed";
  payload: {
    goalId: string;
    description: string;
    target: string;
    achievedValue: number;
    targetValue: number;
    unit: string;
    timeToAchieve: number; // days
  };
}

/**
 * Union type for all brain events
 */
export type BrainEvent =
  | ObservationCreatedEvent
  | InterviewAnalyzedEvent
  | ATSCompletedEvent
  | CareerUpdatedEvent
  | RecommendationGeneratedEvent
  | GoalCompletedEvent;

/**
 * Event handler type
 */
export type EventHandler<T extends BrainEvent = BrainEvent> = (event: T) => void | Promise<void>;

/**
 * Event filter type
 */
export type EventFilter<T extends BrainEvent = BrainEvent> = (event: T) => boolean;
