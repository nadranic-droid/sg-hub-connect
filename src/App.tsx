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
import AdminDashboard from "./pages/admin/AdminDashboard";
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
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
