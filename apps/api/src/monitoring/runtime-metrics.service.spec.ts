import { Test, TestingModule } from '@nestjs/testing';
import { RuntimeMetricsService } from './runtime-metrics.service';
import { MetricsService } from '../observability/metrics.service';

describe('RuntimeMetricsService', () => {
  let service: RuntimeMetricsService;
  let metricsService: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RuntimeMetricsService,
        {
          provide: MetricsService,
          useValue: {
            incrementCounter: jest.fn(),
            recordHistogram: jest.fn(),
            trackHttpRequest: jest.fn(),
            trackHttpRequestDuration: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RuntimeMetricsService>(RuntimeMetricsService);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCPUMetrics', () => {
    it('should return CPU metrics', () => {
      const metrics = service.getCPUMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.usage).toBeGreaterThanOrEqual(0);
      expect(metrics.usage).toBeLessThanOrEqual(1);
      expect(Array.isArray(metrics.loadAverage)).toBe(true);
      expect(metrics.loadAverage).toHaveLength(3);
    });

    it('should return load average array with numbers', () => {
      const metrics = service.getCPUMetrics();

      metrics.loadAverage.forEach((load) => {
        expect(typeof load).toBe('number');
      });
    });
  });

  describe('getMemoryMetrics', () => {
    it('should return memory metrics', () => {
      const metrics = service.getMemoryMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.total).toBeGreaterThan(0);
      expect(metrics.used).toBeGreaterThan(0);
      expect(metrics.free).toBeGreaterThanOrEqual(0);
      expect(metrics.usage).toBeGreaterThanOrEqual(0);
      expect(metrics.usage).toBeLessThanOrEqual(1);
    });

    it('should satisfy total = used + free', () => {
      const metrics = service.getMemoryMetrics();

      expect(metrics.total).toBe(metrics.used + metrics.free);
    });
  });

  describe('getUptime', () => {
    it('should return uptime in milliseconds', () => {
      const uptime = service.getUptime();

      expect(uptime).toBeGreaterThanOrEqual(0);
      expect(typeof uptime).toBe('number');
    });

    it('should increase over time', async () => {
      const uptime1 = service.getUptime();
      await new Promise((resolve) => setTimeout(resolve, 10));
      const uptime2 = service.getUptime();

      expect(uptime2).toBeGreaterThan(uptime1);
    });
  });

  describe('recordOperationTime', () => {
    it('should record operation time', () => {
      service.recordOperationTime('matching', 100);

      const metrics = service.getOperationMetrics('matching');
      expect(metrics.time).toBe(100);
    });

    it('should keep only last 1000 measurements', () => {
      for (let i = 0; i < 1005; i++) {
        service.recordOperationTime('matching', i);
        service.incrementOperationCount('matching');
      }

      const metrics = service.getOperationMetrics('matching');
      // The count should be 1005
      expect(metrics.count).toBe(1005);
      expect(metrics.time).toBeGreaterThan(0);
    });

    it('should handle multiple operations', () => {
      service.recordOperationTime('matching', 100);
      service.recordOperationTime('matching', 200);
      service.recordOperationTime('matching', 150);

      const metrics = service.getOperationMetrics('matching');
      expect(metrics.time).toBe(150); // average
    });

    it('should handle unknown operation', () => {
      service.recordOperationTime('unknown', 100);

      const metrics = service.getOperationMetrics('unknown');
      expect(metrics.time).toBe(100);
    });
  });

  describe('incrementOperationCount', () => {
    it('should increment operation count', () => {
      service.incrementOperationCount('matching');
      service.incrementOperationCount('matching');

      const metrics = service.getOperationMetrics('matching');
      expect(metrics.count).toBe(2);
    });

    it('should start from 0', () => {
      const metrics = service.getOperationMetrics('matching');
      expect(metrics.count).toBe(0);
    });

    it('should handle unknown operation', () => {
      service.incrementOperationCount('unknown');

      const metrics = service.getOperationMetrics('unknown');
      expect(metrics.count).toBe(1);
    });
  });

  describe('incrementOperationError', () => {
    it('should increment operation error count', () => {
      service.incrementOperationError('matching');
      service.incrementOperationError('matching');

      const metrics = service.getOperationMetrics('matching');
      expect(metrics.errors).toBe(2);
    });

    it('should start from 0', () => {
      const metrics = service.getOperationMetrics('matching');
      expect(metrics.errors).toBe(0);
    });

    it('should handle unknown operation', () => {
      service.incrementOperationError('unknown');

      const metrics = service.getOperationMetrics('unknown');
      expect(metrics.errors).toBe(1);
    });
  });

  describe('recordError', () => {
    it('should record error', () => {
      service.recordError('ValidationError');

      const runtimeMetrics = service.getRuntimeMetrics();
      expect(runtimeMetrics.errors.total).toBe(1);
      expect(runtimeMetrics.errors.byType.ValidationError).toBe(1);
    });

    it('should record multiple errors', () => {
      service.recordError('ValidationError');
      service.recordError('ValidationError');
      service.recordError('NotFoundError');

      const runtimeMetrics = service.getRuntimeMetrics();
      expect(runtimeMetrics.errors.total).toBe(3);
      expect(runtimeMetrics.errors.byType.ValidationError).toBe(2);
      expect(runtimeMetrics.errors.byType.NotFoundError).toBe(1);
    });
  });

  describe('getLatencyMetrics', () => {
    it('should return latency metrics for operation', () => {
      service.recordOperationTime('matching', 100);
      service.recordOperationTime('matching', 200);
      service.recordOperationTime('matching', 150);

      const latency = service.getLatencyMetrics('matching');

      expect(latency).toBeDefined();
      expect(latency.p50).toBeGreaterThanOrEqual(0);
      expect(latency.p95).toBeGreaterThanOrEqual(0);
      expect(latency.p99).toBeGreaterThanOrEqual(0);
      expect(latency.avg).toBe(150);
    });

    it('should return zeros for operation with no data', () => {
      const latency = service.getLatencyMetrics('unknown');

      expect(latency.p50).toBe(0);
      expect(latency.p95).toBe(0);
      expect(latency.p99).toBe(0);
      expect(latency.avg).toBe(0);
    });

    it('should calculate percentiles correctly', () => {
      const times = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      times.forEach((t) => service.recordOperationTime('matching', t));

      const latency = service.getLatencyMetrics('matching');

      expect(latency.p50).toBe(50);
      expect(latency.p95).toBe(100);
      expect(latency.p99).toBe(100);
      expect(latency.avg).toBe(55);
    });
  });

  describe('getOperationMetrics', () => {
    it('should return operation metrics', () => {
      service.recordOperationTime('matching', 100);
      service.incrementOperationCount('matching');
      service.incrementOperationError('matching');

      const metrics = service.getOperationMetrics('matching');

      expect(metrics.time).toBe(100);
      expect(metrics.count).toBe(1);
      expect(metrics.errors).toBe(1);
    });

    it('should return zeros for new operation', () => {
      const metrics = service.getOperationMetrics('new-operation');

      expect(metrics.time).toBe(0);
      expect(metrics.count).toBe(0);
      expect(metrics.errors).toBe(0);
    });
  });

  describe('getRuntimeMetrics', () => {
    it('should return all runtime metrics', () => {
      const metrics = service.getRuntimeMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.cpu).toBeDefined();
      expect(metrics.memory).toBeDefined();
      expect(metrics.uptime).toBeGreaterThanOrEqual(0);
      expect(metrics.errors).toBeDefined();
      expect(metrics.latency).toBeDefined();
    });

    it('should include CPU metrics', () => {
      const metrics = service.getRuntimeMetrics();

      expect(metrics.cpu.usage).toBeGreaterThanOrEqual(0);
      expect(metrics.cpu.loadAverage).toHaveLength(3);
    });

    it('should include memory metrics', () => {
      const metrics = service.getRuntimeMetrics();

      expect(metrics.memory.total).toBeGreaterThan(0);
      expect(metrics.memory.used).toBeGreaterThan(0);
      expect(metrics.memory.free).toBeGreaterThanOrEqual(0);
      expect(metrics.memory.usage).toBeGreaterThanOrEqual(0);
    });

    it('should include error metrics', () => {
      service.recordError('ValidationError');

      const metrics = service.getRuntimeMetrics();

      expect(metrics.errors.total).toBe(1);
      expect(metrics.errors.byType.ValidationError).toBe(1);
    });

    it('should include latency metrics', () => {
      service.recordOperationTime('matching', 100);
      service.recordOperationTime('search', 200);

      const metrics = service.getRuntimeMetrics();

      expect(metrics.latency.p50).toBeGreaterThanOrEqual(0);
      expect(metrics.latency.avg).toBe(150);
    });
  });

  describe('getAllOperationMetrics', () => {
    it('should return metrics for all operations', () => {
      service.recordOperationTime('matching', 100);
      service.incrementOperationCount('matching');
      service.recordOperationTime('search', 200);
      service.incrementOperationCount('search');
      service.recordOperationTime('graph', 150);
      service.incrementOperationCount('graph');
      service.recordOperationTime('reasoning', 180);
      service.incrementOperationCount('reasoning');

      const metrics = service.getAllOperationMetrics();

      expect(metrics.matching).toBeDefined();
      expect(metrics.search).toBeDefined();
      expect(metrics.graph).toBeDefined();
      expect(metrics.reasoning).toBeDefined();
    });

    it('should return zero metrics for uninitialized operations', () => {
      const metrics = service.getAllOperationMetrics();

      expect(metrics.matching.time).toBe(0);
      expect(metrics.matching.count).toBe(0);
      expect(metrics.matching.errors).toBe(0);
    });
  });

  describe('resetMetrics', () => {
    it('should reset all metrics', () => {
      service.recordOperationTime('matching', 100);
      service.incrementOperationCount('matching');
      service.recordError('ValidationError');

      service.resetMetrics();

      const metrics = service.getRuntimeMetrics();
      expect(metrics.errors.total).toBe(0);
      expect(metrics.errors.byType).toEqual({});

      const operationMetrics = service.getOperationMetrics('matching');
      expect(operationMetrics.count).toBe(0);
      expect(operationMetrics.errors).toBe(0);
    });

    it('should reset uptime', async () => {
      // Wait a bit to ensure uptime is measurable
      await new Promise((resolve) => setTimeout(resolve, 50));
      const uptimeBefore = service.getUptime();

      service.resetMetrics();
      const uptimeAfter = service.getUptime();

      // After reset, uptime should be very small (close to 0)
      expect(uptimeAfter).toBeLessThan(uptimeBefore);
      expect(uptimeAfter).toBeLessThan(100); // Should be less than 100ms after reset
    });

    it('should reinitialize operation maps', () => {
      service.resetMetrics();

      const metrics = service.getAllOperationMetrics();
      expect(metrics.matching).toBeDefined();
      expect(metrics.search).toBeDefined();
      expect(metrics.graph).toBeDefined();
      expect(metrics.reasoning).toBeDefined();
    });
  });
});
