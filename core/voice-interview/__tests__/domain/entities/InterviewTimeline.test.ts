import { describe, it, expect } from 'vitest';
import { InterviewTimeline } from '../../../domain/entities/InterviewTimeline.js';
import { VoiceTurn } from '../../../domain/entities/VoiceTurn.js';
import { TurnId, Transcript, TurnTiming, AnswerEvaluation, ScoreSignal } from '../../../domain/types.js';
import { DuplicateTurnError } from '../../../domain/errors/DomainErrors.js';

describe('InterviewTimeline', () => {
  const createTurn = (idStr: string, scoreVal: number | null = null) => {
    let turn = VoiceTurn.create({
      id: TurnId.create(idStr),
      transcript: Transcript.create('Test'),
      intent: 'answer',
      evaluation: null,
      aiResponse: null,
      feedbackSignal: null,
      timing: TurnTiming.create(100, 1000)
    });

    if (scoreVal !== null) {
      turn = turn.withEvaluation(
        AnswerEvaluation.create(ScoreSignal.create(scoreVal), true, 'Analysis'),
        'move-on'
      );
    }
    return turn;
  };

  it('should start empty', () => {
    const timeline = InterviewTimeline.createEmpty();
    expect(timeline.count()).toBe(0);
    expect(timeline.lastTurn()).toBeNull();
    expect(timeline.averageScore()).toBe(0);
  });

  it('should append turns and update count/lastTurn', () => {
    const timeline = InterviewTimeline.createEmpty();
    const turn1 = createTurn('t1');
    const turn2 = createTurn('t2');

    timeline.appendTurn(turn1);
    expect(timeline.count()).toBe(1);
    expect(timeline.lastTurn()).toBe(turn1);

    timeline.appendTurn(turn2);
    expect(timeline.count()).toBe(2);
    expect(timeline.lastTurn()).toBe(turn2);
  });

  it('should throw DuplicateTurnError if appending existing turn id', () => {
    const timeline = InterviewTimeline.createEmpty();
    const turn1 = createTurn('t1');
    const turn2 = createTurn('t1'); // same ID

    timeline.appendTurn(turn1);
    expect(() => timeline.appendTurn(turn2)).toThrow(DuplicateTurnError);
  });

  it('should calculate average score correctly ignoring null evaluations', () => {
    const timeline = InterviewTimeline.createEmpty();
    
    timeline.appendTurn(createTurn('t1', 50));
    timeline.appendTurn(createTurn('t2', null)); // Ignored
    timeline.appendTurn(createTurn('t3', 100));

    // Average of 50 and 100 is 75
    expect(timeline.averageScore()).toBe(75);
  });

  it('should retrieve last N scores', () => {
    const timeline = InterviewTimeline.createEmpty();
    
    timeline.appendTurn(createTurn('t1', 10));
    timeline.appendTurn(createTurn('t2', 20));
    timeline.appendTurn(createTurn('t3', null));
    timeline.appendTurn(createTurn('t4', 30));

    const scores = timeline.lastScores(2);
    expect(scores.length).toBe(2);
    expect(scores[0].value).toBe(20); // Skips null, so we get 20 and 30
    expect(scores[1].value).toBe(30);
  });

  it('should reconstitute from existing array', () => {
    const turns = [createTurn('t1', 10), createTurn('t2', 20)];
    const timeline = InterviewTimeline.reconstitute(turns);
    expect(timeline.count()).toBe(2);
    expect(timeline.averageScore()).toBe(15);
  });

  it('should get turn by ID', () => {
    const timeline = InterviewTimeline.createEmpty();
    const turn = createTurn('t1');
    timeline.appendTurn(turn);

    expect(timeline.getTurn(TurnId.create('t1'))).toBe(turn);
    expect(timeline.getTurn(TurnId.create('t2'))).toBeNull();
  });
});
