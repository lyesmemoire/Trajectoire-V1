import type { QuestionId, TopicId, InterviewPhase } from "../types.js";

export interface QuestionBankItem {
  readonly id: QuestionId;
  readonly topic: TopicId;
  readonly phase: InterviewPhase;
}

export interface SelectionContext {
  readonly currentPhase: InterviewPhase;
  readonly askedQuestionIds: ReadonlySet<QuestionId>;
  readonly exhaustedTopicIds: ReadonlySet<TopicId>;
  readonly currentTopicId: TopicId | null;
  readonly forceNewTopic: boolean;
}

export class QuestionSelectionService {
  public selectNextQuestion(bank: ReadonlyArray<QuestionBankItem>, context: SelectionContext): QuestionId | null {
    // Filter questions by phase
    let candidates = bank.filter(q => q.phase === context.currentPhase);

    // Remove already asked questions
    candidates = candidates.filter(q => !context.askedQuestionIds.has(q.id));

    // Remove exhausted topics unless we are continuing the current one explicitly and it's not exhausted
    candidates = candidates.filter(q => {
      if (context.exhaustedTopicIds.has(q.topic)) return false;
      return true;
    });

    if (candidates.length === 0) {
      return null; // No questions left for this phase/constraints
    }

    // Try to stay on the same topic if requested
    if (!context.forceNewTopic && context.currentTopicId) {
      const sameTopicCandidates = candidates.filter(q => q.topic === context.currentTopicId);
      if (sameTopicCandidates.length > 0) {
        return sameTopicCandidates[0]!.id;
      }
    }

    // Otherwise, pick a question from a new topic (not exhausted)
    const newTopicCandidates = candidates.filter(q => q.topic !== context.currentTopicId);
    if (newTopicCandidates.length > 0) {
      return newTopicCandidates[0]!.id;
    }

    // Fallback to any remaining candidate
    return candidates[0]!.id;
  }
}
