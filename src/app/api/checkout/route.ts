import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { dodo, GEM_PACKS, GemPackType } from "@/lib/dodo";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const packType = body.packType as GemPackType;

        if (!packType || !GEM_PACKS[packType]) {
            return NextResponse.json(
                { error: "Invalid pack type" },
                { status: 400 }
            );
        }

        const pack = GEM_PACKS[packType];

        // Create Dodo checkout session
        const session = await dodo.checkoutSessions.create({
            product_cart: [
                {
                    product_id: pack.productId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
                packType,
                gems: pack.gems.toString(),
            },
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?success=true`,
        });

        return NextResponse.json({
            checkoutUrl: session.checkout_url,
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
