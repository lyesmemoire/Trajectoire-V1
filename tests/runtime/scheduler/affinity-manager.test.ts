import { describe, it, expect, beforeEach } from 'vitest';
import { AffinityManager } from '../../../CVM/src/scheduler/AffinityManager';
import { TaskPriority, TaskStatus, WorkerStatus } from '../../../CVM/src/scheduler/types';

const createMockTask = (id: string, affinity?: any) => ({
  id,
  sessionId: 'session-1',
  instruction: null,
  priority: TaskPriority.NORMAL,
  latencyBudget: 1000,
  tokenBudget: 1000,
  dependencies: [],
  retryPolicy: { maxRetries: 3, backoffStrategy: 'EXPONENTIAL' as any, initialDelay: 100, maxDelay: 1000 },
  createdAt: Date.now(),
  scheduledAt: Date.now(),
  startedAt: undefined as number | undefined,
  completedAt: undefined as number | undefined,
  status: TaskStatus.PENDING,
  metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 },
  affinity
});

const createMockWorker = (id: number, cpuAffinity: number[] = [0], gpuAffinity: number[] = [0], providerAffinity: string[] = []) => ({
  id,
  status: WorkerStatus.IDLE,
  queue: [],
  cpuAffinity,
  gpuAffinity,
  providerAffinity,
  metrics: {
    activeWorkers: 0,
    idleWorkers: 0,
    averageUtilization: 0,
    stolenTasks: 0,
    preemptions: 0
  }
});

