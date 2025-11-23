import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Utensils, 
  Star, 
  MapPin, 
  TrendingUp, 
  Shield,
  ArrowRight,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateBreadcrumbSchema, generateCollectionPageSchema } from "@/utils/seoSchemas";

const RestaurantHub = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<string>("all");
  const [neighbourhoods, setNeighbourhoods] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch restaurant category
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", "restaurant")
        .maybeSingle();

      if (categoryData) {
        // Fetch all restaurants
        const { data: restaurantData } = await supabase
          .from("businesses")
          .select(`
            *,
            categories!businesses_category_id_fkey (name),
            neighbourhoods (name, slug)
          `)
          .eq("category_id", categoryData.id)
          .eq("status", "approved")
          .order("is_featured", { ascending: false })
          .order("avg_rating", { ascending: false })
          .order("review_count", { ascending: false });

        setRestaurants(restaurantData || []);

        // Get featured restaurants
        const featured = (restaurantData || []).filter((r: any) => r.is_featured).slice(0, 6);
        setFeaturedRestaurants(featured);
      }

      // Fetch neighbourhoods
      const { data: hoodData } = await supabase
        .from("neighbourhoods")
        .select("id, name, slug")
        .order("name");

      setNeighbourhoods(hoodData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = !searchTerm || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNeighbourhood = selectedNeighbourhood === "all" || 
      restaurant.neighbourhood_id === selectedNeighbourhood;

    return matchesSearch && matchesNeighbourhood;
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://humblehalal.sg" },
    { name: "Restaurant Hub", url: "https://humblehalal.sg/restaurant-hub" },
  ]);

  const collectionSchema = generateCollectionPageSchema(
    "Halal Restaurants in Singapore",
    "Discover the best Halal restaurants in Singapore. Browse verified MUIS certified and Muslim-owned dining establishments.",
    "https://humblehalal.sg/restaurant-hub",
    restaurants.length
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Halal Restaurant Hub Singapore - Best MUIS Certified Restaurants | Humble Halal"
        description="Discover the best Halal restaurants in Singapore. Browse ${restaurants.length}+ verified MUIS certified and Muslim-owned dining establishments. Read reviews, check menus and find locations near you."
        keywords={["halal restaurants singapore", "muis certified restaurants", "muslim owned restaurants", "halal food singapore", "restaurant directory"]}
        schema={[breadcrumbSchema, collectionSchema] as any}
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-accent py-16 md:py-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Utensils className="w-8 h-8" />
              </div>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
              Halal Restaurant Hub
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover Singapore's finest Halal restaurants. From traditional Malay cuisine to international flavors, 
              find your next favorite dining spot.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Badge className="bg-white/20 text-white border-white/30">
                <Shield className="w-3 h-3 mr-1" />
                MUIS Certified
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Star className="w-3 h-3 mr-1" />
                {restaurants.length}+ Restaurants
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <MapPin className="w-3 h-3 mr-1" />
                All Over Singapore
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search restaurants by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-12"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={selectedNeighbourhood}
                  onChange={(e) => setSelectedNeighbourhood(e.target.value)}
                  className="w-full h-12 px-4 rounded-md border border-input bg-background text-sm"
                >
                  <option value="all">All Areas</option>
                  {neighbourhoods.map((hood) => (
                    <option key={hood.id} value={hood.id}>
                      {hood.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filteredRestaurants.length !== restaurants.length && (
              <p className="text-sm text-muted-foreground mt-3">
                Showing {filteredRestaurants.length} of {restaurants.length} restaurants
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-bold text-3xl mb-2">Featured Restaurants</h2>
                <p className="text-muted-foreground">Top-rated Halal dining experiences</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/category/restaurant">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((restaurant) => (
                <BusinessCard
                  key={restaurant.id}
                  id={restaurant.id}
                  name={restaurant.name}
                  slug={restaurant.slug}
                  category={restaurant.categories?.name}
                  neighbourhood={restaurant.neighbourhoods?.name || "Singapore"}
                  shortDescription={restaurant.short_description}
                  rating={restaurant.avg_rating || 0}
                  reviewCount={restaurant.review_count || 0}
                  priceRange={restaurant.price_range}
                  image={restaurant.cover_image || restaurant.images?.[0]}
                  isVerified={restaurant.is_verified}
                  isFeatured={restaurant.is_featured}
                  phone={restaurant.phone}
                  website={restaurant.website}
                  certification={restaurant.is_verified ? "MUIS" : null}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-3xl mb-2">All Restaurants</h2>
            <p className="text-muted-foreground">
              Browse our complete directory of Halal restaurants
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <BusinessCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                slug={restaurant.slug}
                category={restaurant.categories?.name}
                neighbourhood={restaurant.neighbourhoods?.name || "Singapore"}
                shortDescription={restaurant.short_description}
                rating={restaurant.avg_rating || 0}
                reviewCount={restaurant.review_count || 0}
                priceRange={restaurant.price_range}
                image={restaurant.cover_image || restaurant.images?.[0]}
                isVerified={restaurant.is_verified}
                isFeatured={restaurant.is_featured}
                phone={restaurant.phone}
                website={restaurant.website}
                certification={restaurant.is_verified ? "MUIS" : null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedNeighbourhood !== "all"
                ? "Try adjusting your search filters."
                : "Check back later for new restaurants."}
            </p>
            <Button asChild variant="outline">
              <Link to="/">Browse All Categories</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantHub;

