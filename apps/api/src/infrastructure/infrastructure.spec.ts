import { Test, TestingModule } from '@nestjs/testing';
import { CircuitBreakerService } from './circuit-breaker/circuit-breaker.service';
import { GracefulShutdownService } from './graceful-shutdown/graceful-shutdown.service';

describe('Production Infrastructure', () => {
  let circuitBreakerService: CircuitBreakerService;
  let gracefulShutdownService: GracefulShutdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CircuitBreakerService,
        GracefulShutdownService,
      ],
    }).compile();

    circuitBreakerService = module.get<CircuitBreakerService>(
      CircuitBreakerService,
    );
    gracefulShutdownService = module.get<GracefulShutdownService>(
      GracefulShutdownService,
    );
  });

  it('should create circuit breaker service', () => {
    expect(circuitBreakerService).toBeDefined();
  });

  it('should create circuit breaker with options', () => {
    const breaker = circuitBreakerService.create(
      'test-breaker',
      async () => {
        return 'success';
      },
      { timeout: 5000, errorThresholdPercentage: 50 },
    );

    expect(breaker).toBeDefined();
    expect(circuitBreakerService.getStatus('test-breaker')).toBeDefined();
  });

  it('should get all circuit breaker statuses', () => {
    circuitBreakerService.create('test-breaker-1', async () => 'success');
    circuitBreakerService.create('test-breaker-2', async () => 'success');

    const statuses = circuitBreakerService.getAllStatuses();
    expect(statuses).toBeDefined();
    expect(Object.keys(statuses).length).toBeGreaterThanOrEqual(2);
  });

  it('should create graceful shutdown service', () => {
    expect(gracefulShutdownService).toBeDefined();
  });

  it('should register shutdown handlers', () => {
    let handlerCalled = false;
    gracefulShutdownService.registerShutdownHandler(async () => {
      handlerCalled = true;
    });

    expect(handlerCalled).toBe(false);
  });

  it('should create graceful shutdown service', () => {
    expect(gracefulShutdownService).toBeDefined();
  });
});
