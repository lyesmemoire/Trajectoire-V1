import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { ThreadManager, ThreadState, SchedulingPolicy } from '../../../compiler/cvm/thread-manager';

describe('Demo Programs - Multithreading', () => {
  let context1: ExecutionContext;
  let context2: ExecutionContext;
  let threadManager: ThreadManager;

  beforeEach(() => {
    context1 = new ExecutionContext();
    context2 = new ExecutionContext();
    threadManager = new ThreadManager();
  });

  describe('Thread Creation', () => {
    it('should demonstrate thread creation', () => {
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      expect(thread1.id).toBeDefined();
      expect(thread2.id).toBeDefined();
      expect(thread1.id).not.toBe(thread2.id);
    });

    it('should demonstrate thread with different priorities', () => {
      const thread1 = threadManager.createThread(context1, 10);
      const thread2 = threadManager.createThread(context2, 1);

      expect(thread1.priority).toBe(10);
      expect(thread2.priority).toBe(1);
    });
  });

  describe('Thread Execution', () => {
    it('should demonstrate parallel thread execution', () => {
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      threadManager.setThreadState(thread1.id, ThreadState.RUNNING);
      threadManager.setThreadState(thread2.id, ThreadState.RUNNING);

      const retrieved1 = threadManager.getThread(thread1.id);
      const retrieved2 = threadManager.getThread(thread2.id);

      expect(retrieved1).toBeDefined();
      expect(retrieved2).toBeDefined();
    });

    it('should demonstrate thread block and unblock', () => {
      const thread = threadManager.createThread(context1);
      threadManager.setThreadState(thread.id, ThreadState.BLOCKED);

      let state = threadManager.getThread(thread.id);
      expect(state?.state).toBe(ThreadState.BLOCKED);

      threadManager.unblock(thread.id);
      state = threadManager.getThread(thread.id);
      expect(state?.state).toBe(ThreadState.READY);
    });
  });

  describe('Thread Synchronization', () => {
    it('should demonstrate thread deletion', () => {
      const thread = threadManager.createThread(context1);
      const deleted = threadManager.deleteThread(thread.id);

      expect(deleted).toBe(true);
      expect(threadManager.getThread(thread.id)).toBeNull();
    });

    it('should demonstrate thread termination', () => {
      const thread = threadManager.createThread(context1);
      threadManager.terminate(thread.id);

      const state = threadManager.getThread(thread.id);
      expect(state?.state).toBe(ThreadState.TERMINATED);
    });
  });

  describe('Thread Scheduler', () => {
    it('should demonstrate priority scheduling', () => {
      threadManager.setSchedulingPolicy(SchedulingPolicy.PRIORITY);
      const high = threadManager.createThread(context1, 10);
      const low = threadManager.createThread(context2, 1);

      const scheduled = threadManager.schedule();

      expect(scheduled).toBeDefined();
      expect(scheduled?.priority).toBe(10);
    });

    it('should demonstrate thread yield', () => {
      const thread = threadManager.createThread(context1);
      threadManager.setThreadState(thread.id, ThreadState.RUNNING);

      // Yield schedules the next thread, which may be the same if only one thread
      threadManager.yield();

      const state = threadManager.getThread(thread.id);
      // After yield, the thread state depends on scheduling
      expect(state).toBeDefined();
    });
  });

  describe('Thread States', () => {
    it('should demonstrate thread state transitions', () => {
      const thread = threadManager.createThread(context1);

      // Initial state
      let state = threadManager.getThread(thread.id);
      expect(state?.state).toBe(ThreadState.READY);

      // Running
      threadManager.setThreadState(thread.id, ThreadState.RUNNING);
      state = threadManager.getThread(thread.id);
      expect(state?.state).toBe(ThreadState.RUNNING);

      // Blocked
      threadManager.setThreadState(thread.id, ThreadState.BLOCKED);
      state = threadManager.getThread(thread.id);
      expect(state?.state).toBe(ThreadState.BLOCKED);

      // Ready
      threadManager.unblock(thread.id);
      state = threadManager.getThread(thread.id);
      expect(state?.state).toBe(ThreadState.READY);
    });

    it('should demonstrate thread termination', () => {
      const thread = threadManager.createThread(context1);
      threadManager.terminate(thread.id);

      const state = threadManager.getThread(thread.id);
      expect(state?.state).toBe(ThreadState.TERMINATED);
    });
  });

  describe('Thread Communication', () => {
    it('should demonstrate separate context stacks', () => {
      const stack1 = context1.getStack();
      const stack2 = context2.getStack();
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      // Each thread has its own stack
      stack1.push(100);
      stack2.push(200);

      expect(stack1.getSize()).toBe(1);
      expect(stack2.getSize()).toBe(1);
      expect(stack1.peek()).toBe(100);
      expect(stack2.peek()).toBe(200);
    });

    it('should demonstrate separate context heaps', () => {
      const heap1 = context1.getHeap();
      const heap2 = context2.getHeap();
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      // Each thread can allocate from its own heap
      const alloc1 = heap1.allocate(16);
      const alloc2 = heap2.allocate(16);

      // Both allocations should succeed
      expect(alloc1.size).toBe(16);
      expect(alloc2.size).toBe(16);
    });
  });

  describe('Thread Pool', () => {
    it('should demonstrate thread pool pattern', () => {
      const poolSize = 5;
      const threads = [];
      const contexts: ExecutionContext[] = [];

      for (let i = 0; i < poolSize; i++) {
        const ctx = new ExecutionContext();
        contexts.push(ctx);
        const thread = threadManager.createThread(ctx);
        threads.push(thread);
      }

      expect(threads.length).toBe(poolSize);

      // Clean up
      for (const thread of threads) {
        threadManager.deleteThread(thread.id);
      }
    });

    it('should demonstrate work distribution', () => {
      const workers = [];
      const contexts: ExecutionContext[] = [];
      const workItems = [10, 20, 30, 40, 50];

      for (let i = 0; i < workItems.length; i++) {
        const ctx = new ExecutionContext();
        contexts.push(ctx);
        const thread = threadManager.createThread(ctx);
        workers.push(thread);
      }

      expect(workers.length).toBe(workItems.length);
    });
  });

  describe('Thread Safety', () => {
    it('should demonstrate concurrent stack operations', () => {
      const stack1 = context1.getStack();
      const stack2 = context2.getStack();
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      // Simulate concurrent operations on separate stacks
      for (let i = 0; i < 10; i++) {
        stack1.push(i);
        stack2.push(i + 100);
      }

      expect(stack1.getSize()).toBe(10);
      expect(stack2.getSize()).toBe(10);
    });

    it('should demonstrate concurrent heap allocations', () => {
      const heap1 = context1.getHeap();
      const heap2 = context2.getHeap();
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      const addresses1: number[] = [];
      const addresses2: number[] = [];

      for (let i = 0; i < 10; i++) {
        addresses1.push(heap1.allocate(8).address);
        addresses2.push(heap2.allocate(8).address);
      }

      // All addresses within each heap should be unique
      const unique1 = new Set(addresses1);
      const unique2 = new Set(addresses2);
      expect(unique1.size).toBe(addresses1.length);
      expect(unique2.size).toBe(addresses2.length);
    });
  });

  describe('Thread Statistics', () => {
    it('should demonstrate thread statistics', () => {
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      threadManager.setThreadState(thread1.id, ThreadState.RUNNING);
      threadManager.setThreadState(thread2.id, ThreadState.READY);

      const stats = threadManager.getStatistics();
      expect(stats.threadCount).toBe(2);
      expect(stats.runningCount).toBe(1);
      expect(stats.readyCount).toBe(1);
    });

    it('should demonstrate thread count tracking', () => {
      const initialCount = threadManager.getThreadCount();

      threadManager.createThread(context1);
      threadManager.createThread(context2);

      const newCount = threadManager.getThreadCount();
      expect(newCount).toBe(initialCount + 2);
    });

    it('should demonstrate threads by state', () => {
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      threadManager.setThreadState(thread1.id, ThreadState.BLOCKED);
      threadManager.setThreadState(thread2.id, ThreadState.RUNNING);

      const blocked = threadManager.getThreadsByState(ThreadState.BLOCKED);
      const running = threadManager.getThreadsByState(ThreadState.RUNNING);

      expect(blocked.length).toBe(1);
      expect(running.length).toBe(1);
    });
  });

  describe('Scheduling Policies', () => {
    it('should demonstrate round-robin scheduling', () => {
      threadManager.setSchedulingPolicy(SchedulingPolicy.ROUND_ROBIN);
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      const scheduled = threadManager.schedule();
      expect(scheduled).toBeDefined();
    });

    it('should demonstrate FIFO scheduling', () => {
      threadManager.setSchedulingPolicy(SchedulingPolicy.FIFO);
      const thread1 = threadManager.createThread(context1);
      const thread2 = threadManager.createThread(context2);

      const scheduled = threadManager.schedule();
      expect(scheduled).toBeDefined();
      expect(scheduled?.id).toBe(thread1.id); // First created
    });

    it('should demonstrate priority scheduling', () => {
      threadManager.setSchedulingPolicy(SchedulingPolicy.PRIORITY);
      const low = threadManager.createThread(context1, 1);
      const high = threadManager.createThread(context2, 10);

      const scheduled = threadManager.schedule();
      expect(scheduled).toBeDefined();
      expect(scheduled?.priority).toBe(10);
    });
  });
});
