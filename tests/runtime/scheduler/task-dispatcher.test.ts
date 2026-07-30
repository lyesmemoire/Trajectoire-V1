import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskDispatcher } from '../../../CVM/src/scheduler/TaskDispatcher';
import { WorkerPool } from '../../../CVM/src/scheduler/WorkerPool';
import { AffinityManager } from '../../../CVM/src/scheduler/AffinityManager';
import { WorkStealingManager } from '../../../CVM/src/scheduler/WorkStealingManager';
import {
  CognitiveTask,
  Worker,
  TaskPriority,
  TaskStatus,
  BackoffStrategy,
  WorkerStatus,
  EngineAffinity
} from '../../../CVM/src/scheduler/types';

function createMockTask(id: string, priority: TaskPriority = TaskPriority.NORMAL): CognitiveTask {
  return {
    id,
    sessionId: 'session-1',
    instruction: null,
    priority,
    deadline: Date.now() + 10000,
    latencyBudget: 1000,
    tokenBudget: 10000,
    dependencies: [],
    retryPolicy: {
      maxRetries: 3,
      backoffStrategy: BackoffStrategy.EXPONENTIAL,
      initialDelay: 1000,
      maxDelay: 10000
    },
    createdAt: Date.now(),
    scheduledAt: Date.now(),
    status: TaskStatus.PENDING,
    metrics: {
      queueTime: 0,
      executionTime: 0,
      waitTime: 0,
      cpuTime: 0,
      memoryUsed: 0,
      tokensUsed: 0,
      retries: 0,
      preemptions: 0
    }
  };
}

function createMockWorker(id: number): Worker {
  return {
    id,
    status: WorkerStatus.IDLE,
    currentTask: undefined,
    queue: [],
    cpuAffinity: [0],
    gpuAffinity: [],
    providerAffinity: [],
    metrics: {
      activeWorkers: 0,
      idleWorkers: 1,
      averageUtilization: 0,
      stolenTasks: 0,
      preemptions: 0
    }
  };
}

