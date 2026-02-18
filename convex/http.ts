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
            console.log("📦 Full subscription payload:", JSON.stringify(payload, null, 2));
            const data = payload.data as any;
            await ctx.runMutation(internal.webhooks.handleSubscriptionActive, {
                subscriptionId: data.subscription_id,
                customerId: data.customer?.customer_id ?? "",
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
                customerId: data.customer?.customer_id ?? "",
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
            console.log("📦 Full payment payload:", JSON.stringify(payload, null, 2));
            const data = payload.data as any;

            // Payment uses product_cart (array), NOT product_id
            // Extract first product from the cart
            const productId = data.product_cart?.[0]?.product_id ?? "";

            // metadata is at data.metadata (top level of Payment schema)
            const clerkUserId = data.metadata?.clerkUserId ?? "";

            console.log(`📋 Extracted — productId: ${productId}, clerkUserId: ${clerkUserId}, paymentId: ${data.payment_id}`);

            await ctx.runMutation(internal.webhooks.handlePaymentSucceeded, {
                paymentId: data.payment_id,
                customerId: data.customer?.customer_id ?? "",
                customerEmail: data.customer?.email ?? "",
                productId,
                amount: data.total_amount ?? 0,
                currency: data.currency ?? "USD",
                clerkUserId,
                payload: JSON.stringify(payload),
            });
        },

        onPaymentFailed: async (ctx, payload) => {
            console.log("❌ Payment Failed!");
            const data = payload.data as any;
            await ctx.runMutation(internal.webhooks.handlePaymentFailed, {
                paymentId: data.payment_id ?? "",
                customerId: data.customer?.customer_id ?? "",
                payload: JSON.stringify(payload),
            });
        },
    }),
});

export default http;
