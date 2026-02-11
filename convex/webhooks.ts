import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { PLAN_CONFIG } from "./subscriptions";

// Build product maps at runtime (env vars are only available inside handlers in Convex)
function getSubscriptionPlan(productId: string): "starter" | "pro" | "scale" | null {
    const map: Record<string, "starter" | "pro" | "scale"> = {};
    if (process.env.DODO_STARTER_PRODUCT_ID) map[process.env.DODO_STARTER_PRODUCT_ID] = "starter";
    if (process.env.DODO_PRO_PRODUCT_ID) map[process.env.DODO_PRO_PRODUCT_ID] = "pro";
    if (process.env.DODO_SCALE_PRODUCT_ID) map[process.env.DODO_SCALE_PRODUCT_ID] = "scale";
    return map[productId] ?? null;
}

function getCreditPackSize(productId: string): 50 | 150 | 400 | null {
    const map: Record<string, 50 | 150 | 400> = {};
    if (process.env.DODO_CREDIT_PACK_SMALL_ID) map[process.env.DODO_CREDIT_PACK_SMALL_ID] = 50;
    if (process.env.DODO_CREDIT_PACK_MEDIUM_ID) map[process.env.DODO_CREDIT_PACK_MEDIUM_ID] = 150;
    if (process.env.DODO_CREDIT_PACK_LARGE_ID) map[process.env.DODO_CREDIT_PACK_LARGE_ID] = 400;
    return map[productId] ?? null;
}

// Webhook: Subscription activated
export const handleSubscriptionActive = internalMutation({
    args: {
        subscriptionId: v.string(),
        customerId: v.string(),
        customerEmail: v.string(),
        productId: v.string(),
        status: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        const plan = getSubscriptionPlan(args.productId);
        if (!plan) {
            console.error(`Unknown product ID: ${args.productId}. Configured IDs: starter=${process.env.DODO_STARTER_PRODUCT_ID}, pro=${process.env.DODO_PRO_PRODUCT_ID}, scale=${process.env.DODO_SCALE_PRODUCT_ID}`);
            return;
        }

        // Find customer by Dodo ID first
        let customer = await ctx.db
            .query("customers")
            .withIndex("by_dodo_customer_id", (q) =>
                q.eq("dodoCustomerId", args.customerId)
            )
            .first();

        // If not found by Dodo ID, try finding by email (pre-registered during checkout)
        if (!customer && args.customerEmail) {
            customer = await ctx.db
                .query("customers")
                .withIndex("by_email", (q) =>
                    q.eq("email", args.customerEmail)
                )
                .first();

            // Update the customer with their Dodo ID
            if (customer) {
                await ctx.db.patch(customer._id, {
                    dodoCustomerId: args.customerId,
                });
            }
        }

        let userId: string;

        if (customer) {
            userId = customer.authId;
        } else {
            // No pre-registered customer found — create one with Dodo ID as temp userId
            console.log(`Customer not found for Dodo ID: ${args.customerId}, creating with email ${args.customerEmail}`);
            await ctx.db.insert("customers", {
                authId: args.customerId, // Temporary — will be updated when user authenticates
                email: args.customerEmail,
                dodoCustomerId: args.customerId,
                createdAt: Date.now(),
            });
            userId = args.customerId;
        }

        const config = PLAN_CONFIG[plan];
        const now = Date.now();

        // Check if subscription exists
        const existingSub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .first();

        if (existingSub) {
            // Update existing subscription
            await ctx.db.patch(existingSub._id, {
                plan,
                status: "active",
                creditsMonthly: config.creditsMonthly,
                currentBalance: config.creditsMonthly,
                dailyCap: config.dailyCap,
                dailyTokenLimit: config.dailyTokenLimit,
                dailyCreditsUsed: 0,
                dailyTokensUsed: 0,
                lastDailyReset: now,
                dodoCustomerId: args.customerId,
                dodoSubscriptionId: args.subscriptionId,
                currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000, // ~30 days
                updatedAt: now,
            });

            // Log the credit grant
            await ctx.db.insert("transactions", {
                userId,
                type: "grant",
                amount: config.creditsMonthly,
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan activated`,
                relatedTo: "subscription_activation",
                balanceBefore: existingSub.currentBalance,
                balanceAfter: config.creditsMonthly,
                timestamp: now,
            });
        } else {
            // Create new subscription
            await ctx.db.insert("subscriptions", {
                userId,
                plan,
                status: "active",
                creditsMonthly: config.creditsMonthly,
                currentBalance: config.creditsMonthly,
                dailyCap: config.dailyCap,
                dailyTokenLimit: config.dailyTokenLimit,
                dailyCreditsUsed: 0,
                dailyTokensUsed: 0,
                lastDailyReset: now,
                dodoCustomerId: args.customerId,
                dodoSubscriptionId: args.subscriptionId,
                currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000,
                createdAt: now,
                updatedAt: now,
            });

            // Log initial credit grant
            await ctx.db.insert("transactions", {
                userId,
                type: "grant",
                amount: config.creditsMonthly,
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan — initial credit grant`,
                relatedTo: "subscription_activation",
                balanceBefore: 0,
                balanceAfter: config.creditsMonthly,
                timestamp: now,
            });
        }
    },
});

