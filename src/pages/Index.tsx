import { Star, Shield, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { QuickCategories } from "@/components/QuickCategories";
import { TrustSignals } from "@/components/TrustSignals";
import { TrendingCuisines } from "@/components/TrendingCuisines";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/utils/seoSchemas";

const categories = [
  { name: "F&B", slug: "food-beverage" },
  { name: "Groceries", slug: "groceries" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Mosques", slug: "mosques" },
  { name: "Services", slug: "services" },
];

const trendingBusinesses = [
  {
    id: 1,
    name: "Hjh Maimunah Restaurant",
    image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&auto=format&fit=crop",
    rating: 4.5,
    location: "10 72th Bese Hjh Maimunah Location, Singapore",
    certification: "MUIS",
  },
  {
    id: 2,
    name: "Hinniah Sam Restaurant",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop",
    rating: 4.5,
    location: "11850 Vlavlins, Beka Inn Location, Singapore",
    certification: "MUIS",
  },
  {
    id: 3,
    name: "Horevt'n Restaurant",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop",
    rating: 4.5,
    location: "Bugis 105 Location, Singapore",
    certification: "MUIS",
  },
  {
    id: 4,
    name: "Hinntianomor Restaurant",
    image: "https://images.unsplash.com/photo-1580867332126-b5b5e0193c7b?w=800&auto=format&fit=crop",
    rating: 4.8,
    location: "15 tao Isaha-tt Location, Singapore",
    certification: "Muslim-Owned",
  },
];

const popularDistricts = [
  "Kampong Glam",
  "Bugis Area",
  "Geylang Serai",
  "Jurong East",
];

const Index = () => {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Humble Halal - Discover Halal Businesses in Singapore"
        description="Singapore's trusted guide to verified Halal businesses. Find restaurants, groceries, services and more with MUIS certification and Muslim-owned establishments."
        keywords={["halal singapore", "halal food", "muslim businesses", "muis certified", "halal restaurants", "singapore halal"]}
        schema={[organizationSchema, websiteSchema]}
      />
      <Header />
      <HeroSection />
      <QuickCategories />

      {/* Popular Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8">
            Popular Near You in Bugis
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingBusinesses.map((business) => (
              <Link key={business.id} to={`/business/${business.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="overflow-hidden hover-lift border border-border group">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {business.certification === "MUIS" ? (
                      <Badge className="absolute top-3 right-3 bg-primary text-white hover:bg-primary-dark shadow-lg">
                        <Shield className="w-3 h-3 mr-1" />
                        MUIS Certified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="absolute top-3 right-3 bg-white border-2 border-accent text-accent shadow-lg">
                        <span className="mr-1">☪️</span>
                        Muslim-Owned
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-heading font-extrabold text-base group-hover:text-primary transition-colors">
                        {business.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-sm font-semibold shrink-0 ml-2">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{business.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{business.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustSignals />
      <TrendingCuisines />
      <Footer />
    </div>
  );
};

export default Index;
