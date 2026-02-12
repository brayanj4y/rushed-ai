import { createDodoWebhookHandler } from "@dodopayments/convex";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/dodopayments-webhook",
    method: "POST",
    handler: createDodoWebhookHandler({
        onSubscriptionActive: async (ctx, payload) => {
            console.log("🎉 Subscription Activated!");
            const data = payload.data as any;
            await ctx.runMutation(internal.webhooks.handleSubscriptionActive, {
                subscriptionId: data.subscription_id,
                customerId: data.customer?.customer_id ?? payload.business_id,
                customerEmail: data.customer?.email ?? "",
                productId: data.product_id ?? "",
                status: data.status,
                clerkUserId: data.metadata?.clerkUserId ?? "",
                payload: JSON.stringify(payload),
            });
        },

        onSubscriptionRenewed: async (ctx, payload) => {
            console.log("🔄 Subscription Renewed!");
            const data = payload.data as any;
            await ctx.runMutation(internal.webhooks.handleSubscriptionRenewed, {
                subscriptionId: data.subscription_id,
                customerId: data.customer?.customer_id ?? payload.business_id,
                productId: data.product_id ?? "",
                clerkUserId: data.metadata?.clerkUserId ?? "",
                payload: JSON.stringify(payload),
            });
        },

        onSubscriptionCancelled: async (ctx, payload) => {
            console.log("❌ Subscription Cancelled!");
            const data = payload.data as any;
            await ctx.runMutation(internal.webhooks.handleSubscriptionCancelled, {
                subscriptionId: data.subscription_id,
                payload: JSON.stringify(payload),
            });
        },

        onSubscriptionFailed: async (ctx, payload) => {
            console.log("⚠️ Subscription Payment Failed!");
            const data = payload.data as any;
            await ctx.runMutation(internal.webhooks.handleSubscriptionFailed, {
                subscriptionId: data.subscription_id,
                payload: JSON.stringify(payload),
            });
        },

        onPaymentSucceeded: async (ctx, payload) => {
            console.log("💰 Payment Succeeded!");
            const data = payload.data as any;
            await ctx.runMutation(internal.webhooks.handlePaymentSucceeded, {
                paymentId: data.payment_id,
                customerId: data.customer?.customer_id ?? payload.business_id,
                customerEmail: data.customer?.email ?? "",
                productId: data.product_id ?? "",
                amount: data.total_amount ?? 0,
                currency: data.currency ?? "USD",
                clerkUserId: data.metadata?.clerkUserId ?? "",
                payload: JSON.stringify(payload),
            });
        },

        onPaymentFailed: async (ctx, payload) => {
            console.log("❌ Payment Failed!");
            const data = payload.data as any;
            await ctx.runMutation(internal.webhooks.handlePaymentFailed, {
                paymentId: data.payment_id ?? "",
                customerId: data.customer?.customer_id ?? payload.business_id,
                payload: JSON.stringify(payload),
            });
        },
    }),
});

export default http;
