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
import type { MunitionId, TopicId, StressLevel } from "../types.js";
export interface MunitionItem {
  readonly id: MunitionId;
  readonly topic: TopicId;
  readonly stressLevel: StressLevel;
}
export interface MunitionSelectionContext {
  readonly currentTopicId: TopicId | null;
  readonly usedMunitionIds: ReadonlySet<MunitionId>;
  readonly failedMunitionTopics: ReadonlySet<TopicId>;
}
export class MunitionSelectionService {
  public selectNextMunition(available: ReadonlyArray<MunitionItem>, context: MunitionSelectionContext): MunitionId | null {
    if (stryMutAct_9fa48("345")) {
      {}
    } else {
      stryCov_9fa48("345");
      // Remove already used munitions
      let candidates = stryMutAct_9fa48("346") ? available : (stryCov_9fa48("346"), available.filter(stryMutAct_9fa48("347") ? () => undefined : (stryCov_9fa48("347"), m => stryMutAct_9fa48("348") ? context.usedMunitionIds.has(m.id) : (stryCov_9fa48("348"), !context.usedMunitionIds.has(m.id)))));

      // Do not use munitions on topics where the candidate previously failed a munition (Immunité au Stress)
      candidates = stryMutAct_9fa48("349") ? candidates : (stryCov_9fa48("349"), candidates.filter(stryMutAct_9fa48("350") ? () => undefined : (stryCov_9fa48("350"), m => stryMutAct_9fa48("351") ? context.failedMunitionTopics.has(m.topic) : (stryCov_9fa48("351"), !context.failedMunitionTopics.has(m.topic)))));
      if (stryMutAct_9fa48("354") ? candidates.length !== 0 : stryMutAct_9fa48("353") ? false : stryMutAct_9fa48("352") ? true : (stryCov_9fa48("352", "353", "354"), candidates.length === 0)) {
        if (stryMutAct_9fa48("355")) {
          {}
        } else {
          stryCov_9fa48("355");
          return null;
        }
      }

      // Target the current topic if possible
      if (stryMutAct_9fa48("357") ? false : stryMutAct_9fa48("356") ? true : (stryCov_9fa48("356", "357"), context.currentTopicId)) {
        if (stryMutAct_9fa48("358")) {
          {}
        } else {
          stryCov_9fa48("358");
          const topicCandidates = stryMutAct_9fa48("359") ? candidates : (stryCov_9fa48("359"), candidates.filter(stryMutAct_9fa48("360") ? () => undefined : (stryCov_9fa48("360"), m => stryMutAct_9fa48("363") ? m.topic !== context.currentTopicId : stryMutAct_9fa48("362") ? false : stryMutAct_9fa48("361") ? true : (stryCov_9fa48("361", "362", "363"), m.topic === context.currentTopicId))));
          if (stryMutAct_9fa48("367") ? topicCandidates.length <= 0 : stryMutAct_9fa48("366") ? topicCandidates.length >= 0 : stryMutAct_9fa48("365") ? false : stryMutAct_9fa48("364") ? true : (stryCov_9fa48("364", "365", "366", "367"), topicCandidates.length > 0)) {
            if (stryMutAct_9fa48("368")) {
              {}
            } else {
              stryCov_9fa48("368");
              // Escalate stress: start with low, then medium, then high
              return this.pickByLowestStress(topicCandidates);
            }
          }
        }
      }

      // Fallback to any available munition
      return this.pickByLowestStress(candidates);
    }
  }
  private pickByLowestStress(candidates: MunitionItem[]): MunitionId {
    if (stryMutAct_9fa48("369")) {
      {}
    } else {
      stryCov_9fa48("369");
      const low = candidates.find(stryMutAct_9fa48("370") ? () => undefined : (stryCov_9fa48("370"), m => stryMutAct_9fa48("373") ? m.stressLevel !== "low" : stryMutAct_9fa48("372") ? false : stryMutAct_9fa48("371") ? true : (stryCov_9fa48("371", "372", "373"), m.stressLevel === (stryMutAct_9fa48("374") ? "" : (stryCov_9fa48("374"), "low")))));
      if (stryMutAct_9fa48("376") ? false : stryMutAct_9fa48("375") ? true : (stryCov_9fa48("375", "376"), low)) return low.id;
      const medium = candidates.find(stryMutAct_9fa48("377") ? () => undefined : (stryCov_9fa48("377"), m => stryMutAct_9fa48("380") ? m.stressLevel !== "medium" : stryMutAct_9fa48("379") ? false : stryMutAct_9fa48("378") ? true : (stryCov_9fa48("378", "379", "380"), m.stressLevel === (stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), "medium")))));
      if (stryMutAct_9fa48("383") ? false : stryMutAct_9fa48("382") ? true : (stryCov_9fa48("382", "383"), medium)) return medium.id;
      return candidates[0]!.id;
    }
  }
}