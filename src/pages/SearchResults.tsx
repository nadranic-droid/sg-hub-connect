import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BusinessCard } from "@/components/BusinessCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List, Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [neighbourhoods, setNeighbourhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Search businesses
      let businessQuery = supabase
        .from("businesses")
        .select(`
          *,
          categories!businesses_category_id_fkey (name),
          neighbourhoods (name)
        `)
        .eq("status", "approved");

      if (query) {
        businessQuery = businessQuery.or(
          `name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`
        );
      }

      const { data: businessData } = await businessQuery
        .order("is_featured", { ascending: false })
        .order("avg_rating", { ascending: false });

      setBusinesses(businessData || []);

      // Fetch categories and neighbourhoods for filters
      const [{ data: categoryData }, { data: neighbourhoodData }] = await Promise.all([
        supabase.from("categories").select("id, name").is("parent_id", null).order("name"),
        supabase.from("neighbourhoods").select("id, name").order("name"),
      ]);

      setCategories(categoryData || []);
      setNeighbourhoods(neighbourhoodData || []);
      setLoading(false);
    };

    fetchData();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-bold gradient-text">
              Hala
            </Link>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search businesses..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-12 h-11"
                />
              </div>
            </form>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: "Search" },
              { label: query ? `Results for "${query}"` : "All Businesses" },
            ]}
            className="mb-6"
          />

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {query ? `Search Results for "${query}"` : "All Businesses"}
            </h1>
            <p className="text-muted-foreground">
              {businesses.length} {businesses.length === 1 ? "business" : "businesses"} found
            </p>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block">
              <FilterSidebar categories={categories} neighbourhoods={neighbourhoods} />
            </aside>

            {/* Business Listings */}
            <div>
              {/* Controls */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <FilterSidebar categories={categories} neighbourhoods={neighbourhoods} />
                    </SheetContent>
                  </Sheet>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Sort */}
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="az">A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Business Grid/List */}
              {businesses.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {businesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      id={business.id}
                      name={business.name}
                      slug={business.slug}
                      category={business.categories?.name || "Business"}
                      neighbourhood={business.neighbourhoods?.name || "Singapore"}
                      shortDescription={business.short_description}
                      rating={business.avg_rating || 0}
                      reviewCount={business.review_count || 0}
                      priceRange={business.price_range}
                      image={business.cover_image}
                      isVerified={business.is_verified}
                      isFeatured={business.is_featured}
                      phone={business.phone}
                      website={business.website}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/">Browse All Businesses</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
