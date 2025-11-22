import { Star, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryNav } from "@/components/CategoryNav";
import { PopularDistricts } from "@/components/PopularDistricts";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { Footer } from "@/components/Footer";

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
    name: "Ichikokudo Ramen",
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800&auto=format&fit=crop",
    rating: 4.7,
    distance: "0.3km",
    neighbourhood: "Bugis",
    certification: "MUIS",
  },
  {
    id: 2,
    name: "Working Title Burger Bar",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
    rating: 4.5,
    distance: "0.3km",
    neighbourhood: "Bugis",
    certification: "Muslim-Owned",
  },
  {
    id: 3,
    name: "Hjh Maimunah",
    image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&auto=format&fit=crop",
    rating: 4.8,
    distance: "0.5km",
    neighbourhood: "Arab St",
    certification: "MUIS",
  },
];

const popularDistricts = [
  "Kampong Glam",
  "Bugis Area",
  "Geylang Serai",
  "Jurong East",
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("F&B");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoryNav activeCategory={activeCategory} categories={categories} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-10">
          {/* Left Column - Trending */}
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6">
              Trending Halal Spots Near You
            </h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {trendingBusinesses.map((business, index) => (
                <Link key={business.id} to={`/business/${business.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Card 
                    className="overflow-hidden hover-lift border border-border group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors">
                        {business.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{business.rating}</span>
                        <span>•</span>
                        <span>{business.distance} away ({business.neighbourhood})</span>
                      </div>
                      {business.certification === "MUIS" ? (
                        <Badge className="bg-primary text-white hover:bg-primary-dark">
                          <Shield className="w-3 h-3 mr-1" />
                          MUIS Certified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-accent text-accent">
                          <span className="mr-1">☪️</span>
                          Muslim-Owned
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <PopularDistricts districts={popularDistricts} />
            <UpcomingEvents />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
