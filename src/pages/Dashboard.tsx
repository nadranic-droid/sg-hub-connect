import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Building2, Star, Heart, MessageSquare, Plus, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover-lift">
              <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-heading font-bold text-xl">H</span>
              </div>
              <span className="font-heading font-bold text-2xl">Hala</span>
            </Link>
            <Button variant="ghost" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[{ label: "Dashboard" }]} 
          className="mb-6"
        />

        {/* Welcome Section */}
        <div className="mb-10 relative overflow-hidden rounded-2xl p-8 gradient-mesh border border-border/50 shadow-lg">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-4xl mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome back, {user?.user_metadata?.full_name || "User"}!
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your business listings and engage with your customers
                </p>
              </div>
              <div className="hidden md:block animate-float">
                <div className="w-20 h-20 rounded-full gradient-vibrant opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Card className="hover-lift border-l-4 border-l-primary shadow-md bg-gradient-to-br from-background to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-3xl font-bold text-primary">0</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Businesses</h3>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-secondary shadow-md bg-gradient-to-br from-background to-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-3xl font-bold text-secondary">0</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Reviews Written</h3>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-accent shadow-md bg-gradient-to-br from-background to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <span className="text-3xl font-bold text-accent">0</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Saved Favorites</h3>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-success shadow-md bg-gradient-to-br from-background to-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-success" />
                </div>
                <span className="text-3xl font-bold text-success">0</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Profile Views</h3>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 shadow-xl hover-lift overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 gradient-hero opacity-5 rounded-full blur-3xl"></div>
            <CardHeader>
              <CardTitle className="font-heading text-2xl flex items-center gap-2">
                <Plus className="w-6 h-6 text-primary" />
                Get Started
              </CardTitle>
              <CardDescription className="text-base">Add your first business listing and reach customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Your Listing</h4>
                    <p className="text-sm text-muted-foreground">Add business details, photos, and contact information</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get Verified</h4>
                    <p className="text-sm text-muted-foreground">Submit for approval and gain customer trust</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Grow Your Business</h4>
                    <p className="text-sm text-muted-foreground">Respond to reviews and attract more customers</p>
                  </div>
                </div>
              </div>

              <Button variant="hero" size="xl" className="w-full gap-2 shadow-glow">
                <Plus className="w-5 h-5" />
                Add Your First Business
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl hover-lift">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <Building2 className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">My Businesses</div>
                  <div className="text-xs text-muted-foreground">Manage listings</div>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <Star className="w-5 h-5 text-secondary" />
                <div className="text-left">
                  <div className="font-semibold">My Reviews</div>
                  <div className="text-xs text-muted-foreground">View & edit</div>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <Heart className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <div className="font-semibold">Saved</div>
                  <div className="text-xs text-muted-foreground">Your favorites</div>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Messages</div>
                  <div className="text-xs text-muted-foreground">Enquiries</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-xl">
          <CardHeader className="border-b">
            <CardTitle className="font-heading text-xl">Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-10 h-10" />
              </div>
              <p className="text-lg font-medium mb-2">No recent activity</p>
              <p className="text-sm">Start by adding a business or leaving reviews to see your activity here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
