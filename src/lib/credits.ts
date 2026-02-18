// Credit system utility constants for server-side enforcement

export const PLAN_CONFIG = {
    starter: {
        creditsMonthly: 50,
        dailyCap: 3,
        dailyTokenLimit: 40000,
        price: 19,
    },
    pro: {
        creditsMonthly: 150,
        dailyCap: 8,
        dailyTokenLimit: 120000,
        price: 49,
    },
    scale: {
        creditsMonthly: 400,
        dailyCap: 18,
        dailyTokenLimit: 250000,
        price: 99,
    },
} as const;

export const CREDIT_PACKS = [
    { size: 50, price: 10, label: "Small Pack" },
    { size: 150, price: 25, label: "Medium Pack" },
    { size: 400, price: 60, label: "Large Pack" },
] as const;

// Credit cost constants
export const CREDIT_COST_USD = 0.30;
export const INPUT_TOKEN_COST = 0.000003;
export const OUTPUT_TOKEN_COST = 0.000015;
export const MAX_TOKENS_PER_REQUEST = 120000;

/**
 * Calculate credits to deduct based on token usage.
 * Formula: ((input_tokens * $0.000003) + (output_tokens * $0.000015)) / $0.30
 */
export function calculateCredits(inputTokens: number, outputTokens: number): number {
    const apiCost = (inputTokens * INPUT_TOKEN_COST) + (outputTokens * OUTPUT_TOKEN_COST);
    return apiCost / CREDIT_COST_USD;
}

// Product IDs from Dodo dashboard
export const PRODUCT_IDS = {
    starter: process.env.DODO_STARTER_PRODUCT_ID ?? "",
    pro: process.env.DODO_PRO_PRODUCT_ID ?? "",
    scale: process.env.DODO_SCALE_PRODUCT_ID ?? "",
    creditPackSmall: process.env.DODO_CREDIT_PACK_SMALL_ID ?? "",
    creditPackMedium: process.env.DODO_CREDIT_PACK_MEDIUM_ID ?? "",
    creditPackLarge: process.env.DODO_CREDIT_PACK_LARGE_ID ?? "",
} as const;

// Human-readable error messages for credit check failures
export const CREDIT_ERROR_MESSAGES: Record<string, string> = {
    no_subscription: "You need an active subscription to use AI features. Please subscribe to a plan.",
    subscription_inactive: "Your subscription is not active. Please update your payment method or resubscribe.",
    insufficient_credits: "You've run out of credits for this billing period. Purchase a credit pack or wait for your monthly renewal.",
    daily_cap_exceeded: "You've reached your daily credit limit. Your cap resets at midnight UTC.",
    daily_token_limit_exceeded: "You've reached your daily token limit. Your limit resets at midnight UTC.",
};
