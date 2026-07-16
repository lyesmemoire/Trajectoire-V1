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
import type { QuestionExecution } from "../entities/QuestionExecution.js";
export class HasExhaustedTopicSpec {
  public isSatisfiedBy(execution: QuestionExecution, maxRetriesReached: boolean): boolean {
    if (stryMutAct_9fa48("428")) {
      {}
    } else {
      stryCov_9fa48("428");
      if (stryMutAct_9fa48("430") ? false : stryMutAct_9fa48("429") ? true : (stryCov_9fa48("429", "430"), execution.success)) {
        if (stryMutAct_9fa48("431")) {
          {}
        } else {
          stryCov_9fa48("431");
          return stryMutAct_9fa48("432") ? false : (stryCov_9fa48("432"), true);
        }
      }
      if (stryMutAct_9fa48("434") ? false : stryMutAct_9fa48("433") ? true : (stryCov_9fa48("433", "434"), execution.abandoned)) {
        if (stryMutAct_9fa48("435")) {
          {}
        } else {
          stryCov_9fa48("435");
          return stryMutAct_9fa48("436") ? false : (stryCov_9fa48("436"), true);
        }
      }
      if (stryMutAct_9fa48("438") ? false : stryMutAct_9fa48("437") ? true : (stryCov_9fa48("437", "438"), maxRetriesReached)) {
        if (stryMutAct_9fa48("439")) {
          {}
        } else {
          stryCov_9fa48("439");
          return stryMutAct_9fa48("440") ? false : (stryCov_9fa48("440"), true);
        }
      }
      return stryMutAct_9fa48("441") ? true : (stryCov_9fa48("441"), false);
    }
  }
}