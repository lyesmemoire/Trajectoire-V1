/**
 * Interview Analytics
 * Analytics for interview sessions
 * Tracks: average interview time, abandonment, completion rate, time spent
 */

import { analyticsService, EventType } from "./AnalyticsService";

// Interview Data
export interface InterviewData {
  interviewId: string;
  userId: string;
  sessionId: string;
  jobTitle: string;
  level: string;
  interviewType: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // seconds
  status: "started" | "completed" | "abandoned";
  messageCount: number;
  questionsAsked: number;
  phase?: string;
  score?: number;
  reportGenerated: boolean;
  abandonmentReason?: string;
  abandonmentPhase?: string;
}

// Interview Metrics
export interface InterviewMetrics {
  totalInterviews: number;
  completedInterviews: number;
  abandonedInterviews: number;
  completionRate: number; // 0-1
  averageDuration: number; // seconds
  averageDurationByType: Record<string, number>;
  averageDurationByLevel: Record<string, number>;
  abandonmentRate: number; // 0-1
  averageTimeToAbandon: number; // seconds
  abandonmentByPhase: Record<string, number>;
  averageMessageCount: number;
  averageQuestionsAsked: number;
  averageScore: number;
  reportGenerationRate: number; // 0-1
  interviewsByJobTitle: Array<{ jobTitle: string; count: number; percentage: number }>;
  interviewsByType: Array<{ type: string; count: number; percentage: number }>;
  interviewsByLevel: Array<{ level: string; count: number; percentage: number }>;
}

export class InterviewAnalytics {
  private static instance: InterviewAnalytics;
  private interviews: Map<string, InterviewData> = new Map();

  private constructor() {}

  static getInstance(): InterviewAnalytics {
    if (!InterviewAnalytics.instance) {
      InterviewAnalytics.instance = new InterviewAnalytics();
    }
    return InterviewAnalytics.instance;
  }

  /**
   * Start interview
   */
  startInterview(
    userId: string,
    sessionId: string,
    interviewId: string,
    jobTitle: string,
    level: string,
    interviewType: string
  ): InterviewData {
    const interviewData: InterviewData = {
      interviewId,
      userId,
      sessionId,
      jobTitle,
      level,
      interviewType,
      startTime: new Date(),
      status: "started",
      messageCount: 0,
      questionsAsked: 0,
      reportGenerated: false,
    };

    this.interviews.set(interviewId, interviewData);

    // Track interview start
    analyticsService.track(
      EventType.INTERVIEW_START,
      { userId, sessionId, properties: {} },
      {
        interviewId,
        jobTitle,
        level,
        interviewType,
      }
    );

    return interviewData;
  }

  /**
   * End interview (completed)
   */
  endInterview(interviewId: string, score?: number): InterviewData | null {
    const interview = this.interviews.get(interviewId);
    if (!interview) return null;

    interview.endTime = new Date();
    interview.duration = Math.floor((interview.endTime.getTime() - interview.startTime.getTime()) / 1000);
    interview.status = "completed";
    interview.score = score;

    // Track interview end
    analyticsService.track(
      EventType.INTERVIEW_END,
      { userId: interview.userId, sessionId: interview.sessionId, properties: {} },
      {
        interviewId,
        duration: interview.duration,
        status: interview.status,
        score,
        messageCount: interview.messageCount,
        questionsAsked: interview.questionsAsked,
      }
    );

    return interview;
  }

  /**
   * Abandon interview
   */
  abandonInterview(
    interviewId: string,
    reason: string,
    phase?: string
  ): InterviewData | null {
    const interview = this.interviews.get(interviewId);
    if (!interview) return null;

    interview.endTime = new Date();
    interview.duration = Math.floor((interview.endTime.getTime() - interview.startTime.getTime()) / 1000);
    interview.status = "abandoned";
    interview.abandonmentReason = reason;
    interview.abandonmentPhase = phase;

    // Track interview abandon
    analyticsService.track(
      EventType.INTERVIEW_ABANDON,
      { userId: interview.userId, sessionId: interview.sessionId, properties: {} },
      {
        interviewId,
        duration: interview.duration,
        reason,
        phase,
        messageCount: interview.messageCount,
        questionsAsked: interview.questionsAsked,
      }
    );

    return interview;
  }

  /**
   * Track message
   */
  trackMessage(interviewId: string): void {
    const interview = this.interviews.get(interviewId);
    if (!interview) return;

    interview.messageCount++;
  }

  /**
   * Track question asked
   */
  trackQuestion(interviewId: string): void {
    const interview = this.interviews.get(interviewId);
    if (!interview) return;

    interview.questionsAsked++;
  }

  /**
   * Track phase change
   */
  trackPhase(interviewId: string, phase: string): void {
    const interview = this.interviews.get(interviewId);
    if (!interview) return;

    interview.phase = phase;
  }

  /**
   * Mark report as generated
   */
  markReportGenerated(interviewId: string): void {
    const interview = this.interviews.get(interviewId);
    if (!interview) return;

    interview.reportGenerated = true;

    analyticsService.track(
      EventType.REPORT_GENERATE,
      { userId: interview.userId, sessionId: interview.sessionId, properties: {} },
      { interviewId }
    );
  }

  /**
   * Get interview data
   */
  getInterview(interviewId: string): InterviewData | null {
    return this.interviews.get(interviewId) || null;
  }

  /**
   * Get all interviews for user
   */
  getUserInterviews(userId: string): InterviewData[] {
    return Array.from(this.interviews.values()).filter(i => i.userId === userId);
  }