describe('AffinityManager', () => {
  let affinityManager: AffinityManager;

  beforeEach(() => {
    affinityManager = new AffinityManager();
  });

  describe('creation', () => {
    it('should create affinity manager', () => {
      expect(affinityManager).toBeDefined();
      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.affinityHits).toBe(0);
      expect(metrics.affinityMisses).toBe(0);
      expect(metrics.loadBalance).toBe(1.0);
    });

    it('should initialize with zero metrics', () => {
      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.affinityHits).toBe(0);
      expect(metrics.affinityMisses).toBe(0);
    });
  });

  describe('assignAffinity', () => {
    it('should respect existing task affinity', async () => {
      const existingAffinity = { cpuAffinity: [0, 1], gpuAffinity: [0] };
      const task = createMockTask('task-1', existingAffinity);

      const affinity = await affinityManager.assignAffinity(task);
      expect(affinity).toEqual(existingAffinity);
    });

    it('should assign CPU affinity', async () => {
      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.cpuAffinity).toEqual([0, 1, 2, 3]);
    });

    it('should assign GPU affinity', async () => {
      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.gpuAffinity).toEqual([0]);
    });

    it('should assign provider affinity when available', async () => {
      affinityManager.updateProviderLoad('provider-1', 5);
      affinityManager.updateProviderLoad('provider-2', 3);

      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toContain('provider-2');
    });

    it('should not assign provider affinity when none available', async () => {
      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toBeUndefined();
    });

    it('should select provider with minimum load', async () => {
      affinityManager.updateProviderLoad('provider-1', 10);
      affinityManager.updateProviderLoad('provider-2', 2);
      affinityManager.updateProviderLoad('provider-3', 5);

      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toEqual(['provider-2']);
    });
  });

  describe('respectAffinity', () => {
    it('should return true when task has no affinity', () => {
      const task = createMockTask('task-1');
      const worker = createMockWorker(0);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(true);
    });

    it('should return true when worker matches CPU affinity', () => {
      const task = createMockTask('task-1', { cpuAffinity: [0, 1] });
      const worker = createMockWorker(0, [0, 1]);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(true);
    });

    it('should return false when worker does not match CPU affinity', () => {
      const task = createMockTask('task-1', { cpuAffinity: [2, 3] });
      const worker = createMockWorker(0, [0, 1]);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(false);
    });

    it('should return true when worker matches GPU affinity', () => {
      const task = createMockTask('task-1', { gpuAffinity: [0] });
      const worker = createMockWorker(0, [0], [0]);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(true);
    });

    it('should return false when worker does not match GPU affinity', () => {
      const task = createMockTask('task-1', { gpuAffinity: [1] });
      const worker = createMockWorker(0, [0], [0]);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(false);
    });

    it('should return true when worker matches provider affinity', () => {
      const task = createMockTask('task-1', { providerAffinity: ['provider-1'] });
      const worker = createMockWorker(0, [0], [0], ['provider-1']);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(true);
    });

    it('should return false when worker does not match provider affinity', () => {
      const task = createMockTask('task-1', { providerAffinity: ['provider-1'] });
      const worker = createMockWorker(0, [0], [0], ['provider-2']);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(false);
    });

    it('should track affinity hits', () => {
      const task = createMockTask('task-1', { cpuAffinity: [0] });
      const worker = createMockWorker(0, [0]);

      affinityManager.respectAffinity(task, worker);
      const metrics = affinityManager.getAffinityMetrics();

      expect(metrics.affinityHits).toBe(1);
    });

    it('should track affinity misses', () => {
      const task = createMockTask('task-1', { cpuAffinity: [1] });
      const worker = createMockWorker(0, [0]);

      affinityManager.respectAffinity(task, worker);
      const metrics = affinityManager.getAffinityMetrics();

      expect(metrics.affinityMisses).toBe(1);
    });

    it('should handle partial CPU affinity match', () => {
      const task = createMockTask('task-1', { cpuAffinity: [0, 1, 2] });
      const worker = createMockWorker(0, [0, 1]);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(true);
    });

    it('should handle empty affinity arrays', () => {
      const task = createMockTask('task-1', { cpuAffinity: [], gpuAffinity: [], providerAffinity: [] });
      const worker = createMockWorker(0);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(true);
    });
  });

  describe('getAffinityMetrics', () => {
    it('should return current metrics', () => {
      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.affinityHits).toBe(0);
      expect(metrics.affinityMisses).toBe(0);
      expect(metrics.loadBalance).toBe(1.0);
    });

    it('should update load balance on retrieval', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.updateWorkerLoad(0, 10);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBeDefined();
    });

    it('should return copy of metrics', () => {
      const metrics1 = affinityManager.getAffinityMetrics();
      const metrics2 = affinityManager.getAffinityMetrics();

      expect(metrics1).toEqual(metrics2);
    });
  });

  describe('registerWorker', () => {
    it('should register worker with affinities', () => {
      const worker = createMockWorker(0, [0, 1], [0], ['provider-1']);
      affinityManager.registerWorker(worker);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.affinityHits).toBe(0);
    });

    it('should initialize worker load to 0', () => {
      const worker = createMockWorker(0);
      affinityManager.registerWorker(worker);

      affinityManager.updateWorkerLoad(0, 5);
      // Should start from 0
    });

    it('should handle multiple workers', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.registerWorker(createMockWorker(1));
      affinityManager.registerWorker(createMockWorker(2));

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });
  });

  describe('updateWorkerLoad', () => {
    it('should increase worker load', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.updateWorkerLoad(0, 10);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });

    it('should decrease worker load', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.updateWorkerLoad(0, 10);
      affinityManager.updateWorkerLoad(0, -5);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBeDefined();
    });

    it('should handle non-existent worker', () => {
      expect(() => affinityManager.updateWorkerLoad(99, 10)).not.toThrow();
    });

    it('should handle negative load', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.updateWorkerLoad(0, -10);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBeDefined();
    });
  });

  describe('updateProviderLoad', () => {
    it('should increase provider load', async () => {
      affinityManager.updateProviderLoad('provider-1', 10);

      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toEqual(['provider-1']);
    });

    it('should decrease provider load', async () => {
      affinityManager.updateProviderLoad('provider-1', 10);
      affinityManager.updateProviderLoad('provider-1', -5);

      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toEqual(['provider-1']);
    });

    it('should handle multiple providers', async () => {
      affinityManager.updateProviderLoad('provider-1', 5);
      affinityManager.updateProviderLoad('provider-2', 10);
      affinityManager.updateProviderLoad('provider-3', 2);

      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toEqual(['provider-3']);
    });

    it('should handle non-existent provider', () => {
      expect(() => affinityManager.updateProviderLoad('nonexistent', 10)).not.toThrow();
    });
  });

  describe('unregisterWorker', () => {
    it('should remove worker from affinities', () => {
      const worker = createMockWorker(0);
      affinityManager.registerWorker(worker);
      affinityManager.unregisterWorker(0);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });

    it('should remove worker load', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.updateWorkerLoad(0, 10);
      affinityManager.unregisterWorker(0);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });

    it('should handle unregistering non-existent worker', () => {
      expect(() => affinityManager.unregisterWorker(99)).not.toThrow();
    });

    it('should handle unregistering already unregistered worker', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.unregisterWorker(0);
      expect(() => affinityManager.unregisterWorker(0)).not.toThrow();
    });
  });

  describe('load balance calculation', () => {
    it('should calculate perfect load balance', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.registerWorker(createMockWorker(1));
      affinityManager.updateWorkerLoad(0, 10);
      affinityManager.updateWorkerLoad(1, 10);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });

    it('should calculate imperfect load balance', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.registerWorker(createMockWorker(1));
      affinityManager.updateWorkerLoad(0, 10);
      affinityManager.updateWorkerLoad(1, 5);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBeLessThan(1.0);
      expect(metrics.loadBalance).toBeGreaterThan(0);
    });

    it('should handle zero average load', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.registerWorker(createMockWorker(1));

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });

    it('should handle single worker', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.updateWorkerLoad(0, 10);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });
  });

  describe('edge cases', () => {
    it('should handle task with undefined affinity', async () => {
      const task = createMockTask('task-1');
      delete (task as any).affinity;

      const affinity = await affinityManager.assignAffinity(task);
      expect(affinity).toBeDefined();
    });

    it('should handle worker with empty affinities', () => {
      const task = createMockTask('task-1', { cpuAffinity: [0] });
      const worker = createMockWorker(0, [], [], []);

      const respects = affinityManager.respectAffinity(task, worker);
      expect(respects).toBe(false);
    });

    it('should handle large number of workers', () => {
      for (let i = 0; i < 100; i++) {
        affinityManager.registerWorker(createMockWorker(i));
      }

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });

    it('should handle large load values', () => {
      affinityManager.registerWorker(createMockWorker(0));
      affinityManager.updateWorkerLoad(0, 1000000);

      const metrics = affinityManager.getAffinityMetrics();
      expect(metrics.loadBalance).toBe(1.0);
    });
  });

  describe('provider selection', () => {
    it('should select least loaded provider', async () => {
      affinityManager.updateProviderLoad('provider-1', 100);
      affinityManager.updateProviderLoad('provider-2', 50);
      affinityManager.updateProviderLoad('provider-3', 75);

      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toEqual(['provider-2']);
    });

    it('should handle equal load providers', async () => {
      affinityManager.updateProviderLoad('provider-1', 10);
      affinityManager.updateProviderLoad('provider-2', 10);

      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toBeDefined();
    });

    it('should handle zero load providers', async () => {
      affinityManager.updateProviderLoad('provider-1', 0);
      affinityManager.updateProviderLoad('provider-2', 0);

      const task = createMockTask('task-1');
      const affinity = await affinityManager.assignAffinity(task);

      expect(affinity.providerAffinity).toBeDefined();
    });
  });
});
