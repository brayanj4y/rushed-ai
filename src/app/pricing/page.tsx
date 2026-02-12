"use client";

import { useQuery, useAction } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Tick02Icon,
    ArrowLeft01Icon,
    Loading03Icon,
    PackageIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

import { api } from "../../../convex/_generated/api";

// Plan configuration
const PLANS = [
    {
        id: "starter",
        name: "Starter",
        price: 19,
        badge: null,
        tagline: "Good for individuals who are just starting out and want to explore AI-powered development.",
        featuresTitle: "What's included:",
        features: [
            "50 credits/month",
            "3 credits/day cap",
            "40K tokens/day limit",
            "Standard queue",
        ],
        productId: process.env.NEXT_PUBLIC_DODO_STARTER_PRODUCT_ID!,
    },
    {
        id: "pro",
        name: "Pro",
        price: 49,
        badge: "Recommended",
        tagline: "Highly recommended for builders who ship daily and need more headroom.",
        featuresTitle: "Everything in Starter, plus:",
        features: [
            "150 credits/month",
            "8 credits/day cap",
            "120K tokens/day limit",
            "Standard queue",
        ],
        productId: process.env.NEXT_PUBLIC_DODO_PRO_PRODUCT_ID!,
    },
    {
        id: "scale",
        name: "Scale",
        price: 99,
        badge: null,
        tagline: "Maximum capacity for power users and heavy workloads with priority access.",
        featuresTitle: "Everything in Pro, plus:",
        features: [
            "400 credits/month",
            "18 credits/day cap",
            "250K tokens/day limit",
            "Priority queue",
        ],
        productId: process.env.NEXT_PUBLIC_DODO_SCALE_PRODUCT_ID!,
    },
] as const;

const CREDIT_PACKS = [
    {
        size: 50,
        price: 10,
        label: "Small Pack",
        description: "A quick top-up for light usage. Adds 50 credits to your current balance.",
        productId: process.env.NEXT_PUBLIC_DODO_CREDIT_PACK_SMALL_ID!,
    },
    {
        size: 150,
        price: 25,
        label: "Medium Pack",
        description: "Best value for regular builders. Adds 150 credits to your current balance.",
        productId: process.env.NEXT_PUBLIC_DODO_CREDIT_PACK_MEDIUM_ID!,
    },
    {
        size: 400,
        price: 60,
        label: "Large Pack",
        description: "Maximum credits for heavy workloads. Adds 400 credits to your current balance.",
        productId: process.env.NEXT_PUBLIC_DODO_CREDIT_PACK_LARGE_ID!,
    },
] as const;

