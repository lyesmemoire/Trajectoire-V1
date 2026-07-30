import type { FactRepository, Fact, FactQueryOptions, FactQueryResult } from "../repositories/FactRepository";

// ===================================================================
// FACT QUERY SERVICE — Unified API for Fact Queries
// ===================================================================

export class FactQueryService {
  constructor(private readonly repository: FactRepository) {}

  /**
   * Find facts by type (ObservationFacts, EntityFacts, EvidenceAssessments, etc.)
   */
  findFactsByType<T>(factType: string, options?: FactQueryOptions): FactQueryResult<T> {
    return this.repository.findFactsByType<T>(factType, options);
  }

  /**
   * Find facts by entity ID
   */
  findFactsByEntity<T>(entityId: string, options?: FactQueryOptions): FactQueryResult<T> {
    return this.repository.findFactsByEntity<T>(entityId, options);
  }

  /**
   * Find latest facts (most recent by timestamp)
   */
  findLatestFacts<T>(factType?: string, options?: FactQueryOptions): FactQueryResult<T> {
    return this.repository.findLatestFacts<T>(factType, options);
  }

  /**
   * Find a specific observation by ID
   */
  findObservation(observationId: string): any | undefined {
    return this.repository.findById(observationId);
  }

  /**
   * Find all observations for a session
   */
  findObservationsBySession(sessionId: string, options?: FactQueryOptions): FactQueryResult<any> {
    return this.repository.findBySession(sessionId, options);
  }

  /**
   * Find evidence assessments
   */
  findEvidence(options?: FactQueryOptions): FactQueryResult<any> {
    return this.repository.findFactsByType("EVIDENCE_ASSESSMENT", options);
  }

  /**
   * Find evidence for a specific observation
   */
  findEvidenceByObservation(observationId: string): any | undefined {
    const evidence = this.repository.findBySession(observationId);
    return evidence.facts.find((ev: any) => ev.originObservationId === observationId);
  }

  /**
   * Find timeline facts (chronological events)
   */
  findTimeline(options?: FactQueryOptions): FactQueryResult<any> {
    return this.repository.findFactsByType("TIMELINE", options);
  }

  /**
   * Find facts related to a given fact (by entity, category, or content similarity)
   */
  findRelatedFacts<T>(factId: string, options?: FactQueryOptions): FactQueryResult<T> {
    return this.repository.findRelated(factId, options) as FactQueryResult<T>;
  }

  /**
   * Find facts by confidence threshold
   */
  findFactsByConfidence<T>(minConfidence: number, options?: FactQueryOptions): FactQueryResult<T> {
    return this.repository.findByConfidence(minConfidence, options) as FactQueryResult<T>;
  }

  /**
   * Get statistics about facts in the current state
   */
  getStatistics(): {
    totalFacts: number;
    factsByType: Record<string, number>;
    factsByCategory: Record<string, number>;
    averageConfidence: number;
  } {
    return this.repository.getStatistics();
  }
}
