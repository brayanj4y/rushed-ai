import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { prisma } from "@/lib/db";
import { addGems } from "@/lib/usage";
import { GEM_PACKS, GemPackType } from "@/lib/dodo";

const webhook = new Webhook(process.env.DODO_WEBHOOK_KEY!);

interface DodoPaymentPayload {
    type: string;
    data: {
        payment_id: string;
        status: string;
        metadata?: {
            userId?: string;
            packType?: string;
            gems?: string;
        };
        total_amount?: number;
        currency?: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();

        // Get webhook headers
        const webhookHeaders = {
            "webhook-id": request.headers.get("webhook-id") || "",
            "webhook-signature": request.headers.get("webhook-signature") || "",
            "webhook-timestamp": request.headers.get("webhook-timestamp") || "",
        };

        // Verify webhook signature
        try {
            await webhook.verify(rawBody, webhookHeaders);
        } catch (error) {
            console.error("Webhook verification failed:", error);
            return NextResponse.json(
                { error: "Invalid webhook signature" },
                { status: 401 }
            );
        }

        const payload = JSON.parse(rawBody) as DodoPaymentPayload;

        // Handle payment.succeeded event
        if (payload.type === "payment.succeeded" || payload.type === "payment.completed") {
            const { payment_id, metadata, total_amount, currency } = payload.data;

            if (!metadata?.userId || !metadata?.packType) {
                console.error("Missing metadata in webhook payload:", payload);
                return NextResponse.json(
                    { error: "Missing required metadata" },
                    { status: 400 }
                );
            }

            const packType = metadata.packType as GemPackType;
            const gems = metadata.gems ? parseInt(metadata.gems) : GEM_PACKS[packType]?.gems;

            if (!gems) {
                console.error("Invalid pack type:", packType);
                return NextResponse.json(
                    { error: "Invalid pack type" },
                    { status: 400 }
                );
            }

            // Check if we've already processed this payment (idempotency)
            const existingPurchase = await prisma.gemPurchase.findUnique({
                where: { paymentId: payment_id },
            });

            if (existingPurchase) {
                console.log("Payment already processed:", payment_id);
                return NextResponse.json({ received: true });
            }

            // Add gems to user's balance
            await addGems(metadata.userId, gems);

            // Record the purchase
            await prisma.gemPurchase.create({
                data: {
                    userId: metadata.userId,
                    packType,
                    gems,
                    amountPaid: total_amount || GEM_PACKS[packType]?.price || 0,
                    currency: currency || "USD",
                    paymentId: payment_id,
                },
            });

            console.log(`Added ${gems} gems to user ${metadata.userId} for payment ${payment_id}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
