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
import type { InterviewPhase, FeedbackSignal, ScoreSignal } from "../types.js";
import { PhaseTransitionPolicy } from "../policies/PhaseTransitionPolicy.js";
export interface FlowContext {
  readonly currentPhase: InterviewPhase;
  readonly lastScore: ScoreSignal;
  readonly scoresInCurrentPhase: number[];
  readonly topicsCovered: number;
}
export interface FlowResult {
  readonly nextPhase: InterviewPhase;
  readonly nextFeedback: FeedbackSignal;
}
export class InterviewFlowService {
  private readonly transitionPolicy: PhaseTransitionPolicy;
  constructor() {
    if (stryMutAct_9fa48("303")) {
      {}
    } else {
      stryCov_9fa48("303");
      this.transitionPolicy = new PhaseTransitionPolicy();
    }
  }
  public computeNextStep(context: FlowContext): FlowResult {
    if (stryMutAct_9fa48("304")) {
      {}
    } else {
      stryCov_9fa48("304");
      const feedback = this.computeFeedback(context.lastScore.value);
      let nextPhase = context.currentPhase;
      if (stryMutAct_9fa48("307") ? feedback !== "move-on" : stryMutAct_9fa48("306") ? false : stryMutAct_9fa48("305") ? true : (stryCov_9fa48("305", "306", "307"), feedback === (stryMutAct_9fa48("308") ? "" : (stryCov_9fa48("308"), "move-on")))) {
        if (stryMutAct_9fa48("309")) {
          {}
        } else {
          stryCov_9fa48("309");
          const targetPhase = this.determineTargetPhase(context.currentPhase);
          if (stryMutAct_9fa48("312") ? targetPhase === context.currentPhase : stryMutAct_9fa48("311") ? false : stryMutAct_9fa48("310") ? true : (stryCov_9fa48("310", "311", "312"), targetPhase !== context.currentPhase)) {
            if (stryMutAct_9fa48("313")) {
              {}
            } else {
              stryCov_9fa48("313");
              const policyResult = this.transitionPolicy.evaluate(stryMutAct_9fa48("314") ? {} : (stryCov_9fa48("314"), {
                currentPhase: context.currentPhase,
                targetPhase,
                scoresInCurrentPhase: context.scoresInCurrentPhase,
                topicsCovered: context.topicsCovered
              }));
              if (stryMutAct_9fa48("316") ? false : stryMutAct_9fa48("315") ? true : (stryCov_9fa48("315", "316"), policyResult.allowed)) {
                if (stryMutAct_9fa48("317")) {
                  {}
                } else {
                  stryCov_9fa48("317");
                  nextPhase = targetPhase;
                }
              }
            }
          }
        }
      }
      return stryMutAct_9fa48("318") ? {} : (stryCov_9fa48("318"), {
        nextPhase,
        nextFeedback: feedback
      });
    }
  }
  private computeFeedback(score: number): FeedbackSignal {
    if (stryMutAct_9fa48("319")) {
      {}
    } else {
      stryCov_9fa48("319");
      if (stryMutAct_9fa48("323") ? score < 80 : stryMutAct_9fa48("322") ? score > 80 : stryMutAct_9fa48("321") ? false : stryMutAct_9fa48("320") ? true : (stryCov_9fa48("320", "321", "322", "323"), score >= 80)) return stryMutAct_9fa48("324") ? "" : (stryCov_9fa48("324"), "move-on");
      if (stryMutAct_9fa48("328") ? score < 60 : stryMutAct_9fa48("327") ? score > 60 : stryMutAct_9fa48("326") ? false : stryMutAct_9fa48("325") ? true : (stryCov_9fa48("325", "326", "327", "328"), score >= 60)) return stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), "deepen");
      return stryMutAct_9fa48("330") ? "" : (stryCov_9fa48("330"), "probe");
    }
  }
  private determineTargetPhase(currentPhase: InterviewPhase): InterviewPhase {
    if (stryMutAct_9fa48("331")) {
      {}
    } else {
      stryCov_9fa48("331");
      switch (currentPhase) {
        case stryMutAct_9fa48("333") ? "" : (stryCov_9fa48("333"), "opening"):
          if (stryMutAct_9fa48("332")) {} else {
            stryCov_9fa48("332");
            return stryMutAct_9fa48("334") ? "" : (stryCov_9fa48("334"), "exploration");
          }
        case stryMutAct_9fa48("336") ? "" : (stryCov_9fa48("336"), "exploration"):
          if (stryMutAct_9fa48("335")) {} else {
            stryCov_9fa48("335");
            return stryMutAct_9fa48("337") ? "" : (stryCov_9fa48("337"), "pressure");
          }
        case stryMutAct_9fa48("339") ? "" : (stryCov_9fa48("339"), "pressure"):
          if (stryMutAct_9fa48("338")) {} else {
            stryCov_9fa48("338");
            return stryMutAct_9fa48("340") ? "" : (stryCov_9fa48("340"), "wrap-up");
          }
        case stryMutAct_9fa48("342") ? "" : (stryCov_9fa48("342"), "wrap-up"):
          if (stryMutAct_9fa48("341")) {} else {
            stryCov_9fa48("341");
            return stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), "wrap-up");
          }
        default:
          if (stryMutAct_9fa48("344")) {} else {
            stryCov_9fa48("344");
            return currentPhase;
          }
      }
    }
  }
}