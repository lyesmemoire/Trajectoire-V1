import { describe, it, expect, beforeEach } from "vitest";
import { WalletAggregate, CreditsConsumed, CreditsAdded, CreditsRefunded } from "../../../lib/billing/domain/aggregates/wallet.aggregate";
import { CreditAmount } from "../../../lib/billing/domain/value-objects/credit-amount.vo";
import { TransactionType } from "../../../lib/billing/domain/value-objects/transaction-type.vo";
import { FakeClock, FakeIdGenerator } from "../../shared/fakes";

describe("WalletAggregate", () => {
  let fakeClock: FakeClock;
  let fakeIdGenerator: FakeIdGenerator;

  beforeEach(() => {
    fakeClock = new FakeClock(new Date("2024-01-01T00:00:00Z"));
    fakeIdGenerator = new FakeIdGenerator("tx-");
  });

  describe("creation", () => {
    it("should create an empty wallet with zero credits", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      
      expect(wallet.userId).toBe("user-1");
      expect(wallet.balance).toBe(0);
      expect(wallet.transactions).toHaveLength(0);
    });

    it("should create a wallet with initial credits", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(100),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      expect(wallet.balance).toBe(100);
    });
  });

  describe("addCredits", () => {
    it("should add credits and emit CreditsAdded event", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      
      const txId = wallet.addCredits(
        CreditAmount.create(50),
        TransactionType.purchase()
      );
      
      expect(wallet.balance).toBe(50);
      expect(wallet.transactions).toHaveLength(1);
      expect(txId.value).toBe("tx-0");
      
      const events = wallet.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CreditsAdded);
      expect((events[0] as CreditsAdded).payload.amount).toBe(50);
    });

    it("should add bonus credits", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      
      wallet.addCredits(CreditAmount.create(20), TransactionType.bonus());
      
      expect(wallet.balance).toBe(20);
      expect(wallet.transactions[0].type.isBonus()).toBe(true);
    });

    it("should track transaction timestamp", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      
      fakeClock.advanceBy(1000);
      wallet.addCredits(CreditAmount.create(50), TransactionType.purchase());
      
      expect(wallet.transactions[0].createdAt).toEqual(new Date("2024-01-01T00:00:01Z"));
    });
  });

  describe("consume", () => {
    it("should consume credits and emit CreditsConsumed event", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(100),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      const txId = wallet.consume(CreditAmount.create(30));
      
      expect(wallet.balance).toBe(70);
      expect(wallet.transactions).toHaveLength(1);
      expect(txId.value).toBe("tx-0");
      
      const events = wallet.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CreditsConsumed);
      expect((events[0] as CreditsConsumed).payload.amount).toBe(30);
    });

    it("should throw error when consuming more than available", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(50),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      expect(() => wallet.consume(CreditAmount.create(100))).toThrow(
        "Insufficient credits: required 100, available 50"
      );
    });

    it("should throw error when consuming negative credits", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(50),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      expect(() => wallet.consume(CreditAmount.create(-10))).toThrow();
    });

    it("should allow consuming exactly available credits", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(50),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      wallet.consume(CreditAmount.create(50));
      
      expect(wallet.balance).toBe(0);
    });

    it("should include metadata in transaction", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(100),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      const metadata = { interviewId: "int-123", questionId: "q-456" };
      wallet.consume(CreditAmount.create(10), metadata);
      
      expect(wallet.transactions[0].metadata).toEqual(metadata);
    });
  });

  describe("refund", () => {
    it("should refund a consumption transaction", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(100),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      const consumeTxId = wallet.consume(CreditAmount.create(30));
      
      wallet.refund(consumeTxId);
      
      expect(wallet.balance).toBe(100);
      expect(wallet.transactions).toHaveLength(2);
      
      const events = wallet.pullEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(CreditsConsumed);
      expect(events[1]).toBeInstanceOf(CreditsRefunded);
    });

    it("should throw error when transaction not found", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      const fakeTxId = { value: "non-existent" } as any;
      
      expect(() => wallet.refund(fakeTxId)).toThrow("Transaction not found: non-existent");
    });

    it("should throw error when refunding non-consumption transaction", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      
      const purchaseTxId = wallet.addCredits(CreditAmount.create(50), TransactionType.purchase());
      
      expect(() => wallet.refund(purchaseTxId)).toThrow("Only consumption transactions can be refunded");
    });

    it("should throw error when already refunded", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(100),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      const consumeTxId = wallet.consume(CreditAmount.create(30));
      
      wallet.refund(consumeTxId);
      
      expect(() => wallet.refund(consumeTxId)).toThrow("Transaction already refunded");
    });

    it("should track original transaction in refund metadata", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(100),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      const consumeTxId = wallet.consume(CreditAmount.create(30));
      
      wallet.refund(consumeTxId);
      
      const refundTx = wallet.transactions[1];
      expect(refundTx.metadata?.originalTransactionId).toBe(consumeTxId.value);
    });
  });

  describe("hasEnoughCredits", () => {
    it("should return true when sufficient credits", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(100),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      expect(wallet.hasEnoughCredits(50)).toBe(true);
      expect(wallet.hasEnoughCredits(100)).toBe(true);
    });

    it("should return false when insufficient credits", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(50),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      expect(wallet.hasEnoughCredits(51)).toBe(false);
      expect(wallet.hasEnoughCredits(100)).toBe(false);
    });
  });

  describe("getTotalConsumed", () => {
    it("should calculate total consumed credits", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(200),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      wallet.consume(CreditAmount.create(30));
      wallet.consume(CreditAmount.create(20));
      wallet.addCredits(CreditAmount.create(50), TransactionType.purchase());
      wallet.consume(CreditAmount.create(10));
      
      expect(wallet.getTotalConsumed()).toBe(60);
    });

    it("should return 0 when no consumption", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      
      expect(wallet.getTotalConsumed()).toBe(0);
    });
  });

  describe("getTotalAdded", () => {
    it("should calculate total added credits (purchases + bonuses)", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      
      wallet.addCredits(CreditAmount.create(100), TransactionType.purchase());
      wallet.addCredits(CreditAmount.create(20), TransactionType.bonus());
      wallet.consume(CreditAmount.create(30));
      wallet.addCredits(CreditAmount.create(50), TransactionType.purchase());
      
      expect(wallet.getTotalAdded()).toBe(170);
    });

    it("should not include refunds in total added", () => {
      const wallet = WalletAggregate.create("user-1", {
        userId: "user-1",
        credits: CreditAmount.create(100),
        transactions: [],
      }, fakeClock, fakeIdGenerator);
      
      const consumeTxId = wallet.consume(CreditAmount.create(30));
      wallet.refund(consumeTxId);
      
      expect(wallet.getTotalAdded()).toBe(0);
    });
  });

  describe("immutability", () => {
    it("should return copy of transactions array", () => {
      const wallet = WalletAggregate.createEmpty("user-1", fakeClock, fakeIdGenerator);
      
      const transactions1 = wallet.transactions;
      const transactions2 = wallet.transactions;
      
      expect(transactions1).not.toBe(transactions2);
    });
  });
});
