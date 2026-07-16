// @ts-nocheck
function stryNS_9fa48() {
  const g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  const ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  const ns = stryNS_9fa48();
  const cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    let c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    const a = arguments;
    for (let i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  const ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import type { SessionId, CandidateId, InterviewPhase, SessionStatus, Transcript, AnswerEvaluation, FeedbackSignal, TurnId } from "../types.js";
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
  readonly clock: {
    now(): Date;
  };
  readonly idGenerator: {
    generate(): string;
  };
}
export class InterviewSessionAggregate {
  private readonly _id: SessionId;
  private readonly _candidateId: CandidateId;
  private _state: InterviewState;
  private _version: number;
  private readonly _timeline: InterviewTimeline;
  private readonly _domainEvents: DomainEvent[] = stryMutAct_9fa48("0") ? ["Stryker was here"] : (stryCov_9fa48("0"), []);
  private constructor(id: SessionId, candidateId: CandidateId, state: InterviewState, timeline: InterviewTimeline, version: number) {
    if (stryMutAct_9fa48("1")) {
      {}
    } else {
      stryCov_9fa48("1");
      this._id = id;
      this._candidateId = candidateId;
      this._state = stryMutAct_9fa48("2") ? {} : (stryCov_9fa48("2"), {
        ...state
      });
      this._timeline = timeline;
      this._version = version;
    }
  }
  public static createNew(id: SessionId, candidateId: CandidateId): InterviewSessionAggregate {
    if (stryMutAct_9fa48("3")) {
      {}
    } else {
      stryCov_9fa48("3");
      return new InterviewSessionAggregate(id, candidateId, stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
        phase: stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), "opening"),
        status: stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), "not-started"),
        currentTopicId: null
      }), InterviewTimeline.createEmpty(), 0);
    }
  }
  public static reconstitute(id: SessionId, candidateId: CandidateId, state: InterviewState, timeline: InterviewTimeline, version: number): InterviewSessionAggregate {
    if (stryMutAct_9fa48("7")) {
      {}
    } else {
      stryCov_9fa48("7");
      return new InterviewSessionAggregate(id, candidateId, state, timeline, version);
    }
  }
  public get id(): SessionId {
    if (stryMutAct_9fa48("8")) {
      {}
    } else {
      stryCov_9fa48("8");
      return this._id;
    }
  }
  public get candidateId(): CandidateId {
    if (stryMutAct_9fa48("9")) {
      {}
    } else {
      stryCov_9fa48("9");
      return this._candidateId;
    }
  }
  public get phase(): InterviewPhase {
    if (stryMutAct_9fa48("10")) {
      {}
    } else {
      stryCov_9fa48("10");
      return this._state.phase;
    }
  }
  public get status(): SessionStatus {
    if (stryMutAct_9fa48("11")) {
      {}
    } else {
      stryCov_9fa48("11");
      return this._state.status;
    }
  }
  public get version(): number {
    if (stryMutAct_9fa48("12")) {
      {}
    } else {
      stryCov_9fa48("12");
      return this._version;
    }
  }
  public get timeline(): InterviewTimeline {
    if (stryMutAct_9fa48("13")) {
      {}
    } else {
      stryCov_9fa48("13");
      return this._timeline;
    }
  }
  private addDomainEvent(event: DomainEvent): void {
    if (stryMutAct_9fa48("14")) {
      {}
    } else {
      stryCov_9fa48("14");
      this._domainEvents.push(event);
    }
  }
  private createEvent(services: AggregateServices, type: string, payload: Record<string, unknown>): DomainEvent {
    if (stryMutAct_9fa48("15")) {
      {}
    } else {
      stryCov_9fa48("15");
      stryMutAct_9fa48("16") ? this._version -= 1 : (stryCov_9fa48("16"), this._version += 1);
      return {
        eventId: services.idGenerator.generate(),
        aggregateId: this._id as string,
        type,
        occurredAt: services.clock.now(),
        version: this._version,
        ...payload
      } as DomainEvent;
    }
  }
  public pullDomainEvents(): readonly DomainEvent[] {
    if (stryMutAct_9fa48("17")) {
      {}
    } else {
      stryCov_9fa48("17");
      return stryMutAct_9fa48("18") ? [] : (stryCov_9fa48("18"), [...this._domainEvents]);
    }
  }
  public clearDomainEvents(): void {
    if (stryMutAct_9fa48("19")) {
      {}
    } else {
      stryCov_9fa48("19");
      this._domainEvents.length = 0;
    }
  }
  private assertActive(): void {
    if (stryMutAct_9fa48("20")) {
      {}
    } else {
      stryCov_9fa48("20");
      if (stryMutAct_9fa48("23") ? this._state.status === "completed" && this._state.status === "aborted" : stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : (stryCov_9fa48("21", "22", "23"), (stryMutAct_9fa48("25") ? this._state.status !== "completed" : stryMutAct_9fa48("24") ? false : (stryCov_9fa48("24", "25"), this._state.status === (stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), "completed")))) || (stryMutAct_9fa48("28") ? this._state.status !== "aborted" : stryMutAct_9fa48("27") ? false : (stryCov_9fa48("27", "28"), this._state.status === (stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), "aborted")))))) {
        if (stryMutAct_9fa48("30")) {
          {}
        } else {
          stryCov_9fa48("30");
          throw new SessionAlreadyCompletedError(this._id as string);
        }
      }
      if (stryMutAct_9fa48("33") ? this._state.status !== "paused" : stryMutAct_9fa48("32") ? false : stryMutAct_9fa48("31") ? true : (stryCov_9fa48("31", "32", "33"), this._state.status === (stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), "paused")))) {
        if (stryMutAct_9fa48("35")) {
          {}
        } else {
          stryCov_9fa48("35");
          throw new InterviewPausedError(this._id as string);
        }
      }
    }
  }
  public start(targetRole: string, services: AggregateServices): void {
    if (stryMutAct_9fa48("36")) {
      {}
    } else {
      stryCov_9fa48("36");
      if (stryMutAct_9fa48("39") ? this._state.status === "not-started" : stryMutAct_9fa48("38") ? false : stryMutAct_9fa48("37") ? true : (stryCov_9fa48("37", "38", "39"), this._state.status !== (stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), "not-started")))) throw new Error(stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), "Already started"));
      this._state.status = stryMutAct_9fa48("42") ? "" : (stryCov_9fa48("42"), "in-progress");
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("43") ? "" : (stryCov_9fa48("43"), "InterviewSessionStarted"), stryMutAct_9fa48("44") ? {} : (stryCov_9fa48("44"), {
        targetRole
      })));
    }
  }
  public pause(services: AggregateServices): void {
    if (stryMutAct_9fa48("45")) {
      {}
    } else {
      stryCov_9fa48("45");
      this.assertActive();
      this._state.status = stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), "paused");
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), "InterviewSessionPaused"), {}));
    }
  }
  public resume(services: AggregateServices): void {
    if (stryMutAct_9fa48("48")) {
      {}
    } else {
      stryCov_9fa48("48");
      if (stryMutAct_9fa48("51") ? this._state.status === "paused" : stryMutAct_9fa48("50") ? false : stryMutAct_9fa48("49") ? true : (stryCov_9fa48("49", "50", "51"), this._state.status !== (stryMutAct_9fa48("52") ? "" : (stryCov_9fa48("52"), "paused")))) throw new Error(stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), "Not paused"));
      this._state.status = stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), "in-progress");
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("55") ? "" : (stryCov_9fa48("55"), "InterviewSessionResumed"), {}));
    }
  }
  public abort(reason: string, services: AggregateServices): void {
    if (stryMutAct_9fa48("56")) {
      {}
    } else {
      stryCov_9fa48("56");
      if (stryMutAct_9fa48("59") ? this._state.status === "completed" && this._state.status === "aborted" : stryMutAct_9fa48("58") ? false : stryMutAct_9fa48("57") ? true : (stryCov_9fa48("57", "58", "59"), (stryMutAct_9fa48("61") ? this._state.status !== "completed" : stryMutAct_9fa48("60") ? false : (stryCov_9fa48("60", "61"), this._state.status === (stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), "completed")))) || (stryMutAct_9fa48("64") ? this._state.status !== "aborted" : stryMutAct_9fa48("63") ? false : (stryCov_9fa48("63", "64"), this._state.status === (stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), "aborted")))))) return;
      this._state.status = stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), "aborted");
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("67") ? "" : (stryCov_9fa48("67"), "InterviewSessionAborted"), stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
        reason
      })));
    }
  }
  public complete(services: AggregateServices): void {
    if (stryMutAct_9fa48("69")) {
      {}
    } else {
      stryCov_9fa48("69");
      this.assertActive();
      this._state.status = stryMutAct_9fa48("70") ? "" : (stryCov_9fa48("70"), "completed");
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), "InterviewSessionCompleted"), stryMutAct_9fa48("72") ? {} : (stryCov_9fa48("72"), {
        totalTurns: this._timeline.count(),
        durationMs: 0
      })));
    }
  }
  public registerTranscript(turnId: TurnId, transcript: Transcript, services: AggregateServices): void {
    if (stryMutAct_9fa48("73")) {
      {}
    } else {
      stryCov_9fa48("73");
      this.assertActive();
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("74") ? "" : (stryCov_9fa48("74"), "CandidateTranscriptReceived"), stryMutAct_9fa48("75") ? {} : (stryCov_9fa48("75"), {
        turnId,
        transcript
      })));
    }
  }
  public processEvaluation(turnId: TurnId, evaluation: AnswerEvaluation, signal: FeedbackSignal): void {
    if (stryMutAct_9fa48("76")) {
      {}
    } else {
      stryCov_9fa48("76");
      this.assertActive();
      const turn = this._timeline.getTurn(turnId);
      if (stryMutAct_9fa48("79") ? false : stryMutAct_9fa48("78") ? true : stryMutAct_9fa48("77") ? turn : (stryCov_9fa48("77", "78", "79"), !turn)) throw new Error(stryMutAct_9fa48("80") ? "" : (stryCov_9fa48("80"), "Turn not found"));
    }
  }
  public advancePhase(toPhase: InterviewPhase, services: AggregateServices): void {
    if (stryMutAct_9fa48("81")) {
      {}
    } else {
      stryCov_9fa48("81");
      this.assertActive();
      if (stryMutAct_9fa48("84") ? this._state.phase !== toPhase : stryMutAct_9fa48("83") ? false : stryMutAct_9fa48("82") ? true : (stryCov_9fa48("82", "83", "84"), this._state.phase === toPhase)) return;
      const fromPhase = this._state.phase;
      this._state.phase = toPhase;
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("85") ? "" : (stryCov_9fa48("85"), "PhaseAdvanced"), stryMutAct_9fa48("86") ? {} : (stryCov_9fa48("86"), {
        fromPhase,
        toPhase
      })));
    }
  }
  public deployMunition(munitionId: string, services: AggregateServices): void {
    if (stryMutAct_9fa48("87")) {
      {}
    } else {
      stryCov_9fa48("87");
      this.assertActive();
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("88") ? "" : (stryCov_9fa48("88"), "MunitionDeployed"), stryMutAct_9fa48("89") ? {} : (stryCov_9fa48("89"), {
        munitionId
      })));
    }
  }
  public recordVoiceTurn(turn: VoiceTurn, services: AggregateServices): void {
    if (stryMutAct_9fa48("90")) {
      {}
    } else {
      stryCov_9fa48("90");
      this.assertActive();
      this._timeline.appendTurn(turn);
      this.addDomainEvent(this.createEvent(services, stryMutAct_9fa48("91") ? "" : (stryCov_9fa48("91"), "VoiceTurnCompleted"), stryMutAct_9fa48("92") ? {} : (stryCov_9fa48("92"), {
        turnId: turn.id
      })));
    }
  }
}