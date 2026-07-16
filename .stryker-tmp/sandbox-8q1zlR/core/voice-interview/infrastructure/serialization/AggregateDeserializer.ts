// @ts-nocheck
import { InterviewSessionAggregate } from "../../domain/aggregates/InterviewSessionAggregate.js";
import { InterviewTimeline } from "../../domain/entities/InterviewTimeline.js";
import { VoiceTurn, type UserIntent } from "../../domain/entities/VoiceTurn.js";
import { SessionId, CandidateId, TurnId, Transcript, AnswerEvaluation, AIResponse, TurnTiming, ScoreSignal } from "../../domain/types.js";
import type { FeedbackSignal, InterviewPhase, SessionStatus } from "../../domain/types.js";
import type { SerializedAggregate, SerializedTurn } from "./AggregateSerializer.js";

const VALID_INTENTS: readonly string[] = ["answer", "command", "silence", "interruption"];
const VALID_FEEDBACK: readonly string[] = ["probe", "deepen", "move-on", "clarify"];

function asUserIntent(value: string): UserIntent {
  if (!VALID_INTENTS.includes(value)) {
    throw new Error(`Invalid UserIntent: ${value}`);
  }
  return value as UserIntent;
}

function asFeedbackSignal(value: string | null): FeedbackSignal | null {
  if (value === null) return null;
  if (!VALID_FEEDBACK.includes(value)) {
    throw new Error(`Invalid FeedbackSignal: ${value}`);
  }
  return value as FeedbackSignal;
}

export class AggregateDeserializer {
  static deserialize(data: SerializedAggregate): InterviewSessionAggregate {
    const turns = data.timeline.map(t => this.deserializeTurn(t));
    const timeline = InterviewTimeline.reconstitute(turns);

    return InterviewSessionAggregate.reconstitute(
      SessionId.create(data.id),
      CandidateId.create(data.candidateId),
      {
        phase: data.phase as InterviewPhase,
        status: data.status as SessionStatus,
        currentTopicId: null
      },
      timeline,
      data.version
    );
  }

  private static deserializeTurn(data: SerializedTurn): VoiceTurn {
    return VoiceTurn.create({
      id: TurnId.create(data.id),
      transcript: data.transcript ? Transcript.create(data.transcript) : null,
      intent: asUserIntent(data.intent),
      evaluation: data.evaluation ? AnswerEvaluation.create(
        ScoreSignal.create(data.evaluation.score),
        data.evaluation.completeness,
        data.evaluation.analysis
      ) : null,
      aiResponse: data.aiResponse ? AIResponse.create(data.aiResponse) : null,
      feedbackSignal: asFeedbackSignal(data.feedbackSignal),
      timing: TurnTiming.create(data.timing.latencyMs, data.timing.durationMs)
    });
  }
}
