import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "./db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 2;
const PRO_POINTS = 5;
const DURATION = 24 * 60 * 60; // 1 day
const GENERATION_COST = 0.5;

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
      remainingPoints: maxPoints,
      msBeforeNext: DURATION * 1000,
    };
  }

  return result;
}
