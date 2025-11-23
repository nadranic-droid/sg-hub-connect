# Humble Halal - Singapore Halal Business Directory

A comprehensive, modern business directory platform for Singapore's halal business community. Built with React, TypeScript, Vite, and Supabase, featuring advanced search with autocomplete, geolocation, SEO optimization, business hub pages, and comprehensive admin management tools.

## 🚀 Features

### Public Features

#### **Homepage & Discovery**
- **Dynamic Hero Section** with location-based content and **autocomplete search**
- **Search Autocomplete** - Real-time suggestions for businesses, categories, and neighbourhoods as you type
- **Geolocation Integration** - Automatically detects user location and shows "Popular Near You in [Neighbourhood]"
- **Popular Districts** - Browse businesses by neighbourhood with dynamic counts
- **Business Hubs Section** - Quick access to 8 major business category hubs
- **Trending Cuisines** - Discover popular food categories
- **Quick Categories** - Fast navigation to business categories (Restaurant Hub, Cafe Hub, Community)
- **Trust Signals** - Display platform credibility metrics
- **Upcoming Events** - Showcase community events
- **Advertisement Placements** - Strategic ad slots throughout the site (banner_top, home_featured, sidebar_promo, banner_bottom, in_content)

#### **Business Hub Pages** (SEO Optimized)
Comprehensive hub pages for major business categories, each with:
- **Restaurant Hub** (`/restaurant-hub`) - Halal restaurants directory
- **Cafe Hub** (`/cafe-hub`) - Halal cafes and coffee shops
- **Lawyers Hub** (`/lawyers-hub`) - Halal-compliant legal services
- **Mosques Hub** (`/mosques-hub`) - Mosques and Islamic centers
- **Groceries Hub** (`/groceries-hub`) - Halal grocery stores and supermarkets
- **Healthcare Hub** (`/healthcare-hub`) - Halal healthcare services
- **Education Hub** (`/education-hub`) - Islamic schools and educational services
- **Beauty Hub** (`/beauty-hub`) - Halal beauty salons and wellness centers

Each hub page includes:
- Hero section with category-specific gradient
- Search and filter by neighbourhood
- Featured businesses section
- Category-specific content sections
- SEO-optimized content (500+ words)
- Internal linking structure
- Schema markup for search engines

#### **Business Listings**
- **Business Detail Pages** - Comprehensive business profiles with:
  - Cover images and photo galleries (Cloudinary integration)
  - Business information (hours, contact, location)
  - Reviews and ratings
  - Map integration with Mapbox
  - Related businesses suggestions
  - Share functionality (Facebook, Twitter, Copy Link)
  - Breadcrumb navigation
  - SEO schema markup
- **Category Pages** - Browse businesses by category with breadcrumbs
- **Neighbourhood Pages** - SEO hub pages with:
  - Background images with gradient overlays
  - Comprehensive local content (500+ words)
  - Category breakdowns
  - Tips and best practices
  - Related neighbourhoods
  - FAQ sections with schema
- **City Pages** - State/City structure for better organization
- **Search Functionality** - Advanced search with autocomplete and filters
- **Filter Sidebar** - Filter by category, neighbourhood, rating, and more

#### **User Features**
- **User Authentication** - Secure login/signup with Supabase Auth
- **User Dashboard** - Personal dashboard with:
  - Badge claim banner for free featured listing
  - Business statistics
  - Featured listing management
  - Activity tracking
  - Profile settings
- **Business Owner Dashboard** - Dedicated dashboard for business owners
- **Business Submission** - Multi-step form with Cloudinary image upload
- **Business Claiming** - Claim and verify ownership with search-as-you-type autocomplete
- **Review System** - Submit and manage reviews
- **Featured Upgrade** - Upgrade business listings to featured status
- **Badge Generator** - Generate verification badges for free featured listing month

