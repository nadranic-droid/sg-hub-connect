import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [neighbourhoods, setNeighbourhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(query);
  const [sortBy, setSortBy] = useState("relevance");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedNeighbourhoods, setSelectedNeighbourhoods] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<string>("");
  const [openNow, setOpenNow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Search businesses with real-time filtering
      let businessQuery = supabase
        .from("businesses")
        .select(`
          *,
          categories!businesses_category_id_fkey (id, name),
          neighbourhoods (id, name)
        `)
        .eq("status", "approved");

      // Apply search query
      if (query) {
        businessQuery = businessQuery.or(
          `name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%,seo_keywords.cs.{${query}}`
        );
      }

      const { data: businessData } = await businessQuery;

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

  // Real-time client-side filtering
  const filteredBusinesses = useMemo(() => {
    let filtered = [...businesses];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(b => 
        selectedCategories.includes(b.categories?.id)
      );
    }

    // Filter by neighbourhoods
    if (selectedNeighbourhoods.length > 0) {
      filtered = filtered.filter(b => 
        selectedNeighbourhoods.includes(b.neighbourhoods?.id)
      );
    }

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(b => (b.avg_rating || 0) >= minRating);
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(b => b.price_range === priceRange);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
        break;
      case "reviews":
        filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Relevance: featured first, then by rating
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.avg_rating || 0) - (a.avg_rating || 0);
        });
    }

    return filtered;
  }, [businesses, selectedCategories, selectedNeighbourhoods, minRating, priceRange, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchInput });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedNeighbourhoods([]);
    setMinRating(0);
    setPriceRange("");
    setOpenNow(false);
  };

  const activeFiltersCount = selectedCategories.length + selectedNeighbourhoods.length + 
    (minRating > 0 ? 1 : 0) + (priceRange ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{activeFiltersCount} filters active</span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  setSelectedCategories(
                    checked
                      ? [...selectedCategories, category.id]
                      : selectedCategories.filter((id) => id !== category.id)
                  );
                }}
              />
              <label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                {category.name}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Neighbourhoods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Neighbourhoods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {neighbourhoods.slice(0, 8).map((neighbourhood) => (
            <div key={neighbourhood.id} className="flex items-center space-x-2">
              <Checkbox
                id={`neigh-${neighbourhood.id}`}
                checked={selectedNeighbourhoods.includes(neighbourhood.id)}
                onCheckedChange={(checked) => {
                  setSelectedNeighbourhoods(
                    checked
                      ? [...selectedNeighbourhoods, neighbourhood.id]
                      : selectedNeighbourhoods.filter((id) => id !== neighbourhood.id)
                  );
                }}
              />
              <label htmlFor={`neigh-${neighbourhood.id}`} className="text-sm cursor-pointer">
                {neighbourhood.name}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
              />
              <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center">
                {rating}+ ⭐
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["$", "$$", "$$$", "$$$$"].map((price) => (
            <div key={price} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${price}`}
                checked={priceRange === price}
                onCheckedChange={(checked) => setPriceRange(checked ? price : "")}
              />
              <label htmlFor={`price-${price}`} className="text-sm cursor-pointer">
                {price}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

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
              Humble Halal
            </Link>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search businesses, categories, keywords..."
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
              {filteredBusinesses.length} {filteredBusinesses.length === 1 ? "business" : "businesses"} found
            </p>
            
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {selectedCategories.map(catId => {
                  const cat = categories.find(c => c.id === catId);
                  return cat ? (
                    <Badge key={catId} variant="secondary" className="gap-1">
                      {cat.name}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedCategories(selectedCategories.filter(id => id !== catId))}
                      />
                    </Badge>
                  ) : null;
                })}
                {selectedNeighbourhoods.map(neighId => {
                  const neigh = neighbourhoods.find(n => n.id === neighId);
                  return neigh ? (
                    <Badge key={neighId} variant="secondary" className="gap-1">
                      {neigh.name}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedNeighbourhoods(selectedNeighbourhoods.filter(id => id !== neighId))}
                      />
                    </Badge>
                  ) : null;
                })}
                {minRating > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {minRating}+ ⭐
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
                  </Badge>
                )}
                {priceRange && (
                  <Badge variant="secondary" className="gap-1">
                    {priceRange}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange("")} />
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block">
              <FilterContent />
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
                        Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <FilterContent />
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
                <Select value={sortBy} onValueChange={setSortBy}>
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
              {filteredBusinesses.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {filteredBusinesses.map((business) => (
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
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
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
