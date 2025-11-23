import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { NeighbourhoodMap } from "@/components/NeighbourhoodMap";
import { Button } from "@/components/ui/button";
import { MapPin, Info } from "lucide-react";
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
          <h1 className="font-heading font-extrabold text-4xl mb-4">{neighbourhood.name}</h1>
          
          {/* Rich Description */}
          {neighbourhood.description && (
            <div className="bg-white border border-border rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-foreground text-base leading-relaxed">{neighbourhood.description}</p>
              </div>
            </div>
          )}
          
          <p className="text-sm font-medium text-muted-foreground">
            {businesses.length} businesses in this area
          </p>
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
