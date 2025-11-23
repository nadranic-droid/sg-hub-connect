# SG Hub Connect - Singapore Halal Business Directory

A comprehensive, modern business directory platform for Singapore's halal business community. Built with React, TypeScript, and Supabase, featuring advanced search, geolocation, analytics, and admin management tools.

## 🚀 Features

### Public Features

#### **Homepage & Discovery**
- **Dynamic Hero Section** with location-based content
- **Geolocation Integration** - Automatically detects user location and shows "Popular Near You in [Neighbourhood]"
- **Popular Districts** - Browse businesses by neighbourhood with dynamic counts
- **Trending Cuisines** - Discover popular food categories
- **Quick Categories** - Fast navigation to business categories
- **Trust Signals** - Display platform credibility metrics
- **Upcoming Events** - Showcase community events
- **Advertisement Placements** - Strategic ad slots throughout the site (banner_top, home_featured, sidebar_promo, banner_bottom, in_content)

#### **Business Listings**
- **Business Detail Pages** - Comprehensive business profiles with:
  - Cover images and photo galleries
  - Business information (hours, contact, location)
  - Reviews and ratings
  - Map integration with Google Maps
  - Related businesses suggestions
  - Share functionality (Facebook, Twitter, Copy Link)
- **Category Pages** - Browse businesses by category
- **Neighbourhood Pages** - Explore businesses by location
- **City Pages** - State/City structure for better organization
- **Search Functionality** - Advanced search with filters
- **Filter Sidebar** - Filter by category, neighbourhood, rating, and more

#### **User Features**
- **User Authentication** - Secure login/signup with Supabase Auth
- **User Dashboard** - Personal dashboard for users
- **Business Owner Dashboard** - Dedicated dashboard for business owners
- **Business Submission** - Multi-step form for submitting new businesses
- **Business Claiming** - Claim and verify ownership of existing businesses
- **Review System** - Submit and manage reviews
- **Featured Upgrade** - Upgrade business listings to featured status

#### **Events**
- **Events Listing** - Browse upcoming events
- **Event Detail Pages** - Rich event pages with:
  - Hero images with fallback system
  - Event details (date, time, location)
  - Google Maps integration
  - Organizer information
  - Share functionality
  - Related events section
- **Event Submission** - Submit new events with image upload

#### **Content & Community**
- **Articles** - Blog/article system with rich text editor
- **Article Detail Pages** - Full article reading experience
- **Community Page** - Community-focused content
- **Resources Page** - Helpful resources for users
- **About Page** - Platform information
- **Badge Generator** - Generate verification badges for businesses

### Admin Features

#### **Business Management**
- **Business Listings** - View, edit, approve, and reject businesses
- **CSV Batch Import** - Import 100+ businesses at once with:
  - Batch processing (50-100 records per batch)
  - Real-time progress tracking
  - Success/failure reporting
  - Error handling and validation
  - Pre-fetching of categories and neighbourhoods
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
- **Badge Requests** - Approve/reject verification badge requests
- **Claims Management** - Handle business ownership claims
- **Settings** - Platform configuration and settings

### Technical Features

#### **Geolocation**
- **Automatic Location Detection** - Uses browser geolocation API
- **Nearest Neighbourhood Detection** - Supabase RPC function for location matching
- **Location-based Content** - Dynamic content based on user location

#### **Webhooks & Integrations**
- **GoHighLevel Integration** - Automatic webhook notifications when businesses are submitted
- **Webhook Utilities** - Reusable webhook functions for external services
- **Event-driven Architecture** - Trigger actions on business submissions

#### **Image Handling**
- **Dynamic Image Display** - Smart image loading with fallbacks
- **Default Image Pool** - Consistent fallback images for businesses and events
- **Image Upload** - Support for business and event image uploads
- **Broken Image Handling** - Graceful fallback for missing images

#### **SEO & Performance**
- **SEO Optimization** - React Helmet for meta tags
- **Structured Data** - JSON-LD schemas for better search visibility
- **Sitemap Generation** - Automatic sitemap creation
- **Performance Optimization** - Code splitting and lazy loading

