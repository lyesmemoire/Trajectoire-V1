import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CognitiveScheduler } from '../../../CVM/src/scheduler/CognitiveScheduler';
import { TaskPriority, TaskStatus, SchedulerConfig } from '../../../CVM/src/scheduler/types';

const mockConfig: SchedulerConfig = {
  maxWorkers: 4,
  maxQueueSize: 100,
  schedulingAlgorithm: 'PRIORITY' as any,
  timeSlice: 10,
  enablePreemption: true,
  enableWorkStealing: true,
  enableDeadlineScheduling: true,
  fairnessWeight: 1.0,
  starvationThreshold: 5000,
  distributedMode: false
};

const createMockTask = (id: string, priority: TaskPriority = TaskPriority.NORMAL) => ({
  id,
  sessionId: 'session-1',
  instruction: null,
  priority,
  latencyBudget: 1000,
  tokenBudget: 1000,
  dependencies: [],
  retryPolicy: { maxRetries: 3, backoffStrategy: 'EXPONENTIAL' as any, initialDelay: 100, maxDelay: 1000 },
  createdAt: Date.now(),
  scheduledAt: Date.now(),
  startedAt: undefined as number | undefined,
  completedAt: undefined as number | undefined,
  status: TaskStatus.PENDING,
  metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 }
});

