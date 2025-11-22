import { Search, MapPin, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex-shrink-0">
            <div className="font-heading font-bold text-xl leading-tight">
              Humble Halal
              <div className="text-xs font-normal opacity-90">Singapore Business Directory</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <Input
              placeholder="Search for food, services, or areas in Singapore..."
              className="w-full h-11 pl-4 pr-12 bg-white text-foreground border-0 focus-visible:ring-2 focus-visible:ring-white/30"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">Singapore, Near Bugis</span>
            </div>
            <Link to="/auth">
              <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
