/**
 * Intelligence Response DTO
 * 
 * Represents the output from an Intelligence Engine.
 * All fields are serializable and immutable.
 */

export interface IntelligenceResponse<TOutput = unknown> {
  /**
   * Unique identifier for the response (matches request id)
   */
  readonly id: string;

  /**
   * Type of intelligence response (matches request type)
   */
  readonly type: string;

  /**
   * Output data from the intelligence engine
   */
  readonly output: TOutput;

  /**
   * Metadata about the response
   */
  readonly metadata: IntelligenceMetadata;

  /**
   * Whether the request was successful
   */
  readonly success: boolean;

  /**
   * Error if the request failed
   */
  readonly error?: IntelligenceError;
}

export interface IntelligenceMetadata {
  /**
   * Timestamp when the request was processed
   */
  readonly processedAt: string;

  /**
   * Duration in milliseconds
   */
  readonly duration: number;

  /**
   * Provider used
   */
  readonly provider: "openai" | "anthropic";

  /**
   * Model used
   */
  readonly model: string;

  /**
   * Total tokens used
   */
  readonly totalTokens?: number;

  /**
   * Estimated cost in USD
   */
  readonly cost?: number;

  /**
   * Additional metadata
   */
  readonly additional?: Record<string, unknown>;
}

export interface IntelligenceError {
  /**
   * Error code
   */
  readonly code: string;

  /**
   * Error message
   */
  readonly message: string;

  /**
   * Error details
   */
  readonly details?: Record<string, unknown>;

  /**
   * Stack trace (for debugging)
   */
  readonly stack?: string;
}
