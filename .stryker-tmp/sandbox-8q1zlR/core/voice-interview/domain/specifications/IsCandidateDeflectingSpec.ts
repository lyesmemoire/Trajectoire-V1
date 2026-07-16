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
import type { ScoreSignal } from "../types.js";
export interface DeflectionContext {
  readonly lastScores: ScoreSignal[];
  readonly semanticDeflectionDetected: boolean;
}
export class IsCandidateDeflectingSpec {
  public isSatisfiedBy(context: DeflectionContext): boolean {
    if (stryMutAct_9fa48("442")) {
      {}
    } else {
      stryCov_9fa48("442");
      if (stryMutAct_9fa48("444") ? false : stryMutAct_9fa48("443") ? true : (stryCov_9fa48("443", "444"), context.semanticDeflectionDetected)) {
        if (stryMutAct_9fa48("445")) {
          {}
        } else {
          stryCov_9fa48("445");
          return stryMutAct_9fa48("446") ? false : (stryCov_9fa48("446"), true);
        }
      }
      if (stryMutAct_9fa48("450") ? context.lastScores.length < 2 : stryMutAct_9fa48("449") ? context.lastScores.length > 2 : stryMutAct_9fa48("448") ? false : stryMutAct_9fa48("447") ? true : (stryCov_9fa48("447", "448", "449", "450"), context.lastScores.length >= 2)) {
        if (stryMutAct_9fa48("451")) {
          {}
        } else {
          stryCov_9fa48("451");
          const [prev, current] = stryMutAct_9fa48("452") ? context.lastScores : (stryCov_9fa48("452"), context.lastScores.slice(stryMutAct_9fa48("453") ? +2 : (stryCov_9fa48("453"), -2)));
          if (stryMutAct_9fa48("456") ? prev && current && prev.value < 40 || current.value < 40 : stryMutAct_9fa48("455") ? false : stryMutAct_9fa48("454") ? true : (stryCov_9fa48("454", "455", "456"), (stryMutAct_9fa48("458") ? prev && current || prev.value < 40 : stryMutAct_9fa48("457") ? true : (stryCov_9fa48("457", "458"), (stryMutAct_9fa48("460") ? prev || current : stryMutAct_9fa48("459") ? true : (stryCov_9fa48("459", "460"), prev && current)) && (stryMutAct_9fa48("463") ? prev.value >= 40 : stryMutAct_9fa48("462") ? prev.value <= 40 : stryMutAct_9fa48("461") ? true : (stryCov_9fa48("461", "462", "463"), prev.value < 40)))) && (stryMutAct_9fa48("466") ? current.value >= 40 : stryMutAct_9fa48("465") ? current.value <= 40 : stryMutAct_9fa48("464") ? true : (stryCov_9fa48("464", "465", "466"), current.value < 40)))) {
            if (stryMutAct_9fa48("467")) {
              {}
            } else {
              stryCov_9fa48("467");
              return stryMutAct_9fa48("468") ? false : (stryCov_9fa48("468"), true);
            }
          }
        }
      }
      return stryMutAct_9fa48("469") ? true : (stryCov_9fa48("469"), false);
    }
  }
}