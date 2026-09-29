/**
 * Targeted tests for the P0 fix:
 * checkout.session.completed + INTERVIEW_PACK + mode=payment
 *
 * Uses vi.hoisted() to avoid the "Cannot access before initialization" issue
 * that affects SubscriptionResolver.test.ts (a separate, pre-existing problem).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { computePackExpiry } from "@/lib/plans";

// ── Stable hoisted mock objects ────────────────────────────────────────────────
const mocks = vi.hoisted(() => ({
  prismaUserPurchaseFindUnique: vi.fn(),
  prismaUserPurchaseCreate: vi.fn(),
  stripeWebhooksConstructEvent: vi.fn(),
  stripeSubscriptionsRetrieve: vi.fn(),
  prismaSubscriptionFindUnique: vi.fn(),
  prismaSubscriptionUpsert: vi.fn(),
  prismaUserUpdate: vi.fn(),
  prismaUserUpdateMany: vi.fn(),
  prismaTransaction: vi.fn(),
  loggerError: vi.fn(),
  loggerInfo: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userPurchase: {
      findUnique: mocks.prismaUserPurchaseFindUnique,
      create:     mocks.prismaUserPurchaseCreate,
    },
    subscription: {
      findUnique: mocks.prismaSubscriptionFindUnique,
      upsert:     mocks.prismaSubscriptionUpsert,
    },
    user: {
      update:     mocks.prismaUserUpdate,
      updateMany: mocks.prismaUserUpdateMany,
    },
    $transaction: mocks.prismaTransaction,
  },
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: mocks.stripeWebhooksConstructEvent,
    },
    subscriptions: {
      retrieve: mocks.stripeSubscriptionsRetrieve,
    },
  },
}));

vi.mock("@/lib/env.server", () => ({
  envServer: {
    STRIPE_WEBHOOK_SECRET:        "whsec_test",
    STRIPE_PRO_PRICE_ID:          "price_pro",
    STRIPE_PRICE_EARLY:           "price_early",
  },
}));

vi.mock("@/lib/logger/Logger", () => ({
  logger: {
    error: mocks.loggerError,
    info:  mocks.loggerInfo,
    warn:  vi.fn(),
  },
}));

vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (_type: any, handler: any, _opts?: any) => handler,
}));

vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType:      { STRIPE: "STRIPE" },
  RateLimitScope: { IP: "IP" },
}));

// eslint-disable-next-line import/first
import { POST } from "./route";

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeRequest(body: string, sig = "t=1,v1=sig"): NextRequest {
  return new NextRequest("http://localhost/api/stripe/webhook", {
    method:  "POST",
    headers: { "stripe-signature": sig, "content-type": "application/json" },
    body,
  });
}

function makePaymentCompletedEvent(sessionId: string, userId: string, type = "PACK"): object {
  return {
    id:      `evt_${sessionId}`,
    type:    "checkout.session.completed",
    created: 1700000000,
    data:    {
      object: {
        id:           sessionId,
        mode:         "payment",
        subscription: null,
        metadata:     { user_id: userId, type },
      },
    },
  };
}

function makeSubscriptionCompletedEvent(sessionId: string, userId: string, subscriptionId = "sub_pro"): object {
  return {
    id:      `evt_${sessionId}`,
    type:    "checkout.session.completed",
    created: 1700000000,
    data:    {
      object: {
        id:           sessionId,
        mode:         "subscription",
        subscription: subscriptionId,
        metadata:     { user_id: userId, type: "PRO" },
      },
    },
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("POST /api/stripe/webhook - Pack (PACK) et abonnement (PRO)", () => {
  const userId    = "11111111-1111-1111-1111-111111111111";
  const sessionId = "cs_test_abc123";

  beforeEach(() => {
    vi.resetAllMocks();
    mocks.prismaTransaction.mockResolvedValue([{}, {}]);
    mocks.prismaSubscriptionFindUnique.mockResolvedValue(null);
    mocks.prismaSubscriptionUpsert.mockResolvedValue({});
    mocks.prismaUserUpdate.mockResolvedValue({});
    mocks.prismaUserUpdateMany.mockResolvedValue({ count: 1 });
    mocks.prismaTransaction.mockResolvedValue([{}, { count: 1 }]);
  });

  it("creates a UserPurchase and grants the PACK entitlement on first payment", async () => {
    const event = makePaymentCompletedEvent(sessionId, userId);
    mocks.stripeWebhooksConstructEvent.mockReturnValue(event);
    mocks.prismaUserPurchaseFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(mocks.prismaUserPurchaseFindUnique).toHaveBeenCalledWith({
      where: { stripeCheckoutSessionId: sessionId },
    });
    expect(mocks.prismaUserPurchaseCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId,
        type:                    "INTERVIEW_PACK",
        stripeCheckoutSessionId: sessionId,
        status:                  "ACTIVE",
      }),
    });

    // Droits accordés dans la même transaction : plan PACK, 3 mois, compteur à 0.
    expect(mocks.prismaTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.prismaUserUpdateMany).toHaveBeenCalledWith({
      where: { id: userId, plan: { not: "PRO" } },
      data: {
        plan:            "PACK",
        packExpiresAt:   computePackExpiry("PACK", new Date(1700000000 * 1000)),
        simulationsUsed: 0,
      },
    });
  });

  it("links the Stripe customer created at payment to the user (portal access)", async () => {
    const event = makePaymentCompletedEvent(sessionId, userId) as any;
    event.data.object.customer = "cus_pack";
    mocks.stripeWebhooksConstructEvent.mockReturnValue(event);
    mocks.prismaUserPurchaseFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(mocks.prismaUserUpdateMany).toHaveBeenCalledWith({
      where: { id: userId, stripeCustomerId: null },
      data:  { stripeCustomerId: "cus_pack" },
    });
  });

  it("accepts the legacy INTERVIEW_PACK metadata type", async () => {
    const event = makePaymentCompletedEvent(sessionId, userId, "INTERVIEW_PACK");
    mocks.stripeWebhooksConstructEvent.mockReturnValue(event);
    mocks.prismaUserPurchaseFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(mocks.prismaUserPurchaseCreate).toHaveBeenCalledTimes(1);
    expect(mocks.prismaUserUpdateMany).toHaveBeenCalledTimes(1);
  });

  it("skips creation when UserPurchase already exists (idempotent)", async () => {
    const event = makePaymentCompletedEvent(sessionId, userId);
    mocks.stripeWebhooksConstructEvent.mockReturnValue(event);
    mocks.prismaUserPurchaseFindUnique.mockResolvedValue({
      id: "existing", userId, type: "INTERVIEW_PACK",
      stripeCheckoutSessionId: sessionId, status: "ACTIVE", activatedAt: new Date(),
    });

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(mocks.prismaUserPurchaseCreate).not.toHaveBeenCalled();
    expect(mocks.prismaUserUpdateMany).not.toHaveBeenCalled();
    expect(mocks.loggerInfo).toHaveBeenCalledWith(
      expect.stringContaining("idempotent skip"),
      expect.objectContaining({ userId, sessionId }),
    );
  });

  it("does not grant entitlement when metadata is invalid (no user_id)", async () => {
    const badEvent = {
      id: "evt_bad", type: "checkout.session.completed", created: 1700000000,
      data: { object: { id: sessionId, mode: "payment", metadata: { type: "PACK" } } },
    };
    mocks.stripeWebhooksConstructEvent.mockReturnValue(badEvent);

    const res = await POST(makeRequest(JSON.stringify(badEvent)));

    expect(res.status).toBe(200);
    expect(mocks.prismaUserPurchaseCreate).not.toHaveBeenCalled();
    expect(mocks.loggerError).toHaveBeenCalledWith(
      expect.stringContaining("metadata invalide"),
    );
  });

  it("leaves subscription mode (Pro) unchanged and never touches UserPurchase", async () => {
    const event = makeSubscriptionCompletedEvent(sessionId, userId);
    mocks.stripeWebhooksConstructEvent.mockReturnValue(event);

    const fakeSub = {
      id: "sub_pro", customer: "cus_pro", status: "active",
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
      metadata: { user_id: userId, type: "PRO" },
      items:    { data: [{ price: { id: "price_pro" } }] },
    };
    mocks.stripeSubscriptionsRetrieve.mockResolvedValue(fakeSub);

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(mocks.prismaTransaction).toHaveBeenCalled();
    expect(mocks.prismaUserPurchaseFindUnique).not.toHaveBeenCalled();
    expect(mocks.prismaUserPurchaseCreate).not.toHaveBeenCalled();
  });

  it("sets the user plan to PRO for a known subscription price", async () => {
    const event = makeSubscriptionCompletedEvent(sessionId, userId);
    mocks.stripeWebhooksConstructEvent.mockReturnValue(event);
    mocks.stripeSubscriptionsRetrieve.mockResolvedValue({
      id: "sub_pro", customer: "cus_pro", status: "active",
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
      metadata: { user_id: userId, type: "PRO" },
      items:    { data: [{ price: { id: "price_pro" } }] },
    });

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(mocks.prismaTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.prismaUserUpdate).toHaveBeenCalledWith({
      where: { id: userId },
      data:  { plan: "PRO" },
    });
  });

  it("logs an error and leaves the plan untouched for an unknown subscription price", async () => {
    const event = makeSubscriptionCompletedEvent(sessionId, userId);
    mocks.stripeWebhooksConstructEvent.mockReturnValue(event);
    mocks.stripeSubscriptionsRetrieve.mockResolvedValue({
      id: "sub_x", customer: "cus_x", status: "active",
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
      metadata: { user_id: userId, type: "PRO" },
      items:    { data: [{ price: { id: "price_inconnu" } }] },
    });

    const res = await POST(makeRequest(JSON.stringify(event)));

    expect(res.status).toBe(200);
    expect(mocks.loggerError).toHaveBeenCalledWith(
      expect.stringContaining("Prix d'abonnement inconnu"),
      expect.objectContaining({ priceId: "price_inconnu" }),
    );
    expect(mocks.prismaTransaction).not.toHaveBeenCalled();
    expect(mocks.prismaUserUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 when Stripe signature header is absent", async () => {
    const req = new NextRequest("http://localhost/api/stripe/webhook", {
      method: "POST", headers: { "content-type": "application/json" }, body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
