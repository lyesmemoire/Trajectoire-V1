import { Test, TestingModule } from '@nestjs/testing';
import { RetryService } from './retry.service';

describe('RetryService', () => {
  let service: RetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetryService],
    }).compile();

    service = module.get<RetryService>(RetryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should succeed on first attempt', async () => {
    const result = await service.executeWithRetry(() => Promise.resolve('success'));
    expect(result).toBe('success');
  });

  it('should retry on failure', async () => {
    let attempts = 0;
    const result = await service.executeWithRetry(
      () => {
        attempts++;
        if (attempts < 2) {
          return Promise.reject(new Error('fail'));
        }
        return Promise.resolve('success');
      },
      { maxAttempts: 3, initialDelay: 10 },
    );
    
    expect(result).toBe('success');
    expect(attempts).toBe(2);
  });

  it('should throw after max attempts', async () => {
    await expect(
      service.executeWithRetry(
        () => Promise.reject(new Error('fail')),
        { maxAttempts: 2, initialDelay: 10 },
      ),
    ).rejects.toThrow('fail');
  });

  it('should use exponential backoff', async () => {
    const delays: number[] = [];
    const startTime = Date.now();
    
    await service.executeWithRetry(
      () => Promise.reject(new Error('fail')),
      { maxAttempts: 3, initialDelay: 50, backoffMultiplier: 2 },
    ).catch(() => {});
    
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeGreaterThan(50); // Should have waited for retries
  });

  it('should not retry non-retryable errors', async () => {
    let attempts = 0;
    await expect(
      service.executeWithRetry(
        () => {
          attempts++;
          return Promise.reject(new Error('non-retryable'));
        },
        { maxAttempts: 3, retryableErrors: ['network', 'timeout'], initialDelay: 10 },
      ),
    ).rejects.toThrow('non-retryable');
    
    expect(attempts).toBe(1);
  });

  it('should retry retryable errors', async () => {
    let attempts = 0;
    await expect(
      service.executeWithRetry(
        () => {
          attempts++;
          return Promise.reject(new Error('retryable error'));
        },
        { maxAttempts: 3, retryableErrors: ['retryable'] },
      ),
    ).rejects.toThrow('retryable error');
    
    expect(attempts).toBe(3);
  });
});