#### **Events**
- **Events Listing** - Browse upcoming events
- **Event Detail Pages** - Rich event pages with:
  - Hero images with fallback system
  - Event details (date, time, location)
  - Google Maps integration
  - Organizer information
  - Share functionality
  - Related events section
- **Event Submission** - Submit new events with Cloudinary image upload

#### **Content & Community**
- **Articles** - Blog/article system with rich text editor
- **Article Detail Pages** - Full article reading experience with XSS protection
- **Community Page** - Community-focused content
- **Resources Page** - Helpful resources for users
- **About Page** - Platform information
- **Badge Generator** - Generate verification badges for businesses (Singapore-specific)

### Admin Features

#### **Business Management**
- **Business Listings** - View, edit, approve, and reject businesses
- **CSV Batch Import** - Import 100+ businesses at once with:
  - Batch processing (50-100 records per batch)
  - Real-time progress tracking with progress bar
  - Success/failure reporting
  - Error handling and validation
  - Pre-fetching of categories and neighbourhoods
  - Robust slug/name matching for categories and neighbourhoods
- **Business Review** - Review pending submissions before approval
- **Status Filtering** - Filter by All, Pending, Approved, Rejected
- **Bulk Actions** - Approve/reject multiple businesses

#### **User Management**
- **User Listings** - View all registered users
- **User Roles** - Manage user permissions and roles
- **User Analytics** - Track user engagement

#### **Content Management**
- **Categories** - Manage business categories
- **Neighbourhoods** - Manage neighbourhoods and locations
- **Reviews** - Moderate reviews and ratings
- **Articles** - Create and edit articles with rich text editor
- **Events** - Manage community events
- **Claims Management** - Handle business ownership claims
- **Badge Requests** - Approve/reject verification badge requests

#### **Analytics Dashboard**
- **Real-time Analytics** - Track platform metrics:
  - Total businesses
  - Pending businesses
  - Total users
  - Total views
  - Total reviews
- **Visual Charts** - Data visualization with Recharts
- **Performance Metrics** - Monitor platform health

#### **Advertisement Management**
- **Ad Slot Management** - Create and manage advertisement placements:
  - Banner Top
  - Home Featured
  - Sidebar Promo
  - Banner Bottom
  - In-Content
- **Date Range Selection** - Calendar-based date picker for ad scheduling
- **Ad Analytics** - Track ad performance
- **Mockup Mode** - Preview ad placements without real ads

#### **Additional Admin Tools**
- **Membership Plans** - Manage subscription plans
- **Settings** - Platform configuration and settings

### Technical Features

#### **Search & Autocomplete**
- **Real-time Autocomplete** - Search-as-you-type functionality
- **Business Suggestions** - Shows businesses and categories as you type
- **Location Autocomplete** - Neighbourhood suggestions with region info
- **Debounced Search** - Optimized performance with 300ms delay
- **Click-outside to Close** - Intuitive UX for autocomplete dropdowns

#### **Geolocation**
- **Automatic Location Detection** - Uses browser geolocation API
- **Nearest Neighbourhood Detection** - Supabase RPC function for location matching
- **Location-based Content** - Dynamic content based on user location
- **Fallback Handling** - Graceful degradation if location unavailable

#### **SEO & Performance**
- **Comprehensive SEO** - Enhanced meta tags including:
  - Primary meta tags (title, description, keywords)
  - Open Graph tags (Facebook)
  - Twitter Card tags
  - Mobile app meta tags
  - Geo-location meta tags
  - Theme color and PWA support
- **Structured Data (Schema.org)**:
  - Organization schema
  - Website schema with SearchAction
  - Breadcrumb schema
  - LocalBusiness schema
  - CollectionPage schema
  - Article schema
  - FAQPage schema
  - Homepage category schema
- **Breadcrumbs** - Navigation breadcrumbs on all pages
- **Proper H1 Tags** - SEO-optimized headings on all pages
- **Canonical URLs** - Prevent duplicate content
- **Sitemap Generation** - Automatic sitemap creation
- **Performance Optimization** - Code splitting and lazy loading

