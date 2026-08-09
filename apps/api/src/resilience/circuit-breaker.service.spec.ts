import { Test, TestingModule } from '@nestjs/testing';
import { CircuitBreakerService, CircuitState, CircuitBreakerOpenError } from './circuit-breaker.service';

describe('CircuitBreakerService', () => {
  let service: CircuitBreakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CircuitBreakerService],
    }).compile();

    service = module.get<CircuitBreakerService>(CircuitBreakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute successfully when circuit is closed', async () => {
    const result = await service.execute('test-circuit', () => Promise.resolve('success'));
    expect(result).toBe('success');
    expect(service.getCircuitState('test-circuit')).toBe(CircuitState.CLOSED);
  });

  it('should open circuit after failure threshold', async () => {
    const options = { failureThreshold: 2 };
    
    await expect(
      service.execute('test-circuit', () => Promise.reject(new Error('fail')), options),
    ).rejects.toThrow();
    
    await expect(
      service.execute('test-circuit', () => Promise.reject(new Error('fail')), options),
    ).rejects.toThrow();
    
    expect(service.getCircuitState('test-circuit')).toBe(CircuitState.OPEN);
  });

  it('should reject requests when circuit is open', async () => {
    const options = { failureThreshold: 1 };
    
    await expect(
      service.execute('test-circuit', () => Promise.reject(new Error('fail')), options),
    ).rejects.toThrow();
    
    await expect(
      service.execute('test-circuit', () => Promise.resolve('success'), options),
    ).rejects.toThrow(CircuitBreakerOpenError);
  });

  it('should transition to half-open after reset timeout', async () => {
    const options = { failureThreshold: 1, resetTimeout: 100 };
    
    await expect(
      service.execute('test-circuit', () => Promise.reject(new Error('fail')), options),
    ).rejects.toThrow();
    
    expect(service.getCircuitState('test-circuit')).toBe(CircuitState.OPEN);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    await service.execute('test-circuit', () => Promise.resolve('success'), options);
    expect(service.getCircuitState('test-circuit')).toBe(CircuitState.HALF_OPEN);
  });

  it('should close circuit after success threshold in half-open', async () => {
    const options = { failureThreshold: 1, successThreshold: 1, resetTimeout: 50 };
    
    await expect(
      service.execute('test-circuit', () => Promise.reject(new Error('fail')), options),
    ).rejects.toThrow();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await service.execute('test-circuit', () => Promise.resolve('success'), options);
    expect(service.getCircuitState('test-circuit')).toBe(CircuitState.CLOSED);
  });

  it('should reset circuit manually', async () => {
    const options = { failureThreshold: 1 };
    
    await service.execute('test-circuit', () => Promise.reject(new Error('fail')), options).catch(() => {});
    
    expect(service.getCircuitState('test-circuit')).toBe(CircuitState.OPEN);
    
    service.resetCircuit('test-circuit');
    expect(service.getCircuitState('test-circuit')).toBe(CircuitState.CLOSED);
  });
});
