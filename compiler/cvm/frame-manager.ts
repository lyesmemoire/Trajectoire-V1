/**
 * Blueprint DSL CVM Frame Manager
 * 
 * Manages stack frames for function calls and returns.
 */

import { Stack } from '../cbs/stack';
import { CallFrame, CallFrameManager } from '../cbs/call-frames';

export interface FrameManagerOptions {
  maxFrames?: number;
  frameSize?: number;
}

export class FrameManager {
  private stack: Stack;
  private callFrames: CallFrameManager;
  private maxFrames: number;
  private frameSize: number;

  constructor(stack: Stack, options: FrameManagerOptions = {}) {
    this.stack = stack;
    this.callFrames = new CallFrameManager();
    this.maxFrames = options.maxFrames || 1024;
    this.frameSize = options.frameSize || 4096;
  }

  /**
   * Create a new frame
   */
  public createFrame(returnAddress: number, functionName?: string): CallFrame {
    if (this.callFrames.getFrameCount() >= this.maxFrames) {
      throw new Error('Maximum frame depth exceeded');
    }

    const basePointer = this.stack.getSize();
    this.stack.pushFrame();

    const frame = this.callFrames.createFrame(returnAddress, basePointer, this.stack.getSize(), functionName);

    // Allocate space for locals
    for (let i = 0; i < this.frameSize; i++) {
      this.stack.push(0);
    }

    return frame;
  }

  /**
   * Pop current frame
   */
  public popFrame(): CallFrame | null {
    const frame = this.callFrames.popFrame();

    if (frame) {
      this.stack.popFrame();
    }

    return frame;
  }

  /**
   * Get current frame
   */
  public getCurrentFrame(): CallFrame | null {
    return this.callFrames.getCurrentFrame();
  }

  /**
   * Get frame by index
   */
  public getFrame(index: number): CallFrame | null {
    return this.callFrames.getFrameByIndex(index);
  }

  /**
   * Get frame by id
   */
  public getFrameById(id: number): CallFrame | null {
    return this.callFrames.getFrameById(id);
  }

  /**
   * Get all frames
   */
  public getAllFrames(): CallFrame[] {
    return this.callFrames.getAllFrames();
  }

  /**
   * Get frame count
   */
  public getFrameCount(): number {
    return this.callFrames.getFrameCount();
  }

  /**
   * Set parameter in current frame
   */
  public setParameter(index: number, value: number): void {
    const frame = this.getCurrentFrame();
    if (!frame) {
      throw new Error('No current frame');
    }

    const offset = frame.basePointer + index;
    this.stack.setFrameLocal(index, value);
  }

  /**
   * Get parameter from current frame
   */
  public getParameter(index: number): number {
    const frame = this.getCurrentFrame();
    if (!frame) {
      throw new Error('No current frame');
    }

    return this.callFrames.getParameter(index);
  }

  /**
   * Set local variable in current frame
   */
  public setLocal(name: string, value: number): void {
    const frame = this.getCurrentFrame();
    if (!frame) {
      throw new Error('No current frame');
    }

    this.callFrames.setLocal(name, value);
  }

  /**
   * Get local variable from current frame
   */
  public getLocal(name: string): number {
    const frame = this.getCurrentFrame();
    if (!frame) {
      throw new Error('No current frame');
    }

    return this.callFrames.getLocal(name);
  }

  /**
   * Get local variable from chain
   */
  public getLocalFromChain(name: string): number {
    return this.callFrames.getLocalFromChain(name);
  }

  /**
   * Get stack trace
   */
  public getStackTrace(): string[] {
    return this.callFrames.getStackTrace();
  }

  /**
   * Clear all frames
   */
  public clear(): void {
    this.callFrames.clear();
    this.stack.clear();
  }

  /**
   * Validate frame manager state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const callFrameValidation = this.callFrames.validate();
    errors.push(...callFrameValidation.errors);

    if (this.callFrames.getFrameCount() > this.maxFrames) {
      errors.push('Frame count exceeds maximum');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    frameCount: number;
    maxDepth: number;
    currentDepth: number;
    totalParameters: number;
    totalLocals: number;
    stackUtilization: number;
  } {
    const callFrameStats = this.callFrames.getStatistics();
    const stackStats = this.stack.getStatistics();

    return {
      frameCount: callFrameStats.frameCount,
      maxDepth: this.maxFrames,
      currentDepth: callFrameStats.frameCount,
      totalParameters: callFrameStats.totalParameters,
      totalLocals: callFrameStats.totalLocals,
      stackUtilization: stackStats.utilization,
    };
  }

  /**
   * Set max frames
   */
  public setMaxFrames(max: number): void {
    this.maxFrames = max;
  }

  /**
   * Set frame size
   */
  public setFrameSize(size: number): void {
    this.frameSize = size;
  }

  /**
   * Get stack
   */
  public getStack(): Stack {
    return this.stack;
  }

  /**
   * Get call frames
   */
  public getCallFrames(): CallFrameManager {
    return this.callFrames;
  }
}
