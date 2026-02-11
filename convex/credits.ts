import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyAuth } from "./auth";

// Credit cost per unit ($0.30 actual compute cost)
const CREDIT_COST_USD = 0.30;
const INPUT_TOKEN_COST = 0.000003;
const OUTPUT_TOKEN_COST = 0.000015;
const MAX_TOKENS_PER_REQUEST = 120000;

/**
 * Calculate credits to deduct based on token usage.
 * Formula: ((input_tokens * $0.000003) + (output_tokens * $0.000015)) / $0.30
 */
export function calculateCredits(inputTokens: number, outputTokens: number): number {
    const apiCost = (inputTokens * INPUT_TOKEN_COST) + (outputTokens * OUTPUT_TOKEN_COST);
    return apiCost / CREDIT_COST_USD;
}

// Query: Get user's usage data for UI display
export const getUserUsage = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const userId = identity.subject;

        // Step 1: Direct lookup by Clerk subject
        let sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .first();

        // Step 2: If not found, check via customers table (handles Dodo customer ID mismatch)
        if (!sub) {
            // Try to find a customer record for this auth user
            const customer = await ctx.db
                .query("customers")
                .withIndex("by_auth_id", (q) => q.eq("authId", userId))
                .first();

            if (customer && customer.dodoCustomerId) {
                // Look for subscription stored with the Dodo customer ID
                sub = await ctx.db
                    .query("subscriptions")
                    .withIndex("by_user_id", (q) => q.eq("userId", customer.dodoCustomerId))
                    .first();
            }
        }

        // Step 3: Also try finding by email from identity (last resort)
        if (!sub && identity.email) {
            const customerByEmail = await ctx.db
                .query("customers")
                .withIndex("by_email", (q) => q.eq("email", identity.email!))
                .first();

            if (customerByEmail && customerByEmail.dodoCustomerId) {
                sub = await ctx.db
                    .query("subscriptions")
                    .withIndex("by_user_id", (q) => q.eq("userId", customerByEmail.dodoCustomerId))
                    .first();
            }
        }

        if (!sub) return null;

        // Check if daily reset is needed
        const now = Date.now();
        const lastReset = new Date(sub.lastDailyReset);
        const today = new Date(now);

        const needsReset =
            lastReset.getUTCFullYear() !== today.getUTCFullYear() ||
            lastReset.getUTCMonth() !== today.getUTCMonth() ||
            lastReset.getUTCDate() !== today.getUTCDate();

        return {
            plan: sub.plan,
            status: sub.status,
            currentBalance: sub.currentBalance,
            creditsMonthly: sub.creditsMonthly,
            dailyCap: sub.dailyCap,
            dailyTokenLimit: sub.dailyTokenLimit,
            dailyCreditsUsed: needsReset ? 0 : sub.dailyCreditsUsed,
            dailyTokensUsed: needsReset ? 0 : sub.dailyTokensUsed,
            currentPeriodEnd: sub.currentPeriodEnd,
        };
    },
});

// Query: Get recent transactions for billing popup
export const getTransactions = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const userId = identity.subject;

        // Try direct lookup first
        let transactions = await ctx.db
            .query("transactions")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .order("desc")
            .take(args.limit ?? 20);

        // Fallback: check via customers table
        if (transactions.length === 0) {
            const customer = await ctx.db
                .query("customers")
                .withIndex("by_auth_id", (q) => q.eq("authId", userId))
                .first();

            if (customer && customer.dodoCustomerId) {
                transactions = await ctx.db
                    .query("transactions")
                    .withIndex("by_user_id", (q) => q.eq("userId", customer.dodoCustomerId))
                    .order("desc")
                    .take(args.limit ?? 20);
            }
        }

        return transactions;
    },
});

