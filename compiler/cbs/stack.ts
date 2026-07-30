/**
 * Blueprint DSL CBS Stack
 * 
 * Manages the operand stack for bytecode execution.
 */

export interface StackFrame {
  base: number;
  size: number;
}

export class Stack {
  private data: number[] = [];
  private frames: StackFrame[] = [];
  private maxSize: number;
  private currentSize: number = 0;

  constructor(maxSize: number = 65536) {
    this.maxSize = maxSize;
  }

  /**
   * Push value onto stack
   */
  public push(value: number): void {
    if (this.currentSize >= this.maxSize) {
      throw new Error('Stack overflow');
    }

    this.data.push(value);
    this.currentSize++;
  }

  /**
   * Pop value from stack
   */
  public pop(): number {
    if (this.currentSize === 0) {
      throw new Error('Stack underflow');
    }

    this.currentSize--;
    return this.data.pop()!;
  }

  /**
   * Peek at top of stack without popping
   */
  public peek(): number {
    if (this.currentSize === 0) {
      throw new Error('Stack underflow');
    }

    return this.data[this.data.length - 1];
  }

  /**
   * Peek at value at offset from top
   */
  public peekAt(offset: number): number {
    const index = this.data.length - 1 - offset;
    if (index < 0 || index >= this.data.length) {
      throw new Error('Invalid stack offset');
    }

    return this.data[index];
  }

  /**
   * Duplicate top value
   */
  public dup(): void {
    const value = this.peek();
    this.push(value);
  }

  /**
   * Swap top two values
   */
  public swap(): void {
    if (this.currentSize < 2) {
      throw new Error('Stack underflow');
    }

    const top = this.pop();
    const second = this.pop();
    this.push(top);
    this.push(second);
  }

  /**
   * Pick value at offset and push to top
   */
  public pick(offset: number): void {
    const value = this.peekAt(offset);
    this.push(value);
  }

  /**
   * Roll stack by offset
   */
  public roll(offset: number): void {
    if (offset < 0 || offset >= this.currentSize) {
      throw new Error('Invalid roll offset');
    }

    const values = this.data.splice(-offset);
    this.data.push(...values);
  }

  /**
   * Create new stack frame
   */
  public pushFrame(): void {
    const frame: StackFrame = {
      base: this.data.length,
      size: 0,
    };
    this.frames.push(frame);
  }

  /**
   * Pop stack frame
   */
  public popFrame(): StackFrame | null {
    if (this.frames.length === 0) {
      return null;
    }

    const frame = this.frames.pop()!;
    
    // Remove frame data from stack
    while (this.data.length > frame.base) {
      this.data.pop();
      this.currentSize--;
    }

    return frame;
  }

  /**
   * Get current frame
   */
  public getCurrentFrame(): StackFrame | null {
    if (this.frames.length === 0) {
      return null;
    }

    return this.frames[this.frames.length - 1];
  }

  /**
   * Get frame base
   */
  public getFrameBase(): number {
    const frame = this.getCurrentFrame();
    return frame ? frame.base : 0;
  }

  /**
   * Get value at frame-relative offset
   */
  public getFrameLocal(offset: number): number {
    const frame = this.getCurrentFrame();
    if (!frame) {
      throw new Error('No current frame');
    }

    const index = frame.base + offset;
    if (index < 0 || index >= this.data.length) {
      throw new Error('Invalid frame offset');
    }

    return this.data[index];
  }

  /**
   * Set value at frame-relative offset
   */
  public setFrameLocal(offset: number, value: number): void {
    const frame = this.getCurrentFrame();
    if (!frame) {
      throw new Error('No current frame');
    }

    const index = frame.base + offset;
    if (index < 0 || index >= this.data.length) {
      throw new Error('Invalid frame offset');
    }

    this.data[index] = value;
  }

  /**
   * Get current stack size
   */
  public getSize(): number {
    return this.currentSize;
  }

  /**
   * Get maximum stack size
   */
  public getMaxSize(): number {
    return this.maxSize;
  }

  /**
   * Check if stack is empty
   */
  public isEmpty(): boolean {
    return this.currentSize === 0;
  }

  /**
   * Clear stack
   */
  public clear(): void {
    this.data = [];
    this.frames = [];
    this.currentSize = 0;
  }

  /**
   * Get stack data
   */
  public getData(): number[] {
    return [...this.data];
  }

  /**
   * Get stack snapshot
   */
  public getSnapshot(): number[] {
    return [...this.data];
  }

  /**
   * Restore stack from snapshot
   */
  public restoreSnapshot(snapshot: number[]): void {
    this.data = [...snapshot];
    this.currentSize = this.data.length;
  }

  /**
   * Validate stack state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.currentSize < 0) {
      errors.push('Stack size is negative');
    }

    if (this.currentSize > this.maxSize) {
      errors.push('Stack size exceeds maximum');
    }

    if (this.data.length !== this.currentSize) {
      errors.push('Stack data length mismatch');
    }

    for (const frame of this.frames) {
      if (frame.base < 0) {
        errors.push('Frame base is negative');
      }

      if (frame.base > this.data.length) {
        errors.push('Frame base exceeds stack size');
      }

      if (frame.size < 0) {
        errors.push('Frame size is negative');
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
    currentSize: number;
    maxSize: number;
    frameCount: number;
    utilization: number;
  } {
    return {
      currentSize: this.currentSize,
      maxSize: this.maxSize,
      frameCount: this.frames.length,
      utilization: this.currentSize / this.maxSize,
    };
  }

  /**
   * Resize stack
   */
  public resize(newSize: number): void {
    if (newSize < this.currentSize) {
      throw new Error('Cannot resize below current size');
    }

    this.maxSize = newSize;
  }
}
