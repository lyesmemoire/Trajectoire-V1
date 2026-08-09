/**
 * Recruiter Search Service
 * Hybrid search engine combining Knowledge Graph, Semantic Search, Vector Search, and BM25
 */

import { Injectable } from '@nestjs/common';
import {
  Graph,
  Node,
  Edge,
  NodeType,
  EdgeType,
} from '../runtime/kg/graph-types';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { CacheService } from '../cache/cache.decorator';

// ============================================================================
// INTERFACES
// ============================================================================

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  facets?: FacetConfig;
  pagination?: PaginationOptions;
  ranking?: RankingConfig;
}

export interface SearchFilters {
  skills?: string[];
  experience?: { min?: number; max?: number };
  education?: string[];
  location?: string[];
  languages?: string[];
  salary?: { min?: number; max?: number };
  contractType?: string[];
  remote?: boolean;
}

export interface FacetConfig {
  skills?: boolean;
  experience?: boolean;
  education?: boolean;
  location?: boolean;
  languages?: boolean;
  salary?: boolean;
  contractType?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'score';
  sortOrder?: 'asc' | 'desc';
}

export interface RankingConfig {
  weights?: {
    graph?: number;
    semantic?: number;
    vector?: number;
    bm25?: number;
  };
}

export interface SearchResult {
  id: string;
  type: 'candidate' | 'job';
  score: number;
  graph: Graph;
  matchReason: string[];
  rankingDetails: RankingDetails;
}

export interface RankingDetails {
  graphScore: number;
  semanticScore: number;
  vectorScore: number;
  bm25Score: number;
  finalScore: number;
}

export interface Facet {
  name: string;
  field: string;
  values: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
  selected: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  facets: Facet[];
  pagination: PaginationMeta;
  suggestions: Suggestion[];
  queryTime: number;
}

export interface Suggestion {
  text: string;
  type: 'skill' | 'job' | 'location' | 'company';
  score: number;
}

export interface SearchHistoryEntry {
  id: string;
  userId: string;
  query: string;
  timestamp: Date;
  resultCount: number;
  filters: SearchFilters | null;
}

export interface PopularSearch {
  query: string;
  count: number;
  lastUsed: Date;
}

// ============================================================================
// SERVICE
// ============================================================================

@Injectable()
export class RecruiterSearchService {
  private searchHistory: Map<string, SearchHistoryEntry[]> = new Map();
  private popularSearches: Map<string, number> = new Map();
  private readonly MAX_HISTORY_PER_USER = 50;
  private readonly MAX_POPULAR_SEARCHES = 100;

  constructor(
    private readonly graphSearchService: GraphSearchService,
    private readonly graphMatchingService: GraphMatchingService,
    private readonly cacheService: CacheService,
  ) {}

  // ============================================================================
  // HYBRID SEARCH
  // ============================================================================

  /**
   * Main search method combining all search strategies
   */
  async search(
    query: SearchQuery,
    targetGraphs: Graph[],
    userId?: string,
  ): Promise<SearchResponse> {
    const startTime = Date.now();

    // Record search in history
    if (userId) {
      this.recordSearchHistory(userId, query);
      this.updatePopularSearches(query.query);
    }

    const cacheKey = this.cacheService.generateKey(
      'recruiter_search',
      query.query,
      JSON.stringify(query.filters),
      query.pagination?.page || 1,
      query.pagination?.limit || 20,
    );

    const cached = await this.cacheService.get<SearchResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Execute all search strategies in parallel
    const [graphResults, semanticResults, vectorResults, bm25Results] =
      await Promise.all([
        this.executeGraphSearch(query, targetGraphs),
        this.executeSemanticSearch(query, targetGraphs),
        this.executeVectorSearch(query, targetGraphs),
        this.executeBM25Search(query, targetGraphs),
      ]);

    // Combine and rank results
    const rankedResults = this.rankResults(
      graphResults,
      semanticResults,
      vectorResults,
      bm25Results,
      query.ranking,
    );

    // Apply filters
    const filteredResults = this.applyFilters(rankedResults, query.filters);

    // Apply pagination
    const { paginatedResults, pagination } = this.applyPagination(
      filteredResults,
      query.pagination,
    );

    // Generate facets
    const facets = this.generateFacets(filteredResults, query.facets);

    // Generate suggestions
    const suggestions = this.generateSuggestions(query.query, targetGraphs);

    const response: SearchResponse = {
      results: paginatedResults,
      facets,
      pagination,
      suggestions,
      queryTime: Date.now() - startTime,
    };

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, response, 300);

