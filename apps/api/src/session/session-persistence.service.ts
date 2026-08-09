import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';
import { InterviewSession, SessionState } from '../common/session.types';

export interface SessionCreateInput {
  userId: string;
  persona?: string;
  jobTitle?: string;
  company?: string;
}

export interface SessionUpdateInput {
  persona?: string;
  currentState?: string;
  clarityScore?: number;
  confidenceScore?: number;
  ownershipScore?: number;
  specificityScore?: number;
  pressureLevel?: number;
  authenticityScore?: number;
  jobTitle?: string;
  company?: string;
  score?: number;
  status?: string;
  questions?: any;
  answers?: any;
  analysis?: any;
  completedAt?: Date;
  careerTrajectoryScore?: number;
}

@Injectable()
export class SessionPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new session
   */
  async createSession(input: SessionCreateInput): Promise<InterviewSession> {
    const session = await this.prisma.interviewSession.create({
      data: {
        userId: input.userId,
        persona: input.persona || 'DEFAULT',
        currentState: 'IDLE',
        jobTitle: input.jobTitle || null,
        company: input.company || null,
      },
    });

    return this.mapToSession(session);
  }

  /**
   * Get a session by ID with ownership verification
   */
  async getSession(sessionId: string, userId: string): Promise<InterviewSession | null> {
    const session = await this.prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    return session ? this.mapToSession(session) : null;
  }

  /**
   * Update a session with ownership verification
   */
  async updateSession(sessionId: string, userId: string, input: SessionUpdateInput): Promise<InterviewSession> {
    const updateData: any = {};
    if (input.persona !== undefined) updateData.persona = input.persona;
    if (input.currentState !== undefined) updateData.currentState = input.currentState;
    if (input.clarityScore !== undefined) updateData.clarityScore = input.clarityScore;
    if (input.confidenceScore !== undefined) updateData.confidenceScore = input.confidenceScore;
    if (input.ownershipScore !== undefined) updateData.ownershipScore = input.ownershipScore;
    if (input.specificityScore !== undefined) updateData.specificityScore = input.specificityScore;
    if (input.pressureLevel !== undefined) updateData.pressureLevel = input.pressureLevel;
    if (input.authenticityScore !== undefined) updateData.authenticityScore = input.authenticityScore;
    if (input.jobTitle !== undefined) updateData.jobTitle = input.jobTitle;
    if (input.company !== undefined) updateData.company = input.company;
    if (input.score !== undefined) updateData.score = input.score;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.questions !== undefined) updateData.questions = input.questions;
    if (input.answers !== undefined) updateData.answers = input.answers;
    if (input.analysis !== undefined) updateData.analysis = input.analysis;
    if (input.completedAt !== undefined) updateData.completedAt = input.completedAt;
    if (input.careerTrajectoryScore !== undefined) updateData.careerTrajectoryScore = input.careerTrajectoryScore;

    const result = await this.prisma.interviewSession.updateMany({
      where: {
        id: sessionId,
        userId,
      },
      data: updateData,
    });

    if (result.count === 0) {
      throw new NotFoundException('Session not found');
    }

    // Fetch the updated session to return it
    const session = await this.prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.mapToSession(session);
  }

  /**
   * Delete a session with ownership verification
   */
  async deleteSession(sessionId: string, userId: string): Promise<void> {
    const result = await this.prisma.interviewSession.deleteMany({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Session not found');
    }
  }

  /**
   * Get sessions by user ID
   */
  async getSessionsByUserId(userId: string, limit = 50): Promise<InterviewSession[]> {
    const sessions = await this.prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return sessions.map((s) => this.mapToSession(s));
  }

  /**
   * Get active sessions with ownership verification
   */
  async getActiveSessions(userId: string, limit = 50): Promise<InterviewSession[]> {
    const sessions = await this.prisma.interviewSession.findMany({
      where: {
        status: 'active',
        userId,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return sessions.map((s) => this.mapToSession(s));
  }

  /**
   * Cleanup old completed sessions
   */
  async cleanupOldSessions(daysOld = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.interviewSession.deleteMany({
      where: {
        completedAt: { lt: cutoffDate },
        status: 'completed',
      },
    });

    return result.count;
  }

  private mapToSession(session: any): InterviewSession {
    return {
      sessionId: session.id,
      createdAt: session.createdAt.getTime(),
      lastActivityAt: session.updatedAt.getTime(),
      state: session.currentState as SessionState,
    };
  }
}
