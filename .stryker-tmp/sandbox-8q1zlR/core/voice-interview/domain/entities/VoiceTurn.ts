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
import type { TurnId, Transcript, AnswerEvaluation, FeedbackSignal, TurnTiming, AIResponse } from "../types.js";
export type UserIntent = "answer" | "command" | "silence" | "interruption";
export interface VoiceTurnProps {
  id: TurnId;
  transcript: Transcript | null;
  intent: UserIntent;
  evaluation: AnswerEvaluation | null;
  aiResponse: AIResponse | null;
  feedbackSignal: FeedbackSignal | null;
  timing: TurnTiming;
}
export class VoiceTurn {
  private readonly _props: VoiceTurnProps;
  private constructor(props: VoiceTurnProps) {
    if (stryMutAct_9fa48("172")) {
      {}
    } else {
      stryCov_9fa48("172");
      this._props = Object.freeze(stryMutAct_9fa48("173") ? {} : (stryCov_9fa48("173"), {
        ...props
      }));
    }
  }
  public static create(props: VoiceTurnProps): VoiceTurn {
    if (stryMutAct_9fa48("174")) {
      {}
    } else {
      stryCov_9fa48("174");
      // Invariants
      if (stryMutAct_9fa48("177") ? props.intent === "answer" || !props.transcript : stryMutAct_9fa48("176") ? false : stryMutAct_9fa48("175") ? true : (stryCov_9fa48("175", "176", "177"), (stryMutAct_9fa48("179") ? props.intent !== "answer" : stryMutAct_9fa48("178") ? true : (stryCov_9fa48("178", "179"), props.intent === (stryMutAct_9fa48("180") ? "" : (stryCov_9fa48("180"), "answer")))) && (stryMutAct_9fa48("181") ? props.transcript : (stryCov_9fa48("181"), !props.transcript)))) {
        if (stryMutAct_9fa48("182")) {
          {}
        } else {
          stryCov_9fa48("182");
          throw new Error(stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), "VoiceTurn with answer intent must have a transcript"));
        }
      }
      return new VoiceTurn(props);
    }
  }
  public get id(): TurnId {
    if (stryMutAct_9fa48("184")) {
      {}
    } else {
      stryCov_9fa48("184");
      return this._props.id;
    }
  }
  public get transcript(): Transcript | null {
    if (stryMutAct_9fa48("185")) {
      {}
    } else {
      stryCov_9fa48("185");
      return this._props.transcript;
    }
  }
  public get intent(): UserIntent {
    if (stryMutAct_9fa48("186")) {
      {}
    } else {
      stryCov_9fa48("186");
      return this._props.intent;
    }
  }
  public get evaluation(): AnswerEvaluation | null {
    if (stryMutAct_9fa48("187")) {
      {}
    } else {
      stryCov_9fa48("187");
      return this._props.evaluation;
    }
  }
  public get aiResponse(): AIResponse | null {
    if (stryMutAct_9fa48("188")) {
      {}
    } else {
      stryCov_9fa48("188");
      return this._props.aiResponse;
    }
  }
  public get feedbackSignal(): FeedbackSignal | null {
    if (stryMutAct_9fa48("189")) {
      {}
    } else {
      stryCov_9fa48("189");
      return this._props.feedbackSignal;
    }
  }
  public get timing(): TurnTiming {
    if (stryMutAct_9fa48("190")) {
      {}
    } else {
      stryCov_9fa48("190");
      return this._props.timing;
    }
  }

  /**
   * Creates a mutated copy of this VoiceTurn (Value Object style mutation)
   */
  public withEvaluation(evaluation: AnswerEvaluation, signal: FeedbackSignal): VoiceTurn {
    if (stryMutAct_9fa48("191")) {
      {}
    } else {
      stryCov_9fa48("191");
      return new VoiceTurn(stryMutAct_9fa48("192") ? {} : (stryCov_9fa48("192"), {
        ...this._props,
        evaluation,
        feedbackSignal: signal
      }));
    }
  }
  public withAIResponse(aiResponse: AIResponse): VoiceTurn {
    if (stryMutAct_9fa48("193")) {
      {}
    } else {
      stryCov_9fa48("193");
      return new VoiceTurn(stryMutAct_9fa48("194") ? {} : (stryCov_9fa48("194"), {
        ...this._props,
        aiResponse
      }));
    }
  }
}