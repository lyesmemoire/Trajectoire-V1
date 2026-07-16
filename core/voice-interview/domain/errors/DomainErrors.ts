export abstract class BaseDomainError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidPhaseTransitionError extends BaseDomainError {
  constructor(fromPhase: string, toPhase: string) {
    super(`Invalid phase transition from ${fromPhase} to ${toPhase}`, "INVALID_PHASE_TRANSITION");
  }
}

export class InvalidScoreError extends BaseDomainError {
  constructor(score: number) {
    super(`Invalid score: ${score}. Must be between 0 and 100`, "INVALID_SCORE");
  }
}

export class DuplicateTurnError extends BaseDomainError {
  constructor(turnId: string) {
    super(`Duplicate turn detected: ${turnId}`, "DUPLICATE_TURN");
  }
}

export class InterviewPausedError extends BaseDomainError {
  constructor(sessionId: string) {
    super(`Interview is currently paused for session: ${sessionId}`, "INTERVIEW_PAUSED");
  }
}

export class MunitionAlreadyUsedError extends BaseDomainError {
  constructor(munitionId: string) {
    super(`Munition has already been used in this session: ${munitionId}`, "MUNITION_ALREADY_USED");
  }
}

export class SessionAlreadyCompletedError extends BaseDomainError {
  constructor(sessionId: string) {
    super(`Cannot modify an already completed session: ${sessionId}`, "SESSION_ALREADY_COMPLETED");
  }
}
