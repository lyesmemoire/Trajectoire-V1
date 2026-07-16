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
export class AntiInfiniteLoopPolicy {
  private static readonly MAX_TURNS = 20;
  public evaluate(currentTurnCount: number): PolicyResult {
    if (stryMutAct_9fa48("214")) {
      {}
    } else {
      stryCov_9fa48("214");
      if (stryMutAct_9fa48("218") ? currentTurnCount < AntiInfiniteLoopPolicy.MAX_TURNS : stryMutAct_9fa48("217") ? currentTurnCount > AntiInfiniteLoopPolicy.MAX_TURNS : stryMutAct_9fa48("216") ? false : stryMutAct_9fa48("215") ? true : (stryCov_9fa48("215", "216", "217", "218"), currentTurnCount >= AntiInfiniteLoopPolicy.MAX_TURNS)) {
        if (stryMutAct_9fa48("219")) {
          {}
        } else {
          stryCov_9fa48("219");
          return PolicyResult.deny(stryMutAct_9fa48("220") ? `` : (stryCov_9fa48("220"), `Maximum turns limit reached (${AntiInfiniteLoopPolicy.MAX_TURNS}). Must wrap up.`));
        }
      }
      return PolicyResult.allow();
    }
  }
}