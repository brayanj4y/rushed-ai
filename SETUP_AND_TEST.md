# Dodo Payment Setup & Testing Guide

## Prerequisites

1. **Clerk Auth**: Already configured — Clerk is used only for authentication.
2. **Convex Dev Server**: Should be running via `npx convex dev` (or `npm run dev` which starts it).
3. **Dodo Dashboard**: Must have 6 products created (3 subscriptions + 3 credit packs).

---

## Environment Variables (Convex)

These must be set in **Convex environment variables** (not `.env.local`) via the Convex dashboard or `npx convex env set`:

| Variable | Description |
|----------|-------------|
| `DODO_PAYMENTS_API_KEY` | Your Dodo Payments API key |
| `DODO_PAYMENTS_ENVIRONMENT` | `test_mode` or `live_mode` |
| `DODO_WEBHOOK_KEY` | Webhook verification secret from Dodo |
| `DODO_STARTER_PRODUCT_ID` | Product ID for Starter subscription |
| `DODO_PRO_PRODUCT_ID` | Product ID for Pro subscription |
| `DODO_SCALE_PRODUCT_ID` | Product ID for Scale subscription |
| `DODO_CREDIT_PACK_SMALL_ID` | Product ID for 50-credit pack |
| `DODO_CREDIT_PACK_MEDIUM_ID` | Product ID for 150-credit pack |
| `DODO_CREDIT_PACK_LARGE_ID` | Product ID for 400-credit pack |
| `RUSHED_CONVEX_INTERNAL_KEY` | Internal key for server-to-Convex mutations |

---

## Webhook Setup

1. Go to **Dodo Dashboard** → **Webhooks**
2. Create a new webhook with the URL:
   ```
   https://<your-convex-deployment>.convex.site/dodopayments-webhook
   ```
   For your deployment: `https://energetic-roadrunner-93.convex.site/dodopayments-webhook`
3. Subscribe to all events:
   - `subscription.active`
   - `subscription.renewed`
   - `subscription.cancelled`
   - `subscription.failed`
   - `payment.succeeded`
   - `payment.failed`
4. Copy the webhook signing secret and set it as `DODO_WEBHOOK_KEY` in Convex env.

---

## Product IDs (Current Setup)

| Product | ID | Price |
|---------|-----|-------|
| Starter | `pdt_0NYGPMDqdFzDFFmFOb7wD` | $19/mo |
| Pro | `pdt_0NYGQUjP7QiNKYiI7cTug` | $49/mo |
| Scale | `pdt_0NYGRBlvE5XJaIiwfw3K3` | $99/mo |
| Small Pack (50cr) | `pdt_0NYGRg1WaClLb7pxpyuLw` | $10 |
| Medium Pack (150cr) | `pdt_0NYGRpDVzSSx5oqbIALMS` | $25 |
| Large Pack (400cr) | `pdt_0NYGRxKM0vqYB5wrSyqDM` | $60 |

---

## Testing Guide

### 1. Pricing Page
- Navigate to `/pricing`
- Verify 3 subscription cards render with pricing, features, and Subscribe buttons
- Verify 3 credit pack cards render below
- Click "Subscribe" → should redirect to Dodo checkout (test mode)

### 2. Subscription Flow
1. Complete checkout for any plan in Dodo test mode
2. Dodo fires `subscription.active` webhook → creates subscription in Convex
3. Verify in Convex dashboard: `subscriptions` table has new entry
4. Verify credit balance matches plan (Starter=50, Pro=150, Scale=400)

### 3. Credit Balance Pill
After subscribing:
- **Dashboard** (`/`): Pill appears next to logo with UserButton
- **Project Navbar**: Pill appears next to UserButton in project page
- **Chat Input**: Pill appears above the chat prompt area
- **Color**: Green (>50%), Yellow (20-50%), Red (<20% balance)
- **Click**: Opens billing popup dialog

### 4. Billing Popup
- Click the credit pill → popup opens
- Shows: credit balance gauge, daily credit/token usage bars
- "Manage Subscription" → opens Dodo customer portal
- "Upgrade / Buy Credits" → navigates to `/pricing`
- Transaction history shows recent credit movements

### 5. Credit Deduction
1. Send a message in a project chat
2. Verify credit is deducted (check pill balance decreases)
3. Verify `transactions` table has a debit entry
4. Check `dailyCreditsUsed` and `dailyTokensUsed` increase in subscription

### 6. Daily Cap Enforcement
1. Send enough messages to hit daily credit cap
2. Next request should return 403 with "daily credit limit" error
3. Token limit works similarly

### 7. Credit Pack Purchase
1. Go to `/pricing`, click "Buy Now" on a credit pack
2. Complete checkout → credits added to balance
3. Verify balance increased but daily cap stays the same

### 8. Daily Reset
- Daily limits reset automatically at midnight UTC via Convex cron
- Verify `dailyCreditsUsed` and `dailyTokensUsed` reset to 0

---

## Plan Configuration

| Plan | Credits/Month | Daily Cap | Daily Token Limit | Price |
|------|--------------|-----------|-------------------|-------|
| Starter | 50 | 3 | 40K | $19/mo |
| Pro | 150 | 8 | 120K | $49/mo |
| Scale | 400 | 18 | 250K | $99/mo |

**Credit formula**: `((input_tokens × $0.000003) + (output_tokens × $0.000015)) / $0.30`

---

## Architecture Overview

```
User → Clerk Auth → Next.js API Route → Pre-flight Credit Check (Convex)
                                       → Inngest (AI processing)
                                       → Post-response Credit Deduction (Convex)

Dodo Dashboard → Webhook POST → Convex HTTP Handler → Internal Mutations
                                                     → Create/Update Subscription
                                                     → Grant Credits

Daily Cron (midnight UTC) → Reset dailyCreditsUsed & dailyTokensUsed
```
