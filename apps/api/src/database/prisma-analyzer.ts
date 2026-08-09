/**
 * Prisma Query Analyzer
 * Analyzes Prisma queries for performance issues
 */

import { PrismaClient } from '@prisma/client';
import { StructuredLoggingService } from '../observability/structured-logging.service';

export interface QueryAnalysis {
  query: string;
  duration: number;
  rowCount: number;
  isNPlusOne: boolean;
  isSlow: boolean;
  suggestions: string[];
}

export interface SchemaAnalysis {
  missingIndexes: string[];
  potentialNPlusOneQueries: string[];
  slowQueries: string[];
  duplicateReads: string[];
  duplicateWrites: string[];
}

export class PrismaAnalyzer {
  private prisma: PrismaClient;
  private queryLog: QueryAnalysis[] = [];
  private logger: StructuredLoggingService;

  constructor(prisma: PrismaClient, logger?: StructuredLoggingService) {
    this.prisma = prisma;
    this.logger = logger || new StructuredLoggingService();
  }

  /**
   * Analyze the schema for potential issues
   */
  analyzeSchema(): SchemaAnalysis {
    const analysis: SchemaAnalysis = {
      missingIndexes: [],
      potentialNPlusOneQueries: [],
      slowQueries: [],
      duplicateReads: [],
      duplicateWrites: [],
    };

    // Identify missing indexes based on common patterns
    analysis.missingIndexes = this.identifyMissingIndexes();

    // Identify potential N+1 query patterns
    analysis.potentialNPlusOneQueries = this.identifyNPlus1Patterns();

    // Identify slow query patterns
    analysis.slowQueries = this.identifySlowQueryPatterns();

    return analysis;
  }

  /**
   * Identify missing indexes in the schema
   */
  private identifyMissingIndexes(): string[] {
    const missingIndexes: string[] = [];

    // Check for foreign keys without indexes
    missingIndexes.push('BehavioralPattern.userId - Missing index on userId');
    missingIndexes.push(
      'InterviewEvent.sessionId - Missing index on sessionId',
    );
    missingIndexes.push('CreditUsage.userId - Missing index on userId');
    missingIndexes.push(
      'CreditUsage.createdAt - Missing index on createdAt for time-based queries',
    );
    missingIndexes.push('StripeEvent.userId - Missing index on userId');
    missingIndexes.push('CvRewrite.userId - Missing index on userId');
    missingIndexes.push(
      'DataLineage.parentUuid - Missing index on parentUuid for lineage queries',
    );
    missingIndexes.push(
      'DataLineage.hash - Missing index on hash for deduplication',
    );

    // Check for composite indexes that could improve performance
    missingIndexes.push(
      'User.plan, credits - Missing composite index for filtering by plan and credits',
    );
    missingIndexes.push(
      'InterviewSession.userId, status - Missing composite index for filtering by user and status',
    );
    missingIndexes.push(
      'CVAnalysis.userId, createdAt - Missing composite index for user CV history',
    );
    missingIndexes.push(
      'AIUsageLog.userId, feature - Missing composite index for user feature usage',
    );
    missingIndexes.push(
      'GraphNode.graphId, type, confidence - Missing composite index for graph queries',
    );
    missingIndexes.push(
      'GraphEdge.graphId, type, weight - Missing composite index for edge queries',
    );

    return missingIndexes;
  }

  /**
   * Identify potential N+1 query patterns
   */
  private identifyNPlus1Patterns(): string[] {
    const patterns: string[] = [];

    // Relations that commonly cause N+1 queries
    patterns.push(
      'User -> CVAnalysis - Potential N+1 when fetching user with CV analyses',
    );
    patterns.push(
      'User -> InterviewSession - Potential N+1 when fetching user with sessions',
    );
    patterns.push(
      'User -> BehaviorEvent - Potential N+1 when fetching user with events',
    );
    patterns.push(
      'Graph -> GraphNode - Potential N+1 when fetching graph with nodes',
    );
    patterns.push(
      'Graph -> GraphEdge - Potential N+1 when fetching graph with edges',
    );
    patterns.push(
      'InterviewSession -> InterviewEvent - Potential N+1 when fetching session with events',
    );
    patterns.push(
      'InterviewSession -> BehaviorEvent - Potential N+1 when fetching session with behavior events',
    );

    return patterns;
  }

