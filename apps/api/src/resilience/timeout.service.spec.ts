import { Test, TestingModule } from '@nestjs/testing';
import { TimeoutService, TimeoutError } from './timeout.service';

describe('TimeoutService', () => {
  let service: TimeoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeoutService],
    }).compile();

    service = module.get<TimeoutService>(TimeoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should complete successfully within timeout', async () => {
    const result = await service.executeWithTimeout(
      () => Promise.resolve('success'),
      { timeout: 1000 },
    );
    expect(result).toBe('success');
  });

  it('should timeout when operation takes too long', async () => {
    await expect(
      service.executeWithTimeout(
        () => new Promise(resolve => setTimeout(resolve, 2000)),
        { timeout: 100 },
      ),
    ).rejects.toThrow(TimeoutError);
  });

  it('should call onTimeout callback when timeout occurs', async () => {
    let callbackCalled = false;
    await expect(
      service.executeWithTimeout(
        () => new Promise(resolve => setTimeout(resolve, 2000)),
        { timeout: 100, onTimeout: () => { callbackCalled = true; } },
      ),
    ).rejects.toThrow();
    
    expect(callbackCalled).toBe(true);
  });

  it('should create wrapped timeout function', async () => {
    const wrappedFn = service.withTimeout(
      () => Promise.resolve('success'),
      1000,
    );
    
    const result = await wrappedFn();
    expect(result).toBe('success');
  });
});
