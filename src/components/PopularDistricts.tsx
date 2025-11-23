import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const defaultDistricts = [
  {
    name: "Kampong Glam",
    slug: "kampong-glam",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&fit=crop",
    description: "Historic district with trendy cafes and boutiques",
    count: 0
  },
  {
    name: "Bugis",
    slug: "bugis",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&fit=crop",
    description: "Bustling shopping streets and Halal eateries",
    count: 0
  },
  {
    name: "Geylang Serai",
    slug: "geylang-serai",
    image: "https://images.unsplash.com/photo-1518639192441-8fce0a611688?w=800&fit=crop",
    description: "Cultural heart of the Malay community",
    count: 0
  },
  {
    name: "Jurong East",
    slug: "jurong-east",
    image: "https://images.unsplash.com/photo-1625237672263-c4c22cb77a4d?w=800&fit=crop",
    description: "Second CBD with massive malls and food courts",
    count: 0
  }
];

export const PopularDistricts = () => {
  const [districts, setDistricts] = useState(defaultDistricts);

  useEffect(() => {
    const fetchDistrictCounts = async () => {
      try {
        // Fetch business counts per neighbourhood
        const { data: businesses } = await supabase
          .from("businesses")
          .select("neighbourhood_id, neighbourhoods!inner(id, name, slug)")
          .eq("status", "approved");

        if (businesses) {
          // Count businesses per neighbourhood
          const counts: Record<string, number> = {};
          businesses.forEach((b: any) => {
            const hoodSlug = b.neighbourhoods?.slug || b.neighbourhoods?.name?.toLowerCase().replace(/\s+/g, '-');
            if (hoodSlug) {
              counts[hoodSlug] = (counts[hoodSlug] || 0) + 1;
            }
          });

          const districtsWithCounts = defaultDistricts.map(district => ({
            ...district,
            count: counts[district.slug] || 0,
          }));
          setDistricts(districtsWithCounts);
        }
      } catch (error) {
        console.error("Failed to fetch district counts:", error);
        // Keep default districts with 0 counts
      }
    };

    fetchDistrictCounts();
  }, []);
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-2">
              Explore Top Neighbourhoods
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover the best Halal spots in Singapore's most vibrant districts
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2" asChild>
            <Link to="/#neighbourhoods">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {districts.map((district) => (
            <Link key={district.slug} to={`/explore/${district.slug}`} className="group">
              <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img
                    src={district.image}
                    alt={district.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback to a Singapore cityscape image if original fails
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop";
                      target.onerror = null;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white">
                    <h3 className="font-heading font-bold text-xl mb-1">
                      {district.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{district.count}+ Places</span>
                    </div>
                    <p className="text-xs opacity-80 line-clamp-2">
                      {district.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3 md:hidden">
           <Button variant="outline" className="w-full" asChild>
            <Link to="/#neighbourhoods">
              View All Neighbourhoods
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
