import { Link } from "react-router-dom";
import { Shield, CheckCircle2, Users, MapPin, Search, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/utils/seoSchemas";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ["about-stats"],
    queryFn: async () => {
      const [businessesRes, neighbourhoodsRes, reviewsRes] = await Promise.all([
        supabase.from("businesses").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("neighbourhoods").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "approved"),
      ]);

      return {
        businesses: businessesRes.count || 0,
        neighbourhoods: neighbourhoodsRes.count || 0,
        reviews: reviewsRes.count || 0,
      };
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Us - Humble Halal | Singapore's Trusted Halal Business Directory"
        description="Learn about Humble Halal, Singapore's comprehensive directory of verified Halal businesses. Discover our mission to connect the Muslim community with quality MUIS-certified and Muslim-owned establishments across Singapore."
        keywords={["about humble halal", "halal directory singapore", "muis certified", "muslim businesses singapore"]}
        schema={[organizationSchema, websiteSchema]}
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Singapore's Trusted Halal Directory</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-6">
              About Humble Halal
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Connecting Singapore's Muslim community with verified, quality Halal businesses across the island.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      {stats && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center border-2">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">{stats.businesses}+</div>
                  <div className="text-muted-foreground">Verified Businesses</div>
                </CardContent>
              </Card>
              <Card className="text-center border-2">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">{stats.neighbourhoods}+</div>
                  <div className="text-muted-foreground">Neighbourhoods Covered</div>
                </CardContent>
              </Card>
              <Card className="text-center border-2">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">{stats.reviews}+</div>
                  <div className="text-muted-foreground">Community Reviews</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">
              Our Mission
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                Discovering authentic Halal food and services in Singapore has never been easier. 
                At Humble Halal, we are dedicated to connecting the Muslim community with verified, 
                quality businesses across the island.
              </p>
              <p>
                Whether you're craving traditional Malay cuisine in Kampong Glam, looking for a 
                cozy cafe in Bugis, or need reliable services that align with your values, our 
                directory is your go-to resource.
              </p>
              <p>
                We verify every listing to ensure peace of mind, distinguishing between MUIS-certified 
                establishments and Muslim-owned businesses. Join thousands of locals and tourists who 
                trust us to navigate Singapore's vibrant Halal scene.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-12 text-center">
              Why Choose Humble Halal?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-2">Verified Listings</h3>
                      <p className="text-muted-foreground">
                        Every business is verified and clearly marked as MUIS-certified or Muslim-owned, 
                        giving you confidence in your choices.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-2">Complete Coverage</h3>
                      <p className="text-muted-foreground">
                        From Central to East, West to North, we cover all neighbourhoods across Singapore, 
                        making it easy to find Halal options wherever you are.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-2">Community Trusted</h3>
                      <p className="text-muted-foreground">
                        Real reviews and ratings from the Muslim community help you make informed decisions 
                        about where to dine, shop, and seek services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl mb-2">Easy Discovery</h3>
                      <p className="text-muted-foreground">
                        Powerful search and filtering tools help you find exactly what you're looking for, 
                        whether by neighbourhood, category, or specific services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-12 text-center">
              How It Works
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2">Browse & Search</h3>
                  <p className="text-muted-foreground">
                    Explore our comprehensive directory by neighbourhood, category, or use our powerful 
                    search to find specific businesses or services.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2">Verify & Review</h3>
                  <p className="text-muted-foreground">
                    Check business verification status (MUIS-certified or Muslim-owned), read community 
                    reviews, and view ratings to make informed decisions.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl mb-2">Connect & Support</h3>
                  <p className="text-muted-foreground">
                    Get directions, contact businesses directly, and support the Halal community by 
                    leaving reviews and sharing your experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Our Commitment to Accuracy
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We are committed to maintaining the highest standards of accuracy and verification. 
              Every business listing is carefully reviewed, and we continuously update our database 
              to ensure you have access to the most current information.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If you notice any inaccuracies or have suggestions for improvement, please don't hesitate 
              to contact us. Your feedback helps us serve the community better.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Start Exploring Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Discover the best Halal businesses in Singapore. From hidden gems to popular hotspots, 
              start your journey with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
                <Link to="/">
                  Browse Businesses <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/business/submit">
                  List Your Business
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

