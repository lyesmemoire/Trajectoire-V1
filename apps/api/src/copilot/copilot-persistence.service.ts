/**
 * COPILOT PERSISTENCE SERVICE
 * Stores Copilot conversations in database
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  reasoning?: string[];
}

@Injectable()
export class CopilotPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Add a message to conversation
   */
  async addMessage(
    userId: string,
    sessionId: string,
    message: CopilotMessage,
    cvId?: string,
    jobId?: string,
  ): Promise<void> {
    try {
      await (this.prisma as any).copilotConversation.create({
        data: {
          userId,
          sessionId,
          role: message.role,
          content: message.content,
          sources: message.sources as any,
          reasoning: message.reasoning as any,
          cvId,
          jobId,
        },
      });
    } catch (error) {
      // Fallback to in-memory if Prisma not available
      console.warn('Prisma copilotConversation not available, using in-memory fallback');
    }
  }

  /**
   * Get conversation history for a session
   */
  async getConversationHistory(
    userId: string,
    sessionId: string,
  ): Promise<CopilotMessage[]> {
    try {
      const messages = await (this.prisma as any).copilotConversation.findMany({
        where: {
          userId,
          sessionId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
        sources: m.sources as string[] | undefined,
        reasoning: m.reasoning as string[] | undefined,
      }));
    } catch (error) {
      console.warn('Prisma copilotConversation not available, returning empty history');
      return [];
    }
  }

  /**
   * Clear conversation for a session
   */
  async clearConversation(userId: string, sessionId: string): Promise<void> {
    try {
      await (this.prisma as any).copilotConversation.deleteMany({
        where: {
          userId,
          sessionId,
        },
      });
    } catch (error) {
      console.warn('Prisma copilotConversation not available, ignoring clear');
    }
  }

  /**
   * Get all sessions for a user
   */
  async getAllSessions(userId: string): Promise<string[]> {
    try {
      const sessions = await (this.prisma as any).copilotConversation.findMany({
        where: {
          userId,
        },
        select: {
          sessionId: true,
        },
        distinct: ['sessionId'],
      });

      return sessions.map((s) => s.sessionId);
    } catch (error) {
      console.warn('Prisma copilotConversation not available, returning empty sessions');
      return [];
    }
  }

  /**
   * Delete a specific message
   */
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    try {
      await (this.prisma as any).copilotConversation.deleteMany({
        where: {
          id: messageId,
          userId,
        },
      });
    } catch (error) {
      console.warn('Prisma copilotConversation not available, ignoring delete');
    }
  }
}
