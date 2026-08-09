import { Injectable } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';

export interface SearchHistoryCreateInput {
  userId?: string;
  sessionId?: string;
  searchType: 'candidates' | 'jobs' | 'similarity' | 'career_path';
  query?: any;
  filters?: any;
  resultCount: number;
  durationMs: number;
}

export interface SearchHistoryUpdateInput {
  resultCount?: number;
  durationMs?: number;
}

@Injectable()
export class SearchPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a search history record
   */
  async createSearchHistory(input: SearchHistoryCreateInput): Promise<any> {
    const data: any = {
      type: 'search',
      subtype: input.searchType,
      timestamp: new Date(),
      payload: {
        query: input.query,
        filters: input.filters,
        resultCount: input.resultCount,
        durationMs: input.durationMs,
      },
    };

    if (input.userId) {
      data.userId = input.userId;
    }

    if (input.sessionId) {
      data.sessionId = input.sessionId;
    }

    const searchHistory = await this.prisma.behaviorEvent.create({
      data,
    });

    return searchHistory;
  }

  /**
   * Get search history by user ID
   */
  async getSearchHistoryByUserId(userId: string, limit = 50): Promise<any[]> {
    const history = await this.prisma.behaviorEvent.findMany({
      where: {
        userId,
        type: 'search',
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return history;
  }

  /**
   * Get search history by session ID
   */
  async getSearchHistoryBySessionId(sessionId: string, limit = 50): Promise<any[]> {
    const history = await this.prisma.behaviorEvent.findMany({
      where: {
        sessionId,
        type: 'search',
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return history;
  }

  /**
   * Get search history by type with ownership verification
   */
  async getSearchHistoryByType(searchType: string, userId?: string, limit = 50): Promise<any[]> {
    const whereClause: any = {
      type: 'search',
      subtype: searchType,
    };

    // Filter by userId if provided for ownership verification
    if (userId) {
      whereClause.userId = userId;
    }

    const history = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return history;
  }

  /**
   * Delete search history by ID
   */
  async deleteSearchHistory(id: string): Promise<void> {
    await this.prisma.behaviorEvent.delete({
      where: { id },
    });
  }

  /**
   * Delete search history by user ID
   */
  async deleteSearchHistoryByUserId(userId: string): Promise<number> {
    const result = await this.prisma.behaviorEvent.deleteMany({
      where: {
        userId,
        type: 'search',
      },
    });

    return result.count;
  }

  /**
   * Cleanup old search history
   */
  async cleanupOldSearchHistory(daysOld = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.behaviorEvent.deleteMany({
      where: {
        type: 'search',
        timestamp: { lt: cutoffDate },
      },
    });

    return result.count;
  }

  /**
   * Get search statistics
   */
  async getSearchStatistics(userId?: string): Promise<any> {
    const whereClause: any = {
      type: 'search',
    };

    if (userId) {
      whereClause.userId = userId;
    }

    const [totalSearches, searchesByType, avgDuration] = await Promise.all([
      this.prisma.behaviorEvent.count({ where: whereClause }),
      this.prisma.behaviorEvent.groupBy({
        by: ['subtype'],
        where: whereClause,
        _count: true,
      }),
      this.prisma.behaviorEvent.aggregate({
        where: whereClause,
        _avg: {
          latencyMs: true,
        },
      }),
    ]);

    return {
      totalSearches,
      searchesByType: searchesByType.map((s) => ({
        type: s.subtype,
        count: s._count,
      })),
      avgDurationMs: avgDuration._avg.latencyMs || 0,
    };
  }
}
