import { Injectable, Logger } from '@nestjs/common';

export interface RollbackOperation {
  id: string;
  operation: () => Promise<any>;
  rollback: () => Promise<void>;
  state: 'pending' | 'completed' | 'rolled-back' | 'failed';
  timestamp: Date;
  error?: Error;
}

@Injectable()
export class RollbackService {
  private readonly logger = new Logger(RollbackService.name);
  private operations = new Map<string, RollbackOperation>();

  async executeWithRollback<T>(
    operation: () => Promise<T>,
    rollback: () => Promise<void>,
    operationId?: string,
  ): Promise<T> {
    const id = operationId || this.generateId();
    
    const rollbackOp: RollbackOperation = {
      id,
      operation,
      rollback,
      state: 'pending',
      timestamp: new Date(),
    };

    this.operations.set(id, rollbackOp);

    try {
      const result = await operation();
      rollbackOp.state = 'completed';
      this.logger.log(`Operation ${id} completed successfully`);
      return result;
    } catch (error) {
      rollbackOp.state = 'failed';
      rollbackOp.error = error as Error;
      this.logger.error(`Operation ${id} failed, initiating rollback: ${error}`);
      
      await this.executeRollback(id);
      throw error;
    }
  }

  async executeRollback(operationId: string): Promise<void> {
    const operation = this.operations.get(operationId);
    if (!operation) {
      throw new Error(`Rollback operation ${operationId} not found`);
    }

    if (operation.state === 'rolled-back') {
      this.logger.warn(`Operation ${operationId} already rolled back`);
      return;
    }

    try {
      await operation.rollback();
      operation.state = 'rolled-back';
      this.logger.log(`Rollback for operation ${operationId} completed successfully`);
    } catch (error) {
      this.logger.error(`Rollback for operation ${operationId} failed: ${error}`);
      operation.state = 'failed';
      throw error;
    }
  }

  async executeWithTransaction<T>(
    operations: Array<{
      operation: () => Promise<any>;
      rollback: () => Promise<void>;
    }>,
  ): Promise<T[]> {
    const operationIds: string[] = [];
    const results: T[] = [];

    try {
      for (const op of operations) {
        const id = this.generateId();
        operationIds.push(id);
        
        const result = await this.executeWithRollback(
          op.operation,
          op.rollback,
          id,
        );
        results.push(result);
      }

      return results;
    } catch (error) {
      this.logger.error(`Transaction failed, rolling back all operations`);
      
      // Rollback in reverse order
      for (const id of [...operationIds].reverse()) {
        try {
          await this.executeRollback(id);
        } catch (rollbackError) {
          this.logger.error(`Rollback failed for operation ${id}: ${rollbackError}`);
        }
      }
      
      throw error;
    }
  }

  getOperationState(operationId: string): RollbackOperation | undefined {
    return this.operations.get(operationId);
  }

  getAllOperations(): RollbackOperation[] {
    return Array.from(this.operations.values());
  }

  clearOperation(operationId: string): void {
    this.operations.delete(operationId);
  }

  clearCompletedOperations(): void {
    for (const [id, op] of this.operations.entries()) {
      if (op.state === 'completed' || op.state === 'rolled-back') {
        this.operations.delete(id);
      }
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