#### **UI/UX**
- **Modern Design** - Built with shadcn/ui components
- **Responsive Layout** - Mobile-first design
- **Dark Mode Support** - Theme switching capability
- **Accessibility** - WCAG compliant components
- **Toast Notifications** - User feedback with Sonner
- **Loading States** - Skeleton loaders and progress indicators

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

### Backend & Database
- **Supabase** - Backend as a Service:
  - PostgreSQL database
  - Authentication
  - Storage (images)
  - Real-time subscriptions
  - Edge Functions
- **PostgreSQL** - Relational database
- **Supabase Storage** - File storage for images

### Additional Libraries
- **PapaParse** - CSV parsing for batch imports
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **date-fns** - Date manipulation
- **Recharts** - Data visualization
- **Mapbox GL** - Map integration
- **TipTap** - Rich text editor
- **Sonner** - Toast notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

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
   VITE_GOHIGHLEVEL_WEBHOOK_URL=your_webhook_url (optional)
   ```

4. **Run database migrations**
   Apply all migrations in `supabase/migrations/` to your Supabase database:
   - `20251122091041_caf26781-6fb4-4336-ae46-6f6355927d34.sql`
   - `20251122091059_892175fc-8e2c-40bc-9815-c4e7075e97b3.sql`
   - `20251122140505_86a73e91-a444-4a15-bafd-d9e80e43341a.sql`
   - `20251122141430_7cd103b6-c1dd-4285-918d-787790cb9552.sql`
   - `20251122150000_ad_analytics.sql`
   - `20251122160000_geo_rpc.sql`
   - `20251123000000_featured_listing_upgrade.sql`
   - `20251123000001_city_state_structure.sql`
   - `20251124000000_badge_requests.sql`

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

7. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
sg-hub-connect/
├── public/                 # Static assets
│   └── badges/            # Badge images
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── AdSlot.tsx    # Advertisement component
│   │   ├── BusinessCard.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── HeroSection.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   │   ├── AdminBusinesses.tsx
│   │   │   ├── AdminAnalytics.tsx
│   │   │   ├── AdManagement.tsx
│   │   │   └── ...
│   │   ├── Index.tsx     # Homepage
│   │   ├── BusinessDetail.tsx
│   │   ├── EventDetail.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   │   └── useGeoLocation.ts
│   ├── integrations/     # External integrations
│   │   └── supabase/     # Supabase client
│   ├── utils/            # Utility functions
│   │   ├── webhooks.ts   # Webhook utilities
│   │   └── seoSchemas.ts # SEO schemas
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── supabase/
│   ├── functions/        # Edge functions
│   │   ├── create-checkout/
│   │   ├── stripe-webhook/
│   │   └── sitemap/
│   └── migrations/       # Database migrations
└── package.json
```

## 🔑 Key Features Explained

### CSV Batch Import
The admin CSV import feature supports importing 100+ businesses efficiently:
- **Recommended batch size**: 50-100 records
- **Progress tracking**: Real-time progress bar and statistics
- **Error handling**: Detailed error reporting per row
- **Validation**: Pre-import validation for required fields
- **Performance**: Pre-fetches categories and neighbourhoods to reduce queries

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
- Google Maps integration for event locations
- Share functionality (social media + copy link)
- Related events suggestions
- Image fallback system for events without images

## 🚢 Deployment

### Environment Variables
Ensure these are set in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_GOHIGHLEVEL_WEBHOOK_URL` (optional)

### Build Command
```bash
npm run build
```

The build output will be in the `dist/` directory, ready to be deployed to any static hosting service (Vercel, Netlify, etc.).

## 📝 Database Schema

Key tables:
- `businesses` - Business listings
- `categories` - Business categories
- `neighbourhoods` - Location data
- `reviews` - User reviews
- `users` - User accounts
- `events` - Community events
- `articles` - Blog articles
- `ad_slots` - Advertisement placements
- `badge_requests` - Verification badge requests
- `business_claims` - Business ownership claims

## 🔒 Security

- Supabase Row Level Security (RLS) policies
- Authentication required for admin routes
- Input validation with Zod schemas
- XSS protection with React
- Secure image upload handling

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

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] SMS integration
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Business owner mobile app

---

**Built with ❤️ for Singapore's Halal Business Community**
