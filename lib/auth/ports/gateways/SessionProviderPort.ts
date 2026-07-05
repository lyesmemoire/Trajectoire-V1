import { Result } from "@/lib/core/result";

export interface SessionData {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface SessionProviderPort {
  createSession(sessionData: SessionData): Promise<Result<void>>;
  getSession(userId: string): Promise<Result<SessionData | null>>;
  refreshSession(refreshToken: string): Promise<Result<SessionData>>;
  revokeSession(userId: string): Promise<Result<void>>;
  revokeAllSessions(userId: string): Promise<Result<void>>;
  validateSession(accessToken: string): Promise<Result<boolean>>;
}
