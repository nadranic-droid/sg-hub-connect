import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Check, 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  Eye,
  Calendar,
  Image as ImageIcon,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const pricingPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 29,
    interval: "month",
    description: "Perfect for trying out featured listings",
    features: [
      "Top placement on city pages",
      "Blue border and Featured badge",
      "Up to 8 gallery images",
      "Priority in search results",
      "Analytics dashboard access"
    ]
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 75,
    interval: "quarter",
    originalPrice: 87,
    description: "Save $12 with quarterly billing",
    features: [
      "Everything in Monthly",
      "Save $12 per quarter",
      "Priority support",
      "Featured badge on profile"
    ],
    popular: true
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 290,
    interval: "year",
    originalPrice: 348,
    description: "Best value - save $58 per year",
    features: [
      "Everything in Quarterly",
      "Save $58 per year",
      "Highest priority placement",
      "Dedicated account manager"
    ]
  }
];

const FeaturedUpgrade = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState(pricingPlans[0]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      await loadBusiness();
    };
    checkAuth();
  }, [businessId, navigate]);

  const loadBusiness = async () => {
    if (!businessId) return;

    const { data, error } = await supabase
      .from("businesses")
      .select("id, name, slug, is_featured, featured_expires_at, status")
      .eq("id", businessId)
      .single();

    if (error) {
      toast.error("Business not found");
      navigate("/business-dashboard");
      return;
    }

    setBusiness(data);
    setIsFeatured(data.is_featured || false);
    setExpiresAt(data.featured_expires_at);

    // Check if business is approved
    if (data.status !== "approved") {
      toast.error("Your business must be approved before upgrading to featured");
      navigate("/business-dashboard");
    }
  };

  const handleUpgrade = async () => {
    if (!businessId) return;

    setLoading(true);
    try {
      // Get Stripe price ID for selected plan
      // For now, we'll need to create these in Stripe and store them
      // This is a placeholder - you'll need to set up actual Stripe products
      const priceIdMap: Record<string, string> = {
        monthly: import.meta.env.VITE_STRIPE_FEATURED_MONTHLY_PRICE_ID || "",
        quarterly: import.meta.env.VITE_STRIPE_FEATURED_QUARTERLY_PRICE_ID || "",
        yearly: import.meta.env.VITE_STRIPE_FEATURED_YEARLY_PRICE_ID || ""
      };

      const priceId = priceIdMap[selectedPlan.id];
      if (!priceId) {
        toast.error("Pricing not configured. Please contact support.");
        setLoading(false);
        return;
      }

      // Call Supabase function to create checkout session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to continue");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
          businessId,
          planType: "featured_listing",
          duration: selectedPlan.interval
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast.error(error.message || "Failed to start checkout process");
      setLoading(false);
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isCurrentlyFeatured = isFeatured && expiresAt && new Date(expiresAt) > new Date();
  const daysRemaining = expiresAt && isCurrentlyFeatured
    ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs 
          items={[
            { label: "Dashboard", href: "/business-dashboard" },
            { label: "Upgrade to Featured" }
          ]} 
          className="mb-6"
        />

        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/business-dashboard")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <h1 className="font-heading font-bold text-4xl">Upgrade to Featured</h1>
            {isCurrentlyFeatured && (
              <Badge className="bg-blue-600 text-white gap-1">
                <Sparkles className="w-3 h-3" />
                Currently Featured
                {daysRemaining !== null && ` (${daysRemaining} days left)`}
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground text-lg">
            Upgrade <span className="font-semibold text-foreground">{business.name}</span> to get more visibility and customers
          </p>
        </div>

        {/* Benefits Section */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Featured Listing Benefits
            </CardTitle>
            <CardDescription>What you get with a featured listing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Top Placement</h3>
                  <p className="text-sm text-muted-foreground">
                    Your listing appears at the top of city pages, above regular listings
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Featured Badge</h3>
                  <p className="text-sm text-muted-foreground">
                    Stand out with a blue border and "Featured" badge that builds trust
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Image Gallery</h3>
                  <p className="text-sm text-muted-foreground">
                    Showcase up to 8 high-quality images of your business
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">More Visibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Get 3-5x more views and clicks compared to regular listings
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="mb-8">
          <h2 className="font-heading font-bold text-2xl mb-6 text-center">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan.id === plan.id
                    ? "border-2 border-primary shadow-lg"
                    : "border"
                } ${plan.popular ? "border-blue-500" : ""}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {selectedPlan.id === plan.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.interval}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground line-through">
                          ${plan.originalPrice}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Save ${plan.originalPrice - plan.price}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={selectedPlan.id === plan.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                    }}
                  >
                    {selectedPlan.id === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading font-bold text-2xl mb-2">
                  Ready to get more customers?
                </h3>
                <p className="text-muted-foreground">
                  Start your {selectedPlan.name.toLowerCase()} featured listing today
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleUpgrade}
                disabled={loading}
                className="gap-2 min-w-[200px]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Upgrade Now - ${selectedPlan.price}/{selectedPlan.interval}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How long does it take to activate?</h4>
              <p className="text-sm text-muted-foreground">
                Your featured listing is activated immediately after payment confirmation, usually within minutes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your featured listing at any time. Your listing will remain featured until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What happens when my featured listing expires?</h4>
              <p className="text-sm text-muted-foreground">
                Your listing will automatically return to regular status. You can renew anytime to continue enjoying featured benefits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I upload images after upgrading?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! Once your listing is featured, you can upload up to 8 images from your business dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturedUpgrade;

