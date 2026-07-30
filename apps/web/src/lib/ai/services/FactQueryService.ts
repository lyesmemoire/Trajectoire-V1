import { CognitiveState } from "../../../domain/cognitive/CognitiveState";

// ===================================================================
// FACT QUERY SERVICE — Unified API for Fact Queries
// ===================================================================

export interface FactQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: "timestamp" | "confidence" | "relevance";
  orderDirection?: "asc" | "desc";
}

export interface FactQueryResult<T> {
  facts: T[];
  total: number;
  hasMore: boolean;
}

export class FactQueryService {
  constructor(private readonly state: CognitiveState) {}

  /**
   * Find facts by type (ObservationFacts, EntityFacts, EvidenceAssessments, etc.)
   */
  findFactsByType<T>(factType: string, options?: FactQueryOptions): FactQueryResult<T> {
    const allFacts = this.getAllFacts();
    const typedFacts = allFacts.filter((fact: any) => fact.type === factType) as T[];

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? typedFacts.slice(offset, offset + limit)
      : typedFacts;

    return {
      facts: paginatedFacts,
      total: typedFacts.length,
      hasMore: limit ? offset + limit < typedFacts.length : false,
    };
  }

  /**
   * Find facts by entity ID
   */
  findFactsByEntity<T>(entityId: string, options?: FactQueryOptions): FactQueryResult<T> {
    const allFacts = this.getAllFacts();
    const entityFacts = allFacts.filter((fact: any) => 
      fact.data?.entityId === entityId || fact.entityId === entityId
    ) as T[];

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? entityFacts.slice(offset, offset + limit)
      : entityFacts;

    return {
      facts: paginatedFacts,
      total: entityFacts.length,
      hasMore: limit ? offset + limit < entityFacts.length : false,
    };
  }

  /**
   * Find latest facts (most recent by timestamp)
   */
  findLatestFacts<T>(factType?: string, options?: FactQueryOptions): FactQueryResult<T> {
    const allFacts = this.getAllFacts();
    let filteredFacts = factType 
      ? allFacts.filter((fact: any) => fact.type === factType)
      : allFacts;

    // Sort by timestamp descending
    filteredFacts.sort((a: any, b: any) => {
      const timeA = a.timestamp || a.createdAt || 0;
      const timeB = b.timestamp || b.createdAt || 0;
      return timeB - timeA;
    }) as T[];

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? filteredFacts.slice(offset, offset + limit)
      : filteredFacts;

    return {
      facts: paginatedFacts,
      total: filteredFacts.length,
      hasMore: limit ? offset + limit < filteredFacts.length : false,
    };
  }

  /**
   * Find a specific observation by ID
   */
  findObservation(observationId: string): any | undefined {
    const observations = this.findFactsByType("OBSERVATION");
    return observations.facts.find((obs: any) => obs.id === observationId);
  }

  /**
   * Find all observations for a session
   */
  findObservationsBySession(sessionId: string, options?: FactQueryOptions): FactQueryResult<any> {
    const allFacts = this.getAllFacts();
    const sessionObservations = allFacts.filter((fact: any) => 
      fact.type === "OBSERVATION" && fact.sessionId === sessionId
    );

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? sessionObservations.slice(offset, offset + limit)
      : sessionObservations;

    return {
      facts: paginatedFacts,
      total: sessionObservations.length,
      hasMore: limit ? offset + limit < sessionObservations.length : false,
    };
  }

  /**
   * Find evidence assessments
   */
  findEvidence(options?: FactQueryOptions): FactQueryResult<any> {
    return this.findFactsByType("EVIDENCE_ASSESSMENT", options);
  }

  /**
   * Find evidence for a specific observation
   */
  findEvidenceByObservation(observationId: string): any | undefined {
    const evidence = this.findEvidence();
    return evidence.facts.find((ev: any) => ev.originObservationId === observationId);
  }

