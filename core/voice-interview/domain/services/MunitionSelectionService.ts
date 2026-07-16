import type { MunitionId, TopicId, StressLevel } from "../types.js";

export interface MunitionItem {
  readonly id: MunitionId;
  readonly topic: TopicId;
  readonly stressLevel: StressLevel;
}

export interface MunitionSelectionContext {
  readonly currentTopicId: TopicId | null;
  readonly usedMunitionIds: ReadonlySet<MunitionId>;
  readonly failedMunitionTopics: ReadonlySet<TopicId>;
}

export class MunitionSelectionService {
  public selectNextMunition(available: ReadonlyArray<MunitionItem>, context: MunitionSelectionContext): MunitionId | null {
    // Remove already used munitions
    let candidates = available.filter(m => !context.usedMunitionIds.has(m.id));

    // Do not use munitions on topics where the candidate previously failed a munition (Immunité au Stress)
    candidates = candidates.filter(m => !context.failedMunitionTopics.has(m.topic));

    if (candidates.length === 0) {
      return null;
    }

    // Target the current topic if possible
    if (context.currentTopicId) {
      const topicCandidates = candidates.filter(m => m.topic === context.currentTopicId);
      if (topicCandidates.length > 0) {
        // Escalate stress: start with low, then medium, then high
        return this.pickByLowestStress(topicCandidates);
      }
    }

    // Fallback to any available munition
    return this.pickByLowestStress(candidates);
  }

  private pickByLowestStress(candidates: MunitionItem[]): MunitionId {
    const low = candidates.find(m => m.stressLevel === "low");
    if (low) return low.id;
    
    const medium = candidates.find(m => m.stressLevel === "medium");
    if (medium) return medium.id;

    return candidates[0]!.id;
  }
}
