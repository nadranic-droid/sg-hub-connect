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
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover-lift">
            <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-heading font-bold text-xl">H</span>
            </div>
            <span className="font-heading font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hala</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" size="lg" className="shadow-glow">List Your Business</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 gradient-mesh">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 px-4 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-primary">Singapore's #1 Business Directory</span>
            </div>
            <h1 className="font-heading font-bold text-5xl md:text-7xl leading-tight">
              Discover Singapore's
              <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Best Local Businesses
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Find trusted businesses across all neighbourhoods. Read reviews, compare services, and connect with local experts.
            </p>

            {/* Search Bar */}
            <Card className="max-w-3xl mx-auto shadow-2xl border-2 border-primary/10 animate-slide-up hover-lift bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-[1fr,auto,auto] gap-4 items-center">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Search for businesses, services..."
                      className="pl-10 h-12 text-base border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Neighbourhood or postal code"
                      className="pl-10 h-12 text-base border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  <Button variant="hero" size="xl" className="w-full md:w-auto shadow-glow">
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center group cursor-default">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent group-hover:scale-110 transition-transform">5,200+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Businesses</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center group cursor-default">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent group-hover:scale-110 transition-transform">12,500+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Reviews</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center group cursor-default">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent group-hover:scale-110 transition-transform">25+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Neighbourhoods</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-semibold">Popular Categories</span>
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Explore businesses across all categories and find exactly what you need</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={category.slug}
                className="hover-lift border-2 hover:border-primary/30 cursor-pointer group animate-scale-in relative overflow-hidden bg-gradient-to-br from-background to-primary/5"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                <CardContent className="p-6 text-center space-y-3 relative">
                  <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">{category.count} businesses</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 backdrop-blur-sm border border-secondary/20 text-secondary px-4 py-2 rounded-full mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">Featured Picks</span>
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">Top-Rated Businesses</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Handpicked excellence from our community - verified and loved by locals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredBusinesses.map((business, index) => (
              <Card
                key={business.id}
                className="overflow-hidden hover-lift border-2 hover:border-primary/30 animate-slide-up group bg-gradient-to-br from-background to-muted/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    {business.rating}
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{business.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{business.category}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {business.neighbourhood}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {business.reviews} reviews
                    </span>
                  </div>
                  <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-all">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">For Business Owners</span>
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl leading-tight">
              Grow Your Business with Hala
            </h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Join thousands of businesses reaching new customers across Singapore. Get started in minutes and watch your business thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button variant="secondary" size="xl" className="gap-2 shadow-glow-secondary hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                  List Your Business Free
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all">
                Learn More
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-white/20">
              <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-90 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-1">50,000+</div>
                <div className="text-sm opacity-80">Monthly Visitors</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group">
                <Star className="w-10 h-10 mx-auto mb-3 opacity-90 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-1">4.8/5</div>
                <div className="text-sm opacity-80">Average Rating</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group">
                <Award className="w-10 h-10 mx-auto mb-3 opacity-90 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm opacity-80">Verified Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 border-t border-border/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-heading font-bold text-xl">H</span>
                </div>
                <span className="font-heading font-bold text-xl">Hala</span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed mb-4">
                Discover the best local businesses across Singapore.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><circle cx="12" cy="12" r="3.5"/><circle cx="18.5" cy="5.5" r="1.5"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">For Businesses</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li><Link to="/auth" className="hover:opacity-100 hover:text-primary transition-colors">List Your Business</Link></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Business Plans</a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Advertise with Us</a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Discover</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">All Categories</a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Browse Neighbourhoods</a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Top Rated</a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Most Reviewed</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm opacity-70">
            <p>© 2024 Hala Business Directory. All rights reserved. Made with ❤️ in Singapore</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
