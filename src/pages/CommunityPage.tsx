import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Heart, MessageCircle, Calendar, ArrowRight } from "lucide-react";

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Community - Humble Halal"
        description="Join the Singapore Muslim community. Discussions, events, volunteering, and connecting with like-minded individuals."
        keywords={["muslim community singapore", "halal forum", "volunteering", "muslim events"]}
      />
      <Header />

      {/* Hero */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1600&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">
            Our Community
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Connect, share, and grow with Singapore's vibrant Muslim community.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/auth?mode=signup">Join Now</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-primary" asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <MessageCircle className="w-8 h-8" />
              </div>
              <CardTitle>Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Ask questions, share recommendations, and discuss topics relevant to Halal living in Singapore.
              </p>
              <Button variant="ghost" className="text-primary">Coming Soon</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all border-primary/20 ring-2 ring-primary/5">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Calendar className="w-8 h-8" />
              </div>
              <CardTitle>Events & Meetups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Discover religious classes, community bazaars, workshops, and social gatherings near you.
              </p>
              <Button asChild>
                <Link to="/events" className="gap-2">
                  View Events <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Heart className="w-8 h-8" />
              </div>
              <CardTitle>Volunteer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Find opportunities to give back. Support local mosques, charities, and community initiatives.
              </p>
              <Button variant="ghost" className="text-primary">Coming Soon</Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-muted rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="font-heading font-bold text-3xl mb-4">Are you a Business Owner?</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Connect directly with the community. Claim your business profile to respond to reviews, 
              post updates, and showcase your Halal certification.
            </p>
            <Button asChild size="lg">
              <Link to="/business/submit">Register Your Business</Link>
            </Button>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <Users className="w-48 h-48 text-primary/20" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityPage;

