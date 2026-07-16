import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessVoiceTurnUseCase } from '../../../application/use-cases/ProcessVoiceTurnUseCase.js';
import type { InterviewSessionRepository, EventPublisherPort, TextEvaluationPort, QuestionGenerationPort, SpeechSynthesisPort, TransactionPort, LoggingPort, ClockPort, UUIDPort } from '../../../application/ports/index.js';
import { InterviewSessionAggregate } from '../../../domain/aggregates/InterviewSessionAggregate.js';
import { SessionId, CandidateId, AnswerEvaluation, ScoreSignal } from '../../../domain/types.js';

describe('ProcessVoiceTurnUseCase', () => {
  let useCase: ProcessVoiceTurnUseCase;
  let repo: InterviewSessionRepository;
  let evalPort: TextEvaluationPort;
  let questionPort: QuestionGenerationPort;
  let speechPort: SpeechSynthesisPort;
  let session: InterviewSessionAggregate;

  beforeEach(() => {
    const clock: ClockPort = { now: () => new Date(), sleep: vi.fn() };
    const uuid: UUIDPort = { generate: () => 'uid-123' };

    session = InterviewSessionAggregate.createNew(SessionId.create('s1'), CandidateId.create('c1'));
    session.start('Role', { clock, idGenerator: uuid });

    repo = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(session),
      findActiveByCandidate: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn()
    } as any;

    evalPort = {
      evaluateAnswer: vi.fn().mockResolvedValue(AnswerEvaluation.create(ScoreSignal.create(80), true, 'Good'))
    } as any;

    questionPort = { generateNext: vi.fn().mockResolvedValue('Next question') } as any;
    speechPort = { synthesize: vi.fn().mockResolvedValue('next-audio') } as any;
    const pub: EventPublisherPort = { publish: vi.fn(), onPublish: vi.fn() };
    const tx: TransactionPort = { run: (fn) => fn() };
    const logger: LoggingPort = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

    useCase = new ProcessVoiceTurnUseCase(repo, evalPort, questionPort, speechPort, pub, tx, logger, clock, uuid);
  });

  it('should process a voice turn, evaluate it, and generate the next response', async () => {
    const request = {
      sessionId: 's1',
      turnId: 't1',
      transcript: 'My answer',
      intent: 'answer' as const,
      timingMs: 500
    };
    const context = { correlationId: 'corr-1', timestamp: new Date() };

    const result = await useCase.execute(request, context);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.generatedText).toBe('Next question');
      expect(result.value.audioChunk).toBe('next-audio');
    }

    expect(repo.findById).toHaveBeenCalledWith('s1');
    expect(evalPort.evaluateAnswer).toHaveBeenCalled();
    expect(questionPort.generateNext).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    
    // Timeline should have the turn
    expect(session.timeline.count()).toBe(1);
  });

  it('should return SESSION_NOT_FOUND if session does not exist', async () => {
    repo.findById = vi.fn().mockResolvedValue(null);
    
    const request = { sessionId: 'unknown', turnId: 't1', transcript: 'ans', intent: 'answer' as const, timingMs: 500 };
    const result = await useCase.execute(request, { correlationId: 'c1', timestamp: new Date() });

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.code).toBe('SESSION_NOT_FOUND');
    }
  });
});
