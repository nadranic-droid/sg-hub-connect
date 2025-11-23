import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Store, TrendingUp, Eye, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    pendingBusinesses: 0,
    totalUsers: 0,
    totalViews: 0,
    totalReviews: 0,
    loading: true,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch businesses count
      const { count: businessCount } = await supabase
        .from("businesses")
        .select("*", { count: "exact", head: true });

      // Fetch pending businesses
      const { count: pendingCount } = await supabase
        .from("businesses")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Fetch users count (from profiles)
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total views (sum of views_count from businesses)
      const { data: businesses } = await supabase
        .from("businesses")
        .select("views_count");

      const totalViews = businesses?.reduce((sum, b) => sum + (b.views_count || 0), 0) || 0;

      // Fetch reviews count
      const { count: reviewCount } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });

      setStats({
        totalBusinesses: businessCount || 0,
        pendingBusinesses: pendingCount || 0,
        totalUsers: userCount || 0,
        totalViews,
        totalReviews: reviewCount || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to load analytics");
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const displayStats = [
    { 
      title: "Total Businesses", 
      value: stats.totalBusinesses.toLocaleString(), 
      icon: Store, 
      change: `${stats.pendingBusinesses} pending approval` 
    },
    { 
      title: "Total Users", 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      change: "Registered users" 
    },
    { 
      title: "Total Views", 
      value: stats.totalViews.toLocaleString(), 
      icon: Eye, 
      change: "Business page views" 
    },
    { 
      title: "Total Reviews", 
      value: stats.totalReviews.toLocaleString(), 
      icon: MessageSquare, 
      change: "User reviews" 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Overview of platform performance and revenue</p>
      </div>

      {stats.loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Chart Placeholder (Implement Recharts or similar)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Olivia Martin</p>
                  <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Jackson Lee</p>
                  <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                </div>
                <div className="ml-auto font-medium">+$39.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;

