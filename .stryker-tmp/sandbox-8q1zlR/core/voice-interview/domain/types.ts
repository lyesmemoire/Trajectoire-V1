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
declare const brand: unique symbol;
export type Brand<T, TBrand extends string> = T & {
  readonly [brand]: TBrand;
};

// --- Branded Types ---

export type SessionId = Brand<string, "SessionId">;
export const SessionId = stryMutAct_9fa48("511") ? {} : (stryCov_9fa48("511"), {
  create(value: string): SessionId {
    if (stryMutAct_9fa48("512")) {
      {}
    } else {
      stryCov_9fa48("512");
      if (stryMutAct_9fa48("515") ? typeof value !== "string" && value.trim().length === 0 : stryMutAct_9fa48("514") ? false : stryMutAct_9fa48("513") ? true : (stryCov_9fa48("513", "514", "515"), (stryMutAct_9fa48("517") ? typeof value === "string" : stryMutAct_9fa48("516") ? false : (stryCov_9fa48("516", "517"), typeof value !== (stryMutAct_9fa48("518") ? "" : (stryCov_9fa48("518"), "string")))) || (stryMutAct_9fa48("520") ? value.trim().length !== 0 : stryMutAct_9fa48("519") ? false : (stryCov_9fa48("519", "520"), (stryMutAct_9fa48("521") ? value.length : (stryCov_9fa48("521"), value.trim().length)) === 0)))) {
        if (stryMutAct_9fa48("522")) {
          {}
        } else {
          stryCov_9fa48("522");
          throw new Error(stryMutAct_9fa48("523") ? "" : (stryCov_9fa48("523"), "Invalid SessionId: must be a non-empty string"));
        }
      }
      return value as SessionId;
    }
  },
  isSessionId(value: unknown): value is SessionId {
    if (stryMutAct_9fa48("524")) {
      {}
    } else {
      stryCov_9fa48("524");
      return stryMutAct_9fa48("527") ? typeof value === "string" || value.trim().length > 0 : stryMutAct_9fa48("526") ? false : stryMutAct_9fa48("525") ? true : (stryCov_9fa48("525", "526", "527"), (stryMutAct_9fa48("529") ? typeof value !== "string" : stryMutAct_9fa48("528") ? true : (stryCov_9fa48("528", "529"), typeof value === (stryMutAct_9fa48("530") ? "" : (stryCov_9fa48("530"), "string")))) && (stryMutAct_9fa48("533") ? value.trim().length <= 0 : stryMutAct_9fa48("532") ? value.trim().length >= 0 : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532", "533"), (stryMutAct_9fa48("534") ? value.length : (stryCov_9fa48("534"), value.trim().length)) > 0)));
    }
  }
});
export type CandidateId = Brand<string, "CandidateId">;
export const CandidateId = stryMutAct_9fa48("535") ? {} : (stryCov_9fa48("535"), {
  create(value: string): CandidateId {
    if (stryMutAct_9fa48("536")) {
      {}
    } else {
      stryCov_9fa48("536");
      if (stryMutAct_9fa48("539") ? typeof value !== "string" && value.trim().length === 0 : stryMutAct_9fa48("538") ? false : stryMutAct_9fa48("537") ? true : (stryCov_9fa48("537", "538", "539"), (stryMutAct_9fa48("541") ? typeof value === "string" : stryMutAct_9fa48("540") ? false : (stryCov_9fa48("540", "541"), typeof value !== (stryMutAct_9fa48("542") ? "" : (stryCov_9fa48("542"), "string")))) || (stryMutAct_9fa48("544") ? value.trim().length !== 0 : stryMutAct_9fa48("543") ? false : (stryCov_9fa48("543", "544"), (stryMutAct_9fa48("545") ? value.length : (stryCov_9fa48("545"), value.trim().length)) === 0)))) {
        if (stryMutAct_9fa48("546")) {
          {}
        } else {
          stryCov_9fa48("546");
          throw new Error(stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), "Invalid CandidateId: must be a non-empty string"));
        }
      }
      return value as CandidateId;
    }
  },
  isCandidateId(value: unknown): value is CandidateId {
    if (stryMutAct_9fa48("548")) {
      {}
    } else {
      stryCov_9fa48("548");
      return stryMutAct_9fa48("551") ? typeof value === "string" || value.trim().length > 0 : stryMutAct_9fa48("550") ? false : stryMutAct_9fa48("549") ? true : (stryCov_9fa48("549", "550", "551"), (stryMutAct_9fa48("553") ? typeof value !== "string" : stryMutAct_9fa48("552") ? true : (stryCov_9fa48("552", "553"), typeof value === (stryMutAct_9fa48("554") ? "" : (stryCov_9fa48("554"), "string")))) && (stryMutAct_9fa48("557") ? value.trim().length <= 0 : stryMutAct_9fa48("556") ? value.trim().length >= 0 : stryMutAct_9fa48("555") ? true : (stryCov_9fa48("555", "556", "557"), (stryMutAct_9fa48("558") ? value.length : (stryCov_9fa48("558"), value.trim().length)) > 0)));
    }
  }
});
export type TurnId = Brand<string, "TurnId">;
export const TurnId = stryMutAct_9fa48("559") ? {} : (stryCov_9fa48("559"), {
  create(value: string): TurnId {
    if (stryMutAct_9fa48("560")) {
      {}
    } else {
      stryCov_9fa48("560");
      if (stryMutAct_9fa48("563") ? typeof value !== "string" && value.trim().length === 0 : stryMutAct_9fa48("562") ? false : stryMutAct_9fa48("561") ? true : (stryCov_9fa48("561", "562", "563"), (stryMutAct_9fa48("565") ? typeof value === "string" : stryMutAct_9fa48("564") ? false : (stryCov_9fa48("564", "565"), typeof value !== (stryMutAct_9fa48("566") ? "" : (stryCov_9fa48("566"), "string")))) || (stryMutAct_9fa48("568") ? value.trim().length !== 0 : stryMutAct_9fa48("567") ? false : (stryCov_9fa48("567", "568"), (stryMutAct_9fa48("569") ? value.length : (stryCov_9fa48("569"), value.trim().length)) === 0)))) {
        if (stryMutAct_9fa48("570")) {
          {}
        } else {
          stryCov_9fa48("570");
          throw new Error(stryMutAct_9fa48("571") ? "" : (stryCov_9fa48("571"), "Invalid TurnId: must be a non-empty string"));
        }
      }
      return value as TurnId;
    }
  },
  isTurnId(value: unknown): value is TurnId {
    if (stryMutAct_9fa48("572")) {
      {}
    } else {
      stryCov_9fa48("572");
      return stryMutAct_9fa48("575") ? typeof value === "string" || value.trim().length > 0 : stryMutAct_9fa48("574") ? false : stryMutAct_9fa48("573") ? true : (stryCov_9fa48("573", "574", "575"), (stryMutAct_9fa48("577") ? typeof value !== "string" : stryMutAct_9fa48("576") ? true : (stryCov_9fa48("576", "577"), typeof value === (stryMutAct_9fa48("578") ? "" : (stryCov_9fa48("578"), "string")))) && (stryMutAct_9fa48("581") ? value.trim().length <= 0 : stryMutAct_9fa48("580") ? value.trim().length >= 0 : stryMutAct_9fa48("579") ? true : (stryCov_9fa48("579", "580", "581"), (stryMutAct_9fa48("582") ? value.length : (stryCov_9fa48("582"), value.trim().length)) > 0)));
    }
  }
});
export type QuestionId = Brand<string, "QuestionId">;
export const QuestionId = stryMutAct_9fa48("583") ? {} : (stryCov_9fa48("583"), {
  create(value: string): QuestionId {
    if (stryMutAct_9fa48("584")) {
      {}
    } else {
      stryCov_9fa48("584");
      if (stryMutAct_9fa48("587") ? typeof value !== "string" && value.trim().length === 0 : stryMutAct_9fa48("586") ? false : stryMutAct_9fa48("585") ? true : (stryCov_9fa48("585", "586", "587"), (stryMutAct_9fa48("589") ? typeof value === "string" : stryMutAct_9fa48("588") ? false : (stryCov_9fa48("588", "589"), typeof value !== (stryMutAct_9fa48("590") ? "" : (stryCov_9fa48("590"), "string")))) || (stryMutAct_9fa48("592") ? value.trim().length !== 0 : stryMutAct_9fa48("591") ? false : (stryCov_9fa48("591", "592"), (stryMutAct_9fa48("593") ? value.length : (stryCov_9fa48("593"), value.trim().length)) === 0)))) {
        if (stryMutAct_9fa48("594")) {
          {}
        } else {
          stryCov_9fa48("594");
          throw new Error(stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), "Invalid QuestionId: must be a non-empty string"));
        }
      }
      return value as QuestionId;
    }
  },
  isQuestionId(value: unknown): value is QuestionId {
    if (stryMutAct_9fa48("596")) {
      {}
    } else {
      stryCov_9fa48("596");
      return stryMutAct_9fa48("599") ? typeof value === "string" || value.trim().length > 0 : stryMutAct_9fa48("598") ? false : stryMutAct_9fa48("597") ? true : (stryCov_9fa48("597", "598", "599"), (stryMutAct_9fa48("601") ? typeof value !== "string" : stryMutAct_9fa48("600") ? true : (stryCov_9fa48("600", "601"), typeof value === (stryMutAct_9fa48("602") ? "" : (stryCov_9fa48("602"), "string")))) && (stryMutAct_9fa48("605") ? value.trim().length <= 0 : stryMutAct_9fa48("604") ? value.trim().length >= 0 : stryMutAct_9fa48("603") ? true : (stryCov_9fa48("603", "604", "605"), (stryMutAct_9fa48("606") ? value.length : (stryCov_9fa48("606"), value.trim().length)) > 0)));
    }
  }
});
export type TopicId = Brand<string, "TopicId">;
export const TopicId = stryMutAct_9fa48("607") ? {} : (stryCov_9fa48("607"), {
  create(value: string): TopicId {
    if (stryMutAct_9fa48("608")) {
      {}
    } else {
      stryCov_9fa48("608");
      if (stryMutAct_9fa48("611") ? typeof value !== "string" && value.trim().length === 0 : stryMutAct_9fa48("610") ? false : stryMutAct_9fa48("609") ? true : (stryCov_9fa48("609", "610", "611"), (stryMutAct_9fa48("613") ? typeof value === "string" : stryMutAct_9fa48("612") ? false : (stryCov_9fa48("612", "613"), typeof value !== (stryMutAct_9fa48("614") ? "" : (stryCov_9fa48("614"), "string")))) || (stryMutAct_9fa48("616") ? value.trim().length !== 0 : stryMutAct_9fa48("615") ? false : (stryCov_9fa48("615", "616"), (stryMutAct_9fa48("617") ? value.length : (stryCov_9fa48("617"), value.trim().length)) === 0)))) {
        if (stryMutAct_9fa48("618")) {
          {}
        } else {
          stryCov_9fa48("618");
          throw new Error(stryMutAct_9fa48("619") ? "" : (stryCov_9fa48("619"), "Invalid TopicId: must be a non-empty string"));
        }
      }
      return value as TopicId;
    }
  },
  isTopicId(value: unknown): value is TopicId {
    if (stryMutAct_9fa48("620")) {
      {}
    } else {
      stryCov_9fa48("620");
      return stryMutAct_9fa48("623") ? typeof value === "string" || value.trim().length > 0 : stryMutAct_9fa48("622") ? false : stryMutAct_9fa48("621") ? true : (stryCov_9fa48("621", "622", "623"), (stryMutAct_9fa48("625") ? typeof value !== "string" : stryMutAct_9fa48("624") ? true : (stryCov_9fa48("624", "625"), typeof value === (stryMutAct_9fa48("626") ? "" : (stryCov_9fa48("626"), "string")))) && (stryMutAct_9fa48("629") ? value.trim().length <= 0 : stryMutAct_9fa48("628") ? value.trim().length >= 0 : stryMutAct_9fa48("627") ? true : (stryCov_9fa48("627", "628", "629"), (stryMutAct_9fa48("630") ? value.length : (stryCov_9fa48("630"), value.trim().length)) > 0)));
    }
  }
});
export type MunitionId = Brand<string, "MunitionId">;
export const MunitionId = stryMutAct_9fa48("631") ? {} : (stryCov_9fa48("631"), {
  create(value: string): MunitionId {
    if (stryMutAct_9fa48("632")) {
      {}
    } else {
      stryCov_9fa48("632");
      if (stryMutAct_9fa48("635") ? typeof value !== "string" && value.trim().length === 0 : stryMutAct_9fa48("634") ? false : stryMutAct_9fa48("633") ? true : (stryCov_9fa48("633", "634", "635"), (stryMutAct_9fa48("637") ? typeof value === "string" : stryMutAct_9fa48("636") ? false : (stryCov_9fa48("636", "637"), typeof value !== (stryMutAct_9fa48("638") ? "" : (stryCov_9fa48("638"), "string")))) || (stryMutAct_9fa48("640") ? value.trim().length !== 0 : stryMutAct_9fa48("639") ? false : (stryCov_9fa48("639", "640"), (stryMutAct_9fa48("641") ? value.length : (stryCov_9fa48("641"), value.trim().length)) === 0)))) {
        if (stryMutAct_9fa48("642")) {
          {}
        } else {
          stryCov_9fa48("642");
          throw new Error(stryMutAct_9fa48("643") ? "" : (stryCov_9fa48("643"), "Invalid MunitionId: must be a non-empty string"));
        }
      }
      return value as MunitionId;
    }
  },
  isMunitionId(value: unknown): value is MunitionId {
    if (stryMutAct_9fa48("644")) {
      {}
    } else {
      stryCov_9fa48("644");
      return stryMutAct_9fa48("647") ? typeof value === "string" || value.trim().length > 0 : stryMutAct_9fa48("646") ? false : stryMutAct_9fa48("645") ? true : (stryCov_9fa48("645", "646", "647"), (stryMutAct_9fa48("649") ? typeof value !== "string" : stryMutAct_9fa48("648") ? true : (stryCov_9fa48("648", "649"), typeof value === (stryMutAct_9fa48("650") ? "" : (stryCov_9fa48("650"), "string")))) && (stryMutAct_9fa48("653") ? value.trim().length <= 0 : stryMutAct_9fa48("652") ? value.trim().length >= 0 : stryMutAct_9fa48("651") ? true : (stryCov_9fa48("651", "652", "653"), (stryMutAct_9fa48("654") ? value.length : (stryCov_9fa48("654"), value.trim().length)) > 0)));
    }
  }
});

