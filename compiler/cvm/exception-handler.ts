/**
 * Blueprint DSL CVM Exception Handler
 * 
 * Handles exceptions during bytecode execution.
 */

import { ExecutionContext } from './execution-context';
import { ExceptionTableManager, ExceptionHandler as ExceptionHandlerEntry } from '../cbs/exception-table';

export interface ExceptionInfo {
  type: string;
  message: string;
  address: number;
  stackTrace: string[];
}

export class ExceptionHandler {
  private context: ExecutionContext;
  private exceptionTable: ExceptionTableManager;
  private currentException: ExceptionInfo | null = null;
  private inExceptionHandler: boolean = false;

  constructor(context: ExecutionContext) {
    this.context = context;
    this.exceptionTable = new ExceptionTableManager();
  }

  /**
   * Throw exception
   */
  public throw(type: string, message: string): void {
    if (this.inExceptionHandler) {
      // Double exception - halt execution
      this.context.halt();
      return;
    }

    const exception: ExceptionInfo = {
      type,
      message,
      address: this.context.getProgramCounter(),
      stackTrace: this.getStackTrace(),
    };

    this.currentException = exception;

    // Find exception handler
    const handler = this.findHandler(type, exception.address);

    if (handler) {
      this.inExceptionHandler = true;
      this.context.setProgramCounter(handler.handlerAddress);
    } else {
      // Unhandled exception - halt execution
      this.context.halt();
    }
  }

  /**
   * Find exception handler for address and type
   */
  private findHandler(type: string, address: number): ExceptionHandlerEntry | null {
    const handlers = this.exceptionTable.getAllHandlers();

    for (const handler of handlers) {
      if (address >= handler.startAddress && address < handler.endAddress) {
        // Check type match
        if (!handler.catchType || handler.catchType === type || handler.catchType === '*') {
          return handler;
        }
      }
    }

    return null;
  }

  /**
   * Get current exception
   */
  public getCurrentException(): ExceptionInfo | null {
    return this.currentException;
  }

  /**
   * Clear current exception
   */
  public clearException(): void {
    this.currentException = null;
    this.inExceptionHandler = false;
  }

  /**
   * Get stack trace
   */
  private getStackTrace(): string[] {
    return this.context.getCallFrames().getStackTrace();
  }

  /**
   * Add exception handler
   */
  public addHandler(handler: ExceptionHandlerEntry): void {
    this.exceptionTable.addHandler(handler);
  }

  /**
   * Remove exception handler
   */
  public removeHandler(index: number): void {
    this.exceptionTable.removeHandler(index);
  }

  /**
   * Get exception table
   */
  public getExceptionTable(): ExceptionTableManager {
    return this.exceptionTable;
  }

  /**
   * Set exception table
   */
  public setExceptionTable(table: ExceptionTableManager): void {
    this.exceptionTable = table;
  }

  /**
   * Check if in exception handler
   */
  public isInExceptionHandler(): boolean {
    return this.inExceptionHandler;
  }

  /**
   * Exit exception handler
   */
  public exitExceptionHandler(): void {
    this.inExceptionHandler = false;
    this.clearException();
  }

  /**
   * Validate exception handler state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const tableValidation = this.exceptionTable.validate();
    errors.push(...tableValidation.errors);

    if (this.inExceptionHandler && !this.currentException) {
      errors.push('In exception handler but no current exception');
    }

    if (!this.inExceptionHandler && this.currentException) {
      errors.push('Current exception but not in handler');
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
    inHandler: boolean;
    hasException: boolean;
  } {
    const tableStats = this.exceptionTable.getStatistics();

    return {
      handlerCount: tableStats.handlerCount,
      inHandler: this.inExceptionHandler,
      hasException: this.currentException !== null,
    };
  }

  /**
   * Set execution context
   */
  public setContext(context: ExecutionContext): void {
    this.context = context;
  }

  /**
   * Get execution context
   */
  public getContext(): ExecutionContext {
    return this.context;
  }
}
