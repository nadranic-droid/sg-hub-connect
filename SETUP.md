# Setup Guide - Humble Halal Web App

This guide walks you through getting the Humble Halal web app fully functioning.

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# App runs at http://localhost:8080
```

## Environment Variables

The `.env` file contains all configuration. Here's what each variable does:

### Required (Already Configured)
```env
VITE_SUPABASE_PROJECT_ID="wgbgnrzogqonndoeijju"
VITE_SUPABASE_PUBLISHABLE_KEY="<your-anon-key>"
VITE_SUPABASE_URL="https://wgbgnrzogqonndoeijju.supabase.co"
```

### Required (For Image Uploads)
```env
VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"
VITE_CLOUDINARY_UPLOAD_PRESET="sg_hub_uploads"
```

### Optional Services
```env
# Site URL for SEO/badge generation
VITE_SITE_URL="https://humblehalal.sg"

# Mapbox (for location maps)
VITE_MAPBOX_TOKEN="pk.your-mapbox-token"

# GoHighLevel (for business submission webhooks)
VITE_GOHIGHLEVEL_WEBHOOK_URL="https://your-webhook-url"

# Stripe (for payments/featured listings)
VITE_STRIPE_FEATURED_MONTHLY_PRICE_ID="price_xxx"
VITE_STRIPE_FEATURED_QUARTERLY_PRICE_ID="price_xxx"
VITE_STRIPE_FEATURED_YEARLY_PRICE_ID="price_xxx"
```

## Database Setup (Supabase)

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref wgbgnrzogqonndoeijju

# Push all migrations
supabase db push
```

### Option 2: Manual Migration

Run each migration file in order via Supabase Dashboard SQL Editor:

1. `20251122091041_*.sql` - Core schema (businesses, users, categories, etc.)
2. `20251122091059_*.sql` - Updated_at trigger function
3. `20251122140505_*.sql` - Row Level Security policies
4. `20251122141430_*.sql` - Performance indexes
5. `20251122150000_ad_analytics.sql` - Analytics tables
6. `20251122160000_geo_rpc.sql` - Geolocation functions
7. `20251123000000_featured_listing_upgrade.sql` - Featured listing tables
8. `20251123000001_city_state_structure.sql` - City/state hierarchy
9. `20251123021054_*.sql` - Additional tables
10. `20251124000000_badge_requests.sql` - Badge request system
11. `20251124100000_fix_submission_security.sql` - Security policies

### Seed Data

After migrations, add initial data via Supabase Dashboard:

**Categories** (required for business listings):
- Restaurants, Cafes, Lawyers, Mosques, Groceries, Healthcare, Education, Beauty

**Neighbourhoods** (required for location features):
- Add Singapore neighbourhoods with regions (e.g., Tampines - East, Jurong - West)

## Edge Functions Deployment

### Prerequisites
Set these secrets in Supabase Dashboard > Project Settings > Edge Functions:

```bash
# For Stripe payments
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# For database access in functions
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# For SEO optimization (optional)
OPENAI_API_KEY=sk-xxx
```

### Deploy Functions

```bash
# Deploy all functions
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
supabase functions deploy check-subscription
supabase functions deploy customer-portal
supabase functions deploy sitemap
supabase functions deploy optimize-seo
```

### Stripe Webhook Configuration

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://wgbgnrzogqonndoeijju.supabase.co/functions/v1/stripe-webhook`
3. Select events: `checkout.session.completed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## External Services Setup

### Cloudinary (Image Uploads)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to Settings > Upload > Upload presets
3. Create unsigned preset named `sg_hub_uploads`
4. Copy cloud name to `VITE_CLOUDINARY_CLOUD_NAME`

### Mapbox (Maps)

1. Create account at [mapbox.com](https://mapbox.com)
2. Go to Account > Tokens
3. Create a public token or use default
4. Add to `VITE_MAPBOX_TOKEN`

### Stripe (Payments)

1. Create account at [stripe.com](https://stripe.com)
2. Create 3 products for featured listings:
   - Featured Monthly
   - Featured Quarterly
   - Featured Yearly
3. Copy price IDs to `.env`
4. Set up webhook (see above)

### GoHighLevel (Optional)

1. Get your webhook URL from GoHighLevel
2. Add to `VITE_GOHIGHLEVEL_WEBHOOK_URL`
3. Used for notifications when businesses are submitted

## Commands Reference

```bash
# Development
npm run dev          # Start dev server (localhost:8080)

# Production
npm run build        # Create production build in dist/
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Supabase CLI
supabase db push     # Apply migrations
supabase functions deploy <name>  # Deploy edge function
supabase secrets set KEY=value    # Set function secrets
```

## Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] Stripe webhook configured
- [ ] Test user registration/login
- [ ] Test business submission
- [ ] Test image uploads

### Production Environment
- [ ] Set all VITE_* variables in hosting platform
- [ ] Update `VITE_SITE_URL` to production domain
- [ ] Configure Stripe for production (live keys)
- [ ] Update Stripe webhook URL to production domain

### Hosting Options
- **Vercel**: `npm run build` → deploy `dist/`
- **Netlify**: `npm run build` → deploy `dist/`
- **Cloudflare Pages**: `npm run build` → deploy `dist/`

## Troubleshooting

### "Missing Supabase URL or Key"
Check `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

### Images not uploading
- Verify Cloudinary cloud name and upload preset
- Check browser console for CORS errors
- Ensure upload preset is set to "Unsigned"

### Maps not showing
- Add `VITE_MAPBOX_TOKEN` to `.env`
- Token must start with `pk.`

### Payments not working
- Verify Stripe price IDs are correct
- Check edge function logs in Supabase Dashboard
- Ensure `STRIPE_SECRET_KEY` is set in function secrets

### Database queries failing
- Run all migrations in order
- Check RLS policies are enabled
- Verify user has correct permissions

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                     │
│  localhost:8080 / production domain                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │  Cloudinary  │  │    Stripe    │
│  (Database,  │  │   (Images)   │  │  (Payments)  │
│  Auth, RLS)  │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Edge Functions                             │
│  create-checkout, stripe-webhook, sitemap, optimize-seo      │
└──────────────────────────────────────────────────────────────┘
```

## Support

For issues, check:
1. Browser developer console for errors
2. Supabase Dashboard > Logs
3. Network tab for failed API requests
