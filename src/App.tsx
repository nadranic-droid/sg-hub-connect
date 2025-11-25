import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { SessionTimeoutWarning } from "@/components/SessionTimeoutWarning";
import { InstallPrompt, useServiceWorker } from "@/components/InstallPrompt";
import { PageLoader } from "@/components/PageLoader";

// Eagerly loaded pages (most frequently accessed)
import Index from "./pages/Index";
import BusinessDetail from "./pages/BusinessDetail";
import SearchResults from "./pages/SearchResults";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazily loaded pages (less frequently accessed)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BusinessOwnerDashboard = lazy(() => import("./pages/BusinessOwnerDashboard"));
const BusinessSubmission = lazy(() => import("./pages/BusinessSubmission"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const NeighbourhoodPage = lazy(() => import("./pages/NeighbourhoodPage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const Articles = lazy(() => import("./pages/Articles"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Events = lazy(() => import("./pages/Events"));
const EventSubmit = lazy(() => import("./pages/EventSubmit"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const ClaimBusiness = lazy(() => import("./pages/ClaimBusiness"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const FeaturedUpgrade = lazy(() => import("./pages/FeaturedUpgrade"));
const CityPage = lazy(() => import("./pages/CityPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const About = lazy(() => import("./pages/About"));
const Advertise = lazy(() => import("./pages/Advertise"));
const BadgeGenerator = lazy(() => import("./pages/BadgeGenerator"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

// Hub pages (lazy loaded as they're category-specific)
const RestaurantHub = lazy(() => import("./pages/RestaurantHub"));
const CafeHub = lazy(() => import("./pages/CafeHub"));
const LawyerHub = lazy(() => import("./pages/LawyerHub"));
const MosqueHub = lazy(() => import("./pages/MosqueHub"));
const GroceryHub = lazy(() => import("./pages/GroceryHub"));
const HealthcareHub = lazy(() => import("./pages/HealthcareHub"));
const EducationHub = lazy(() => import("./pages/EducationHub"));
const BeautyHub = lazy(() => import("./pages/BeautyHub"));

// Admin pages (lazy loaded as they're admin-only)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminBusinesses = lazy(() => import("./pages/admin/AdminBusinesses"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminNeighbourhoods = lazy(() => import("./pages/admin/AdminNeighbourhoods"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const MembershipPlans = lazy(() => import("./pages/admin/MembershipPlans"));
const AdManagement = lazy(() => import("./pages/admin/AdManagement"));
const EventsManagement = lazy(() => import("./pages/admin/EventsManagement"));
const ArticlesManagement = lazy(() => import("./pages/admin/ArticlesManagement"));
const ArticleEditor = lazy(() => import("./pages/admin/ArticleEditor"));
const ClaimsManagement = lazy(() => import("./pages/admin/ClaimsManagement"));
const BadgeRequests = lazy(() => import("./pages/admin/BadgeRequests"));

const queryClient = new QueryClient();

const App = () => {
  // Register service worker for PWA
  useServiceWorker();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CookieConsent />
              <SessionTimeoutWarning />
              <InstallPrompt />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Eagerly loaded routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/business/:slug" element={<BusinessDetail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/auth" element={<Auth />} />

                  {/* Lazily loaded routes */}
                  <Route path="/explore/:neighbourhood" element={<ExplorePage />} />
                  <Route path="/explore/:neighbourhood/:category" element={<ExplorePage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/business-dashboard" element={<BusinessOwnerDashboard />} />
                  <Route path="/business/submit" element={<BusinessSubmission />} />

                  {/* Hub pages */}
                  <Route path="/restaurant-hub" element={<RestaurantHub />} />
                  <Route path="/cafe-hub" element={<CafeHub />} />
                  <Route path="/lawyers-hub" element={<LawyerHub />} />
                  <Route path="/mosques-hub" element={<MosqueHub />} />
                  <Route path="/groceries-hub" element={<GroceryHub />} />
                  <Route path="/healthcare-hub" element={<HealthcareHub />} />
                  <Route path="/education-hub" element={<EducationHub />} />
                  <Route path="/beauty-hub" element={<BeautyHub />} />

                  {/* Category and location routes */}
                  <Route path="/category/community" element={<CommunityPage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/neighbourhood/:slug" element={<NeighbourhoodPage />} />
                  <Route path="/:stateSlug/:citySlug" element={<CityPage />} />
                  <Route path="/:citySlug" element={<CityPage />} />

                  {/* Content routes */}
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:slug" element={<ArticleDetail />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/events/submit" element={<EventSubmit />} />

                  {/* Static pages */}
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/advertise" element={<Advertise />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/badge-generator" element={<BadgeGenerator />} />
                  <Route path="/claim-business" element={<ClaimBusiness />} />
                  <Route path="/upgrade/featured/:businessId" element={<FeaturedUpgrade />} />

                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="businesses" element={<AdminBusinesses />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="neighbourhoods" element={<AdminNeighbourhoods />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="membership" element={<MembershipPlans />} />
                    <Route path="ads" element={<AdManagement />} />
                    <Route path="events" element={<EventsManagement />} />
                    <Route path="articles" element={<ArticlesManagement />} />
                    <Route path="articles/new" element={<ArticleEditor />} />
                    <Route path="articles/:id" element={<ArticleEditor />} />
                    <Route path="claims" element={<ClaimsManagement />} />
                    <Route path="badge-requests" element={<BadgeRequests />} />
                  </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
