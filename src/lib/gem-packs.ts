// Client-side gem pack configuration
// This mirrors the server-side config but without env vars for client components

export const GEM_PACKS_CLIENT = {
    starter: { gems: 100, price: 500 },
    basic: { gems: 200, price: 900 },
    standard: { gems: 500, price: 2000 },
    pro: { gems: 1000, price: 3500 },
    enterprise: { gems: 2000, price: 6000 },
} as const;

export type GemPackType = keyof typeof GEM_PACKS_CLIENT;
