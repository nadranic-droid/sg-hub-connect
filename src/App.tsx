import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BusinessOwnerDashboard from "./pages/BusinessOwnerDashboard";
import BusinessSubmission from "./pages/BusinessSubmission";
import CategoryPage from "./pages/CategoryPage";
import NeighbourhoodPage from "./pages/NeighbourhoodPage";
import BusinessDetail from "./pages/BusinessDetail";
import SearchResults from "./pages/SearchResults";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import MembershipPlans from "./pages/admin/MembershipPlans";
import AdManagement from "./pages/admin/AdManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import ArticlesManagement from "./pages/admin/ArticlesManagement";
import ArticleEditor from "./pages/admin/ArticleEditor";
import ClaimsManagement from "./pages/admin/ClaimsManagement";
import Events from "./pages/Events";
import EventSubmit from "./pages/EventSubmit";
import ClaimBusiness from "./pages/ClaimBusiness";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/business-dashboard" element={<BusinessOwnerDashboard />} />
          <Route path="/business/submit" element={<BusinessSubmission />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/neighbourhood/:slug" element={<NeighbourhoodPage />} />
          <Route path="/business/:slug" element={<BusinessDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/submit" element={<EventSubmit />} />
          <Route path="/claim-business" element={<ClaimBusiness />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="membership" element={<MembershipPlans />} />
            <Route path="ads" element={<AdManagement />} />
            <Route path="events" element={<EventsManagement />} />
              <Route path="articles" element={<ArticlesManagement />} />
              <Route path="articles/new" element={<ArticleEditor />} />
              <Route path="articles/:id" element={<ArticleEditor />} />
              <Route path="claims" element={<ClaimsManagement />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
