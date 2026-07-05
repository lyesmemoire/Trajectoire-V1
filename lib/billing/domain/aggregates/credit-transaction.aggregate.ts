import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";
import { CreditAmount } from "../value-objects/credit-amount.vo";
import { TransactionId } from "../value-objects/transaction-id.vo";
import { TransactionType } from "../value-objects/transaction-type.vo";
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";
import { Clock } from "@/lib/core/clock/Clock";

export type TransactionState = "reserved" | "committed" | "rolled_back";

export class TransactionReserved extends BaseDomainEvent<{ userId: string; amount: number; transactionId: string }> {
  public readonly type = "billing.transaction.reserved";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; transactionId: string }
  ) {
    super();
  }
}

export class TransactionCommitted extends BaseDomainEvent<{ userId: string; amount: number; transactionId: string }> {
  public readonly type = "billing.transaction.committed";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; transactionId: string }
  ) {
    super();
  }
}

export class TransactionRolledBack extends BaseDomainEvent<{ userId: string; amount: number; transactionId: string; reason: string }> {
  public readonly type = "billing.transaction.rolled_back";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; transactionId: string; reason: string }
  ) {
    super();
  }
}

interface CreditTransactionProps {
  userId: string;
  amount: CreditAmount;
  type: TransactionType;
  state: TransactionState;
  idempotencyKey: string;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

export class CreditTransactionAggregate extends AggregateRoot {
  private constructor(
    public readonly id: string,
    private _props: CreditTransactionProps,
    private readonly clock: Clock
  ) {
    super();
  }

  static create(id: string, props: CreditTransactionProps, clock: Clock): CreditTransactionAggregate {
    return new CreditTransactionAggregate(id, props, clock);
  }

  static createReservation(
    id: string,
    userId: string,
    amount: CreditAmount,
    type: TransactionType,
    idempotencyKey: string,
    ttlMinutes: number = 10,
    clock: Clock
  ): CreditTransactionAggregate {
    const now = clock.now();
    return CreditTransactionAggregate.create(id, {
      userId,
      amount,
      type,
      state: "reserved",
      idempotencyKey,
      createdAt: now,
      expiresAt: new Date(now.getTime() + ttlMinutes * 60 * 1000),
    }, clock);
  }

  public get userId() {
    return this._props.userId;
  }

  public get amount() {
    return this._props.amount;
  }

  public get type() {
    return this._props.type;
  }

  public get state() {
    return this._props.state;
  }

  public get idempotencyKey() {
    return this._props.idempotencyKey;
  }

  public get createdAt() {
    return this._props.createdAt;
  }

  public get expiresAt() {
    return this._props.expiresAt;
  }

  public get metadata() {
    return this._props.metadata;
  }

  /**
   * Check if transaction is expired
   */
  public isExpired(): boolean {
    if (!this._props.expiresAt) return false;
    return this.clock.now() > this._props.expiresAt;
  }

  /**
   * Check if transaction can be committed
   */
  public canCommit(): boolean {
    return this._props.state === "reserved" && !this.isExpired();
  }

  /**
   * Check if transaction can be rolled back
   */
  public canRollback(): boolean {
    return this._props.state === "reserved" && !this.isExpired();
  }

  /**
   * Commit the transaction
   * @throws Error if transaction cannot be committed
   */
  public commit(): void {
    if (!this.canCommit()) {
      throw new Error(`Cannot commit transaction in state: ${this._props.state}`);
    }

    this._props.state = "committed";

    this.recordEvent(
      new TransactionCommitted(this.id, {
        userId: this.userId,
        amount: this.amount.value,
        transactionId: this.id,
      })
    );
  }

  /**
   * Rollback the transaction
   * @throws Error if transaction cannot be rolled back
   */
  public rollback(reason: string = "Transaction cancelled"): void {
    if (!this.canRollback()) {
      throw new Error(`Cannot rollback transaction in state: ${this._props.state}`);
    }

    this._props.state = "rolled_back";

    this.recordEvent(
      new TransactionRolledBack(this.id, {
        userId: this.userId,
        amount: this.amount.value,
        transactionId: this.id,
        reason,
      })
    );
  }
}
