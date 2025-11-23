import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  LogOut, 
  Building2, 
  Star, 
  Heart, 
  MessageSquare, 
  Plus, 
  TrendingUp, 
  Eye,
  Sparkles,
  Badge as BadgeIcon,
  Settings,
  Bell,
  User as UserIcon,
  CreditCard,
  BarChart3,
  Zap,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { User } from "@supabase/supabase-js";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

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

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [businessesRes, reviewsRes, favoritesRes] = await Promise.all([
        supabase.from("businesses").select("id, is_featured, featured_expires_at").eq("owner_id", user.id),
        supabase.from("reviews").select("id").eq("user_id", user.id),
        supabase.from("favorites").select("id").eq("user_id", user.id),
      ]);

      const businesses = businessesRes.data || [];
      const featuredBusinesses = businesses.filter(b => 
        b.is_featured && b.featured_expires_at && new Date(b.featured_expires_at) > new Date()
      );

      return {
        totalBusinesses: businesses.length,
        featuredBusinesses: featuredBusinesses.length,
        totalReviews: reviewsRes.data?.length || 0,
        totalFavorites: favoritesRes.data?.length || 0,
      };
    },
    enabled: !!user?.id,
  });

  // Fetch badge requests
  const { data: badgeRequests } = useQuery({
    queryKey: ["user-badge-requests", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await supabase
        .from("badge_requests")
        .select("*")
        .eq("contact_email", user.email)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user?.email,
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
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
              <span className="font-heading font-bold text-2xl">Humble Halal</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/business/submit")} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Business
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Dashboard" }]} className="mb-6" />

        {/* Welcome Section */}
        <div className="mb-8 relative overflow-hidden rounded-2xl p-8 gradient-mesh border border-border/50 shadow-lg">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-4xl mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}!
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your business listings, upgrades, and account settings
                </p>
              </div>
              <div className="hidden md:block animate-float">
                <div className="w-20 h-20 rounded-full gradient-vibrant opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted">
            <TabsTrigger value="overview" className="gap-2 py-3">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="gap-2 py-3">
              <Sparkles className="w-4 h-4" />
              Upgrades
            </TabsTrigger>
            <TabsTrigger value="businesses" className="gap-2 py-3">
              <Building2 className="w-4 h-4" />
              Businesses
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2 py-3">
              <TrendingUp className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 py-3">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Badge Claim Banner */}
            <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <BadgeIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-xl mb-1">Get 1 Month FREE Featured Listing!</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Add our badge to your website and receive one FREE month of featured listing (worth $29). 
                        Generate your custom badge in seconds!
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          No credit card required
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          Coupon code within 24-48 hours
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="gap-2 shrink-0">
                    <Link to="/badge-generator">
                      <Sparkles className="w-4 h-4" />
                      Generate Badge & Get $29 Off
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="hover-lift border-l-4 border-l-primary shadow-md bg-gradient-to-br from-background to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-primary">{stats?.totalBusinesses || 0}</span>
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
                    <span className="text-3xl font-bold text-secondary">{stats?.totalReviews || 0}</span>
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
                    <span className="text-3xl font-bold text-accent">{stats?.totalFavorites || 0}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Saved Favorites</h3>
                </CardContent>
              </Card>

              <Card className="hover-lift border-l-4 border-l-success shadow-md bg-gradient-to-br from-background to-success/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-success" />
                    </div>
                    <span className="text-3xl font-bold text-success">{stats?.featuredBusinesses || 0}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Featured Listings</h3>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover-lift shadow-xl cursor-pointer" onClick={() => navigate("/business/submit")}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Add Business</h3>
                      <p className="text-sm text-muted-foreground">Create a new listing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift shadow-xl cursor-pointer" onClick={() => setActiveTab("upgrades")}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Upgrade to Featured</h3>
                      <p className="text-sm text-muted-foreground">Get more visibility</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift shadow-xl cursor-pointer" onClick={() => navigate("/badge-generator")}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <BadgeIcon className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Get Free Badge</h3>
                      <p className="text-sm text-muted-foreground">Earn free featured month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift shadow-xl cursor-pointer" onClick={() => navigate("/business-dashboard")}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Manage Businesses</h3>
                      <p className="text-sm text-muted-foreground">View all listings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift shadow-xl cursor-pointer" onClick={() => setActiveTab("activity")}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">View Activity</h3>
                      <p className="text-sm text-muted-foreground">Recent updates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift shadow-xl cursor-pointer" onClick={() => setActiveTab("settings")}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Settings className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Settings</h3>
                      <p className="text-sm text-muted-foreground">Account preferences</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Upgrades Tab */}
          <TabsContent value="upgrades" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Featured Listing Upgrade */}
              <Card className="shadow-xl border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Featured Listing
                      </CardTitle>
                      <CardDescription>Get top placement and increased visibility</CardDescription>
                    </div>
                    <Badge className="bg-primary text-white">$29/month</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Top placement on city pages
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Blue border and Featured badge
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Upload up to 8 images
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      3-5x more views and clicks
                    </li>
                  </ul>
                  <Button className="w-full" onClick={() => navigate("/advertise")}>
                    Learn More & Upgrade
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Badge Generator */}
              <Card className="shadow-xl border-2 border-success/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BadgeIcon className="w-5 h-5 text-success" />
                        Free Badge Program
                      </CardTitle>
                      <CardDescription>Get one free month of featured listing</CardDescription>
                    </div>
                    <Badge className="bg-success text-white">FREE</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add our badge to your website and receive one FREE month of featured listing (worth $29).
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Generate your badge code
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Add to your website
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Receive coupon code within 24-48 hours
                    </li>
                  </ul>
                  {badgeRequests && badgeRequests.length > 0 && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs font-semibold mb-2">Your Badge Requests:</p>
                      {badgeRequests.map((req: any) => (
                        <div key={req.id} className="flex items-center justify-between text-xs">
                          <span>{req.business_name}</span>
                          <Badge variant={req.status === "coupon_sent" ? "default" : "secondary"}>
                            {req.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button className="w-full" variant="outline" onClick={() => navigate("/badge-generator")}>
                    Generate Your Badge
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Current Upgrades */}
            {stats && stats.featuredBusinesses > 0 && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Active Upgrades</CardTitle>
                  <CardDescription>Your current featured listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">You have {stats.featuredBusinesses} featured listing(s)</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage your featured listings from the Businesses tab
                    </p>
                    <Button onClick={() => setActiveTab("businesses")}>
                      View Businesses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses">
            <Card className="shadow-xl">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Businesses</CardTitle>
                    <CardDescription>Manage your business listings</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/business/submit")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Business
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">No businesses yet</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Start by adding your first business listing
                  </p>
                  <Button onClick={() => navigate("/business/submit")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Business
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Or visit the{" "}
                    <Link to="/business-dashboard" className="text-primary hover:underline">
                      Business Owner Dashboard
                    </Link>{" "}
                    for advanced management
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="shadow-xl">
              <CardHeader className="border-b">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions and updates</CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No recent activity</p>
                  <p className="text-sm">Start by adding a business, leaving reviews, or upgrading to featured</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        defaultValue={user?.user_metadata?.full_name || ""}
                        className="mt-2"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/advertise")}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    View Pricing Plans
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/badge-generator")}>
                    <BadgeIcon className="w-4 h-4 mr-2" />
                    Badge Generator
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/business-dashboard")}>
                    <Building2 className="w-4 h-4 mr-2" />
                    Business Owner Dashboard
                  </Button>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get help when you need it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">Email Support</p>
                      <p className="text-xs text-muted-foreground">support@humblehalal.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">Phone Support</p>
                      <p className="text-xs text-muted-foreground">Available 9am - 6pm SGT</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/about")}>
                    Learn More About Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
