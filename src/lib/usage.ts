import { prisma } from "./db";
import { auth } from "@clerk/nextjs/server";
import { TOKENS_PER_GEM, calculateGemsForTokens } from "./dodo";

/**
 * Get the current gem balance for the authenticated user
 */
export async function getGemBalance(): Promise<number> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usage = await prisma.usage.findUnique({
    where: { userId },
  });

  return usage?.gems ?? 0;
}

/**
 * Get usage status including gem balance
 */
export async function getUsageStatus() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const gems = await getGemBalance();

  return {
    remainingPoints: gems,
    consumedPoints: 0, // Legacy compatibility
    msBeforeNext: 0, // No expiration in gem system
  };
}

/**
 * Check if user has enough gems for an operation
 * Returns true if user can proceed, false otherwise
 */
export async function hasEnoughGems(estimatedTokens: number = 2000): Promise<boolean> {
  const balance = await getGemBalance();
  const gemsNeeded = calculateGemsForTokens(estimatedTokens, 0);
  return balance >= gemsNeeded;
}

/**
 * Consume gems based on token usage
 * @param inputTokens - Number of input tokens used
 * @param outputTokens - Number of output tokens used
 * @throws Error if user doesn't have enough gems
 */
export async function consumeGems(inputTokens: number, outputTokens: number): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const gemsToConsume = calculateGemsForTokens(inputTokens, outputTokens);
  const currentBalance = await getGemBalance();

  if (currentBalance < gemsToConsume) {
    throw new Error(`Insufficient gems. Need ${gemsToConsume}, have ${currentBalance}`);
  }

  await prisma.usage.update({
    where: { userId },
    data: {
      gems: {
        decrement: gemsToConsume,
      },
    },
  });
}

/**
 * Pre-check credits before generation (legacy compatibility)
 * Now just checks if user has any gems
 */
export async function consumeCredits(): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const balance = await getGemBalance();

  // Minimum 4 gems needed for a typical generation (2000 tokens / 500 = 4 gems)
  const MIN_GEMS_REQUIRED = 4;

  if (balance < MIN_GEMS_REQUIRED) {
    throw { remainingPoints: balance }; // Legacy error format for rate limiter
  }
}

/**
 * Add gems to user's balance (called after successful payment)
 */
export async function addGems(userId: string, gems: number): Promise<void> {
  await prisma.usage.upsert({
    where: { userId },
    create: {
      userId,
      gems,
    },
    update: {
      gems: {
        increment: gems,
      },
    },
  });
}
