import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BusinessOwnerDashboard from "./pages/BusinessOwnerDashboard";
import BusinessSubmission from "./pages/BusinessSubmission";
import CategoryPage from "./pages/CategoryPage";
import NeighbourhoodPage from "./pages/NeighbourhoodPage";
import ExplorePage from "./pages/ExplorePage";
import BusinessDetail from "./pages/BusinessDetail";
import SearchResults from "./pages/SearchResults";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminBusinesses from "./pages/admin/AdminBusinesses";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminNeighbourhoods from "./pages/admin/AdminNeighbourhoods";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import MembershipPlans from "./pages/admin/MembershipPlans";
import AdManagement from "./pages/admin/AdManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import ArticlesManagement from "./pages/admin/ArticlesManagement";
import ArticleEditor from "./pages/admin/ArticleEditor";
import ClaimsManagement from "./pages/admin/ClaimsManagement";
import BadgeRequests from "./pages/admin/BadgeRequests";
import Events from "./pages/Events";
import EventSubmit from "./pages/EventSubmit";
import EventDetail from "./pages/EventDetail";
import ClaimBusiness from "./pages/ClaimBusiness";
import ResourcesPage from "./pages/ResourcesPage";
import FeaturedUpgrade from "./pages/FeaturedUpgrade";
import CityPage from "./pages/CityPage";
import NotFound from "./pages/NotFound";

import CommunityPage from "./pages/CommunityPage";
import About from "./pages/About";
import Advertise from "./pages/Advertise";
import BadgeGenerator from "./pages/BadgeGenerator";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore/:neighbourhood" element={<ExplorePage />} />
            <Route path="/explore/:neighbourhood/:category" element={<ExplorePage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/business-dashboard" element={<BusinessOwnerDashboard />} />
            <Route path="/business/submit" element={<BusinessSubmission />} />
            <Route path="/category/community" element={<CommunityPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/neighbourhood/:slug" element={<NeighbourhoodPage />} />
            <Route path="/business/:slug" element={<BusinessDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:stateSlug/:citySlug" element={<CityPage />} />
            <Route path="/:citySlug" element={<CityPage />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/submit" element={<EventSubmit />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/advertise" element={<Advertise />} />
            <Route path="/badge-generator" element={<BadgeGenerator />} />
            <Route path="/claim-business" element={<ClaimBusiness />} />
            <Route path="/upgrade/featured/:businessId" element={<FeaturedUpgrade />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