  /**
   * Calculate interview metrics
   */
  calculateMetrics(): InterviewMetrics {
    const interviews = Array.from(this.interviews.values());
    
    if (interviews.length === 0) {
      return {
        totalInterviews: 0,
        completedInterviews: 0,
        abandonedInterviews: 0,
        completionRate: 0,
        averageDuration: 0,
        averageDurationByType: {},
        averageDurationByLevel: {},
        abandonmentRate: 0,
        averageTimeToAbandon: 0,
        abandonmentByPhase: {},
        averageMessageCount: 0,
        averageQuestionsAsked: 0,
        averageScore: 0,
        reportGenerationRate: 0,
        interviewsByJobTitle: [],
        interviewsByType: [],
        interviewsByLevel: [],
      };
    }

    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter(i => i.status === "completed").length;
    const abandonedInterviews = interviews.filter(i => i.status === "abandoned").length;

    const completionRate = completedInterviews / totalInterviews;
    const abandonmentRate = abandonedInterviews / totalInterviews;

    const completedInterviewsData = interviews.filter(i => i.status === "completed" && i.duration);
    const averageDuration = completedInterviewsData.length > 0
      ? completedInterviewsData.reduce((sum, i) => sum + (i.duration || 0), 0) / completedInterviewsData.length
      : 0;

    // Average duration by type
    const interviewsByTypeDuration: Record<string, InterviewData[]> = {};
    interviews.forEach(i => {
      if (!interviewsByTypeDuration[i.interviewType]) {
        interviewsByTypeDuration[i.interviewType] = [];
      }
      interviewsByTypeDuration[i.interviewType].push(i);
    });

    const averageDurationByType: Record<string, number> = {};
    Object.entries(interviewsByTypeDuration).forEach(([type, typeInterviews]) => {
      const completed = typeInterviews.filter(i => i.status === "completed" && i.duration);
      if (completed.length > 0) {
        averageDurationByType[type] = completed.reduce((sum, i) => sum + (i.duration || 0), 0) / completed.length;
      }
    });

    // Average duration by level
    const interviewsByLevelDuration: Record<string, InterviewData[]> = {};
    interviews.forEach(i => {
      if (!interviewsByLevelDuration[i.level]) {
        interviewsByLevelDuration[i.level] = [];
      }
      interviewsByLevelDuration[i.level].push(i);
    });

    const averageDurationByLevel: Record<string, number> = {};
    Object.entries(interviewsByLevelDuration).forEach(([level, levelInterviews]) => {
      const completed = levelInterviews.filter(i => i.status === "completed" && i.duration);
      if (completed.length > 0) {
        averageDurationByLevel[level] = completed.reduce((sum, i) => sum + (i.duration || 0), 0) / completed.length;
      }
    });

    // Average time to abandon
    const abandonedInterviewsData = interviews.filter(i => i.status === "abandoned" && i.duration);
    const averageTimeToAbandon = abandonedInterviewsData.length > 0
      ? abandonedInterviewsData.reduce((sum, i) => sum + (i.duration || 0), 0) / abandonedInterviewsData.length
      : 0;

    // Abandonment by phase
    const abandonmentByPhase: Record<string, number> = {};
    abandonedInterviewsData.forEach(i => {
      if (i.abandonmentPhase) {
        abandonmentByPhase[i.abandonmentPhase] = (abandonmentByPhase[i.abandonmentPhase] || 0) + 1;
      }
    });

    const averageMessageCount = interviews.reduce((sum, i) => sum + i.messageCount, 0) / interviews.length;
    const averageQuestionsAsked = interviews.reduce((sum, i) => sum + i.questionsAsked, 0) / interviews.length;

    const scoredInterviews = interviews.filter(i => i.score !== undefined);
    const averageScore = scoredInterviews.length > 0
      ? scoredInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / scoredInterviews.length
      : 0;

    const reportGenerationRate = interviews.filter(i => i.reportGenerated).length / interviews.length;

    // Interviews by job title
    const jobTitleCounts: Record<string, number> = {};
    interviews.forEach(i => {
      jobTitleCounts[i.jobTitle] = (jobTitleCounts[i.jobTitle] || 0) + 1;
    });

    const interviewsByJobTitle = Object.entries(jobTitleCounts)
      .map(([jobTitle, count]) => ({
        jobTitle,
        count,
        percentage: (count / interviews.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Interviews by type
    const typeCounts: Record<string, number> = {};
    interviews.forEach(i => {
      typeCounts[i.interviewType] = (typeCounts[i.interviewType] || 0) + 1;
    });

    const interviewsByTypeList = Object.entries(typeCounts)
      .map(([type, count]) => ({
        type,
        count,
        percentage: (count / interviews.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    // Interviews by level
    const levelCounts: Record<string, number> = {};
    interviews.forEach(i => {
      levelCounts[i.level] = (levelCounts[i.level] || 0) + 1;
    });

    const interviewsByLevelList = Object.entries(levelCounts)
      .map(([level, count]) => ({
        level,
        count,
        percentage: (count / interviews.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalInterviews,
      completedInterviews,
      abandonedInterviews,
      completionRate,
      averageDuration,
      averageDurationByType,
      averageDurationByLevel,
      abandonmentRate,
      averageTimeToAbandon,
      abandonmentByPhase,
      averageMessageCount,
      averageQuestionsAsked,
      averageScore,
      reportGenerationRate,
      interviewsByJobTitle,
      interviewsByType: interviewsByTypeList,
      interviewsByLevel: interviewsByLevelList,
    };
  }

  /**
   * Clear interview data
   */
  clearInterview(interviewId: string): void {
    this.interviews.delete(interviewId);
  }

  /**
   * Clear all interviews
   */
  clearAllInterviews(): void {
    this.interviews.clear();
  }
}

export const interviewAnalytics = InterviewAnalytics.getInstance();
