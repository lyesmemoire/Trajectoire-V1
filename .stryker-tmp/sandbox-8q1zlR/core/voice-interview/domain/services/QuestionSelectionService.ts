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
import type { QuestionId, TopicId, InterviewPhase } from "../types.js";
export interface QuestionBankItem {
  readonly id: QuestionId;
  readonly topic: TopicId;
  readonly phase: InterviewPhase;
}
export interface SelectionContext {
  readonly currentPhase: InterviewPhase;
  readonly askedQuestionIds: ReadonlySet<QuestionId>;
  readonly exhaustedTopicIds: ReadonlySet<TopicId>;
  readonly currentTopicId: TopicId | null;
  readonly forceNewTopic: boolean;
}
export class QuestionSelectionService {
  public selectNextQuestion(bank: ReadonlyArray<QuestionBankItem>, context: SelectionContext): QuestionId | null {
    if (stryMutAct_9fa48("384")) {
      {}
    } else {
      stryCov_9fa48("384");
      // Filter questions by phase
      let candidates = stryMutAct_9fa48("385") ? bank : (stryCov_9fa48("385"), bank.filter(stryMutAct_9fa48("386") ? () => undefined : (stryCov_9fa48("386"), q => stryMutAct_9fa48("389") ? q.phase !== context.currentPhase : stryMutAct_9fa48("388") ? false : stryMutAct_9fa48("387") ? true : (stryCov_9fa48("387", "388", "389"), q.phase === context.currentPhase))));

      // Remove already asked questions
      candidates = stryMutAct_9fa48("390") ? candidates : (stryCov_9fa48("390"), candidates.filter(stryMutAct_9fa48("391") ? () => undefined : (stryCov_9fa48("391"), q => stryMutAct_9fa48("392") ? context.askedQuestionIds.has(q.id) : (stryCov_9fa48("392"), !context.askedQuestionIds.has(q.id)))));

      // Remove exhausted topics unless we are continuing the current one explicitly and it's not exhausted
      candidates = stryMutAct_9fa48("393") ? candidates : (stryCov_9fa48("393"), candidates.filter(q => {
        if (stryMutAct_9fa48("394")) {
          {}
        } else {
          stryCov_9fa48("394");
          if (stryMutAct_9fa48("396") ? false : stryMutAct_9fa48("395") ? true : (stryCov_9fa48("395", "396"), context.exhaustedTopicIds.has(q.topic))) return stryMutAct_9fa48("397") ? true : (stryCov_9fa48("397"), false);
          return stryMutAct_9fa48("398") ? false : (stryCov_9fa48("398"), true);
        }
      }));
      if (stryMutAct_9fa48("401") ? candidates.length !== 0 : stryMutAct_9fa48("400") ? false : stryMutAct_9fa48("399") ? true : (stryCov_9fa48("399", "400", "401"), candidates.length === 0)) {
        if (stryMutAct_9fa48("402")) {
          {}
        } else {
          stryCov_9fa48("402");
          return null; // No questions left for this phase/constraints
        }
      }

      // Try to stay on the same topic if requested
      if (stryMutAct_9fa48("405") ? !context.forceNewTopic || context.currentTopicId : stryMutAct_9fa48("404") ? false : stryMutAct_9fa48("403") ? true : (stryCov_9fa48("403", "404", "405"), (stryMutAct_9fa48("406") ? context.forceNewTopic : (stryCov_9fa48("406"), !context.forceNewTopic)) && context.currentTopicId)) {
        if (stryMutAct_9fa48("407")) {
          {}
        } else {
          stryCov_9fa48("407");
          const sameTopicCandidates = stryMutAct_9fa48("408") ? candidates : (stryCov_9fa48("408"), candidates.filter(stryMutAct_9fa48("409") ? () => undefined : (stryCov_9fa48("409"), q => stryMutAct_9fa48("412") ? q.topic !== context.currentTopicId : stryMutAct_9fa48("411") ? false : stryMutAct_9fa48("410") ? true : (stryCov_9fa48("410", "411", "412"), q.topic === context.currentTopicId))));
          if (stryMutAct_9fa48("416") ? sameTopicCandidates.length <= 0 : stryMutAct_9fa48("415") ? sameTopicCandidates.length >= 0 : stryMutAct_9fa48("414") ? false : stryMutAct_9fa48("413") ? true : (stryCov_9fa48("413", "414", "415", "416"), sameTopicCandidates.length > 0)) {
            if (stryMutAct_9fa48("417")) {
              {}
            } else {
              stryCov_9fa48("417");
              return sameTopicCandidates[0]!.id;
            }
          }
        }
      }

      // Otherwise, pick a question from a new topic (not exhausted)
      const newTopicCandidates = stryMutAct_9fa48("418") ? candidates : (stryCov_9fa48("418"), candidates.filter(stryMutAct_9fa48("419") ? () => undefined : (stryCov_9fa48("419"), q => stryMutAct_9fa48("422") ? q.topic === context.currentTopicId : stryMutAct_9fa48("421") ? false : stryMutAct_9fa48("420") ? true : (stryCov_9fa48("420", "421", "422"), q.topic !== context.currentTopicId))));
      if (stryMutAct_9fa48("426") ? newTopicCandidates.length <= 0 : stryMutAct_9fa48("425") ? newTopicCandidates.length >= 0 : stryMutAct_9fa48("424") ? false : stryMutAct_9fa48("423") ? true : (stryCov_9fa48("423", "424", "425", "426"), newTopicCandidates.length > 0)) {
        if (stryMutAct_9fa48("427")) {
          {}
        } else {
          stryCov_9fa48("427");
          return newTopicCandidates[0]!.id;
        }
      }

      // Fallback to any remaining candidate
      return candidates[0]!.id;
    }
  }
}