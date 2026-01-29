import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "./db";
import { auth } from "@clerk/nextjs/server";


const POINTS_PER_GEM = 2;
const GENERATION_COST = 1;


const FREE_TOTAL_GEMS = 20;
const PRO_TOTAL_GEMS = 100;
const TOTAL_DURATION = 30 * 24 * 60 * 60;


const FREE_DAILY_GEMS = 2;
const PRO_DAILY_GEMS = 5;
const DAILY_DURATION = 24 * 60 * 60;


async function getTotalTracker(hasProAccess: boolean) {
  const totalPoints = hasProAccess
    ? PRO_TOTAL_GEMS * POINTS_PER_GEM
    : FREE_TOTAL_GEMS * POINTS_PER_GEM;

  return new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    keyPrefix: "total",
    points: totalPoints,
    duration: TOTAL_DURATION,
  });
}


async function getDailyTracker(hasProAccess: boolean) {
  const dailyPoints = hasProAccess
    ? PRO_DAILY_GEMS * POINTS_PER_GEM
    : FREE_DAILY_GEMS * POINTS_PER_GEM;

  return new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    keyPrefix: "daily",
    points: dailyPoints,
    duration: DAILY_DURATION,
  });
}

export async function consumeCredits() {
  const { userId, has } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const hasProAccess = has({ plan: "turbo" });
  const totalTracker = await getTotalTracker(hasProAccess);
  const dailyTracker = await getDailyTracker(hasProAccess);


  const totalStatus = await totalTracker.get(userId);
  const dailyStatus = await dailyTracker.get(userId);

  const totalRemaining = totalStatus?.remainingPoints ?? (hasProAccess ? PRO_TOTAL_GEMS : FREE_TOTAL_GEMS) * POINTS_PER_GEM;
  const dailyRemaining = dailyStatus?.remainingPoints ?? (hasProAccess ? PRO_DAILY_GEMS : FREE_DAILY_GEMS) * POINTS_PER_GEM;

  if (totalRemaining < GENERATION_COST) {
    throw "Out of total gems";
  }
  if (dailyRemaining < GENERATION_COST) {
    throw "Daily limit reached";
  }


  await totalTracker.consume(userId, GENERATION_COST);
  await dailyTracker.consume(userId, GENERATION_COST);

  return { success: true };
}

export async function getUsageStatus() {
  const { userId, has } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const hasProAccess = has({ plan: "turbo" });
  const totalTracker = await getTotalTracker(hasProAccess);
  const dailyTracker = await getDailyTracker(hasProAccess);

  const totalStatus = await totalTracker.get(userId);
  const dailyStatus = await dailyTracker.get(userId);

  const maxTotalPoints = (hasProAccess ? PRO_TOTAL_GEMS : FREE_TOTAL_GEMS) * POINTS_PER_GEM;
  const maxDailyPoints = (hasProAccess ? PRO_DAILY_GEMS : FREE_DAILY_GEMS) * POINTS_PER_GEM;

  const totalRemaining = (totalStatus?.remainingPoints ?? maxTotalPoints) / POINTS_PER_GEM;
  const dailyRemaining = (dailyStatus?.remainingPoints ?? maxDailyPoints) / POINTS_PER_GEM;


  const remainingPoints = Math.min(totalRemaining, dailyRemaining);
  const msBeforeNext = dailyStatus?.msBeforeNext ?? DAILY_DURATION * 1000;

  return {
    remainingPoints,
    msBeforeNext,
    totalRemaining,
    dailyRemaining,
  };
}

