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
export interface PolicyResult {
  readonly allowed: boolean;
  readonly denied: boolean;
  readonly reason?: string;
}
export const PolicyResult = stryMutAct_9fa48("240") ? {} : (stryCov_9fa48("240"), {
  allow(): PolicyResult {
    if (stryMutAct_9fa48("241")) {
      {}
    } else {
      stryCov_9fa48("241");
      return Object.freeze(stryMutAct_9fa48("242") ? {} : (stryCov_9fa48("242"), {
        allowed: stryMutAct_9fa48("243") ? false : (stryCov_9fa48("243"), true),
        denied: stryMutAct_9fa48("244") ? true : (stryCov_9fa48("244"), false)
      }));
    }
  },
  deny(reason: string): PolicyResult {
    if (stryMutAct_9fa48("245")) {
      {}
    } else {
      stryCov_9fa48("245");
      return Object.freeze(stryMutAct_9fa48("246") ? {} : (stryCov_9fa48("246"), {
        allowed: stryMutAct_9fa48("247") ? true : (stryCov_9fa48("247"), false),
        denied: stryMutAct_9fa48("248") ? false : (stryCov_9fa48("248"), true),
        reason
      }));
    }
  }
});
export interface TransitionContext {
  readonly currentPhase: string;
  readonly targetPhase: string;
  readonly scoresInCurrentPhase: number[];
  readonly topicsCovered: number;
}
export class PhaseTransitionPolicy {
  public evaluate(context: TransitionContext): PolicyResult {
    if (stryMutAct_9fa48("249")) {
      {}
    } else {
      stryCov_9fa48("249");
      const {
        currentPhase,
        targetPhase,
        scoresInCurrentPhase,
        topicsCovered
      } = context;
      if (stryMutAct_9fa48("252") ? currentPhase === "exploration" || targetPhase === "pressure" : stryMutAct_9fa48("251") ? false : stryMutAct_9fa48("250") ? true : (stryCov_9fa48("250", "251", "252"), (stryMutAct_9fa48("254") ? currentPhase !== "exploration" : stryMutAct_9fa48("253") ? true : (stryCov_9fa48("253", "254"), currentPhase === (stryMutAct_9fa48("255") ? "" : (stryCov_9fa48("255"), "exploration")))) && (stryMutAct_9fa48("257") ? targetPhase !== "pressure" : stryMutAct_9fa48("256") ? true : (stryCov_9fa48("256", "257"), targetPhase === (stryMutAct_9fa48("258") ? "" : (stryCov_9fa48("258"), "pressure")))))) {
        if (stryMutAct_9fa48("259")) {
          {}
        } else {
          stryCov_9fa48("259");
          const strongScores = stryMutAct_9fa48("260") ? scoresInCurrentPhase.length : (stryCov_9fa48("260"), scoresInCurrentPhase.filter(stryMutAct_9fa48("261") ? () => undefined : (stryCov_9fa48("261"), score => stryMutAct_9fa48("265") ? score <= 60 : stryMutAct_9fa48("264") ? score >= 60 : stryMutAct_9fa48("263") ? false : stryMutAct_9fa48("262") ? true : (stryCov_9fa48("262", "263", "264", "265"), score > 60))).length);
          if (stryMutAct_9fa48("268") ? strongScores >= 3 || topicsCovered >= 2 : stryMutAct_9fa48("267") ? false : stryMutAct_9fa48("266") ? true : (stryCov_9fa48("266", "267", "268"), (stryMutAct_9fa48("271") ? strongScores < 3 : stryMutAct_9fa48("270") ? strongScores > 3 : stryMutAct_9fa48("269") ? true : (stryCov_9fa48("269", "270", "271"), strongScores >= 3)) && (stryMutAct_9fa48("274") ? topicsCovered < 2 : stryMutAct_9fa48("273") ? topicsCovered > 2 : stryMutAct_9fa48("272") ? true : (stryCov_9fa48("272", "273", "274"), topicsCovered >= 2)))) {
            if (stryMutAct_9fa48("275")) {
              {}
            } else {
              stryCov_9fa48("275");
              return PolicyResult.allow();
            }
          }
          return PolicyResult.deny(stryMutAct_9fa48("276") ? "" : (stryCov_9fa48("276"), "Must have at least 3 strong scores (>60) and 2 topics covered to enter pressure phase"));
        }
      }
      if (stryMutAct_9fa48("279") ? currentPhase === "opening" || targetPhase === "exploration" : stryMutAct_9fa48("278") ? false : stryMutAct_9fa48("277") ? true : (stryCov_9fa48("277", "278", "279"), (stryMutAct_9fa48("281") ? currentPhase !== "opening" : stryMutAct_9fa48("280") ? true : (stryCov_9fa48("280", "281"), currentPhase === (stryMutAct_9fa48("282") ? "" : (stryCov_9fa48("282"), "opening")))) && (stryMutAct_9fa48("284") ? targetPhase !== "exploration" : stryMutAct_9fa48("283") ? true : (stryCov_9fa48("283", "284"), targetPhase === (stryMutAct_9fa48("285") ? "" : (stryCov_9fa48("285"), "exploration")))))) {
        if (stryMutAct_9fa48("286")) {
          {}
        } else {
          stryCov_9fa48("286");
          const goodScores = stryMutAct_9fa48("287") ? scoresInCurrentPhase.length : (stryCov_9fa48("287"), scoresInCurrentPhase.filter(stryMutAct_9fa48("288") ? () => undefined : (stryCov_9fa48("288"), score => stryMutAct_9fa48("292") ? score <= 50 : stryMutAct_9fa48("291") ? score >= 50 : stryMutAct_9fa48("290") ? false : stryMutAct_9fa48("289") ? true : (stryCov_9fa48("289", "290", "291", "292"), score > 50))).length);
          if (stryMutAct_9fa48("295") ? goodScores >= 1 && scoresInCurrentPhase.length === 0 : stryMutAct_9fa48("294") ? false : stryMutAct_9fa48("293") ? true : (stryCov_9fa48("293", "294", "295"), (stryMutAct_9fa48("298") ? goodScores < 1 : stryMutAct_9fa48("297") ? goodScores > 1 : stryMutAct_9fa48("296") ? false : (stryCov_9fa48("296", "297", "298"), goodScores >= 1)) || (stryMutAct_9fa48("300") ? scoresInCurrentPhase.length !== 0 : stryMutAct_9fa48("299") ? false : (stryCov_9fa48("299", "300"), scoresInCurrentPhase.length === 0)))) {
            if (stryMutAct_9fa48("301")) {
              {}
            } else {
              stryCov_9fa48("301");
              // Assume allowed if opening didn't have a formal score, or if score > 50
              return PolicyResult.allow();
            }
          }
          return PolicyResult.deny(stryMutAct_9fa48("302") ? "" : (stryCov_9fa48("302"), "Must have a score > 50 to transition to exploration"));
        }
      }

      // Other transitions are allowed by default if not strictly constrained here
      return PolicyResult.allow();
    }
  }
}