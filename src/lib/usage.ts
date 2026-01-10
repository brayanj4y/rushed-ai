import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "./db";
import { auth, clerkClient } from "@clerk/nextjs/server";

const FREE_POINTS = 2;
const PRO_POINTS = 100;
const DURATION = 30 * 24 * 60 * 60; // 30 days
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

export async function cancelSubscriptionOnDepletion() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const subscriptionId = user.privateMetadata.subscriptionId as string | undefined;

    if (subscriptionId) {
      await (client.billing as any).cancelSubscriptionItem(subscriptionId, {
        cancelImmediately: true
      });


      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          subscriptionId: null
        }
      });
    } else {

    }

  } catch (error) {
    console.error("Failed to cancel subscription:", error);

  }


  const usageTracker = await getUsageTracker();
  await usageTracker.delete(userId);
}

export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();

  try {
    const result = await usageTracker.consume(userId, GENERATION_COST);


    if (result.remainingPoints <= 0) {
      await usageTracker.delete(userId);
    }

    return result;
  } catch (error) {

    await usageTracker.delete(userId);
    throw error;
  }
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
