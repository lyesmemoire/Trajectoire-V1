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
import type { InterviewPhase } from "../types.js";
export interface ReadyToCompleteContext {
  readonly currentPhase: InterviewPhase;
  readonly totalTurns: number;
  readonly targetPhasesCompleted: boolean;
  readonly isForcedByAntiLoop: boolean;
}
export class IsInterviewReadyToCompleteSpec {
  public isSatisfiedBy(context: ReadyToCompleteContext): boolean {
    if (stryMutAct_9fa48("470")) {
      {}
    } else {
      stryCov_9fa48("470");
      if (stryMutAct_9fa48("472") ? false : stryMutAct_9fa48("471") ? true : (stryCov_9fa48("471", "472"), context.isForcedByAntiLoop)) {
        if (stryMutAct_9fa48("473")) {
          {}
        } else {
          stryCov_9fa48("473");
          return stryMutAct_9fa48("474") ? false : (stryCov_9fa48("474"), true);
        }
      }
      if (stryMutAct_9fa48("477") ? context.currentPhase === "wrap-up" || context.targetPhasesCompleted : stryMutAct_9fa48("476") ? false : stryMutAct_9fa48("475") ? true : (stryCov_9fa48("475", "476", "477"), (stryMutAct_9fa48("479") ? context.currentPhase !== "wrap-up" : stryMutAct_9fa48("478") ? true : (stryCov_9fa48("478", "479"), context.currentPhase === (stryMutAct_9fa48("480") ? "" : (stryCov_9fa48("480"), "wrap-up")))) && context.targetPhasesCompleted)) {
        if (stryMutAct_9fa48("481")) {
          {}
        } else {
          stryCov_9fa48("481");
          return stryMutAct_9fa48("482") ? false : (stryCov_9fa48("482"), true);
        }
      }

      // Example minimal condition if not wrap-up
      if (stryMutAct_9fa48("485") ? context.totalTurns >= 15 || context.targetPhasesCompleted : stryMutAct_9fa48("484") ? false : stryMutAct_9fa48("483") ? true : (stryCov_9fa48("483", "484", "485"), (stryMutAct_9fa48("488") ? context.totalTurns < 15 : stryMutAct_9fa48("487") ? context.totalTurns > 15 : stryMutAct_9fa48("486") ? true : (stryCov_9fa48("486", "487", "488"), context.totalTurns >= 15)) && context.targetPhasesCompleted)) {
        if (stryMutAct_9fa48("489")) {
          {}
        } else {
          stryCov_9fa48("489");
          return stryMutAct_9fa48("490") ? false : (stryCov_9fa48("490"), true);
        }
      }
      return stryMutAct_9fa48("491") ? true : (stryCov_9fa48("491"), false);
    }
  }
}