import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "./db";
import { auth } from "@clerk/nextjs/server";

const POINTS_PER_GEM = 2;
const FREE_POINTS = 2 * POINTS_PER_GEM;
const PRO_POINTS = 5 * POINTS_PER_GEM;
const DURATION = 24 * 60 * 60;
const GENERATION_COST = 1;

export async function getUsageTracker() {
  const { has } = await auth();
  const hasProAccess = has({ plan: "turbo" });

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  });

  return usageTracker;
}

export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, GENERATION_COST);

  return result;
}

export async function getUsageStatus() {
  const { userId, has } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const hasProAccess = has({ plan: "turbo" });
  const maxPoints = hasProAccess ? PRO_POINTS : FREE_POINTS;

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);

  if (!result) {
    return {
      remainingPoints: maxPoints / POINTS_PER_GEM,  // Convert to gems for display
      msBeforeNext: DURATION * 1000,
    };
  }

  return {
    ...result,
    remainingPoints: result.remainingPoints / POINTS_PER_GEM,  // Convert to gems for display
  };
}
