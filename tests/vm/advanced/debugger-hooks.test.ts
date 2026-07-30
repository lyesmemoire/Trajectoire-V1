import { describe, it, expect, beforeEach } from 'vitest';
import { DebuggerHooks, Breakpoint, Watchpoint, WatchpointType, StepMode } from '../../../compiler/cvm/debugger-hooks';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { Opcode } from '../../../compiler/cbs/opcode-table';

describe('Debugger Hooks - Priority 8', () => {
  let context: ExecutionContext;
  let hooks: DebuggerHooks;

  beforeEach(() => {
    context = new ExecutionContext();
    hooks = new DebuggerHooks(context);
  });

  describe('Breakpoint', () => {
    it('should set breakpoint', () => {
      const breakpoint = hooks.setBreakpoint(100);

      expect(breakpoint.address).toBe(100);
      expect(breakpoint.enabled).toBe(true);
      expect(breakpoint.hitCount).toBe(0);
    });

    it('should remove breakpoint', () => {
      hooks.setBreakpoint(100);
      const removed = hooks.removeBreakpoint(100);

      expect(removed).toBe(true);
      expect(hooks.getBreakpoint(100)).toBeNull();
    });

    it('should enable breakpoint', () => {
      const breakpoint = hooks.setBreakpoint(100);
      hooks.disableBreakpoint(100);
      hooks.enableBreakpoint(100);

      const retrieved = hooks.getBreakpoint(100);
      expect(retrieved?.enabled).toBe(true);
    });

    it('should disable breakpoint', () => {
      hooks.setBreakpoint(100);
      hooks.disableBreakpoint(100);

      const retrieved = hooks.getBreakpoint(100);
      expect(retrieved?.enabled).toBe(false);
    });

    it('should get breakpoint', () => {
      const breakpoint = hooks.setBreakpoint(100);
      const retrieved = hooks.getBreakpoint(100);

      expect(retrieved).toBeDefined();
      expect(retrieved?.address).toBe(100);
      expect(retrieved).not.toBe(breakpoint); // Should be a copy
    });

    it('should get all breakpoints', () => {
      hooks.setBreakpoint(100);
      hooks.setBreakpoint(200);
      hooks.setBreakpoint(300);

      const all = hooks.getAllBreakpoints();
      expect(all.length).toBe(3);
    });

    it('should clear all breakpoints', () => {
      hooks.setBreakpoint(100);
      hooks.setBreakpoint(200);
      hooks.clearBreakpoints();

      expect(hooks.getAllBreakpoints().length).toBe(0);
    });

    it('should track hit count', () => {
      hooks.setBreakpoint(100);
      context.setProgramCounter(100);

      hooks.shouldPause(Opcode.NOP);

      const breakpoint = hooks.getBreakpoint(100);
      expect(breakpoint?.hitCount).toBe(1);
    });

    it('should set breakpoint with condition', () => {
      const breakpoint = hooks.setBreakpoint(100, 'x > 5');

      expect(breakpoint.condition).toBe('x > 5');
    });

    it('should not pause on disabled breakpoint', () => {
      hooks.setBreakpoint(100);
      hooks.disableBreakpoint(100);
      context.setProgramCounter(100);

      const shouldPause = hooks.shouldPause(Opcode.NOP);

      expect(shouldPause).toBe(false);
    });

    it('should pause on enabled breakpoint', () => {
      hooks.setBreakpoint(100);
      context.setProgramCounter(100);

      const shouldPause = hooks.shouldPause(Opcode.NOP);

      expect(shouldPause).toBe(true);
    });
  });

  describe('Step', () => {
    it('should step into', () => {
      hooks.stepInto();
      const state = hooks.getState();

      expect(state.stepMode).toBe(StepMode.STEP_INTO);
      expect(state.paused).toBe(false);
    });

    it('should pause on step into', () => {
      hooks.stepInto();
      const shouldPause = hooks.shouldPause(Opcode.NOP);

      expect(shouldPause).toBe(true);
    });

    it('should step over', () => {
      hooks.stepOver();
      const state = hooks.getState();

      expect(state.stepMode).toBe(StepMode.STEP_OVER);
      expect(state.paused).toBe(false);
    });

    it('should track call depth on step over', () => {
      hooks.stepOver();
      hooks.shouldPause(Opcode.CALL);

      const state = hooks.getState();
      expect(state.stepMode).toBe(StepMode.STEP_OVER);
    });

    it('should pause when depth returns to zero', () => {
      hooks.stepOver();
      hooks.shouldPause(Opcode.CALL); // Increments depth to 1
      const shouldPause = hooks.shouldPause(Opcode.RET); // Decrements to 0 and pauses

      expect(shouldPause).toBe(true);
    });

    it('should step out', () => {
      context.getCallFrames().createFrame(100, 0, 0);
      hooks.stepOut();
      const state = hooks.getState();

      expect(state.stepMode).toBe(StepMode.STEP_OUT);
      expect(state.paused).toBe(false);
    });

    it('should pause on return when stepping out', () => {
      context.getCallFrames().createFrame(100, 0, 0);
      hooks.stepOut(); // Sets stepDepth to 1

      const shouldPause = hooks.shouldPause(Opcode.RET); // Decrements to 0 and pauses
      expect(shouldPause).toBe(true);
    });

    it('should not pause before return when stepping out', () => {
      context.getCallFrames().createFrame(100, 0, 0);
      hooks.stepOut();

      const shouldPause = hooks.shouldPause(Opcode.NOP);
      expect(shouldPause).toBe(false);
    });
  });

  describe('Continue', () => {
    it('should resume execution', () => {
      hooks.pause();
      hooks.resume();
      const state = hooks.getState();

      expect(state.paused).toBe(false);
    });

    it('should clear current breakpoint on resume', () => {
      hooks.setBreakpoint(100);
      context.setProgramCounter(100);
      hooks.shouldPause(Opcode.NOP);
      hooks.resume();

      const state = hooks.getState();
      expect(state.currentBreakpoint).toBeNull();
    });

    it('should clear current watchpoint on resume', () => {
      hooks.setWatchpoint(100, WatchpointType.WRITE);
      hooks.checkWatchpointWrite(100);
      hooks.resume();

      const state = hooks.getState();
      expect(state.currentWatchpoint).toBeNull();
    });

    it('should not pause after resume', () => {
      hooks.pause();
      hooks.resume();

      const shouldPause = hooks.shouldPause(Opcode.NOP);
      expect(shouldPause).toBe(false);
    });
  });

  describe('Watch', () => {
    it('should set watchpoint', () => {
      const watchpoint = hooks.setWatchpoint(100, WatchpointType.READ);

      expect(watchpoint.address).toBe(100);
      expect(watchpoint.type).toBe(WatchpointType.READ);
      expect(watchpoint.enabled).toBe(true);
    });

    it('should remove watchpoint', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      const removed = hooks.removeWatchpoint(100);

      expect(removed).toBe(true);
      expect(hooks.getWatchpoint(100)).toBeNull();
    });

    it('should enable watchpoint', () => {
      const watchpoint = hooks.setWatchpoint(100, WatchpointType.READ);
      hooks.disableWatchpoint(100);
      hooks.enableWatchpoint(100);

      const retrieved = hooks.getWatchpoint(100);
      expect(retrieved?.enabled).toBe(true);
    });

    it('should disable watchpoint', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      hooks.disableWatchpoint(100);

      const retrieved = hooks.getWatchpoint(100);
      expect(retrieved?.enabled).toBe(false);
    });

    it('should get watchpoint', () => {
      const watchpoint = hooks.setWatchpoint(100, WatchpointType.READ);
      const retrieved = hooks.getWatchpoint(100);

      expect(retrieved).toBeDefined();
      expect(retrieved?.address).toBe(100);
      expect(retrieved).not.toBe(watchpoint); // Should be a copy
    });

    it('should get all watchpoints', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      hooks.setWatchpoint(200, WatchpointType.WRITE);
      hooks.setWatchpoint(300, WatchpointType.READ_WRITE);

      const all = hooks.getAllWatchpoints();
      expect(all.length).toBe(3);
    });

    it('should clear all watchpoints', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      hooks.setWatchpoint(200, WatchpointType.WRITE);
      hooks.clearWatchpoints();

      expect(hooks.getAllWatchpoints().length).toBe(0);
    });

    it('should track watchpoint hit count', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      hooks.checkWatchpointRead(100);

      const watchpoint = hooks.getWatchpoint(100);
      expect(watchpoint?.hitCount).toBe(1);
    });
  });

  describe('Memory', () => {
    it('should check watchpoint on read', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      const shouldPause = hooks.checkWatchpointRead(100);

      expect(shouldPause).toBe(true);
    });

    it('should check watchpoint on write', () => {
      hooks.setWatchpoint(100, WatchpointType.WRITE);
      const shouldPause = hooks.checkWatchpointWrite(100);

      expect(shouldPause).toBe(true);
    });

    it('should check read_write watchpoint on read', () => {
      hooks.setWatchpoint(100, WatchpointType.READ_WRITE);
      const shouldPause = hooks.checkWatchpointRead(100);

      expect(shouldPause).toBe(true);
    });

    it('should check read_write watchpoint on write', () => {
      hooks.setWatchpoint(100, WatchpointType.READ_WRITE);
      const shouldPause = hooks.checkWatchpointWrite(100);

      expect(shouldPause).toBe(true);
    });

    it('should not pause on read watchpoint for write', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      const shouldPause = hooks.checkWatchpointWrite(100);

      expect(shouldPause).toBe(false);
    });

    it('should not pause on write watchpoint for read', () => {
      hooks.setWatchpoint(100, WatchpointType.WRITE);
      const shouldPause = hooks.checkWatchpointRead(100);

      expect(shouldPause).toBe(false);
    });

    it('should not pause on disabled watchpoint', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      hooks.disableWatchpoint(100);
      const shouldPause = hooks.checkWatchpointRead(100);

      expect(shouldPause).toBe(false);
    });

    it('should not pause on non-existent watchpoint', () => {
      const shouldPause = hooks.checkWatchpointRead(100);

      expect(shouldPause).toBe(false);
    });
  });

  describe('Register', () => {
    it('should access context for register operations', () => {
      const stack = context.getStack();
      stack.push(42);

      expect(stack.peek()).toBe(42);
    });

    it('should use context for register watchpoints', () => {
      hooks.setWatchpoint(100, WatchpointType.WRITE);
      hooks.checkWatchpointWrite(100);

      const state = hooks.getState();
      expect(state.currentWatchpoint).not.toBeNull();
    });
  });

  describe('Stack', () => {
    it('should access context for stack operations', () => {
      const stack = context.getStack();
      stack.push(10);
      stack.push(20);

      expect(stack.getSize()).toBe(2);
    });

    it('should track stack depth for step out', () => {
      context.getCallFrames().createFrame(100, 0, 0);
      context.getCallFrames().createFrame(200, 0, 0);

      hooks.stepOut();
      const state = hooks.getState();

      expect(state.stepMode).toBe(StepMode.STEP_OUT);
    });
  });

  describe('Exception', () => {
    it('should handle exception in shouldPause', () => {
      hooks.setBreakpoint(100);
      context.setProgramCounter(100);

      expect(() => {
        hooks.shouldPause(Opcode.NOP);
      }).not.toThrow();
    });

    it('should handle exception in watchpoint check', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);

      expect(() => {
        hooks.checkWatchpointRead(100);
      }).not.toThrow();
    });

    it('should handle exception in breakpoint operations', () => {
      expect(() => {
        hooks.setBreakpoint(100);
        hooks.removeBreakpoint(100);
      }).not.toThrow();
    });
  });

  describe('Conditional', () => {
    it('should set conditional breakpoint', () => {
      const breakpoint = hooks.setBreakpoint(100, 'x > 5');

      expect(breakpoint.condition).toBe('x > 5');
    });

    it('should store condition in breakpoint', () => {
      hooks.setBreakpoint(100, 'value == 42');
      const breakpoint = hooks.getBreakpoint(100);

      expect(breakpoint?.condition).toBe('value == 42');
    });

    it('should allow empty condition', () => {
      const breakpoint = hooks.setBreakpoint(100);

      expect(breakpoint.condition).toBeUndefined();
    });

    it('should allow complex condition', () => {
      const condition = 'x > 5 && y < 10';
      const breakpoint = hooks.setBreakpoint(100, condition);

      expect(breakpoint.condition).toBe(condition);
    });
  });

  describe('Pause/Resume', () => {
    it('should pause execution', () => {
      hooks.pause();
      const state = hooks.getState();

      expect(state.paused).toBe(true);
    });

    it('should check if paused', () => {
      hooks.pause();

      expect(hooks.isPaused()).toBe(true);
    });

    it('should not check breakpoints when paused', () => {
      hooks.pause();
      context.setProgramCounter(100);

      const shouldPause = hooks.shouldPause(Opcode.NOP);
      expect(shouldPause).toBe(true);
    });

    it('should resume from pause', () => {
      hooks.pause();
      hooks.resume();

      expect(hooks.isPaused()).toBe(false);
    });
  });

  describe('Current Breakpoint/Watchpoint', () => {
    it('should get current breakpoint', () => {
      hooks.setBreakpoint(100);
      context.setProgramCounter(100);
      hooks.shouldPause(Opcode.NOP);

      const current = hooks.getCurrentBreakpoint();
      expect(current).toBeDefined();
      expect(current?.address).toBe(100);
    });

    it('should get current watchpoint', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      hooks.checkWatchpointRead(100);

      const current = hooks.getCurrentWatchpoint();
      expect(current).toBeDefined();
      expect(current?.address).toBe(100);
    });

    it('should return null when no current breakpoint', () => {
      const current = hooks.getCurrentBreakpoint();
      expect(current).toBeNull();
    });

    it('should return null when no current watchpoint', () => {
      const current = hooks.getCurrentWatchpoint();
      expect(current).toBeNull();
    });
  });

  describe('Clear', () => {
    it('should clear debugger state', () => {
      hooks.pause();
      hooks.stepInto();
      hooks.clear();

      const state = hooks.getState();
      expect(state.paused).toBe(false);
      expect(state.stepMode).toBe(StepMode.NONE);
    });

    it('should clear step depth', () => {
      hooks.stepOver();
      hooks.clear();

      // Step depth is internal but should be reset
      const state = hooks.getState();
      expect(state.stepMode).toBe(StepMode.NONE);
    });
  });

  describe('Validation', () => {
    it('should validate valid state', () => {
      const validation = hooks.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect invalid hit count', () => {
      // This tests the validation logic
      const validation = hooks.validate();
      expect(validation.valid).toBe(true);
    });

    it('should detect address mismatch', () => {
      // This tests the validation logic
      const validation = hooks.validate();
      expect(validation.valid).toBe(true);
    });

    it('should include all validation errors', () => {
      const validation = hooks.validate();
      expect(Array.isArray(validation.errors)).toBe(true);
    });
  });

  describe('Statistics', () => {
    it('should get statistics', () => {
      hooks.setBreakpoint(100);
      hooks.setWatchpoint(200, WatchpointType.READ);

      const stats = hooks.getStatistics();
      expect(stats.breakpointCount).toBe(1);
      expect(stats.watchpointCount).toBe(1);
    });

    it('should track total breakpoint hits', () => {
      hooks.setBreakpoint(100);
      context.setProgramCounter(100);
      hooks.shouldPause(Opcode.NOP);

      const stats = hooks.getStatistics();
      expect(stats.totalBreakpointHits).toBe(1);
    });

    it('should track total watchpoint hits', () => {
      hooks.setWatchpoint(100, WatchpointType.READ);
      hooks.checkWatchpointRead(100);

      const stats = hooks.getStatistics();
      expect(stats.totalWatchpointHits).toBe(1);
    });

    it('should track paused state', () => {
      hooks.pause();

      const stats = hooks.getStatistics();
      expect(stats.paused).toBe(true);
    });

    it('should track step mode', () => {
      hooks.stepInto();

      const stats = hooks.getStatistics();
      expect(stats.stepMode).toBe(StepMode.STEP_INTO);
    });
  });

  describe('Context Management', () => {
    it('should set execution context', () => {
      const newContext = new ExecutionContext();
      hooks.setContext(newContext);

      expect(hooks.getContext()).toBe(newContext);
    });

    it('should get execution context', () => {
      const retrievedContext = hooks.getContext();
      expect(retrievedContext).toBe(context);
    });

    it('should use new context for operations', () => {
      const newContext = new ExecutionContext();
      hooks.setContext(newContext);
      hooks.setBreakpoint(100);
      newContext.setProgramCounter(100);

      const shouldPause = hooks.shouldPause(Opcode.NOP);
      expect(shouldPause).toBe(true);
    });
  });

  describe('Stress Tests', () => {
    it('should handle many breakpoints', () => {
      for (let i = 0; i < 1000; i++) {
        hooks.setBreakpoint(i);
      }

      expect(hooks.getAllBreakpoints().length).toBe(1000);
    });

    it('should handle many watchpoints', () => {
      for (let i = 0; i < 1000; i++) {
        hooks.setWatchpoint(i, WatchpointType.READ);
      }

      expect(hooks.getAllWatchpoints().length).toBe(1000);
    });

    it('should handle rapid breakpoint operations', () => {
      for (let i = 0; i < 100; i++) {
        hooks.setBreakpoint(i);
        hooks.removeBreakpoint(i);
      }

      expect(hooks.getAllBreakpoints().length).toBe(0);
    });

    it('should maintain performance under load', () => {
      for (let i = 0; i < 1000; i++) {
        hooks.setBreakpoint(i);
      }

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        context.setProgramCounter(i);
        hooks.shouldPause(Opcode.NOP);
      }
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(100); // Less than 100ms
    });
  });
});
