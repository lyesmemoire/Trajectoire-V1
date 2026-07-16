import type { 
  TurnId, 
  Transcript, 
  AnswerEvaluation, 
  FeedbackSignal, 
  TurnTiming,
  AIResponse
} from "../types.js";

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
    this._props = Object.freeze({ ...props });
  }

  public static create(props: VoiceTurnProps): VoiceTurn {
    // Invariants
    if (props.intent === "answer" && !props.transcript) {
      throw new Error("VoiceTurn with answer intent must have a transcript");
    }
    return new VoiceTurn(props);
  }

  public get id(): TurnId { return this._props.id; }
  public get transcript(): Transcript | null { return this._props.transcript; }
  public get intent(): UserIntent { return this._props.intent; }
  public get evaluation(): AnswerEvaluation | null { return this._props.evaluation; }
  public get aiResponse(): AIResponse | null { return this._props.aiResponse; }
  public get feedbackSignal(): FeedbackSignal | null { return this._props.feedbackSignal; }
  public get timing(): TurnTiming { return this._props.timing; }

  /**
   * Creates a mutated copy of this VoiceTurn (Value Object style mutation)
   */
  public withEvaluation(evaluation: AnswerEvaluation, signal: FeedbackSignal): VoiceTurn {
    return new VoiceTurn({
      ...this._props,
      evaluation,
      feedbackSignal: signal
    });
  }

  public withAIResponse(aiResponse: AIResponse): VoiceTurn {
    return new VoiceTurn({
      ...this._props,
      aiResponse
    });
  }
}
