import { describe, it, expect, beforeEach } from 'vitest';
import { ExceptionHandler } from '../../../compiler/cvm/exception-handler';
import { ExecutionContext } from '../../../compiler/cvm/execution-context';

describe('ExceptionHandler', () => {
  let handler: ExceptionHandler;
  let context: ExecutionContext;

  beforeEach(() => {
    context = new ExecutionContext();
    handler = new ExceptionHandler(context);
  });

  describe('creation', () => {
    it('should create exception handler', () => {
      expect(handler).toBeDefined();
      expect(handler.getCurrentException()).toBe(null);
      expect(handler.isInExceptionHandler()).toBe(false);
    });

    it('should initialize with empty exception table', () => {
      const stats = handler.getStatistics();
      expect(stats.handlerCount).toBe(0);
    });
  });

  describe('throw exception', () => {
    it('should throw exception', () => {
      handler.throw('TestError', 'Test message');
      const exception = handler.getCurrentException();
      expect(exception).toBeDefined();
      expect(exception?.type).toBe('TestError');
      expect(exception?.message).toBe('Test message');
    });

    it('should set exception address', () => {
      context.setProgramCounter(100);
      handler.throw('TestError', 'Test message');
      const exception = handler.getCurrentException();
      expect(exception?.address).toBe(100);
    });

    it('should capture stack trace', () => {
      context.getCallFrames().createFrame(0, 0, 0);
      handler.throw('TestError', 'Test message');
      const exception = handler.getCurrentException();
      expect(exception?.stackTrace).toBeDefined();
      expect(Array.isArray(exception?.stackTrace)).toBe(true);
    });

    it('should halt on unhandled exception', () => {
      handler.throw('UnhandledError', 'No handler');
      expect(context.isHalted()).toBe(true);
    });

    it('should handle double exception by halting', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('TestError', 'First');
      expect(handler.isInExceptionHandler()).toBe(true);
      handler.throw('DoubleError', 'Second');
      expect(context.isHalted()).toBe(true);
    });
  });

  describe('exception handlers', () => {
    it('should add exception handler', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      const stats = handler.getStatistics();
      expect(stats.handlerCount).toBe(1);
    });

    it('should remove exception handler', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      handler.removeHandler(0);
      const stats = handler.getStatistics();
      expect(stats.handlerCount).toBe(0);
    });

    it('should find matching handler', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('TestError', 'Test message');
      expect(context.getProgramCounter()).toBe(50);
      expect(handler.isInExceptionHandler()).toBe(true);
    });

    it('should match wildcard handler', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: '*',
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('AnyError', 'Test message');
      expect(context.getProgramCounter()).toBe(50);
    });

    it('should not match handler outside address range', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      context.setProgramCounter(200);
      handler.throw('TestError', 'Test message');
      expect(context.isHalted()).toBe(true);
    });

    it('should not match handler with different type', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'OtherError',
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('TestError', 'Test message');
      expect(context.isHalted()).toBe(true);
    });

    it('should match handler with null catchType', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: undefined,
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('TestError', 'Test message');
      expect(context.getProgramCounter()).toBe(50);
    });
  });

  describe('current exception', () => {
    it('should get current exception', () => {
      handler.throw('TestError', 'Test message');
      const exception = handler.getCurrentException();
      expect(exception).toBeDefined();
      expect(exception?.type).toBe('TestError');
    });

    it('should return null when no exception', () => {
      const exception = handler.getCurrentException();
      expect(exception).toBe(null);
    });

    it('should clear current exception', () => {
      handler.throw('TestError', 'Test message');
      handler.clearException();
      expect(handler.getCurrentException()).toBe(null);
      expect(handler.isInExceptionHandler()).toBe(false);
    });
  });

  describe('exception handler state', () => {
    it('should check if in exception handler', () => {
      expect(handler.isInExceptionHandler()).toBe(false);
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('TestError', 'Test message');
      expect(handler.isInExceptionHandler()).toBe(true);
    });

    it('should exit exception handler', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('TestError', 'Test message');
      handler.exitExceptionHandler();
      expect(handler.isInExceptionHandler()).toBe(false);
      expect(handler.getCurrentException()).toBe(null);
    });
  });

  describe('exception table', () => {
    it('should get exception table', () => {
      const table = handler.getExceptionTable();
      expect(table).toBeDefined();
    });

    it('should set exception table', () => {
      const newTable = handler.getExceptionTable();
      handler.setExceptionTable(newTable);
      expect(handler.getExceptionTable()).toBe(newTable);
    });
  });

  describe('validation', () => {
    it('should validate valid state', () => {
      const validation = handler.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect in handler without exception', () => {
      (handler as any).inExceptionHandler = true;
      const validation = handler.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('In exception handler but no current exception');
    });

    it('should detect exception without being in handler', () => {
      (handler as any).currentException = { type: 'Test', message: 'Test', address: 0, stackTrace: [] };
      const validation = handler.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Current exception but not in handler');
    });
  });

  describe('statistics', () => {
    it('should get statistics', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      const stats = handler.getStatistics();
      expect(stats.handlerCount).toBe(1);
      expect(stats.inHandler).toBe(false);
      expect(stats.hasException).toBe(false);
    });

    it('should report in handler state', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('TestError', 'Test message');
      const stats = handler.getStatistics();
      expect(stats.inHandler).toBe(true);
      expect(stats.hasException).toBe(true);
    });
  });

  describe('context management', () => {
    it('should set context', () => {
      const newContext = new ExecutionContext();
      handler.setContext(newContext);
      expect(handler.getContext()).toBe(newContext);
    });

    it('should get context', () => {
      const retrieved = handler.getContext();
      expect(retrieved).toBe(context);
    });
  });

  describe('cleanup', () => {
    it('should clean up after operations', () => {
      handler.addHandler({
        startAddress: 0,
        endAddress: 100,
        catchType: 'TestError',
        handlerAddress: 50,
      });
      context.setProgramCounter(10);
      handler.throw('TestError', 'Test message');
      handler.exitExceptionHandler();
      handler.clearException();
      expect(handler.getCurrentException()).toBe(null);
      expect(handler.isInExceptionHandler()).toBe(false);
      const validation = handler.validate();
      expect(validation.valid).toBe(true);
    });
  });
});
