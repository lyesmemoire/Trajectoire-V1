/**
 * Feedback Analytics
 * Analytics for user feedback
 * Tracks: NPS, CSAT, CES, feedback classification
 */

import { z } from "zod";

// Feedback Type
export enum FeedbackType {
  NPS = "nps", // Net Promoter Score
  CSAT = "csat", // Customer Satisfaction
  CES = "ces", // Customer Effort Score
  GENERAL = "general",
}

// Feedback Category (AI-classified)
export enum FeedbackCategory {
  BUG = "bug",
  UX = "ux",
  AI = "ai",
  PERFORMANCE = "performance",
  DESIGN = "design",
  COMPREHENSION = "comprehension",
  OTHER = "other",
}

// Feedback Data
export interface FeedbackData {
  feedbackId: string;
  userId: string;
  sessionId?: string;
  feedbackType: FeedbackType;
  score?: number; // 0-10 for NPS, 1-5 for CSAT, 1-5 for CES
  category?: FeedbackCategory;
  comment?: string;
  timestamp: Date;
  context?: {
    pageUrl?: string;
    featureUsed?: string;
    interviewId?: string;
  };
  metadata?: Record<string, any>;
}

// Feedback Metrics
export interface FeedbackMetrics {
  totalFeedbacks: number;
  feedbacksByType: Record<FeedbackType, number>;
  averageNPS: number;
  averageCSAT: number;
  averageCES: number;
  npsDistribution: Array<{ score: number; count: number; percentage: number }>;
  csatDistribution: Array<{ score: number; count: number; percentage: number }>;
  feedbacksByCategory: Record<FeedbackCategory, number>;
  feedbackTrends: Array<{
    date: string;
    averageScore: number;
    feedbackCount: number;
  }>;
  responseRate: number; // 0-1
  mostCommonIssues: Array<{
    category: FeedbackCategory;
    count: number;
    percentage: number;
  }>;
}

export class FeedbackAnalytics {
  private static instance: FeedbackAnalytics;
  private feedbacks: FeedbackData[] = [];

  private constructor() {}

  static getInstance(): FeedbackAnalytics {
    if (!FeedbackAnalytics.instance) {
      FeedbackAnalytics.instance = new FeedbackAnalytics();
    }
    return FeedbackAnalytics.instance;
  }

  /**
   * Track feedback
   */
  trackFeedback(
    userId: string,
    feedbackType: FeedbackType,
    score?: number,
    comment?: string,
    sessionId?: string,
    context?: FeedbackData["context"]
  ): void {
    const feedback: FeedbackData = {
      feedbackId: this.generateFeedbackId(),
      userId,
      sessionId,
      feedbackType,
      score,
      comment,
      timestamp: new Date(),
      context,
    };

    this.feedbacks.push(feedback);
  }

  /**
   * Track NPS (Net Promoter Score)
   */
  trackNPS(
    userId: string,
    score: number, // 0-10
    comment?: string,
    sessionId?: string
  ): void {
    this.trackFeedback(userId, FeedbackType.NPS, score, comment, sessionId);
  }

  /**
   * Track CSAT (Customer Satisfaction)
   */
  trackCSAT(
    userId: string,
    score: number, // 1-5
    comment?: string,
    sessionId?: string
  ): void {
    this.trackFeedback(userId, FeedbackType.CSAT, score, comment, sessionId);
  }

  /**
   * Track CES (Customer Effort Score)
   */
  trackCES(
    userId: string,
    score: number, // 1-5
    comment?: string,
    sessionId?: string
  ): void {
    this.trackFeedback(userId, FeedbackType.CES, score, comment, sessionId);
  }

  /**
   * Classify feedback with AI
   */
  classifyFeedback(feedbackId: string, category: FeedbackCategory): void {
    const feedback = this.feedbacks.find(f => f.feedbackId === feedbackId);
    if (feedback) {
      feedback.category = category;
    }
  }

  /**
   * Get feedback for user
   */
  getUserFeedback(userId: string): FeedbackData[] {
    return this.feedbacks.filter(f => f.userId === userId);
  }

