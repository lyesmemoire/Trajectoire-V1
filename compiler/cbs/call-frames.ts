/**
 * Blueprint DSL CBS Call Frames
 * 
 * Manages call frames for function calls.
 */

export interface CallFrame {
  id: number;
  returnAddress: number;
  basePointer: number;
  stackPointer: number;
  functionName?: string;
  parameters: unknown[];
  locals: Map<string, unknown>;
  parentFrameId?: number;
}

export class CallFrameManager {
  private frames: CallFrame[] = [];
  private frameCounter: number = 0;
  private currentFrame: CallFrame | null = null;

  /**
   * Create a new call frame
   */
  public createFrame(returnAddress: number, basePointer: number, stackPointer: number, functionName?: string): CallFrame {
    const frame: CallFrame = {
      id: this.frameCounter++,
      returnAddress,
      basePointer,
      stackPointer,
      functionName,
      parameters: [],
      locals: new Map(),
      parentFrameId: this.currentFrame ? this.currentFrame.id : undefined,
    };

    this.frames.push(frame);
    this.currentFrame = frame;

    return frame;
  }

  /**
   * Pop current frame
   */
  public popFrame(): CallFrame | null {
    if (!this.currentFrame) {
      return null;
    }

    const popped = this.currentFrame;
    this.frames.pop();

    if (this.frames.length > 0) {
      this.currentFrame = this.frames[this.frames.length - 1];
    } else {
      this.currentFrame = null;
    }

    return popped;
  }

  /**
   * Get current frame
   */
  public getCurrentFrame(): CallFrame | null {
    return this.currentFrame;
  }

  /**
   * Get frame by id
   */
  public getFrameById(id: number): CallFrame | null {
    return this.frames.find(f => f.id === id) || null;
  }

  /**
   * Get frame by index
   */
  public getFrameByIndex(index: number): CallFrame | null {
    return this.frames[index] || null;
  }

  /**
   * Get all frames
   */
  public getAllFrames(): CallFrame[] {
    return [...this.frames];
  }

  /**
   * Get frame count
   */
  public getFrameCount(): number {
    return this.frames.length;
  }

  /**
   * Set parameter in current frame
   */
  public setParameter(index: number, value: unknown): void {
    if (!this.currentFrame) {
      throw new Error('No current frame');
    }

    this.currentFrame.parameters[index] = value;
  }

  /**
   * Get parameter from current frame
   */
  public getParameter(index: number): unknown {
    if (!this.currentFrame) {
      throw new Error('No current frame');
    }

    return this.currentFrame.parameters[index];
  }

  /**
   * Set local variable in current frame
   */
  public setLocal(name: string, value: unknown): void {
    if (!this.currentFrame) {
      throw new Error('No current frame');
    }

    this.currentFrame.locals.set(name, value);
  }

  /**
   * Get local variable from current frame
   */
  public getLocal(name: string): unknown {
    if (!this.currentFrame) {
      throw new Error('No current frame');
    }

    return this.currentFrame.locals.get(name);
  }

  /**
   * Get local variable from any frame in the chain
   */
  public getLocalFromChain(name: string): unknown {
    let frame = this.currentFrame;

    while (frame) {
      if (frame.locals.has(name)) {
        return frame.locals.get(name);
      }

      if (frame.parentFrameId === undefined) {
        break;
      }

      frame = this.getFrameById(frame.parentFrameId);
    }

    return undefined;
  }

  /**
   * Clear all frames
   */
  public clear(): void {
    this.frames = [];
    this.currentFrame = null;
    this.frameCounter = 0;
  }

  /**
   * Get call stack trace
   */
  public getStackTrace(): string[] {
    const trace: string[] = [];
    let frame = this.currentFrame;

    while (frame) {
      const functionName = frame.functionName || '<anonymous>';
      trace.push(`at ${functionName} (frame ${frame.id})`);

      if (frame.parentFrameId === undefined) {
        break;
      }

      frame = this.getFrameById(frame.parentFrameId);
    }

    return trace.reverse();
  }

  /**
   * Validate call frames
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];

      if (frame.returnAddress < 0) {
        errors.push(`Frame ${frame.id} has invalid return address`);
      }

      if (frame.basePointer < 0) {
        errors.push(`Frame ${frame.id} has invalid base pointer`);
      }

      if (frame.stackPointer < 0) {
        errors.push(`Frame ${frame.id} has invalid stack pointer`);
      }

      if (frame.parentFrameId !== undefined) {
        const parent = this.getFrameById(frame.parentFrameId);
        if (!parent) {
          errors.push(`Frame ${frame.id} references non-existent parent ${frame.parentFrameId}`);
        }
      }
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
    totalParameters: number;
    totalLocals: number;
  } {
    const totalParameters = this.frames.reduce((sum, f) => sum + f.parameters.length, 0);
    const totalLocals = this.frames.reduce((sum, f) => sum + f.locals.size, 0);

    return {
      frameCount: this.frames.length,
      maxDepth: this.frames.length,
      totalParameters,
      totalLocals,
    };
  }
}
