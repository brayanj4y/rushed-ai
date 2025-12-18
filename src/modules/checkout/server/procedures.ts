import { dodo, GEM_PACKS, GemPackType } from "@/lib/dodo";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const checkoutRouter = createTRPCRouter({
    createSession: protectedProcedure
        .input(
            z.object({
                packType: z.enum(["starter", "basic", "standard", "pro", "enterprise"]),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const pack = GEM_PACKS[input.packType as GemPackType];

            if (!pack) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid pack type",
                });
            }

            try {
                const session = await dodo.checkoutSessions.create({
                    product_cart: [
                        {
                            product_id: pack.productId,
                            quantity: 1,
                        },
                    ],
                    metadata: {
                        userId: ctx.auth.userId,
                        packType: input.packType,
                        gems: pack.gems.toString(),
                    },
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?success=true`,
                });

                return {
                    checkoutUrl: session.checkout_url,
                };
            } catch (error) {
                console.error("Dodo checkout error:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create checkout session",
                });
            }
        }),
});
