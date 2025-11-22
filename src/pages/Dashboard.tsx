import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Building2, Star, Heart, MessageSquare, Plus } from "lucide-react";
import { toast } from "sonner";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xl">H</span>
            </div>
            <span className="font-heading font-bold text-2xl">Hala</span>
          </Link>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-4xl mb-2">
            Welcome back, {user?.user_metadata?.full_name || "User"}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your business listings and engage with your customers
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">My Businesses</h3>
              <p className="text-sm text-muted-foreground mb-4">0 listings</p>
              <Button variant="outline" size="sm" className="w-full">View All</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-1">My Reviews</h3>
              <p className="text-sm text-muted-foreground mb-4">0 reviews</p>
              <Button variant="outline" size="sm" className="w-full">View All</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">Saved</h3>
              <p className="text-sm text-muted-foreground mb-4">0 favorites</p>
              <Button variant="outline" size="sm" className="w-full">View All</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Messages</h3>
              <p className="text-sm text-muted-foreground mb-4">0 enquiries</p>
              <Button variant="outline" size="sm" className="w-full">View All</Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading">Get Started</CardTitle>
              <CardDescription>Add your first business listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                List your business on Hala and reach thousands of potential customers across Singapore.
              </p>
              <Button variant="hero" size="lg" className="w-full gap-2">
                <Plus className="w-5 h-5" />
                Add Business Listing
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading">Recent Activity</CardTitle>
              <CardDescription>Your latest interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity</p>
                <p className="text-sm mt-2">Start by adding a business or leaving reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
