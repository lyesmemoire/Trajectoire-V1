/**
 * Targeted tests for the P0 fix:
 * checkout.session.completed + INTERVIEW_PACK + mode=payment
 *
 * Uses vi.hoisted() to avoid the "Cannot access before initialization" issue
 * that affects SubscriptionResolver.test.ts (a separate, pre-existing problem).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Stable hoisted mock objects ────────────────────────────────────────────────
const mocks = vi.hoisted(() => ({
  prismaUserPurchaseFindUnique: vi.fn(),
  prismaUserPurchaseCreate: vi.fn(),
  stripeWebhooksConstructEvent: vi.fn(),
  stripeSubscriptionsRetrieve: vi.fn(),
  prismaSubscriptionFindUnique: vi.fn(),
  prismaSubscriptionUpsert: vi.fn(),
  prismaUserUpdate: vi.fn(),
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
      update: mocks.prismaUserUpdate,
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
    STRIPE_EXPERT_PRICE_ID:       "price_expert",
    STRIPE_PRICE_EARLY:           "price_early",
    STRIPE_PRICE_STARTER_MONTHLY: "price_starter",
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

function makePaymentCompletedEvent(sessionId: string, userId: string, type = "INTERVIEW_PACK"): object {
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

describe("POST /api/stripe/webhook - INTERVIEW_PACK P0 fix", () => {
  const userId    = "11111111-1111-1111-1111-111111111111";
  const sessionId = "cs_test_abc123";

  beforeEach(() => {
    vi.resetAllMocks();
    mocks.prismaTransaction.mockResolvedValue([{}, {}]);
    mocks.prismaSubscriptionFindUnique.mockResolvedValue(null);
    mocks.prismaSubscriptionUpsert.mockResolvedValue({});
    mocks.prismaUserUpdate.mockResolvedValue({});
  });

  it("creates a UserPurchase on first INTERVIEW_PACK payment", async () => {
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
    expect(mocks.loggerInfo).toHaveBeenCalledWith(
      expect.stringContaining("idempotent skip"),
      expect.objectContaining({ userId, sessionId }),
    );
  });

  it("does not grant entitlement when metadata is invalid (no user_id)", async () => {
    const badEvent = {
      id: "evt_bad", type: "checkout.session.completed", created: 1700000000,
      data: { object: { id: sessionId, mode: "payment", metadata: { type: "INTERVIEW_PACK" } } },
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

  it("returns 400 when Stripe signature header is absent", async () => {
    const req = new NextRequest("http://localhost/api/stripe/webhook", {
      method: "POST", headers: { "content-type": "application/json" }, body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
