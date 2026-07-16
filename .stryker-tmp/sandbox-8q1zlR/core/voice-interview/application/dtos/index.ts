// @ts-nocheck
export interface StartInterviewRequest {
  readonly candidateId: string;
  readonly targetRole: string;
}

export interface StartInterviewResponse {
  readonly sessionId: string;
  readonly initialQuestionText: string;
  readonly initialAudioChunk: string; // Base64 encoded or URL
}

export interface ProcessTurnRequest {
  readonly sessionId: string;
  readonly turnId: string;
  readonly transcript: string;
  readonly intent: "answer" | "command" | "silence" | "interruption";
  readonly timingMs: number;
}

export interface ProcessTurnResponse {
  readonly audioChunk: string | null;
  readonly generatedText: string | null;
  readonly isFinished: boolean;
  readonly feedbackSignal: "probe" | "deepen" | "move-on" | "clarify" | null;
}

export interface PauseInterviewRequest { readonly sessionId: string; }
export interface ResumeInterviewRequest { readonly sessionId: string; }
export interface StopInterviewRequest { readonly sessionId: string; }

export interface VoiceTurnDTO {
  readonly id: string;
  readonly transcript: string | null;
  readonly intent: string;
}

export interface EvaluationDTO {
  readonly score: number;
  readonly completeness: boolean;
  readonly analysis: string;
}
