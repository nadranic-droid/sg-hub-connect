import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Phone,
  Globe,
  MapPin,
  Navigation,
  Bookmark,
  User,
  Search,
  Shield,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReviewForm } from "@/components/ReviewForm";

const BusinessDetail = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("businesses")
        .select(`
          *,
          categories!businesses_category_id_fkey (name, slug),
          neighbourhoods (name, slug, region)
        `)
        .eq("slug", slug)
        .maybeSingle();

      setBusiness(data);
      setLoading(false);
    };

    fetchBusiness();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Business Not Found</h1>
          <p className="text-muted-foreground mb-4">The business you're looking for doesn't exist.</p>
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
                <span className="hidden md:inline">Singapore, Near {business.neighbourhoods?.name}</span>
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

      {/* Hero Image */}
      <div className="h-[350px] w-full overflow-hidden">
        {business.cover_image || business.images?.[0] ? (
          <img
            src={business.cover_image || business.images?.[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-8xl font-bold text-muted-foreground/20">
              {business.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Business Header */}
            <div>
              <h1 className="font-heading font-extrabold text-4xl mb-2">{business.name}</h1>
              <div className="flex items-center gap-3 flex-wrap text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{(business.avg_rating || 0).toFixed(1)}</span>
                  <span>({business.review_count || 0} reviews)</span>
                </div>
                <span>•</span>
                <span>{business.price_range || "$$"}</span>
                <span>•</span>
                <span>{business.categories?.name}</span>
                <span>•</span>
                <span>{business.neighbourhoods?.name}</span>
              </div>
            </div>

            {/* MUIS Certification Banner */}
            {business.is_verified && (
              <div className="bg-primary text-white rounded-xl p-6 flex items-center gap-4">
                <Shield className="w-12 h-12 flex-shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-xl mb-1">
                    MUIS Certified Establishment.
                  </h3>
                  <p className="opacity-90 text-sm">
                    Cert No: C2023-998. Valid through Dec 2025.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-4">
              {business.phone && (
                <Button className="bg-secondary text-white hover:bg-secondary-dark h-auto py-4 flex flex-col gap-2" asChild>
                  <a href={`tel:${business.phone}`}>
                    <Phone className="w-5 h-5" />
                    <span className="text-lg font-semibold">Call</span>
                  </a>
                </Button>
              )}
              {business.website && (
                <Button className="bg-secondary text-white hover:bg-secondary-dark h-auto py-4 flex flex-col gap-2" asChild>
                  <a href={business.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-5 h-5" />
                    <span className="text-lg font-semibold">Website</span>
                  </a>
                </Button>
              )}
              <Button className="bg-secondary text-white hover:bg-secondary-dark h-auto py-4 flex flex-col gap-2">
                <Navigation className="w-5 h-5" />
                <span className="text-lg font-semibold">Navigate</span>
              </Button>
              <Button className="bg-secondary text-white hover:bg-secondary-dark h-auto py-4 flex flex-col gap-2">
                <Bookmark className="w-5 h-5" />
                <span className="text-lg font-semibold">Save</span>
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="menu" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold">
                  Menu
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:font-bold">
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-bold text-2xl mb-4">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {business.description || business.short_description || 
                        "A wonderful establishment offering quality products and services."}
                    </p>
                  </div>

                  {business.amenities && business.amenities.length > 0 && (
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-4">Amenities</h3>
                      <ul className="space-y-3">
                        {business.amenities.slice(0, 3).map((amenity: string) => (
                          <li key={amenity} className="flex items-center gap-3">
                            <span className="text-primary text-xl">✓</span>
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="menu" className="mt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <p>Menu information coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8">
                  <ReviewForm businessId={business.id} businessName={business.name} />
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start">
            {/* Map Placeholder */}
            <div className="h-[250px] rounded-xl overflow-hidden border border-border">
              <img
                src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${business.longitude || 103.8198},${business.latitude || 1.3521},14,0/400x250@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN || ''}`}
                alt="Map"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=250&fit=crop";
                }}
              />
            </div>

            {/* Quick Info */}
            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">{business.address}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {business.neighbourhoods?.name}, {business.postal_code}
                    </p>
                    <p className="text-xs text-muted-foreground">(Near {business.neighbourhoods?.name})</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold text-primary">Open Now</p>
                    <p className="text-muted-foreground text-xs">Closes 10 PM</p>
                  </div>
                </div>

                {business.amenities && business.amenities.length > 0 && (
                  <>
                    <hr className="border-border" />
                    <div>
                      <h3 className="font-heading font-bold mb-3">Amenities</h3>
                      <ul className="space-y-2">
                        {business.amenities.slice(0, 3).map((amenity: string) => (
                          <li key={amenity} className="flex items-center gap-2 text-sm">
                            <span className="text-primary">🕌</span>
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDetail;
