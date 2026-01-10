import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "./db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 2;
const PRO_POINTS = 100;
const DURATION = 30 * 24 * 60 * 60; // 30 days
const GENERATION_COST = 1;

export async function getUsageTracker(options?: { hasProAccess?: boolean }) {
  let hasProAccess = options?.hasProAccess;

  if (hasProAccess === undefined) {
    const { has } = await auth();
    hasProAccess = has({ plan: "turbo" });
  }

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  });

  return usageTracker;
}

import { clerkClient } from "@clerk/nextjs/server";

export async function resetUserToFree(userId: string) {
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      plan: "free",
    },
  });
}

export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return consumeCreditsForUser(userId);
}

export async function consumeCreditsForUser(
  userId: string,
  options?: { hasProAccess?: boolean }
) {
  const usageTracker = await getUsageTracker(options);
  const result = await usageTracker.consume(userId, GENERATION_COST);

  if (result.remainingPoints === 0) {
    // Expire the usage record immediately
    await prisma.usage.update({
      where: { key: userId },
      data: { expire: new Date() },
    });

    // Revoke "turbo" status so they see the "Buy Gems" button
    // In a real environment, this updates Clerk.
    // In a test environment with a fake userId, this might fail, so we can catch it or let it fail.
    try {
      await resetUserToFree(userId);
    } catch (error) {
      console.error("Failed to reset user metadata (expected in tests):", error);
    }
  }

  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);

  return result;
}
