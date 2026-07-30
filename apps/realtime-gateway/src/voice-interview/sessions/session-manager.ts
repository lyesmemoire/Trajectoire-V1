/**
 * sessions/session-manager.ts — Gestion d'état runtime des entretiens vocaux (P3.1).
 *
 * État IN-MEMORY uniquement (pas de DB, pas de Supabase). TTL pour éviter les
 * fuites mémoire. Isolé : ne connaît ni /product, ni ProductOutput, ni l'ATS.
 */

import {
  DefaultTransportBinding,
  type InboundEventSource,
} from "../runtime/transport-binding.js";
import { VoiceRuntime } from "../runtime/voice-runtime.js";
import {
  type InterviewState,
  createInitialState,
  applyPatch,
} from "../core/state.js";
import { metrics } from "../metrics.js";

export interface VoiceSession {
  id: string;
  state: InterviewState;
  createdAt: number;
  updatedAt: number;
  currentTurn: number;
  lastAudioResponse?: ArrayBuffer;
  history: VoiceTurnRecord[];
  sink?: InboundEventSource;
  /** Timer de TTL glissant */
  ttlHandle?: NodeJS.Timeout;
  /** Callback appelé lors de la suppression de la session (dispose du runtime). */
  onDispose?: () => void;
}

export interface VoiceTurnRecord {
  turn: number;
  transcript: string;
  score: number;
  question: string;
}

export interface CreateSessionInput {
  /** ID explicite (si fourni, remplace l'ID auto-généré). */
  id?: string;
  jobGap?: string;
  initialTopic?: string;
  interviewerStyle?: import("../core/state.js").InterviewerStyle;
  initialQuestion?: string;
}

export type Clock = () => number;

export interface SessionManagerOptions {
  ttlMs?: number;
  clock?: Clock;
}

export class SessionManager {
  private sessions = new Map<string, VoiceSession>();
  private readonly ttlMs: number;
  private readonly clock: Clock;
  private seq = 0;
  private sweeperHandle?: NodeJS.Timeout;

  constructor(options: SessionManagerOptions = {}) {
    // 10 minutes par défaut
    this.ttlMs = options.ttlMs ?? 10 * 60 * 1000;
    this.clock = options.clock ?? (() => Date.now());
    
    // Sweeper périodique (belt and suspenders) toutes les 5 minutes
    this.sweeperHandle = setInterval(() => this.sweep(), 5 * 60 * 1000);
    this.sweeperHandle.unref();
  }

  private genId(): string {
    this.seq += 1;
    return `vis_${this.clock().toString(36)}_${this.seq}`;
  }

  createSession(input: CreateSessionInput = {}): VoiceSession {
    this.sweep();
    const now = this.clock();
    const stateInput: unknown = {};
    if (input.jobGap !== undefined) stateInput.jobGap = input.jobGap;
    if (input.initialTopic !== undefined) stateInput.initialTopic = input.initialTopic;
    if (input.interviewerStyle !== undefined) stateInput.interviewerStyle = input.interviewerStyle;
    
    let state = createInitialState(stateInput);
    if (input.initialQuestion?.trim()) {
      state = applyPatch(state, {
        askedQuestions: [input.initialQuestion.trim()],
      });
    }
    
    const session: VoiceSession = {
      id: input.id ?? this.genId(),
      state,
      createdAt: now,
      updatedAt: now,
      currentTurn: 0,
      history: [],
    };
    
    this.sessions.set(session.id, session);
    metrics.recordSessionCreated();
    this.bumpActivity(session.id); // Init the sliding TTL
    return session;
  }

  bumpActivity(id: string): void {
    const s = this.sessions.get(id);
    if (!s) return;
    s.updatedAt = this.clock();
    if (s.ttlHandle) clearTimeout(s.ttlHandle);
    s.ttlHandle = setTimeout(() => {
      this.deleteSession(id);
    }, this.ttlMs);
    s.ttlHandle.unref();
  }

