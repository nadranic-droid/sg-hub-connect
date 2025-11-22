import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SidebarNavLink } from "@/components/SidebarNavLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FolderTree, 
  MapPin, 
  Star, 
  FileCheck, 
  BarChart3, 
  Settings,
  LogOut,
  Search,
  MoreVertical,
  Check,
  X,
  Eye
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    pendingBusinesses: 0,
    totalUsers: 0,
    totalReviews: 0,
    pendingReviews: 0,
    totalCategories: 0
  });
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/dashboard");
        return;
      }

      await fetchStats();
      await fetchBusinesses();
      await fetchReviews();
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const fetchStats = async () => {
    const [businessesRes, usersRes, reviewsRes, categoriesRes] = await Promise.all([
      supabase.from("businesses").select("id, status", { count: "exact" }),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("reviews").select("id, status", { count: "exact" }),
      supabase.from("categories").select("id", { count: "exact" })
    ]);

    setStats({
      totalBusinesses: businessesRes.count || 0,
      pendingBusinesses: businessesRes.data?.filter(b => b.status === "pending").length || 0,
      totalUsers: usersRes.count || 0,
      totalReviews: reviewsRes.count || 0,
      pendingReviews: reviewsRes.data?.filter(r => r.status === "pending").length || 0,
      totalCategories: categoriesRes.count || 0
    });
  };

  const fetchBusinesses = async () => {
    const { data } = await supabase
      .from("businesses")
      .select("*, categories(name)")
      .order("created_at", { ascending: false })
      .limit(10);

    setBusinesses(data || []);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, businesses(name), profiles(full_name)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10);

    setReviews(data || []);
  };

  const handleBusinessAction = async (businessId: string, status: string) => {
    const { error } = await supabase
      .from("businesses")
      .update({ status })
      .eq("id", businessId);

    if (error) {
      toast.error("Failed to update business");
    } else {
      toast.success(`Business ${status === "approved" ? "approved" : "rejected"}`);
      fetchBusinesses();
      fetchStats();
    }
  };

  const handleReviewAction = async (reviewId: string, status: string) => {
    const { error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", reviewId);

    if (error) {
      toast.error("Failed to update review");
    } else {
      toast.success(`Review ${status === "approved" ? "approved" : "rejected"}`);
      fetchReviews();
      fetchStats();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold gradient-text">Humble Halal Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            <nav className="space-y-1">
              <SidebarNavLink to="/admin" icon={<LayoutDashboard />}>
                Overview
              </SidebarNavLink>
              <SidebarNavLink to="/admin/businesses" icon={<Building2 />}>
                Businesses
              </SidebarNavLink>
              <SidebarNavLink to="/admin/users" icon={<Users />}>
                Users
              </SidebarNavLink>
              <SidebarNavLink to="/admin/categories" icon={<FolderTree />}>
                Categories
              </SidebarNavLink>
              <SidebarNavLink to="/admin/neighbourhoods" icon={<MapPin />}>
                Neighbourhoods
              </SidebarNavLink>
              <SidebarNavLink to="/admin/reviews" icon={<Star />}>
                Reviews
              </SidebarNavLink>
              <SidebarNavLink to="/admin/claims" icon={<FileCheck />}>
                Claims
              </SidebarNavLink>
              <SidebarNavLink to="/admin/analytics" icon={<BarChart3 />}>
                Analytics
              </SidebarNavLink>
              <SidebarNavLink to="/admin/settings" icon={<Settings />}>
                Settings
              </SidebarNavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            <div>
              <Breadcrumbs items={[{ label: "Admin Dashboard" }]} />
              <h2 className="text-3xl font-bold mt-4">Dashboard Overview</h2>
              <p className="text-muted-foreground mt-2">
                Manage your business directory platform
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Businesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalBusinesses}</div>
                  {stats.pendingBusinesses > 0 && (
                    <Badge variant="secondary" className="mt-2">
                      {stats.pendingBusinesses} pending
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalReviews}</div>
                  {stats.pendingReviews > 0 && (
                    <Badge variant="secondary" className="mt-2">
                      {stats.pendingReviews} pending
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pending Businesses */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Business Approvals</CardTitle>
                <CardDescription>
                  Review and approve new business submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businesses.filter(b => b.status === "pending").map((business) => (
                        <TableRow key={business.id}>
                          <TableCell className="font-medium">{business.name}</TableCell>
                          <TableCell>{business.categories?.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{business.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleBusinessAction(business.id, "approved")}
                              >
                                <Check className="w-4 h-4 text-success" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleBusinessAction(business.id, "rejected")}
                              >
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigate(`/business/${business.slug}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Review Moderation</CardTitle>
                <CardDescription>
                  Review and approve user-submitted reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">
                            {review.businesses?.name}
                          </TableCell>
                          <TableCell>{review.profiles?.full_name || "Anonymous"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              {review.rating}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReviewAction(review.id, "approved")}
                              >
                                <Check className="w-4 h-4 text-success" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReviewAction(review.id, "rejected")}
                              >
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
