import { PolicyResult } from "./PhaseTransitionPolicy.js";

export interface BargeInContext {
  readonly isAiSpeaking: boolean;
  readonly userAudioDurationMs: number;
}

export class BargeInPolicy {
  private static readonly MIN_BARGE_IN_DURATION_MS = 500;

  public evaluate(context: BargeInContext): PolicyResult {
    if (!context.isAiSpeaking) {
      return PolicyResult.deny("AI is not speaking, no barge-in possible");
    }

    if (context.userAudioDurationMs < BargeInPolicy.MIN_BARGE_IN_DURATION_MS) {
      return PolicyResult.deny(`Audio duration (${context.userAudioDurationMs}ms) is below barge-in threshold (${BargeInPolicy.MIN_BARGE_IN_DURATION_MS}ms)`);
    }

    return PolicyResult.allow();
  }
}
