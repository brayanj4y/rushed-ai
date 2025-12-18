-- Drop old Usage table (losing the 2 existing rows of rate-limiter data)
-- This is intentional as we're moving to a new gem-based system
DROP TABLE IF EXISTS "Usage";

-- Create new Usage table with gem balance
CREATE TABLE "Usage" (
    "userId" TEXT NOT NULL,
    "gems" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("userId")
);

-- Create GemPurchase table for tracking purchase history
CREATE TABLE "GemPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packType" TEXT NOT NULL,
    "gems" INTEGER NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GemPurchase_pkey" PRIMARY KEY ("id")
);

-- Create unique index on paymentId for idempotency
CREATE UNIQUE INDEX "GemPurchase_paymentId_key" ON "GemPurchase"("paymentId");
