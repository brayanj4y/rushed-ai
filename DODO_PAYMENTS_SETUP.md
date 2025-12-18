# Dodo Payments Setup Guide

This guide explains how to configure Dodo Payments for the gem pack subscription system.

## 1. Create Dodo Payments Account

1. Go to [app.dodopayments.com/signup](https://app.dodopayments.com/signup)
2. Complete registration and verify your email
3. Complete the merchant onboarding process

## 2. Create 5 Gem Pack Products

In the Dodo Payments Dashboard, create 5 one-time payment products:

| Product Name | Price (USD) | Gems |
|--------------|-------------|------|
| Starter Pack | $5.00 | 100 |
| Basic Pack | $9.00 | 200 |
| Standard Pack | $20.00 | 500 |
| Pro Pack | $35.00 | 1,000 |
| Enterprise Pack | $60.00 | 2,000 |

**To create each product:**
1. Go to **Products** in the dashboard
2. Click **Create Product**
3. Select **One-Time Payment**
4. Enter the name, price, and description
5. Save and copy the **Product ID** (e.g., `prod_xxx`)

## 3. Get Your API Keys

1. Go to **Developer → API** in the dashboard
2. Copy your **API Key**
3. Store it securely - you'll need it for the environment variables

## 4. Configure Webhooks

1. Go to **Developer → Webhooks**
2. Click **Create Webhook**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/dodo`
4. Select events: `payment.succeeded`, `payment.completed`
5. Copy the **Webhook Secret Key**

## 5. Set Environment Variables

Add these to your `.env.local` or production environment:

```bash
# Dodo Payments
DODO_PAYMENTS_API_KEY=your_api_key_here
DODO_WEBHOOK_KEY=your_webhook_secret_here

# Product IDs (from step 2)
DODO_PRODUCT_STARTER=prod_xxx
DODO_PRODUCT_BASIC=prod_xxx
DODO_PRODUCT_STANDARD=prod_xxx
DODO_PRODUCT_PRO=prod_xxx
DODO_PRODUCT_ENTERPRISE=prod_xxx

# App URL (for checkout return URL)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 6. Run Database Migration

After setting up your database, run:

```bash
npx prisma migrate dev --name gem_packs_subscription
```

This creates the new `Usage` and `GemPurchase` tables.

## 7. Test the Integration

### Test Mode
Dodo Payments provides a test mode. Toggle test mode in the dashboard, then:

1. Create test products (or use the same products with test mode enabled)
2. Use test card numbers provided by Dodo
3. Verify webhooks are received correctly

### Test Checkout Flow
1. Start your dev server: `npm run dev`
2. Navigate to `/pricing`
3. Click "Buy Now" on any pack
4. Complete the checkout with test credentials
5. Verify gems are added to your account

### Verify in Database
Use Prisma Studio to check:
```bash
npx prisma studio
```
- Check `Usage` table for updated gem balance
- Check `GemPurchase` table for purchase record

## 8. Go Live

When ready for production:
1. Toggle to **Live Mode** in Dodo dashboard
2. Update environment variables with live API keys
3. Create live products with the same configuration
4. Update product IDs in environment variables
5. Deploy your application

## Webhook Security

The webhook handler verifies signatures using the `standardwebhooks` library. This ensures:
- Requests are genuinely from Dodo Payments
- Payload hasn't been tampered with
- Protection against replay attacks

## Troubleshooting

### "Invalid webhook signature" error
- Verify `DODO_WEBHOOK_KEY` matches the secret in your dashboard
- Ensure the raw request body is used for verification

### Gems not being added
- Check webhook logs in Dodo dashboard
- Verify the `metadata` is being passed correctly in checkout session
- Check server logs for errors

### Checkout redirect issues
- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Ensure your domain is correctly configured

## Files Changed

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Updated Usage model, added GemPurchase |
| `src/lib/dodo.ts` | Dodo client and gem pack config |
| `src/lib/usage.ts` | Gem balance operations |
| `src/lib/gem-packs.ts` | Client-safe gem pack config |
| `src/app/api/checkout/route.ts` | Create checkout sessions |
| `src/app/api/webhooks/dodo/route.ts` | Handle payment webhooks |
| `src/app/(home)/pricing/page.tsx` | Custom gem pack pricing page |
| `src/modules/projects/ui/components/usage.tsx` | Simplified usage display |