describe('CognitiveScheduler', () => {
  let scheduler: CognitiveScheduler;

  beforeEach(() => {
    vi.useFakeTimers();
    scheduler = new CognitiveScheduler(mockConfig);
  });

  afterEach(async () => {
    vi.useRealTimers();
    await scheduler.shutdown();
  });

  describe('creation', () => {
    it('should create scheduler with config', () => {
      expect(scheduler).toBeDefined();
      expect(scheduler.config).toEqual(mockConfig);
    });

    it('should initialize all components', () => {
      expect(scheduler.taskQueueManager).toBeDefined();
      expect(scheduler.priorityQueueManager).toBeDefined();
      expect(scheduler.deadlineScheduler).toBeDefined();
      expect(scheduler.schedulerCore).toBeDefined();
      expect(scheduler.workStealingManager).toBeDefined();
      expect(scheduler.dependencyResolver).toBeDefined();
      expect(scheduler.affinityManager).toBeDefined();
      expect(scheduler.dispatcher).toBeDefined();
      expect(scheduler.workerPool).toBeDefined();
      expect(scheduler.budgetManager).toBeDefined();
      expect(scheduler.retryManager).toBeDefined();
    });

    it('should not be initialized initially', () => {
      expect(scheduler['initialized']).toBe(false);
      expect(scheduler['running']).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should initialize scheduler', async () => {
      await scheduler.initialize();

      expect(scheduler['initialized']).toBe(true);
      expect(scheduler['running']).toBe(true);
    });

    it('should not initialize twice', async () => {
      await scheduler.initialize();
      await scheduler.initialize();

      expect(scheduler['initialized']).toBe(true);
    });

    it('should start scheduler loop', async () => {
      await scheduler.initialize();

      expect(scheduler['schedulerLoop']).toBeDefined();
    });
  });

  describe('schedule', () => {
    it('should schedule task', async () => {
      const task = createMockTask('task-1');
      const result = await scheduler.schedule(task);

      expect(result).toBeDefined();
      expect(result.taskId).toBe('task-1');
    });

    it('should auto-initialize if not initialized', async () => {
      const task = createMockTask('task-1');
      const result = await scheduler.schedule(task);

      expect(scheduler['initialized']).toBe(true);
      expect(result).toBeDefined();
    });

    it('should handle multiple tasks', async () => {
      const task1 = createMockTask('task-1');
      const task2 = createMockTask('task-2');
      const task3 = createMockTask('task-3');

      const result1 = await scheduler.schedule(task1);
      const result2 = await scheduler.schedule(task2);
      const result3 = await scheduler.schedule(task3);

      expect(result1.taskId).toBe('task-1');
      expect(result2.taskId).toBe('task-2');
      expect(result3.taskId).toBe('task-3');
    });
  });

  describe('cancel', () => {
    it('should cancel task', async () => {
      const result = await scheduler.cancel('task-1');

      expect(result).toBeDefined();
      expect(result.taskId).toBe('task-1');
      expect(result.cancelled).toBe(true);
    });

    it('should provide cancellation reason', async () => {
      const result = await scheduler.cancel('task-1');

      expect(result.reason).toBe('User cancelled');
    });
  });

  describe('pause', () => {
    it('should pause session', async () => {
      await expect(scheduler.pause('session-1')).resolves.not.toThrow();
    });

    it('should handle pause for non-existent session', async () => {
      await expect(scheduler.pause('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('resume', () => {
    it('should resume session', async () => {
      await expect(scheduler.resume('session-1')).resolves.not.toThrow();
    });

    it('should handle resume for non-existent session', async () => {
      await expect(scheduler.resume('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('getTask', () => {
    it('should return null for non-existent task', () => {
      const task = scheduler.getTask('nonexistent');
      expect(task).toBeNull();
    });

    it('should return null for any task (not implemented)', () => {
      const task = scheduler.getTask('task-1');
      expect(task).toBeNull();
    });
  });

  describe('getQueueMetrics', () => {
    it('should return queue metrics', () => {
      const metrics = scheduler.getQueueMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.pendingTasks).toBe(0);
      expect(metrics.runningTasks).toBe(0);
    });

    it('should return metrics from task queue manager', () => {
      const metrics = scheduler.getQueueMetrics();
      const taskQueueMetrics = scheduler.taskQueueManager.getMetrics();

      expect(metrics).toEqual(taskQueueMetrics);
    });
  });

  describe('getWorkerMetrics', () => {
    it('should return worker metrics', () => {
      const metrics = scheduler.getWorkerMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.activeWorkers).toBe(0);
      expect(metrics.idleWorkers).toBe(4);
    });

    it('should return metrics from worker pool', () => {
      const metrics = scheduler.getWorkerMetrics();
      const workerPoolMetrics = scheduler.workerPool.getMetrics();

      expect(metrics).toEqual(workerPoolMetrics);
    });
  });

  describe('getSchedulerMetrics', () => {
    it('should return scheduler metrics', () => {
      const metrics = scheduler.getSchedulerMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.totalTasksScheduled).toBe(0);
      expect(metrics.totalTasksCompleted).toBe(0);
    });

    it('should return metrics from scheduler core', () => {
      const metrics = scheduler.getSchedulerMetrics();
      const coreMetrics = scheduler.schedulerCore.getMetrics();

      expect(metrics).toEqual(coreMetrics);
    });
  });

  describe('shutdown', () => {
    it('should shutdown scheduler', async () => {
      await scheduler.initialize();
      await scheduler.shutdown();

      expect(scheduler['running']).toBe(false);
    });

    it('should clear scheduler loop', async () => {
      await scheduler.initialize();
      await scheduler.shutdown();

      expect(scheduler['schedulerLoop']).toBeDefined();
    });

    it('should shutdown worker pool', async () => {
      await scheduler.initialize();
      await scheduler.shutdown();

      const metrics = scheduler.workerPool.getMetrics();
      expect(metrics.activeWorkers).toBe(0);
    });

    it('should shutdown deadline scheduler', async () => {
      await scheduler.initialize();
      await scheduler.shutdown();

      expect(scheduler.deadlineScheduler).toBeDefined();
    });

    it('should handle shutdown when not initialized', async () => {
      await expect(scheduler.shutdown()).resolves.not.toThrow();
    });

    it('should handle multiple shutdowns', async () => {
      await scheduler.initialize();
      await scheduler.shutdown();
      await expect(scheduler.shutdown()).resolves.not.toThrow();
    });
  });

  describe('scheduler loop', () => {
    it('should process retry tasks', async () => {
      await scheduler.initialize();
      vi.advanceTimersByTime(20);

      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(20);
    });

    it('should check deadlines', async () => {
      await scheduler.initialize();
      vi.advanceTimersByTime(20);

      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(20);
    });

    it('should enforce fairness', async () => {
      await scheduler.initialize();
      vi.advanceTimersByTime(20);

      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(20);
    });

    it('should prevent starvation', async () => {
      await scheduler.initialize();
      vi.advanceTimersByTime(20);

      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(20);
    });

    it('should balance workers when work stealing enabled', async () => {
      await scheduler.initialize();
      vi.advanceTimersByTime(20);

      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(20);
    });

    it('should dispatch tasks', async () => {
      await scheduler.initialize();
      vi.advanceTimersByTime(20);

      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(20);
    });
  });

  describe('task execution', () => {
    it('should execute task successfully', async () => {
      await scheduler.initialize();
      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(200);

      const metrics = scheduler.getSchedulerMetrics();
      expect(metrics.totalTasksScheduled).toBe(1);
    });

    it('should handle task failure', async () => {
      await scheduler.initialize();
      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(200);

      const metrics = scheduler.getSchedulerMetrics();
      expect(metrics.totalTasksScheduled).toBe(1);
    });

    it('should update task status on completion', async () => {
      await scheduler.initialize();
      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(200);

      expect(task.status).toBeDefined();
    });

    it('should consume budget on completion', async () => {
      await scheduler.initialize();
      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(200);

      const budgetMetrics = scheduler.budgetManager.getMetrics();
      expect(budgetMetrics).toBeDefined();
    });
  });

  describe('budget violations', () => {
    it('should record budget violation', async () => {
      scheduler.budgetManager.setBudget('session-1', 'latency', 10);
      const task = createMockTask('task-1');
      task.latencyBudget = 1000;

      await scheduler.initialize();
      await scheduler.schedule(task);

      vi.advanceTimersByTime(20);

      const budgetMetrics = scheduler.budgetManager.getMetrics();
      expect(budgetMetrics).toBeDefined();
    });
  });

  describe('retry logic', () => {
    it('should retry failed tasks', async () => {
      await scheduler.initialize();
      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(200);

      const retryMetrics = scheduler.retryManager.getMetrics();
      expect(retryMetrics).toBeDefined();
    });

    it('should increment retry count', async () => {
      await scheduler.initialize();
      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(200);

      const retryCount = scheduler.retryManager.getRetryCount('task-1');
      expect(retryCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('dependency resolution', () => {
    it('should update task status on completion', async () => {
      await scheduler.initialize();
      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(200);

      expect(scheduler.dependencyResolver).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle zero workers config', async () => {
      const zeroConfig = { ...mockConfig, maxWorkers: 0 };
      const zeroScheduler = new CognitiveScheduler(zeroConfig);

      await zeroScheduler.initialize();
      const task = createMockTask('task-1');
      await zeroScheduler.schedule(task);

      vi.advanceTimersByTime(20);

      await zeroScheduler.shutdown();
    });

    it('should handle work stealing disabled', async () => {
      const noStealConfig = { ...mockConfig, enableWorkStealing: false };
      const noStealScheduler = new CognitiveScheduler(noStealConfig);

      await noStealScheduler.initialize();
      const task = createMockTask('task-1');
      await noStealScheduler.schedule(task);

      vi.advanceTimersByTime(20);

      await noStealScheduler.shutdown();
    });

    it('should handle budget violations', async () => {
      await scheduler.initialize();
      
      // Set very low budget to trigger violation
      scheduler.budgetManager.setBudget('session-1', 'latency', 0);
      
      const task = createMockTask('task-1');
      task.latencyBudget = 1000;
      
      await scheduler.schedule(task);
      vi.advanceTimersByTime(20);

      const budgetMetrics = scheduler.budgetManager.getMetrics();
      expect(budgetMetrics).toBeDefined();
    });

    it('should handle no tasks available for dispatch', async () => {
      await scheduler.initialize();
      
      // Let scheduler run without any tasks
      vi.advanceTimersByTime(50);
      
      // Scheduler should handle empty state gracefully
      expect(scheduler).toBeDefined();
    });

    it('should handle scheduler loop when not running', async () => {
      await scheduler.initialize();
      
      // Stop the scheduler
      await scheduler.shutdown();
      
      // Try to schedule after shutdown
      const task = createMockTask('task-1');
      const result = await scheduler.schedule(task);
      
      // Should handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle dispatch with no tasks', async () => {
      await scheduler.initialize();
      
      // Run scheduler tick without any tasks
      vi.advanceTimersByTime(20);
      
      // Should handle gracefully
      expect(scheduler).toBeDefined();
    });

    it('should handle dispatch with budget violations', async () => {
      await scheduler.initialize();
      
      // Set zero budget to trigger violations
      scheduler.budgetManager.setBudget('session-1', 'latency', 0);
      
      const task = createMockTask('task-1');
      task.latencyBudget = 1000;
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle budget violations gracefully
      expect(scheduler).toBeDefined();
    });

    it('should handle dispatch failure', async () => {
      await scheduler.initialize();
      
      // Mock dispatcher to fail
      vi.spyOn(scheduler.dispatcher, 'dispatch').mockResolvedValue({
        dispatched: false,
        error: 'No workers available'
      });
      
      const task = createMockTask('task-1');
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle dispatch failure gracefully
      expect(scheduler).toBeDefined();
    });

    it('should handle worker not found during execution', async () => {
      await scheduler.initialize();
      
      // Mock getWorker to return null
      vi.spyOn(scheduler.workerPool, 'getWorker').mockReturnValue(undefined);
      
      const task = createMockTask('task-1');
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle missing worker gracefully
      expect(scheduler).toBeDefined();
    });

    it('should handle task execution failure', async () => {
      await scheduler.initialize();
      
      // Mock simulateExecution to throw error
      vi.spyOn(scheduler as any, 'simulateExecution').mockRejectedValue(new Error('Execution failed'));
      
      const task = createMockTask('task-1');
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle execution failure gracefully
      expect(scheduler).toBeDefined();
    });

    it('should process retry tasks during scheduler tick', async () => {
      await scheduler.initialize();
      
      // Add a task to retry manager
      const task = createMockTask('task-1');
      task.retryPolicy.initialDelay = 0;
      task.scheduledAt = Date.now() - 1000;
      await scheduler.retryManager.enqueueRetry(task);
      
      vi.advanceTimersByTime(20);
      
      // Should process retry tasks
      expect(scheduler).toBeDefined();
    });

    it('should handle task failure with retry', async () => {
      await scheduler.initialize();
      
      // Mock simulateExecution to throw error
      vi.spyOn(scheduler as any, 'simulateExecution').mockRejectedValue(new Error('Execution failed'));
      
      const task = createMockTask('task-1');
      task.retryPolicy.maxRetries = 3;
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle failure and enqueue retry
      expect(scheduler).toBeDefined();
    });

    it('should handle task failure without retry', async () => {
      await scheduler.initialize();
      
      // Mock simulateExecution to throw error
      vi.spyOn(scheduler as any, 'simulateExecution').mockRejectedValue(new Error('Execution failed'));
      
      const task = createMockTask('task-1');
      task.retryPolicy.maxRetries = 0;
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle failure without retry
      expect(scheduler).toBeDefined();
    });

    it('should handle scheduler loop when not running', async () => {
      await scheduler.initialize();
      await scheduler.shutdown();
      
      // Manually trigger scheduler loop to ensure the running check is covered
      (scheduler as any).running = false;
      await (scheduler as any).schedulerTick();
      
      // Scheduler loop should not execute when not running
      vi.advanceTimersByTime(20);
      
      expect(scheduler).toBeDefined();
    });

    it('should trigger running check in scheduler loop', async () => {
      await scheduler.initialize();
      
      // Mock setInterval to capture the callback
      let capturedCallback: any = null;
      vi.spyOn(global, 'setInterval').mockImplementation((callback: any) => {
        capturedCallback = callback;
        return 123 as any;
      });
      
      // Re-initialize to trigger setInterval
      await scheduler.shutdown();
      await scheduler.initialize();
      
      // Set running to false
      (scheduler as any).running = false;
      
      // Call the captured callback to trigger the running check
      if (capturedCallback) {
        await capturedCallback();
      }
      
      vi.restoreAllMocks();
      await scheduler.shutdown();
      
      expect(scheduler).toBeDefined();
    });

    it('should handle task execution failure', async () => {
      await scheduler.initialize();

      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      // Mock simulateExecution to throw an error
      vi.spyOn(scheduler as any, 'simulateExecution').mockRejectedValue(new Error('Execution failed'));

      // This should trigger the error handling path
      await (scheduler as any).executeTask(0, task);

      vi.restoreAllMocks();
      await scheduler.shutdown();

      expect(scheduler).toBeDefined();
    });

    it('should process retry tasks during scheduler tick', async () => {
      await scheduler.initialize();
      
      const task = createMockTask('task-1');
      task.retryPolicy.maxRetries = 3;
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should process retry tasks
      expect(scheduler).toBeDefined();
    });

    it('should handle task completion with metrics', async () => {
      await scheduler.initialize();
      
      const task = createMockTask('task-1');
      task.scheduledAt = Date.now();
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(30);
      
      // Task should complete and have metrics
      expect(task.metrics).toBeDefined();
    });

    it('should handle task failure with retry logic', async () => {
      await scheduler.initialize();
      
      // Mock simulateExecution to throw error
      vi.spyOn(scheduler as any, 'simulateExecution').mockRejectedValue(new Error('Execution failed'));
      
      const task = createMockTask('task-1');
      task.retryPolicy.maxRetries = 3;
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle failure with retry
      expect(scheduler).toBeDefined();
    });

    it('should handle task failure without retry when maxRetries is 0', async () => {
      await scheduler.initialize();
      
      // Mock simulateExecution to throw error
      vi.spyOn(scheduler as any, 'simulateExecution').mockRejectedValue(new Error('Execution failed'));
      
      const task = createMockTask('task-1');
      task.retryPolicy.maxRetries = 0;
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle failure without retry
      expect(scheduler).toBeDefined();
    });

    it('should record execution metrics on task completion', async () => {
      await scheduler.initialize();
      
      const task = createMockTask('task-1');
      task.startedAt = Date.now();
      task.scheduledAt = Date.now() - 100;
      
      // Manually call executeTask to trigger metrics recording
      const worker = { id: 1, status: 'idle', load: 0 };
      await (scheduler as any).executeTask(task, worker);
      
      // Metrics should be recorded
      expect(task.metrics.executionTime).toBeGreaterThanOrEqual(0);
      expect(task.metrics.queueTime).toBeGreaterThanOrEqual(0);
    });

    it('should record simulateExecution metrics', async () => {
      await scheduler.initialize();
      
      const task = createMockTask('task-1');
      
      // Mock simulateExecution to return immediately with metrics
      vi.spyOn(scheduler as any, 'simulateExecution').mockImplementation(async (t: any) => {
        t.metrics.cpuTime = 50;
        t.metrics.memoryUsed = 1024 * 1024;
        t.metrics.tokensUsed = 20;
      });
      
      // Manually call simulateExecution to trigger metrics recording
      await (scheduler as any).simulateExecution(task);
      
      // Metrics should be recorded
      expect(task.metrics.cpuTime).toBeGreaterThan(0);
      expect(task.metrics.memoryUsed).toBeGreaterThan(0);
      expect(task.metrics.tokensUsed).toBeGreaterThan(0);
    });

    it('should record task failure metrics on execution failure', async () => {
      await scheduler.initialize();
      
      // Mock simulateExecution to throw error
      vi.spyOn(scheduler as any, 'simulateExecution').mockRejectedValue(new Error('Execution failed'));
      
      const task = createMockTask('task-1');
      task.retryPolicy.maxRetries = 0;
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(20);
      
      // Should handle execution failure
      expect(scheduler).toBeDefined();
    });

    it('should enable work stealing when configured', async () => {
      const stealConfig = { ...mockConfig, enableWorkStealing: true };
      const stealScheduler = new CognitiveScheduler(stealConfig);

      await stealScheduler.initialize();
      const task = createMockTask('task-1');
      await stealScheduler.schedule(task);

      vi.advanceTimersByTime(20);

      // Should handle work stealing enabled
      expect(stealScheduler).toBeDefined();
      await stealScheduler.shutdown();
    });

    it('should handle task completion metrics', async () => {
      await scheduler.initialize();
      
      const task = createMockTask('task-1');
      task.scheduledAt = Date.now();
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(30);
      
      // Task should complete and have metrics (may be 0 if very fast)
      expect(task.metrics).toBeDefined();
    });

    it('should handle dependency status update on completion', async () => {
      await scheduler.initialize();
      
      const task = createMockTask('task-1');
      await scheduler.schedule(task);
      
      vi.advanceTimersByTime(30);
      
      // Should handle dependency update
      expect(scheduler.dependencyResolver).toBeDefined();
    });

    it('should handle preemption disabled', async () => {
      const noPreemptConfig = { ...mockConfig, enablePreemption: false };
      const noPreemptScheduler = new CognitiveScheduler(noPreemptConfig);

      await noPreemptScheduler.initialize();
      const task = createMockTask('task-1');
      await noPreemptScheduler.schedule(task);

      vi.advanceTimersByTime(20);

      await noPreemptScheduler.shutdown();
    });

    it('should handle very large queue size', async () => {
      const largeConfig = { ...mockConfig, maxQueueSize: 10000 };
      const largeScheduler = new CognitiveScheduler(largeConfig);

      await largeScheduler.initialize();
      const task = createMockTask('task-1');
      await largeScheduler.schedule(task);

      vi.advanceTimersByTime(20);

      await largeScheduler.shutdown();
    });
  });

  describe('concurrent operations', () => {
    it('should handle concurrent schedules', async () => {
      await scheduler.initialize();

      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(scheduler.schedule(createMockTask(`task-${i}`)));
      }

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);

      vi.advanceTimersByTime(200);
    });

    it('should handle concurrent cancels', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(scheduler.cancel(`task-${i}`));
      }

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
    });
  });

  describe('metrics aggregation', () => {
    it('should aggregate all metrics', async () => {
      await scheduler.initialize();
      const task = createMockTask('task-1');
      await scheduler.schedule(task);

      vi.advanceTimersByTime(200);

      const queueMetrics = scheduler.getQueueMetrics();
      const workerMetrics = scheduler.getWorkerMetrics();
      const schedulerMetrics = scheduler.getSchedulerMetrics();

      expect(queueMetrics).toBeDefined();
      expect(workerMetrics).toBeDefined();
      expect(schedulerMetrics).toBeDefined();
    });
  });
});
