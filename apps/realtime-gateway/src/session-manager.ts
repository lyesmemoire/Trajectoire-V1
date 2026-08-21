// @ts-nocheck
/**
 * session-manager.ts
 * Reconstructed file with B6 fixes included.
 */
import type { WebSocket } from "ws";

export interface ActiveSession {
  /** Identifiant unique de la session (= interviewId Prisma) */
  sessionId: string;
  /** Socket WebSocket du client */
  ws: WebSocket;
  /** UserId Supabase authentifiÃ© */
  userId: string;
  /** Timestamp de crÃ©ation (ms) */
  createdAt: number;
  /** AbortController pour annuler les appels LLM/TTS en vol */
  abortController: AbortController;
  /** Timer du TTL de sÃ©curitÃ© (45 min) */
  ttlTimer: NodeJS.Timeout;
  /** Nombre de questions posÃ©es jusqu'ici */
  questionCount: number;
  /** Ã‰tat courant de la session */
  status: "active" | "completing" | "completed" | "error";
  /**
   * B6 â€” Callback de fermeture du stream Deepgram STT.
   * AssignÃ© par interview-engine aprÃ¨s ouverture de SttSession.
   * AppelÃ© dans destroySession() pour fermer proprement le stream.
   */
  sttCleanup?: () => void;
}

const activeSessions = new Map<string, ActiveSession>();

export function registerSession(sessionId: string, ws: WebSocket, userId: string): ActiveSession {
  const session: ActiveSession = {
    sessionId,
    ws,
    userId,
    createdAt: Date.now(),
    abortController: new AbortController(),
    ttlTimer: setTimeout(() => destroySession(sessionId), 45 * 60 * 1000),
    questionCount: 0,
    status: "active",
  };
  activeSessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): ActiveSession | undefined {
  return activeSessions.get(sessionId);
}

export function destroySession(sessionId: string): void {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  // 1. Annuler tous les appels LLM/TTS en cours pour cette session
  // Le signal est transmis Ã  llm-strict.ts, tts.ts et stt.ts.
  if (!session.abortController.signal.aborted) {
    session.abortController.abort();
  }

  // 2. B6 â€” Fermer le stream Deepgram STT s'il est ouvert.
  // Sans ce cleanup, Deepgram continue Ã  transcrire et facturer.
  if (session.sttCleanup) {
    try {
      session.sttCleanup();
    } catch (error) {
      console.error(`[SessionManager] Erreur STT cleanup session ${sessionId}:`, err);
    }
  }

  // 3. Annuler le TTL timer
  clearTimeout(session.ttlTimer);

  // 4. Retirer du Map
  activeSessions.delete(sessionId);
}

export function destroyAllSessions(): void {
  for (const sessionId of activeSessions.keys()) {
    destroySession(sessionId);
  }
}

export function getActiveSessionCount(): number {
  return activeSessions.size;
}

export function getSessionsSnapshot(): ActiveSession[] {
  return Array.from(activeSessions.values());
}