// --- Enums / Union Types ---

export type InterviewPhase = "opening" | "exploration" | "pressure" | "wrap-up";
export type SessionStatus = "not-started" | "in-progress" | "paused" | "completed" | "aborted";
export type FeedbackSignal = "probe" | "deepen" | "move-on" | "clarify";
export type StressLevel = "low" | "medium" | "high";

// --- Value Objects ---

export interface Transcript {
  readonly value: string;
}
export const Transcript = stryMutAct_9fa48("655") ? {} : (stryCov_9fa48("655"), {
  create(value: string): Transcript {
    if (stryMutAct_9fa48("656")) {
      {}
    } else {
      stryCov_9fa48("656");
      if (stryMutAct_9fa48("659") ? typeof value === "string" : stryMutAct_9fa48("658") ? false : stryMutAct_9fa48("657") ? true : (stryCov_9fa48("657", "658", "659"), typeof value !== (stryMutAct_9fa48("660") ? "" : (stryCov_9fa48("660"), "string")))) {
        if (stryMutAct_9fa48("661")) {
          {}
        } else {
          stryCov_9fa48("661");
          throw new Error(stryMutAct_9fa48("662") ? "" : (stryCov_9fa48("662"), "Invalid Transcript: must be a string"));
        }
      }
      return Object.freeze(stryMutAct_9fa48("663") ? {} : (stryCov_9fa48("663"), {
        value: stryMutAct_9fa48("664") ? value : (stryCov_9fa48("664"), value.trim())
      }));
    }
  }
});
export interface ScoreSignal {
  readonly value: number;
}
export const ScoreSignal = stryMutAct_9fa48("665") ? {} : (stryCov_9fa48("665"), {
  create(value: number): ScoreSignal {
    if (stryMutAct_9fa48("666")) {
      {}
    } else {
      stryCov_9fa48("666");
      if (stryMutAct_9fa48("669") ? (typeof value !== "number" || isNaN(value) || value < 0) && value > 100 : stryMutAct_9fa48("668") ? false : stryMutAct_9fa48("667") ? true : (stryCov_9fa48("667", "668", "669"), (stryMutAct_9fa48("671") ? (typeof value !== "number" || isNaN(value)) && value < 0 : stryMutAct_9fa48("670") ? false : (stryCov_9fa48("670", "671"), (stryMutAct_9fa48("673") ? typeof value !== "number" && isNaN(value) : stryMutAct_9fa48("672") ? false : (stryCov_9fa48("672", "673"), (stryMutAct_9fa48("675") ? typeof value === "number" : stryMutAct_9fa48("674") ? false : (stryCov_9fa48("674", "675"), typeof value !== (stryMutAct_9fa48("676") ? "" : (stryCov_9fa48("676"), "number")))) || isNaN(value))) || (stryMutAct_9fa48("679") ? value >= 0 : stryMutAct_9fa48("678") ? value <= 0 : stryMutAct_9fa48("677") ? false : (stryCov_9fa48("677", "678", "679"), value < 0)))) || (stryMutAct_9fa48("682") ? value <= 100 : stryMutAct_9fa48("681") ? value >= 100 : stryMutAct_9fa48("680") ? false : (stryCov_9fa48("680", "681", "682"), value > 100)))) {
        if (stryMutAct_9fa48("683")) {
          {}
        } else {
          stryCov_9fa48("683");
          throw new Error(stryMutAct_9fa48("684") ? "" : (stryCov_9fa48("684"), "Invalid ScoreSignal: must be a number between 0 and 100"));
        }
      }
      return Object.freeze(stryMutAct_9fa48("685") ? {} : (stryCov_9fa48("685"), {
        value
      }));
    }
  }
});
export interface TurnTiming {
  readonly latencyMs: number;
  readonly durationMs: number;
}
export const TurnTiming = stryMutAct_9fa48("686") ? {} : (stryCov_9fa48("686"), {
  create(latencyMs: number, durationMs: number): TurnTiming {
    if (stryMutAct_9fa48("687")) {
      {}
    } else {
      stryCov_9fa48("687");
      if (stryMutAct_9fa48("690") ? typeof latencyMs !== "number" && latencyMs < 0 : stryMutAct_9fa48("689") ? false : stryMutAct_9fa48("688") ? true : (stryCov_9fa48("688", "689", "690"), (stryMutAct_9fa48("692") ? typeof latencyMs === "number" : stryMutAct_9fa48("691") ? false : (stryCov_9fa48("691", "692"), typeof latencyMs !== (stryMutAct_9fa48("693") ? "" : (stryCov_9fa48("693"), "number")))) || (stryMutAct_9fa48("696") ? latencyMs >= 0 : stryMutAct_9fa48("695") ? latencyMs <= 0 : stryMutAct_9fa48("694") ? false : (stryCov_9fa48("694", "695", "696"), latencyMs < 0)))) {
        if (stryMutAct_9fa48("697")) {
          {}
        } else {
          stryCov_9fa48("697");
          throw new Error(stryMutAct_9fa48("698") ? "" : (stryCov_9fa48("698"), "Invalid TurnTiming: latencyMs must be positive"));
        }
      }
      if (stryMutAct_9fa48("701") ? typeof durationMs !== "number" && durationMs < 0 : stryMutAct_9fa48("700") ? false : stryMutAct_9fa48("699") ? true : (stryCov_9fa48("699", "700", "701"), (stryMutAct_9fa48("703") ? typeof durationMs === "number" : stryMutAct_9fa48("702") ? false : (stryCov_9fa48("702", "703"), typeof durationMs !== (stryMutAct_9fa48("704") ? "" : (stryCov_9fa48("704"), "number")))) || (stryMutAct_9fa48("707") ? durationMs >= 0 : stryMutAct_9fa48("706") ? durationMs <= 0 : stryMutAct_9fa48("705") ? false : (stryCov_9fa48("705", "706", "707"), durationMs < 0)))) {
        if (stryMutAct_9fa48("708")) {
          {}
        } else {
          stryCov_9fa48("708");
          throw new Error(stryMutAct_9fa48("709") ? "" : (stryCov_9fa48("709"), "Invalid TurnTiming: durationMs must be positive"));
        }
      }
      return Object.freeze(stryMutAct_9fa48("710") ? {} : (stryCov_9fa48("710"), {
        latencyMs,
        durationMs
      }));
    }
  }
});
export interface AnswerEvaluation {
  readonly score: ScoreSignal;
  readonly completeness: boolean;
  readonly analysis: string;
}
export const AnswerEvaluation = stryMutAct_9fa48("711") ? {} : (stryCov_9fa48("711"), {
  create(score: ScoreSignal, completeness: boolean, analysis: string): AnswerEvaluation {
    if (stryMutAct_9fa48("712")) {
      {}
    } else {
      stryCov_9fa48("712");
      if (stryMutAct_9fa48("715") ? (!score || typeof completeness !== "boolean") && typeof analysis !== "string" : stryMutAct_9fa48("714") ? false : stryMutAct_9fa48("713") ? true : (stryCov_9fa48("713", "714", "715"), (stryMutAct_9fa48("717") ? !score && typeof completeness !== "boolean" : stryMutAct_9fa48("716") ? false : (stryCov_9fa48("716", "717"), (stryMutAct_9fa48("718") ? score : (stryCov_9fa48("718"), !score)) || (stryMutAct_9fa48("720") ? typeof completeness === "boolean" : stryMutAct_9fa48("719") ? false : (stryCov_9fa48("719", "720"), typeof completeness !== (stryMutAct_9fa48("721") ? "" : (stryCov_9fa48("721"), "boolean")))))) || (stryMutAct_9fa48("723") ? typeof analysis === "string" : stryMutAct_9fa48("722") ? false : (stryCov_9fa48("722", "723"), typeof analysis !== (stryMutAct_9fa48("724") ? "" : (stryCov_9fa48("724"), "string")))))) {
        if (stryMutAct_9fa48("725")) {
          {}
        } else {
          stryCov_9fa48("725");
          throw new Error(stryMutAct_9fa48("726") ? "" : (stryCov_9fa48("726"), "Invalid AnswerEvaluation"));
        }
      }
      return Object.freeze(stryMutAct_9fa48("727") ? {} : (stryCov_9fa48("727"), {
        score,
        completeness,
        analysis: stryMutAct_9fa48("728") ? analysis : (stryCov_9fa48("728"), analysis.trim())
      }));
    }
  }
});
export interface AIResponse {
  readonly text: string;
}
export const AIResponse = stryMutAct_9fa48("729") ? {} : (stryCov_9fa48("729"), {
  create(text: string): AIResponse {
    if (stryMutAct_9fa48("730")) {
      {}
    } else {
      stryCov_9fa48("730");
      if (stryMutAct_9fa48("733") ? typeof text !== "string" && text.trim().length === 0 : stryMutAct_9fa48("732") ? false : stryMutAct_9fa48("731") ? true : (stryCov_9fa48("731", "732", "733"), (stryMutAct_9fa48("735") ? typeof text === "string" : stryMutAct_9fa48("734") ? false : (stryCov_9fa48("734", "735"), typeof text !== (stryMutAct_9fa48("736") ? "" : (stryCov_9fa48("736"), "string")))) || (stryMutAct_9fa48("738") ? text.trim().length !== 0 : stryMutAct_9fa48("737") ? false : (stryCov_9fa48("737", "738"), (stryMutAct_9fa48("739") ? text.length : (stryCov_9fa48("739"), text.trim().length)) === 0)))) {
        if (stryMutAct_9fa48("740")) {
          {}
        } else {
          stryCov_9fa48("740");
          throw new Error(stryMutAct_9fa48("741") ? "" : (stryCov_9fa48("741"), "Invalid AIResponse: must be a non-empty string"));
        }
      }
      return Object.freeze(stryMutAct_9fa48("742") ? {} : (stryCov_9fa48("742"), {
        text: stryMutAct_9fa48("743") ? text : (stryCov_9fa48("743"), text.trim())
      }));
    }
  }
});