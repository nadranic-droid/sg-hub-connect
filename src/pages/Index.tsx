import { Search, MapPin, Star, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const categories = [
  { name: "Food & Beverage", icon: "🍜", count: 1250, slug: "food-beverage" },
  { name: "Retail & Shopping", icon: "🛍️", count: 890, slug: "retail-shopping" },
  { name: "Health & Wellness", icon: "💪", count: 560, slug: "health-wellness" },
  { name: "Professional Services", icon: "💼", count: 780, slug: "professional-services" },
  { name: "Home Services", icon: "🏠", count: 420, slug: "home-services" },
  { name: "Beauty & Spa", icon: "💆", count: 340, slug: "beauty-spa" },
  { name: "Education", icon: "📚", count: 290, slug: "education" },
  { name: "Entertainment", icon: "🎭", count: 210, slug: "entertainment" },
];

const featuredBusinesses = [
  {
    id: 1,
    name: "The Good Place Cafe",
    category: "Food & Beverage",
    neighbourhood: "Tiong Bahru",
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Urban Fitness Hub",
    category: "Health & Wellness",
    neighbourhood: "Orchard",
    rating: 4.9,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Tech Repair Pro",
    category: "Professional Services",
    neighbourhood: "Bugis",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">H</span>
            </div>
            <span className="font-heading font-bold text-2xl">Hala</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" size="lg">List Your Business</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="font-heading font-bold text-5xl md:text-7xl leading-tight">
              Discover Singapore's
              <span className="block gradient-hero bg-clip-text text-transparent">Best Local Businesses</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Find trusted businesses across all neighbourhoods. Read reviews, compare services, and connect with local experts.
            </p>

            {/* Search Bar */}
            <Card className="max-w-3xl mx-auto shadow-xl animate-slide-up">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-[1fr,auto,auto] gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search for businesses, services..."
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Neighbourhood or postal code"
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                  <Button variant="hero" size="xl" className="w-full md:w-auto">
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">5,200+</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">12,500+</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">Neighbourhoods</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Explore businesses across all categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={category.slug}
                className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-5xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.count} businesses</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">Featured</span>
            </div>
            <h2 className="font-heading font-bold text-4xl mb-4">Top-Rated Businesses</h2>
            <p className="text-muted-foreground text-lg">Handpicked excellence from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredBusinesses.map((business, index) => (
              <Card
                key={business.id}
                className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading font-semibold text-xl mb-2">{business.name}</h3>
                    <p className="text-sm text-muted-foreground">{business.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-secondary text-secondary" />
                      <span className="font-semibold">{business.rating}</span>
                      <span className="text-sm text-muted-foreground">({business.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {business.neighbourhood}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 text-white">
            <h2 className="font-heading font-bold text-4xl md:text-5xl">
              Grow Your Business with Hala
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of businesses reaching new customers across Singapore. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="secondary" size="xl" className="gap-2">
                  <TrendingUp className="w-5 h-5" />
                  List Your Business
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20">
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-12 pt-8">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-sm opacity-80">Monthly Visitors</div>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="text-sm opacity-80">Average Rating</div>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm opacity-80">Verified Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-xl">H</span>
                </div>
                <span className="font-heading font-bold text-xl">Hala</span>
              </div>
              <p className="text-sm opacity-80">
                Discover the best local businesses across Singapore.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Businesses</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/auth" className="hover:opacity-100">List Your Business</Link></li>
                <li><a href="#" className="hover:opacity-100">Business Plans</a></li>
                <li><a href="#" className="hover:opacity-100">Advertise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Discover</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Categories</a></li>
                <li><a href="#" className="hover:opacity-100">Neighbourhoods</a></li>
                <li><a href="#" className="hover:opacity-100">Top Rated</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">About Us</a></li>
                <li><a href="#" className="hover:opacity-100">Contact</a></li>
                <li><a href="#" className="hover:opacity-100">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm opacity-60">
            © 2024 Hala Business Directory. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
