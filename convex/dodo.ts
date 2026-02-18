import { DodoPayments } from "@dodopayments/convex";
import type { DodoPaymentsClientConfig } from "@dodopayments/convex";
import { components } from "./_generated/api";
import { internal } from "./_generated/api";

export const dodo = new DodoPayments(components.dodopayments, {
    identify: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        // Step 1: Find customer by Clerk auth ID
        let customer = await ctx.runQuery(internal.customers.getByAuthId, {
            authId: identity.subject,
        });

        // Step 2: Fallback to email lookup
        if ((!customer || !customer.dodoCustomerId) && identity.email) {
            const customerByEmail = await ctx.runQuery(internal.customers.getByEmail, {
                email: identity.email,
            });
            if (customerByEmail && customerByEmail.dodoCustomerId) {
                customer = customerByEmail;
            }
        }

        if (customer && customer.dodoCustomerId) {
            return {
                dodoCustomerId: customer.dodoCustomerId,
            };
        }

        // No customer exists yet — pre-register so webhook can find them
        if (!customer) {
            await ctx.runMutation(internal.customers.createCustomer, {
                authId: identity.subject,
                email: identity.email ?? "",
                dodoCustomerId: "",
            });
        }

        return null;
    },
    apiKey: process.env.DODO_PAYMENTS_API_KEY!,
    environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") ?? "test_mode",
} as DodoPaymentsClientConfig);

export const { checkout, customerPortal } = dodo.api();

