import type {
  InterviewAction,
  InterviewOutput,
} from "./interview.dto";
import type { DomainError } from "./interview.errors";

export interface InterviewScore {
  readonly overall: number;
  readonly clarity: number;
  readonly relevance: number;
  readonly confidence: number;
}

export interface InterviewQuestion {
  readonly id: string;
  readonly content: string;
  readonly competency: string;
  readonly difficulty: "easy" | "medium" | "hard";
}

export type InterviewDomainEvent =
  | { readonly type: "TextDelta"; readonly text: string }
  | { readonly type: "Suggestion"; readonly action: InterviewAction }
  | { readonly type: "InterviewScoreUpdated"; readonly score: InterviewScore }
  | { readonly type: "QuestionGenerated"; readonly question: InterviewQuestion }
  | { readonly type: "Completed"; readonly output: InterviewOutput }
  | { readonly type: "Error"; readonly error: DomainError };

