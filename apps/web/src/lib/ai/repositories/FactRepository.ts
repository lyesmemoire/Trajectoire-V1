// ===================================================================
// FACT REPOSITORY — Abstraction for Fact Storage
// ===================================================================

export interface Fact {
  id: string;
  type: string;
  category?: string;
  data?: any;
  confidence?: number;
  timestamp?: Date;
  createdAt?: Date;
  sessionId?: string;
  entityId?: string;
}

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

export interface FactRepository {
  /**
   * Find facts by type
   */
  findFactsByType<T>(factType: string, options?: FactQueryOptions): FactQueryResult<T>;

  /**
   * Find facts by entity ID
   */
  findFactsByEntity<T>(entityId: string, options?: FactQueryOptions): FactQueryResult<T>;

  /**
   * Find latest facts (most recent by timestamp)
   */
  findLatestFacts<T>(factType?: string, options?: FactQueryOptions): FactQueryResult<T>;

  /**
   * Find a specific fact by ID
   */
  findById(id: string): Fact | undefined;

  /**
   * Find facts by session ID
   */
  findBySession(sessionId: string, options?: FactQueryOptions): FactQueryResult<Fact>;

  /**
   * Find facts by confidence threshold
   */
  findByConfidence(minConfidence: number, options?: FactQueryOptions): FactQueryResult<Fact>;

  /**
   * Find related facts (by entity, category, or content)
   */
  findRelated(factId: string, options?: FactQueryOptions): FactQueryResult<Fact>;

  /**
   * Get all facts
   */
  getAll(): Fact[];

  /**
   * Add a fact
   */
  add(fact: Fact): void;

  /**
   * Add multiple facts
   */
  addAll(facts: Fact[]): void;

  /**
   * Remove a fact by ID
   */
  remove(id: string): boolean;

  /**
   * Clear all facts
   */
  clear(): void;

  /**
   * Get statistics
   */
  getStatistics(): {
    totalFacts: number;
    factsByType: Record<string, number>;
    factsByCategory: Record<string, number>;
    averageConfidence: number;
  };
}