// Mutation: Sync customer mapping — fixes userId mismatch between Clerk and Dodo
// Call this when the user returns from checkout or loads the billing page
export const syncCustomerMapping = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return { synced: false };

        const userId = identity.subject;

        // Check if subscription already has the correct userId
        const existingSub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .first();

        if (existingSub) return { synced: true }; // Already correct

        // Find customer by auth ID or email
        let customer = await ctx.db
            .query("customers")
            .withIndex("by_auth_id", (q) => q.eq("authId", userId))
            .first();

        if (!customer && identity.email) {
            customer = await ctx.db
                .query("customers")
                .withIndex("by_email", (q) => q.eq("email", identity.email!))
                .first();

            // Update authId to the Clerk subject
            if (customer) {
                await ctx.db.patch(customer._id, { authId: userId });
            }
        }

        if (!customer || !customer.dodoCustomerId) return { synced: false };

        // Find subscription stored with the Dodo customer ID
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", customer!.dodoCustomerId))
            .first();

        if (!sub) return { synced: false };

        // Fix the userId on the subscription
        await ctx.db.patch(sub._id, { userId });

        // Also fix transactions
        const transactions = await ctx.db
            .query("transactions")
            .withIndex("by_user_id", (q) => q.eq("userId", customer!.dodoCustomerId))
            .collect();

        for (const tx of transactions) {
            await ctx.db.patch(tx._id, { userId });
        }

        return { synced: true };
    },
});

// Mutation: Deduct credits after an AI request (called server-side)
export const deductCredits = mutation({
    args: {
        internalKey: v.string(),
        userId: v.string(),
        inputTokens: v.number(),
        outputTokens: v.number(),
        description: v.string(),
        relatedTo: v.string(),
    },
    handler: async (ctx, args) => {
        // Validate internal key
        const internalKey = process.env.RUSHED_CONVEX_INTERNAL_KEY;
        if (!internalKey || args.internalKey !== internalKey) {
            throw new Error("Invalid internal key");
        }

        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();

        if (!sub) {
            return { success: false, error: "no_subscription" };
        }

        if (sub.status !== "active") {
            return { success: false, error: "subscription_inactive" };
        }

        // Check if daily reset is needed
        const now = Date.now();
        const lastReset = new Date(sub.lastDailyReset);
        const today = new Date(now);

        let dailyCreditsUsed = sub.dailyCreditsUsed;
        let dailyTokensUsed = sub.dailyTokensUsed;

        const needsReset =
            lastReset.getUTCFullYear() !== today.getUTCFullYear() ||
            lastReset.getUTCMonth() !== today.getUTCMonth() ||
            lastReset.getUTCDate() !== today.getUTCDate();

        if (needsReset) {
            dailyCreditsUsed = 0;
            dailyTokensUsed = 0;
        }

        // Calculate credits to deduct
        const creditsToDeduct = calculateCredits(args.inputTokens, args.outputTokens);
        const totalTokens = args.inputTokens + args.outputTokens;

        // Validate balance
        if (sub.currentBalance < creditsToDeduct) {
            return { success: false, error: "insufficient_credits" };
        }

        // Validate daily credit cap
        if (dailyCreditsUsed + creditsToDeduct > sub.dailyCap) {
            return { success: false, error: "daily_cap_exceeded" };
        }

        // Validate daily token limit
        if (dailyTokensUsed + totalTokens > sub.dailyTokenLimit) {
            return { success: false, error: "daily_token_limit_exceeded" };
        }

        // Deduct credits atomically
        const balanceBefore = sub.currentBalance;
        const balanceAfter = balanceBefore - creditsToDeduct;

        await ctx.db.patch(sub._id, {
            currentBalance: balanceAfter,
            dailyCreditsUsed: dailyCreditsUsed + creditsToDeduct,
            dailyTokensUsed: dailyTokensUsed + totalTokens,
            lastDailyReset: needsReset ? now : sub.lastDailyReset,
            updatedAt: now,
        });

        // Create transaction record
        await ctx.db.insert("transactions", {
            userId: args.userId,
            type: "debit",
            amount: -creditsToDeduct,
            description: args.description,
            relatedTo: args.relatedTo,
            inputTokens: args.inputTokens,
            outputTokens: args.outputTokens,
            balanceBefore,
            balanceAfter,
            timestamp: now,
        });

        return {
            success: true,
            creditsDeducted: creditsToDeduct,
            balanceAfter,
            dailyCreditsUsed: dailyCreditsUsed + creditsToDeduct,
            dailyTokensUsed: dailyTokensUsed + totalTokens,
        };
    },
});

