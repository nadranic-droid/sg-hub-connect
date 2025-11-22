import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
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
        <div className="bg-white rounded-xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl shadow-2xl">
          <div className="flex items-center flex-1 px-4 border-r border-border">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              placeholder="What are you looking for?"
              className="border-0 h-12 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex items-center flex-1 px-4">
            <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              placeholder="Where?"
              className="border-0 h-12 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button className="bg-primary hover:bg-primary-dark text-white font-semibold h-12 px-8">
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};
