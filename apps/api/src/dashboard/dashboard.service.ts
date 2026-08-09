/**
 * Dashboard Service
 * Aggregates data from Copilot, Matching, and Search for Dashboard display
 * Provides unified dashboard data for frontend consumption
 */

import { Injectable } from '@nestjs/common';
import { RecruiterCopilotService } from '../copilot/recruiter-copilot.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { Graph } from '../runtime/kg/graph-types';
import { CacheService } from '../cache/cache.decorator';

export interface DashboardData {
  userId: string;
  matchingInsights: MatchingInsights;
  copilotInsights: CopilotInsights;
  searchStats: SearchStats;
  timestamp: Date;
}

export interface MatchingInsights {
  totalMatches: number;
  averageScore: number;
  topMatches: Array<{
    candidateId: string;
    jobId: string;
    score: number;
  }>;
  recentMatches: Array<{
    candidateId: string;
    jobId: string;
    score: number;
    timestamp: Date;
  }>;
}

export interface CopilotInsights {
  totalConversations: number;
  activeConversations: number;
  recentInsights: Array<{
    type: string;
    message: string;
    confidence: number;
    timestamp: Date;
  }>;
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
}

export interface SearchStats {
  totalSearches: number;
  averageResults: number;
  topFilters: Array<{
    filter: string;
    count: number;
  }>;
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly recruiterCopilotService: RecruiterCopilotService,
    private readonly graphMatchingService: GraphMatchingService,
    private readonly graphSearchService: GraphSearchService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Get aggregated dashboard data for a user
   */
  async getDashboardData(userId: string): Promise<DashboardData> {
    const cacheKey = this.cacheService.generateKey('dashboard', userId);
    
    // Try cache first
    const cached = await this.cacheService.get<DashboardData>(cacheKey);
    if (cached) {
      return cached;
    }

    // Gather data from all services
    const matchingInsights = await this.getMatchingInsights();
    const copilotInsights = await this.getCopilotInsights();
    const searchStats = await this.getSearchStats();

    const dashboardData: DashboardData = {
      userId,
      matchingInsights,
      copilotInsights,
      searchStats,
      timestamp: new Date(),
    };

    // Cache with 5 minute TTL
    await this.cacheService.set(cacheKey, dashboardData, 300);

    return dashboardData;
  }

  /**
   * Get matching insights from GraphMatchingService
   */
  private async getMatchingInsights(): Promise<MatchingInsights> {
    // This would typically query the database for historical matching data
    // For now, return placeholder structure
    return {
      totalMatches: 0,
      averageScore: 0,
      topMatches: [],
      recentMatches: [],
    };
  }

  /**
   * Get copilot insights from RecruiterCopilotService
   */
  private async getCopilotInsights(): Promise<CopilotInsights> {
    // RecruiterCopilotService doesn't have getAllSessions
    // Return placeholder for now
    return {
      totalConversations: 0,
      activeConversations: 0,
      recentInsights: [],
      popularQueries: [],
    };
  }

  /**
   * Get search statistics from GraphSearchService
   */
  private async getSearchStats(): Promise<SearchStats> {
    return {
      totalSearches: 0,
      averageResults: 0,
      topFilters: [],
    };
  }

  /**
   * Get real-time matching score for candidate-job pair
   */
  async getRealTimeMatchScore(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): Promise<{ score: number; details: any }> {
    const result = await this.graphMatchingService.match(candidateGraph, jobGraph);
    
    return {
      score: result.score.overall.value,
      details: {
        hardSkills: result.score.hardSkills.value,
        softSkills: result.score.softSkills.value,
        experience: result.score.experience.value,
        education: result.score.education.value,
        languages: result.score.languages.value,
      },
    };
  }

  /**
   * Get copilot explanation for a match
   */
  async getMatchExplanation(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): Promise<{ explanation: string; confidence: number }> {
    const explanation = await this.recruiterCopilotService.explainMatching(
      candidateGraph,
      jobGraph,
    );
    
    // MatchingExplanation has dimensionScores, strengths, weaknesses, recommendations, evidence, confidence
    const summary = explanation.strengths.join('; ') + ' ' + explanation.recommendations.join('; ');
    
    return {
      explanation: summary,
      confidence: explanation.confidence,
    };
  }
}