    return response;
  }

  // ============================================================================
  // SEARCH STRATEGIES
  // ============================================================================

  private async executeGraphSearch(
    query: SearchQuery,
    graphs: Graph[],
  ): Promise<SearchResult[]> {
    if (graphs.length === 0) return [];
    const referenceGraph = graphs[0];
    if (!referenceGraph) return [];
    const results =
      await this.graphSearchService.searchCandidatesByNeighborhood(
        referenceGraph, // Use first graph as reference
        graphs.slice(1),
        { limit: 100 },
      );

    return results.map((r) => ({
      id: r.id,
      type: 'candidate' as const,
      score: r.score,
      graph: r.graph,
      matchReason: r.matchReason,
      rankingDetails: {
        graphScore: r.score,
        semanticScore: 0,
        vectorScore: 0,
        bm25Score: 0,
        finalScore: r.score,
      },
    }));
  }

  private async executeSemanticSearch(
    query: SearchQuery,
    graphs: Graph[],
  ): Promise<SearchResult[]> {
    // Semantic search based on graph similarity
    if (graphs.length === 0) return [];
    const referenceGraph = graphs[0];
    if (!referenceGraph) return [];
    const results = this.graphSearchService.searchCandidatesBySimilarity(
      referenceGraph,
      graphs.slice(1),
      { limit: 100 },
    );

    return results.map((r) => ({
      id: r.id,
      type: 'candidate' as const,
      score: r.score,
      graph: r.graph,
      matchReason: r.matchReason,
      rankingDetails: {
        graphScore: 0,
        semanticScore: r.score,
        vectorScore: 0,
        bm25Score: 0,
        finalScore: r.score,
      },
    }));
  }

  private async executeVectorSearch(
    query: SearchQuery,
    graphs: Graph[],
  ): Promise<SearchResult[]> {
    // Vector search simulation - in production, this would use actual vector embeddings
    const results: SearchResult[] = [];

    for (const graph of graphs) {
      const vectorScore = this.calculateVectorSimilarity(query.query, graph);
      results.push({
        id: graph.id,
        type: 'candidate' as const,
        score: vectorScore,
        graph,
        matchReason: [`Vector similarity: ${vectorScore.toFixed(0)}%`],
        rankingDetails: {
          graphScore: 0,
          semanticScore: 0,
          vectorScore,
          bm25Score: 0,
          finalScore: vectorScore,
        },
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 100);
  }

  private async executeBM25Search(
    query: SearchQuery,
    graphs: Graph[],
  ): Promise<SearchResult[]> {
    // BM25 search simulation - in production, this would use actual BM25 algorithm
    const results: SearchResult[] = [];

    for (const graph of graphs) {
      const bm25Score = this.calculateBM25Score(query.query, graph);
      results.push({
        id: graph.id,
        type: 'candidate' as const,
        score: bm25Score,
        graph,
        matchReason: [`BM25 relevance: ${bm25Score.toFixed(0)}%`],
        rankingDetails: {
          graphScore: 0,
          semanticScore: 0,
          vectorScore: 0,
          bm25Score,
          finalScore: bm25Score,
        },
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 100);
  }

  // ============================================================================
  // RANKING
  // ============================================================================

  private rankResults(
    graphResults: SearchResult[],
    semanticResults: SearchResult[],
    vectorResults: SearchResult[],
    bm25Results: SearchResult[],
    rankingConfig?: RankingConfig,
  ): SearchResult[] {
    const weights = rankingConfig?.weights || {
      graph: 0.4,
      semantic: 0.3,
      vector: 0.2,
      bm25: 0.1,
    };

    const combinedMap = new Map<string, SearchResult>();

    // Combine all results
    for (const result of [
      ...graphResults,
      ...semanticResults,
      ...vectorResults,
      ...bm25Results,
    ]) {
      const existing = combinedMap.get(result.id);
      if (existing) {
        existing.rankingDetails.graphScore = Math.max(
          existing.rankingDetails.graphScore,
          result.rankingDetails.graphScore,
        );
        existing.rankingDetails.semanticScore = Math.max(
          existing.rankingDetails.semanticScore,
          result.rankingDetails.semanticScore,
        );
        existing.rankingDetails.vectorScore = Math.max(
          existing.rankingDetails.vectorScore,
          result.rankingDetails.vectorScore,
        );
        existing.rankingDetails.bm25Score = Math.max(
          existing.rankingDetails.bm25Score,
          result.rankingDetails.bm25Score,
        );
      } else {
        combinedMap.set(result.id, { ...result });
      }
    }

    // Calculate final scores
    const rankedResults = Array.from(combinedMap.values()).map((result) => {
      const finalScore =
        result.rankingDetails.graphScore * (weights.graph || 0) +
        result.rankingDetails.semanticScore * (weights.semantic || 0) +
        result.rankingDetails.vectorScore * (weights.vector || 0) +
        result.rankingDetails.bm25Score * (weights.bm25 || 0);

      result.rankingDetails.finalScore = finalScore;
      result.score = finalScore;

      return result;
    });

    return rankedResults.sort((a, b) => b.score - a.score);
  }

  // ============================================================================
  // FILTERS
  // ============================================================================

  private applyFilters(
    results: SearchResult[],
    filters?: SearchFilters,
  ): SearchResult[] {
    if (!filters) return results;

    return results.filter((result) => {
      const graph = result.graph;

      // Filter by skills
      if (filters.skills && filters.skills.length > 0) {
        const graphSkills = this.getGraphSkills(graph);
        const hasAllSkills = filters.skills.every((skill) =>
          graphSkills.some((s) =>
            s.normalizedLabel.includes(skill.toLowerCase()),
          ),
        );
        if (!hasAllSkills) return false;
      }

      // Filter by experience
      if (filters.experience) {
        const experience = this.getGraphExperience(graph);
        if (filters.experience.min && experience < filters.experience.min)
          return false;
        if (filters.experience.max && experience > filters.experience.max)
          return false;
      }

      // Filter by education
      if (filters.education && filters.education.length > 0) {
        const education = this.getGraphEducation(graph);
        const hasRequiredEducation = filters.education.some((edu) =>
          education.some((e) => e.toLowerCase().includes(edu.toLowerCase())),
        );
        if (!hasRequiredEducation) return false;
      }

      // Filter by location
      if (filters.location && filters.location.length > 0) {
        const location = this.getGraphLocation(graph);
        if (!location || !filters.location.includes(location)) return false;
      }

      // Filter by languages
      if (filters.languages && filters.languages.length > 0) {
        const languages = this.getGraphLanguages(graph);
        const hasAllLanguages = filters.languages.every((lang) =>
          languages.some((l) => l.toLowerCase().includes(lang.toLowerCase())),
        );
        if (!hasAllLanguages) return false;
      }

      // Filter by remote
      if (filters.remote !== undefined) {
        const isRemote = this.getGraphRemote(graph);
        if (isRemote !== filters.remote) return false;
      }

      return true;
    });
  }

  // ============================================================================
  // PAGINATION
  // ============================================================================

  private applyPagination(
    results: SearchResult[],
    options?: PaginationOptions,
  ): { paginatedResults: SearchResult[]; pagination: PaginationMeta } {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const sortBy = options?.sortBy || 'relevance';
    const sortOrder = options?.sortOrder || 'desc';

    // Sort results
    const sortedResults = [...results];
    if (sortBy === 'score') {
      sortedResults.sort((a, b) =>
        sortOrder === 'desc' ? b.score - a.score : a.score - b.score,
      );
    } else if (sortBy === 'date') {
      sortedResults.sort((a, b) => {
        const dateA = a.graph.metadata.updatedAt.getTime();
        const dateB = b.graph.metadata.updatedAt.getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }

    const total = sortedResults.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResults = sortedResults.slice(startIndex, endIndex);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };

    return { paginatedResults, pagination };
  }

  // ============================================================================
  // FACETS
  // ============================================================================

  private generateFacets(
    results: SearchResult[],
    config?: FacetConfig,
  ): Facet[] {
    const facets: Facet[] = [];

    if (!config) return facets;

    // Skills facet
    if (config.skills) {
      const skillsMap = new Map<string, number>();
      for (const result of results) {
        const skills = this.getGraphSkills(result.graph);
        for (const skill of skills) {
          skillsMap.set(skill.label, (skillsMap.get(skill.label) || 0) + 1);
        }
      }
      facets.push({
        name: 'Skills',
        field: 'skills',
        values: Array.from(skillsMap.entries())
          .map(([value, count]) => ({ value, count, selected: false }))
          .slice(0, 20),
      });
    }

    // Experience facet
    if (config.experience) {
      const experienceRanges = ['0-2', '2-5', '5-10', '10+'];
      const experienceMap = new Map<string, number>();
      for (const result of results) {
        const experience = this.getGraphExperience(result.graph);
        let range = '0-2';
        if (experience >= 2 && experience < 5) range = '2-5';
        else if (experience >= 5 && experience < 10) range = '5-10';
        else if (experience >= 10) range = '10+';
        experienceMap.set(range, (experienceMap.get(range) || 0) + 1);
      }
      facets.push({
        name: 'Experience',
        field: 'experience',
        values: Array.from(experienceMap.entries()).map(([value, count]) => ({
          value,
          count,
          selected: false,
        })),
      });
    }

    // Location facet
    if (config.location) {
      const locationMap = new Map<string, number>();
      for (const result of results) {
        const location = this.getGraphLocation(result.graph);
        if (location) {
          locationMap.set(location, (locationMap.get(location) || 0) + 1);
        }
      }
      facets.push({
        name: 'Location',
        field: 'location',
        values: Array.from(locationMap.entries())
          .map(([value, count]) => ({ value, count, selected: false }))
          .slice(0, 20),
      });
    }

    return facets;
  }

  // ============================================================================
  // SUGGESTIONS & AUTOCOMPLETE
  // ============================================================================

  async getSuggestions(query: string, graphs: Graph[]): Promise<Suggestion[]> {
    const suggestions = this.generateSuggestions(query, graphs);
    return suggestions.slice(0, 10);
  }

  async getAutocomplete(query: string, graphs: Graph[]): Promise<Suggestion[]> {
    const suggestions = this.generateSuggestions(query, graphs);
    return suggestions.slice(0, 5);
  }

  private generateSuggestions(query: string, graphs: Graph[]): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const queryLower = query.toLowerCase();

    for (const graph of graphs) {
      // Skill suggestions
      const skills = this.getGraphSkills(graph);
      for (const skill of skills) {
        if (skill.label.toLowerCase().includes(queryLower)) {
          suggestions.push({
            text: skill.label,
            type: 'skill',
            score: skill.confidence * 100,
          });
        }
      }

      // Location suggestions
      const location = this.getGraphLocation(graph);
      if (location && location.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: location,
          type: 'location',
          score: 80,
        });
      }

      // Company suggestions
      const companies = this.getGraphCompanies(graph);
      for (const company of companies) {
        if (company.label.toLowerCase().includes(queryLower)) {
          suggestions.push({
            text: company.label,
            type: 'company',
            score: company.confidence * 100,
          });
        }
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .filter((s, i, arr) => arr.findIndex((x) => x.text === s.text) === i)
      .slice(0, 20);
  }

  // ============================================================================
  // SEARCH HISTORY
  // ============================================================================

  private recordSearchHistory(userId: string, query: SearchQuery): void {
    const history = this.searchHistory.get(userId) || [];
    const entry: SearchHistoryEntry = {
      id: `${userId}-${Date.now()}`,
      userId,
      query: query.query,
      timestamp: new Date(),
      resultCount: 0, // Will be updated after search
      filters: query.filters || null,
    };

    history.unshift(entry);
    if (history.length > this.MAX_HISTORY_PER_USER) {
      history.pop();
    }

    this.searchHistory.set(userId, history);
  }

  async getSearchHistory(userId: string): Promise<SearchHistoryEntry[]> {
    return this.searchHistory.get(userId) || [];
  }

  async clearSearchHistory(userId: string): Promise<void> {
    this.searchHistory.delete(userId);
  }

  async getRecentSearches(
    userId: string,
    limit: number = 10,
  ): Promise<string[]> {
    const history = this.searchHistory.get(userId) || [];
    return history.slice(0, limit).map((entry) => entry.query);
  }

  // ============================================================================
  // POPULAR SEARCHES
  // ============================================================================

  private updatePopularSearches(query: string): void {
    const count = this.popularSearches.get(query) || 0;
    this.popularSearches.set(query, count + 1);

    // Keep only top searches
    if (this.popularSearches.size > this.MAX_POPULAR_SEARCHES) {
      const sorted = Array.from(this.popularSearches.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, this.MAX_POPULAR_SEARCHES);
      this.popularSearches = new Map(sorted);
    }
  }

  async getPopularSearches(limit: number = 10): Promise<PopularSearch[]> {
    const sorted = Array.from(this.popularSearches.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sorted.map(([query, count]) => ({
      query,
      count,
      lastUsed: new Date(),
    }));
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private calculateVectorSimilarity(query: string, graph: Graph): number {
    // Simplified vector similarity - in production, use actual embeddings
    const graphText = this.extractGraphText(graph);
    const queryWords = query.toLowerCase().split(/\s+/);
    const graphWords = graphText.toLowerCase().split(/\s+/);

    const intersection = queryWords.filter((word) =>
      graphWords.some((gw) => gw.includes(word)),
    ).length;

    return (intersection / queryWords.length) * 100;
  }

  private calculateBM25Score(query: string, graph: Graph): number {
    // Simplified BM25 - in production, use actual BM25 algorithm
    const graphText = this.extractGraphText(graph);
    const queryWords = query.toLowerCase().split(/\s+/);
    const graphWords = graphText.toLowerCase().split(/\s+/);

    let score = 0;
    for (const word of queryWords) {
      const matches = graphWords.filter((gw) => gw.includes(word)).length;
      score += matches * (1 + Math.log10(matches + 1));
    }

    return Math.min(score * 10, 100);
  }

  private extractGraphText(graph: Graph): string {
    const nodes = Array.from(graph.nodes.values());
    return nodes.map((n) => `${n.label} ${n.normalizedLabel}`).join(' ');
  }

  private getGraphSkills(graph: Graph): Node[] {
    return Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.SKILL,
    );
  }

  private getGraphExperience(graph: Graph): number {
    const experienceNodes = Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.EXPERIENCE,
    );
    // Simplified - sum of experience years
    return experienceNodes.reduce((sum, node) => {
      const years = node.metadata.years as number | undefined;
      return sum + (years || 0);
    }, 0);
  }

  private getGraphEducation(graph: Graph): string[] {
    const educationNodes = Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.EDUCATION,
    );
    return educationNodes.map((n) => n.label);
  }

  private getGraphLocation(graph: Graph): string | undefined {
    const locationNodes = Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.LOCATION,
    );
    return locationNodes[0]?.label;
  }

  private getGraphLanguages(graph: Graph): string[] {
    const languageNodes = Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.LANGUAGE,
    );
    return languageNodes.map((n) => n.label);
  }

  private getGraphRemote(graph: Graph): boolean {
    const remoteEdges = Array.from(graph.edges.values()).filter(
      (e) => e.type === EdgeType.ALLOWS_REMOTE,
    );
    return remoteEdges.length > 0;
  }

  private getGraphCompanies(graph: Graph): Node[] {
    return Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.COMPANY,
    );
  }
}
