import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";

interface AdSlotProps {
  type: "home_featured" | "sidebar_promo" | "banner_top" | "banner_bottom" | "in_content";
  className?: string;
  showMockup?: boolean; // Show mockup when no ad available
}

interface AdData {
  id: string;
  slot_type: string;
  status: string;
  start_date: string;
  end_date: string;
  businesses: {
    name: string;
    short_description: string;
    cover_image?: string;
    slug: string;
  };
}

// Mockup ad data for demonstration
const mockupAds = {
  banner_top: {
    name: "Premium Halal Restaurant",
    short_description: "Authentic Middle Eastern cuisine",
    cover_image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
    slug: "premium-halal-restaurant"
  },
  sidebar_promo: {
    name: "Halal Food Festival",
    short_description: "Join us for amazing halal food",
    cover_image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop",
    slug: "halal-food-festival"
  },
  home_featured: {
    name: "Featured Business",
    short_description: "Discover our special offers",
    cover_image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
    slug: "featured-business"
  },
  banner_bottom: {
    name: "Special Promotion",
    short_description: "Limited time offer",
    cover_image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop",
    slug: "special-promotion"
  },
  in_content: {
    name: "Sponsored Content",
    short_description: "Check out our latest deals",
    cover_image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop",
    slug: "sponsored-content"
  }
};

export const AdSlot = ({ type, className = "", showMockup = true }: AdSlotProps) => {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      const today = new Date().toISOString();
      const { data } = await supabase
        .from("ad_slots")
        .select(`
          *,
          businesses (
            name,
            short_description,
            cover_image,
            slug
          )
        `)
        .eq("slot_type", type)
        .eq("status", "active")
        .lte("start_date", today)
        .gte("end_date", today)
        .limit(1)
        .maybeSingle();

      if (data) {
        setAd(data);
        // Track impression (if RPC function exists)
        try {
          await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<unknown>)(
            "increment_ad_impression",
            { ad_id: data.id }
          );
        } catch {
          // RPC function may not exist, ignore
        }
      }
      setLoading(false);
    };

    fetchAd();
  }, [type]);

  // Show mockup if no ad and showMockup is true
  if (!loading && (!ad || !ad.businesses)) {
    if (!showMockup) return null;
    
    // Use mockup data
    const mockup = mockupAds[type];
    if (!mockup) return null;
    
    // Create mock ad structure
    const mockAd = {
      id: "mockup",
      businesses: mockup
    } as AdData;
    
    // Render with mockup styling
    return renderAdSlot(mockAd, type, className, true);
  }

  if (!ad || !ad.businesses) return null;
  
  return renderAdSlot(ad, type, className, false);
};

const renderAdSlot = (ad: AdData, type: string, className: string, isMockup: boolean) => {

  const handleClick = async () => {
    if (isMockup) {
      // Don't track clicks on mockups
      return;
    }
    // Track click (if RPC function exists)
    try {
      await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<unknown>)(
        "increment_ad_click",
        { ad_id: ad.id }
      );
    } catch {
      // RPC function may not exist, ignore
    }
  };

  if (type === "banner_top") {
    return (
      <div className={`w-full bg-primary/5 border-b border-primary/10 py-2 ${className} ${isMockup ? 'opacity-75' : ''}`}>
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-sm">
          {isMockup && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">MOCKUP</span>
          )}
          <span className="font-bold text-primary">Featured:</span>
          <span className="font-medium">{ad.businesses.name}</span>
          {ad.businesses.short_description && (
            <span className="hidden md:inline">- {ad.businesses.short_description}</span>
          )}
          <a 
            href={isMockup ? '#' : `/business/${ad.businesses.slug}`} 
            onClick={handleClick}
            className="ml-2 text-primary hover:underline font-semibold flex items-center gap-1"
          >
            Visit Now <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  if (type === "sidebar_promo") {
    return (
      <Card className={`overflow-hidden border-primary/20 shadow-md ${className} ${isMockup ? 'opacity-75 border-dashed' : ''}`}>
        <div className={`bg-primary/5 p-2 text-xs text-center font-medium uppercase tracking-widest ${isMockup ? 'bg-yellow-100 text-yellow-800' : 'text-muted-foreground'}`}>
          {isMockup ? 'MOCKUP - Sponsored' : 'Sponsored'}
        </div>
        {ad.businesses.cover_image && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={ad.businesses.cover_image} 
              alt={ad.businesses.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <CardContent className="p-4 text-center">
          <h3 className="font-heading font-bold text-lg mb-2">{ad.businesses.name}</h3>
          {ad.businesses.short_description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {ad.businesses.short_description}
            </p>
          )}
          <Button asChild className="w-full" onClick={handleClick} disabled={isMockup}>
            <a href={isMockup ? '#' : `/business/${ad.businesses.slug}`}>Learn More</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (type === "banner_bottom") {
    return (
      <div className={`w-full bg-gradient-to-r from-primary/10 to-primary/5 border-t border-b border-primary/20 py-4 ${className} ${isMockup ? 'opacity-75 border-dashed' : ''}`}>
        <div className="container mx-auto px-4">
          {isMockup && (
            <div className="text-center mb-2">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">MOCKUP AD</span>
            </div>
          )}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {ad.businesses.cover_image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <img src={ad.businesses.cover_image} alt={ad.businesses.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{ad.businesses.name}</h3>
                {ad.businesses.short_description && (
                  <p className="text-sm text-muted-foreground">{ad.businesses.short_description}</p>
                )}
              </div>
            </div>
            <Button onClick={handleClick} disabled={isMockup} asChild>
              <a href={isMockup ? '#' : `/business/${ad.businesses.slug}`}>
                Learn More <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (type === "in_content") {
    return (
      <Card className={`my-8 border-2 border-primary/20 ${className} ${isMockup ? 'opacity-75 border-dashed' : ''}`}>
        <CardContent className="p-6">
          {isMockup && (
            <div className="text-center mb-4">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">MOCKUP AD</span>
            </div>
          )}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {ad.businesses.cover_image && (
              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                <img src={ad.businesses.cover_image} alt={ad.businesses.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold mb-2">
                SPONSORED
              </div>
              <h3 className="font-bold text-xl mb-2">{ad.businesses.name}</h3>
              {ad.businesses.short_description && (
                <p className="text-muted-foreground mb-4">{ad.businesses.short_description}</p>
              )}
              <Button onClick={handleClick} disabled={isMockup} asChild>
                <a href={isMockup ? '#' : `/business/${ad.businesses.slug}`}>
                  Visit Business <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default: home_featured
  return (
    <section className={`py-8 ${className} ${isMockup ? 'opacity-75' : ''}`}>
      <div className="container mx-auto px-4">
        {isMockup && (
          <div className="text-center mb-4">
            <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold">MOCKUP ADVERTISEMENT</span>
          </div>
        )}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-primary/10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
              FEATURED PARTNER
            </div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">
              {ad.businesses.name}
            </h2>
            {ad.businesses.short_description && (
              <p className="text-muted-foreground text-lg mb-6 max-w-xl">
                {ad.businesses.short_description}
              </p>
            )}
            <Button size="lg" asChild onClick={handleClick} disabled={isMockup}>
              <a href={isMockup ? '#' : `/business/${ad.businesses.slug}`}>View Special Offers</a>
            </Button>
          </div>
          {ad.businesses.cover_image && (
            <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-xl">
              <img 
                src={ad.businesses.cover_image} 
                alt={ad.businesses.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

