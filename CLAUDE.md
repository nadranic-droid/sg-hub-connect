# CLAUDE.md - Project Guide for Claude Code

## Project Overview

**Humble Halal (sg-hub-connect)** is a comprehensive business directory platform for Singapore's halal business community. It enables users to discover, submit, and review halal businesses across Singapore.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State/Data**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Image Hosting**: Cloudinary
- **Maps**: Mapbox GL
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: TipTap editor
- **SEO**: React Helmet Async

## Quick Commands

```bash
# Development
npm run dev         # Start dev server at localhost:8080

# Build
npm run build       # Production build
npm run build:dev   # Development build

# Lint
npm run lint        # Run ESLint

# Preview
npm run preview     # Preview production build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── BusinessCard.tsx
│   ├── CategoryHub.tsx  # Reusable hub page template
│   ├── HeroSection.tsx
│   ├── SearchAutocomplete.tsx
│   └── ...
├── pages/              # Route page components
│   ├── admin/          # Admin dashboard pages
│   ├── Index.tsx       # Homepage
│   ├── BusinessDetail.tsx
│   ├── RestaurantHub.tsx, CafeHub.tsx, etc.  # Hub pages
│   └── ...
├── hooks/              # Custom React hooks (useGeoLocation.ts)
├── integrations/       # Supabase client setup
├── utils/              # Utility functions (webhooks, SEO schemas, cloudinary)
├── lib/                # Shared utilities (cn function)
├── config/             # Configuration files
├── App.tsx             # Main app with routes
└── main.tsx            # Entry point

supabase/
├── functions/          # Edge functions (checkout, webhooks, sitemap, SEO)
└── migrations/         # Database migration files

public/
└── badges/             # Badge image assets
```

## Key Conventions

### Path Aliases
- Use `@/` for imports from `src/` (e.g., `import { Button } from "@/components/ui/button"`)

### Component Patterns
- shadcn/ui components in `src/components/ui/`
- Page components in `src/pages/`
- Admin pages in `src/pages/admin/`
- Hub pages use the `CategoryHub` component as a template

### TypeScript
- Project uses relaxed TypeScript settings (`noImplicitAny: false`, `strictNullChecks: false`)
- Type definitions in `@types/` packages

### Styling
- Tailwind CSS with custom configuration
- Use `cn()` utility from `@/lib/utils` for conditional classes
- tailwindcss-animate for animations

### Data Fetching
- TanStack Query for server state
- Supabase client in `src/integrations/supabase/`

### Forms
- React Hook Form with Zod schemas for validation

## Database Schema (Supabase)

Key tables:
- `businesses` - Business listings with status (pending/approved/rejected)
- `categories` - Business categories (restaurants, cafes, etc.)
- `neighbourhoods` - Singapore neighbourhoods with regions
- `cities`, `states` - Geographic hierarchy
- `reviews` - User reviews
- `events` - Community events
- `articles` - Blog/article content
- `ad_slots` - Advertisement placements
- `badge_requests` - Verification badge requests
- `claims` - Business ownership claims

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_SITE_URL=https://humblehalal.sg
```

Optional:
```
VITE_GOHIGHLEVEL_WEBHOOK_URL=
VITE_MAPBOX_TOKEN=
```

## Key Features

### Hub Pages
8 SEO-optimized hub pages for major categories:
- `/restaurant-hub`, `/cafe-hub`, `/lawyers-hub`, `/mosques-hub`
- `/groceries-hub`, `/healthcare-hub`, `/education-hub`, `/beauty-hub`

### Admin Features
- Business approval workflow
- CSV batch import (50-100 records per batch)
- User management
- Content management (articles, events)
- Ad management
- Analytics dashboard

### SEO Implementation
- React Helmet Async for meta tags
- Schema.org structured data in `src/utils/seoSchemas.ts`
- Breadcrumbs on all pages
- Sitemap generation via Supabase Edge Function

### Image Handling
- Cloudinary for uploads and optimization
- Fallback system for missing images
- Upload utility in `src/utils/cloudinary.ts`

## Development Notes

### Adding New Hub Pages
1. Create page in `src/pages/` (use existing hub as template)
2. Add route in `src/App.tsx`
3. Use `CategoryHub` component for consistent layout

### Working with Supabase
- Client setup in `src/integrations/supabase/client.ts`
- RLS policies protect data access
- Migrations in `supabase/migrations/`

### Security Considerations
- XSS protection via DOMPurify for HTML content
- Input validation with Zod
- Secure file uploads with Cloudinary presets
- RLS policies on all Supabase tables

## Testing

No test framework currently configured. Manual testing required.

## Deployment

Build outputs to `dist/` directory. Compatible with static hosting (Vercel, Netlify, Cloudflare Pages).
