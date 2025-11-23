import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { NeighbourhoodMap } from "@/components/NeighbourhoodMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Info, Utensils, Coffee, ShoppingBag, Building2, Star, Shield } from "lucide-react";
import { SEO } from "@/components/SEO";
import { generateBreadcrumbSchema, generateCollectionPageSchema } from "@/utils/seoSchemas";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LinkMesh } from "@/components/LinkMesh";
import { NeighbourhoodFAQ } from "@/components/NeighbourhoodFAQ";

const NeighbourhoodPage = () => {
  const { slug } = useParams();
  const [neighbourhood, setNeighbourhood] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      setLoading(true);

      try {
        const { data: neighbourhoodData, error: hoodError } = await supabase
          .from("neighbourhoods")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (hoodError) {
          console.error("Error fetching neighbourhood:", hoodError);
          setLoading(false);
          return;
        }

        setNeighbourhood(neighbourhoodData);

        if (neighbourhoodData) {
          const { data: businessData, error: businessError } = await supabase
            .from("businesses")
            .select(`
              *,
              categories!businesses_category_id_fkey (name),
              neighbourhoods (name)
            `)
            .eq("neighbourhood_id", neighbourhoodData.id)
            .eq("status", "approved")
            .order("is_featured", { ascending: false })
            .order("avg_rating", { ascending: false })
            .order("review_count", { ascending: false })
            .limit(100); // Limit for performance

          if (businessError) {
            console.error("Error fetching businesses:", businessError);
          }

          setBusinesses(businessData || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
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
        <SEO
          title="Neighbourhood Not Found"
          description="The neighbourhood you're looking for doesn't exist."
        />
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

  const businessMarkers = businesses
    .filter((b) => b.latitude && b.longitude)
    .slice(0, 50) // Limit markers for performance
    .map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      address: b.address,
      phone: b.phone,
      latitude: parseFloat(String(b.latitude)),
      longitude: parseFloat(String(b.longitude)),
    }));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://humblehalal.sg" },
    { name: "Neighbourhoods", url: "https://humblehalal.sg/#neighbourhoods" },
    { name: neighbourhood.name, url: `https://humblehalal.sg/neighbourhood/${neighbourhood.slug}` },
  ]);

  const collectionSchema = generateCollectionPageSchema(
    `Halal Businesses in ${neighbourhood.name}`,
    neighbourhood.description || `Discover Halal businesses in ${neighbourhood.name}, Singapore`,
    `https://humblehalal.sg/neighbourhood/${neighbourhood.slug}`,
    businesses.length
  );

  const currentYear = new Date().getFullYear();
  const seoTitle = neighbourhood.seo_title || `Halal Businesses in ${neighbourhood.name}, ${neighbourhood.region} (${currentYear}) | Humble Halal Singapore`;
  const seoDescription = neighbourhood.seo_description || 
    `Discover ${businesses.length}+ verified Halal businesses in ${neighbourhood.name}, ${neighbourhood.region}, Singapore. Find MUIS certified restaurants, cafes, and services near ${neighbourhood.name}. Read reviews, check locations, and support Muslim-owned businesses.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={[
          `halal ${neighbourhood.name}`,
          `${neighbourhood.name} halal restaurants`,
          `${neighbourhood.name} halal cafes`,
          `${neighbourhood.region} halal`,
          "muis certified singapore",
          "muslim owned businesses singapore",
          `halal food ${neighbourhood.name}`,
          `halal services ${neighbourhood.name}`
        ]}
        schema={[breadcrumbSchema, collectionSchema] as any}
      />
      <Header />

      {/* Neighbourhood Header */}
      <section className="bg-muted/50 border-b border-border py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/#neighbourhoods" className="hover:text-foreground">Neighbourhoods</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{neighbourhood.name}</span>
          </nav>
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span>{neighbourhood.region}</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">
            Halal Businesses in {neighbourhood.name}, {neighbourhood.region}
          </h1>
          
          {/* Rich Description */}
          {neighbourhood.description && (
            <div className="bg-white border border-border rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-foreground text-base leading-relaxed">{neighbourhood.description}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <p className="font-medium text-muted-foreground">
              {businesses.length} verified Halal businesses in this area
            </p>
            {businesses.filter((b) => b.is_verified).length > 0 && (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  {businesses.filter((b) => b.is_verified).length} MUIS Certified
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content with Map */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8 mb-10">
          <div className="grid md:grid-cols-2 gap-6">
            {businesses.slice(0, 6).map((business) => (
              <BusinessCard
                key={business.id}
                id={business.id}
                name={business.name}
                slug={business.slug}
                category={business.categories?.name}
                neighbourhood={business.neighbourhoods?.name || neighbourhood.name}
                shortDescription={business.short_description}
                rating={business.avg_rating || 0}
                reviewCount={business.review_count || 0}
                priceRange={business.price_range}
                image={business.cover_image || business.images?.[0]}
                isVerified={business.is_verified}
                isFeatured={business.is_featured}
                phone={business.phone}
                website={business.website}
                certification={business.is_verified ? "MUIS" : null}
              />
            ))}
          </div>

          {/* Map Sidebar */}
          <div className="lg:sticky lg:top-24 self-start space-y-6">
            <div>
              <h2 className="font-heading font-bold text-2xl mb-4">
                Location Map
              </h2>
              <NeighbourhoodMap
                latitude={neighbourhood.latitude ? parseFloat(String(neighbourhood.latitude)) : undefined}
                longitude={neighbourhood.longitude ? parseFloat(String(neighbourhood.longitude)) : undefined}
                businesses={businessMarkers}
              />
            </div>

            {neighbourhood.postal_codes && neighbourhood.postal_codes.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-5">
                <h3 className="font-heading font-bold text-lg mb-3">Postal Codes</h3>
                <p className="text-sm text-muted-foreground">
                  {neighbourhood.postal_codes.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Remaining businesses */}
        {businesses.length > 6 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.slice(6).map((business) => (
              <BusinessCard
                key={business.id}
                id={business.id}
                name={business.name}
                slug={business.slug}
                category={business.categories?.name}
                neighbourhood={business.neighbourhoods?.name || neighbourhood.name}
                rating={business.avg_rating || 0}
                image={business.cover_image || business.images?.[0]}
                isVerified={business.is_verified}
                certification={business.is_verified ? "MUIS" : null}
              />
            ))}
          </div>
        )}

        {businesses.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-6">
              Check back later for new businesses in this neighbourhood.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Browse All Neighbourhoods</Link>
            </Button>
          </div>
        )}
      </main>

      {/* Local Content Hub - SEO Optimized */}
      <section className="bg-muted/30 py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Main Content Section */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6 text-foreground">
                Your Complete Guide to Halal Businesses in {neighbourhood.name}
              </h2>
              
              <div className="text-muted-foreground leading-relaxed space-y-4 text-base">
                <p>
                  {neighbourhood.name} is a vibrant district in {neighbourhood.region}, Singapore, home to {businesses.length}+ verified Halal businesses. 
                  Whether you're looking for authentic Malay cuisine, modern Halal cafes, or essential services, {neighbourhood.name} offers a diverse 
                  range of options for the Muslim community.
                </p>
                
                {neighbourhood.description && (
                  <p>
                    {neighbourhood.description}
                  </p>
                )}
                
                <p>
                  Our comprehensive directory helps you find the best Halal restaurants, cafes, and services in {neighbourhood.name}. 
                  All businesses are verified for Halal compliance, with many holding MUIS (Majlis Ugama Islam Singapura) certification. 
                  Support Muslim-owned businesses and discover hidden gems in this thriving {neighbourhood.region} neighbourhood.
                </p>
              </div>
            </div>

            {/* Category Sections with Internal Linking */}
            {(() => {
              const categories = [...new Set(businesses.map((b) => b.categories?.name).filter(Boolean))] as string[];
              const categoryCounts: Record<string, number> = {};
              businesses.forEach((b) => {
                const cat = b.categories?.name;
                if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
              });

              return categories.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  {categories.slice(0, 6).map((category) => {
                    const count = categoryCounts[category];
                    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
                    const isRestaurant = category.toLowerCase().includes('restaurant');
                    const isCafe = category.toLowerCase().includes('cafe');
                    
                    return (
                      <Card key={category} className="hover-lift">
                        <CardContent className="p-6">
                          <h2 className="font-heading font-bold text-xl mb-3">
                            {category} in {neighbourhood.name}
                          </h2>
                          <p className="text-muted-foreground mb-4 text-sm">
                            Discover {count} {count === 1 ? 'verified Halal' : 'verified Halal'} {category.toLowerCase()} 
                            {count > 1 ? 's' : ''} in {neighbourhood.name}, {neighbourhood.region}. 
                            {isRestaurant && ' From traditional Malay restaurants to international Halal cuisine, find your next favorite dining spot.'}
                            {isCafe && ' Enjoy artisanal coffee, traditional kopi, and delicious Halal snacks in cozy cafes.'}
                            {!isRestaurant && !isCafe && ' Browse our verified listings to find quality Halal options.'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {isRestaurant ? (
                              <Button variant="outline" size="sm" asChild>
                                <Link to="/restaurant-hub">Explore Restaurant Hub</Link>
                              </Button>
                            ) : isCafe ? (
                              <Button variant="outline" size="sm" asChild>
                                <Link to="/cafe-hub">Explore Cafe Hub</Link>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/category/${categorySlug}`}>View All {category}</Link>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/search?category=${categorySlug}&location=${neighbourhood.name}`}>
                                Search in {neighbourhood.name}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : null;
            })()}

            {/* Local Information Section */}
            <div className="bg-white border border-border rounded-xl p-8 mb-12">
              <h2 className="font-heading font-bold text-2xl mb-6">
                About {neighbourhood.name}, {neighbourhood.region}
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location & Access
                  </h3>
                  <p className="text-sm leading-relaxed mb-4">
                    {neighbourhood.name} is located in the {neighbourhood.region} region of Singapore. 
                    {neighbourhood.postal_codes && neighbourhood.postal_codes.length > 0 && (
                      <> The area covers postal codes {neighbourhood.postal_codes.slice(0, 5).join(', ')}{neighbourhood.postal_codes.length > 5 ? ' and more' : ''}.</>
                    )}
                    {' '}The neighbourhood is easily accessible by public transport, making it convenient for residents and visitors alike. 
                    Explore our <Link to="/#neighbourhoods" className="text-primary hover:underline">complete directory</Link> to find Halal businesses 
                    across all districts in Singapore.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-primary" />
                    Halal Dining Scene
                  </h3>
                  <p className="text-sm leading-relaxed mb-4">
                    {neighbourhood.name} boasts a thriving Halal dining scene with {businesses.filter((b) => 
                      b.categories?.name?.toLowerCase().includes('restaurant') || 
                      b.categories?.name?.toLowerCase().includes('cafe')
                    ).length} restaurants and cafes. 
                    {businesses.filter((b) => b.is_verified).length > 0 && (
                      <> {businesses.filter((b) => b.is_verified).length} establishments are <Link to="/restaurant-hub" className="text-primary hover:underline">MUIS certified</Link>, ensuring strict Halal compliance.</>
                    )}
                    {' '}The area is known for its diverse culinary offerings, from traditional Malay food to modern Halal fusion cuisine. 
                    Discover more at our <Link to="/restaurant-hub" className="text-primary hover:underline">Restaurant Hub</Link> and <Link to="/cafe-hub" className="text-primary hover:underline">Cafe Hub</Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Neighbourhoods & Internal Linking */}
            <div className="mb-12">
              <h2 className="font-heading font-bold text-2xl mb-6">
                Explore More Halal Options in Singapore
              </h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Looking for more Halal options? {neighbourhood.name} is just one of many vibrant districts in Singapore's Halal dining scene. 
                Explore our comprehensive directories to find the best Halal restaurants, cafes, and services across the island.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card className="hover-lift border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Utensils className="w-6 h-6 text-primary" />
                      <h3 className="font-heading font-bold text-lg">Restaurant Hub</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Discover Singapore's finest Halal restaurants. From traditional Malay cuisine to international flavors, 
                      find your next favorite dining spot.
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/restaurant-hub">Explore Restaurant Hub →</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover-lift border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Coffee className="w-6 h-6 text-primary" />
                      <h3 className="font-heading font-bold text-lg">Cafe Hub</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Find the best Halal cafes in Singapore. Enjoy artisanal coffee, traditional kopi, and delicious 
                      Halal snacks in cozy settings.
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/cafe-hub">Explore Cafe Hub →</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/#neighbourhoods">Browse All Districts</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/search">Search All Businesses</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/category/community">Community Directory</Link>
                </Button>
              </div>
            </div>

            {/* Why Choose {Neighbourhood} Section */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-8 mb-12">
              <h2 className="font-heading font-bold text-2xl mb-4">
                Why Choose {neighbourhood.name} for Halal Dining?
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Verified Businesses</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All {businesses.length} businesses in our directory are verified for Halal compliance. 
                    {businesses.filter((b) => b.is_verified).length > 0 && (
                      <> {businesses.filter((b) => b.is_verified).length} hold <Link to="/restaurant-hub" className="text-primary hover:underline">MUIS certification</Link>.</>
                    )}
                    {' '}Every listing is carefully reviewed to ensure authenticity and Halal standards.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Diverse Options</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From traditional Malay cuisine to international Halal restaurants, {neighbourhood.name} offers 
                    a wide variety of dining options. Explore our <Link to="/restaurant-hub" className="text-primary hover:underline">Restaurant Hub</Link> and 
                    {' '}<Link to="/cafe-hub" className="text-primary hover:underline">Cafe Hub</Link> to discover more.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Community Trusted</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our listings are curated based on community reviews and ratings. Find the most trusted 
                    Halal businesses in {neighbourhood.name} based on real customer experiences and verified reviews.
                  </p>
                </div>
              </div>
            </div>

            {/* Tips & Best Practices Section */}
            <div className="bg-white border border-border rounded-xl p-8 mb-12">
              <h2 className="font-heading font-bold text-2xl mb-6">
                Tips for Finding the Best Halal Food in {neighbourhood.name}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">1. Look for MUIS Certification</h3>
                  <p className="text-sm leading-relaxed">
                    MUIS (Majlis Ugama Islam Singapura) certification is the gold standard for Halal compliance in Singapore. 
                    Businesses with MUIS certification display a certificate and are regularly audited. 
                    {businesses.filter((b) => b.is_verified).length > 0 && (
                      <> In {neighbourhood.name}, {businesses.filter((b) => b.is_verified).length} establishments are MUIS certified.</>
                    )}
                    {' '}You can filter businesses by certification status on our <Link to="/search" className="text-primary hover:underline">search page</Link>.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">2. Check Reviews and Ratings</h3>
                  <p className="text-sm leading-relaxed">
                    Our community-driven reviews help you make informed decisions. Look for businesses with high ratings 
                    and read customer reviews to understand the quality of food, service, and Halal compliance. 
                    All businesses in {neighbourhood.name} are ranked by community ratings.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">3. Explore Different Categories</h3>
                  <p className="text-sm leading-relaxed">
                    {neighbourhood.name} offers more than just restaurants. Browse our directory for Halal cafes, 
                    grocery stores, and services. Whether you're looking for a quick coffee at our <Link to="/cafe-hub" className="text-primary hover:underline">Cafe Hub</Link> 
                    {' '}or a full meal at our <Link to="/restaurant-hub" className="text-primary hover:underline">Restaurant Hub</Link>, you'll find quality options.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">4. Support Muslim-Owned Businesses</h3>
                  <p className="text-sm leading-relaxed">
                    Many businesses in {neighbourhood.name} are Muslim-owned, providing authentic Halal experiences 
                    while supporting the local Muslim community. Look for businesses marked as "Muslim-Owned" in our directory.
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Categories in Area */}
            {(() => {
              const topCategories = [...new Set(businesses.map((b) => b.categories?.name).filter(Boolean))] as string[];
              const categoryCounts: Record<string, number> = {};
              businesses.forEach((b) => {
                const cat = b.categories?.name;
                if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
              });
              const sortedCategories = topCategories.sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0)).slice(0, 3);

              return sortedCategories.length > 0 ? (
                <div className="mb-12">
                  <h2 className="font-heading font-bold text-2xl mb-6">
                    Popular Halal Categories in {neighbourhood.name}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {sortedCategories.map((category) => {
                      const count = categoryCounts[category];
                      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
                      const iconMap: Record<string, any> = {
                        'restaurant': Utensils,
                        'cafe': Coffee,
                        'grocery': ShoppingBag,
                      };
                      const Icon = iconMap[category.toLowerCase()] || Building2;

                      return (
                        <Link 
                          key={category}
                          to={category.toLowerCase().includes('restaurant') ? '/restaurant-hub' : 
                              category.toLowerCase().includes('cafe') ? '/cafe-hub' : 
                              `/category/${categorySlug}`}
                          className="group"
                        >
                          <Card className="hover-lift h-full">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors">
                                  {category}
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {count} {count === 1 ? 'business' : 'businesses'} in {neighbourhood.name}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {businesses.length > 0 && (
        <NeighbourhoodFAQ
          neighbourhoodName={neighbourhood.name}
          region={neighbourhood.region}
          businessCount={businesses.length}
          verifiedCount={businesses.filter((b) => b.is_verified).length}
          categories={[...new Set(businesses.map((b) => b.categories?.name).filter(Boolean))] as string[]}
        />
      )}
      
      <LinkMesh currentSlug={slug} type="neighbourhood" />
      <Footer />
    </div>
  );
};

export default NeighbourhoodPage;
