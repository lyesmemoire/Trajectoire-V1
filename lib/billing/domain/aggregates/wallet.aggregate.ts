import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";
import { CreditAmount } from "../value-objects/credit-amount.vo";
import { TransactionId } from "../value-objects/transaction-id.vo";
import { TransactionType } from "../value-objects/transaction-type.vo";
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";
import { Clock } from "@/lib/core/clock/Clock";
import { IdGenerator } from "@/lib/core/id/IdGenerator";

export class CreditsConsumed extends BaseDomainEvent<{ userId: string; amount: number; transactionId: string }> {
  public readonly type = "billing.credits.consumed";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; transactionId: string }
  ) {
    super();
  }
}

export class CreditsAdded extends BaseDomainEvent<{ userId: string; amount: number; transactionId: string; type: string }> {
  public readonly type = "billing.credits.added";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; transactionId: string; type: string }
  ) {
    super();
  }
}

export class CreditsRefunded extends BaseDomainEvent<{ userId: string; amount: number; transactionId: string }> {
  public readonly type = "billing.credits.refunded";
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; amount: number; transactionId: string }
  ) {
    super();
  }
}

export interface WalletTransaction {
  id: TransactionId;
  amount: CreditAmount;
  type: TransactionType;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

interface WalletProps {
  userId: string;
  credits: CreditAmount;
  transactions: WalletTransaction[];
}

export class WalletAggregate extends AggregateRoot {
  private constructor(
    public readonly id: string,
    private _props: WalletProps,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator
  ) {
    super();
  }

  static create(id: string, props: WalletProps, clock: Clock, idGenerator: IdGenerator): WalletAggregate {
    return new WalletAggregate(id, props, clock, idGenerator);
  }

  static createEmpty(userId: string, clock: Clock, idGenerator: IdGenerator): WalletAggregate {
    return WalletAggregate.create(userId, {
      userId,
      credits: CreditAmount.create(0),
      transactions: [],
    }, clock, idGenerator);
  }

  public get userId() {
    return this._props.userId;
  }

  public get credits() {
    return this._props.credits;
  }

  public get transactions() {
    return [...this._props.transactions];
  }

  public get balance() {
    return this._props.credits.value;
  }

  /**
   * Consume credits from the wallet
   * @throws Error if insufficient credits
   */
  public consume(amount: CreditAmount, metadata?: Record<string, unknown>): TransactionId {
    if (this._props.credits.value < amount.value) {
      throw new Error(`Insufficient credits: required ${amount.value}, available ${this._props.credits.value}`);
    }

    const txId = TransactionId.generate(this.idGenerator);
    this._props.credits = this._props.credits.subtract(amount);

    this._props.transactions.push({
      id: txId,
      amount,
      type: TransactionType.consumption(),
      createdAt: this.clock.now(),
      metadata,
    });

    this.recordEvent(
      new CreditsConsumed(this.id, {
        userId: this.userId,
        amount: amount.value,
        transactionId: txId.value,
      })
    );

    return txId;
  }

  /**
   * Add credits to the wallet (purchase, bonus, refund)
   */
  public addCredits(
    amount: CreditAmount,
    type: TransactionType,
    metadata?: Record<string, unknown>
  ): TransactionId {
    const txId = TransactionId.generate(this.idGenerator);
    this._props.credits = this._props.credits.add(amount);

    this._props.transactions.push({
      id: txId,
      amount,
      type,
      createdAt: this.clock.now(),
      metadata,
    });

    this.recordEvent(
      new CreditsAdded(this.id, {
        userId: this.userId,
        amount: amount.value,
        transactionId: txId.value,
        type: type.value,
      })
    );

    return txId;
  }

  /**
   * Refund a previous transaction
   * @throws Error if transaction not found or already refunded
   */
  public refund(transactionId: TransactionId): void {
    const tx = this._props.transactions.find((t) => t.id.value === transactionId.value);
    if (!tx) {
      throw new Error(`Transaction not found: ${transactionId.value}`);
    }

    if (!tx.type.isConsumption()) {
      throw new Error("Only consumption transactions can be refunded");
    }

    // Check if already refunded by looking for a refund transaction with same metadata
    const alreadyRefunded = this._props.transactions.some(
      (t) => t.type.isRefund() && t.metadata?.originalTransactionId === transactionId.value
    );
    if (alreadyRefunded) {
      throw new Error("Transaction already refunded");
    }

    const refundTxId = TransactionId.generate(this.idGenerator);
    this._props.credits = this._props.credits.add(tx.amount);

    this._props.transactions.push({
      id: refundTxId,
      amount: tx.amount,
      type: TransactionType.refund(),
      createdAt: this.clock.now(),
      metadata: { originalTransactionId: transactionId.value },
    });

    this.recordEvent(
      new CreditsRefunded(this.id, {
        userId: this.userId,
        amount: tx.amount.value,
        transactionId: refundTxId.value,
      })
    );
  }

  /**
   * Check if wallet has enough credits
   */
  public hasEnoughCredits(required: number): boolean {
    return this._props.credits.value >= required;
  }

  /**
   * Get total credits consumed
   */
  public getTotalConsumed(): number {
    return this._props.transactions
      .filter((t) => t.type.isConsumption())
      .reduce((sum, t) => sum + t.amount.value, 0);
  }

  /**
   * Get total credits added (purchases + bonuses)
   */
  public getTotalAdded(): number {
    return this._props.transactions
      .filter((t) => t.type.isPurchase() || t.type.isBonus())
      .reduce((sum, t) => sum + t.amount.value, 0);
  }
}