  /**
   * Find timeline facts (chronological events)
   */
  findTimeline(options?: FactQueryOptions): FactQueryResult<any> {
    const allFacts = this.getAllFacts();
    const timelineFacts = allFacts.filter((fact: any) => 
      fact.type === "TIMELINE" || fact.category === "timeline"
    );

    // Sort by timestamp ascending
    timelineFacts.sort((a: any, b: any) => {
      const timeA = a.timestamp || a.createdAt || 0;
      const timeB = b.timestamp || b.createdAt || 0;
      return timeA - timeB;
    });

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? timelineFacts.slice(offset, offset + limit)
      : timelineFacts;

    return {
      facts: paginatedFacts,
      total: timelineFacts.length,
      hasMore: limit ? offset + limit < timelineFacts.length : false,
    };
  }

  /**
   * Find facts related to a given fact (by entity, category, or content similarity)
   */
  findRelatedFacts<T>(factId: string, options?: FactQueryOptions): FactQueryResult<T> {
    const targetFact = this.getAllFacts().find((fact: any) => fact.id === factId);
    if (!targetFact) {
      return { facts: [], total: 0, hasMore: false };
    }

    const allFacts = this.getAllFacts();
    const relatedFacts: any[] = [];

    for (const fact of allFacts) {
      if (fact.id === factId) continue;

      // Related by entity
      if (targetFact.data?.entityId && fact.data?.entityId === targetFact.data.entityId) {
        relatedFacts.push(fact);
        continue;
      }

      // Related by category
      if (targetFact.category && fact.category === targetFact.category) {
        relatedFacts.push(fact);
        continue;
      }

      // Related by content similarity (simple check)
      if (targetFact.data?.content && fact.data?.content) {
        const content1 = targetFact.data.content.toLowerCase();
        const content2 = fact.data.content.toLowerCase();
        const words1 = content1.split(/\s+/);
        const words2 = content2.split(/\s+/);
        const commonWords = words1.filter((word: string) => words2.includes(word));
        if (commonWords.length > 2) {
          relatedFacts.push(fact);
        }
      }
    }

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? relatedFacts.slice(offset, offset + limit)
      : relatedFacts;

    return {
      facts: paginatedFacts as T[],
      total: relatedFacts.length,
      hasMore: limit ? offset + limit < relatedFacts.length : false,
    };
  }

  /**
   * Find facts by confidence threshold
   */
  findFactsByConfidence<T>(minConfidence: number, options?: FactQueryOptions): FactQueryResult<T> {
    const allFacts = this.getAllFacts();
    const confidentFacts = allFacts.filter((fact: any) => 
      (fact.confidence || 0) >= minConfidence
    ) as T[];

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? confidentFacts.slice(offset, offset + limit)
      : confidentFacts;

    return {
      facts: paginatedFacts,
      total: confidentFacts.length,
      hasMore: limit ? offset + limit < confidentFacts.length : false,
    };
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
    const allFacts = this.getAllFacts();
    const factsByType: Record<string, number> = {};
    const factsByCategory: Record<string, number> = {};
    let totalConfidence = 0;
    let confidenceCount = 0;

    for (const fact of allFacts) {
      const type = fact.type || "unknown";
      factsByType[type] = (factsByType[type] || 0) + 1;

     const category = fact.category || "unknown";
      factsByCategory[category] = (factsByCategory[category] || 0) + 1;

      if (fact.confidence !== undefined) {
        totalConfidence += fact.confidence;
        confidenceCount++;
      }
    }

    return {
      totalFacts: allFacts.length,
      factsByType,
      factsByCategory,
      averageConfidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0,
    };
  }

  /**
   * Helper method to get all facts from the state
   * This aggregates facts from various sources in the CognitiveState
   */
  private getAllFacts(): any[] {
    const facts: any[] = [];

    // Add knowledge graph nodes (entities, observations, etc.)
    if (this.state.knowledgeGraph) {
      facts.push(...this.state.knowledgeGraph.nodes);
    }

    // Add evidences
    if (this.state.evidences) {
      facts.push(...this.state.evidences);
    }

    // Add hypotheses
    if (this.state.hypotheses) {
      facts.push(...this.state.hypotheses);
    }

    // Add unknowns
    if (this.state.unknowns) {
      facts.push(...this.state.unknowns);
    }

    // Add weak signals
    if (this.state.weakSignals) {
      facts.push(...this.state.weakSignals);
    }

    // Add risks
    if (this.state.risks) {
      facts.push(...this.state.risks);
    }

    // Add decisions
    if (this.state.decisions) {
      facts.push(...this.state.decisions);
    }

    return facts;
  }
}