#### **Image Management**
- **Cloudinary Integration** - Professional image hosting and optimization
- **Dynamic Image Display** - Smart image loading with fallbacks
- **Default Image Pool** - Consistent fallback images for businesses and events
- **Image Upload** - Secure uploads with Cloudinary
- **Broken Image Handling** - Graceful fallback for missing images

#### **Webhooks & Integrations**
- **GoHighLevel Integration** - Automatic webhook notifications when businesses are submitted
- **Webhook Utilities** - Reusable webhook functions for external services
- **Event-driven Architecture** - Trigger actions on business submissions

#### **UI/UX**
- **Modern Design** - Built with shadcn/ui components
- **Responsive Layout** - Mobile-first design
- **Mobile Hamburger Menu** - Slide-out navigation for mobile devices
- **Dark Mode Support** - Theme switching capability
- **Accessibility** - WCAG compliant components
- **Toast Notifications** - User feedback with Sonner
- **Loading States** - Skeleton loaders and progress indicators
- **Hover Effects** - Smooth transitions and interactions

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Helmet Async** - SEO meta tag management

### Backend & Database
- **Supabase** - Backend as a Service:
  - PostgreSQL database
  - Authentication
  - Storage (images)
  - Real-time subscriptions
  - Edge Functions
  - Row Level Security (RLS)
- **PostgreSQL** - Relational database
- **Cloudinary** - Image hosting and optimization

### Additional Libraries
- **PapaParse** - CSV parsing for batch imports
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **date-fns** - Date manipulation
- **Recharts** - Data visualization
- **Mapbox GL** - Map integration
- **TipTap** - Rich text editor
- **Sonner** - Toast notifications
- **DOMPurify** - XSS protection

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Cloudinary account (for image hosting)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/nadranic-droid/sg-hub-connect.git
   cd sg-hub-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
   VITE_GOHIGHLEVEL_WEBHOOK_URL=your_webhook_url (optional)
   VITE_MAPBOX_TOKEN=your_mapbox_token (optional)
   VITE_SITE_URL=https://humblehalal.sg
   ```

4. **Run database migrations**
   Apply all migrations in `supabase/migrations/` to your Supabase database:
   - `20251122091041_caf26781-6fb4-4336-ae46-6f6355927d34.sql` - Core tables
   - `20251122091059_892175fc-8e2c-40bc-9815-c4e7075e97b3.sql` - Additional features
   - `20251122140505_86a73e91-a444-4a15-bafd-d9e80e43341a.sql` - Ad management
   - `20251122141430_7cd103b6-c1dd-4285-918d-787790cb9552.sql` - Analytics
   - `20251122150000_ad_analytics.sql` - Ad analytics
   - `20251122160000_geo_rpc.sql` - Geolocation functions
   - `20251123000000_featured_listing_upgrade.sql` - Featured listings
   - `20251123000001_city_state_structure.sql` - City/state structure
   - `20251124000000_badge_requests.sql` - Badge requests
   - `20251124100000_fix_submission_security.sql` - Security fixes

5. **Set up Cloudinary**
   - Create a Cloudinary account
   - Create an upload preset
   - Add credentials to `.env` file

6. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

7. **Build for production**
   ```bash
   npm run build
   ```

8. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
sg-hub-connect/
├── public/                 # Static assets
│   └── badges/            # Badge images
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── AdSlot.tsx    # Advertisement component
│   │   ├── BusinessCard.tsx
│   │   ├── CategoryHub.tsx # Reusable hub page template
│   │   ├── FilterSidebar.tsx
│   │   ├── HeroSection.tsx # Hero with autocomplete search
│   │   ├── SearchAutocomplete.tsx # Autocomplete component
│   │   ├── Breadcrumbs.tsx # Breadcrumb navigation
│   │   ├── SEO.tsx        # SEO component
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   │   ├── AdminBusinesses.tsx
│   │   │   ├── AdminAnalytics.tsx
│   │   │   ├── AdManagement.tsx
│   │   │   └── ...
│   │   ├── Index.tsx     # Homepage
│   │   ├── BusinessDetail.tsx
│   │   ├── NeighbourhoodPage.tsx # SEO hub pages
│   │   ├── CategoryPage.tsx
│   │   ├── RestaurantHub.tsx
│   │   ├── CafeHub.tsx
│   │   ├── LawyerHub.tsx
│   │   ├── MosqueHub.tsx
│   │   ├── GroceryHub.tsx
│   │   ├── HealthcareHub.tsx
│   │   ├── EducationHub.tsx
│   │   ├── BeautyHub.tsx
│   │   ├── EventDetail.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   │   └── useGeoLocation.ts
│   │   └── useGeoLocation.ts
│   ├── integrations/     # External integrations
│   │   └── supabase/     # Supabase client
│   ├── utils/            # Utility functions
│   │   ├── webhooks.ts   # Webhook utilities
│   │   ├── seoSchemas.ts # SEO schema generators
│   │   └── cloudinary.ts # Cloudinary upload utility
│   ├── App.tsx           # Main app component with routes
│   └── main.tsx          # Entry point
├── supabase/
│   ├── functions/        # Edge functions
│   │   ├── create-checkout/
│   │   ├── stripe-webhook/
│   │   ├── sitemap/
│   │   └── optimize-seo/
│   └── migrations/       # Database migrations
└── package.json
```

