import { User, LogIn, PlusCircle, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
            <Shield className="w-6 h-6" />
            <span className="font-heading font-extrabold text-xl">Humble Halal</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/category/community" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Community
            </Link>
            <Link to="/resources" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Resources
            </Link>
            <Link to="/events" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Events
            </Link>
            <Link to="/advertise" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Advertise
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2" asChild>
              <Link to="/business/submit">
                <Store className="w-4 h-4" />
                List Business
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-border overflow-hidden hover:border-primary transition-colors cursor-pointer flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/business/submit">Register Business</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/claim-business">Claim Business</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
