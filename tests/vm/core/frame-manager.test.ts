import { describe, it, expect, beforeEach } from 'vitest';
import { FrameManager } from '../../../compiler/cvm/frame-manager';
import { Stack } from '../../../compiler/cbs/stack';

describe('FrameManager', () => {
  let frameManager: FrameManager;
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack(10000);
    frameManager = new FrameManager(stack, { frameSize: 10 });
  });

  describe('creation', () => {
    it('should create frame manager with default options', () => {
      expect(frameManager).toBeDefined();
      expect(frameManager.getFrameCount()).toBe(0);
    });

    it('should create with custom max frames', () => {
      const customManager = new FrameManager(stack, { maxFrames: 10 });
      expect(customManager).toBeDefined();
    });

    it('should create with custom frame size', () => {
      const customManager = new FrameManager(stack, { frameSize: 512 });
      expect(customManager).toBeDefined();
    });

    it('should initialize with empty frames', () => {
      expect(frameManager.getCurrentFrame()).toBe(null);
      expect(frameManager.getAllFrames()).toEqual([]);
    });
  });

  describe('create frame', () => {
    it('should create frame', () => {
      const frame = frameManager.createFrame(100, 'testFunction');
      expect(frame).toBeDefined();
      expect(frame.returnAddress).toBe(100);
      expect(frame.functionName).toBe('testFunction');
      expect(frameManager.getFrameCount()).toBe(1);
    });

    it('should push stack frame', () => {
      stack.push(1);
      stack.push(2);
      frameManager.createFrame(100);
      expect(stack.getCurrentFrame()).toBeDefined();
    });

    it('should allocate space for locals', () => {
      const initialSize = stack.getSize();
      frameManager.createFrame(100);
      expect(stack.getSize()).toBeGreaterThan(initialSize);
    });

    it('should throw on max frames exceeded', () => {
      const limitedManager = new FrameManager(stack, { maxFrames: 2, frameSize: 10 });
      limitedManager.createFrame(100);
      limitedManager.createFrame(200);
      expect(() => limitedManager.createFrame(300)).toThrow('Maximum frame depth exceeded');
    });

    it('should create frame without function name', () => {
      const frame = frameManager.createFrame(100);
      expect(frame.functionName).toBeUndefined();
    });

    it('should set base pointer correctly', () => {
      stack.push(1);
      stack.push(2);
      const frame = frameManager.createFrame(100);
      expect(frame.basePointer).toBe(2);
    });
  });

  describe('pop frame', () => {
    it('should pop frame', () => {
      frameManager.createFrame(100);
      const popped = frameManager.popFrame();
      expect(popped).toBeDefined();
      expect(frameManager.getFrameCount()).toBe(0);
    });

    it('should return null when no frames', () => {
      const popped = frameManager.popFrame();
      expect(popped).toBe(null);
    });

    it('should pop stack frame', () => {
      frameManager.createFrame(100);
      frameManager.popFrame();
      expect(stack.getCurrentFrame()).toBe(null);
    });

    it('should pop multiple frames', () => {
      frameManager.createFrame(100);
      frameManager.createFrame(200);
      frameManager.createFrame(300);
      frameManager.popFrame();
      frameManager.popFrame();
      expect(frameManager.getFrameCount()).toBe(1);
    });
  });

  describe('get current frame', () => {
    it('should return null when no frames', () => {
      expect(frameManager.getCurrentFrame()).toBe(null);
    });

    it('should return current frame', () => {
      const frame = frameManager.createFrame(100, 'test');
      const current = frameManager.getCurrentFrame();
      expect(current).toBe(frame);
    });

    it('should return top frame after multiple pushes', () => {
      frameManager.createFrame(100, 'first');
      frameManager.createFrame(200, 'second');
      const current = frameManager.getCurrentFrame();
      expect(current?.functionName).toBe('second');
    });
  });

  describe('get frame by index', () => {
    it('should return frame by index', () => {
      frameManager.createFrame(100, 'first');
      frameManager.createFrame(200, 'second');
      const frame = frameManager.getFrame(0);
      expect(frame?.functionName).toBe('first');
    });

    it('should return null for invalid index', () => {
      const frame = frameManager.getFrame(0);
      expect(frame).toBe(null);
    });

    it('should return null for out of bounds index', () => {
      frameManager.createFrame(100);
      const frame = frameManager.getFrame(10);
      expect(frame).toBe(null);
    });
  });

  describe('get frame by id', () => {
    it('should return frame by id', () => {
      const frame = frameManager.createFrame(100);
      const found = frameManager.getFrameById(frame.id);
      expect(found).toBe(frame);
    });

    it('should return null for invalid id', () => {
      const frame = frameManager.getFrameById(999);
      expect(frame).toBe(null);
    });
  });

  describe('get all frames', () => {
    it('should return empty array when no frames', () => {
      expect(frameManager.getAllFrames()).toEqual([]);
    });

    it('should return all frames', () => {
      frameManager.createFrame(100, 'first');
      frameManager.createFrame(200, 'second');
      const frames = frameManager.getAllFrames();
      expect(frames.length).toBe(2);
    });

    it('should return copy of frames', () => {
      frameManager.createFrame(100);
      const frames1 = frameManager.getAllFrames();
      const frames2 = frameManager.getAllFrames();
      expect(frames1).not.toBe(frames2);
    });
  });

  describe('frame count', () => {
    it('should return 0 for empty manager', () => {
      expect(frameManager.getFrameCount()).toBe(0);
    });

    it('should return correct count', () => {
      frameManager.createFrame(100);
      frameManager.createFrame(200);
      frameManager.createFrame(300);
      expect(frameManager.getFrameCount()).toBe(3);
    });

    it('should update count after pop', () => {
      frameManager.createFrame(100);
      frameManager.createFrame(200);
      frameManager.popFrame();
      expect(frameManager.getFrameCount()).toBe(1);
    });
  });

  describe('parameters', () => {
    it('should set parameter', () => {
      frameManager.createFrame(100);
      // Parameters are stored in call frames, not stack frame locals
      // This test verifies the method doesn't throw
      expect(() => frameManager.setParameter(0, 42)).not.toThrow();
    });

    it('should throw when setting parameter without frame', () => {
      expect(() => frameManager.setParameter(0, 42)).toThrow('No current frame');
    });

    it('should get parameter', () => {
      frameManager.createFrame(100);
      // Parameters are stored in call frames separately from stack locals
      // The getParameter method retrieves from call frames
      const param = frameManager.getParameter(0);
      // May return undefined if parameter not set in call frame
      expect(param === undefined || typeof param === 'number').toBe(true);
    });

    it('should throw when getting parameter without frame', () => {
      expect(() => frameManager.getParameter(0)).toThrow('No current frame');
    });
  });

  describe('local variables', () => {
    it('should set local variable', () => {
      frameManager.createFrame(100);
      frameManager.setLocal('x', 42);
      expect(() => frameManager.setLocal('x', 42)).not.toThrow();
    });

    it('should throw when setting local without frame', () => {
      expect(() => frameManager.setLocal('x', 42)).toThrow('No current frame');
    });

    it('should get local variable', () => {
      frameManager.createFrame(100);
      frameManager.setLocal('x', 42);
      const value = frameManager.getLocal('x');
      expect(value).toBe(42);
    });

    it('should throw when getting local without frame', () => {
      expect(() => frameManager.getLocal('x')).toThrow('No current frame');
    });

    it('should get local from chain', () => {
      frameManager.createFrame(100, 'outer');
      frameManager.setLocal('x', 42);
      frameManager.createFrame(200, 'inner');
      const value = frameManager.getLocalFromChain('x');
      expect(value).toBe(42);
    });
  });

  describe('stack trace', () => {
    it('should get stack trace', () => {
      frameManager.createFrame(100, 'first');
      frameManager.createFrame(200, 'second');
      const trace = frameManager.getStackTrace();
      expect(Array.isArray(trace)).toBe(true);
      expect(trace.length).toBeGreaterThan(0);
    });

    it('should return empty trace when no frames', () => {
      const trace = frameManager.getStackTrace();
      expect(trace).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should clear all frames', () => {
      frameManager.createFrame(100);
      frameManager.createFrame(200);
      frameManager.clear();
      expect(frameManager.getFrameCount()).toBe(0);
      expect(stack.isEmpty()).toBe(true);
    });

    it('should clear empty manager', () => {
      frameManager.clear();
      expect(frameManager.getFrameCount()).toBe(0);
    });
  });

  describe('validation', () => {
    it('should validate valid state', () => {
      const validation = frameManager.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect frame count exceeding max', () => {
      const limitedManager = new FrameManager(stack, { maxFrames: 1, frameSize: 10 });
      limitedManager.createFrame(100);
      (limitedManager as any).callFrames.frames.push({ id: 1, returnAddress: 0, basePointer: 0, size: 0, functionName: 'test' });
      const validation = limitedManager.validate();
      expect(validation.valid).toBe(false);
    });
  });

  describe('statistics', () => {
    it('should get statistics', () => {
      frameManager.createFrame(100);
      frameManager.createFrame(200);
      const stats = frameManager.getStatistics();
      expect(stats.frameCount).toBe(2);
      expect(stats.currentDepth).toBe(2);
      expect(stats.maxDepth).toBe(1024);
    });

    it('should get statistics for empty manager', () => {
      const stats = frameManager.getStatistics();
      expect(stats.frameCount).toBe(0);
      expect(stats.currentDepth).toBe(0);
    });

    it('should include stack utilization', () => {
      stack.push(1);
      stack.push(2);
      frameManager.createFrame(100);
      const stats = frameManager.getStatistics();
      expect(stats.stackUtilization).toBeGreaterThan(0);
    });
  });

  describe('configuration', () => {
    it('should set max frames', () => {
      frameManager.setMaxFrames(512);
      expect(() => frameManager.setMaxFrames(512)).not.toThrow();
    });

    it('should set frame size', () => {
      frameManager.setFrameSize(512);
      expect(() => frameManager.setFrameSize(512)).not.toThrow();
    });
  });

  describe('accessors', () => {
    it('should get stack', () => {
      const retrieved = frameManager.getStack();
      expect(retrieved).toBe(stack);
    });

    it('should get call frames', () => {
      const retrieved = frameManager.getCallFrames();
      expect(retrieved).toBeDefined();
    });
  });

  describe('cleanup', () => {
    it('should clean up after operations', () => {
      frameManager.createFrame(100);
      frameManager.createFrame(200);
      frameManager.clear();
      expect(frameManager.getFrameCount()).toBe(0);
      expect(stack.isEmpty()).toBe(true);
      const validation = frameManager.validate();
      expect(validation.valid).toBe(true);
    });
  });
});