// Mutation: Pre-flight credit check (called before AI request)
export const checkCredits = mutation({
    args: {
        internalKey: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const internalKey = process.env.RUSHED_CONVEX_INTERNAL_KEY;
        if (!internalKey || args.internalKey !== internalKey) {
            throw new Error("Invalid internal key");
        }

        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();

        if (!sub) {
            return { allowed: false, error: "no_subscription" };
        }

        if (sub.status !== "active") {
            return { allowed: false, error: "subscription_inactive" };
        }

        // Check daily reset
        const now = Date.now();
        const lastReset = new Date(sub.lastDailyReset);
        const today = new Date(now);

        let dailyCreditsUsed = sub.dailyCreditsUsed;
        let dailyTokensUsed = sub.dailyTokensUsed;

        const needsReset =
            lastReset.getUTCFullYear() !== today.getUTCFullYear() ||
            lastReset.getUTCMonth() !== today.getUTCMonth() ||
            lastReset.getUTCDate() !== today.getUTCDate();

        if (needsReset) {
            dailyCreditsUsed = 0;
            dailyTokensUsed = 0;
            // Reset in DB
            await ctx.db.patch(sub._id, {
                dailyCreditsUsed: 0,
                dailyTokensUsed: 0,
                lastDailyReset: now,
                updatedAt: now,
            });
        }

        if (sub.currentBalance <= 0) {
            return { allowed: false, error: "insufficient_credits" };
        }

        if (dailyCreditsUsed >= sub.dailyCap) {
            return { allowed: false, error: "daily_cap_exceeded" };
        }

        if (dailyTokensUsed >= sub.dailyTokenLimit) {
            return { allowed: false, error: "daily_token_limit_exceeded" };
        }

        return {
            allowed: true,
            currentBalance: sub.currentBalance,
            dailyCreditsRemaining: sub.dailyCap - dailyCreditsUsed,
            dailyTokensRemaining: sub.dailyTokenLimit - dailyTokensUsed,
        };
    },
});

// Internal mutation: Add credits (subscription renewal or credit pack)
export const addCredits = internalMutation({
    args: {
        userId: v.string(),
        amount: v.number(),
        description: v.string(),
        relatedTo: v.string(),
        type: v.union(v.literal("credit"), v.literal("grant")),
    },
    handler: async (ctx, args) => {
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();

        if (!sub) {
            throw new Error("No subscription found for user");
        }

        const balanceBefore = sub.currentBalance;
        const balanceAfter = balanceBefore + args.amount;

        await ctx.db.patch(sub._id, {
            currentBalance: balanceAfter,
            updatedAt: Date.now(),
        });

        await ctx.db.insert("transactions", {
            userId: args.userId,
            type: args.type,
            amount: args.amount,
            description: args.description,
            relatedTo: args.relatedTo,
            balanceBefore,
            balanceAfter,
            timestamp: Date.now(),
        });

        return { balanceAfter };
    },
});

// Internal mutation: Reset daily limits for all active subscriptions
export const resetDailyLimits = internalMutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();
        const activeSubs = await ctx.db
            .query("subscriptions")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        let resetCount = 0;
        for (const sub of activeSubs) {
            const lastReset = new Date(sub.lastDailyReset);
            const today = new Date(now);

            const needsReset =
                lastReset.getUTCFullYear() !== today.getUTCFullYear() ||
                lastReset.getUTCMonth() !== today.getUTCMonth() ||
                lastReset.getUTCDate() !== today.getUTCDate();

            if (needsReset) {
                await ctx.db.patch(sub._id, {
                    dailyCreditsUsed: 0,
                    dailyTokensUsed: 0,
                    lastDailyReset: now,
                    updatedAt: now,
                });
                resetCount++;
            }
        }

        return { resetCount };
    },
});
