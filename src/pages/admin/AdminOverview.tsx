import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    pendingBusinesses: 0,
    totalUsers: 0,
    totalReviews: 0,
    pendingReviews: 0,
    pendingClaims: 0,
    pendingEvents: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [
      businessesRes,
      usersRes,
      reviewsRes,
      claimsRes,
      eventsRes,
    ] = await Promise.all([
      supabase.from("businesses").select("id, status", { count: "exact" }),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("reviews").select("id, status", { count: "exact" }),
      supabase.from("claims").select("id, status", { count: "exact" }),
      supabase.from("events").select("id, status", { count: "exact" }),
    ]);

    setStats({
      totalBusinesses: businessesRes.count || 0,
      pendingBusinesses: businessesRes.data?.filter((b) => b.status === "pending").length || 0,
      totalUsers: usersRes.count || 0,
      totalReviews: reviewsRes.count || 0,
      pendingReviews: reviewsRes.data?.filter((r) => r.status === "pending").length || 0,
      pendingClaims: claimsRes.data?.filter((c) => c.status === "pending").length || 0,
      pendingEvents: eventsRes.data?.filter((e) => e.status === "pending").length || 0,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2">
          Manage your Humble Halal business directory platform
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
              Total Reviews
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

        <Card className="hover-lift border-l-4 border-l-secondary">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{stats.pendingClaims}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.pendingEvents}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
