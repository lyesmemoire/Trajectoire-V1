/**
 * HIIOS v4 Enterprise — Interview Repository
 *
 * Event Sourcing avec reconstruction d'état.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface InterviewEvent {
  id:              string;
  interviewId:     string;
  sequenceNumber:  number;
  eventType:       string;
  eventVersion:    number;
  payload: unknown;
  metadata?: unknown;
  actorId?:        string;
  createdAt:       Date;
}

export interface InterviewState {
  id:              string;
  organizationId:  string;
  recruiterId:     string;
  candidateId:     string;
  targetRole:      string;
  interviewType:   string;
  status:          string;
  phase:           string;
  turnCount:       number;
  elapsedMinutes:  number;
  questionsAsked: unknown[];
  responses: unknown[];
  lastUpdated:     Date;
}

// Canonical Reference: BCM-OBJ-009 (blueprint.cognitive.decision)
// Owner: Chief Cognitive Architect
export interface Decision {
  id:                   string;
  interviewId:          string;
  recommendation:       string;
  globalConfidence:     string;
  globalConfidenceScore: number;
  rationale: unknown;
  skillAssessments: unknown[];
  keyStrengths:         string[];
  keyRisks:             string[];
  openQuestions:        string[];
  nextSteps:            string[];
  isValid:              boolean;
}

// ─────────────────────────────────────────────
// REPOSITORY
// ─────────────────────────────────────────────

export class InterviewRepository {

  // En production : utiliser pg/neon/postgres
  // Pour les tests : implémentation en mémoire
  private events: Map<string, InterviewEvent[]> = new Map();
  private states: Map<string, InterviewState> = new Map();
  private decisions: Map<string, Decision> = new Map();
  private sequences: Map<string, number> = new Map();

  // ── Event Sourcing ─────────────────────────

  async appendEvent(event: InterviewEvent): Promise<void> {
    const events = this.events.get(event.interviewId) ?? [];
    const seq = this.sequences.get(event.interviewId) ?? 0;

    if (event.sequenceNumber !== seq + 1) {
      throw new Error(`Sequence number mismatch for interview ${event.interviewId}`);
    }

    events.push(event);
    this.events.set(event.interviewId, events);
    this.sequences.set(event.interviewId, event.sequenceNumber);

    // Mettre à jour l'état
    const currentState = this.states.get(event.interviewId);
    if (currentState) {
      const newState = this.applyEvent(currentState, event);
      this.states.set(event.interviewId, newState);
    }
  }

  async getEvents(interviewId: string): Promise<InterviewEvent[]> {
    return this.events.get(interviewId) ?? [];
  }

  async getNextSequenceNumber(interviewId: string): Promise<number> {
    return (this.sequences.get(interviewId) ?? 0) + 1;
  }

  // ── Reconstruction d'état ─────────────────────

  async reconstructState(interviewId: string): Promise<InterviewState | null> {
    const events = this.events.get(interviewId);
    if (!events || events.length === 0) {
      return null;
    }

    let state: InterviewState | null = null;

    for (const event of events) {
      if (!state) {
        // Premier événement doit être InterviewStarted
        if (event.eventType === "InterviewStarted") {
          state = {
            id: event.interviewId,
            organizationId: event.payload.config?.organizationId ?? "",
            recruiterId: event.metadata?.recruiterId ?? "",
            candidateId: event.payload.config?.candidateId ?? "",
            targetRole: event.payload.config?.targetRole ?? "",
            interviewType: event.payload.config?.interviewType ?? "",
            status: "in_progress",
            phase: "OPENING",
            turnCount: 0,
            elapsedMinutes: 0,
            questionsAsked: [],
            responses: [],
            lastUpdated: event.createdAt,
          };
        }
      } else {
        state = this.applyEvent(state, event);
      }
    }

    if (state) {
      this.states.set(interviewId, state);
    }

    return state;
  }

  // ── Application d'événements ─────────────────

  private applyEvent(state: InterviewState, event: InterviewEvent): InterviewState {
    switch (event.eventType) {
      case "InterviewStarted":
        return {
          ...state,
          status: "in_progress",
          phase: "OPENING",
          turnCount: 0,
          elapsedMinutes: 0,
          questionsAsked: [],
          responses: [],
          lastUpdated: event.createdAt,
        };

      case "QuestionAsked":
        return {
          ...state,
          questionsAsked: [...state.questionsAsked, event.payload.question],
          turnCount: state.turnCount + 1,
          lastUpdated: event.createdAt,
        };

      case "AnswerReceived":
        return {
          ...state,
          responses: [...state.responses, event.payload.response],
          elapsedMinutes: event.payload.elapsedMinutes ?? state.elapsedMinutes,
          lastUpdated: event.createdAt,
        };

      case "PhaseTransitioned":
        return {
          ...state,
          phase: event.payload.newPhase,
          lastUpdated: event.createdAt,
        };

      case "TurnProcessed":
        return {
          ...state,
          phase: event.payload.state?.phase ?? state.phase,
          lastUpdated: event.createdAt,
        };

      case "DecisionComputed":
        return {
          ...state,
          status: "completed",
          lastUpdated: event.createdAt,
        };

      default:
        return state;
    }
  }

  // ── Interviews ───────────────────────────────

  async findById(id: string): Promise<InterviewState | null> {
    return this.states.get(id) ?? null;
  }

  async create(interview: Omit<InterviewState, "id" | "lastUpdated">): Promise<InterviewState> {
    const id = crypto.randomUUID();
    const newInterview: InterviewState = {
      ...interview,
      id,
      lastUpdated: new Date(),
    };
    this.states.set(id, newInterview);
    return newInterview;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const state = this.states.get(id);
    if (state) {
      this.states.set(id, { ...state, status, lastUpdated: new Date() });
    }
  }

  // ── Décisions ───────────────────────────────

  async saveDecision(decision: Decision): Promise<void> {
    this.decisions.set(decision.interviewId, decision);
  }

  async getDecision(interviewId: string): Promise<Decision | null> {
    return this.decisions.get(interviewId) ?? null;
  }

  // ── Audit ───────────────────────────────────

  async logAudit(entry: {
    interviewId: string;
    eventType: string;
    description: string;
    actorId?: string;
    metadata?: unknown;
  }): Promise<void> {
    // En production : persister dans la table audit_logs
    console.log("[AUDIT]", entry);
  }

  // ── Cleanup ───────────────────────────────

  async delete(interviewId: string): Promise<void> {
    this.events.delete(interviewId);
    this.states.delete(interviewId);
    this.decisions.delete(interviewId);
    this.sequences.delete(interviewId);
  }

  async clear(): Promise<void> {
    this.events.clear();
    this.states.clear();
    this.decisions.clear();
    this.sequences.clear();
  }
}
