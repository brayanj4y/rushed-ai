"use client";

import { useQuery } from "convex/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Coins01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { api } from "../../convex/_generated/api";

export const CreditBalancePill = ({ className }: { className?: string }) => {
    const usage = useQuery(api.credits.getUserUsage);

    if (!usage) {
        return (
            <Link href="/pricing">
                <button
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors",
                        className
                    )}
                >
                    <HugeiconsIcon icon={Coins01Icon} className="size-3" />
                    <span>Subscribe</span>
                </button>
            </Link>
        );
    }

    const balancePercent = usage.creditsMonthly > 0
        ? (usage.currentBalance / usage.creditsMonthly) * 100
        : 0;

    // Color coding based on remaining balance percentage
    const getColorClasses = () => {
        if (balancePercent > 50) return {
            bg: "bg-emerald-500/10",
            text: "text-emerald-400",
            border: "border-emerald-500/20",
            hover: "hover:bg-emerald-500/20",
        };
        if (balancePercent > 20) return {
            bg: "bg-amber-500/10",
            text: "text-amber-400",
            border: "border-amber-500/20",
            hover: "hover:bg-amber-500/20",
        };
        return {
            bg: "bg-red-500/10",
            text: "text-red-400",
            border: "border-red-500/20",
            hover: "hover:bg-red-500/20",
        };
    };

    const colors = getColorClasses();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        colors.bg, colors.text, `border ${colors.border}`,
                        className
                    )}
                >
                    <HugeiconsIcon icon={Coins01Icon} className="size-3" />
                    <span>{usage.currentBalance.toFixed(1)}</span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
                <div className="space-y-1">
                    <div className="font-medium capitalize">{usage.plan} Plan</div>
                    <div>Balance: {usage.currentBalance.toFixed(1)} / {usage.creditsMonthly} credits</div>
                    <div>Daily: {usage.dailyCreditsUsed.toFixed(1)} / {usage.dailyCap} credits used</div>
                    <div>Tokens: {(usage.dailyTokensUsed / 1000).toFixed(1)}K / {(usage.dailyTokenLimit / 1000)}K used</div>
                </div>
            </TooltipContent>
        </Tooltip>
    );
};
