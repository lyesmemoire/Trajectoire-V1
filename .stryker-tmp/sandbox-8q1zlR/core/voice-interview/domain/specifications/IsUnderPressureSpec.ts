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
import type { InterviewPhase } from "../types.js";
export class IsUnderPressureSpec {
  public isSatisfiedBy(currentPhase: InterviewPhase, currentExecution: QuestionExecution | null): boolean {
    if (stryMutAct_9fa48("492")) {
      {}
    } else {
      stryCov_9fa48("492");
      if (stryMutAct_9fa48("495") ? currentPhase === "pressure" : stryMutAct_9fa48("494") ? false : stryMutAct_9fa48("493") ? true : (stryCov_9fa48("493", "494", "495"), currentPhase !== (stryMutAct_9fa48("496") ? "" : (stryCov_9fa48("496"), "pressure")))) {
        if (stryMutAct_9fa48("497")) {
          {}
        } else {
          stryCov_9fa48("497");
          return stryMutAct_9fa48("498") ? true : (stryCov_9fa48("498"), false);
        }
      }
      if (stryMutAct_9fa48("501") ? currentExecution && currentExecution.isMunition && !currentExecution.abandoned || !currentExecution.success : stryMutAct_9fa48("500") ? false : stryMutAct_9fa48("499") ? true : (stryCov_9fa48("499", "500", "501"), (stryMutAct_9fa48("503") ? currentExecution && currentExecution.isMunition || !currentExecution.abandoned : stryMutAct_9fa48("502") ? true : (stryCov_9fa48("502", "503"), (stryMutAct_9fa48("505") ? currentExecution || currentExecution.isMunition : stryMutAct_9fa48("504") ? true : (stryCov_9fa48("504", "505"), currentExecution && currentExecution.isMunition)) && (stryMutAct_9fa48("506") ? currentExecution.abandoned : (stryCov_9fa48("506"), !currentExecution.abandoned)))) && (stryMutAct_9fa48("507") ? currentExecution.success : (stryCov_9fa48("507"), !currentExecution.success)))) {
        if (stryMutAct_9fa48("508")) {
          {}
        } else {
          stryCov_9fa48("508");
          return stryMutAct_9fa48("509") ? false : (stryCov_9fa48("509"), true);
        }
      }
      return stryMutAct_9fa48("510") ? true : (stryCov_9fa48("510"), false);
    }
  }
}