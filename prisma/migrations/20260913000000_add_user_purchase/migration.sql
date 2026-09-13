CREATE TABLE "public"."UserPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPurchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserPurchase_stripeCheckoutSessionId_key" ON "public"."UserPurchase"("stripeCheckoutSessionId");

CREATE INDEX "UserPurchase_userId_type_idx" ON "public"."UserPurchase"("userId", "type");

ALTER TABLE "public"."UserPurchase" ADD CONSTRAINT "UserPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;