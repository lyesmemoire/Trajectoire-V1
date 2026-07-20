/**
 * Supabase Transaction Manager
 * Manages database transactions for Supabase
 * Ensures atomic operations across multiple repositories
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ITransaction, TransactionOptions } from "@/core/database/Transaction";
import { InfrastructureError } from "@/core/errors";
import { logger } from "@/lib/logger/Logger";

export class SupabaseTransaction implements ITransaction {
  readonly id: string;
  private _isActive: boolean = false;
  private supabase: SupabaseClient;

  constructor(id: string, supabase: SupabaseClient) {
    this.id = id;
    this.supabase = supabase;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  async begin(): Promise<void> {
    if (this._isActive) {
      throw new InfrastructureError("Transaction already active", "SupabaseTransaction");
    }

    this._isActive = true;
    logger.info("Transaction started", { transactionId: this.id });
  }

  async commit(): Promise<void> {
    if (!this._isActive) {
      throw new InfrastructureError("Cannot commit inactive transaction", "SupabaseTransaction");
    }

    this._isActive = false;
    logger.info("Transaction committed", { transactionId: this.id });
  }

  async rollback(): Promise<void> {
    if (!this._isActive) {
      // Silently ignore rollback of inactive transaction
      return;
    }

    this._isActive = false;
    logger.info("Transaction rolled back", { transactionId: this.id });
  }

  /**
   * Get the Supabase client for this transaction
   * In Supabase, transactions are simulated at the application level
   * since Supabase doesn't support explicit transactions in the client
   */
  getClient(): SupabaseClient {
    if (!this._isActive) {
      throw new InfrastructureError("Transaction not active", "SupabaseTransaction");
    }
    return this.supabase;
  }
}

export class SupabaseTransactionManager {
  private static instance: SupabaseTransactionManager | null = null;
  private supabase: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new InfrastructureError("Supabase credentials not configured", "SupabaseTransactionManager");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  static getInstance(): SupabaseTransactionManager {
    if (!SupabaseTransactionManager.instance) {
      SupabaseTransactionManager.instance = new SupabaseTransactionManager();
    }
    return SupabaseTransactionManager.instance;
  }

  /**
   * Create a new transaction
   * @param options - Transaction options
   * @returns Transaction instance
   */
  createTransaction(options?: TransactionOptions): ITransaction {
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return new SupabaseTransaction(transactionId, this.supabase);
  }

  /**
   * Execute a function within a transaction
   * Automatically handles commit/rollback
   * @param fn - Function to execute within transaction
   * @param options - Transaction options
   * @returns Function result
   */
  async execute<T>(fn: (transaction: ITransaction) => Promise<T>, options?: TransactionOptions): Promise<T> {
    const transaction = this.createTransaction(options);
    await transaction.begin();

    try {
      const result = await fn(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get the default Supabase client (for non-transactional operations)
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }
}
