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

  return (
    <section 
      className="h-[500px] bg-cover bg-center relative flex items-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-primary/80"></div>
      <div className="container mx-auto px-4 relative z-10 text-white">
        <h1 className="font-heading font-extrabold text-4xl md:text-6xl mb-4 max-w-3xl">
          Navigate Singapore's Halal Scene With Confidence.
        </h1>
        <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl">
          Discover the most restaurants to expansionat Halal Singapore.
        </p>
        
        {/* Split Search Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl shadow-2xl">
          <div className="flex items-center flex-1 px-4 border-r border-border">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 h-12 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex items-center flex-1 px-4">
            <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              placeholder="Where?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 h-12 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold h-12 px-8">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
};
