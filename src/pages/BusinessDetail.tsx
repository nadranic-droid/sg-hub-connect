import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Star,
  Phone,
  Globe,
  MapPin,
  Navigation,
  Bookmark,
  BookmarkCheck,
  User,
  Search,
  Shield,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from "@/utils/seoSchemas";
import { ReviewForm } from "@/components/ReviewForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface OperatingHours {
  [day: string]: { open: string; close: string } | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  address?: string;
  phone?: string;
  website?: string;
  cover_image?: string;
  images?: string[];
  avg_rating?: number;
  review_count?: number;
  categories?: { name: string; slug: string };
  neighbourhoods?: { name: string; slug: string; region?: string };
  price_range?: string;
  amenities?: string[];
  operating_hours?: OperatingHours;
  latitude?: number;
  longitude?: number;
  is_verified?: boolean;
  is_claimed?: boolean;
  postal_code?: string;
  seo_title?: string;
  seo_description?: string;
}

// Helper function to get business open status
const getBusinessStatus = (operatingHours?: OperatingHours): { isOpen: boolean; statusText: string; closingTime?: string } => {
  if (!operatingHours) {
    return { isOpen: false, statusText: "Hours not available" };
  }

  const now = new Date();
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDay = days[now.getDay()];
  const todayHours = operatingHours[currentDay];

  if (!todayHours) {
    return { isOpen: false, statusText: "Closed today" };
  }

  const currentTime = now.getHours() * 60 + now.getMinutes();

  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  const openTime = parseTime(todayHours.open);
  const closeTime = parseTime(todayHours.close);

  if (currentTime >= openTime && currentTime < closeTime) {
    const closeHour = Math.floor(closeTime / 60);
    const closeMin = closeTime % 60;
    const period = closeHour >= 12 ? "PM" : "AM";
    const displayHour = closeHour > 12 ? closeHour - 12 : closeHour || 12;
    const closingTime = `${displayHour}${closeMin ? `:${closeMin.toString().padStart(2, "0")}` : ""} ${period}`;
    return { isOpen: true, statusText: "Open Now", closingTime };
  }

  return { isOpen: false, statusText: "Closed" };
};

const BusinessDetail = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Check if business is saved in localStorage
  useEffect(() => {
    if (business?.id) {
      const savedBusinesses = JSON.parse(localStorage.getItem("savedBusinesses") || "[]");
      setIsSaved(savedBusinesses.includes(business.id));
    }
  }, [business?.id]);

  const handleNavigate = () => {
    if (business?.latitude && business?.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`,
        "_blank"
      );
    } else if (business?.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`,
        "_blank"
      );
    } else {
      toast.error("Location not available for this business");
    }
  };

  const handleSave = () => {
    if (!business?.id) return;

    const savedBusinesses = JSON.parse(localStorage.getItem("savedBusinesses") || "[]");

    if (isSaved) {
      const updated = savedBusinesses.filter((id: string) => id !== business.id);
      localStorage.setItem("savedBusinesses", JSON.stringify(updated));
      setIsSaved(false);
      toast.success("Removed from saved businesses");
    } else {
      savedBusinesses.push(business.id);
      localStorage.setItem("savedBusinesses", JSON.stringify(savedBusinesses));
      setIsSaved(true);
      toast.success("Saved to your favorites");
    }
  };

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

      setBusiness(data as Business);
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
        <SEO
          title="Business Not Found"
          description="The business you're looking for doesn't exist."
        />
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

  const localBusinessSchema = generateLocalBusinessSchema({
    name: business.name,
    description: business.description || business.short_description,
    address: business.address,
    phone: business.phone,
    website: business.website,
    image: business.cover_image || business.images?.[0],
    rating: business.avg_rating,
    reviewCount: business.review_count,
    priceRange: business.price_range,
    latitude: business.latitude ? parseFloat(String(business.latitude)) : undefined,
    longitude: business.longitude ? parseFloat(String(business.longitude)) : undefined,
    isVerified: business.is_verified || false
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://humblehalal.sg" },
    { name: business.categories?.name, url: `https://humblehalal.sg/category/${business.categories?.slug}` },
    { name: business.name, url: `https://humblehalal.sg/business/${business.slug}` },
  ]);

  const seoTitle = business.seo_title || `${business.name} - Halal ${business.categories?.name} in ${business.neighbourhoods?.name}, Singapore`;
  const seoDescription = business.seo_description || 
    `${business.name} in ${business.neighbourhoods?.name}: Read reviews, view menu and get directions. Rated ${business.avg_rating || 0}/5 by the community. MUIS certified.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={[
          business.name, 
          "halal", 
          business.categories?.name, 
          business.neighbourhoods?.name, 
          "singapore",
          business.is_verified ? "muis certified" : "muslim owned"
        ]}
        schema={[breadcrumbSchema, localBusinessSchema] as any}
        type="business.business"
        image={business.cover_image || business.images?.[0]}
      />
      {/* Header - Using main Header component for consistency */}
      <Header />

      {/* Hero Image */}
      <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full overflow-hidden">
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
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${business.categories?.slug}`} className="hover:text-foreground">
            {business.categories?.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{business.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Business Header */}
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2">{business.name}</h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-sm sm:text-base text-muted-foreground">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
              <Button
                className="bg-secondary text-white hover:bg-secondary-dark h-auto py-4 flex flex-col gap-2"
                onClick={handleNavigate}
              >
                <Navigation className="w-5 h-5" />
                <span className="text-lg font-semibold">Navigate</span>
              </Button>
              <Button
                className={`h-auto py-4 flex flex-col gap-2 ${isSaved ? "bg-primary text-white hover:bg-primary/90" : "bg-secondary text-white hover:bg-secondary-dark"}`}
                onClick={handleSave}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                <span className="text-lg font-semibold">{isSaved ? "Saved" : "Save"}</span>
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
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-heading font-bold text-xl mb-2">Menu Not Available</h3>
                    <p className="text-muted-foreground mb-4">
                      This business hasn't added their menu yet.
                    </p>
                    {business.website ? (
                      <Button asChild variant="outline">
                        <a href={business.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website for Menu
                        </a>
                      </Button>
                    ) : business.phone ? (
                      <Button asChild variant="outline">
                        <a href={`tel:${business.phone}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call for Menu Info
                        </a>
                      </Button>
                    ) : null}
                    {!business.is_claimed && (
                      <p className="text-sm text-muted-foreground mt-4">
                        Are you the owner?{" "}
                        <Link to={`/claim-business?business=${business.id}`} className="text-primary hover:underline">
                          Claim this business
                        </Link>{" "}
                        to add your menu.
                      </p>
                    )}
                  </div>
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

                {(() => {
                  const status = getBusinessStatus(business.operating_hours);
                  return (
                    <div className="flex items-center gap-3">
                      <Clock className={`w-5 h-5 ${status.isOpen ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-sm">
                        <p className={`font-semibold ${status.isOpen ? "text-primary" : "text-destructive"}`}>
                          {status.statusText}
                        </p>
                        {status.closingTime && (
                          <p className="text-muted-foreground text-xs">Closes {status.closingTime}</p>
                        )}
                      </div>
                    </div>
                  );
                })()}

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

                {!business.is_claimed && (
                  <>
                    <hr className="border-border" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Is this your business?
                      </p>
                      <Link to={`/claim-business?business=${business.id}`}>
                        <Button variant="secondary" className="w-full">
                          Claim This Business
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessDetail;