## 🔑 Key Features Explained

### Search Autocomplete
- Real-time suggestions as users type (300ms debounce)
- Searches businesses, categories, and neighbourhoods
- Clickable suggestions that navigate directly to pages
- Mobile-friendly dropdown interface
- Integrated into hero search bar

### Business Hub Pages
Comprehensive SEO-optimized hub pages for major categories:
- **Template-based** - Uses reusable `CategoryHub` component
- **Search & Filter** - Filter by neighbourhood
- **Featured Section** - Highlights top businesses
- **Rich Content** - 500+ words of SEO-optimized content
- **Internal Linking** - Links to related pages
- **Schema Markup** - CollectionPage and Breadcrumb schemas

### Neighbourhood Hub Pages
Each neighbourhood page is a comprehensive SEO hub:
- **Background Images** - Location-specific or Singapore-themed fallbacks
- **Rich Local Content** - 500+ words per page
- **Category Breakdowns** - Dynamic category sections
- **Tips & Best Practices** - Helpful guidance sections
- **Related Neighbourhoods** - Cross-linking structure
- **FAQ Sections** - With FAQPage schema markup

### CSV Batch Import
The admin CSV import feature supports importing 100+ businesses efficiently:
- **Recommended batch size**: 50-100 records
- **Progress tracking**: Real-time progress bar and statistics
- **Error handling**: Detailed error reporting per row
- **Validation**: Pre-import validation for required fields
- **Performance**: Pre-fetches categories and neighbourhoods to reduce queries
- **Robust Matching**: Handles slug and name variations

### SEO Optimization
Comprehensive SEO implementation:
- **Meta Tags**: Title, description, keywords, Open Graph, Twitter Cards
- **Schema Markup**: Organization, Website, LocalBusiness, CollectionPage, FAQPage
- **Breadcrumbs**: On all pages with schema markup
- **H1 Tags**: Properly structured on every page
- **Canonical URLs**: Prevent duplicate content
- **Site-wide Schema**: Organization and Website schemas on all pages
- **Internal Linking**: Strategic linking between pages

### Footer with Districts
- **Dynamic Footer** - Fetches all neighbourhoods from database
- **Grouped by Region** - Organizes by district/region
- **Complete Linking** - Links to all neighbourhood pages
- **Popular Districts** - Highlights top 4 neighbourhoods
- **Business Links** - Quick access to business features

