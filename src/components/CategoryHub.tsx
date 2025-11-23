import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Star, 
  MapPin, 
  Shield,
  ArrowRight,
  Search,
  LucideIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateBreadcrumbSchema, generateCollectionPageSchema } from "@/utils/seoSchemas";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryHubProps {
  categorySlug: string;
  categoryName: string;
  icon: LucideIcon;
  heroGradient: string;
  description: string;
  seoKeywords: string[];
  contentSections?: React.ReactNode;
}

export const CategoryHub = ({
  categorySlug,
  categoryName,
  icon: Icon,
  heroGradient,
  description,
  seoKeywords,
  contentSections
}: CategoryHubProps) => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<string>("all");
  const [neighbourhoods, setNeighbourhoods] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch category - try both with and without 's'
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name, slug, description, seo_title, seo_description")
        .or(`slug.eq.${categorySlug},slug.eq.${categorySlug.replace(/s$/, '')},slug.eq.${categorySlug + 's'}`)
        .maybeSingle();

      setCategory(categoryData);

      if (categoryData) {
        // Fetch all businesses in this category
        const { data: businessData } = await supabase
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
          .order("review_count", { ascending: false })
          .limit(200);

        setBusinesses(businessData || []);

        // Get featured businesses
        const featured = (businessData || []).filter((b: any) => b.is_featured).slice(0, 6);
        setFeaturedBusinesses(featured);
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
  }, [categorySlug]);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = !searchTerm || 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNeighbourhood = selectedNeighbourhood === "all" || 
      business.neighbourhood_id === selectedNeighbourhood;

    return matchesSearch && matchesNeighbourhood;
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://humblehalal.sg" },
    { name: categoryName, url: `https://humblehalal.sg/${categorySlug}-hub` },
  ]);

  const collectionSchema = generateCollectionPageSchema(
    `Halal ${categoryName} in Singapore`,
    description,
    `https://humblehalal.sg/${categorySlug}-hub`,
    businesses.length
  );

  const currentYear = new Date().getFullYear();
  const seoTitle = category?.seo_title || `Halal ${categoryName} Hub Singapore - Best MUIS Certified ${categoryName} (${currentYear}) | Humble Halal`;
  const seoDescription = category?.seo_description || 
    `Discover the best Halal ${categoryName.toLowerCase()} in Singapore. Browse ${businesses.length}+ verified MUIS certified and Muslim-owned ${categoryName.toLowerCase()}. Read reviews, check locations and find services near you.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        schema={[breadcrumbSchema, collectionSchema] as any}
      />
      <Header />

      {/* Hero Section */}
      <section className={`${heroGradient} py-16 md:py-20 border-b border-border relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
              Halal {categoryName} Hub
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Badge className="bg-white/20 text-white border-white/30">
                <Shield className="w-3 h-3 mr-1" />
                MUIS Certified
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Star className="w-3 h-3 mr-1" />
                {businesses.length}+ {categoryName}
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
                  placeholder={`Search ${categoryName.toLowerCase()} by name or location...`}
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
            {filteredBusinesses.length !== businesses.length && (
              <p className="text-sm text-muted-foreground mt-3">
                Showing {filteredBusinesses.length} of {businesses.length} {categoryName.toLowerCase()}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Custom Content Sections */}
      {contentSections}

      {/* Featured Businesses */}
      {featuredBusinesses.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-bold text-3xl mb-2">Featured {categoryName}</h2>
                <p className="text-muted-foreground">Top-rated Halal {categoryName.toLowerCase()}</p>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/category/${categorySlug}`}>
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  id={business.id}
                  name={business.name}
                  slug={business.slug}
                  category={business.categories?.name}
                  neighbourhood={business.neighbourhoods?.name || "Singapore"}
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
          </div>
        </section>
      )}

      {/* All Businesses */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-3xl mb-2">All {categoryName}</h2>
            <p className="text-muted-foreground">
              Browse our complete directory of Halal {categoryName.toLowerCase()}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                id={business.id}
                name={business.name}
                slug={business.slug}
                category={business.categories?.name}
                neighbourhood={business.neighbourhoods?.name || "Singapore"}
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
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No {categoryName.toLowerCase()} found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedNeighbourhood !== "all"
                ? "Try adjusting your search filters."
                : `Check back later for new ${categoryName.toLowerCase()}.`}
            </p>
            <Button asChild variant="outline">
              <Link to="/">Browse All Categories</Link>
            </Button>
          </div>
        )}
      </main>

      {/* SEO Content Section */}
      <section className="bg-muted/30 py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6 text-foreground">
                Your Complete Guide to Halal {categoryName} in Singapore
              </h2>
              
              <div className="text-muted-foreground leading-relaxed space-y-4 text-base">
                <p>
                  Singapore is home to a thriving community of Halal {categoryName.toLowerCase()}, offering 
                  {businesses.filter((b) => b.is_verified).length > 0 ? ` ${businesses.filter((b) => b.is_verified).length} MUIS certified` : ''} 
                  {' '}and Muslim-owned options across the island. Our comprehensive directory helps you find 
                  the best Halal {categoryName.toLowerCase()} in Singapore, all verified for Halal compliance.
                </p>
                
                <p>
                  Whether you're looking for {categoryName.toLowerCase()} in Central Singapore, the East, West, 
                  North, or South, our directory connects you with trusted Halal businesses. All listings are 
                  carefully curated and verified, with many holding MUIS (Majlis Ugama Islam Singapura) certification.
                </p>
                
                <p>
                  Support Muslim-owned businesses and discover quality {categoryName.toLowerCase()} that align 
                  with your values. Browse reviews, check locations, and find the perfect {categoryName.toLowerCase()} 
                  for your needs.
                </p>
              </div>
            </div>

            {/* Why Choose Section */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-8 mb-12">
              <h2 className="font-heading font-bold text-2xl mb-4">
                Why Choose Halal {categoryName}?
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Verified & Certified</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All {businesses.length} {categoryName.toLowerCase()} in our directory are verified for Halal compliance. 
                    {businesses.filter((b) => b.is_verified).length > 0 && (
                      <> {businesses.filter((b) => b.is_verified).length} hold MUIS certification.</>
                    )}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Community Trusted</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our listings are curated based on community reviews and ratings. Find the most trusted 
                    Halal {categoryName.toLowerCase()} based on real customer experiences.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Island-Wide Coverage</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Find {categoryName.toLowerCase()} across all districts in Singapore. From Central to the 
                    heartlands, we've got you covered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

