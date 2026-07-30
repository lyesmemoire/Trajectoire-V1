/**
 * Blueprint DSL CBS Exception Table
 * 
 * Manages exception handling information for bytecode.
 */

export interface ExceptionHandler {
  startAddress: number;
  endAddress: number;
  handlerAddress: number;
  type?: string;
  catchType?: string;
}

export interface ExceptionTable {
  handlers: ExceptionHandler[];
}

export class ExceptionTableManager {
  private handlers: ExceptionHandler[] = [];

  /**
   * Add an exception handler
   */
  public addHandler(handler: ExceptionHandler): void {
    this.validateHandler(handler);
    this.handlers.push(handler);
    this.sortHandlers();
  }

  /**
   * Remove an exception handler
   */
  public removeHandler(index: number): void {
    this.handlers.splice(index, 1);
  }

  /**
   * Get handler for an address
   */
  public getHandler(address: number): ExceptionHandler | null {
    for (const handler of this.handlers) {
      if (address >= handler.startAddress && address < handler.endAddress) {
        return handler;
      }
    }
    return null;
  }

  /**
   * Get all handlers
   */
  public getAllHandlers(): ExceptionHandler[] {
    return [...this.handlers];
  }

  /**
   * Get handlers by type
   */
  public getHandlersByType(type: string): ExceptionHandler[] {
    return this.handlers.filter(h => h.type === type);
  }

  /**
   * Get handlers by catch type
   */
  public getHandlersByCatchType(catchType: string): ExceptionHandler[] {
    return this.handlers.filter(h => h.catchType === catchType);
  }

  /**
   * Validate exception handler
   */
  private validateHandler(handler: ExceptionHandler): void {
    if (handler.startAddress < 0) {
      throw new Error('Start address must be non-negative');
    }

    if (handler.endAddress < handler.startAddress) {
      throw new Error('End address must be greater than start address');
    }

    if (handler.handlerAddress < 0) {
      throw new Error('Handler address must be non-negative');
    }

    // Check for overlapping handlers
    for (const existing of this.handlers) {
      if (this.handlersOverlap(handler, existing)) {
        throw new Error('Handler overlaps with existing handler');
      }
    }
  }

  /**
   * Check if two handlers overlap
   */
  private handlersOverlap(h1: ExceptionHandler, h2: ExceptionHandler): boolean {
    return !(h1.endAddress <= h2.startAddress || h1.startAddress >= h2.endAddress);
  }

  /**
   * Sort handlers by start address
   */
  private sortHandlers(): void {
    this.handlers.sort((a, b) => a.startAddress - b.startAddress);
  }

  /**
   * Clear all handlers
   */
  public clear(): void {
    this.handlers = [];
  }

  /**
   * Serialize exception table to JSON
   */
  public serialize(): string {
    const table: ExceptionTable = {
      handlers: this.handlers,
    };
    return JSON.stringify(table, null, 2);
  }

  /**
   * Deserialize exception table from JSON
   */
  public deserialize(json: string): void {
    const table: ExceptionTable = JSON.parse(json);
    this.handlers = [];

    for (const handler of table.handlers) {
      this.addHandler(handler);
    }
  }

  /**
   * Validate exception table
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i];

      if (handler.startAddress < 0) {
        errors.push(`Handler ${i} has invalid start address`);
      }

      if (handler.endAddress < handler.startAddress) {
        errors.push(`Handler ${i} has invalid end address`);
      }

      if (handler.handlerAddress < 0) {
        errors.push(`Handler ${i} has invalid handler address`);
      }

      // Check for overlaps
      for (let j = i + 1; j < this.handlers.length; j++) {
        if (this.handlersOverlap(handler, this.handlers[j])) {
          errors.push(`Handler ${i} overlaps with handler ${j}`);
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
    handlerCount: number;
    totalRange: number;
    averageRange: number;
  } {
    if (this.handlers.length === 0) {
      return {
        handlerCount: 0,
        totalRange: 0,
        averageRange: 0,
      };
    }

    const totalRange = this.handlers.reduce(
      (sum, h) => sum + (h.endAddress - h.startAddress),
      0
    );

    return {
      handlerCount: this.handlers.length,
      totalRange,
      averageRange: totalRange / this.handlers.length,
    };
  }

  /**
   * Optimize exception table by merging adjacent handlers
   */
  public optimize(): void {
    const optimized: ExceptionHandler[] = [];
    const sorted = [...this.handlers].sort((a, b) => a.startAddress - b.startAddress);

    for (const handler of sorted) {
      const last = optimized[optimized.length - 1];

      if (
        last &&
        last.endAddress === handler.startAddress &&
        last.handlerAddress === handler.handlerAddress &&
        last.type === handler.type &&
        last.catchType === handler.catchType
      ) {
        // Merge handlers
        last.endAddress = handler.endAddress;
      } else {
        optimized.push({ ...handler });
      }
    }

    this.handlers = optimized;
  }
}
