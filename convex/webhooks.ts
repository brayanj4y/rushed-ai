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

/**
 * Ensure customer record exists and is properly mapped.
 * Uses the clerkUserId from checkout metadata as the canonical ID.
 */
async function ensureCustomer(
    ctx: any,
    clerkUserId: string,
    dodoCustomerId: string,
    customerEmail: string
) {
    // Check if customer exists by Clerk ID
    let customer = await ctx.db
        .query("customers")
        .withIndex("by_auth_id", (q: any) => q.eq("authId", clerkUserId))
        .first();

    if (customer) {
        // Update dodoCustomerId if needed
        if (customer.dodoCustomerId !== dodoCustomerId) {
            await ctx.db.patch(customer._id, { dodoCustomerId });
        }
        return;
    }

    // Check if customer exists by dodoCustomerId (webhook created before metadata)
    customer = await ctx.db
        .query("customers")
        .withIndex("by_dodo_customer_id", (q: any) => q.eq("dodoCustomerId", dodoCustomerId))
        .first();

    if (customer) {
        await ctx.db.patch(customer._id, { authId: clerkUserId });
        return;
    }

    // Create new customer
    await ctx.db.insert("customers", {
        authId: clerkUserId,
        email: customerEmail,
        dodoCustomerId,
        createdAt: Date.now(),
    });
}

// ─── Webhook: Subscription activated ────────────────────────────────────────
export const handleSubscriptionActive = internalMutation({
    args: {
        subscriptionId: v.string(),
        customerId: v.string(),
        customerEmail: v.string(),
        productId: v.string(),
        status: v.string(),
        clerkUserId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        const plan = getSubscriptionPlan(args.productId);
        if (!plan) {
            console.error(`Unknown product ID: ${args.productId}`);
            return;
        }

        if (!args.clerkUserId) {
            console.error(`No clerkUserId in metadata for subscription ${args.subscriptionId}`);
            return;
        }

        const userId = args.clerkUserId;

        // Ensure customer record exists
        await ensureCustomer(ctx, userId, args.customerId, args.customerEmail);

        const config = PLAN_CONFIG[plan];
        const now = Date.now();

        console.log(`Subscription activating: userId=${userId}, plan=${plan}, dodoCustomerId=${args.customerId}`);

        // Check if subscription already exists (handles cancel + resubscribe)
        const existingSub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
            .first();

        if (existingSub) {
            const balanceBefore = existingSub.currentBalance;
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
                currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000,
                updatedAt: now,
            });

            await ctx.db.insert("transactions", {
                userId,
                type: "grant",
                amount: config.creditsMonthly,
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan activated`,
                relatedTo: "subscription_activation",
                balanceBefore,
                balanceAfter: config.creditsMonthly,
                timestamp: now,
            });

            console.log(`✅ Subscription reactivated: balance ${balanceBefore} → ${config.creditsMonthly}`);
        } else {
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

            console.log(`✅ New subscription created for ${userId}, plan: ${plan}`);
        }
    },
});

// ─── Webhook: Subscription renewed ──────────────────────────────────────────
export const handleSubscriptionRenewed = internalMutation({
    args: {
        subscriptionId: v.string(),
        customerId: v.string(),
        productId: v.string(),
        clerkUserId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        // Renewals use dodoSubscriptionId — metadata may not be present
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q: any) =>
                q.eq("dodoSubscriptionId", args.subscriptionId)
            )
            .first();

        if (!sub) {
            console.error(`❌ Subscription not found for renewal: ${args.subscriptionId}`);
            return;
        }

        const plan = (getSubscriptionPlan(args.productId) ?? sub.plan) as "starter" | "pro" | "scale";
        const config = PLAN_CONFIG[plan];
        const now = Date.now();

        const balanceBefore = sub.currentBalance;
        const newBalance = config.creditsMonthly;

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

        console.log(`✅ Subscription renewed for ${sub.userId}, plan: ${plan}`);
    },
});

// ─── Webhook: Subscription cancelled ────────────────────────────────────────
export const handleSubscriptionCancelled = internalMutation({
    args: {
        subscriptionId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, { subscriptionId }) => {
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q: any) =>
                q.eq("dodoSubscriptionId", subscriptionId)
            )
            .first();

        if (sub) {
            await ctx.db.patch(sub._id, {
                status: "canceled",
                updatedAt: Date.now(),
            });
            console.log(`✅ Subscription cancelled for ${sub.userId}`);
        }
    },
});

// ─── Webhook: Subscription payment failed ───────────────────────────────────
export const handleSubscriptionFailed = internalMutation({
    args: {
        subscriptionId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, { subscriptionId }) => {
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_dodo_subscription_id", (q: any) =>
                q.eq("dodoSubscriptionId", subscriptionId)
            )
            .first();

        if (sub) {
            await ctx.db.patch(sub._id, {
                status: "past_due",
                updatedAt: Date.now(),
            });
            console.log(`⚠️ Subscription payment failed for ${sub.userId}`);
        }
    },
});

// ─── Webhook: Payment succeeded (credit packs) ─────────────────────────────
export const handlePaymentSucceeded = internalMutation({
    args: {
        paymentId: v.string(),
        customerId: v.string(),
        customerEmail: v.string(),
        productId: v.string(),
        amount: v.number(),
        currency: v.string(),
        clerkUserId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        const packSize = getCreditPackSize(args.productId);

        // Not a credit pack → subscription payment, skip
        if (!packSize) return;

        if (!args.clerkUserId) {
            console.error(`No clerkUserId in metadata for payment ${args.paymentId}`);
            return;
        }

        // Deduplication: check if already processed
        const existingPack = await ctx.db
            .query("creditPacks")
            .withIndex("by_dodo_payment_id", (q: any) =>
                q.eq("dodoPaymentId", args.paymentId)
            )
            .first();

        if (existingPack) {
            console.log(`Credit pack payment ${args.paymentId} already processed, skipping`);
            return;
        }

        const userId = args.clerkUserId;

        // Ensure customer record exists
        await ensureCustomer(ctx, userId, args.customerId, args.customerEmail);

        // Find subscription by Clerk userId
        const sub = await ctx.db
            .query("subscriptions")
            .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
            .first();

        if (!sub) {
            console.error(`❌ No subscription found for credit pack, userId=${userId}`);
            return;
        }

        const balanceBefore = sub.currentBalance;
        const balanceAfter = balanceBefore + packSize;

        // Record purchase
        await ctx.db.insert("creditPacks", {
            userId,
            packSize,
            creditsGranted: packSize,
            dodoPaymentId: args.paymentId,
            status: "completed",
            timestamp: Date.now(),
        });

        // Add credits to balance
        await ctx.db.patch(sub._id, {
            currentBalance: balanceAfter,
            updatedAt: Date.now(),
        });

        // Log transaction
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

        console.log(`✅ Credit pack applied: ${packSize} credits, balance: ${balanceBefore} → ${balanceAfter}`);
    },
});

// ─── Webhook: Payment failed ────────────────────────────────────────────────
export const handlePaymentFailed = internalMutation({
    args: {
        paymentId: v.string(),
        customerId: v.string(),
        payload: v.string(),
    },
    handler: async (ctx, args) => {
        console.error(`❌ Payment failed: ${args.paymentId} for customer: ${args.customerId}`);
    },
});
