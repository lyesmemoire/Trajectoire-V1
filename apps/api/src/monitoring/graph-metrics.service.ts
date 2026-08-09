/**
 * Graph Metrics Service
 * Collects and provides graph-specific metrics
 */

import { Injectable } from '@nestjs/common';
import { GraphRepository } from '../runtime/kg/graph-repository.service';
import { StructuredLoggingService } from '../observability/structured-logging.service';

export interface GraphMetrics {
  nodes: {
    total: number;
    byType: Record<string, number>;
  };
  edges: {
    total: number;
    byType: Record<string, number>;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  graphs: {
    total: number;
    active: number;
  };
}

export interface GraphStatistics {
  nodeCount: number;
  edgeCount: number;
  averageDegree: number;
  density: number;
  connectedComponents: number;
}

@Injectable()
export class GraphMetricsService {
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private nodeCount: number = 0;
  private edgeCount: number = 0;
  private nodesByType: Map<string, number> = new Map();
  private edgesByType: Map<string, number> = new Map();

  constructor(
    private readonly graphRepository: GraphRepository,
    private readonly logger: StructuredLoggingService,
  ) {
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    this.nodesByType.set('CANDIDATE', 0);
    this.nodesByType.set('SKILL', 0);
    this.nodesByType.set('EXPERIENCE', 0);
    this.nodesByType.set('EDUCATION', 0);
    this.nodesByType.set('CERTIFICATION', 0);
    this.nodesByType.set('LANGUAGE', 0);
    this.nodesByType.set('PROJECT', 0);
    this.nodesByType.set('COMPANY', 0);
    this.nodesByType.set('LOCATION', 0);
    this.nodesByType.set('TECHNOLOGY', 0);
    this.nodesByType.set('MISSION', 0);
    this.nodesByType.set('RESPONSIBILITY', 0);

    this.edgesByType.set('HAS_SKILL', 0);
    this.edgesByType.set('HAS_EXPERIENCE', 0);
    this.edgesByType.set('HAS_EDUCATION', 0);
    this.edgesByType.set('HAS_CERTIFICATION', 0);
    this.edgesByType.set('SPEAKS_LANGUAGE', 0);
    this.edgesByType.set('WORKED_AT', 0);
    this.edgesByType.set('LOCATED_IN', 0);
    this.edgesByType.set('USES_TECHNOLOGY', 0);
    this.edgesByType.set('PART_OF_PROJECT', 0);
    this.edgesByType.set('HAS_RESPONSIBILITY', 0);
    this.edgesByType.set('REQUIRES_SKILL', 0);
  }

  /**
   * Record cache hit
   */
  recordCacheHit(): void {
    this.cacheHits++;
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(): void {
    this.cacheMisses++;
  }

  /**
   * Get cache metrics
   */
  getCacheMetrics(): { hits: number; misses: number; hitRate: number } {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? this.cacheHits / total : 0;

    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  /**
   * Update node count
   */
  updateNodeCount(count: number): void {
    this.nodeCount = count;
  }

  /**
   * Update edge count
   */
  updateEdgeCount(count: number): void {
    this.edgeCount = count;
  }

  /**
   * Update nodes by type
   */
  updateNodesByType(type: string, count: number): void {
    this.nodesByType.set(type, count);
  }

  /**
   * Update edges by type
   */
  updateEdgesByType(type: string, count: number): void {
    this.edgesByType.set(type, count);
  }

  /**
   * Get node metrics
   */
  getNodeMetrics(): { total: number; byType: Record<string, number> } {
    return {
      total: this.nodeCount,
      byType: Object.fromEntries(this.nodesByType),
    };
  }

  /**
   * Get edge metrics
   */
  getEdgeMetrics(): { total: number; byType: Record<string, number> } {
    return {
      total: this.edgeCount,
      byType: Object.fromEntries(this.edgesByType),
    };
  }

  /**
   * Get graph count
   */
  async getGraphCount(): Promise<{ total: number; active: number }> {
    try {
      // Since GraphRepository doesn't have findAll, we'll use a simplified approach
      // In a real implementation, you would query the database directly or add a method to GraphRepository
      const total = 0; // Placeholder - would be fetched from database
      const active = 0; // Placeholder - would be fetched from database

      return { total, active };
    } catch (error) {
      return { total: 0, active: 0 };
    }
  }

  /**
   * Calculate graph statistics
   */
  calculateGraphStatistics(): GraphStatistics {
    const nodeCount = this.nodeCount;
    const edgeCount = this.edgeCount;
    const averageDegree = nodeCount > 0 ? (2 * edgeCount) / nodeCount : 0;
    const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
    const density = maxPossibleEdges > 0 ? edgeCount / maxPossibleEdges : 0;
    const connectedComponents = this.estimateConnectedComponents();

    return {
      nodeCount,
      edgeCount,
      averageDegree,
      density,
      connectedComponents,
    };
  }

  /**
   * Estimate connected components (simplified estimation)
   */
  private estimateConnectedComponents(): number {
    // This is a simplified estimation
    // In a real implementation, you would perform a graph traversal
    if (this.nodeCount === 0) return 0;
    if (this.edgeCount === 0) return this.nodeCount;
    return Math.max(1, Math.floor(this.nodeCount / (this.edgeCount + 1)));
  }

  /**
   * Get all graph metrics
   */
  async getGraphMetrics(): Promise<GraphMetrics> {
    const nodes = this.getNodeMetrics();
    const edges = this.getEdgeMetrics();
    const cache = this.getCacheMetrics();
    const graphs = await this.getGraphCount();

    return {
      nodes,
      edges,
      cache,
      graphs,
    };
  }

  /**
   * Get graph statistics
   */
  getGraphStatistics(): GraphStatistics {
    return this.calculateGraphStatistics();
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.nodeCount = 0;
    this.edgeCount = 0;
    this.nodesByType.clear();
    this.edgesByType.clear();
    this.initializeMetrics();
  }

  /**
   * Refresh metrics from repository
   */
  async refreshMetrics(): Promise<void> {
    try {
      // Since GraphRepository doesn't have findAll, we'll use a simplified approach
      // In a real implementation, you would query the database directly or add a method to GraphRepository
      // For now, we'll keep the manual updates through the update methods
      this.logger.debug(
        'Graph metrics refresh called - manual updates required',
      );
    } catch (error) {
      this.logger.error('Failed to refresh graph metrics', error as Error);
    }
  }
}