  /**
   * Calculate feedback metrics
   */
  calculateMetrics(): FeedbackMetrics {
    const totalFeedbacks = this.feedbacks.length;

    const feedbacksByType: Record<FeedbackType, number> = {
      [FeedbackType.NPS]: 0,
      [FeedbackType.CSAT]: 0,
      [FeedbackType.CES]: 0,
      [FeedbackType.GENERAL]: 0,
    };

    this.feedbacks.forEach(feedback => {
      feedbacksByType[feedback.feedbackType] = (feedbacksByType[feedback.feedbackType] || 0) + 1;
    });

    // Average NPS
    const npsFeedbacks = this.feedbacks.filter(f => f.feedbackType === FeedbackType.NPS && f.score !== undefined);
    const averageNPS = npsFeedbacks.length > 0
      ? npsFeedbacks.reduce((sum, f) => sum + (f.score || 0), 0) / npsFeedbacks.length
      : 0;

    // Average CSAT
    const csatFeedbacks = this.feedbacks.filter(f => f.feedbackType === FeedbackType.CSAT && f.score !== undefined);
    const averageCSAT = csatFeedbacks.length > 0
      ? csatFeedbacks.reduce((sum, f) => sum + (f.score || 0), 0) / csatFeedbacks.length
      : 0;

    // Average CES
    const cesFeedbacks = this.feedbacks.filter(f => f.feedbackType === FeedbackType.CES && f.score !== undefined);
    const averageCES = cesFeedbacks.length > 0
      ? cesFeedbacks.reduce((sum, f) => sum + (f.score || 0), 0) / cesFeedbacks.length
      : 0;

    // NPS distribution
    const npsDistribution: Array<{ score: number; count: number; percentage: number }> = [];
    for (let i = 0; i <= 10; i++) {
      const count = npsFeedbacks.filter(f => f.score === i).length;
      npsDistribution.push({
        score: i,
        count,
        percentage: npsFeedbacks.length > 0 ? (count / npsFeedbacks.length) * 100 : 0,
      });
    }

    // CSAT distribution
    const csatDistribution: Array<{ score: number; count: number; percentage: number }> = [];
    for (let i = 1; i <= 5; i++) {
      const count = csatFeedbacks.filter(f => f.score === i).length;
      csatDistribution.push({
        score: i,
        count,
        percentage: csatFeedbacks.length > 0 ? (count / csatFeedbacks.length) * 100 : 0,
      });
    }

    // Feedbacks by category
    const feedbacksByCategory: Record<FeedbackCategory, number> = {
      [FeedbackCategory.BUG]: 0,
      [FeedbackCategory.UX]: 0,
      [FeedbackCategory.AI]: 0,
      [FeedbackCategory.PERFORMANCE]: 0,
      [FeedbackCategory.DESIGN]: 0,
      [FeedbackCategory.COMPREHENSION]: 0,
      [FeedbackCategory.OTHER]: 0,
    };

    this.feedbacks.forEach(feedback => {
      if (feedback.category) {
        feedbacksByCategory[feedback.category] = (feedbacksByCategory[feedback.category] || 0) + 1;
      }
    });

    // Feedback trends (by date)
    const feedbackByDate: Map<string, { totalScore: number; count: number }> = new Map();
    this.feedbacks.forEach(feedback => {
      if (feedback.score !== undefined) {
        const date = feedback.timestamp.toISOString().split('T')[0];
        const existing = feedbackByDate.get(date);
        if (existing) {
          existing.totalScore += feedback.score;
          existing.count++;
        } else {
          feedbackByDate.set(date, { totalScore: feedback.score, count: 1 });
        }
      }
    });

    const feedbackTrends = Array.from(feedbackByDate.entries())
      .map(([date, data]) => ({
        date,
        averageScore: data.count > 0 ? data.totalScore / data.count : 0,
        feedbackCount: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days

    // Response rate (mock - would need total users who were asked for feedback)
    const responseRate = totalFeedbacks > 0 ? 0.3 : 0; // 30% response rate (mock)

    // Most common issues
    const categoryCounts = Object.entries(feedbacksByCategory)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => ({
        category: category as FeedbackCategory,
        count,
        percentage: totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const mostCommonIssues = categoryCounts.slice(0, 5);

    return {
      totalFeedbacks,
      feedbacksByType,
      averageNPS,
      averageCSAT,
      averageCES,
      npsDistribution,
      csatDistribution,
      feedbacksByCategory,
      feedbackTrends,
      responseRate,
      mostCommonIssues,
    };
  }

  /**
   * Get NPS promoters, passives, detractors
   */
  getNPSSegments(): {
    promoters: number; // 9-10
    passives: number; // 7-8
    detractors: number; // 0-6
    npsScore: number; // promoters - detractors
  } {
    const npsFeedbacks = this.feedbacks.filter(f => f.feedbackType === FeedbackType.NPS && f.score !== undefined);
    
    const promoters = npsFeedbacks.filter(f => (f.score || 0) >= 9).length;
    const passives = npsFeedbacks.filter(f => (f.score || 0) >= 7 && (f.score || 0) <= 8).length;
    const detractors = npsFeedbacks.filter(f => (f.score || 0) <= 6).length;

    const npsScore = npsFeedbacks.length > 0
      ? ((promoters - detractors) / npsFeedbacks.length) * 100
      : 0;

    return {
      promoters,
      passives,
      detractors,
      npsScore,
    };
  }

  /**
   * Generate feedback ID
   */
  private generateFeedbackId(): string {
    return `fdb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear feedback data
   */
  clearFeedbacks(): void {
    this.feedbacks = [];
  }
}

export const feedbackAnalytics = FeedbackAnalytics.getInstance();