// Webhook: Subscription renewed
export const handleSubscriptionRenewed = internalMutation({
    args: {
        subscriptionId: v.string(),
        customerId: v.string(),
        productId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q) =>
                q.eq("dodoSubscriptionId", args.subscriptionId)
            )
            .first();

        if (!sub) {
            console.error(`Subscription not found for renewal: ${args.subscriptionId}`);
            return;
        }

        const plan = getSubscriptionPlan(args.productId) ?? sub.plan;
        const config = PLAN_CONFIG[plan];
        const now = Date.now();

        const balanceBefore = sub.currentBalance;
        const newBalance = config.creditsMonthly; // Reset to full monthly allocation

        await ctx.db.patch(sub._id, {
            plan,
            status: "active",
            currentBalance: newBalance,
            creditsMonthly: config.creditsMonthly,
            dailyCap: config.dailyCap,
            dailyTokenLimit: config.dailyTokenLimit,
            dailyCreditsUsed: 0,
            dailyTokensUsed: 0,
            lastDailyReset: now,
            currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000,
            updatedAt: now,
        });

        await ctx.db.insert("transactions", {
            userId: sub.userId,
            type: "grant",
            amount: config.creditsMonthly,
            description: `Monthly renewal — ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan`,
            relatedTo: "subscription_renewal",
            balanceBefore,
            balanceAfter: newBalance,
            timestamp: now,
        });
    },
});

// Webhook: Subscription cancelled
export const handleSubscriptionCancelled = internalMutation({
    args: {
        subscriptionId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, { subscriptionId }) => {
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q) =>
                q.eq("dodoSubscriptionId", subscriptionId)
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

// Webhook: Subscription failed (payment failed)
export const handleSubscriptionFailed = internalMutation({
    args: {
        subscriptionId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, { subscriptionId }) => {
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q) =>
                q.eq("dodoSubscriptionId", subscriptionId)
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

// Webhook: Payment succeeded (for credit packs)
export const handlePaymentSucceeded = internalMutation({
    args: {
        paymentId: v.string(),
        customerId: v.string(),
        customerEmail: v.string(),
        productId: v.string(),
        amount: v.number(),
        currency: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        const packSize = getCreditPackSize(args.productId);

        // If it's not a credit pack product, it's a subscription payment — skip
        if (!packSize) return;

        // Find customer
        const customer = await ctx.db
            .query("customers")
            .withIndex("by_dodo_customer_id", (q) =>
                q.eq("dodoCustomerId", args.customerId)
            )
            .first();

        if (!customer) {
            console.error(`Customer not found for credit pack purchase: ${args.customerId}`);
            return;
        }

        const userId = customer.authId;

        // Record credit pack purchase
        await ctx.db.insert("creditPacks", {
            userId,
            packSize,
            creditsGranted: packSize,
            dodoPaymentId: args.paymentId,
            status: "completed",
            timestamp: Date.now(),
        });

        // Add credits to subscription balance
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .first();

        if (!sub) {
            console.error(`No subscription found for credit pack purchase, userId: ${userId}`);
            return;
        }

        const balanceBefore = sub.currentBalance;
        const balanceAfter = balanceBefore + packSize;

        await ctx.db.patch(sub._id, {
            currentBalance: balanceAfter,
            updatedAt: Date.now(),
        });

        // Log transaction — credit packs do NOT increase daily cap
        await ctx.db.insert("transactions", {
            userId,
            type: "credit",
            amount: packSize,
            description: `${packSize} Credit Pack purchased`,
            relatedTo: "credit_pack",
            balanceBefore,
            balanceAfter,
            timestamp: Date.now(),
        });
    },
});

// Webhook: Payment failed
export const handlePaymentFailed = internalMutation({
    args: {
        paymentId: v.string(),
        customerId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        console.error(`Payment failed: ${args.paymentId} for customer: ${args.customerId}`);

        // If it was a credit pack, mark as failed
        // Otherwise, let subscription webhook handle status
    },
});
