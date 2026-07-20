/**
 * Hierarchical Memory Engine
 * Structured memory system
 */

import {
  MemoryType,
  MemoryEntry,
  MemoryConsolidation,
  MemoryCompression,
  MemoryImportance,
  MemoryAging,
  MemoryForgetting,
  MemoryRecall,
  MemorySearch,
  MemoryAssociation,
  MemoryLink,
  HierarchicalMemoryConfig,
  defaultHierarchicalMemoryConfig,
} from "./interfaces/IHierarchicalMemory";

// ============================================================================
// HIERARCHICAL MEMORY ENGINE CLASS
// ============================================================================

export class HierarchicalMemoryEngine {
  private static instance: HierarchicalMemoryEngine;
  private config: HierarchicalMemoryConfig;
  private memories: Map<string, MemoryEntry> = new Map();
  private memoryLinks: Map<string, MemoryLink> = new Map();
  private consolidations: Map<string, MemoryConsolidation> = new Map();
  private compressions: Map<string, MemoryCompression> = new Map();
  private importanceScores: Map<string, MemoryImportance> = new Map();
  private agingData: Map<string, MemoryAging> = new Map();
  private forgettingData: Map<string, MemoryForgetting> = new Map();
  private recallHistory: Map<string, MemoryRecall> = new Map();

  private constructor() {
    this.config = defaultHierarchicalMemoryConfig;
  }

