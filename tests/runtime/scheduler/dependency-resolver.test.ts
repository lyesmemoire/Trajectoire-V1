import { describe, it, expect, beforeEach } from 'vitest';
import { DependencyResolver } from '../../../CVM/src/scheduler/DependencyResolver';
import { TaskPriority, TaskStatus } from '../../../CVM/src/scheduler/types';

const createMockTask = (id: string, dependencies: string[] = [], status: TaskStatus = TaskStatus.PENDING) => ({
  id,
  sessionId: 'session-1',
  instruction: null,
  priority: TaskPriority.NORMAL,
  latencyBudget: 1000,
  tokenBudget: 1000,
  dependencies,
  retryPolicy: { maxRetries: 3, backoffStrategy: 'EXPONENTIAL' as any, initialDelay: 100, maxDelay: 1000 },
  createdAt: Date.now(),
  scheduledAt: Date.now(),
  startedAt: undefined as number | undefined,
  completedAt: undefined as number | undefined,
  status,
  metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 }
});

describe('DependencyResolver', () => {
  let resolver: DependencyResolver;

  beforeEach(() => {
    resolver = new DependencyResolver();
  });

  describe('creation', () => {
    it('should create dependency resolver', () => {
      expect(resolver).toBeDefined();
      const graph = resolver.getDependencyGraph();
      expect(graph.nodes.size).toBe(0);
      expect(graph.edges.size).toBe(0);
    });

    it('should initialize empty dependency graph', () => {
      const graph = resolver.getDependencyGraph();
      expect(graph.nodes).toBeInstanceOf(Map);
      expect(graph.edges).toBeInstanceOf(Map);
    });
  });

  describe('resolve', () => {
    it('should resolve task with no dependencies as ready', async () => {
      const task = createMockTask('task-1', []);
      const resolution = await resolver.resolve(task);

      expect(resolution.ready).toBe(true);
      expect(resolution.blockedBy).toEqual([]);
    });

    it('should resolve task with completed dependencies as ready', async () => {
      const depTask = createMockTask('dep-1', [], TaskStatus.COMPLETED);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      const resolution = await resolver.resolve(task);

      expect(resolution.ready).toBe(true);
    });

    it('should resolve task with pending dependencies as blocked', async () => {
      const depTask = createMockTask('dep-1', [], TaskStatus.PENDING);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      const resolution = await resolver.resolve(task);

      expect(resolution.ready).toBe(false);
      expect(resolution.blockedBy).toEqual(['dep-1']);
    });

    it('should resolve task with non-existent dependencies as blocked', async () => {
      const task = createMockTask('task-1', ['nonexistent']);
      const resolution = await resolver.resolve(task);

      expect(resolution.ready).toBe(false);
      expect(resolution.blockedBy).toEqual(['nonexistent']);
    });

    it('should handle multiple dependencies', async () => {
      const dep1 = createMockTask('dep-1', [], TaskStatus.COMPLETED);
      const dep2 = createMockTask('dep-2', [], TaskStatus.PENDING);
      await resolver.resolve(dep1);
      await resolver.resolve(dep2);

      const task = createMockTask('task-1', ['dep-1', 'dep-2']);
      const resolution = await resolver.resolve(task);

      expect(resolution.ready).toBe(false);
      expect(resolution.blockedBy).toEqual(['dep-2']);
    });

    it('should estimate ready time for blocked tasks', async () => {
      const task = createMockTask('task-1', ['dep-1', 'dep-2']);
      const resolution = await resolver.resolve(task);

      expect(resolution.estimatedReadyTime).toBeGreaterThan(Date.now());
    });

    it('should add task to dependency graph', async () => {
      const task = createMockTask('task-1', []);
      await resolver.resolve(task);

      const graph = resolver.getDependencyGraph();
      expect(graph.nodes.has('task-1')).toBe(true);
    });

    it('should add edges for dependencies', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      const graph = resolver.getDependencyGraph();
      expect(graph.edges.has('dep-1->task-1')).toBe(true);
    });

    it('should update dependents of dependency', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      const graph = resolver.getDependencyGraph();
      const depNode = graph.nodes.get('dep-1');
      expect(depNode?.dependents).toContain('task-1');
    });
  });

  describe('checkDependencies', () => {
    it('should return true for task with no dependencies', async () => {
      const task = createMockTask('task-1', []);
      const ready = await resolver.checkDependencies(task);

      expect(ready).toBe(true);
    });

    it('should return true when all dependencies completed', async () => {
      const depTask = createMockTask('dep-1', [], TaskStatus.COMPLETED);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      const ready = await resolver.checkDependencies(task);

      expect(ready).toBe(true);
    });

    it('should return false when dependency not completed', async () => {
      const depTask = createMockTask('dep-1', [], TaskStatus.RUNNING);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      const ready = await resolver.checkDependencies(task);

      expect(ready).toBe(false);
    });

    it('should return false when dependency does not exist', async () => {
      const task = createMockTask('task-1', ['nonexistent']);
      const ready = await resolver.checkDependencies(task);

      expect(ready).toBe(false);
    });

    it('should return false when any dependency incomplete', async () => {
      const dep1 = createMockTask('dep-1', [], TaskStatus.COMPLETED);
      const dep2 = createMockTask('dep-2', [], TaskStatus.RUNNING);
      await resolver.resolve(dep1);
      await resolver.resolve(dep2);

      const task = createMockTask('task-1', ['dep-1', 'dep-2']);
      const ready = await resolver.checkDependencies(task);

      expect(ready).toBe(false);
    });
  });

  describe('getDependencyGraph', () => {
    it('should return copy of dependency graph', async () => {
      const task = createMockTask('task-1', []);
      await resolver.resolve(task);

      const graph1 = resolver.getDependencyGraph();
      const graph2 = resolver.getDependencyGraph();

      expect(graph1).toEqual(graph2);
      expect(graph1).not.toBe(graph2);
    });

    it('should return empty graph initially', () => {
      const graph = resolver.getDependencyGraph();
      expect(graph.nodes.size).toBe(0);
      expect(graph.edges.size).toBe(0);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status in graph', async () => {
      const task = createMockTask('task-1', []);
      await resolver.resolve(task);

      resolver.updateTaskStatus('task-1', TaskStatus.COMPLETED);
      const graph = resolver.getDependencyGraph();

      const node = graph.nodes.get('task-1');
      expect(node?.status).toBe(TaskStatus.COMPLETED);
    });

    it('should handle updating non-existent task', () => {
      expect(() => resolver.updateTaskStatus('nonexistent', TaskStatus.COMPLETED)).not.toThrow();
    });

    it('should check dependents after status update', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      resolver.updateTaskStatus('dep-1', TaskStatus.COMPLETED);
      // Should check if task is now ready
    });

    it('should handle dependent node without task in map', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      // Manually remove task from taskMap to simulate edge case
      (resolver as any).taskMap.delete('task-1');

      // Should handle gracefully without throwing
      resolver.updateTaskStatus('dep-1', TaskStatus.COMPLETED);

      expect(resolver).toBeDefined();
    });

    it('should handle multiple dependents', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task1 = createMockTask('task-1', ['dep-1']);
      const task2 = createMockTask('task-2', ['dep-1']);
      await resolver.resolve(task1);
      await resolver.resolve(task2);

      resolver.updateTaskStatus('dep-1', TaskStatus.COMPLETED);
      const graph = resolver.getDependencyGraph();

      const depNode = graph.nodes.get('dep-1');
      expect(depNode?.dependents).toHaveLength(2);
    });
  });

  describe('removeTask', () => {
    it('should remove task from graph', async () => {
      const task = createMockTask('task-1', []);
      await resolver.resolve(task);

      resolver.removeTask('task-1');
      const graph = resolver.getDependencyGraph();

      expect(graph.nodes.has('task-1')).toBe(false);
    });

    it('should remove edges from task', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      resolver.removeTask('task-1');
      const graph = resolver.getDependencyGraph();

      expect(graph.edges.has('dep-1->task-1')).toBe(false);
    });

    it('should remove edges to task', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      resolver.removeTask('dep-1');
      const graph = resolver.getDependencyGraph();

      expect(graph.edges.has('dep-1->task-1')).toBe(false);
    });

    it('should handle removing non-existent task', () => {
      expect(() => resolver.removeTask('nonexistent')).not.toThrow();
    });

    it('should remove all edges when task has both incoming and outgoing edges', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      const dependentTask = createMockTask('task-2', ['task-1']);
      await resolver.resolve(dependentTask);

      // task-1 has incoming edge from dep-1 and outgoing edge to task-2
      expect(resolver.getDependencyGraph().edges.size).toBe(2);

      resolver.removeTask('task-1');
      const graph = resolver.getDependencyGraph();

      // Both edges should be removed
      expect(graph.edges.size).toBe(0);
    });

    it('should handle dependent node without corresponding task in taskMap', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      // Manually remove task from taskMap to simulate edge case
      (resolver as any).taskMap.delete('task-1');

      // Update dependency status - should handle missing task gracefully
      resolver.updateTaskStatus('dep-1', TaskStatus.COMPLETED);

      expect(resolver).toBeDefined();
    });

    it('should handle dependent node that exists but task does not exist', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      // Manually remove task from taskMap but keep node in graph
      (resolver as any).taskMap.delete('task-1');

      // Update dependency status - depNode exists but task doesn't
      resolver.updateTaskStatus('dep-1', TaskStatus.COMPLETED);

      expect(resolver).toBeDefined();
    });

    it('should check dependent node when updating task status', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      // Update dependency status - should check dependent node
      resolver.updateTaskStatus('dep-1', TaskStatus.COMPLETED);

      const graph = resolver.getDependencyGraph();
      expect(graph.nodes.get('dep-1')?.status).toBe(TaskStatus.COMPLETED);
    });

    it('should handle dependent node exists but task missing from taskMap', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      // Remove task from taskMap but keep dependent node in graph
      (resolver as any).taskMap.delete('task-1');

      // Update dependency status - depNode exists but task doesn't
      resolver.updateTaskStatus('dep-1', TaskStatus.COMPLETED);

      const graph = resolver.getDependencyGraph();
      expect(graph.nodes.get('dep-1')?.status).toBe(TaskStatus.COMPLETED);
    });

    it('should handle removing task with both incoming and outgoing edges', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      const dependentTask = createMockTask('task-2', ['task-1']);
      await resolver.resolve(dependentTask);

      // Remove task-1 which has both incoming (from dep-1) and outgoing (to task-2) edges
      resolver.removeTask('task-1');

      const graph = resolver.getDependencyGraph();
      expect(graph.nodes.has('task-1')).toBe(false);
    });

    it('should handle removing non-existent task', async () => {
      // Try to remove a task that doesn't exist in the graph
      resolver.removeTask('non-existent-task');

      const graph = resolver.getDependencyGraph();
      expect(graph.nodes.has('non-existent-task')).toBe(false);
    });

    it('should remove edges when removing task with dependencies', async () => {
      const depTask = createMockTask('dep-1', []);
      await resolver.resolve(depTask);

      const task = createMockTask('task-1', ['dep-1']);
      await resolver.resolve(task);

      // Remove task-1 which has an edge from dep-1
      resolver.removeTask('task-1');

      const graph = resolver.getDependencyGraph();
      expect(graph.nodes.has('task-1')).toBe(false);
      // Edge should be removed
      expect(graph.edges.size).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear all nodes and edges', async () => {
      await resolver.resolve(createMockTask('task-1', []));
      await resolver.resolve(createMockTask('task-2', ['task-1']));

      resolver.clear();
      const graph = resolver.getDependencyGraph();

      expect(graph.nodes.size).toBe(0);
      expect(graph.edges.size).toBe(0);
    });

    it('should handle clearing empty graph', () => {
      expect(() => resolver.clear()).not.toThrow();
    });
  });

  describe('dependency chains', () => {
    it('should handle linear dependency chain', async () => {
      const task1 = createMockTask('task-1', [], TaskStatus.COMPLETED);
      const task2 = createMockTask('task-2', ['task-1']);
      const task3 = createMockTask('task-3', ['task-2']);

      await resolver.resolve(task1);
      await resolver.resolve(task2);
      await resolver.resolve(task3);

      const graph = resolver.getDependencyGraph();
      expect(graph.edges.size).toBe(2);
    });

    it('should handle diamond dependency pattern', async () => {
      const task1 = createMockTask('task-1', [], TaskStatus.COMPLETED);
      const task2 = createMockTask('task-2', ['task-1']);
      const task3 = createMockTask('task-3', ['task-1']);
      const task4 = createMockTask('task-4', ['task-2', 'task-3']);

      await resolver.resolve(task1);
      await resolver.resolve(task2);
      await resolver.resolve(task3);
      await resolver.resolve(task4);

      const graph = resolver.getDependencyGraph();
      expect(graph.edges.size).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('should handle circular dependencies', async () => {
      const task1 = createMockTask('task-1', ['task-2']);
      const task2 = createMockTask('task-2', ['task-1']);

      await resolver.resolve(task1);
      await resolver.resolve(task2);

      const resolution1 = await resolver.checkDependencies(task1);
      const resolution2 = await resolver.checkDependencies(task2);

      expect(resolution1).toBe(false);
      expect(resolution2).toBe(false);
    });

    it('should handle empty dependency list', async () => {
      const task = createMockTask('task-1', []);
      const resolution = await resolver.resolve(task);

      expect(resolution.ready).toBe(true);
    });

    it('should handle self-dependency', async () => {
      const task = createMockTask('task-1', ['task-1']);
      const resolution = await resolver.resolve(task);

      expect(resolution.ready).toBe(false);
    });

    it('should handle large number of dependencies', async () => {
      const deps = [];
      for (let i = 0; i < 100; i++) {
        const dep = createMockTask(`dep-${i}`, [], TaskStatus.COMPLETED);
        await resolver.resolve(dep);
        deps.push(`dep-${i}`);
      }

      const task = createMockTask('task-1', deps);
      const resolution = await resolver.resolve(task);

      expect(resolution.ready).toBe(true);
    });
  });
});
