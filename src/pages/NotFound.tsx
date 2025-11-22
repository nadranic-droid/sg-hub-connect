import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-lg">
        <div className="relative">
          <h1 className="text-9xl font-bold gradient-text">404</h1>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-vibrant" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button variant="outline" size="lg" asChild>
            <Link to="/" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
          <Button size="lg" asChild>
            <Link to="/" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="pt-8 space-y-2">
          <p className="text-sm text-muted-foreground">Quick Links:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="text-primary hover:underline text-sm">
              Home
            </Link>
            <Link to="/search" className="text-primary hover:underline text-sm">
              Search Businesses
            </Link>
            <Link to="/dashboard" className="text-primary hover:underline text-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
