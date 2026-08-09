import { Test, TestingModule } from '@nestjs/testing';
import { BulkheadService, BulkheadRejectedError } from './bulkhead.service';

describe('BulkheadService', () => {
  let service: BulkheadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulkheadService],
    }).compile();

    service = module.get<BulkheadService>(BulkheadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute within concurrency limit', async () => {
    const result = await service.execute('test-bulkhead', () => Promise.resolve('success'), {
      maxConcurrent: 5,
    });
    expect(result).toBe('success');
  });

  it('should queue requests when at concurrency limit', async () => {
    let running = 0;
    const results: string[] = [];
    
    const operation = () => {
      running++;
      return new Promise(resolve => {
        setTimeout(() => {
          running--;
          results.push('done');
          resolve('success');
        }, 50);
      });
    };

    const promises = Array.from({ length: 10 }, () =>
      service.execute('test-bulkhead', operation, { maxConcurrent: 5, maxQueueSize: 10 }),
    );

    await Promise.all(promises);
    expect(results.length).toBe(10);
  });

  it('should reject when queue is full', async () => {
    const slowOperation = () => new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fill up the bulkhead
    const promises = Array.from({ length: 5 }, () =>
      service.execute('test-bulkhead', slowOperation, { maxConcurrent: 5, maxQueueSize: 0 }),
    );

    await expect(
      service.execute('test-bulkhead', () => Promise.resolve('success'), {
        maxConcurrent: 5,
        maxQueueSize: 0,
      }),
    ).rejects.toThrow(BulkheadRejectedError);

    await Promise.all(promises);
  });

  it('should return bulkhead stats', async () => {
    // First execute to create the bulkhead
    await service.execute('test-bulkhead', () => Promise.resolve('success'), {
      maxConcurrent: 5,
    });
    
    const stats = service.getBulkheadStats('test-bulkhead');
    expect(stats).toBeDefined();
    expect(stats?.running).toBe(0);
    expect(stats?.queued).toBe(0);
  });
});
