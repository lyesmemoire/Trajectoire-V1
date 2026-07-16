// @ts-nocheck
import type { InterviewPhase, TopicId } from "../../domain/types.js";
import type { AnswerEvaluation } from "../../domain/types.js";

export interface SpeechRecognitionPort {
  transcribe(audioStream: unknown): Promise<string>;
}

export interface SpeechSynthesisPort {
  synthesize(text: string): Promise<string>; // Returns audio representation
}

export interface EvaluationContextDTO {
  readonly targetRole: string;
  readonly currentPhase: InterviewPhase;
}

export interface TextEvaluationPort {
  evaluateAnswer(transcript: string, context: EvaluationContextDTO): Promise<AnswerEvaluation>;
}

export interface QuestionGenerationPort {
  generateNext(phase: InterviewPhase, topic: TopicId | null, history: readonly string[]): Promise<string>;
}
