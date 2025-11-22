import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNavLink } from "@/components/SidebarNavLink";
import { Button } from "@/components/ui/button";
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
  Calendar,
  CreditCard,
  Target,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        .maybeSingle();

      if (!roleData) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/dashboard");
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

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
            <Link to="/admin">
              <h1 className="text-2xl font-bold gradient-text">Humble Halal Admin</h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
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
                Business Claims
              </SidebarNavLink>
              <SidebarNavLink to="/admin/events" icon={<Calendar />}>
                Events
              </SidebarNavLink>
              <SidebarNavLink to="/admin/articles" icon={<FileText />}>
                Motizine (Articles)
              </SidebarNavLink>
              <SidebarNavLink to="/admin/membership" icon={<CreditCard />}>
                Membership Plans
              </SidebarNavLink>
              <SidebarNavLink to="/admin/ads" icon={<Target />}>
                Ad Slots
              </SidebarNavLink>
              <SidebarNavLink to="/admin/analytics" icon={<BarChart3 />}>
                Analytics
              </SidebarNavLink>
              <SidebarNavLink to="/admin/settings" icon={<Settings />}>
                Settings
              </SidebarNavLink>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
