import { describe, it, expect, beforeEach } from 'vitest';
import { Stack } from '../../../compiler/cbs/stack';

describe('Stack', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack(1024);
  });

  describe('creation', () => {
    it('should create stack with default size', () => {
      const defaultStack = new Stack();
      expect(defaultStack.getMaxSize()).toBe(65536);
      expect(defaultStack.getSize()).toBe(0);
      expect(defaultStack.isEmpty()).toBe(true);
    });

    it('should create stack with custom size', () => {
      const customStack = new Stack(512);
      expect(customStack.getMaxSize()).toBe(512);
      expect(customStack.getSize()).toBe(0);
    });

    it('should initialize with empty data', () => {
      expect(stack.getData()).toEqual([]);
      expect(stack.isEmpty()).toBe(true);
    });
  });

  describe('push', () => {
    it('should push value onto stack', () => {
      stack.push(42);
      expect(stack.getSize()).toBe(1);
      expect(stack.peek()).toBe(42);
    });

    it('should push multiple values', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.getSize()).toBe(3);
      expect(stack.getData()).toEqual([1, 2, 3]);
    });

    it('should push negative values', () => {
      stack.push(-42);
      expect(stack.peek()).toBe(-42);
    });

    it('should push zero', () => {
      stack.push(0);
      expect(stack.peek()).toBe(0);
    });

    it('should throw on stack overflow', () => {
      const smallStack = new Stack(2);
      smallStack.push(1);
      smallStack.push(2);
      expect(() => smallStack.push(3)).toThrow('Stack overflow');
    });

    it('should push to max size exactly', () => {
      const smallStack = new Stack(2);
      smallStack.push(1);
      smallStack.push(2);
      expect(smallStack.getSize()).toBe(2);
      expect(() => smallStack.push(3)).toThrow();
    });
  });

  describe('pop', () => {
    it('should pop value from stack', () => {
      stack.push(42);
      const value = stack.pop();
      expect(value).toBe(42);
      expect(stack.getSize()).toBe(0);
    });

    it('should pop in LIFO order', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
    });

    it('should throw on stack underflow', () => {
      expect(() => stack.pop()).toThrow('Stack underflow');
    });

    it('should throw when popping from empty stack after pushes', () => {
      stack.push(1);
      stack.pop();
      expect(() => stack.pop()).toThrow('Stack underflow');
    });
  });

  describe('peek', () => {
    it('should peek at top value without removing', () => {
      stack.push(42);
      const value = stack.peek();
      expect(value).toBe(42);
      expect(stack.getSize()).toBe(1);
    });

    it('should peek multiple times', () => {
      stack.push(42);
      expect(stack.peek()).toBe(42);
      expect(stack.peek()).toBe(42);
      expect(stack.getSize()).toBe(1);
    });

    it('should throw on empty stack', () => {
      expect(() => stack.peek()).toThrow('Stack underflow');
    });
  });

  describe('peekAt', () => {
    it('should peek at offset from top', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.peekAt(0)).toBe(3);
      expect(stack.peekAt(1)).toBe(2);
      expect(stack.peekAt(2)).toBe(1);
    });

    it('should throw on invalid offset', () => {
      stack.push(1);
      expect(() => stack.peekAt(1)).toThrow('Invalid stack offset');
      expect(() => stack.peekAt(-1)).toThrow('Invalid stack offset');
    });

    it('should throw on empty stack', () => {
      expect(() => stack.peekAt(0)).toThrow('Invalid stack offset');
    });
  });

  describe('dup', () => {
    it('should duplicate top value', () => {
      stack.push(42);
      stack.dup();
      expect(stack.getSize()).toBe(2);
      expect(stack.peek()).toBe(42);
      expect(stack.getData()).toEqual([42, 42]);
    });

    it('should throw on empty stack', () => {
      expect(() => stack.dup()).toThrow('Stack underflow');
    });
  });

  describe('swap', () => {
    it('should swap top two values', () => {
      stack.push(1);
      stack.push(2);
      stack.swap();
      expect(stack.getData()).toEqual([2, 1]);
      expect(stack.peek()).toBe(1);
    });

    it('should throw on single value', () => {
      stack.push(1);
      expect(() => stack.swap()).toThrow('Stack underflow');
    });

    it('should throw on empty stack', () => {
      expect(() => stack.swap()).toThrow('Stack underflow');
    });
  });

  describe('pick', () => {
    it('should pick value at offset and push to top', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.pick(2);
      expect(stack.getData()).toEqual([1, 2, 3, 1]);
    });

    it('should throw on invalid offset', () => {
      stack.push(1);
      expect(() => stack.pick(1)).toThrow('Invalid stack offset');
    });
  });

  describe('roll', () => {
    it('should roll stack by offset', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.roll(2);
      expect(stack.getData()).toEqual([1, 2, 3]);
    });

    it('should throw on invalid offset', () => {
      stack.push(1);
      expect(() => stack.roll(2)).toThrow('Invalid roll offset');
      expect(() => stack.roll(-1)).toThrow('Invalid roll offset');
    });
  });

  describe('frames', () => {
    it('should push frame', () => {
      stack.push(1);
      stack.push(2);
      stack.pushFrame();
      expect(stack.getCurrentFrame()).toBeDefined();
      expect(stack.getFrameBase()).toBe(2);
    });

    it('should pop frame', () => {
      stack.push(1);
      stack.push(2);
      stack.pushFrame();
      stack.push(3);
      stack.push(4);
      const frame = stack.popFrame();
      expect(frame).toBeDefined();
      expect(stack.getData()).toEqual([1, 2]);
    });

    it('should return null when popping frame with no frames', () => {
      expect(stack.popFrame()).toBe(null);
    });

    it('should get current frame', () => {
      expect(stack.getCurrentFrame()).toBe(null);
      stack.pushFrame();
      expect(stack.getCurrentFrame()).toBeDefined();
    });

    it('should get frame base', () => {
      expect(stack.getFrameBase()).toBe(0);
      stack.push(1);
      stack.pushFrame();
      expect(stack.getFrameBase()).toBe(1);
    });

    it('should get frame local', () => {
      stack.push(1);
      stack.push(2);
      stack.pushFrame();
      stack.push(3);
      stack.push(4);
      expect(stack.getFrameLocal(0)).toBe(3);
      expect(stack.getFrameLocal(1)).toBe(4);
    });

    it('should throw on invalid frame offset', () => {
      stack.pushFrame();
      expect(() => stack.getFrameLocal(0)).toThrow('Invalid frame offset');
    });

    it('should throw on get frame local with no frame', () => {
      stack.push(1);
      expect(() => stack.getFrameLocal(0)).toThrow('No current frame');
    });

    it('should set frame local', () => {
      stack.push(1);
      stack.push(2);
      stack.pushFrame();
      stack.push(3);
      stack.setFrameLocal(0, 99);
      expect(stack.getFrameLocal(0)).toBe(99);
    });

    it('should throw on set frame local with no frame', () => {
      stack.push(1);
      expect(() => stack.setFrameLocal(0, 99)).toThrow('No current frame');
    });
  });

  describe('size', () => {
    it('should return current size', () => {
      expect(stack.getSize()).toBe(0);
      stack.push(1);
      expect(stack.getSize()).toBe(1);
      stack.push(2);
      expect(stack.getSize()).toBe(2);
    });

    it('should return max size', () => {
      expect(stack.getMaxSize()).toBe(1024);
    });

    it('should check if empty returns true when empty', () => {
      expect(stack.isEmpty()).toBe(true);
    });

    it('should check if empty returns false when not empty', () => {
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear stack', () => {
      stack.push(1);
      stack.push(2);
      stack.pushFrame();
      stack.clear();
      expect(stack.getSize()).toBe(0);
      expect(stack.isEmpty()).toBe(true);
      expect(stack.getData()).toEqual([]);
      expect(stack.getCurrentFrame()).toBe(null);
    });

    it('should clear empty stack', () => {
      stack.clear();
      expect(stack.getSize()).toBe(0);
    });
  });

  describe('data', () => {
    it('should get stack data', () => {
      stack.push(1);
      stack.push(2);
      const data = stack.getData();
      expect(data).toEqual([1, 2]);
    });

    it('should return copy of data', () => {
      stack.push(1);
      const data = stack.getData();
      data.push(2);
      expect(stack.getSize()).toBe(1);
    });
  });

  describe('snapshot', () => {
    it('should get snapshot', () => {
      stack.push(1);
      stack.push(2);
      const snapshot = stack.getSnapshot();
      expect(snapshot).toEqual([1, 2]);
    });

    it('should restore from snapshot', () => {
      stack.push(1);
      stack.push(2);
      const snapshot = stack.getSnapshot();
      stack.clear();
      stack.restoreSnapshot(snapshot);
      expect(stack.getData()).toEqual([1, 2]);
    });

    it('should restore empty snapshot', () => {
      stack.push(1);
      stack.restoreSnapshot([]);
      expect(stack.getSize()).toBe(0);
    });
  });

  describe('validate', () => {
    it('should validate valid stack', () => {
      stack.push(1);
      stack.push(2);
      const validation = stack.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect negative size', () => {
      stack.push(1);
      (stack as any).currentSize = -1;
      const validation = stack.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Stack size is negative');
    });

    it('should detect size exceeding max', () => {
      stack.push(1);
      (stack as any).currentSize = 2000;
      const validation = stack.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Stack size exceeds maximum');
    });

    it('should detect data length mismatch', () => {
      stack.push(1);
      (stack as any).currentSize = 5;
      const validation = stack.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Stack data length mismatch');
    });

    it('should detect negative frame base', () => {
      stack.pushFrame();
      (stack as any).frames[0].base = -1;
      const validation = stack.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Frame base is negative');
    });

    it('should detect frame base exceeding stack size', () => {
      stack.pushFrame();
      (stack as any).frames[0].base = 100;
      const validation = stack.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Frame base exceeds stack size');
    });

    it('should detect negative frame size', () => {
      stack.pushFrame();
      (stack as any).frames[0].size = -1;
      const validation = stack.validate();
      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Frame size is negative');
    });
  });

  describe('statistics', () => {
    it('should get statistics', () => {
      stack.push(1);
      stack.push(2);
      stack.pushFrame();
      const stats = stack.getStatistics();
      expect(stats.currentSize).toBe(2);
      expect(stats.maxSize).toBe(1024);
      expect(stats.frameCount).toBe(1);
      expect(stats.utilization).toBe(2 / 1024);
    });

    it('should get statistics for empty stack', () => {
      const stats = stack.getStatistics();
      expect(stats.currentSize).toBe(0);
      expect(stats.frameCount).toBe(0);
      expect(stats.utilization).toBe(0);
    });
  });

  describe('resize', () => {
    it('should resize stack', () => {
      stack.push(1);
      stack.push(2);
      stack.resize(2048);
      expect(stack.getMaxSize()).toBe(2048);
      expect(stack.getSize()).toBe(2);
    });

    it('should throw when resizing below current size', () => {
      stack.push(1);
      stack.push(2);
      expect(() => stack.resize(1)).toThrow('Cannot resize below current size');
    });

    it('should resize to same size', () => {
      stack.push(1);
      stack.resize(1024);
      expect(stack.getMaxSize()).toBe(1024);
    });
  });

  describe('cleanup', () => {
    it('should clean up after operations', () => {
      stack.push(1);
      stack.push(2);
      stack.pop();
      stack.clear();
      expect(stack.getSize()).toBe(0);
      expect(stack.isEmpty()).toBe(true);
      const validation = stack.validate();
      expect(validation.valid).toBe(true);
    });
  });
});
