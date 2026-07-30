import { describe, it, expect, beforeEach } from 'vitest';
import { BudgetManager } from '../../../CVM/src/scheduler/BudgetManager';
import { TaskPriority, TaskStatus } from '../../../CVM/src/scheduler/types';

const createMockTask = (id: string, sessionId: string = 'session-1') => ({
  id,
  sessionId,
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
  metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 }
});

describe('BudgetManager', () => {
  let budgetManager: BudgetManager;

  beforeEach(() => {
    budgetManager = new BudgetManager();
  });

  describe('creation', () => {
    it('should create budget manager', () => {
      expect(budgetManager).toBeDefined();
      const metrics = budgetManager.getMetrics();
      expect(metrics.totalLatencyConsumed).toBe(0);
      expect(metrics.totalTokensConsumed).toBe(0);
      expect(metrics.budgetViolations).toBe(0);
    });

    it('should initialize empty budget maps', () => {
      expect(budgetManager.latencyBudgets.size).toBe(0);
      expect(budgetManager.tokenBudgets.size).toBe(0);
      expect(budgetManager.cpuBudgets.size).toBe(0);
      expect(budgetManager.memoryBudgets.size).toBe(0);
    });
  });

  describe('checkBudget', () => {
    it('should pass when no budgets set', () => {
      const task = createMockTask('task-1');
      const result = budgetManager.checkBudget(task);

      expect(result.withinBudget).toBe(true);
      expect(result.exceededBudgets).toEqual([]);
    });

    it('should pass when task within latency budget', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      const task = createMockTask('task-1');
      task.latencyBudget = 1000;

      const result = budgetManager.checkBudget(task);
      expect(result.withinBudget).toBe(true);
    });

    it('should fail when task exceeds latency budget', () => {
      budgetManager.setBudget('session-1', 'latency', 500);
      const task = createMockTask('task-1');
      task.latencyBudget = 1000;

      const result = budgetManager.checkBudget(task);
      expect(result.withinBudget).toBe(false);
      expect(result.exceededBudgets).toContain('latency');
    });

    it('should pass when task within token budget', () => {
      budgetManager.setBudget('session-1', 'tokens', 2000);
      const task = createMockTask('task-1');
      task.tokenBudget = 1000;

      const result = budgetManager.checkBudget(task);
      expect(result.withinBudget).toBe(true);
    });

    it('should fail when task exceeds token budget', () => {
      budgetManager.setBudget('session-1', 'tokens', 500);
      const task = createMockTask('task-1');
      task.tokenBudget = 1000;

      const result = budgetManager.checkBudget(task);
      expect(result.withinBudget).toBe(false);
      expect(result.exceededBudgets).toContain('tokens');
    });

    it('should return remaining budgets', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      budgetManager.setBudget('session-1', 'tokens', 3000);

      const task = createMockTask('task-1');
      const result = budgetManager.checkBudget(task);

      expect(result.remainingBudgets.get('latency')).toBe(2000);
      expect(result.remainingBudgets.get('tokens')).toBe(3000);
    });

    it('should handle multiple exceeded budgets', () => {
      budgetManager.setBudget('session-1', 'latency', 500);
      budgetManager.setBudget('session-1', 'tokens', 500);
      const task = createMockTask('task-1');
      task.latencyBudget = 1000;
      task.tokenBudget = 1000;

      const result = budgetManager.checkBudget(task);
      expect(result.withinBudget).toBe(false);
      expect(result.exceededBudgets).toHaveLength(2);
    });

    it('should handle CPU budget exceeded', () => {
      budgetManager.setBudget('session-1', 'cpu', 50);
      const task = createMockTask('task-1');
      task.sessionId = 'session-1';
      task.metrics.cpuTime = 200;

      const result = budgetManager.checkBudget(task);
      expect(result.exceededBudgets).toContain('cpu');
    });

    it('should handle memory budget exceeded', () => {
      budgetManager.setBudget('session-1', 'memory', 512 * 512);
      const task = createMockTask('task-1');
      task.sessionId = 'session-1';
      task.metrics.memoryUsed = 1024 * 1024 * 2;

      const result = budgetManager.checkBudget(task);
      expect(result.exceededBudgets).toContain('memory');
    });

    it('should use Infinity for unset budgets', () => {
      const task = createMockTask('task-1');
      task.latencyBudget = 999999999;

      const result = budgetManager.checkBudget(task);
      expect(result.withinBudget).toBe(true);
    });
  });

  describe('consumeBudget', () => {
    it('should consume latency budget', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      const task = createMockTask('task-1');
      const metrics = { executionTime: 500, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);

      expect(budgetManager.latencyBudgets.get('session-1')).toBe(1500);
      expect(budgetManager.getMetrics().totalLatencyConsumed).toBe(500);
    });

    it('should consume token budget', () => {
      budgetManager.setBudget('session-1', 'tokens', 2000);
      const task = createMockTask('task-1');
      const metrics = { executionTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 500, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);

      expect(budgetManager.tokenBudgets.get('session-1')).toBe(1500);
      expect(budgetManager.getMetrics().totalTokensConsumed).toBe(500);
    });

    it('should consume CPU budget', () => {
      budgetManager.setBudget('session-1', 'cpu', 200);
      const task = createMockTask('task-1');
      const metrics = { executionTime: 0, cpuTime: 50, memoryUsed: 0, tokensUsed: 0, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);

      expect(budgetManager.cpuBudgets.get('session-1')).toBe(150);
      expect(budgetManager.getMetrics().totalCPUConsumed).toBe(50);
    });

    it('should consume memory budget', () => {
      budgetManager.setBudget('session-1', 'memory', 2000000);
      const task = createMockTask('task-1');
      const metrics = { executionTime: 0, cpuTime: 0, memoryUsed: 500000, tokensUsed: 0, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);

      expect(budgetManager.memoryBudgets.get('session-1')).toBe(1500000);
      expect(budgetManager.getMetrics().totalMemoryConsumed).toBe(500000);
    });

    it('should not consume when budget is Infinity', () => {
      const task = createMockTask('task-1');
      const metrics = { executionTime: 500, cpuTime: 50, memoryUsed: 500000, tokensUsed: 500, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);

      expect(budgetManager.getMetrics().totalLatencyConsumed).toBe(0);
      expect(budgetManager.getMetrics().totalTokensConsumed).toBe(0);
    });

    it('should handle multiple sessions', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      budgetManager.setBudget('session-2', 'latency', 3000);

      const task1 = createMockTask('task-1', 'session-1');
      const task2 = createMockTask('task-2', 'session-2');
      const metrics = { executionTime: 500, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task1, metrics);
      budgetManager.consumeBudget(task2, metrics);

      expect(budgetManager.latencyBudgets.get('session-1')).toBe(1500);
      expect(budgetManager.latencyBudgets.get('session-2')).toBe(2500);
    });
  });

  describe('releaseBudget', () => {
    it('should handle budget release', () => {
      const task = createMockTask('task-1');
      expect(() => budgetManager.releaseBudget(task)).not.toThrow();
    });

    it('should not restore consumed budget', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      const task = createMockTask('task-1');
      const metrics = { executionTime: 500, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);
      budgetManager.releaseBudget(task);

      expect(budgetManager.latencyBudgets.get('session-1')).toBe(1500);
    });
  });

  describe('setBudget', () => {
    it('should set latency budget', () => {
      budgetManager.setBudget('session-1', 'latency', 5000);
      expect(budgetManager.latencyBudgets.get('session-1')).toBe(5000);
    });

    it('should set token budget', () => {
      budgetManager.setBudget('session-1', 'tokens', 10000);
      expect(budgetManager.tokenBudgets.get('session-1')).toBe(10000);
    });

    it('should set CPU budget', () => {
      budgetManager.setBudget('session-1', 'cpu', 500);
      expect(budgetManager.cpuBudgets.get('session-1')).toBe(500);
    });

    it('should set memory budget', () => {
      budgetManager.setBudget('session-1', 'memory', 1000000);
      expect(budgetManager.memoryBudgets.get('session-1')).toBe(1000000);
    });

    it('should overwrite existing budget', () => {
      budgetManager.setBudget('session-1', 'latency', 5000);
      budgetManager.setBudget('session-1', 'latency', 10000);

      expect(budgetManager.latencyBudgets.get('session-1')).toBe(10000);
    });
  });

  describe('getMetrics', () => {
    it('should return zero metrics initially', () => {
      const metrics = budgetManager.getMetrics();
      expect(metrics.totalLatencyConsumed).toBe(0);
      expect(metrics.totalTokensConsumed).toBe(0);
      expect(metrics.totalCPUConsumed).toBe(0);
      expect(metrics.totalMemoryConsumed).toBe(0);
      expect(metrics.budgetViolations).toBe(0);
    });

    it('should return copy of metrics', () => {
      const metrics1 = budgetManager.getMetrics();
      const metrics2 = budgetManager.getMetrics();

      expect(metrics1).toEqual(metrics2);
    });

    it('should track consumption', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      budgetManager.setBudget('session-1', 'tokens', 1000);
      budgetManager.setBudget('session-1', 'cpu', 100);
      budgetManager.setBudget('session-1', 'memory', 1000000);
      const task = createMockTask('task-1');
      const metrics = { executionTime: 500, cpuTime: 50, memoryUsed: 500000, tokensUsed: 500, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);

      const budgetMetrics = budgetManager.getMetrics();
      expect(budgetMetrics.totalLatencyConsumed).toBe(500);
      expect(budgetMetrics.totalTokensConsumed).toBe(500);
      expect(budgetMetrics.totalCPUConsumed).toBe(50);
      expect(budgetMetrics.totalMemoryConsumed).toBe(500000);
    });
  });

  describe('recordBudgetViolation', () => {
    it('should increment violation count', () => {
      budgetManager.recordBudgetViolation();
      budgetManager.recordBudgetViolation();

      const metrics = budgetManager.getMetrics();
      expect(metrics.budgetViolations).toBe(2);
    });
  });

  describe('getRemainingBudget', () => {
    it('should return Infinity for unset budgets', () => {
      const remaining = budgetManager.getRemainingBudget('session-1');

      expect(remaining.get('latency')).toBe(Infinity);
      expect(remaining.get('tokens')).toBe(Infinity);
      expect(remaining.get('cpu')).toBe(Infinity);
      expect(remaining.get('memory')).toBe(Infinity);
    });

    it('should return actual remaining budgets', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      budgetManager.setBudget('session-1', 'tokens', 5000);

      const remaining = budgetManager.getRemainingBudget('session-1');

      expect(remaining.get('latency')).toBe(2000);
      expect(remaining.get('tokens')).toBe(5000);
    });

    it('should return remaining after consumption', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      const task = createMockTask('task-1');
      const metrics = { executionTime: 500, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);
      const remaining = budgetManager.getRemainingBudget('session-1');

      expect(remaining.get('latency')).toBe(1500);
    });
  });

  describe('clearSession', () => {
    it('should clear all budgets for session', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      budgetManager.setBudget('session-1', 'tokens', 5000);
      budgetManager.setBudget('session-1', 'cpu', 500);
      budgetManager.setBudget('session-1', 'memory', 1000000);

      budgetManager.clearSession('session-1');

      expect(budgetManager.latencyBudgets.has('session-1')).toBe(false);
      expect(budgetManager.tokenBudgets.has('session-1')).toBe(false);
      expect(budgetManager.cpuBudgets.has('session-1')).toBe(false);
      expect(budgetManager.memoryBudgets.has('session-1')).toBe(false);
    });

    it('should not affect other sessions', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      budgetManager.setBudget('session-2', 'latency', 3000);

      budgetManager.clearSession('session-1');

      expect(budgetManager.latencyBudgets.has('session-1')).toBe(false);
      expect(budgetManager.latencyBudgets.get('session-2')).toBe(3000);
    });

    it('should handle clearing non-existent session', () => {
      expect(() => budgetManager.clearSession('nonexistent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all budgets', () => {
      budgetManager.setBudget('session-1', 'latency', 2000);
      budgetManager.setBudget('session-2', 'tokens', 5000);

      budgetManager.clear();

      expect(budgetManager.latencyBudgets.size).toBe(0);
      expect(budgetManager.tokenBudgets.size).toBe(0);
      expect(budgetManager.cpuBudgets.size).toBe(0);
      expect(budgetManager.memoryBudgets.size).toBe(0);
    });

    it('should handle clearing empty budgets', () => {
      expect(() => budgetManager.clear()).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle zero budget', () => {
      const task = createMockTask('task-1');
      task.latencyBudget = 0;

      budgetManager.setBudget('session-1', 'latency', 0);

      const result = budgetManager.checkBudget(task);
      // With zero budget and zero task budget, it should be within budget
      expect(result.withinBudget).toBe(true);
    });

    it('should handle negative budget', () => {
      budgetManager.setBudget('session-1', 'latency', -100);
      const task = createMockTask('task-1');
      task.latencyBudget = 100;

      const result = budgetManager.checkBudget(task);
      expect(result.withinBudget).toBe(false);
    });

    it('should handle very large budgets', () => {
      budgetManager.setBudget('session-1', 'latency', Number.MAX_SAFE_INTEGER);
      const task = createMockTask('task-1');
      task.latencyBudget = 1000000;

      const result = budgetManager.checkBudget(task);
      expect(result.withinBudget).toBe(true);
    });

    it('should handle budget going negative after consumption', () => {
      budgetManager.setBudget('session-1', 'latency', 100);
      const task = createMockTask('task-1');
      const metrics = { executionTime: 500, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, queueTime: 0, waitTime: 0, retries: 0, preemptions: 0 };

      budgetManager.consumeBudget(task, metrics);

      expect(budgetManager.latencyBudgets.get('session-1')).toBe(-400);
    });

    it('should handle multiple sessions with different budgets', () => {
      budgetManager.setBudget('session-1', 'latency', 1000);
      budgetManager.setBudget('session-2', 'latency', 5000);
      budgetManager.setBudget('session-3', 'latency', 10000);

      const task1 = createMockTask('task-1', 'session-1');
      const task2 = createMockTask('task-2', 'session-2');
      const task3 = createMockTask('task-3', 'session-3');

      const result1 = budgetManager.checkBudget(task1);
      const result2 = budgetManager.checkBudget(task2);
      const result3 = budgetManager.checkBudget(task3);

      expect(result1.withinBudget).toBe(true);
      expect(result2.withinBudget).toBe(true);
      expect(result3.withinBudget).toBe(true);
    });
  });
});
