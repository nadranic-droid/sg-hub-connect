import { useState, useEffect } from "react";
import { Star, Shield, MapPin, ImageOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { QuickCategories } from "@/components/QuickCategories";
import { TrustSignals } from "@/components/TrustSignals";
import { TrendingCuisines } from "@/components/TrendingCuisines";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/utils/seoSchemas";
import { supabase } from "@/integrations/supabase/client";
import { AdSlot } from "@/components/AdSlot";
import { PopularDistricts } from "@/components/PopularDistricts";
import { useGeoLocation } from "@/hooks/useGeoLocation";

const Index = () => {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const { nearestNeighbourhood } = useGeoLocation();
  const [popularBusinesses, setPopularBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const displayLocation = nearestNeighbourhood || "Bugis";

  useEffect(() => {
    const fetchPopularBusinesses = async () => {
      try {
        // First, try to find neighbourhood ID if we have a detected neighbourhood
        let neighbourhoodId = null;
        if (nearestNeighbourhood && nearestNeighbourhood !== "Bugis") {
          const { data: hoodData } = await supabase
            .from("neighbourhoods")
            .select("id")
            .ilike("name", `%${nearestNeighbourhood}%`)
            .limit(1);
          
          if (hoodData && hoodData.length > 0) {
            neighbourhoodId = hoodData[0].id;
          }
        }

        // Build query
        let query = supabase
          .from("businesses")
          .select(`
            id,
            name,
            slug,
            cover_image,
            images,
            avg_rating,
            review_count,
            address,
            short_description,
            is_featured,
            is_verified,
            categories (name),
            neighbourhoods (name, slug)
          `)
          .eq("status", "approved");

        // Filter by neighbourhood if we found one
        if (neighbourhoodId) {
          query = query.eq("neighbourhood_id", neighbourhoodId);
        }

        const { data, error } = await query
          .order("is_featured", { ascending: false })
          .order("avg_rating", { ascending: false })
          .order("review_count", { ascending: false })
          .limit(8);

        if (error) {
          console.error("Error fetching businesses:", error);
          // Fallback: try without neighbourhood filter
          const { data: fallbackData } = await supabase
            .from("businesses")
            .select(`
              id,
              name,
              slug,
              cover_image,
              images,
              avg_rating,
              review_count,
              address,
              short_description,
              is_featured,
              is_verified,
              categories (name),
              neighbourhoods (name, slug)
            `)
            .eq("status", "approved")
            .order("is_featured", { ascending: false })
            .order("avg_rating", { ascending: false })
            .limit(8);
          
          setPopularBusinesses(fallbackData || []);
        } else {
          setPopularBusinesses(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
        setPopularBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBusinesses();
  }, [nearestNeighbourhood]); // Re-fetch when neighbourhood changes

  // Generate homepage category schema
  const homepageCategorySchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Business Categories",
    description: "Explore businesses by category on Humble Halal",
    itemListElement: [
      { "@type": "ListItem", position: 1, item: { "@type": "Category", name: "Restaurants", url: "https://humblehalal.sg/restaurant-hub" } },
      { "@type": "ListItem", position: 2, item: { "@type": "Category", name: "Cafes", url: "https://humblehalal.sg/cafe-hub" } },
      { "@type": "ListItem", position: 3, item: { "@type": "Category", name: "Lawyers", url: "https://humblehalal.sg/lawyers-hub" } },
      { "@type": "ListItem", position: 4, item: { "@type": "Category", name: "Mosques", url: "https://humblehalal.sg/mosques-hub" } },
      { "@type": "ListItem", position: 5, item: { "@type": "Category", name: "Groceries", url: "https://humblehalal.sg/groceries-hub" } },
      { "@type": "ListItem", position: 6, item: { "@type": "Category", name: "Healthcare", url: "https://humblehalal.sg/healthcare-hub" } },
      { "@type": "ListItem", position: 7, item: { "@type": "Category", name: "Education", url: "https://humblehalal.sg/education-hub" } },
      { "@type": "ListItem", position: 8, item: { "@type": "Category", name: "Beauty & Wellness", url: "https://humblehalal.sg/beauty-hub" } },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Humble Halal - Discover Halal Businesses in Singapore"
        description="Singapore's trusted guide to verified Halal businesses. Find restaurants, groceries, services and more with MUIS certification and Muslim-owned establishments."
        keywords={[
          "halal singapore",
          "halal food singapore",
          "muslim businesses singapore",
          "muis certified singapore",
          "halal restaurants singapore",
          "singapore halal directory",
          "halal cafes singapore",
          "halal services singapore",
          "muslim owned businesses",
          "halal certified singapore"
        ]}
        schema={[organizationSchema, websiteSchema, homepageCategorySchema] as any}
        url="https://humblehalal.sg"
      />
      <Header />
      <HeroSection />
      
      {/* Top Banner Ad */}
      <AdSlot type="banner_top" showMockup={true} />
      
      <PopularDistricts />

      <QuickCategories />

      {/* Business Hubs Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Explore Business Hubs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover comprehensive directories for different types of Halal businesses across Singapore
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Restaurants", slug: "restaurant-hub", icon: "🍽️", gradient: "from-primary to-accent" },
              { name: "Cafes", slug: "cafe-hub", icon: "☕", gradient: "from-amber-500 to-orange-500" },
              { name: "Lawyers", slug: "lawyers-hub", icon: "⚖️", gradient: "from-blue-500 to-indigo-600" },
              { name: "Mosques", slug: "mosques-hub", icon: "🕌", gradient: "from-emerald-500 to-teal-600" },
              { name: "Groceries", slug: "groceries-hub", icon: "🛒", gradient: "from-green-500 to-emerald-600" },
              { name: "Healthcare", slug: "healthcare-hub", icon: "🏥", gradient: "from-red-500 to-pink-600" },
              { name: "Education", slug: "education-hub", icon: "🎓", gradient: "from-purple-500 to-indigo-600" },
              { name: "Beauty & Wellness", slug: "beauty-hub", icon: "✨", gradient: "from-pink-500 to-fuchsia-600" },
            ].map((hub) => (
              <Link key={hub.slug} to={`/${hub.slug}`}>
                <Card className="hover-lift h-full group transition-all hover:shadow-xl border-2 hover:border-primary/50">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${hub.gradient} flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform`}>
                      {hub.icon}
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {hub.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Browse {hub.name.toLowerCase()} →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ad */}
      <AdSlot type="home_featured" className="my-8" showMockup={true} />
      
      {/* In-Content Ad */}
      <AdSlot type="in_content" showMockup={true} />

      {/* Popular Section */}
      <section className="py-16 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-heading font-bold text-3xl md:text-4xl">
                  Popular Near You in {displayLocation}
                </h2>
                {loading && (
                  <span className="text-xs text-muted-foreground animate-pulse">
                    Detecting location...
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-8">
                Discover top-rated Halal businesses in your area
              </p>
              
              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="overflow-hidden border animate-pulse">
                      <div className="aspect-[4/3] bg-muted" />
                      <CardContent className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : popularBusinesses.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularBusinesses.slice(0, 4).map((business) => {
                    const imageUrl = business.cover_image || business.images?.[0] || 
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop";
                    
                    return (
                      <Link key={business.id} to={`/business/${business.slug}`}>
                        <Card className="overflow-hidden hover-lift border border-border group h-full transition-all hover:shadow-lg">
                          <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                            <img
                              src={imageUrl}
                              alt={business.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                // Fallback to placeholder if image fails
                                const target = e.target as HTMLImageElement;
                                target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop";
                                target.onerror = null; // Prevent infinite loop
                              }}
                            />
                            {business.is_verified && (
                              <Badge className="absolute top-3 right-3 bg-primary text-white hover:bg-primary-dark shadow-lg">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {business.is_featured && (
                              <Badge variant="outline" className="absolute top-3 left-3 bg-white border-2 border-accent text-accent shadow-lg">
                                ⭐ Featured
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-heading font-extrabold text-base group-hover:text-primary transition-colors line-clamp-1 flex-1">
                                {business.name}
                              </h3>
                              {business.avg_rating && (
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-sm font-semibold shrink-0 ml-2">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{business.avg_rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            {business.categories?.name && (
                              <p className="text-xs text-muted-foreground mb-2">
                                {business.categories.name}
                              </p>
                            )}
                            {business.address && (
                              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{business.address}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-4">No businesses found yet.</p>
                  <Link to="/business/submit">
                    <Button>Be the first to list your business</Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Sidebar Ad */}
            <div className="w-full lg:w-[300px] flex-shrink-0">
              <AdSlot type="sidebar_promo" className="sticky top-24" />
            </div>
          </div>
        </div>
      </section>

      <TrustSignals />
      <TrendingCuisines />
      
      {/* SEO Content */}
      <section className="bg-gradient-to-b from-white to-muted/30 py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6">
              Your Trusted Guide to Halal Living in Singapore
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Discovering authentic Halal food and services in Singapore has never been easier. 
                At Humble Halal, we are dedicated to connecting the Muslim community with verified, 
                quality businesses across the island. Whether you're craving traditional Malay cuisine in Kampong Glam, 
                looking for a cozy cafe in Bugis, or need reliable services that align with your values, 
                our directory is your go-to resource.
              </p>
              <p>
                We verify every listing to ensure peace of mind, distinguishing between MUIS-certified establishments 
                and Muslim-owned businesses. Join thousands of locals and tourists who trust us to navigate 
                Singapore's vibrant Halal scene. From hidden gems to popular hotspots, start your journey with us today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
