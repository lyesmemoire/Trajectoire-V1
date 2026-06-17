import type { StructuredScore } from "../core/scoring";
import type { PremiumReport } from "../core/premium-report";

export interface InterviewRecord {
  sessionId: string;
  userId: string;
  targetRole?: string;
  startedAt: number;
  endedAt?: number;
  transcript: string[];
  metrics?: {
    avgSttMs?: number;
    avgLlmMs?: number;
    avgTtsMs?: number;
  };
  score?: StructuredScore | number | Record<string, unknown>;
  premiumReport?: PremiumReport | Record<string, unknown>;
  interview_context?: Record<string, unknown>;
}

export interface InterviewRepository {
  create(record: InterviewRecord): Promise<void>;
  update(sessionId: string, partial: Partial<InterviewRecord>): Promise<void>;
  get(sessionId: string): Promise<InterviewRecord | undefined | null>;
  listByUser(userId: string): Promise<InterviewRecord[]>;
}

export class InMemoryInterviewRepository implements InterviewRepository {
  private store = new Map<string, InterviewRecord>();

  async create(record: InterviewRecord): Promise<void> {
    this.store.set(record.sessionId, record);
  }

  async update(sessionId: string, partial: Partial<InterviewRecord>): Promise<void> {
    const existing = this.store.get(sessionId);
    if (!existing) return;
    this.store.set(sessionId, { ...existing, ...partial });
  }

  async get(sessionId: string): Promise<InterviewRecord | undefined> {
    return this.store.get(sessionId);
  }

  async listByUser(userId: string): Promise<InterviewRecord[]> {
    return Array.from(this.store.values())
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }
}