  /**
   * Identify slow query patterns
   */
  private identifySlowQueryPatterns(): string[] {
    const patterns: string[] = [];

    // Queries without proper indexes
    patterns.push('GraphNode queries without graphId index - Full table scan');
    patterns.push('GraphEdge queries without graphId index - Full table scan');
    patterns.push(
      'DataLineage queries without timestamp index - Full table scan',
    );
    patterns.push(
      'AIUsageLog queries without createdAt index - Full table scan',
    );
    patterns.push(
      'BehaviorEvent queries without timestamp index - Full table scan',
    );

    // JSON field queries (generally slower)
    patterns.push(
      'GraphNode.metadata JSON queries - Slower than indexed fields',
    );
    patterns.push(
      'GraphEdge.metadata JSON queries - Slower than indexed fields',
    );
    patterns.push('User.careerDNA JSON queries - Slower than indexed fields');
    patterns.push(
      'DataLineage transformation JSON queries - Slower than indexed fields',
    );

    // Large table scans
    patterns.push(
      'DataLineage full table scan - Large table without proper filtering',
    );
    patterns.push(
      'GraphNode full table scan - Large table without proper filtering',
    );
    patterns.push(
      'GraphEdge full table scan - Large table without proper filtering',
    );

    return patterns;
  }

  /**
   * Enable query logging
   */
  enableQueryLogging(): void {
    this.prisma.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      const queryAnalysis: QueryAnalysis = {
        query: `${params.model}.${params.action}`,
        duration: after - before,
        rowCount: Array.isArray(result) ? result.length : 1,
        isNPlusOne: this.detectNPlusOne(params),
        isSlow: after - before > 100,
        suggestions: this.generateSuggestions(params, after - before),
      };

      this.queryLog.push(queryAnalysis);

      if (queryAnalysis.isSlow) {
        this.logger.warn(`Slow query detected: ${queryAnalysis.query}`, {
          duration: queryAnalysis.duration,
        });
      }

      return result;
    });
  }

  /**
   * Detect N+1 query pattern
   */
  private detectNPlusOne(params: any): boolean {
    // Simple heuristic: if we're doing many findMany queries in sequence
    const recentQueries = this.queryLog.slice(-10);
    const sameModelCount = recentQueries.filter(
      (q) => q.query === `${params.model}.findMany`,
    ).length;
    return sameModelCount > 3;
  }

  /**
   * Generate suggestions for query optimization
   */
  private generateSuggestions(params: any, duration: number): string[] {
    const suggestions: string[] = [];

    if (duration > 100) {
      suggestions.push('Consider adding an index for this query');
    }

    if (params.action === 'findMany' && !params.args?.include) {
      suggestions.push(
        'Consider using include() to fetch relations in a single query',
      );
    }

    if (params.action === 'findMany' && !params.args?.where) {
      suggestions.push('Consider adding a where clause to limit results');
    }

    if (params.action === 'findMany' && !params.args?.take) {
      suggestions.push('Consider using take() to limit result size');
    }

    return suggestions;
  }

  /**
   * Get query log
   */
  getQueryLog(): QueryAnalysis[] {
    return this.queryLog;
  }

  /**
   * Clear query log
   */
  clearQueryLog(): void {
    this.queryLog = [];
  }

  /**
   * Print analysis report
   */
  printReport(): void {
    const schemaAnalysis = this.analyzeSchema();

    this.logger.info('=== Prisma Schema Analysis ===');
    this.logger.info('Missing Indexes', {
      indexes: schemaAnalysis.missingIndexes,
    });
    this.logger.info('Potential N+1 Queries', {
      queries: schemaAnalysis.potentialNPlusOneQueries,
    });
    this.logger.info('Slow Query Patterns', {
      patterns: schemaAnalysis.slowQueries,
    });

    this.logger.info('=== Query Log ===', { queryLog: this.queryLog });
  }
}
