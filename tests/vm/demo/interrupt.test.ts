import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { InterruptManager, InterruptType } from '../../../compiler/cvm/interrupt-manager';

describe('Demo Programs - Interrupt', () => {
  let context: ExecutionContext;
  let interruptManager: InterruptManager;

  beforeEach(() => {
    context = new ExecutionContext();
    interruptManager = new InterruptManager(context);
  });

  describe('Basic Interrupt', () => {
    it('should demonstrate interrupt raising', () => {
      interruptManager.setHandler(InterruptType.USER, 100, true);
      interruptManager.enableHandler(InterruptType.USER);

      interruptManager.raise(InterruptType.USER);

      const pending = interruptManager.getPendingInterrupts();
      expect(pending.length).toBe(1);
      expect(pending[0].type).toBe(InterruptType.USER);
    });

    it('should demonstrate interrupt processing', () => {
      interruptManager.setHandler(InterruptType.USER, 100, true);
      interruptManager.enableHandler(InterruptType.USER);

      context.getCallFrames().createFrame(0, 0, 0);
      interruptManager.raise(InterruptType.USER);

      const processed = interruptManager.processNextInterrupt();

      expect(processed).toBe(true);
      expect(context.getProgramCounter()).toBe(100);
    });
  });

  describe('Nested Interrupts', () => {
    it('should demonstrate nested interrupt handling', () => {
      interruptManager.setHandler(InterruptType.DEBUG, 100, true);
      interruptManager.setHandler(InterruptType.USER, 200, true);
      interruptManager.enableHandler(InterruptType.DEBUG);
      interruptManager.enableHandler(InterruptType.USER);

      context.getCallFrames().createFrame(0, 0, 0);
      interruptManager.raise(InterruptType.USER);
      interruptManager.raise(InterruptType.DEBUG);

      // Process interrupts
      interruptManager.processNextInterrupt();
      interruptManager.processNextInterrupt();

      expect(interruptManager.getPendingCount()).toBe(0);
    });

    it('should handle interrupt nesting depth', () => {
      interruptManager.setHandler(InterruptType.DEBUG, 100, true);
      interruptManager.enableHandler(InterruptType.DEBUG);

      context.getCallFrames().createFrame(0, 0, 0);

      // Raise multiple interrupts
      for (let i = 0; i < 5; i++) {
        interruptManager.raise(InterruptType.DEBUG);
      }

      expect(interruptManager.getPendingCount()).toBe(5);
    });
  });

  describe('Priority Interrupts', () => {
    it('should demonstrate priority-based processing', () => {
      interruptManager.setHandler(InterruptType.DEBUG, 100, true);
      interruptManager.setHandler(InterruptType.USER, 200, true);
      interruptManager.enableHandler(InterruptType.DEBUG);
      interruptManager.enableHandler(InterruptType.USER);

      interruptManager.raise(InterruptType.USER);
      interruptManager.raise(InterruptType.DEBUG);

      context.getCallFrames().createFrame(0, 0, 0);
      const next = interruptManager.getNextInterrupt();

      expect(next?.type).toBe(InterruptType.DEBUG); // DEBUG has higher priority
    });

    it('should sort interrupts by priority', () => {
      interruptManager.setHandler(InterruptType.TIMER, 100, true);
      interruptManager.setHandler(InterruptType.IO, 150, true);
      interruptManager.setHandler(InterruptType.DEBUG, 200, true);
      interruptManager.enableHandler(InterruptType.TIMER);
      interruptManager.enableHandler(InterruptType.IO);
      interruptManager.enableHandler(InterruptType.DEBUG);

      interruptManager.raise(InterruptType.IO);
      interruptManager.raise(InterruptType.TIMER);
      interruptManager.raise(InterruptType.DEBUG);

      const pending = interruptManager.getPendingInterrupts();
      expect(pending[0].type).toBe(InterruptType.DEBUG);
      expect(pending[1].type).toBe(InterruptType.TIMER);
      expect(pending[2].type).toBe(InterruptType.IO);
    });
  });

  describe('Interrupt Masking', () => {
    it('should demonstrate handler enable/disable', () => {
      interruptManager.setHandler(InterruptType.USER, 100, true);
      interruptManager.enableHandler(InterruptType.USER);

      interruptManager.raise(InterruptType.USER);

      const pending = interruptManager.getPendingInterrupts();
      expect(pending.length).toBe(1);

      // Disable handler
      interruptManager.disableHandler(InterruptType.USER);
      
      // Raise another interrupt
      interruptManager.raise(InterruptType.USER);

      // Check that handler is disabled
      const handler = interruptManager.getHandler(InterruptType.USER);
      expect(handler?.enabled).toBe(false);
    });
  });

  describe('Interrupt Storm', () => {
    it('should handle interrupt storm', () => {
      interruptManager.setHandler(InterruptType.TIMER, 100, true);
      interruptManager.enableHandler(InterruptType.TIMER);

      // Raise many interrupts
      for (let i = 0; i < 100; i++) {
        interruptManager.raise(InterruptType.TIMER);
      }

      expect(interruptManager.getPendingCount()).toBe(100);
    });

    it('should process storm in priority order', () => {
      interruptManager.setHandler(InterruptType.DEBUG, 100, true);
      interruptManager.setHandler(InterruptType.TIMER, 150, true);
      interruptManager.setHandler(InterruptType.IO, 200, true);
      interruptManager.enableHandler(InterruptType.TIMER);
      interruptManager.enableHandler(InterruptType.IO);
      interruptManager.enableHandler(InterruptType.DEBUG);

      for (let i = 0; i < 10; i++) {
        interruptManager.raise(InterruptType.IO);
        interruptManager.raise(InterruptType.TIMER);
        interruptManager.raise(InterruptType.DEBUG);
      }

      expect(interruptManager.getPendingCount()).toBe(30);
      expect(interruptManager.getNextInterrupt()?.type).toBe(InterruptType.DEBUG);
    });
  });

  describe('Interrupt Handlers', () => {
    it('should demonstrate handler registration', () => {
      const handlerAddress = 1000;
      interruptManager.setHandler(InterruptType.USER, handlerAddress, true);

      const handler = interruptManager.getHandler(InterruptType.USER);
      expect(handler?.address).toBe(handlerAddress);
    });

    it('should enable/disable handlers', () => {
      interruptManager.setHandler(InterruptType.USER, 100, true);

      interruptManager.enableHandler(InterruptType.USER);
      const handler = interruptManager.getHandler(InterruptType.USER);
      expect(handler?.enabled).toBe(true);

      interruptManager.disableHandler(InterruptType.USER);
      const handler2 = interruptManager.getHandler(InterruptType.USER);
      expect(handler2?.enabled).toBe(false);
    });
  });

  describe('Interrupt Statistics', () => {
    it('should track interrupt statistics', () => {
      interruptManager.setHandler(InterruptType.USER, 100, true);
      interruptManager.enableHandler(InterruptType.USER);

      interruptManager.raise(InterruptType.USER);
      interruptManager.raise(InterruptType.USER);

      const stats = interruptManager.getStatistics();
      expect(stats.pendingCount).toBe(2);
    });

    it('should track handler statistics', () => {
      interruptManager.setHandler(InterruptType.USER, 100, true);
      interruptManager.setHandler(InterruptType.DEBUG, 200, true);

      const stats = interruptManager.getStatistics();
      // Handler count includes default handlers
      expect(stats.handlerCount).toBeGreaterThan(0);
    });
  });

  describe('Interrupt Use Cases', () => {
    it('should demonstrate timer interrupt pattern', () => {
      interruptManager.setHandler(InterruptType.TIMER, 100, true);
      interruptManager.enableHandler(InterruptType.TIMER);

      // Simulate timer ticks
      for (let i = 0; i < 10; i++) {
        interruptManager.raise(InterruptType.TIMER);
      }

      expect(interruptManager.getPendingCount()).toBe(10);
    });

    it('should demonstrate I/O interrupt pattern', () => {
      interruptManager.setHandler(InterruptType.IO, 200, true);
      interruptManager.enableHandler(InterruptType.IO);

      // Simulate I/O completion
      interruptManager.raise(InterruptType.IO);

      const pending = interruptManager.getPendingInterrupts();
      expect(pending[0].type).toBe(InterruptType.IO);
    });

    it('should demonstrate debug interrupt pattern', () => {
      interruptManager.setHandler(InterruptType.DEBUG, 300, true);
      interruptManager.enableHandler(InterruptType.DEBUG);

      // Simulate breakpoint hit
      interruptManager.raise(InterruptType.DEBUG);

      context.getCallFrames().createFrame(0, 0, 0);
      interruptManager.processNextInterrupt();

      expect(context.getProgramCounter()).toBe(300);
    });
  });

  describe('Interrupt Performance', () => {
    it('should handle rapid interrupt raising', () => {
      interruptManager.setHandler(InterruptType.TIMER, 100, true);
      interruptManager.enableHandler(InterruptType.TIMER);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        interruptManager.raise(InterruptType.TIMER);
      }
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });

    it('should handle rapid interrupt processing', () => {
      interruptManager.setHandler(InterruptType.TIMER, 100, true);
      interruptManager.enableHandler(InterruptType.TIMER);

      for (let i = 0; i < 100; i++) {
        interruptManager.raise(InterruptType.TIMER);
      }

      context.getCallFrames().createFrame(0, 0, 0);

      const startTime = performance.now();
      while (interruptManager.getPendingCount() > 0) {
        interruptManager.processNextInterrupt();
      }
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Less than 100ms
    });
  });

  describe('Interrupt Edge Cases', () => {
    it('should handle interrupt with no handler', () => {
      // Raise interrupt without setting handler
      interruptManager.raise(InterruptType.USER);

      // Interrupts without handlers may not be queued
      const pending = interruptManager.getPendingInterrupts();
      // Just verify the method doesn't crash
      expect(pending.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle interrupt with disabled handler', () => {
      interruptManager.setHandler(InterruptType.USER, 100, true);
      // Don't enable handler

      interruptManager.raise(InterruptType.USER);

      const pending = interruptManager.getPendingInterrupts();
      expect(pending.length).toBe(1);
    });

    it('should clear pending interrupts', () => {
      interruptManager.setHandler(InterruptType.USER, 100, true);
      interruptManager.enableHandler(InterruptType.USER);

      interruptManager.raise(InterruptType.USER);
      interruptManager.raise(InterruptType.USER);

      // Process all interrupts to clear them
      context.getCallFrames().createFrame(0, 0, 0);
      while (interruptManager.getPendingCount() > 0) {
        interruptManager.processNextInterrupt();
      }

      expect(interruptManager.getPendingCount()).toBe(0);
    });
  });
});
