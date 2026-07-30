import type WebSocket from "ws";
import { RtcPeer } from "../rtc/peer.js";
import { DeepgramWrapper } from "../ai/deepgram.js";
import { logger } from "../telemetry/logger.js";

export const SESSION_IDLE_TIMEOUT_MS = 300_000; // 5 min
export const SESSION_CLEANUP_INTERVAL_MS = 30_000; // 30 s
export const MAX_SESSION_DURATION_MS = 3_600_000; // 1 h

// Canonical Reference: COS-OBJ-001 (blueprint.runtime.session)
// Owner: COS Team
export class Session {
  public readonly peer: RtcPeer;
  public readonly deepgram?: DeepgramWrapper;
  public lastSeenAt: number;
  public createdAt: number;
  public heartbeatInterval?: NodeJS.Timeout;
  public cleanupTimeout?: NodeJS.Timeout;

  constructor(
    public readonly sessionId: string,
    ws: WebSocket,
  ) {
    this.createdAt = Date.now();
    this.lastSeenAt = this.createdAt;
    const turnServers = process.env.TURN_URL
      ? [
          {
            urls: process.env.TURN_URL.split(","),
            username: process.env.TURN_USERNAME,
            credential: process.env.TURN_PASSWORD,
          },
        ]
      : [];

    this.peer = new RtcPeer(ws, turnServers);
    this.deepgram = new DeepgramWrapper();
  }
}

export class SessionManager {
  static instance = new SessionManager();
  private sessions = new Map<string, Session>();

  create(sessionId: string, ws: WebSocket): Session {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = new Session(sessionId, ws);
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  touch(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastSeenAt = Date.now();
    }
  }

  // Cleanup logic (run periodically)
  startCleanupLoop() {
    setInterval(() => {
      const now = Date.now();
      for (const [id, sess] of this.sessions.entries()) {
        const idle = now - sess.lastSeenAt;
        const total = now - sess.createdAt;
        if (idle > SESSION_IDLE_TIMEOUT_MS || total > MAX_SESSION_DURATION_MS) {
          sess.peer.close();
          this.sessions.delete(id);
          logger.info({ sessionId: id }, "Session terminated due to timeout");
        }
      }
    }, SESSION_CLEANUP_INTERVAL_MS);
  }
}
