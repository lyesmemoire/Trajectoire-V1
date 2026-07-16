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
import type { QuestionId, TopicId, StressLevel, MunitionId } from "../types.js";
export interface QuestionExecutionProps {
  questionId: QuestionId | MunitionId;
  topic: TopicId;
  attempts: number;
  isMunition: boolean;
  stressLevel: StressLevel | null;
  success: boolean;
  abandoned: boolean;
}
export class QuestionExecution {
  private _attempts: number;
  private _success: boolean;
  private _abandoned: boolean;
  private constructor(public readonly id: QuestionId | MunitionId, public readonly topic: TopicId, public readonly isMunition: boolean, public readonly stressLevel: StressLevel | null, attempts: number, success: boolean, abandoned: boolean) {
    if (stryMutAct_9fa48("145")) {
      {}
    } else {
      stryCov_9fa48("145");
      this._attempts = attempts;
      this._success = success;
      this._abandoned = abandoned;
    }
  }
  public static createNew(id: QuestionId | MunitionId, topic: TopicId, isMunition: boolean, stressLevel: StressLevel | null): QuestionExecution {
    if (stryMutAct_9fa48("146")) {
      {}
    } else {
      stryCov_9fa48("146");
      return new QuestionExecution(id, topic, isMunition, stressLevel, 1, stryMutAct_9fa48("147") ? true : (stryCov_9fa48("147"), false), stryMutAct_9fa48("148") ? true : (stryCov_9fa48("148"), false));
    }
  }
  public static reconstitute(props: QuestionExecutionProps): QuestionExecution {
    if (stryMutAct_9fa48("149")) {
      {}
    } else {
      stryCov_9fa48("149");
      return new QuestionExecution(props.questionId, props.topic, props.isMunition, props.stressLevel, props.attempts, props.success, props.abandoned);
    }
  }
  public get attempts(): number {
    if (stryMutAct_9fa48("150")) {
      {}
    } else {
      stryCov_9fa48("150");
      return this._attempts;
    }
  }
  public get success(): boolean {
    if (stryMutAct_9fa48("151")) {
      {}
    } else {
      stryCov_9fa48("151");
      return this._success;
    }
  }
  public get abandoned(): boolean {
    if (stryMutAct_9fa48("152")) {
      {}
    } else {
      stryCov_9fa48("152");
      return this._abandoned;
    }
  }
  public recordRetry(): void {
    if (stryMutAct_9fa48("153")) {
      {}
    } else {
      stryCov_9fa48("153");
      if (stryMutAct_9fa48("156") ? this._success && this._abandoned : stryMutAct_9fa48("155") ? false : stryMutAct_9fa48("154") ? true : (stryCov_9fa48("154", "155", "156"), this._success || this._abandoned)) {
        if (stryMutAct_9fa48("157")) {
          {}
        } else {
          stryCov_9fa48("157");
          throw new Error(stryMutAct_9fa48("158") ? "" : (stryCov_9fa48("158"), "Cannot retry a question that is already succeeded or abandoned"));
        }
      }
      stryMutAct_9fa48("159") ? this._attempts -= 1 : (stryCov_9fa48("159"), this._attempts += 1);
    }
  }
  public markSuccess(): void {
    if (stryMutAct_9fa48("160")) {
      {}
    } else {
      stryCov_9fa48("160");
      if (stryMutAct_9fa48("162") ? false : stryMutAct_9fa48("161") ? true : (stryCov_9fa48("161", "162"), this._abandoned)) {
        if (stryMutAct_9fa48("163")) {
          {}
        } else {
          stryCov_9fa48("163");
          throw new Error(stryMutAct_9fa48("164") ? "" : (stryCov_9fa48("164"), "Cannot succeed an abandoned question"));
        }
      }
      this._success = stryMutAct_9fa48("165") ? false : (stryCov_9fa48("165"), true);
    }
  }
  public markAbandoned(): void {
    if (stryMutAct_9fa48("166")) {
      {}
    } else {
      stryCov_9fa48("166");
      if (stryMutAct_9fa48("168") ? false : stryMutAct_9fa48("167") ? true : (stryCov_9fa48("167", "168"), this._success)) {
        if (stryMutAct_9fa48("169")) {
          {}
        } else {
          stryCov_9fa48("169");
          throw new Error(stryMutAct_9fa48("170") ? "" : (stryCov_9fa48("170"), "Cannot abandon a succeeded question"));
        }
      }
      this._abandoned = stryMutAct_9fa48("171") ? false : (stryCov_9fa48("171"), true);
    }
  }
}