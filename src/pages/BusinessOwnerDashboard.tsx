import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Building2, Star, MessageSquare, Plus, TrendingUp, Eye, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { User } from "@supabase/supabase-js";

interface Stats {
  totalBusinesses: number;
  totalViews: number;
  totalReviews: number;
  totalEnquiries: number;
  avgRating: number;
}

interface Business {
  id: string;
  name: string;
  status: string;
  views_count: number;
  review_count: number;
  avg_rating: number;
}

interface Review {
  id: string;
  title: string;
  rating: number;
  content: string;
  created_at: string;
  status: string;
  business: { name: string };
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: string;
  business: { name: string };
}

const BusinessOwnerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    totalViews: 0,
    totalReviews: 0,
    totalEnquiries: 0,
    avgRating: 0
  });
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await loadDashboardData(session.user.id);
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

  const loadDashboardData = async (userId: string) => {
    // Load businesses
    const { data: businessData } = await supabase
      .from("businesses")
      .select("id, name, status, views_count, review_count, avg_rating")
      .eq("owner_id", userId);

    if (businessData) {
      setBusinesses(businessData);
      
      const totalViews = businessData.reduce((sum, b) => sum + (b.views_count || 0), 0);
      const totalReviews = businessData.reduce((sum, b) => sum + (b.review_count || 0), 0);
      const avgRating = businessData.length > 0 
        ? businessData.reduce((sum, b) => sum + (b.avg_rating || 0), 0) / businessData.length 
        : 0;

      // Load enquiries
      const { data: enquiryData } = await supabase
        .from("enquiries")
        .select("id, name, email, message, created_at, status, business:businesses(name)")
        .in("business_id", businessData.map(b => b.id))
        .order("created_at", { ascending: false })
        .limit(10);

      // Load reviews
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("id, title, rating, content, created_at, status, business:businesses(name)")
        .in("business_id", businessData.map(b => b.id))
        .order("created_at", { ascending: false })
        .limit(10);

      setStats({
        totalBusinesses: businessData.length,
        totalViews,
        totalReviews,
        totalEnquiries: enquiryData?.length || 0,
        avgRating
      });

      if (enquiryData) setEnquiries(enquiryData as any);
      if (reviewData) setReviews(reviewData as any);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  // Mock analytics data
  const analyticsData = [
    { month: "Jan", views: 120, enquiries: 8 },
    { month: "Feb", views: 180, enquiries: 12 },
    { month: "Mar", views: 240, enquiries: 18 },
    { month: "Apr", views: 320, enquiries: 25 },
    { month: "May", views: 280, enquiries: 20 },
    { month: "Jun", views: 390, enquiries: 32 }
  ];

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
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/business/submit")} variant="hero" className="gap-2">
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
        <Breadcrumbs items={[{ label: "Business Dashboard" }]} className="mb-6" />

        {/* Welcome Section */}
        <div className="mb-8 relative overflow-hidden rounded-2xl p-8 gradient-mesh border border-border/50 shadow-lg">
          <div className="relative z-10">
            <h1 className="font-heading font-bold text-4xl mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Business Owner Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your listings, engage with customers, and grow your business
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="hover-lift border-l-4 border-l-primary shadow-md bg-gradient-to-br from-background to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-3xl font-bold text-primary">{stats.totalBusinesses}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Businesses</h3>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-accent shadow-md bg-gradient-to-br from-background to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
                <span className="text-3xl font-bold text-accent">{stats.totalViews}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Views</h3>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-secondary shadow-md bg-gradient-to-br from-background to-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-3xl font-bold text-secondary">{stats.totalReviews}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Total Reviews</h3>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-success shadow-md bg-gradient-to-br from-background to-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-success" />
                </div>
                <span className="text-3xl font-bold text-success">{stats.totalEnquiries}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Enquiries</h3>
            </CardContent>
          </Card>

          <Card className="hover-lift border-l-4 border-l-primary-light shadow-md bg-gradient-to-br from-background to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-3xl font-bold text-primary">{stats.avgRating.toFixed(1)}</span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">Avg Rating</h3>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Views Over Time
              </CardTitle>
              <CardDescription>Monthly view statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Enquiries Over Time
              </CardTitle>
              <CardDescription>Monthly enquiry statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="enquiries" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="businesses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="businesses" className="gap-2 py-3">
              <Building2 className="w-4 h-4" />
              My Businesses
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2 py-3">
              <Star className="w-4 h-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="gap-2 py-3">
              <MessageSquare className="w-4 h-4" />
              Enquiries
            </TabsTrigger>
          </TabsList>

          {/* Businesses Tab */}
          <TabsContent value="businesses">
            <Card className="shadow-xl">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Business Listings</CardTitle>
                    <CardDescription>Manage and monitor your businesses</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/business/submit")} variant="hero" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Business
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Reviews</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {businesses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No businesses yet. Add your first business to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      businesses.map((business) => (
                        <TableRow key={business.id}>
                          <TableCell className="font-medium">{business.name}</TableCell>
                          <TableCell>
                            <Badge variant={business.status === "approved" ? "default" : "secondary"}>
                              {business.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{business.views_count}</TableCell>
                          <TableCell className="text-right">{business.review_count}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Star className="w-4 h-4 fill-secondary text-secondary" />
                              {business.avg_rating.toFixed(1)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="shadow-xl">
              <CardHeader className="border-b">
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>Monitor and respond to customer feedback</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No reviews yet. Encourage customers to leave reviews!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.title}</h4>
                            <p className="text-sm text-muted-foreground">{review.business.name}</p>
                          </div>
                          <Badge variant={review.status === "approved" ? "default" : "secondary"}>
                            {review.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-secondary text-secondary" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enquiries Tab */}
          <TabsContent value="enquiries">
            <Card className="shadow-xl">
              <CardHeader className="border-b">
                <CardTitle>Customer Enquiries</CardTitle>
                <CardDescription>Respond to customer questions and requests</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {enquiries.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No enquiries yet. Customers will reach out when interested!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map((enquiry) => (
                      <div key={enquiry.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{enquiry.name}</h4>
                            <p className="text-sm text-muted-foreground">{enquiry.business.name}</p>
                          </div>
                          <Badge variant={enquiry.status === "new" ? "default" : "secondary"}>
                            {enquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{enquiry.email}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{enquiry.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(enquiry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BusinessOwnerDashboard;
