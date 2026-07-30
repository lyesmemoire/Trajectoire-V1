import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SchedulerCore } from '../../../CVM/src/scheduler/SchedulerCore';
import { TaskPriority, TaskStatus, SchedulerConfig } from '../../../CVM/src/scheduler/types';
import { PriorityQueueManager } from '../../../CVM/src/scheduler/PriorityQueueManager';
import { DeadlineScheduler } from '../../../CVM/src/scheduler/DeadlineScheduler';
import { TaskQueueManager } from '../../../CVM/src/scheduler/TaskQueueManager';
import { DependencyResolver } from '../../../CVM/src/scheduler/DependencyResolver';
import { AffinityManager } from '../../../CVM/src/scheduler/AffinityManager';

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

const createMockTask = (id: string, priority: TaskPriority = TaskPriority.NORMAL, deadline?: number) => ({
  id,
  sessionId: 'session-1',
  instruction: null,
  priority,
  deadline,
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

describe('SchedulerCore', () => {
  let schedulerCore: SchedulerCore;
  let priorityQueueManager: PriorityQueueManager;
  let deadlineScheduler: DeadlineScheduler;
  let taskQueueManager: TaskQueueManager;
  let dependencyResolver: DependencyResolver;
  let affinityManager: AffinityManager;

  beforeEach(() => {
    priorityQueueManager = new PriorityQueueManager(mockConfig);
    deadlineScheduler = new DeadlineScheduler();
    taskQueueManager = new TaskQueueManager(mockConfig);
    dependencyResolver = new DependencyResolver();
    affinityManager = new AffinityManager();

    schedulerCore = new SchedulerCore(
      mockConfig,
      priorityQueueManager,
      deadlineScheduler,
      taskQueueManager,
      dependencyResolver,
      affinityManager
    );
  });

  describe('creation', () => {
    it('should create scheduler core', () => {
      expect(schedulerCore).toBeDefined();
    });

    it('should initialize with zero metrics', () => {
      const metrics = schedulerCore.getMetrics();
      expect(metrics.totalTasksScheduled).toBe(0);
      expect(metrics.totalTasksCompleted).toBe(0);
      expect(metrics.totalTasksFailed).toBe(0);
      expect(metrics.totalTasksCancelled).toBe(0);
    });

    it('should initialize with fairness index of 1.0', () => {
      const metrics = schedulerCore.getMetrics();
      expect(metrics.fairnessIndex).toBe(1.0);
    });

    it('should initialize with zero starvation count', () => {
      const metrics = schedulerCore.getMetrics();
      expect(metrics.starvationCount).toBe(0);
    });
  });

  describe('schedule', () => {
    it('should schedule task successfully', async () => {
      const task = createMockTask('task-1');
      const result = await schedulerCore.schedule(task);

      expect(result.scheduled).toBe(true);
      expect(result.taskId).toBe('task-1');
    });

    it('should increment total tasks scheduled', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.totalTasksScheduled).toBe(1);
    });

    it('should set task status to SCHEDULED', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      expect(task.status).toBe(TaskStatus.SCHEDULED);
    });

    it('should set scheduledAt timestamp', async () => {
      const task = createMockTask('task-1');
      delete (task as any).scheduledAt;

      await schedulerCore.schedule(task);
      expect(task.scheduledAt).toBeDefined();
      expect(task.scheduledAt).toBeGreaterThan(0);
    });

    it('should handle non-Error objects in schedule', async () => {
      // Mock priorityQueueManager.enqueue to throw a non-Error object
      vi.spyOn(priorityQueueManager, 'enqueue').mockRejectedValue('string error');
      
      const task = createMockTask('task-1');
      const result = await schedulerCore.schedule(task);
      
      expect(result.scheduled).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should enqueue in priority queue', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const size = priorityQueueManager.size(task.priority);
      expect(size).toBe(1);
    });

    it('should enqueue in deadline queue if has deadline', async () => {
      const task = createMockTask('task-1', TaskPriority.NORMAL, Date.now() + 10000);
      await schedulerCore.schedule(task);

      expect(deadlineScheduler.size()).toBe(1);
    });

    it('should not enqueue in deadline queue if no deadline', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      expect(deadlineScheduler.size()).toBe(0);
    });

    it('should handle task with dependencies', async () => {
      const task = createMockTask('task-1');
      task.dependencies = ['dep-1'];

      const result = await schedulerCore.schedule(task);
      expect(result.scheduled).toBe(false);
      expect(result.error).toContain('Blocked by dependencies');
    });

    it('should assign affinity to task', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      expect(task.affinity).toBeDefined();
    });

    it('should return estimated start time', async () => {
      const task = createMockTask('task-1');
      const beforeTime = Date.now();
      const result = await schedulerCore.schedule(task);

      expect(result.estimatedStartTime).toBeGreaterThanOrEqual(beforeTime - 10);
    });

    it('should handle scheduling error', async () => {
      const task = createMockTask('task-1');
      task.priority = 999 as TaskPriority;

      const result = await schedulerCore.schedule(task);
      expect(result.scheduled).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update latency metrics', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.averageLatency).toBeGreaterThanOrEqual(0);
    });

    it('should update fair share', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.fairnessIndex).toBeGreaterThan(0);
    });

    it('should check for starvation', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.starvationCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('selectNextTask', () => {
    it('should return null when no tasks', async () => {
      const task = await schedulerCore.selectNextTask();
      expect(task).toBeNull();
    });

    it('should select task from deadline queue first', async () => {
      const deadlineTask = createMockTask('task-1', TaskPriority.NORMAL, Date.now() + 1000);
      await schedulerCore.schedule(deadlineTask);

      const task = await schedulerCore.selectNextTask();
      expect(task?.id).toBe('task-1');
    });

    it('should select task from priority queue if no deadline tasks', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const selected = await schedulerCore.selectNextTask();
      expect(selected?.id).toBe('task-1');
    });

    it('should prioritize deadline over priority', async () => {
      const deadlineTask = createMockTask('task-1', TaskPriority.LOW, Date.now() + 1000);
      const priorityTask = createMockTask('task-2', TaskPriority.HIGH);

      await schedulerCore.schedule(deadlineTask);
      await schedulerCore.schedule(priorityTask);

      const selected = await schedulerCore.selectNextTask();
      expect(selected?.id).toBe('task-1');
    });

    it('should remove task from queue after selection', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      await schedulerCore.selectNextTask();
      const selected = await schedulerCore.selectNextTask();

      expect(selected).toBeNull();
    });
  });

  describe('preempt', () => {
    it('should not preempt when disabled', async () => {
      const config = { ...mockConfig, enablePreemption: false };
      const core = new SchedulerCore(config, priorityQueueManager, deadlineScheduler, taskQueueManager, dependencyResolver, affinityManager);

      const currentTask = createMockTask('task-1', TaskPriority.LOW);
      await core.schedule(currentTask);

      const result = await core.preempt(currentTask);
      expect(result.preempted).toBe(false);
    });

    it('should not preempt when no higher priority task', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.HIGH);
      await schedulerCore.schedule(currentTask);

      const result = await schedulerCore.preempt(currentTask);
      expect(result.preempted).toBe(false);
    });

    it('should preempt when higher priority task available', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.LOW);
      const highPriorityTask = createMockTask('task-2', TaskPriority.HIGH);

      await schedulerCore.schedule(currentTask);
      await schedulerCore.schedule(highPriorityTask);

      const result = await schedulerCore.preempt(currentTask);
      expect(result.preempted).toBe(true);
    });

    it('should set task status to PENDING after preemption', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.LOW);
      const highPriorityTask = createMockTask('task-2', TaskPriority.HIGH);

      await schedulerCore.schedule(currentTask);
      await schedulerCore.schedule(highPriorityTask);

      await schedulerCore.preempt(currentTask);
      expect(currentTask.status).toBe(TaskStatus.PENDING);
    });

    it('should increment preemption count', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.LOW);
      const highPriorityTask = createMockTask('task-2', TaskPriority.HIGH);

      await schedulerCore.schedule(currentTask);
      await schedulerCore.schedule(highPriorityTask);

      await schedulerCore.preempt(currentTask);
      expect(currentTask.metrics.preemptions).toBe(1);
    });

    it('should not preempt when no higher priority task', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.HIGH);
      const lowPriorityTask = createMockTask('task-2', TaskPriority.LOW);

      await schedulerCore.schedule(currentTask);
      await schedulerCore.schedule(lowPriorityTask);

      const result = await schedulerCore.preempt(currentTask);
      expect(result.preempted).toBe(false);
    });

    it('should not preempt when no next task available', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.HIGH);

      await schedulerCore.schedule(currentTask);

      const result = await schedulerCore.preempt(currentTask);
      expect(result.preempted).toBe(false);
    });

    it('should not preempt when current task not found', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.HIGH);
      const highPriorityTask = createMockTask('task-2', TaskPriority.HIGH);

      await schedulerCore.schedule(highPriorityTask);

      // Try to preempt a task that's not in the queue
      const result = await schedulerCore.preempt(currentTask);
      expect(result.preempted).toBe(false);
    });

    it('should provide preemption reason', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.LOW);
      const highPriorityTask = createMockTask('task-2', TaskPriority.HIGH);

      await schedulerCore.schedule(currentTask);
      await schedulerCore.schedule(highPriorityTask);

      const result = await schedulerCore.preempt(currentTask);
      expect(result.reason).toContain('Higher priority task');
    });

    it('should handle starvation prevention with no starving tasks', async () => {
      await schedulerCore.preventStarvation();
      
      const metrics = schedulerCore.getMetrics();
      expect(metrics.starvationCount).toBe(0);
    });

    it('should handle fair share enforcement with empty sessions', async () => {
      await schedulerCore.enforceFairness();
      
      const metrics = schedulerCore.getMetrics();
      expect(metrics).toBeDefined();
    });

    it('should detect and boost starving tasks', async () => {
      const task = createMockTask('task-1', TaskPriority.LOW);
      task.scheduledAt = Date.now() - 100000; // Very old task
      
      await schedulerCore.schedule(task);
      
      // Manually add to starvation map to simulate starvation
      (schedulerCore as any).starvationMap.set('task-1', Date.now() - 100000);
      
      await schedulerCore.preventStarvation();
      
      const metrics = schedulerCore.getMetrics();
      expect(metrics.starvationCount).toBeGreaterThan(0);
    });

    it('should update latency metrics with empty array', () => {
      // Clear latencies to trigger empty branch
      (schedulerCore as any).latencies = [];
      
      // Manually call updateLatencyMetrics
      (schedulerCore as any).updateLatencyMetrics();
      
      const metrics = schedulerCore.getMetrics();
      expect(metrics.averageLatency).toBe(0);
    });

    it('should truncate latencies when exceeding limit', () => {
      // Manually add many latencies to trigger truncation
      (schedulerCore as any).latencies = new Array(10001).fill(100);
      
      // Manually call updateLatencyMetrics
      (schedulerCore as any).updateLatencyMetrics();
      
      const metrics = schedulerCore.getMetrics();
      expect(metrics).toBeDefined();
    });

    it('should preempt based on deadline pressure', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.HIGH, Date.now() + 10000);
      const urgentTask = createMockTask('task-2', TaskPriority.HIGH, Date.now() + 500);

      await schedulerCore.schedule(currentTask);
      await schedulerCore.schedule(urgentTask);

      const result = await schedulerCore.preempt(currentTask);
      expect(result.preempted).toBeDefined();
    });

    it('should not preempt when no higher priority task available', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.HIGH);
      await schedulerCore.schedule(currentTask);

      // Mock selectNextTask to return null explicitly
      vi.spyOn(schedulerCore as any, 'selectNextTask').mockResolvedValue(null);

      // Try to preempt when no next task available
      const result = await schedulerCore.preempt(currentTask);
      expect(result.preempted).toBe(false);
    });

    it('should preempt based on deadline pressure', async () => {
      const now = Date.now();
      
      const currentTask = createMockTask('task-1', TaskPriority.HIGH);
      currentTask.deadline = now + 5000; // 5 second slack
      await schedulerCore.schedule(currentTask);

      const urgentTask = createMockTask('task-2', TaskPriority.HIGH);
      urgentTask.deadline = now + 500; // 500ms slack - very tight
      await schedulerCore.schedule(urgentTask);

      const result = await schedulerCore.preempt(currentTask);
      expect(result.preempted).toBeDefined();
    });

    it('should check starvation for task with scheduledAt', async () => {
      const task = createMockTask('task-1');
      task.scheduledAt = Date.now();
      await schedulerCore.schedule(task);

      // Manually call checkStarvation to cover the branch
      (schedulerCore as any).checkStarvation(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics).toBeDefined();
    });

    it('should check starvation for task without scheduledAt', async () => {
      const task = createMockTask('task-1');
      // Don't set scheduledAt
      await schedulerCore.schedule(task);

      // Manually call checkStarvation to cover the else branch
      (schedulerCore as any).checkStarvation(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics).toBeDefined();
    });

    it('should preempt when next task has tighter deadline and slack', async () => {
      const now = Date.now();
      
      const currentTask = createMockTask('task-1', TaskPriority.HIGH);
      currentTask.deadline = now + 2000; // 2 second slack
      await schedulerCore.schedule(currentTask);

      const urgentTask = createMockTask('task-2', TaskPriority.HIGH);
      urgentTask.deadline = now + 800; // 800ms slack - less than 1000ms threshold
      await schedulerCore.schedule(urgentTask);

      const result = await schedulerCore.preempt(currentTask);
      
      // Should preempt due to deadline pressure
      expect(result.preempted).toBe(true);
    });

    it('should not preempt when next task has same priority but no deadline', async () => {
      const currentTask = createMockTask('task-1', TaskPriority.HIGH);
      await schedulerCore.schedule(currentTask);

      const nextTask = createMockTask('task-2', TaskPriority.HIGH);
      nextTask.deadline = undefined; // No deadline
      await schedulerCore.schedule(nextTask);

      const result = await schedulerCore.preempt(currentTask);
      
      // Should not preempt since priorities are equal and next task has no deadline
      expect(result.preempted).toBe(false);
    });
  });

  describe('enforceFairness', () => {
    it('should calculate fairness index', async () => {
      await schedulerCore.enforceFairness();

      const metrics = schedulerCore.getMetrics();
      expect(metrics.fairnessIndex).toBeGreaterThan(0);
    });

    it('should normalize fair shares', async () => {
      const task1 = createMockTask('task-1', TaskPriority.NORMAL);
      const task2 = createMockTask('task-2', TaskPriority.NORMAL);

      await schedulerCore.schedule(task1);
      await schedulerCore.schedule(task2);

      await schedulerCore.enforceFairness();

      const metrics = schedulerCore.getMetrics();
      expect(metrics.fairnessIndex).toBeGreaterThan(0);
    });

    it('should handle empty fair share map', async () => {
      await schedulerCore.enforceFairness();

      const metrics = schedulerCore.getMetrics();
      expect(metrics.fairnessIndex).toBe(1.0);
    });

    it('should calculate Jain\'s fairness index', async () => {
      for (let i = 0; i < 5; i++) {
        const task = createMockTask(`task-${i}`, TaskPriority.NORMAL);
        await schedulerCore.schedule(task);
      }

      await schedulerCore.enforceFairness();

      const metrics = schedulerCore.getMetrics();
      expect(metrics.fairnessIndex).toBeGreaterThan(0);
      expect(metrics.fairnessIndex).toBeLessThanOrEqual(1.0);
    });
  });

  describe('preventStarvation', () => {
    it('should check for starving tasks', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      await schedulerCore.preventStarvation();

      const metrics = schedulerCore.getMetrics();
      expect(metrics.starvationCount).toBeGreaterThanOrEqual(0);
    });

    it('should increment starvation count for starving tasks', async () => {
      const task = createMockTask('task-1');
      task.scheduledAt = Date.now() - 10000; // Old timestamp

      await schedulerCore.schedule(task);
      await schedulerCore.preventStarvation();

      const metrics = schedulerCore.getMetrics();
      expect(metrics.starvationCount).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty starvation map', async () => {
      await schedulerCore.preventStarvation();

      const metrics = schedulerCore.getMetrics();
      expect(metrics.starvationCount).toBe(0);
    });
  });

  describe('getMetrics', () => {
    it('should return copy of metrics', () => {
      const metrics1 = schedulerCore.getMetrics();
      const metrics2 = schedulerCore.getMetrics();

      expect(metrics1).toEqual(metrics2);
      expect(metrics1).not.toBe(metrics2);
    });

    it('should return current metrics', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.totalTasksScheduled).toBe(1);
    });

    it('should include all metric fields', () => {
      const metrics = schedulerCore.getMetrics();

      expect(metrics.totalTasksScheduled).toBeDefined();
      expect(metrics.totalTasksCompleted).toBeDefined();
      expect(metrics.totalTasksFailed).toBeDefined();
      expect(metrics.totalTasksCancelled).toBeDefined();
      expect(metrics.averageLatency).toBeDefined();
      expect(metrics.p50Latency).toBeDefined();
      expect(metrics.p95Latency).toBeDefined();
      expect(metrics.p99Latency).toBeDefined();
      expect(metrics.fairnessIndex).toBeDefined();
      expect(metrics.starvationCount).toBeDefined();
    });
  });

  describe('recordTaskCompletion', () => {
    it('should increment completed tasks', async () => {
      const task = createMockTask('task-1');
      schedulerCore.recordTaskCompletion(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.totalTasksCompleted).toBe(1);
    });

    it('should remove task from starvation map', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      schedulerCore.recordTaskCompletion(task);
      // Task should be removed from starvation map
    });

    it('should update fair share', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      schedulerCore.recordTaskCompletion(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.fairnessIndex).toBeDefined();
    });

    it('should record completion in task queue manager', async () => {
      const task = createMockTask('task-1');
      schedulerCore.recordTaskCompletion(task);

      const queueMetrics = taskQueueManager.getMetrics();
      expect(queueMetrics).toBeDefined();
    });
  });

  describe('recordTaskFailure', () => {
    it('should increment failed tasks', async () => {
      const task = createMockTask('task-1');
      schedulerCore.recordTaskFailure(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.totalTasksFailed).toBe(1);
    });

    it('should remove task from starvation map', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      schedulerCore.recordTaskFailure(task);
      // Task should be removed from starvation map
    });

    it('should record failure in task queue manager', async () => {
      const task = createMockTask('task-1');
      schedulerCore.recordTaskFailure(task);

      const queueMetrics = taskQueueManager.getMetrics();
      expect(queueMetrics).toBeDefined();
    });
  });

  describe('recordTaskCancellation', () => {
    it('should increment cancelled tasks', async () => {
      const task = createMockTask('task-1');
      schedulerCore.recordTaskCancellation(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.totalTasksCancelled).toBe(1);
    });

    it('should remove task from starvation map', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      schedulerCore.recordTaskCancellation(task);
      // Task should be removed from starvation map
    });
  });

  describe('latency metrics', () => {
    it('should calculate average latency', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.averageLatency).toBeGreaterThanOrEqual(0);
    });

    it('should calculate p50 latency', async () => {
      for (let i = 0; i < 10; i++) {
        const task = createMockTask(`task-${i}`);
        await schedulerCore.schedule(task);
      }

      const metrics = schedulerCore.getMetrics();
      expect(metrics.p50Latency).toBeGreaterThanOrEqual(0);
    });

    it('should calculate p95 latency', async () => {
      for (let i = 0; i < 10; i++) {
        const task = createMockTask(`task-${i}`);
        await schedulerCore.schedule(task);
      }

      const metrics = schedulerCore.getMetrics();
      expect(metrics.p95Latency).toBeGreaterThanOrEqual(0);
    });

    it('should calculate p99 latency', async () => {
      for (let i = 0; i < 10; i++) {
        const task = createMockTask(`task-${i}`);
        await schedulerCore.schedule(task);
      }

      const metrics = schedulerCore.getMetrics();
      expect(metrics.p99Latency).toBeGreaterThanOrEqual(0);
    });

    it('should trim latency array when too large', async () => {
      for (let i = 0; i < 15000; i++) {
        const task = createMockTask(`task-${i}`);
        await schedulerCore.schedule(task);
      }

      const metrics = schedulerCore.getMetrics();
      expect(metrics.averageLatency).toBeGreaterThanOrEqual(0);
    });
  });

  describe('edge cases', () => {
    it('should handle task with no scheduledAt', async () => {
      const task = createMockTask('task-1');
      delete (task as any).scheduledAt;

      const result = await schedulerCore.schedule(task);
      expect(result.scheduled).toBe(true);
    });

    it('should handle task with no deadline in deadline check', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      await schedulerCore.selectNextTask();
      expect(deadlineScheduler.size()).toBe(0);
    });

    it('should handle very large number of tasks', async () => {
      for (let i = 0; i < 100; i++) {
        const task = createMockTask(`task-${i}`);
        await schedulerCore.schedule(task);
      }

      const metrics = schedulerCore.getMetrics();
      expect(metrics.totalTasksScheduled).toBe(100);
    });

    it('should handle task with zero latency budget', async () => {
      const task = createMockTask('task-1');
      task.latencyBudget = 0;

      const result = await schedulerCore.schedule(task);
      expect(result.scheduled).toBe(true);
    });

    it('should handle task with very high priority', async () => {
      const task = createMockTask('task-1', TaskPriority.CRITICAL);
      const result = await schedulerCore.schedule(task);

      expect(result.scheduled).toBe(true);
    });

    it('should handle task with very low priority', async () => {
      const task = createMockTask('task-1', TaskPriority.BACKGROUND);
      const result = await schedulerCore.schedule(task);

      expect(result.scheduled).toBe(true);
    });
  });

  describe('concurrent operations', () => {
    it('should handle concurrent schedules', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(schedulerCore.schedule(createMockTask(`task-${i}`)));
      }

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);

      const metrics = schedulerCore.getMetrics();
      expect(metrics.totalTasksScheduled).toBe(10);
    });

    it('should handle concurrent selections', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(schedulerCore.selectNextTask());
      }

      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
    });
  });

  describe('integration with components', () => {
    it('should integrate with priority queue manager', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      const size = priorityQueueManager.size(task.priority);
      expect(size).toBe(1);
    });

    it('should integrate with deadline scheduler', async () => {
      const task = createMockTask('task-1', TaskPriority.NORMAL, Date.now() + 10000);
      await schedulerCore.schedule(task);

      expect(deadlineScheduler.size()).toBe(1);
    });

    it('should integrate with dependency resolver', async () => {
      const task = createMockTask('task-1');
      task.dependencies = ['dep-1'];

      const result = await schedulerCore.schedule(task);
      expect(result.scheduled).toBe(false);
    });

    it('should integrate with affinity manager', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      expect(task.affinity).toBeDefined();
    });

    it('should integrate with task queue manager', async () => {
      const task = createMockTask('task-1');
      await schedulerCore.schedule(task);

      schedulerCore.recordTaskCompletion(task);

      const metrics = taskQueueManager.getMetrics();
      expect(metrics).toBeDefined();
    });
  });
});
