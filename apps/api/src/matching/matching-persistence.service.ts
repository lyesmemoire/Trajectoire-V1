import { Injectable } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';

export interface MatchingResultCreateInput {
  userId?: string;
  sessionId?: string;
  candidateId: string;
  jobId: string;
  overallScore: number;
  hardSkillsScore: number;
  softSkillsScore: number;
  experienceScore: number;
  educationScore: number;
  languagesScore: number;
  careerPathScore: number;
  transferableSkillsScore: number;
  graphSimilarityScore: number;
  semanticSimilarityScore: number;
  confidence: number;
  explanation?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  durationMs: number;
}

export interface MatchingResultUpdateInput {
  overallScore?: number;
  hardSkillsScore?: number;
  softSkillsScore?: number;
  experienceScore?: number;
  educationScore?: number;
  languagesScore?: number;
  careerPathScore?: number;
  transferableSkillsScore?: number;
  graphSimilarityScore?: number;
  semanticSimilarityScore?: number;
  confidence?: number;
  explanation?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

@Injectable()
export class MatchingPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a matching result record
   */
  async createMatchingResult(input: MatchingResultCreateInput): Promise<any> {
    const data: any = {
      type: 'matching',
      subtype: 'result',
      timestamp: new Date(),
      payload: {
        candidateId: input.candidateId,
        jobId: input.jobId,
        overallScore: input.overallScore,
        hardSkillsScore: input.hardSkillsScore,
        softSkillsScore: input.softSkillsScore,
        experienceScore: input.experienceScore,
        educationScore: input.educationScore,
        languagesScore: input.languagesScore,
        careerPathScore: input.careerPathScore,
        transferableSkillsScore: input.transferableSkillsScore,
        graphSimilarityScore: input.graphSimilarityScore,
        semanticSimilarityScore: input.semanticSimilarityScore,
        confidence: input.confidence,
        explanation: input.explanation,
        strengths: input.strengths,
        weaknesses: input.weaknesses,
        recommendations: input.recommendations,
        durationMs: input.durationMs,
      },
    };

    if (input.userId) {
      data.userId = input.userId;
    }

    if (input.sessionId) {
      data.sessionId = input.sessionId;
    }

    const matchingResult = await this.prisma.behaviorEvent.create({
      data,
    });

    return matchingResult;
  }

  /**
   * Get matching results by user ID
   */
  async getMatchingResultsByUserId(userId: string, limit = 50): Promise<any[]> {
    const results = await this.prisma.behaviorEvent.findMany({
      where: {
        userId,
        type: 'matching',
        subtype: 'result',
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return results;
  }

  /**
   * Get matching results by candidate ID with ownership verification
   */
  async getMatchingResultsByCandidateId(candidateId: string, userId?: string, limit = 50): Promise<any[]> {
    const whereClause: any = {
      type: 'matching',
      subtype: 'result',
    };

    // Filter by userId if provided for ownership verification
    if (userId) {
      whereClause.userId = userId;
    }

    const allResults = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit * 10, // Get more to filter
    });

    return allResults.filter((r: any) => r.payload?.candidateId === candidateId).slice(0, limit);
  }

  /**
   * Get matching results by job ID with ownership verification
   */
  async getMatchingResultsByJobId(jobId: string, userId?: string, limit = 50): Promise<any[]> {
    const whereClause: any = {
      type: 'matching',
      subtype: 'result',
    };

    // Filter by userId if provided for ownership verification
    if (userId) {
      whereClause.userId = userId;
    }

    const allResults = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit * 10, // Get more to filter
    });

    return allResults.filter((r: any) => r.payload?.jobId === jobId).slice(0, limit);
  }

  /**
   * Get matching result by candidate and job IDs with ownership verification
   */
  async getMatchingResult(candidateId: string, jobId: string, userId?: string): Promise<any | null> {
    const whereClause: any = {
      type: 'matching',
      subtype: 'result',
    };

    // Filter by userId if provided for ownership verification
    if (userId) {
      whereClause.userId = userId;
    }

    const allResults = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    const result = allResults.find(
      (r: any) => r.payload?.candidateId === candidateId && r.payload?.jobId === jobId,
    );

    return result || null;
  }

  /**
   * Delete matching result by ID
   */
  async deleteMatchingResult(id: string): Promise<void> {
    await this.prisma.behaviorEvent.delete({
      where: { id },
    });
  }

  /**
   * Delete matching results by user ID
   */
  async deleteMatchingResultsByUserId(userId: string): Promise<number> {
    const result = await this.prisma.behaviorEvent.deleteMany({
      where: {
        userId,
        type: 'matching',
        subtype: 'result',
      },
    });

    return result.count;
  }

  /**
   * Cleanup old matching results
   */
  async cleanupOldMatchingResults(daysOld = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.behaviorEvent.deleteMany({
      where: {
        type: 'matching',
        subtype: 'result',
        timestamp: { lt: cutoffDate },
      },
    });

    return result.count;
  }

  /**
   * Get matching statistics
   */
  async getMatchingStatistics(userId?: string): Promise<any> {
    const whereClause: any = {
      type: 'matching',
      subtype: 'result',
    };

    if (userId) {
      whereClause.userId = userId;
    }

    const allResults = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      take: 1000,
    });

    const totalMatches = allResults.length;
    const avgOverallScore = allResults.reduce((sum: number, r: any) => sum + (r.payload?.overallScore || 0), 0) / (totalMatches || 1);
    const avgConfidence = allResults.reduce((sum: number, r: any) => sum + (r.payload?.confidence || 0), 0) / (totalMatches || 1);

    const scoreDistribution = {
      excellent: allResults.filter((r: any) => r.payload?.overallScore >= 80).length,
      good: allResults.filter((r: any) => r.payload?.overallScore >= 60 && r.payload?.overallScore < 80).length,
      fair: allResults.filter((r: any) => r.payload?.overallScore >= 40 && r.payload?.overallScore < 60).length,
      poor: allResults.filter((r: any) => r.payload?.overallScore < 40).length,
    };

    return {
      totalMatches,
      avgOverallScore,
      avgConfidence,
      scoreDistribution,
    };
  }
}
