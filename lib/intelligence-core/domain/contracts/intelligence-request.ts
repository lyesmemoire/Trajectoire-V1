/**
 * Intelligence Request DTO
 * 
 * Represents the input to an Intelligence Engine.
 * All fields are serializable and immutable.
 */

export interface IntelligenceRequest<TInput = unknown> {
  /**
   * Unique identifier for this request
   */
  readonly id: string;

  /**
   * Type of intelligence request (e.g., "forecast", "planning", "ats")
   */
  readonly type: string;

  /**
   * Input data for the intelligence engine
   */
  readonly input: TInput;

  /**
   * Context for the intelligence engine
   */
  readonly context: IntelligenceContext;

  /**
   * Configuration options
   */
  readonly options: IntelligenceOptions;
}

export interface IntelligenceContext {
  /**
   * Candidate profile data
   */
  readonly candidateProfile: Record<string, unknown>;

  /**
   * Historical observations
   */
  readonly historicalObservations: readonly string[];

  /**
   * Current goals
   */
  readonly currentGoals: readonly string[];

  /**
   * Recent insights
   */
  readonly recentInsights: readonly string[];

  /**
   * Engine-specific context
   */
  readonly engineContext?: Record<string, unknown>;
}

export interface IntelligenceOptions {
  /**
   * LLM provider to use
   */
  readonly provider: "openai" | "anthropic";

  /**
   * Model to use
   */
  readonly model: string;

  /**
   * Temperature for LLM
   */
  readonly temperature?: number;

  /**
   * Maximum tokens for LLM
   */
  readonly maxTokens?: number;

  /**
   * Timeout in milliseconds
   */
  readonly timeout?: number;
}
