import { Injectable } from '@nestjs/common';
import { CopilotPersistenceService } from './copilot-persistence.service';

export interface ConversationContext {
  lastCandidateId?: string;
  lastJobId?: string;
  lastSearchQuery?: string;
  lastScore?: number;
  lastReport?: any;
  conversationHistory: Message[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  reasoning?: string[];
}

@Injectable()
export class ConversationMemoryService {
  private conversations: Map<string, ConversationContext> = new Map();

  constructor(private readonly persistenceService: CopilotPersistenceService) {}

  private getContextKey(sessionId: string, userId: string): string {
    return `${userId}:${sessionId}`;
  }

  getOrCreateContext(sessionId: string, userId: string): ConversationContext {
    const key = this.getContextKey(sessionId, userId);
    if (!this.conversations.has(key)) {
      this.conversations.set(key, {
        conversationHistory: [],
      });
    }
    return this.conversations.get(key)!;
  }

  async addMessage(sessionId: string, message: Message, userId: string, cvId?: string, jobId?: string): Promise<void> {
    const context = this.getOrCreateContext(sessionId, userId);
    context.conversationHistory.push(message);

    // Always persist to database with userId
    await this.persistenceService.addMessage(
      userId,
      sessionId,
      message,
      cvId,
      jobId,
    );
  }

  getLastCandidateId(sessionId: string, userId: string): string | undefined {
    return this.getOrCreateContext(sessionId, userId).lastCandidateId;
  }

  setLastCandidateId(sessionId: string, candidateId: string, userId: string): void {
    this.getOrCreateContext(sessionId, userId).lastCandidateId = candidateId;
  }

  getLastJobId(sessionId: string, userId: string): string | undefined {
    return this.getOrCreateContext(sessionId, userId).lastJobId;
  }

  setLastJobId(sessionId: string, jobId: string, userId: string): void {
    this.getOrCreateContext(sessionId, userId).lastJobId = jobId;
  }

  getLastSearchQuery(sessionId: string, userId: string): string | undefined {
    return this.getOrCreateContext(sessionId, userId).lastSearchQuery;
  }

  setLastSearchQuery(sessionId: string, query: string, userId: string): void {
    this.getOrCreateContext(sessionId, userId).lastSearchQuery = query;
  }

  getLastScore(sessionId: string, userId: string): number | undefined {
    return this.getOrCreateContext(sessionId, userId).lastScore;
  }

  setLastScore(sessionId: string, score: number, userId: string): void {
    this.getOrCreateContext(sessionId, userId).lastScore = score;
  }

  getLastReport(sessionId: string, userId: string): any {
    return this.getOrCreateContext(sessionId, userId).lastReport;
  }

  setLastReport(sessionId: string, report: any, userId: string): void {
    this.getOrCreateContext(sessionId, userId).lastReport = report;
  }

  async getConversationHistory(sessionId: string, userId: string): Promise<Message[]> {
    // Always load from database with userId
    return await this.persistenceService.getConversationHistory(userId, sessionId);
  }

  async clearConversation(sessionId: string, userId: string): Promise<void> {
    const key = this.getContextKey(sessionId, userId);
    this.conversations.delete(key);

    // Always clear from database with userId
    await this.persistenceService.clearConversation(userId, sessionId);
  }

  async getAllSessions(userId: string): Promise<string[]> {
    // Always load from database with userId
    return await this.persistenceService.getAllSessions(userId);
  }
}
