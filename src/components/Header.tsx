import { User, LogIn, PlusCircle, Store, Menu, X } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors shrink-0">
            <Shield className="w-6 h-6" />
            <span className="font-heading font-extrabold text-lg sm:text-xl">Humble Halal</span>
          </Link>

          {/* Desktop Navigation */}
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

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop CTA Button */}
            <Button variant="outline" size="sm" className="hidden md:flex gap-2" asChild>
              <Link to="/business/submit">
                <Store className="w-4 h-4" />
                List Business
              </Link>
            </Button>

            {/* User Menu / Auth Buttons */}
            {user ? (
              <>
                {/* Desktop User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden sm:flex">
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
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    <span>Humble Halal</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-2">
                    <Link 
                      to="/" 
                      className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/category/community" 
                      className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Community
                    </Link>
                    <Link 
                      to="/resources" 
                      className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Resources
                    </Link>
                    <Link 
                      to="/events" 
                      className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Events
                    </Link>
                    <Link 
                      to="/advertise" 
                      className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Advertise
                    </Link>
                    <Link 
                      to="/about" 
                      className="px-4 py-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                  </nav>

                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <Link 
                          to="/dashboard" 
                          className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          to="/business/submit" 
                          className="px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Register Business
                        </Link>
                        <Link 
                          to="/claim-business" 
                          className="px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Claim Business
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full mt-2"
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                        </Button>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-4 gap-2" asChild>
                      <Link to="/business/submit" onClick={() => setMobileMenuOpen(false)}>
                        <Store className="w-4 h-4" />
                        List Business
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
