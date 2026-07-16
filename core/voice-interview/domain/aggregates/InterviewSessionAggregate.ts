import type { 
  SessionId, CandidateId, InterviewPhase, SessionStatus, 
  Transcript, AnswerEvaluation, FeedbackSignal, TurnId
} from "../types.js";
import type { DomainEvent } from "../events/DomainEvent.js";
import { InterviewTimeline } from "../entities/InterviewTimeline.js";
import { VoiceTurn } from "../entities/VoiceTurn.js";
import { SessionAlreadyCompletedError, InterviewPausedError } from "../errors/DomainErrors.js";

export interface InterviewState {
  phase: InterviewPhase;
  status: SessionStatus;
  currentTopicId: string | null;
}

/**
 * Ports injected into the Aggregate for deterministic ID/Clock generation.
 * Per AGENTS.md: "Never use new Date() or crypto.randomUUID() directly in the domain."
 */
export interface AggregateServices {
  readonly clock: { now(): Date };
  readonly idGenerator: { generate(): string };
}

export class InterviewSessionAggregate {
  private readonly _id: SessionId;
  private readonly _candidateId: CandidateId;
  private _state: InterviewState;
  private _version: number;
  private readonly _timeline: InterviewTimeline;
  private readonly _domainEvents: DomainEvent[] = [];

  private constructor(
    id: SessionId,
    candidateId: CandidateId,
    state: InterviewState,
    timeline: InterviewTimeline,
    version: number
  ) {
    this._id = id;
    this._candidateId = candidateId;
    this._state = { ...state };
    this._timeline = timeline;
    this._version = version;
  }

  public static createNew(id: SessionId, candidateId: CandidateId): InterviewSessionAggregate {
    return new InterviewSessionAggregate(
      id,
      candidateId,
      { phase: "opening", status: "not-started", currentTopicId: null },
      InterviewTimeline.createEmpty(),
      0
    );
  }

  public static reconstitute(
    id: SessionId,
    candidateId: CandidateId,
    state: InterviewState,
    timeline: InterviewTimeline,
    version: number
  ): InterviewSessionAggregate {
    return new InterviewSessionAggregate(id, candidateId, state, timeline, version);
  }

  public get id(): SessionId { return this._id; }
  public get candidateId(): CandidateId { return this._candidateId; }
  public get phase(): InterviewPhase { return this._state.phase; }
  public get status(): SessionStatus { return this._state.status; }
  public get version(): number { return this._version; }
  public get timeline(): InterviewTimeline { return this._timeline; }

  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  private createEvent(services: AggregateServices, type: string, payload: Record<string, unknown>): DomainEvent {
    this._version += 1;
    return {
      eventId: services.idGenerator.generate(),
      aggregateId: this._id as string,
      type,
      occurredAt: services.clock.now(),
      version: this._version,
      ...payload
    } as DomainEvent;
  }

  public pullDomainEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  public clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }

  private assertActive(): void {
    if (this._state.status === "completed" || this._state.status === "aborted") {
      throw new SessionAlreadyCompletedError(this._id as string);
    }
    if (this._state.status === "paused") {
      throw new InterviewPausedError(this._id as string);
    }
  }

  public start(targetRole: string, services: AggregateServices): void {
    if (this._state.status !== "not-started") throw new Error("Already started");
    this._state.status = "in-progress";
    this.addDomainEvent(this.createEvent(services, "InterviewSessionStarted", { targetRole }));
  }

  public pause(services: AggregateServices): void {
    this.assertActive();
    this._state.status = "paused";
    this.addDomainEvent(this.createEvent(services, "InterviewSessionPaused", {}));
  }

  public resume(services: AggregateServices): void {
    if (this._state.status !== "paused") throw new Error("Not paused");
    this._state.status = "in-progress";
    this.addDomainEvent(this.createEvent(services, "InterviewSessionResumed", {}));
  }

  public abort(reason: string, services: AggregateServices): void {
    if (this._state.status === "completed" || this._state.status === "aborted") return;
    this._state.status = "aborted";
    this.addDomainEvent(this.createEvent(services, "InterviewSessionAborted", { reason }));
  }

  public complete(services: AggregateServices): void {
    this.assertActive();
    this._state.status = "completed";
    this.addDomainEvent(this.createEvent(services, "InterviewSessionCompleted", {
      totalTurns: this._timeline.count(),
      durationMs: 0
    }));
  }

  public registerTranscript(turnId: TurnId, transcript: Transcript, services: AggregateServices): void {
    this.assertActive();
    this.addDomainEvent(this.createEvent(services, "CandidateTranscriptReceived", {
      turnId, transcript
    }));
  }

  public processEvaluation(turnId: TurnId, evaluation: AnswerEvaluation, signal: FeedbackSignal): void {
    this.assertActive();
    const turn = this._timeline.getTurn(turnId);
    if (!turn) throw new Error("Turn not found");
  }

  public advancePhase(toPhase: InterviewPhase, services: AggregateServices): void {
    this.assertActive();
    if (this._state.phase === toPhase) return;
    const fromPhase = this._state.phase;
    this._state.phase = toPhase;
    this.addDomainEvent(this.createEvent(services, "PhaseAdvanced", { fromPhase, toPhase }));
  }

  public deployMunition(munitionId: string, services: AggregateServices): void {
    this.assertActive();
    this.addDomainEvent(this.createEvent(services, "MunitionDeployed", { munitionId }));
  }

  public recordVoiceTurn(turn: VoiceTurn, services: AggregateServices): void {
    this.assertActive();
    this._timeline.appendTurn(turn);
    this.addDomainEvent(this.createEvent(services, "VoiceTurnCompleted", { turnId: turn.id }));
  }
}
