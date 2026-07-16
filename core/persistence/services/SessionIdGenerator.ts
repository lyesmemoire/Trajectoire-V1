/**
 * Session ID Generator
 *
 * Generates unique session IDs.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY ID generation.
 */

// ============================================================================
// SESSION ID GENERATOR INTERFACE
// ============================================================================

export interface SessionIdGenerator {
  /**
   * Generate a unique session ID
   */
  generate(): string;
}

// ============================================================================
// SESSION ID GENERATOR IMPLEMENTATION
// ============================================================================

export class SessionIdGeneratorImpl implements SessionIdGenerator {
  generate(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