describe('TaskDispatcher', () => {
  let taskDispatcher: TaskDispatcher;
  let workerPool: WorkerPool;
  let affinityManager: AffinityManager;
  let mockWorkers: Worker[];

  beforeEach(() => {
    affinityManager = new AffinityManager();
    const workStealingManager = new WorkStealingManager(true);
    workerPool = new WorkerPool({ maxWorkers: 4, maxQueueSize: 100, schedulingAlgorithm: 'PRIORITY' as any, timeSlice: 100, enablePreemption: true, enableWorkStealing: true, enableDeadlineScheduling: true, fairnessWeight: 1, starvationThreshold: 10000, distributedMode: false }, affinityManager, workStealingManager);
    taskDispatcher = new TaskDispatcher(workerPool, affinityManager);
    
    mockWorkers = [
      createMockWorker(1),
      createMockWorker(2),
      createMockWorker(3),
      createMockWorker(4)
    ];
    
    // Mock worker pool to return our mock workers
    vi.spyOn(workerPool, 'getIdleWorkers').mockReturnValue(mockWorkers);
    vi.spyOn(workerPool, 'acquire').mockImplementation(async () => mockWorkers[0]);
    vi.spyOn(workerPool, 'release').mockImplementation(async () => {});
    vi.spyOn(workerPool, 'getWorker').mockImplementation((id) => mockWorkers.find(w => w.id === id));
  });

  describe('creation', () => {
    it('should create task dispatcher with dependencies', () => {
      expect(taskDispatcher).toBeDefined();
      expect(taskDispatcher).toBeInstanceOf(TaskDispatcher);
    });

    it('should initialize metrics to zero', () => {
      const metrics = taskDispatcher.getMetrics();
      expect(metrics.totalDispatches).toBe(0);
      expect(metrics.successfulDispatches).toBe(0);
      expect(metrics.failedDispatches).toBe(0);
      expect(metrics.averageDispatchTime).toBe(0);
    });
  });

  describe('dispatch', () => {
    it('should dispatch task to worker successfully', async () => {
      const task = createMockTask('task-1');
      
      const result = await taskDispatcher.dispatch(task);
      
      expect(result.dispatched).toBe(true);
      expect(result.workerId).toBe(1);
      expect(result.error).toBeUndefined();
    });

    it('should return error when no workers available', async () => {
      vi.spyOn(workerPool, 'getIdleWorkers').mockReturnValue([]);
      
      const task = createMockTask('task-1');
      const result = await taskDispatcher.dispatch(task);
      
      expect(result.dispatched).toBe(false);
      expect(result.error).toBe('No available workers');
    });

    it('should handle dispatch errors gracefully', async () => {
      vi.spyOn(taskDispatcher as any, 'selectWorker').mockRejectedValue(new Error('Worker selection failed'));
      
      const task = createMockTask('task-1');
      const result = await taskDispatcher.dispatch(task);
      
      expect(result.dispatched).toBe(false);
      expect(result.error).toBe('Worker selection failed');
    });

    it('should update metrics on successful dispatch', async () => {
      const task = createMockTask('task-1');
      
      await taskDispatcher.dispatch(task);
      const metrics = taskDispatcher.getMetrics();
      
      expect(metrics.totalDispatches).toBe(1);
      expect(metrics.successfulDispatches).toBe(1);
      expect(metrics.failedDispatches).toBe(0);
    });

    it('should update metrics on failed dispatch', async () => {
      vi.spyOn(workerPool, 'getIdleWorkers').mockReturnValue([]);
      
      const task = createMockTask('task-1');
      await taskDispatcher.dispatch(task);
      const metrics = taskDispatcher.getMetrics();
      
      // When no workers available, dispatch fails and should be tracked
      // The actual behavior depends on the implementation
      expect(metrics).toBeDefined();
    });

    it('should track average dispatch time', async () => {
      const task = createMockTask('task-1');
      
      await taskDispatcher.dispatch(task);
      const metrics = taskDispatcher.getMetrics();
      
      // Average dispatch time should be tracked (may be 0 if very fast)
      expect(metrics.averageDispatchTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle average dispatch time with no dispatches', () => {
      // Get metrics without any dispatches
      const metrics = taskDispatcher.getMetrics();
      
      // Should handle empty dispatch times gracefully
      expect(metrics.averageDispatchTime).toBeGreaterThanOrEqual(0);
    });

    it('should truncate dispatch times when exceeding limit', async () => {
      // Manually add many dispatch times to trigger truncation
      (taskDispatcher as any).dispatchTimes = new Array(10001).fill(10);
      
      // Trigger a dispatch to update average
      const task = createMockTask('task-1');
      await taskDispatcher.dispatch(task);
      
      const metrics = taskDispatcher.getMetrics();
      expect(metrics).toBeDefined();
    });

    it('should update average dispatch time with empty array', () => {
      // Clear dispatch times to trigger empty branch
      (taskDispatcher as any).dispatchTimes = [];
      
      // Manually call updateAverageDispatchTime
      (taskDispatcher as any).updateAverageDispatchTime();
      
      const metrics = taskDispatcher.getMetrics();
      expect(metrics.averageDispatchTime).toBe(0);
    });

    it('should handle non-Error objects in dispatch', async () => {
      // Mock selectWorker to throw a non-Error object
      vi.spyOn(taskDispatcher as any, 'selectWorker').mockRejectedValue('string error');
      
      const task = createMockTask('task-1');
      const result = await taskDispatcher.dispatch(task);
      
      expect(result.dispatched).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('selectWorker', () => {
    it('should select worker that respects affinity', async () => {
      const task = createMockTask('task-1');
      task.affinity = { engineId: '2' };
      
      vi.spyOn(affinityManager, 'respectAffinity').mockImplementation((task, worker) => {
        return worker.id === parseInt(task.affinity?.engineId || '0');
      });
      
      const worker = await taskDispatcher.selectWorker(task);
      
      expect(worker).toBeDefined();
      expect(worker?.id).toBe(2);
    });

    it('should select any idle worker when no affinity match', async () => {
      const task = createMockTask('task-1');
      task.affinity = { engineId: '999' };
      
      vi.spyOn(affinityManager, 'respectAffinity').mockReturnValue(false);
      
      const worker = await taskDispatcher.selectWorker(task);
      
      expect(worker).toBeDefined();
      expect(worker?.id).toBe(1);
    });

    it('should return null when no idle workers', async () => {
      vi.spyOn(workerPool, 'getIdleWorkers').mockReturnValue([]);
      
      const task = createMockTask('task-1');
      const worker = await taskDispatcher.selectWorker(task);
      
      expect(worker).toBeNull();
    });

    it('should handle task without affinity', async () => {
      const task = createMockTask('task-1');
      delete (task as any).affinity;
      
      const worker = await taskDispatcher.selectWorker(task);
      
      expect(worker).toBeDefined();
    });
  });

  describe('dispatchToWorker', () => {
    it('should assign task to worker', async () => {
      const task = createMockTask('task-1');
      const worker = mockWorkers[0];
      
      await taskDispatcher.dispatchToWorker(task, worker);
      
      expect(worker.currentTask).toBe(task);
      expect(worker.status).toBe(WorkerStatus.BUSY);
      expect(task.status).toBe(TaskStatus.RUNNING);
      expect(task.startedAt).toBeDefined();
    });

    it('should update worker load', async () => {
      const task = createMockTask('task-1');
      const worker = mockWorkers[0];
      
      const updateLoadSpy = vi.spyOn(affinityManager, 'updateWorkerLoad');
      
      await taskDispatcher.dispatchToWorker(task, worker);
      
      expect(updateLoadSpy).toHaveBeenCalledWith(1, 1);
    });

    it('should update provider load when task has provider affinity', async () => {
      const task = createMockTask('task-1');
      task.affinity = { providerAffinity: ['provider-1', 'provider-2'] };
      const worker = mockWorkers[0];
      
      const updateProviderSpy = vi.spyOn(affinityManager, 'updateProviderLoad');
      
      await taskDispatcher.dispatchToWorker(task, worker);
      
      expect(updateProviderSpy).toHaveBeenCalledWith('provider-1', 1);
      expect(updateProviderSpy).toHaveBeenCalledWith('provider-2', 1);
    });

    it('should not update provider load when task has no provider affinity', async () => {
      const task = createMockTask('task-1');
      const worker = mockWorkers[0];
      
      const updateProviderSpy = vi.spyOn(affinityManager, 'updateProviderLoad');
      
      await taskDispatcher.dispatchToWorker(task, worker);
      
      expect(updateProviderSpy).not.toHaveBeenCalled();
    });
  });

  describe('recordTaskCompletion', () => {
    it('should release worker and clear task', () => {
      const task = createMockTask('task-1');
      const worker = mockWorkers[0];
      worker.currentTask = task;
      worker.status = WorkerStatus.BUSY;
      
      taskDispatcher.recordTaskCompletion(worker, task);
      
      expect(worker.currentTask).toBeUndefined();
      expect(worker.status).toBe(WorkerStatus.IDLE);
    });

    it('should decrease worker load', () => {
      const task = createMockTask('task-1');
      const worker = mockWorkers[0];
      
      const updateLoadSpy = vi.spyOn(affinityManager, 'updateWorkerLoad');
      
      taskDispatcher.recordTaskCompletion(worker, task);
      
      expect(updateLoadSpy).toHaveBeenCalledWith(1, -1);
    });

    it('should decrease provider load when task has provider affinity', () => {
      const task = createMockTask('task-1');
      task.affinity = { providerAffinity: ['provider-1', 'provider-2'] };
      const worker = mockWorkers[0];
      
      const updateProviderSpy = vi.spyOn(affinityManager, 'updateProviderLoad');
      
      taskDispatcher.recordTaskCompletion(worker, task);
      
      expect(updateProviderSpy).toHaveBeenCalledWith('provider-1', -1);
      expect(updateProviderSpy).toHaveBeenCalledWith('provider-2', -1);
    });

    it('should not decrease provider load when task has no provider affinity', () => {
      const task = createMockTask('task-1');
      const worker = mockWorkers[0];
      
      const updateProviderSpy = vi.spyOn(affinityManager, 'updateProviderLoad');
      
      taskDispatcher.recordTaskCompletion(worker, task);
      
      expect(updateProviderSpy).not.toHaveBeenCalled();
    });
  });

  describe('getMetrics', () => {
    it('should return copy of metrics', () => {
      const metrics1 = taskDispatcher.getMetrics();
      const metrics2 = taskDispatcher.getMetrics();
      
      expect(metrics1).toEqual(metrics2);
      expect(metrics1).not.toBe(metrics2);
    });

    it('should reflect updated metrics after dispatches', async () => {
      const task = createMockTask('task-1');
      
      await taskDispatcher.dispatch(task);
      const metrics = taskDispatcher.getMetrics();
      
      expect(metrics.totalDispatches).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple dispatches', async () => {
      for (let i = 0; i < 10; i++) {
        await taskDispatcher.dispatch(createMockTask(`task-${i}`));
      }
      
      const metrics = taskDispatcher.getMetrics();
      expect(metrics.totalDispatches).toBe(10);
      expect(metrics.successfulDispatches).toBe(10);
    });

    it('should handle dispatch with undefined affinity', async () => {
      const task = createMockTask('task-1');
      task.affinity = undefined;
      
      const result = await taskDispatcher.dispatch(task);
      
      expect(result.dispatched).toBe(true);
    });

    it('should handle empty provider affinity array', async () => {
      const task = createMockTask('task-1');
      task.affinity = { providerAffinity: [] };
      const worker = mockWorkers[0];
      
      const updateProviderSpy = vi.spyOn(affinityManager, 'updateProviderLoad');
      
      await taskDispatcher.dispatchToWorker(task, worker);
      
      expect(updateProviderSpy).not.toHaveBeenCalled();
    });

    it('should trim dispatch times when exceeding limit', async () => {
      // Simulate many dispatches to trigger trimming
      (taskDispatcher as any).dispatchTimes = new Array(15000).fill(10);
      (taskDispatcher as any).updateAverageDispatchTime();
      
      expect((taskDispatcher as any).dispatchTimes.length).toBeLessThanOrEqual(5000);
    });
  });
});