  recordTurn(
    id: string,
    args: {
      state: InterviewState;
      transcript: string;
      score: number;
      question: string;
      audio?: ArrayBuffer;
    },
  ): VoiceSession | undefined {
    const s = this.sessions.get(id);
    if (!s) return undefined;
    s.state = args.state;
    s.currentTurn += 1;
    if (args.audio) s.lastAudioResponse = args.audio;
    s.history.push({
      turn: s.currentTurn,
      transcript: args.transcript,
      score: args.score,
      question: args.question,
    });
    this.bumpActivity(id);
    return s;
  }

  getSession(id: string): VoiceSession | undefined {
    const s = this.sessions.get(id);
    if (!s) return undefined;
    if (this.isExpired(s)) {
      this.deleteSession(id);
      return undefined;
    }
    // Accessing the session bumps the activity (useful for active interactions)
    this.bumpActivity(id);
    return s;
  }

  updateSession(
    id: string,
    nextState: InterviewState,
  ): VoiceSession | undefined {
    const s = this.sessions.get(id);
    if (!s) return undefined;
    s.state = nextState;
    this.bumpActivity(id);
    return s;
  }

  deleteSession(id: string): boolean {
    const s = this.sessions.get(id);
    if (s) {
      if (s.ttlHandle) clearTimeout(s.ttlHandle);
      // Propager l'abort au runtime en cours (TTL, disconnect, etc.)
      s.onDispose?.();
      metrics.recordSessionDuration(this.clock() - s.createdAt);
    }
    return this.sessions.delete(id);
  }

  size(): number {
    this.sweep();
    return this.sessions.size;
  }

  private isExpired(s: VoiceSession): boolean {
    return this.clock() - s.updatedAt > this.ttlMs;
  }

  public sweep(): void {
    for (const [id, s] of this.sessions) {
      if (this.isExpired(s)) {
        this.deleteSession(id);
      }
    }
    // V3 Support
    for (const [id, s] of this.v3Sessions) {
      if (this.clock() - s.updatedAt > this.ttlMs) {
        this.v3Sessions.delete(id);
      }
    }
  }

  destroy(): void {
    if (this.sweeperHandle) clearInterval(this.sweeperHandle);
    for (const id of this.sessions.keys()) {
      this.deleteSession(id);
    }
    this.v3Sessions.clear();
  }

  // --- V3 Support ---
  private v3Sessions = new Map<string, unknown>();

  createV3(input: unknown) {
    this.sweep();
    const session = {
      ...input,
      turns: [],
      updatedAt: this.clock()
    };
    this.v3Sessions.set(input.id, session);
    return session;
  }

  close(id: string) {
    this.deleteSession(id);
    this.v3Sessions.delete(id);
  }
}

// ── Singleton Instance pour gateway.ts ──────────────────────────────────
const defaultManager = new SessionManager();

export function createVoiceSession(sessionId: string, _userId: string, ws: unknown, _config: unknown): VoiceSession {
  // Utiliser l'ID externe du gateway comme clé de session
  const session = defaultManager.createSession({ id: sessionId, initialTopic: "Intro" });
  
  const binding = new DefaultTransportBinding();
  
  binding.onInstruction((instr) => {
    try {
      ws.send(JSON.stringify(instr));
      // Activité sortante = on bump la session
      defaultManager.bumpActivity(session.id);
    } catch {
      // Ignorer si le socket est fermé
    }
  });

  const runtime = new VoiceRuntime(binding, defaultManager, session.id);
  runtime.start();

  session.sink = binding;
  // Câbler le cycle de vie : deleteSession → runtime.dispose() → abort du tour en cours
  session.onDispose = () => runtime.dispose();
  return session;
}

export function getVoiceSession(sessionId: string): VoiceSession | undefined {
  return defaultManager.getSession(sessionId);
}

export function removeVoiceSession(sessionId: string, _reason?: string): boolean {
  return defaultManager.deleteSession(sessionId);
}

export function getActiveVoiceSessionCount(): number {
  return defaultManager.size();
}

