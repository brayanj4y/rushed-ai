import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyAuth } from "./auth";

// Plan configurations
export const PLAN_CONFIG = {
    starter: {
        creditsMonthly: 50,
        dailyCap: 3,
        dailyTokenLimit: 40000,
    },
    pro: {
        creditsMonthly: 150,
        dailyCap: 8,
        dailyTokenLimit: 120000,
    },
    scale: {
        creditsMonthly: 400,
        dailyCap: 18,
        dailyTokenLimit: 250000,
    },
} as const;

// Query: Get user's active subscription
export const getByUserId = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const userId = identity.subject;

        return await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .first();
    },
});

// Internal query: Get subscription by userId (for server-side use)
export const getByUserIdInternal = internalMutation({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .first();
    },
});

// Internal query: Get subscription by Dodo subscription ID
export const getByDodoSubscriptionId = internalMutation({
    args: { dodoSubscriptionId: v.string() },
    handler: async (ctx, { dodoSubscriptionId }) => {
        return await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q) =>
                q.eq("dodoSubscriptionId", dodoSubscriptionId)
            )
            .first();
    },
});

// Internal mutation: Create subscription
export const createSubscription = internalMutation({
    args: {
        userId: v.string(),
        plan: v.union(v.literal("starter"), v.literal("pro"), v.literal("scale")),
        dodoCustomerId: v.string(),
        dodoSubscriptionId: v.string(),
        currentPeriodEnd: v.number(),
    },
    handler: async (ctx, args) => {
        const config = PLAN_CONFIG[args.plan];
        const now = Date.now();

        // Check if subscription already exists for this user
        const existing = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first();

        if (existing) {
            // Update existing subscription
            await ctx.db.patch(existing._id, {
                plan: args.plan,
                status: "active",
                creditsMonthly: config.creditsMonthly,
                currentBalance: config.creditsMonthly,
                dailyCap: config.dailyCap,
                dailyTokenLimit: config.dailyTokenLimit,
                dailyCreditsUsed: 0,
                dailyTokensUsed: 0,
                lastDailyReset: now,
                dodoCustomerId: args.dodoCustomerId,
                dodoSubscriptionId: args.dodoSubscriptionId,
                currentPeriodEnd: args.currentPeriodEnd,
                updatedAt: now,
            });
            return existing._id;
        }

        return await ctx.db.insert("subscriptions", {
            userId: args.userId,
            plan: args.plan,
            status: "active",
            creditsMonthly: config.creditsMonthly,
            currentBalance: config.creditsMonthly,
            dailyCap: config.dailyCap,
            dailyTokenLimit: config.dailyTokenLimit,
            dailyCreditsUsed: 0,
            dailyTokensUsed: 0,
            lastDailyReset: now,
            dodoCustomerId: args.dodoCustomerId,
            dodoSubscriptionId: args.dodoSubscriptionId,
            currentPeriodEnd: args.currentPeriodEnd,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Internal mutation: Cancel subscription
export const cancelSubscription = internalMutation({
    args: { dodoSubscriptionId: v.string() },
    handler: async (ctx, { dodoSubscriptionId }) => {
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q) =>
                q.eq("dodoSubscriptionId", dodoSubscriptionId)
            )
            .first();

        if (sub) {
            await ctx.db.patch(sub._id, {
                status: "canceled",
                updatedAt: Date.now(),
            });
        }
    },
});

// Internal mutation: Mark subscription as past_due
export const markPastDue = internalMutation({
    args: { dodoSubscriptionId: v.string() },
    handler: async (ctx, { dodoSubscriptionId }) => {
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q) =>
                q.eq("dodoSubscriptionId", dodoSubscriptionId)
            )
            .first();

        if (sub) {
            await ctx.db.patch(sub._id, {
                status: "past_due",
                updatedAt: Date.now(),
            });
        }
    },
});
