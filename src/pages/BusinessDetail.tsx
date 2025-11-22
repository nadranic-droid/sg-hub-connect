import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Phone,
  Globe,
  MapPin,
  Clock,
  Share2,
  Heart,
  Verified,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
        .single();

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
          <p className="text-muted-foreground mb-4">
            The business you're looking for doesn't exist.
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

      {/* Hero Image */}
      <section className="relative h-[400px] bg-muted">
        {business.cover_image ? (
          <img
            src={business.cover_image}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full gradient-mesh flex items-center justify-center">
            <span className="text-8xl font-bold text-white/20">
              {business.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </section>

      {/* Business Info */}
      <section className="relative -mt-24 pb-12">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: business.categories?.name || "Category", href: `/category/${business.categories?.slug}` },
              { label: business.neighbourhoods?.name || "Location", href: `/neighbourhood/${business.neighbourhoods?.slug}` },
              { label: business.name },
            ]}
            className="mb-6"
          />

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Main Content */}
            <div>
              <Card className="mb-6 border-2">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        {business.name}
                        {business.is_verified && (
                          <Verified className="w-6 h-6 text-primary fill-primary" />
                        )}
                      </h1>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary">{business.categories?.name}</Badge>
                        {business.is_featured && (
                          <Badge className="bg-secondary text-secondary-foreground">
                            Featured
                          </Badge>
                        )}
                        {business.price_range && (
                          <span className="text-muted-foreground">{business.price_range}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(business.avg_rating || 0)
                              ? "fill-secondary text-secondary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{(business.avg_rating || 0).toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({business.review_count || 0} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {business.phone && (
                      <Button asChild>
                        <a href={`tel:${business.phone}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </a>
                      </Button>
                    )}
                    {business.website && (
                      <Button variant="outline" asChild>
                        <a href={business.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                    {business.whatsapp && (
                      <Button variant="outline" asChild>
                        <a
                          href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          WhatsApp
                        </a>
                      </Button>
                    )}
                    <Button variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">About</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {business.description || business.short_description || "No description available."}
                        </p>
                      </div>

                      <Separator />

                      {business.amenities && business.amenities.length > 0 && (
                        <>
                          <div>
                            <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                              {business.amenities.map((amenity: string) => (
                                <Badge key={amenity} variant="outline">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}

                      {business.operating_hours && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Operating Hours</h3>
                          <div className="space-y-2 text-sm">
                            {Object.entries(business.operating_hours).map(([day, hours]: [string, any]) => (
                              <div key={day} className="flex justify-between">
                                <span className="capitalize text-muted-foreground">{day}</span>
                                <span>{hours.closed ? "Closed" : `${hours.open} - ${hours.close}`}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="photos" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {business.images && business.images.length > 0 ? (
                          business.images.map((image: string, index: number) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`${business.name} ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ))
                        ) : (
                          <p className="col-span-full text-center text-muted-foreground py-8">
                            No photos available
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No reviews yet</p>
                        <Button>Write a Review</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contact" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4">Send an Enquiry</h3>
                      <p className="text-muted-foreground mb-4">
                        Contact form coming soon...
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Quick Info</h3>
                  
                  {business.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a href={`tel:${business.phone}`} className="hover:text-primary">
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{business.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {business.neighbourhoods?.name}, {business.postal_code}
                        </p>
                      </div>
                    </div>
                  )}

                  {business.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href={`mailto:${business.email}`} className="hover:text-primary">
                          {business.email}
                        </a>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <Button className="w-full" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>

                  {!business.is_claimed && (
                    <>
                      <Separator />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Is this your business?
                        </p>
                        <Button variant="secondary" className="w-full">
                          Claim This Business
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessDetail;
