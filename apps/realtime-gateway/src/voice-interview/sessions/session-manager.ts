/**
 * sessions/session-manager.ts — Gestion d'état runtime des entretiens vocaux (P3.1).
 *
 * État IN-MEMORY uniquement (pas de DB, pas de Supabase). TTL pour éviter les
 * fuites mémoire. Isolé : ne connaît ni /product, ni ProductOutput, ni l'ATS.
 */

import {
  type InterviewState,
  createInitialState,
  applyPatch,
} from "../core/state";

export interface VoiceSession {
  id: string;
  state: InterviewState;
  createdAt: number;
  updatedAt: number;
  // ── Champs P3.2 (runtime conversationnel, in-memory) ──────────
  /** Numéro du tour courant (incrémenté à chaque réponse traitée). */
  currentTurn: number;
  /** Dernière réponse audio synthétisée (optionnelle). */
  lastAudioResponse?: ArrayBuffer;
  /** Historique des tours (transcript + question + score). */
  history: VoiceTurnRecord[];
}

/** Trace minimale d'un tour, conservée en mémoire (pas de DB). */
export interface VoiceTurnRecord {
  turn: number;
  transcript: string;
  score: number;
  question: string;
}

export interface CreateSessionInput {
  jobGap?: string;
  initialTopic?: string;
  interviewerStyle?: import("../core/state").InterviewerStyle;
  /** Question initiale déjà connue (issue de P1/P2), optionnelle. */
  initialQuestion?: string;
}

/** Horloge injectable pour la testabilité. */
export type Clock = () => number;

export interface SessionManagerOptions {
  /** Durée de vie d'une session sans activité (ms). Défaut : 30 min. */
  ttlMs?: number;
  clock?: Clock;
}

export class SessionManager {
  private sessions = new Map<string, VoiceSession>();
  private readonly ttlMs: number;
  private readonly clock: Clock;
  private seq = 0;

  constructor(options: SessionManagerOptions = {}) {
    this.ttlMs = options.ttlMs ?? 30 * 60 * 1000;
    this.clock = options.clock ?? (() => Date.now());
  }

  private genId(): string {
    this.seq += 1;
    return `vis_${this.clock().toString(36)}_${this.seq}`;
  }

  createSession(input: CreateSessionInput = {}): VoiceSession {
    this.evictExpired();
    const now = this.clock();
    const stateInput: {
      jobGap?: string;
      initialTopic?: string;
      interviewerStyle?: import("../core/state").InterviewerStyle;
    } = {};
    if (input.jobGap !== undefined) stateInput.jobGap = input.jobGap;
    if (input.initialTopic !== undefined)
      stateInput.initialTopic = input.initialTopic;
    if (input.interviewerStyle !== undefined)
      stateInput.interviewerStyle = input.interviewerStyle;
    let state = createInitialState(stateInput);
    if (input.initialQuestion?.trim()) {
      state = applyPatch(state, {
        askedQuestions: [input.initialQuestion.trim()],
      });
    }
    const session: VoiceSession = {
      id: this.genId(),
      state,
      createdAt: now,
      updatedAt: now,
      currentTurn: 0,
      history: [],
    };
    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Enregistre un tour conversationnel terminé (P3.2) : met à jour l'état,
   * incrémente le compteur de tours, stocke l'audio et l'historique.
   */
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
    const s = this.getSession(id);
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
    s.updatedAt = this.clock();
    return s;
  }

  getSession(id: string): VoiceSession | undefined {
    const s = this.sessions.get(id);
    if (!s) return undefined;
    if (this.isExpired(s)) {
      this.sessions.delete(id);
      return undefined;
    }
    return s;
  }

  updateSession(
    id: string,
    nextState: InterviewState,
  ): VoiceSession | undefined {
    const s = this.getSession(id);
    if (!s) return undefined;
    s.state = nextState;
    s.updatedAt = this.clock();
    return s;
  }

  deleteSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  /** Nombre de sessions actives (après éviction). */
  size(): number {
    this.evictExpired();
    return this.sessions.size;
  }

  private isExpired(s: VoiceSession): boolean {
    return this.clock() - s.updatedAt > this.ttlMs;
  }

  private evictExpired(): void {
    for (const [id, s] of this.sessions) {
      if (this.isExpired(s)) this.sessions.delete(id);
    }
    for (const [id, s] of this.v3Sessions) {
      if (this.clock() - s.updatedAt > this.ttlMs) this.v3Sessions.delete(id);
    }
  }

  // --- V3 Support ---
  private v3Sessions = new Map<string, any>();

  createV3(input: any) {
    this.evictExpired();
    const session = {
      ...input,
      turns: [],
      updatedAt: this.clock()
    };
    this.v3Sessions.set(input.id, session);
    return session;
  }

  close(id: string) {
    this.sessions.delete(id);
    this.v3Sessions.delete(id);
  }
}
