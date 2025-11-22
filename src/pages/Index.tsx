import { Search, MapPin, Star, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState } from "react";

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
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Brand */}
            <Link to="/" className="flex-shrink-0">
              <div className="font-heading font-bold text-xl leading-tight">
                Humble Halal
                <div className="text-xs font-normal opacity-90">Singapore Business Directory</div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 relative">
              <Input
                placeholder="Search for food, services, or areas in Singapore..."
                className="w-full h-11 pl-4 pr-12 bg-white text-foreground border-0 focus-visible:ring-2 focus-visible:ring-white/30"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="hidden md:inline">Singapore, Near Bugis</span>
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

      {/* Hero Section */}
      <section 
        className="h-[400px] bg-cover bg-center relative flex items-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="font-heading font-extrabold text-5xl md:text-6xl mb-3">
            Discover Halal Singapore.
          </h1>
          <p className="text-xl md:text-2xl opacity-95">
            Your trusted guide to verified Halal businesses.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="bg-white border-b border-border sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className={`py-4 px-2 font-medium relative transition-colors hover:text-primary ${
                  activeCategory === category.name
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {category.name}
                {activeCategory === category.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

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
            {/* Popular Districts */}
            <div>
              <h2 className="font-heading font-bold text-2xl mb-5">
                Popular Districts
              </h2>
              <ul className="space-y-0 border border-border rounded-lg overflow-hidden bg-white">
                {popularDistricts.map((district, index) => (
                  <Link 
                    key={district}
                    to={`/neighbourhood/${district.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`block py-3 px-4 text-primary font-medium hover:bg-muted cursor-pointer transition-colors ${
                      index !== popularDistricts.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    {district}
                  </Link>
                ))}
              </ul>
            </div>

            {/* Upcoming Events */}
            <div>
              <h2 className="font-heading font-bold text-2xl mb-5">
                Upcoming Events
              </h2>
              <Card className="bg-[#eefdf8] border-none p-5 space-y-4">
                <h3 className="font-heading font-bold text-lg">
                  Ramadan Bazaar Guide 2024
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get ready for the festivities with our complete guide.
                </p>
                <Link to="/events">
                  <Button className="bg-primary text-white hover:bg-primary-dark font-semibold">
                    View Events
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-20 border-t border-border/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-heading font-bold text-xl mb-3">Humble Halal</div>
              <p className="text-sm opacity-80 mb-4">
                Discover the best Halal businesses across Singapore.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Discover</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/category/food-beverage" className="hover:opacity-100">F&B</Link></li>
                <li><Link to="/category/groceries" className="hover:opacity-100">Groceries</Link></li>
                <li><Link to="/category/lifestyle" className="hover:opacity-100">Lifestyle</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">About Us</a></li>
                <li><a href="#" className="hover:opacity-100">Contact</a></li>
                <li><a href="#" className="hover:opacity-100">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For Business</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/auth" className="hover:opacity-100">List Your Business</Link></li>
                <li><a href="#" className="hover:opacity-100">Claim Business</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm opacity-70">
            <p>© 2024 Humble Halal Business Directory. All rights reserved. Made with ❤️ in Singapore</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
