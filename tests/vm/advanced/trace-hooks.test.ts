import { describe, it, expect, beforeEach } from 'vitest';
import { TraceHooks, TraceEventType } from '../../../compiler/cvm/trace-hooks';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';
import { Opcode } from '../../../compiler/cbs/opcode-table';

describe('Trace Hooks - Priority 10', () => {
  let context: ExecutionContext;
  let hooks: TraceHooks;

  beforeEach(() => {
    context = new ExecutionContext();
    hooks = new TraceHooks(context);
  });

  describe('Instruction', () => {
    it('should trace instruction start', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.INSTRUCTION_START);
      expect(events[0].opcode).toBe(Opcode.ADD);
    });

    it('should trace instruction end', () => {
      hooks.enable();
      hooks.afterInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.INSTRUCTION_END);
      expect(events[0].opcode).toBe(Opcode.ADD);
    });

    it('should trace both start and end', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);
      hooks.afterInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events.length).toBe(2);
      expect(events[0].type).toBe(TraceEventType.INSTRUCTION_START);
      expect(events[1].type).toBe(TraceEventType.INSTRUCTION_END);
    });

    it('should not trace when disabled', () => {
      hooks.beforeInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should not trace when instruction trace disabled', () => {
      hooks.setOptions({ enableInstructionTrace: false });
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should include program counter', () => {
      context.setProgramCounter(100);
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events[0].programCounter).toBe(100);
    });

    it('should include timestamp', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events[0].timestamp).toBeGreaterThan(0);
    });
  });

  describe('Stack', () => {
    it('should trace stack operations via call/return', () => {
      hooks.enable();
      hooks.onCall(100);
      hooks.onReturn();

      const events = hooks.getEvents();
      expect(events.length).toBe(2);
      expect(events[0].type).toBe(TraceEventType.CALL);
      expect(events[1].type).toBe(TraceEventType.RETURN);
    });

    it('should include call target', () => {
      hooks.enable();
      hooks.onCall(200);

      const events = hooks.getEvents();
      expect(events[0].data).toEqual({ target: 200 });
    });

    it('should not trace call when disabled', () => {
      hooks.onCall(100);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should not trace call when call trace disabled', () => {
      hooks.setOptions({ enableCallTrace: false });
      hooks.enable();
      hooks.onCall(100);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should trace return without data', () => {
      hooks.enable();
      hooks.onReturn();

      const events = hooks.getEvents();
      expect(events[0].data).toBeUndefined();
    });
  });

  describe('Memory', () => {
    it('should trace memory read', () => {
      hooks.enable();
      hooks.onMemoryRead(100, 4);

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.MEMORY_READ);
    });

    it('should trace memory write', () => {
      hooks.enable();
      hooks.onMemoryWrite(100, 4);

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.MEMORY_WRITE);
    });

    it('should include address and size', () => {
      hooks.enable();
      hooks.onMemoryRead(200, 8);

      const events = hooks.getEvents();
      expect(events[0].data).toEqual({ address: 200, size: 8 });
    });

    it('should not trace memory when disabled', () => {
      hooks.onMemoryRead(100, 4);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should not trace memory when memory trace disabled', () => {
      hooks.setOptions({ enableMemoryTrace: false });
      hooks.enable();
      hooks.onMemoryRead(100, 4);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should trace multiple memory operations', () => {
      hooks.enable();
      hooks.onMemoryRead(100, 4);
      hooks.onMemoryWrite(200, 8);
      hooks.onMemoryRead(300, 4);

      const events = hooks.getEvents();
      expect(events.length).toBe(3);
    });
  });

  describe('Call', () => {
    it('should trace call', () => {
      hooks.enable();
      hooks.onCall(100);

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.CALL);
    });

    it('should include target address', () => {
      hooks.enable();
      hooks.onCall(500);

      const events = hooks.getEvents();
      expect(events[0].data).toEqual({ target: 500 });
    });

    it('should include program counter', () => {
      context.setProgramCounter(100);
      hooks.enable();
      hooks.onCall(200);

      const events = hooks.getEvents();
      expect(events[0].programCounter).toBe(100);
    });

    it('should trace nested calls', () => {
      hooks.enable();
      hooks.onCall(100);
      hooks.onCall(200);
      hooks.onCall(300);

      const events = hooks.getEvents();
      expect(events.length).toBe(3);
    });
  });

  describe('Branch', () => {
    it('should trace branch taken', () => {
      hooks.enable();
      hooks.onBranchTaken(100);

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.BRANCH_TAKEN);
    });

    it('should trace branch not taken', () => {
      hooks.enable();
      hooks.onBranchNotTaken();

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.BRANCH_NOT_TAKEN);
    });

    it('should include target for taken branch', () => {
      hooks.enable();
      hooks.onBranchTaken(150);

      const events = hooks.getEvents();
      expect(events[0].data).toEqual({ target: 150 });
    });

    it('should not include data for not taken branch', () => {
      hooks.enable();
      hooks.onBranchNotTaken();

      const events = hooks.getEvents();
      expect(events[0].data).toBeUndefined();
    });

    it('should not trace branch when disabled', () => {
      hooks.onBranchTaken(100);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should not trace branch when branch trace disabled', () => {
      hooks.setOptions({ enableBranchTrace: false });
      hooks.enable();
      hooks.onBranchTaken(100);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should trace alternating branches', () => {
      hooks.enable();
      hooks.onBranchTaken(100);
      hooks.onBranchNotTaken();
      hooks.onBranchTaken(200);

      const events = hooks.getEvents();
      expect(events.length).toBe(3);
      expect(events[0].type).toBe(TraceEventType.BRANCH_TAKEN);
      expect(events[1].type).toBe(TraceEventType.BRANCH_NOT_TAKEN);
      expect(events[2].type).toBe(TraceEventType.BRANCH_TAKEN);
    });
  });

  describe('IO', () => {
    it('should trace IO via memory operations', () => {
      hooks.enable();
      hooks.onMemoryRead(0x1000, 4);
      hooks.onMemoryWrite(0x1000, 4);

      const events = hooks.getEvents();
      expect(events.length).toBe(2);
      expect(events[0].type).toBe(TraceEventType.MEMORY_READ);
      expect(events[1].type).toBe(TraceEventType.MEMORY_WRITE);
    });

    it('should include IO address in data', () => {
      hooks.enable();
      hooks.onMemoryRead(0x2000, 4);

      const events = hooks.getEvents();
      expect(events[0].data).toEqual({ address: 0x2000, size: 4 });
    });

    it('should trace multiple IO operations', () => {
      hooks.enable();
      for (let i = 0; i < 10; i++) {
        hooks.onMemoryRead(0x1000 + i, 4);
      }

      const events = hooks.getEvents();
      expect(events.length).toBe(10);
    });
  });

  describe('Exception', () => {
    it('should trace exception', () => {
      hooks.enable();
      hooks.onException('RuntimeError', 'Division by zero');

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.EXCEPTION);
    });

    it('should include exception type and message', () => {
      hooks.enable();
      hooks.onException('TypeError', 'Invalid operand');

      const events = hooks.getEvents();
      expect(events[0].data).toEqual({ type: 'TypeError', message: 'Invalid operand' });
    });

    it('should not trace exception when disabled', () => {
      hooks.onException('Error', 'Test');

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should not trace exception when exception trace disabled', () => {
      hooks.setOptions({ enableExceptionTrace: false });
      hooks.enable();
      hooks.onException('Error', 'Test');

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should trace multiple exceptions', () => {
      hooks.enable();
      hooks.onException('Error1', 'Message1');
      hooks.onException('Error2', 'Message2');

      const events = hooks.getEvents();
      expect(events.length).toBe(2);
    });

    it('should include program counter on exception', () => {
      context.setProgramCounter(100);
      hooks.enable();
      hooks.onException('Error', 'Test');

      const events = hooks.getEvents();
      expect(events[0].programCounter).toBe(100);
    });
  });

  describe('Rollback', () => {
    it('should trace interrupt for rollback', () => {
      hooks.enable();
      hooks.onInterrupt('ROLLBACK');

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe(TraceEventType.INTERRUPT);
    });

    it('should include interrupt type', () => {
      hooks.enable();
      hooks.onInterrupt('ROLLBACK');

      const events = hooks.getEvents();
      expect(events[0].data).toEqual({ interruptType: 'ROLLBACK' });
    });

    it('should trace rollback sequence', () => {
      hooks.enable();
      hooks.onInterrupt('ROLLBACK_START');
      hooks.onMemoryWrite(100, 4);
      hooks.onInterrupt('ROLLBACK_END');

      const events = hooks.getEvents();
      expect(events.length).toBe(3);
      expect(events[0].type).toBe(TraceEventType.INTERRUPT);
      expect(events[1].type).toBe(TraceEventType.MEMORY_WRITE);
      expect(events[2].type).toBe(TraceEventType.INTERRUPT);
    });

    it('should include program counter on interrupt', () => {
      context.setProgramCounter(100);
      hooks.enable();
      hooks.onInterrupt('TEST');

      const events = hooks.getEvents();
      expect(events[0].programCounter).toBe(100);
    });
  });

  describe('Enable/Disable', () => {
    it('should enable tracing', () => {
      hooks.enable();

      expect(hooks.isEnabled()).toBe(true);
    });

    it('should disable tracing', () => {
      hooks.enable();
      hooks.disable();

      expect(hooks.isEnabled()).toBe(false);
    });

    it('should not add events when disabled', () => {
      hooks.beforeInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should add events when enabled', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events.length).toBe(1);
    });
  });

  describe('Event Management', () => {
    it('should get all events', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);
      hooks.beforeInstruction(Opcode.SUB);

      const events = hooks.getEvents();
      expect(events.length).toBe(2);
    });

    it('should return copy of events', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const events1 = hooks.getEvents();
      const events2 = hooks.getEvents();

      expect(events1).toEqual(events2);
      expect(events1).not.toBe(events2);
    });

    it('should get events by type', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);
      hooks.onBranchTaken(100);
      hooks.beforeInstruction(Opcode.SUB);

      const instructionEvents = hooks.getEventsByType(TraceEventType.INSTRUCTION_START);
      expect(instructionEvents.length).toBe(2);
    });

    it('should get events in time range', () => {
      hooks.enable();
      const start = performance.now();
      hooks.beforeInstruction(Opcode.ADD);
      const mid = performance.now();
      hooks.beforeInstruction(Opcode.SUB);
      const end = performance.now();

      const events = hooks.getEventsInRange(start, end);
      expect(events.length).toBe(2);
    });

    it('should clear events', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);
      hooks.clear();

      const events = hooks.getEvents();
      expect(events.length).toBe(0);
    });

    it('should get event count', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);
      hooks.beforeInstruction(Opcode.SUB);

      expect(hooks.getEventCount()).toBe(2);
    });
  });

  describe('Max Events', () => {
    it('should evict old events when max exceeded', () => {
      hooks = new TraceHooks(context, { maxEvents: 5 });
      hooks.enable();

      for (let i = 0; i < 10; i++) {
        hooks.beforeInstruction(Opcode.ADD);
      }

      expect(hooks.getEventCount()).toBe(5);
    });

    it('should respect custom max events', () => {
      hooks = new TraceHooks(context, { maxEvents: 100 });
      hooks.enable();

      for (let i = 0; i < 150; i++) {
        hooks.beforeInstruction(Opcode.ADD);
      }

      expect(hooks.getEventCount()).toBe(100);
    });
  });

  describe('Options', () => {
    it('should set options', () => {
      hooks.setOptions({ enableInstructionTrace: false });

      const options = hooks.getOptions();
      expect(options.enableInstructionTrace).toBe(false);
    });

    it('should get options', () => {
      const options = hooks.getOptions();

      expect(options.enableInstructionTrace).toBe(true);
      expect(options.enableBranchTrace).toBe(true);
      expect(options.enableCallTrace).toBe(true);
      expect(options.enableMemoryTrace).toBe(true);
      expect(options.enableExceptionTrace).toBe(true);
    });

    it('should return copy of options', () => {
      const options1 = hooks.getOptions();
      const options2 = hooks.getOptions();

      expect(options1).toEqual(options2);
      expect(options1).not.toBe(options2);
    });

    it('should merge options', () => {
      hooks.setOptions({ enableInstructionTrace: false });
      hooks.setOptions({ enableBranchTrace: false });

      const options = hooks.getOptions();
      expect(options.enableInstructionTrace).toBe(false);
      expect(options.enableBranchTrace).toBe(false);
      expect(options.enableCallTrace).toBe(true);
    });
  });

  describe('Export/Import', () => {
    it('should export trace to JSON', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const exported = hooks.export();
      const parsed = JSON.parse(exported);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
    });

    it('should import trace from JSON', () => {
      const events = [
        { type: TraceEventType.INSTRUCTION_START, timestamp: 100, programCounter: 0, opcode: Opcode.ADD },
      ];

      hooks.import(JSON.stringify(events));

      const importedEvents = hooks.getEvents();
      expect(importedEvents.length).toBe(1);
    });

    it('should export valid JSON', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const exported = hooks.export();
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it('should handle import errors gracefully', () => {
      expect(() => {
        hooks.import('invalid json');
      }).toThrow();
    });
  });

  describe('Statistics', () => {
    it('should get statistics', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);
      hooks.onBranchTaken(100);

      const stats = hooks.getStatistics();
      expect(stats.totalEvents).toBe(2);
      expect(stats.eventsByType.size).toBe(2);
    });

    it('should count events by type', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);
      hooks.beforeInstruction(Opcode.SUB);
      hooks.onBranchTaken(100);

      const stats = hooks.getStatistics();
      const instructionCount = stats.eventsByType.get(TraceEventType.INSTRUCTION_START);
      expect(instructionCount).toBe(2);
    });

    it('should calculate time range', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);
      hooks.beforeInstruction(Opcode.SUB);

      const stats = hooks.getStatistics();
      expect(stats.timeRange.start).toBeLessThanOrEqual(stats.timeRange.end);
    });

    it('should handle empty statistics', () => {
      const stats = hooks.getStatistics();
      expect(stats.totalEvents).toBe(0);
      expect(stats.eventsByType.size).toBe(0);
      expect(stats.timeRange.start).toBe(0);
      expect(stats.timeRange.end).toBe(0);
    });
  });

  describe('Validation', () => {
    it('should validate valid state', () => {
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const validation = hooks.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect invalid program counter', () => {
      hooks.import(JSON.stringify([{ type: TraceEventType.INSTRUCTION_START, timestamp: 100, programCounter: -1, opcode: Opcode.ADD }]));

      const validation = hooks.validate();
      expect(validation.valid).toBe(false);
    });

    it('should detect invalid timestamp', () => {
      hooks.import(JSON.stringify([{ type: TraceEventType.INSTRUCTION_START, timestamp: -1, programCounter: 0, opcode: Opcode.ADD }]));

      const validation = hooks.validate();
      expect(validation.valid).toBe(false);
    });

    it('should include all validation errors', () => {
      hooks.import(JSON.stringify([
        { type: TraceEventType.INSTRUCTION_START, timestamp: -1, programCounter: -1, opcode: Opcode.ADD },
      ]));

      const validation = hooks.validate();
      expect(validation.errors.length).toBeGreaterThan(0);
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
      newContext.setProgramCounter(200);
      hooks.setContext(newContext);
      hooks.enable();
      hooks.beforeInstruction(Opcode.ADD);

      const events = hooks.getEvents();
      expect(events[0].programCounter).toBe(200);
    });
  });

  describe('Stress Tests', () => {
    it('should handle many events', () => {
      hooks.enable();
      for (let i = 0; i < 10000; i++) {
        hooks.beforeInstruction(Opcode.ADD);
      }

      expect(hooks.getEventCount()).toBe(10000);
    });

    it('should handle many event types', () => {
      hooks.enable();
      for (let i = 0; i < 1000; i++) {
        hooks.beforeInstruction(Opcode.ADD);
        hooks.onBranchTaken(100);
        hooks.onCall(200);
        hooks.onMemoryRead(300, 4);
      }

      const stats = hooks.getStatistics();
      expect(stats.totalEvents).toBe(4000);
    });

    it('should maintain performance under load', () => {
      hooks.enable();
      const startTime = performance.now();

      for (let i = 0; i < 10000; i++) {
        hooks.beforeInstruction(Opcode.ADD);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Less than 100ms
    });

    it('should handle rapid enable/disable', () => {
      for (let i = 0; i < 100; i++) {
        hooks.enable();
        hooks.beforeInstruction(Opcode.ADD);
        hooks.disable();
      }

      expect(hooks.getEventCount()).toBe(100);
    });
  });
});