  static getInstance(): HierarchicalMemoryEngine {
    if (!HierarchicalMemoryEngine.instance) {
      HierarchicalMemoryEngine.instance = new HierarchicalMemoryEngine();
    }
    return HierarchicalMemoryEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<HierarchicalMemoryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Store memory
   */
  storeMemory(type: MemoryType, content: unknown, metadata: Record<string, unknown> = {}): string {
    const memoryId = `memory_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const memory: MemoryEntry = {
      id: memoryId,
      type,
      content,
      metadata,
      importance: 0.5,
      accessCount: 0,
      lastAccessed: new Date(),
      createdAt: new Date(),
      expiresAt: this.calculateExpiration(type),
      associations: [],
    };

    this.memories.set(memoryId, memory);

    // Calculate initial importance
    this.calculateImportance(memoryId);

    return memoryId;
  }

  /**
   * Calculate expiration
   */
  private calculateExpiration(type: MemoryType): Date | null {
    const now = new Date();

    switch (type) {
      case "short_term":
        return new Date(now.getTime() + 3600000); // 1 hour
      case "working":
        return new Date(now.getTime() + 1800000); // 30 minutes
      case "session":
        return new Date(now.getTime() + 86400000); // 24 hours
      case "long_term":
      case "semantic":
      case "procedural":
        return null; // No expiration
      default:
        return new Date(now.getTime() + 604800000); // 7 days
    }
  }

  /**
   * Retrieve memory
   */
  retrieveMemory(memoryId: string): MemoryEntry | null {
    const memory = this.memories.get(memoryId);

    if (!memory) {
      return null;
    }

    // Check if expired
    if (memory.expiresAt && new Date() > memory.expiresAt) {
      this.memories.delete(memoryId);
      return null;
    }

    // Update access count and last accessed
    memory.accessCount++;
    memory.lastAccessed = new Date();

    // Record recall
    this.recordRecall(memoryId, true, 0, 1.0);

    return memory;
  }

  /**
   * Search memories
   */
  searchMemories(query: string, memoryType: MemoryType | null = null, filters: Record<string, unknown> = {}): MemorySearch {
    const startTime = Date.now();
    const results: MemoryEntry[] = [];

    this.memories.forEach(memory => {
      // Filter by type
      if (memoryType && memory.type !== memoryType) {
        return;
      }

      // Filter by metadata
      let matchesFilters = true;
      Object.entries(filters).forEach(([key, value]) => {
        if (memory.metadata[key] !== value) {
          matchesFilters = false;
        }
      });

      if (!matchesFilters) {
        return;
      }

      // Search in content
      const contentStr = JSON.stringify(memory.content).toLowerCase();
      const metadataStr = JSON.stringify(memory.metadata).toLowerCase();
      const queryLower = query.toLowerCase();

      if (contentStr.includes(queryLower) || metadataStr.includes(queryLower)) {
        results.push(memory);
      }
    });

    // Sort by importance
    results.sort((a, b) => b.importance - a.importance);

    return {
      query,
      memoryType,
      filters,
      results,
      totalResults: results.length,
      searchTime: Date.now() - startTime,
      timestamp: new Date(),
    };
  }

  /**
   * Calculate importance
   */
  private calculateImportance(memoryId: string): void {
    const memory = this.memories.get(memoryId);
    if (!memory) return;

    const factors = {
      frequency: Math.min(memory.accessCount / 10, 1),
      recency: this.calculateRecency(memory.lastAccessed),
      relevance: 0.7, // Placeholder
      emotional: 0.5, // Placeholder
      utility: 0.6, // Placeholder
    };

    const importance =
      factors.frequency * 0.3 +
      factors.recency * 0.3 +
      factors.relevance * 0.2 +
      factors.emotional * 0.1 +
      factors.utility * 0.1;

    memory.importance = importance;

    this.importanceScores.set(memoryId, {
      memoryId,
      importance,
      factors,
      lastCalculated: new Date(),
    });
  }

  /**
   * Calculate recency
   */
  private calculateRecency(lastAccessed: Date): number {
    const hoursSinceAccess = (Date.now() - lastAccessed.getTime()) / (1000 * 60 * 60);
    return Math.max(0, 1 - hoursSinceAccess / 24); // Decay over 24 hours
  }

  /**
   * Consolidate memory
   */
  consolidateMemory(memoryId: string, targetType: MemoryType): MemoryConsolidation | null {
    const memory = this.memories.get(memoryId);
    if (!memory) return null;

    const consolidationId = `consolidation_${memoryId}_${Date.now()}`;
    const consolidationStrategy = this.selectConsolidationStrategy(memory.type, targetType);

    let newMemoryId: string | null = null;

    switch (consolidationStrategy) {
      case "summarize":
        newMemoryId = this.summarizeMemory(memory, targetType);
        break;
      case "compress":
        newMemoryId = this.compressMemory(memory, targetType);
        break;
      case "extract":
        newMemoryId = this.extractMemory(memory, targetType);
        break;
      case "merge":
        newMemoryId = this.mergeMemory(memory, targetType);
        break;
    }

    const consolidation: MemoryConsolidation = {
      id: consolidationId,
      sourceMemoryId: memoryId,
      targetMemoryType: targetType,
      consolidationStrategy,
      timestamp: new Date(),
      success: newMemoryId !== null,
      newMemoryId,
    };

    this.consolidations.set(consolidationId, consolidation);

    return consolidation;
  }

  /**
   * Select consolidation strategy
   */
  private selectConsolidationStrategy(sourceType: MemoryType, targetType: MemoryType): "summarize" | "compress" | "extract" | "merge" {
    if (sourceType === "short_term" && targetType === "long_term") {
      return "summarize";
    }
    if (sourceType === "working" && targetType === "session") {
      return "compress";
    }
    if (sourceType === "session" && targetType === "episodic") {
      return "extract";
    }
    return "merge";
  }

  /**
   * Summarize memory
   */
  private summarizeMemory(memory: MemoryEntry, targetType: MemoryType): string | null {
    const summary = {
      type: targetType,
      content: `Summary of ${memory.type}: ${JSON.stringify(memory.content).substring(0, 100)}...`,
      metadata: { ...memory.metadata, summarizedFrom: memory.id },
    };

    return this.storeMemory(targetType, summary, summary.metadata);
  }

  /**
   * Compress memory
   */
  private compressMemory(memory: MemoryEntry, targetType: MemoryType): string | null {
    const compressed = {
      type: targetType,
      content: memory.content,
      metadata: { ...memory.metadata, compressedFrom: memory.id },
    };

    const newMemoryId = this.storeMemory(targetType, compressed, compressed.metadata);

    // Record compression
    const originalSize = JSON.stringify(memory.content).length;
    const compressedSize = JSON.stringify(compressed.content).length;

    this.compressions.set(`compression_${memory.id}`, {
      id: `compression_${memory.id}`,
      memoryId: memory.id,
      originalSize,
      compressedSize,
      compressionRatio: compressedSize / originalSize,
      compressionMethod: "lossless",
      timestamp: new Date(),
    });

    return newMemoryId;
  }

  /**
   * Extract memory
   */
  private extractMemory(memory: MemoryEntry, targetType: MemoryType): string | null {
    const extracted = {
      type: targetType,
      content: memory.content,
      metadata: { ...memory.metadata, extractedFrom: memory.id },
    };

    return this.storeMemory(targetType, extracted, extracted.metadata);
  }

  /**
   * Merge memory
   */
  private mergeMemory(memory: MemoryEntry, targetType: MemoryType): string | null {
    const merged = {
      type: targetType,
      content: memory.content,
      metadata: { ...memory.metadata, mergedFrom: memory.id },
    };

    return this.storeMemory(targetType, merged, merged.metadata);
  }

  /**
   * Age memories
   */
  ageMemories(): void {
    const now = Date.now();

    this.memories.forEach(memory => {
      const age = now - memory.createdAt.getTime();
      const decayRate = this.config.forgettingCurveDecay;

      const currentImportance = memory.importance * Math.pow(1 - decayRate, age / this.config.agingInterval);

      memory.importance = Math.max(currentImportance, 0);

      this.agingData.set(memory.id, {
        memoryId: memory.id,
        age,
        decayRate,
        currentImportance: memory.importance,
        lastAged: new Date(),
      });

      // Remove if below threshold
      if (memory.importance < this.config.importanceThreshold && memory.type !== "long_term") {
        this.memories.delete(memory.id);
      }
    });
  }

  /**
   * Calculate forgetting curve
   */
  calculateForgetting(memoryId: string): MemoryForgetting | null {
    const memory = this.memories.get(memoryId);
    if (!memory) return null;

    const timeSinceLastAccess = Date.now() - memory.lastAccessed.getTime();
    const forgettingCurve = Math.exp(-this.config.forgettingCurveDecay * timeSinceLastAccess / 86400000);
    const retentionProbability = 1 - forgettingCurve;

    const estimatedForgetTime = new Date(
      memory.lastAccessed.getTime() + (Math.log(0.5) / -this.config.forgettingCurveDecay) * 86400000
    );

    const forgetting: MemoryForgetting = {
      memoryId,
      forgettingCurve,
      retentionProbability,
      timeSinceLastAccess,
      estimatedForgetTime,
    };

    this.forgettingData.set(memoryId, forgetting);

    return forgetting;
  }

  /**
   * Record recall
   */
  private recordRecall(memoryId: string, success: boolean, recallTime: number, accuracy: number): void {
    const recall: MemoryRecall = {
      memoryId,
      recallSuccess: success,
      recallTime,
      recallAccuracy: accuracy,
      context: {},
      timestamp: new Date(),
    };

    this.recallHistory.set(`recall_${memoryId}_${Date.now()}`, recall);
  }

  /**
   * Create memory association
   */
  createAssociation(sourceMemoryId: string, targetMemoryId: string, associationStrength: number, associationType: "semantic" | "temporal" | "causal" | "spatial" | "emotional"): void {
    const sourceMemory = this.memories.get(sourceMemoryId);
    const targetMemory = this.memories.get(targetMemoryId);

    if (!sourceMemory || !targetMemory) return;

    // Add to source associations
    if (!sourceMemory.associations.includes(targetMemoryId)) {
      sourceMemory.associations.push(targetMemoryId);
    }

    // Add to target associations if bidirectional
    if (!targetMemory.associations.includes(sourceMemoryId)) {
      targetMemory.associations.push(sourceMemoryId);
    }

    // Create memory link
    const linkId = `link_${sourceMemoryId}_${targetMemoryId}`;
    this.memoryLinks.set(linkId, {
      id: linkId,
      sourceMemoryId,
      targetMemoryId,
      linkType: associationType,
      weight: associationStrength,
      bidirectional: true,
      createdAt: new Date(),
    });
  }

  /**
   * Get associated memories
   */
  getAssociatedMemories(memoryId: string): MemoryEntry[] {
    const memory = this.memories.get(memoryId);
    if (!memory) return [];

    return memory.associations.map(id => this.memories.get(id)).filter(Boolean) as MemoryEntry[];
  }

  /**
   * Get memories by type
   */
  getMemoriesByType(type: MemoryType): MemoryEntry[] {
    return Array.from(this.memories.values()).filter(memory => memory.type === type);
  }

  /**
   * Clear expired memories
   */
  clearExpiredMemories(): void {
    const now = new Date();

    this.memories.forEach((memory, memoryId) => {
      if (memory.expiresAt && now > memory.expiresAt) {
        this.memories.delete(memoryId);
      }
    });
  }

  /**
   * Clear all memories
   */
  clearAllMemories(): void {
    this.memories.clear();
    this.memoryLinks.clear();
    this.consolidations.clear();
    this.compressions.clear();
    this.importanceScores.clear();
    this.agingData.clear();
    this.forgettingData.clear();
    this.recallHistory.clear();
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalMemories: number;
    memoriesByType: Record<string, number>;
    totalLinks: number;
    totalConsolidations: number;
    totalCompressions: number;
    averageImportance: number;
    expiredMemories: number;
  } {
    const totalMemories = this.memories.size;
    const memoriesByType: Record<string, number> = {};

    this.memories.forEach(memory => {
      memoriesByType[memory.type] = (memoriesByType[memory.type] || 0) + 1;
    });

    const totalLinks = this.memoryLinks.size;
    const totalConsolidations = this.consolidations.size;
    const totalCompressions = this.compressions.size;

    const averageImportance = totalMemories > 0
      ? Array.from(this.memories.values()).reduce((sum, memory) => sum + memory.importance, 0) / totalMemories
      : 0;

    const now = new Date();
    const expiredMemories = Array.from(this.memories.values()).filter(
      memory => memory.expiresAt && now > memory.expiresAt
    ).length;

    return {
      totalMemories,
      memoriesByType,
      totalLinks,
      totalConsolidations,
      totalCompressions,
      averageImportance,
      expiredMemories,
    };
  }
}

export const hierarchicalMemoryEngine = HierarchicalMemoryEngine.getInstance();
