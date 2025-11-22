import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { NeighbourhoodMap } from "@/components/NeighbourhoodMap";
import { Button } from "@/components/ui/button";
import { User, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

const NeighbourhoodPage = () => {
  const { slug } = useParams();
  const [neighbourhood, setNeighbourhood] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: neighbourhoodData } = await supabase
        .from("neighbourhoods")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      setNeighbourhood(neighbourhoodData);

      if (neighbourhoodData) {
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

  const businessMarkers = businesses
    .filter((b) => b.latitude && b.longitude)
    .map((b) => ({
      id: b.id,
      name: b.name,
      latitude: parseFloat(b.latitude),
      longitude: parseFloat(b.longitude),
    }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex-shrink-0">
              <div className="font-heading font-bold text-xl leading-tight">
                Humble Halal
                <div className="text-xs font-normal opacity-90">Singapore Business Directory</div>
              </div>
            </Link>

            <div className="flex-1 max-w-2xl mx-8 relative">
              <Input
                placeholder="Search for food, services, or areas in Singapore..."
                className="w-full h-11 pl-4 pr-12 bg-white text-foreground border-0"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="hidden md:inline">Singapore, {neighbourhood.region}</span>
              </div>
              <Link to="/auth">
                <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Neighbourhood Header */}
      <section className="bg-muted/50 border-b border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span>{neighbourhood.region}</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl mb-2">{neighbourhood.name}</h1>
          {neighbourhood.description && (
            <p className="text-muted-foreground text-lg">{neighbourhood.description}</p>
          )}
          <p className="mt-4 text-sm font-medium text-muted-foreground">
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
                latitude={neighbourhood.latitude ? parseFloat(neighbourhood.latitude) : undefined}
                longitude={neighbourhood.longitude ? parseFloat(neighbourhood.longitude) : undefined}
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
    </div>
  );
};

export default NeighbourhoodPage;
