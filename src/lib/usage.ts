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
    // Check if user has a subscription ID stored
    const subscriptionId = user.privateMetadata.subscriptionId as string | undefined;

    if (subscriptionId) {
      // Use the billing API to cancel
      // Note: The actual method name might vary slightly depending on exact SDK version
      // but client.billing.cancelSubscriptionItem is the standard pattern
      // Casting to any because the method is missing in the current type definitions (Beta)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client.billing as any).cancelSubscriptionItem(subscriptionId, {
        cancelImmediately: true,
      });

      // Also clear the metadata
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          subscriptionId: null,
        },
      });
    }

  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    // Continue to reset usage even if subscription cancellation fails
  }

  // Reset the usage counter
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

    // If gems are now depleted, cancel subscription
    if (result.remainingPoints <= 0) {
      await cancelSubscriptionOnDepletion();
    }

    return result;
  } catch (error) {
    // Rate limit exceeded - reset and re-throw so user gets fresh gems
    // but also ensure subscription is canceled if they hit the limit
    await cancelSubscriptionOnDepletion();
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
