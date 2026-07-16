declare const brand: unique symbol;
export type Brand<T, TBrand extends string> = T & { readonly [brand]: TBrand };

// --- Branded Types ---

export type SessionId = Brand<string, "SessionId">;
export const SessionId = {
  create(value: string): SessionId {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Invalid SessionId: must be a non-empty string");
    }
    return value as SessionId;
  },
  isSessionId(value: unknown): value is SessionId {
    return typeof value === "string" && value.trim().length > 0;
  },
};

export type CandidateId = Brand<string, "CandidateId">;
export const CandidateId = {
  create(value: string): CandidateId {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Invalid CandidateId: must be a non-empty string");
    }
    return value as CandidateId;
  },
  isCandidateId(value: unknown): value is CandidateId {
    return typeof value === "string" && value.trim().length > 0;
  },
};

export type TurnId = Brand<string, "TurnId">;
export const TurnId = {
  create(value: string): TurnId {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Invalid TurnId: must be a non-empty string");
    }
    return value as TurnId;
  },
  isTurnId(value: unknown): value is TurnId {
    return typeof value === "string" && value.trim().length > 0;
  },
};

export type QuestionId = Brand<string, "QuestionId">;
export const QuestionId = {
  create(value: string): QuestionId {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Invalid QuestionId: must be a non-empty string");
    }
    return value as QuestionId;
  },
  isQuestionId(value: unknown): value is QuestionId {
    return typeof value === "string" && value.trim().length > 0;
  },
};

export type TopicId = Brand<string, "TopicId">;
export const TopicId = {
  create(value: string): TopicId {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Invalid TopicId: must be a non-empty string");
    }
    return value as TopicId;
  },
  isTopicId(value: unknown): value is TopicId {
    return typeof value === "string" && value.trim().length > 0;
  },
};

export type MunitionId = Brand<string, "MunitionId">;
export const MunitionId = {
  create(value: string): MunitionId {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Invalid MunitionId: must be a non-empty string");
    }
    return value as MunitionId;
  },
  isMunitionId(value: unknown): value is MunitionId {
    return typeof value === "string" && value.trim().length > 0;
  },
};

// --- Enums / Union Types ---

export type InterviewPhase = "opening" | "exploration" | "pressure" | "wrap-up";
export type SessionStatus = "not-started" | "in-progress" | "paused" | "completed" | "aborted";
export type FeedbackSignal = "probe" | "deepen" | "move-on" | "clarify";
export type StressLevel = "low" | "medium" | "high";

// --- Value Objects ---

export interface Transcript {
  readonly value: string;
}
export const Transcript = {
  create(value: string): Transcript {
    if (typeof value !== "string") {
      throw new Error("Invalid Transcript: must be a string");
    }
    return Object.freeze({ value: value.trim() });
  },
};

export interface ScoreSignal {
  readonly value: number;
}
export const ScoreSignal = {
  create(value: number): ScoreSignal {
    if (typeof value !== "number" || isNaN(value) || value < 0 || value > 100) {
      throw new Error("Invalid ScoreSignal: must be a number between 0 and 100");
    }
    return Object.freeze({ value });
  },
};

export interface TurnTiming {
  readonly latencyMs: number;
  readonly durationMs: number;
}
export const TurnTiming = {
  create(latencyMs: number, durationMs: number): TurnTiming {
    if (typeof latencyMs !== "number" || latencyMs < 0) {
      throw new Error("Invalid TurnTiming: latencyMs must be positive");
    }
    if (typeof durationMs !== "number" || durationMs < 0) {
      throw new Error("Invalid TurnTiming: durationMs must be positive");
    }
    return Object.freeze({ latencyMs, durationMs });
  },
};

export interface AnswerEvaluation {
  readonly score: ScoreSignal;
  readonly completeness: boolean;
  readonly analysis: string;
}
export const AnswerEvaluation = {
  create(score: ScoreSignal, completeness: boolean, analysis: string): AnswerEvaluation {
    if (!score || typeof completeness !== "boolean" || typeof analysis !== "string") {
      throw new Error("Invalid AnswerEvaluation");
    }
    return Object.freeze({ score, completeness, analysis: analysis.trim() });
  },
};

export interface AIResponse {
  readonly text: string;
}
export const AIResponse = {
  create(text: string): AIResponse {
    if (typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Invalid AIResponse: must be a non-empty string");
    }
    return Object.freeze({ text: text.trim() });
  },
};
