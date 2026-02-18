import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getByAuthId = internalQuery({
    args: { authId: v.string() },
    handler: async (ctx, { authId }) => {
        return await ctx.db
            .query("customers")
            .withIndex("by_auth_id", (q) => q.eq("authId", authId))
            .first();
    },
});

export const getByDodoCustomerId = internalQuery({
    args: { dodoCustomerId: v.string() },
    handler: async (ctx, { dodoCustomerId }) => {
        return await ctx.db
            .query("customers")
            .withIndex("by_dodo_customer_id", (q) =>
                q.eq("dodoCustomerId", dodoCustomerId)
            )
            .first();
    },
});

export const getByEmail = internalQuery({
    args: { email: v.string() },
    handler: async (ctx, { email }) => {
        return await ctx.db
            .query("customers")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first();
    },
});

export const createCustomer = internalMutation({
    args: {
        authId: v.string(),
        email: v.string(),
        dodoCustomerId: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("customers")
            .withIndex("by_auth_id", (q) => q.eq("authId", args.authId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                dodoCustomerId: args.dodoCustomerId,
            });
            return existing._id;
        }

        return await ctx.db.insert("customers", {
            authId: args.authId,
            email: args.email,
            dodoCustomerId: args.dodoCustomerId,
            createdAt: Date.now(),
        });
    },
});
