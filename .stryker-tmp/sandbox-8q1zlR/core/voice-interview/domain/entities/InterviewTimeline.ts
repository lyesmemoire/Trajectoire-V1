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
import type { VoiceTurn } from "./VoiceTurn.js";
import { DuplicateTurnError } from "../errors/DomainErrors.js";
import type { TurnId, ScoreSignal } from "../types.js";
export class InterviewTimeline {
  private readonly _turns: VoiceTurn[];
  private constructor(turns: VoiceTurn[]) {
    if (stryMutAct_9fa48("93")) {
      {}
    } else {
      stryCov_9fa48("93");
      this._turns = stryMutAct_9fa48("94") ? [] : (stryCov_9fa48("94"), [...turns]);
    }
  }
  public static createEmpty(): InterviewTimeline {
    if (stryMutAct_9fa48("95")) {
      {}
    } else {
      stryCov_9fa48("95");
      return new InterviewTimeline(stryMutAct_9fa48("96") ? ["Stryker was here"] : (stryCov_9fa48("96"), []));
    }
  }
  public static reconstitute(turns: VoiceTurn[]): InterviewTimeline {
    if (stryMutAct_9fa48("97")) {
      {}
    } else {
      stryCov_9fa48("97");
      return new InterviewTimeline(turns);
    }
  }
  public appendTurn(turn: VoiceTurn): void {
    if (stryMutAct_9fa48("98")) {
      {}
    } else {
      stryCov_9fa48("98");
      if (stryMutAct_9fa48("101") ? this._turns.every(t => t.id === turn.id) : stryMutAct_9fa48("100") ? false : stryMutAct_9fa48("99") ? true : (stryCov_9fa48("99", "100", "101"), this._turns.some(stryMutAct_9fa48("102") ? () => undefined : (stryCov_9fa48("102"), t => stryMutAct_9fa48("105") ? t.id !== turn.id : stryMutAct_9fa48("104") ? false : stryMutAct_9fa48("103") ? true : (stryCov_9fa48("103", "104", "105"), t.id === turn.id))))) {
        if (stryMutAct_9fa48("106")) {
          {}
        } else {
          stryCov_9fa48("106");
          throw new DuplicateTurnError(turn.id);
        }
      }
      this._turns.push(turn);
    }
  }
  public lastTurn(): VoiceTurn | null {
    if (stryMutAct_9fa48("107")) {
      {}
    } else {
      stryCov_9fa48("107");
      return (stryMutAct_9fa48("111") ? this._turns.length <= 0 : stryMutAct_9fa48("110") ? this._turns.length >= 0 : stryMutAct_9fa48("109") ? false : stryMutAct_9fa48("108") ? true : (stryCov_9fa48("108", "109", "110", "111"), this._turns.length > 0)) ? this._turns[stryMutAct_9fa48("112") ? this._turns.length + 1 : (stryCov_9fa48("112"), this._turns.length - 1)] : null;
    }
  }
  public getTurn(id: TurnId): VoiceTurn | null {
    if (stryMutAct_9fa48("113")) {
      {}
    } else {
      stryCov_9fa48("113");
      return stryMutAct_9fa48("116") ? this._turns.find(t => t.id === id) && null : stryMutAct_9fa48("115") ? false : stryMutAct_9fa48("114") ? true : (stryCov_9fa48("114", "115", "116"), this._turns.find(stryMutAct_9fa48("117") ? () => undefined : (stryCov_9fa48("117"), t => stryMutAct_9fa48("120") ? t.id !== id : stryMutAct_9fa48("119") ? false : stryMutAct_9fa48("118") ? true : (stryCov_9fa48("118", "119", "120"), t.id === id))) || null);
    }
  }
  public count(): number {
    if (stryMutAct_9fa48("121")) {
      {}
    } else {
      stryCov_9fa48("121");
      return this._turns.length;
    }
  }
  public averageScore(): number {
    if (stryMutAct_9fa48("122")) {
      {}
    } else {
      stryCov_9fa48("122");
      const scoredTurns = stryMutAct_9fa48("123") ? this._turns : (stryCov_9fa48("123"), this._turns.filter(stryMutAct_9fa48("124") ? () => undefined : (stryCov_9fa48("124"), t => stryMutAct_9fa48("127") ? t.evaluation === null : stryMutAct_9fa48("126") ? false : stryMutAct_9fa48("125") ? true : (stryCov_9fa48("125", "126", "127"), t.evaluation !== null))));
      if (stryMutAct_9fa48("130") ? scoredTurns.length !== 0 : stryMutAct_9fa48("129") ? false : stryMutAct_9fa48("128") ? true : (stryCov_9fa48("128", "129", "130"), scoredTurns.length === 0)) return 0;
      const total = scoredTurns.reduce(stryMutAct_9fa48("131") ? () => undefined : (stryCov_9fa48("131"), (sum, t) => stryMutAct_9fa48("132") ? sum - t.evaluation!.score.value : (stryCov_9fa48("132"), sum + t.evaluation!.score.value)), 0);
      return Math.round(stryMutAct_9fa48("133") ? total * scoredTurns.length : (stryCov_9fa48("133"), total / scoredTurns.length));
    }
  }
  public lastScores(count: number): ScoreSignal[] {
    if (stryMutAct_9fa48("134")) {
      {}
    } else {
      stryCov_9fa48("134");
      const scoredTurns = stryMutAct_9fa48("135") ? this._turns : (stryCov_9fa48("135"), this._turns.filter(stryMutAct_9fa48("136") ? () => undefined : (stryCov_9fa48("136"), t => stryMutAct_9fa48("139") ? t.evaluation === null : stryMutAct_9fa48("138") ? false : stryMutAct_9fa48("137") ? true : (stryCov_9fa48("137", "138", "139"), t.evaluation !== null))));
      const recent = stryMutAct_9fa48("140") ? scoredTurns : (stryCov_9fa48("140"), scoredTurns.slice(stryMutAct_9fa48("141") ? +count : (stryCov_9fa48("141"), -count)));
      return recent.map(stryMutAct_9fa48("142") ? () => undefined : (stryCov_9fa48("142"), t => t.evaluation!.score));
    }
  }
  public toArray(): ReadonlyArray<VoiceTurn> {
    if (stryMutAct_9fa48("143")) {
      {}
    } else {
      stryCov_9fa48("143");
      return Object.freeze(stryMutAct_9fa48("144") ? [] : (stryCov_9fa48("144"), [...this._turns]));
    }
  }
}