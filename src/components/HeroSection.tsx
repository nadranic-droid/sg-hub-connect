import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (location) params.append('location', location);
    navigate(`/search?${params.toString()}`);
  };

  const heroImage = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&auto=format&fit=crop";
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&auto=format&fit=crop";

  return (
    <section 
      className="h-[450px] sm:h-[500px] md:h-[600px] bg-cover bg-center relative flex items-center"
      style={{ 
        backgroundImage: `url('${imageError ? fallbackImage : heroImage}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70"></div>
      <img 
        src={heroImage} 
        alt="" 
        className="hidden"
        onError={() => setImageError(true)}
      />
      <div className="container mx-auto px-4 relative z-10 text-white">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 max-w-3xl leading-tight">
          Navigate Singapore's Halal Scene With Confidence.
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-10 opacity-95 max-w-2xl font-medium">
          Discover the most trusted Halal restaurants, cafes, and services across Singapore.
        </p>
        
        {/* Split Search Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 sm:p-3 flex flex-col md:flex-row gap-2 max-w-3xl shadow-2xl">
          <div className="flex items-center flex-1 px-3 sm:px-4 border-r-0 md:border-r border-b md:border-b-0 border-border pb-2 md:pb-0">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mr-2 sm:mr-3 shrink-0" />
            <Input
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 h-10 sm:h-12 text-foreground text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex items-center flex-1 px-3 sm:px-4 border-r-0 md:border-r border-b md:border-b-0 border-border pb-2 md:pb-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mr-2 sm:mr-3 shrink-0" />
            <Input
              placeholder="Where?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 h-10 sm:h-12 text-foreground text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold h-10 sm:h-12 px-6 sm:px-8 shrink-0 text-sm sm:text-base w-full md:w-auto">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
};
