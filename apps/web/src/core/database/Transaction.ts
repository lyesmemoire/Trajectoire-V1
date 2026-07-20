/**
 * Transaction Interface
 * Defines the contract for database transactions
 * Ensures atomic operations across multiple repositories
 */

export interface ITransaction {
  /**
   * Get the transaction ID for logging
   */
  readonly id: string;

  /**
   * Begin the transaction
   */
  begin(): Promise<void>;

  /**
   * Commit the transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback the transaction
   */
  rollback(): Promise<void>;

  /**
   * Check if transaction is active
   */
  readonly isActive: boolean;
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  /**
   * Isolation level (if supported by database)
   */
  isolationLevel?: "read_committed" | "repeatable_read" | "serializable";

  /**
   * Read-only transaction
   */
  readOnly?: boolean;
}

/**
 * Transaction context for passing through layers
 */
export interface TransactionContext {
  /**
   * The active transaction
   */
  transaction?: ITransaction;

  /**
   * Whether to use transaction for this operation
   */
  useTransaction?: boolean;
}