### Geolocation System
- Automatically detects user location using browser geolocation API
- Matches location to nearest neighbourhood using Supabase RPC function
- Dynamically updates homepage content based on user location
- Falls back to general content if location cannot be determined

### Advertisement System
- Multiple ad slot types for strategic placement
- Date-based scheduling with calendar picker
- Mockup mode for previewing placements
- Analytics tracking for ad performance
- Support for business promotion ads

### Event Management
- Rich event detail pages with hero images
- Map integration for event locations
- Share functionality (social media + copy link)
- Related events suggestions
- Image fallback system for events without images

### Badge Generator
- Singapore-specific location selection
- Generate custom badges for businesses
- Links to local directory pages
- Free featured listing promotion
- Email template generation

## 🚢 Deployment

### Environment Variables
Ensure these are set in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_GOHIGHLEVEL_WEBHOOK_URL` (optional)
- `VITE_MAPBOX_TOKEN` (optional)
- `VITE_SITE_URL` (for SEO)

### Build Command
```bash
npm run build
```

The build output will be in the `dist/` directory, ready to be deployed to any static hosting service (Vercel, Netlify, Cloudflare Pages, etc.).

### SEO Checklist
- ✅ Meta tags on all pages
- ✅ Schema markup (Organization, Website, LocalBusiness, etc.)
- ✅ Breadcrumbs with schema
- ✅ Proper H1 tags
- ✅ Canonical URLs
- ✅ Sitemap generation
- ✅ Mobile-friendly
- ✅ Fast loading times

## 📝 Database Schema

Key tables:
- `businesses` - Business listings
- `categories` - Business categories
- `neighbourhoods` - Location data with regions
- `cities` - City data
- `states` - State/region data
- `reviews` - User reviews
- `users` - User accounts
- `events` - Community events
- `articles` - Blog articles
- `ad_slots` - Advertisement placements
- `badge_requests` - Verification badge requests
- `claims` - Business ownership claims
- `featured_upgrades` - Featured listing upgrades

## 🔒 Security

- **Supabase Row Level Security (RLS)** - Comprehensive RLS policies
- **Authentication Required** - For admin routes and protected actions
- **Input Validation** - Zod schemas for all forms
- **XSS Protection** - DOMPurify for HTML content
- **Secure Image Uploads** - Cloudinary with secure upload presets
- **File Upload Security** - Secure file naming with crypto.randomUUID()
- **Guest Submission Security** - RLS policies for anonymous business submissions

## 🎯 SEO Features

### On-Page SEO
- Proper H1, H2, H3 heading structure
- Meta descriptions (150-160 characters)
- Title tags optimized for search
- Keyword optimization
- Image alt tags
- Internal linking structure

### Technical SEO
- Schema.org structured data
- Breadcrumb navigation
- Canonical URLs
- Mobile-responsive design
- Fast page load times
- Clean URL structure

### Content SEO
- 500+ words on hub pages
- Location-based keywords
- Category-specific content
- FAQ sections
- Related content suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions, please open an issue on GitHub or contact the development team.

## 🎯 Recent Updates

### Latest Features (November 2025)
- ✅ Search autocomplete with real-time suggestions
- ✅ Comprehensive SEO improvements (meta tags, schema, breadcrumbs)
- ✅ 8 Business Hub Pages (Restaurants, Cafes, Lawyers, Mosques, Groceries, Healthcare, Education, Beauty)
- ✅ Neighbourhood hub pages with optimized local content
- ✅ Footer with all districts/neighbourhoods
- ✅ Cloudinary integration for image management
- ✅ Badge Generator for Singapore locations
- ✅ Site-wide schema markup
- ✅ Mobile hamburger menu
- ✅ Enhanced breadcrumb navigation

---

**Built with ❤️ for Singapore's Halal Business Community**
