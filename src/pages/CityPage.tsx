import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { NeighbourhoodMap } from "@/components/NeighbourhoodMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { User, Search, MapPin, Info, ChevronRight, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { generateBreadcrumbSchema, generateCollectionPageSchema, generateFAQPageSchema } from "@/utils/seoSchemas";
import { Header } from "@/components/Header";
import { LinkMesh } from "@/components/LinkMesh";

const CityPage = () => {
  const { stateSlug, citySlug } = useParams();
  const [city, setCity] = useState<any>(null);
  const [state, setState] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [nearbyCities, setNearbyCities] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch state
      if (stateSlug) {
        const { data: stateData } = await (supabase as any)
          .from("states")
          .select("*")
          .eq("slug", stateSlug)
          .maybeSingle();
        setState(stateData);
      }

      // Fetch city
      let cityQuery = (supabase as any)
        .from("cities")
        .select(`
          *,
          states (*)
        `)
        .eq("slug", citySlug);

      if (stateSlug) {
        cityQuery = cityQuery.eq("state_id", state?.id || "");
      }

      const { data: cityData } = await cityQuery.maybeSingle();

      if (!cityData || !cityData.is_public) {
        setLoading(false);
        return;
      }

      setCity(cityData);
      if (cityData.states) {
        setState(cityData.states);
      }

      // Fetch businesses in this city
      const { data: businessData } = await (supabase as any)
        .from("businesses")
        .select(`
          *,
          categories!businesses_category_id_fkey (name),
          neighbourhoods (name)
        `)
        .eq("city_id", cityData.id)
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .order("avg_rating", { ascending: false });

      setBusinesses(businessData || []);

      // Fetch nearby cities
      const { data: nearbyData } = await (supabase as any)
        .from("nearby_cities")
        .select(`
          nearby_city_id,
          distance_km,
          cities!nearby_cities_nearby_city_id_fkey (
            id,
            name,
            slug,
            states!inner (slug)
          )
        `)
        .eq("city_id", cityData.id)
        .order("distance_km", { ascending: true })
        .limit(6);

      if (nearbyData) {
        setNearbyCities(
          nearbyData
            .map((item: any) => ({
              ...item.cities,
              distance_km: item.distance_km,
            }))
            .filter((c: any) => c && c.is_public)
        );
      }

      // Fetch FAQs
      const { data: faqData } = await (supabase as any)
        .from("city_faqs")
        .select("*")
        .eq("city_id", cityData.id)
        .order("order_index", { ascending: true });

      if (faqData && faqData.length > 0) {
        setFaqs(
          faqData.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer,
          }))
        );
      } else {
        // Generate default FAQs if none exist
        generateDefaultFAQs(cityData, businessData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [stateSlug, citySlug, state?.id]);

  const generateDefaultFAQs = (cityData: any, businesses: any[]) => {
    const categoryCounts: Record<string, number> = {};
    businesses.forEach((b) => {
      const cat = b.categories?.name || "Other";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "businesses";

    const defaultFaqs = [
      {
        question: `What are the best halal ${topCategory} in ${cityData.name}?`,
        answer: `We've found ${businesses.length}+ verified halal ${topCategory} in ${cityData.name}. Browse our listings to discover top-rated options with reviews from the community.`,
      },
      {
        question: `Are there halal-certified restaurants in ${cityData.name}?`,
        answer: `Yes! ${cityData.name} has many halal-certified restaurants. Look for the MUIS certification badge on listings to find officially certified establishments.`,
      },
      {
        question: `What are the operating hours for businesses in ${cityData.name}?`,
        answer: `Operating hours vary by business. Check individual listings for specific hours. Most businesses in ${cityData.name} are open daily, with some variations on weekends.`,
      },
      {
        question: `How do I find halal food near me in ${cityData.name}?`,
        answer: `Use our search filters to find halal food options in ${cityData.name}. You can filter by category, price range, and see businesses on our interactive map.`,
      },
    ];

    setFaqs(defaultFaqs);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEO
          title="City Not Found"
          description="The city you're looking for doesn't exist."
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">City Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The city you're looking for doesn't exist or is not yet public.
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

  const breadcrumbItems = [
    { name: "Home", url: "https://humblehalal.sg" },
  ];

  if (state) {
    breadcrumbItems.push({
      name: state.name,
      url: `https://humblehalal.sg/${state.slug}`,
    });
  }

  breadcrumbItems.push({
    name: city.name,
    url: `https://humblehalal.sg/${state?.slug || ""}/${city.slug}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const collectionSchema = generateCollectionPageSchema(
    `Halal Businesses in ${city.name}${state ? `, ${state.name}` : ""}`,
    city.seo_description ||
      `Discover Halal businesses in ${city.name}${state ? `, ${state.name}` : ""}. Find restaurants, cafes, shops and services.`,
    `https://humblehalal.sg/${state?.slug || ""}/${city.slug}`,
    businesses.length
  );

  const faqSchema = faqs.length > 0 ? generateFAQPageSchema(faqs) : null;

  const seoTitle =
    city.seo_title ||
    `Top Halal Food & Services in ${city.name}${state ? `, ${state.name}` : ""} (${new Date().getFullYear()}) | Humble Halal`;
  const seoDescription =
    city.seo_description ||
    `Explore the best Halal food and services in ${city.name}${state ? `, ${state.name}` : ""}. We found ${businesses.length}+ verified spots including restaurants, cafes and shops.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={[city.name, state?.name, "halal", "singapore", "muslim businesses"]}
        schema={[breadcrumbSchema, collectionSchema, faqSchema].filter(Boolean) as any}
      />
      <Header />

      {/* City Header */}
      <section className="bg-muted/50 border-b border-border py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            {state && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/${state.slug}`} className="hover:text-foreground">
                  {state.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{city.name}</span>
          </nav>
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span>
              {city.name}
              {state && `, ${state.name}`}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl mb-4">
            {city.name}
          </h1>

          {/* Rich Description */}
          {city.description && (
            <div className="bg-white border border-border rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-foreground text-base leading-relaxed">
                  {city.description}
                </p>
              </div>
            </div>
          )}

          <p className="text-sm font-medium text-muted-foreground">
            {businesses.length} businesses in this area
          </p>
        </div>
      </section>

      {/* Main Content */}
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
                neighbourhood={business.neighbourhoods?.name || city.name}
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
                latitude={city.latitude ? parseFloat(city.latitude) : undefined}
                longitude={city.longitude ? parseFloat(city.longitude) : undefined}
                businesses={businessMarkers}
              />
            </div>

            {city.postal_codes && city.postal_codes.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-5">
                <h3 className="font-heading font-bold text-lg mb-3">
                  Postal Codes
                </h3>
                <p className="text-sm text-muted-foreground">
                  {city.postal_codes.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Remaining businesses */}
        {businesses.length > 6 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {businesses.slice(6).map((business) => (
              <BusinessCard
                key={business.id}
                id={business.id}
                name={business.name}
                slug={business.slug}
                category={business.categories?.name}
                neighbourhood={business.neighbourhoods?.name || city.name}
                rating={business.avg_rating || 0}
                image={business.cover_image || business.images?.[0]}
                isVerified={business.is_verified}
                isFeatured={business.is_featured}
                certification={business.is_verified ? "MUIS" : null}
              />
            ))}
          </div>
        )}

        {businesses.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-6">
              Check back later for new businesses in this city.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Browse All Cities</Link>
            </Button>
          </div>
        )}

        {/* Nearby Cities Section */}
        {nearbyCities.length > 0 && (
          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Explore Nearby Cities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyCities.map((nearbyCity: any) => (
                  <Link
                    key={nearbyCity.id}
                    to={`/${nearbyCity.states?.slug || ""}/${nearbyCity.slug}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {nearbyCity.name}
                      </h4>
                      {nearbyCity.distance_km && (
                        <p className="text-sm text-muted-foreground">
                          {nearbyCity.distance_km.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQs Section */}
        {faqs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </main>

      <LinkMesh currentSlug={city.slug} type="neighbourhood" />
    </div>
  );
};

export default CityPage;

