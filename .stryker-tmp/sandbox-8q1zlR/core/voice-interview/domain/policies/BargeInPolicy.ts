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
import { PolicyResult } from "./PhaseTransitionPolicy.js";
export interface BargeInContext {
  readonly isAiSpeaking: boolean;
  readonly userAudioDurationMs: number;
}
export class BargeInPolicy {
  private static readonly MIN_BARGE_IN_DURATION_MS = 500;
  public evaluate(context: BargeInContext): PolicyResult {
    if (stryMutAct_9fa48("221")) {
      {}
    } else {
      stryCov_9fa48("221");
      if (stryMutAct_9fa48("224") ? false : stryMutAct_9fa48("223") ? true : stryMutAct_9fa48("222") ? context.isAiSpeaking : (stryCov_9fa48("222", "223", "224"), !context.isAiSpeaking)) {
        if (stryMutAct_9fa48("225")) {
          {}
        } else {
          stryCov_9fa48("225");
          return PolicyResult.deny(stryMutAct_9fa48("226") ? "" : (stryCov_9fa48("226"), "AI is not speaking, no barge-in possible"));
        }
      }
      if (stryMutAct_9fa48("230") ? context.userAudioDurationMs >= BargeInPolicy.MIN_BARGE_IN_DURATION_MS : stryMutAct_9fa48("229") ? context.userAudioDurationMs <= BargeInPolicy.MIN_BARGE_IN_DURATION_MS : stryMutAct_9fa48("228") ? false : stryMutAct_9fa48("227") ? true : (stryCov_9fa48("227", "228", "229", "230"), context.userAudioDurationMs < BargeInPolicy.MIN_BARGE_IN_DURATION_MS)) {
        if (stryMutAct_9fa48("231")) {
          {}
        } else {
          stryCov_9fa48("231");
          return PolicyResult.deny(stryMutAct_9fa48("232") ? `` : (stryCov_9fa48("232"), `Audio duration (${context.userAudioDurationMs}ms) is below barge-in threshold (${BargeInPolicy.MIN_BARGE_IN_DURATION_MS}ms)`));
        }
      }
      return PolicyResult.allow();
    }
  }
}