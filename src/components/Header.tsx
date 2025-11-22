import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/category/food-beverage" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Restaurant
            </Link>
            <Link to="/articles" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Blog
            </Link>
            <Link to="/events" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Events
            </Link>
            <Link to="/auth" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* User Avatar */}
          <Link to="/auth">
            <div className="w-10 h-10 rounded-full bg-muted border-2 border-border overflow-hidden hover:border-primary transition-colors cursor-pointer flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
