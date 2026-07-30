import { FactRepository, Fact, FactQueryOptions, FactQueryResult } from "./FactRepository";

// ===================================================================
// MEMORY FACT REPOSITORY — In-Memory Implementation of FactRepository
// ===================================================================

export class MemoryFactRepository implements FactRepository {
  private facts: Map<string, Fact> = new Map();

  findFactsByType<T>(factType: string, options?: FactQueryOptions): FactQueryResult<T> {
    const allFacts = this.getAll();
    const typedFacts = allFacts.filter((fact) => fact.type === factType) as T[];

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

  findFactsByEntity<T>(entityId: string, options?: FactQueryOptions): FactQueryResult<T> {
    const allFacts = this.getAll();
    const entityFacts = allFacts.filter(
      (fact) => fact.data?.entityId === entityId || fact.entityId === entityId
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

  findLatestFacts<T>(factType?: string, options?: FactQueryOptions): FactQueryResult<T> {
    const allFacts = this.getAll();
    let filteredFacts = factType 
      ? allFacts.filter((fact) => fact.type === factType)
      : allFacts;

    // Sort by timestamp descending
    filteredFacts.sort((a, b) => {
      const timeA = a.timestamp?.getTime() || a.createdAt?.getTime() || 0;
      const timeB = b.timestamp?.getTime() || b.createdAt?.getTime() || 0;
      return timeB - timeA;
    });

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? filteredFacts.slice(offset, offset + limit)
      : filteredFacts;

    return {
      facts: paginatedFacts as T[],
      total: filteredFacts.length,
      hasMore: limit ? offset + limit < filteredFacts.length : false,
    };
  }

  findById(id: string): Fact | undefined {
    return this.facts.get(id);
  }

  findBySession(sessionId: string, options?: FactQueryOptions): FactQueryResult<Fact> {
    const allFacts = this.getAll();
    const sessionFacts = allFacts.filter((fact) => fact.sessionId === sessionId);

    const { limit, offset = 0 } = options || {};
    const paginatedFacts = limit 
      ? sessionFacts.slice(offset, offset + limit)
      : sessionFacts;

    return {
      facts: paginatedFacts,
      total: sessionFacts.length,
      hasMore: limit ? offset + limit < sessionFacts.length : false,
    };
  }

  findByConfidence(minConfidence: number, options?: FactQueryOptions): FactQueryResult<Fact> {
    const allFacts = this.getAll();
    const confidentFacts = allFacts.filter((fact) => (fact.confidence || 0) >= minConfidence);

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

  findRelated(factId: string, options?: FactQueryOptions): FactQueryResult<Fact> {
    const targetFact = this.findById(factId);
    if (!targetFact) {
      return { facts: [], total: 0, hasMore: false };
    }

    const allFacts = this.getAll();
    const relatedFacts: Fact[] = [];

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
      facts: paginatedFacts,
      total: relatedFacts.length,
      hasMore: limit ? offset + limit < relatedFacts.length : false,
    };
  }

  getAll(): Fact[] {
    return Array.from(this.facts.values());
  }

  add(fact: Fact): void {
    this.facts.set(fact.id, fact);
  }

  addAll(facts: Fact[]): void {
    for (const fact of facts) {
      this.facts.set(fact.id, fact);
    }
  }

  remove(id: string): boolean {
    return this.facts.delete(id);
  }

  clear(): void {
    this.facts.clear();
  }

  getStatistics(): {
    totalFacts: number;
    factsByType: Record<string, number>;
    factsByCategory: Record<string, number>;
    averageConfidence: number;
  } {
    const allFacts = this.getAll();
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
}