export default function PricingPage() {
    const subscription = useQuery(api.subscriptions.getByUserId);
    const createCheckout = useAction(api.payments.createCheckout);
    const getCustomerPortal = useAction(api.payments.getCustomerPortal);
    const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
    const [loadingPortal, setLoadingPortal] = useState(false);

    const handleCheckout = async (productId: string) => {
        setLoadingProduct(productId);
        try {
            const session = await createCheckout({
                product_cart: [{ product_id: productId, quantity: 1 }],
                returnUrl: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
            });

            if (session?.checkout_url) {
                window.location.href = session.checkout_url;
            }
        } catch (error) {
            toast.error("Failed to start checkout. Please try again.");
            console.error("Checkout failed:", error);
        } finally {
            setLoadingProduct(null);
        }
    };

    const handleManageSubscription = async () => {
        setLoadingPortal(true);
        try {
            const portal = await getCustomerPortal({});
            if (portal?.portal_url) {
                window.location.href = portal.portal_url;
            }
        } catch (error) {
            toast.error("Unable to open subscription management. Please try again.");
            console.error("Portal failed:", error);
        } finally {
            setLoadingPortal(false);
        }
    };

    const isSubscribed = subscription?.status === "active";

    return (
        <div className="min-h-screen bg-sidebar">
            {/* Back button */}
            <div className="max-w-6xl mx-auto px-6 pt-8">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center justify-center size-12 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-border transition-all cursor-pointer"
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-5" />
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Hero — split layout like reference */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-md">
                        {isSubscribed ? "Manage your plan" : "Simple pricing based on your needs"}
                    </h1>
                    <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                        {isSubscribed
                            ? "You're all set. Grab extra credits, switch plans, or manage your billing anytime."
                            : "Credit-based pricing that scales with your usage. No hidden fees, cancel anytime."}
                    </p>
                </div>

                {/* Subscription Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
                    {PLANS.map((plan) => {
                        const isCurrentPlan = isSubscribed && subscription?.plan === plan.id;
                        const isPro = plan.id === "pro";

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-2xl border p-6 flex flex-col transition-all
                                    ${isCurrentPlan
                                        ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                                        : "border-border/60 bg-card/60 hover:border-border"
                                    }`}
                            >
                                {/* Badge */}
                                {(plan.badge || isCurrentPlan) && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${isCurrentPlan
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-foreground text-background"
                                            }`}
                                        >
                                            {isCurrentPlan ? "Current plan" : plan.badge}
                                        </span>
                                    </div>
                                )}

                                {/* Plan name */}
                                <h3 className="text-lg font-semibold mt-1">{plan.name}</h3>

                                {/* Price */}
                                <div className="mt-3 mb-3">
                                    <span className="text-xs text-muted-foreground">Starts at</span>
                                    <div className="flex items-baseline gap-1.5 mt-0.5">
                                        <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
                                        <span className="text-sm text-muted-foreground">per month</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                    {plan.tagline}
                                </p>

                                {/* CTA Button */}
                                <Button
                                    className={`w-full h-11 font-medium mb-6
                                        ${isCurrentPlan
                                            ? "bg-muted text-muted-foreground cursor-default hover:bg-muted"
                                            : isPro && !isSubscribed
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                : ""
                                        }`}
                                    variant={isPro && !isSubscribed ? "default" : isCurrentPlan ? "ghost" : "outline"}
                                    disabled={isCurrentPlan || loadingProduct === plan.productId}
                                    onClick={() => handleCheckout(plan.productId)}
                                >
                                    {loadingProduct === plan.productId ? (
                                        <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                                    ) : isCurrentPlan ? (
                                        "Current Plan"
                                    ) : isSubscribed ? (
                                        "Switch Plan"
                                    ) : (
                                        "Get started"
                                    )}
                                </Button>

                                {/* Features */}
                                <div className="border-t border-border/40 pt-5 flex-1">
                                    <p className="text-sm font-medium mb-3">{plan.featuresTitle}</p>
                                    <ul className="space-y-2.5">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                                <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4 text-foreground shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Credit Packs Section */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Credit Packs</h2>
                        <p className="text-sm text-muted-foreground mt-1.5">
                            One-time purchases that add to your balance. Packs do not increase daily caps.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {CREDIT_PACKS.map((pack) => (
                        <div
                            key={pack.size}
                            className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col hover:border-border transition-all"
                        >
                            {/* Pack name */}
                            <div className="flex items-center gap-2 mb-3">
                                <HugeiconsIcon icon={PackageIcon} strokeWidth={2} className="size-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">{pack.label}</h3>
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                                <span className="text-xs text-muted-foreground">One-time</span>
                                <div className="flex items-baseline gap-1.5 mt-0.5">
                                    <span className="text-4xl font-bold tracking-tight">${pack.price}</span>
                                    <span className="text-sm text-muted-foreground">for {pack.size} credits</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                                {pack.description}
                            </p>

                            {/* CTA */}
                            <Button
                                variant="outline"
                                className="w-full h-11 font-medium"
                                disabled={!isSubscribed || loadingProduct === pack.productId}
                                onClick={() => handleCheckout(pack.productId)}
                            >
                                {loadingProduct === pack.productId ? (
                                    <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                                ) : !isSubscribed ? (
                                    "Subscribe first"
                                ) : (
                                    "Buy Now"
                                )}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-muted-foreground mt-14">
                    All plans include full access to Rushed AI. Daily limits reset at midnight UTC.
                </p>
            </div>
        </div>
    );
}
