// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StartInterviewUseCase } from '../../../application/use-cases/StartInterviewUseCase.js';
import type { InterviewSessionRepository, EventPublisherPort, QuestionGenerationPort, SpeechSynthesisPort, TransactionPort, LoggingPort, ClockPort, UUIDPort } from '../../../application/ports/index.js';
import type { InterviewSessionAggregate } from '../../../domain/aggregates/InterviewSessionAggregate.js';

describe('StartInterviewUseCase', () => {
  let useCase: StartInterviewUseCase;
  let repo: InterviewSessionRepository;
  let pub: EventPublisherPort;
  let questionPort: QuestionGenerationPort;
  let speechPort: SpeechSynthesisPort;

  beforeEach(() => {
    repo = {
      save: vi.fn(),
      findById: vi.fn(),
      findActiveByCandidate: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn()
    } as any;

    pub = { publish: vi.fn(), onPublish: vi.fn() } as any;
    questionPort = { generateNext: vi.fn().mockResolvedValue('Hello candidate') } as any;
    speechPort = { synthesize: vi.fn().mockResolvedValue('audio-bytes') } as any;

    const tx: TransactionPort = { run: (fn) => fn() };
    const logger: LoggingPort = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const clock: ClockPort = { now: () => new Date(), sleep: vi.fn() };
    const uuid: UUIDPort = { generate: () => 'uid-123' };

    useCase = new StartInterviewUseCase(repo, uuid, clock, pub, questionPort, speechPort, tx, logger);
  });

  it('should successfully start an interview and return initial text/audio', async () => {
    const request = { candidateId: 'c1', targetRole: 'Role' };
    const context = { correlationId: 'corr-1', timestamp: new Date() };

    const result = await useCase.execute(request, context);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.sessionId).toBe('uid-123');
      expect(result.value.initialQuestionText).toBe('Hello candidate');
      expect(result.value.initialAudioChunk).toBe('audio-bytes');
    }

    // Verify orchestration
    expect(questionPort.generateNext).toHaveBeenCalled();
    expect(speechPort.synthesize).toHaveBeenCalledWith('Hello candidate');
    expect(repo.save).toHaveBeenCalled();
    
    // Check if aggregate was passed to save
    const savedAgg = (repo.save as any).mock.calls[0][0] as InterviewSessionAggregate;
    expect(savedAgg.candidateId).toBe('c1');
    expect(savedAgg.phase).toBe('opening');

    expect(pub.publish).toHaveBeenCalled();
  });
});
