import type { VoiceTurn } from "./VoiceTurn.js";
import { DuplicateTurnError } from "../errors/DomainErrors.js";
import type { TurnId, ScoreSignal } from "../types.js";

export class InterviewTimeline {
  private readonly _turns: VoiceTurn[];

  private constructor(turns: VoiceTurn[]) {
    this._turns = [...turns];
  }

  public static createEmpty(): InterviewTimeline {
    return new InterviewTimeline([]);
  }

  public static reconstitute(turns: VoiceTurn[]): InterviewTimeline {
    return new InterviewTimeline(turns);
  }

  public appendTurn(turn: VoiceTurn): void {
    if (this._turns.some(t => t.id === turn.id)) {
      throw new DuplicateTurnError(turn.id);
    }
    this._turns.push(turn);
  }

  public lastTurn(): VoiceTurn | null {
    return this._turns.length > 0 ? this._turns[this._turns.length - 1] : null;
  }

  public getTurn(id: TurnId): VoiceTurn | null {
    return this._turns.find(t => t.id === id) || null;
  }

  public count(): number {
    return this._turns.length;
  }

  public averageScore(): number {
    const scoredTurns = this._turns.filter(t => t.evaluation !== null);
    if (scoredTurns.length === 0) return 0;
    
    const total = scoredTurns.reduce((sum, t) => sum + t.evaluation!.score.value, 0);
    return Math.round(total / scoredTurns.length);
  }

  public lastScores(count: number): ScoreSignal[] {
    const scoredTurns = this._turns.filter(t => t.evaluation !== null);
    const recent = scoredTurns.slice(-count);
    return recent.map(t => t.evaluation!.score);
  }

  public toArray(): ReadonlyArray<VoiceTurn> {
    return Object.freeze([...this._turns]);
  }
}
