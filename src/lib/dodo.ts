import DodoPayments from 'dodopayments';

export const dodo = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
});

// Gem pack configuration
// Price is in cents (USD)
export const GEM_PACKS = {
    starter: { gems: 100, price: 500, productId: process.env.DODO_PRODUCT_STARTER! },
    basic: { gems: 200, price: 900, productId: process.env.DODO_PRODUCT_BASIC! },
    standard: { gems: 500, price: 2000, productId: process.env.DODO_PRODUCT_STANDARD! },
    pro: { gems: 1000, price: 3500, productId: process.env.DODO_PRODUCT_PRO! },
    enterprise: { gems: 2000, price: 6000, productId: process.env.DODO_PRODUCT_ENTERPRISE! },
} as const;

export type GemPackType = keyof typeof GEM_PACKS;

// Token to gem conversion: 500 tokens = 1 gem
export const TOKENS_PER_GEM = 500;

/**
 * Calculate gems needed for a given number of tokens
 * Rounds up to ensure we always charge enough
 */
export function calculateGemsForTokens(inputTokens: number, outputTokens: number): number {
    const totalTokens = inputTokens + outputTokens;
    return Math.ceil(totalTokens / TOKENS_PER_GEM);
}
