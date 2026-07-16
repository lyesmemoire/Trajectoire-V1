import type { InterviewSessionAggregate } from "../../domain/aggregates/InterviewSessionAggregate.js";

export interface SerializedAggregate {
  id: string;
  candidateId: string;
  phase: string;
  status: string;
  timeline: SerializedTurn[];
  version: number;
}

export interface SerializedTurn {
  id: string;
  transcript: string | null;
  intent: string;
  evaluation: { score: number; completeness: boolean; analysis: string } | null;
  aiResponse: string | null;
  feedbackSignal: string | null;
  timing: { latencyMs: number; durationMs: number };
}

export class AggregateSerializer {
  static serialize(aggregate: InterviewSessionAggregate, version: number): SerializedAggregate {
    const turns = aggregate.timeline.toArray().map(turn => ({
      id: turn.id as string,
      transcript: turn.transcript ? turn.transcript.value : null,
      intent: turn.intent,
      evaluation: turn.evaluation ? {
        score: turn.evaluation.score.value,
        completeness: turn.evaluation.completeness,
        analysis: turn.evaluation.analysis
      } : null,
      aiResponse: turn.aiResponse ? turn.aiResponse.text : null,
      feedbackSignal: turn.feedbackSignal,
      timing: {
        latencyMs: turn.timing.latencyMs,
        durationMs: turn.timing.durationMs
      }
    }));

    return {
      id: aggregate.id as string,
      candidateId: aggregate.candidateId as string,
      phase: aggregate.phase,
      status: aggregate.status,
      timeline: turns,
      version
    };
  }
}
