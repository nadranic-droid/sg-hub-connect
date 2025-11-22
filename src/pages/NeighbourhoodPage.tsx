import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BusinessCard } from "@/components/BusinessCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

const NeighbourhoodPage = () => {
  const { slug } = useParams();
  const [neighbourhood, setNeighbourhood] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch neighbourhood
      const { data: neighbourhoodData } = await supabase
        .from("neighbourhoods")
        .select("*")
        .eq("slug", slug)
        .single();

      setNeighbourhood(neighbourhoodData);

      if (neighbourhoodData) {
        // Fetch businesses in this neighbourhood
        const { data: businessData } = await supabase
          .from("businesses")
          .select(`
            *,
            categories!businesses_category_id_fkey (name),
            neighbourhoods (name)
          `)
          .eq("neighbourhood_id", neighbourhoodData.id)
          .eq("status", "approved")
          .order("is_featured", { ascending: false })
          .order("avg_rating", { ascending: false });

        setBusinesses(businessData || []);
      }

      // Fetch categories
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name")
        .is("parent_id", null)
        .order("name");

      setCategories(categoryData || []);
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!neighbourhood) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Neighbourhood Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The neighbourhood you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold gradient-text">
              Humble Halal
            </Link>
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

      {/* Neighbourhood Hero */}
      <section className="relative py-16 gradient-vibrant overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs
            items={[
              { label: "Neighbourhoods", href: "/#neighbourhoods" },
              { label: neighbourhood.name },
            ]}
            className="mb-6 text-white/80"
          />
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-white" />
              <span className="text-white/80 text-lg">{neighbourhood.region}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {neighbourhood.name}
            </h1>
            {neighbourhood.description && (
              <p className="text-lg text-white/90">{neighbourhood.description}</p>
            )}
            <div className="mt-6">
              <span className="text-white/70">
                {businesses.length} businesses in this area
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block">
              <FilterSidebar categories={categories} />
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
                      <FilterSidebar categories={categories} />
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
                      neighbourhood={business.neighbourhoods?.name || neighbourhood.name}
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
                  <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or check back later.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/">Browse All Neighbourhoods</Link>
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

export default NeighbourhoodPage;
