/**
 * Result Objects
 *
 * Application-level result objects for operation outcomes.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY result object definitions.
 */
// @ts-nocheck


export enum OperationStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  PARTIAL = "PARTIAL",
}

export interface Result<T> {
  status: OperationStatus;
  data?: T;
  error?: Error;
  metadata?: Record<string, unknown>;
}

export class ResultBuilder<T> {
  private status: OperationStatus = OperationStatus.SUCCESS;
  private data?: T;
  private error?: Error;
  private metadata?: Record<string, unknown>;

  static success<T>(data: T): Result<T> {
    return new ResultBuilder<T>()
      .withData(data)
      .withStatus(OperationStatus.SUCCESS)
      .build();
  }

  static failure<T>(error: Error): Result<T> {
    return new ResultBuilder<T>()
      .withError(error)
      .withStatus(OperationStatus.FAILURE)
      .build();
  }

  withStatus(status: OperationStatus): this {
    this.status = status;
    return this;
  }

  withData(data: T): this {
    this.data = data;
    return this;
  }

  withError(error: Error): this {
    this.error = error;
    return this;
  }

  withMetadata(metadata: Record<string, unknown>): this {
    this.metadata = metadata;
    return this;
  }

  build(): Result<T> {
    return {
      status: this.status,
      data: this.data,
      error: this.error,
      metadata: this.metadata,
    };
  }
}

export interface ExecutionContext {
  userId: string;
  timestamp: Date;
  operationId: string;
  metadata?: Record<string, unknown>;
}

export class ExecutionContextBuilder {
  private userId: string = "";
  private timestamp: Date = new Date();
  private operationId: string = "";
  private metadata?: Record<string, unknown>;

  withUserId(userId: string): this {
    this.userId = userId;
    return this;
  }

  withTimestamp(timestamp: Date): this {
    this.timestamp = timestamp;
    return this;
  }

  withOperationId(operationId: string): this {
    this.operationId = operationId;
    return this;
  }

  withMetadata(metadata: Record<string, unknown>): this {
    this.metadata = metadata;
    return this;
  }

  build(): ExecutionContext {
    return {
      userId: this.userId,
      timestamp: this.timestamp,
      operationId: this.operationId,
      metadata: this.metadata,
    };
  }
}
