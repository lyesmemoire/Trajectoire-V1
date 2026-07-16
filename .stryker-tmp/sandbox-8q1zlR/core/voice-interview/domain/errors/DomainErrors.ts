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
export abstract class BaseDomainError extends Error {
  public readonly code: string;
  constructor(message: string, code: string) {
    if (stryMutAct_9fa48("195")) {
      {}
    } else {
      stryCov_9fa48("195");
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
}
export class InvalidPhaseTransitionError extends BaseDomainError {
  constructor(fromPhase: string, toPhase: string) {
    if (stryMutAct_9fa48("196")) {
      {}
    } else {
      stryCov_9fa48("196");
      super(stryMutAct_9fa48("197") ? `` : (stryCov_9fa48("197"), `Invalid phase transition from ${fromPhase} to ${toPhase}`), stryMutAct_9fa48("198") ? "" : (stryCov_9fa48("198"), "INVALID_PHASE_TRANSITION"));
    }
  }
}
export class InvalidScoreError extends BaseDomainError {
  constructor(score: number) {
    if (stryMutAct_9fa48("199")) {
      {}
    } else {
      stryCov_9fa48("199");
      super(stryMutAct_9fa48("200") ? `` : (stryCov_9fa48("200"), `Invalid score: ${score}. Must be between 0 and 100`), stryMutAct_9fa48("201") ? "" : (stryCov_9fa48("201"), "INVALID_SCORE"));
    }
  }
}
export class DuplicateTurnError extends BaseDomainError {
  constructor(turnId: string) {
    if (stryMutAct_9fa48("202")) {
      {}
    } else {
      stryCov_9fa48("202");
      super(stryMutAct_9fa48("203") ? `` : (stryCov_9fa48("203"), `Duplicate turn detected: ${turnId}`), stryMutAct_9fa48("204") ? "" : (stryCov_9fa48("204"), "DUPLICATE_TURN"));
    }
  }
}
export class InterviewPausedError extends BaseDomainError {
  constructor(sessionId: string) {
    if (stryMutAct_9fa48("205")) {
      {}
    } else {
      stryCov_9fa48("205");
      super(stryMutAct_9fa48("206") ? `` : (stryCov_9fa48("206"), `Interview is currently paused for session: ${sessionId}`), stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), "INTERVIEW_PAUSED"));
    }
  }
}
export class MunitionAlreadyUsedError extends BaseDomainError {
  constructor(munitionId: string) {
    if (stryMutAct_9fa48("208")) {
      {}
    } else {
      stryCov_9fa48("208");
      super(stryMutAct_9fa48("209") ? `` : (stryCov_9fa48("209"), `Munition has already been used in this session: ${munitionId}`), stryMutAct_9fa48("210") ? "" : (stryCov_9fa48("210"), "MUNITION_ALREADY_USED"));
    }
  }
}
export class SessionAlreadyCompletedError extends BaseDomainError {
  constructor(sessionId: string) {
    if (stryMutAct_9fa48("211")) {
      {}
    } else {
      stryCov_9fa48("211");
      super(stryMutAct_9fa48("212") ? `` : (stryCov_9fa48("212"), `Cannot modify an already completed session: ${sessionId}`), stryMutAct_9fa48("213") ? "" : (stryCov_9fa48("213"), "SESSION_ALREADY_COMPLETED"));
    }
  }
}