import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessCardProps {
  id: string;
  name: string;
  slug: string;
  category?: string;
  neighbourhood: string;
  shortDescription?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  image?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  phone?: string;
  website?: string;
  distance?: string;
  certification?: "MUIS" | "Muslim-Owned" | null;
}

export const BusinessCard = ({
  name,
  slug,
  neighbourhood,
  rating = 0,
  image,
  distance = "0.5km",
  certification,
  isFeatured = false,
}: BusinessCardProps) => {
  return (
    <Link to={`/business/${slug}`}>
      <Card 
        className={cn(
          "overflow-hidden hover-lift border group relative",
          isFeatured 
            ? "border-blue-600 border-3 shadow-lg shadow-blue-600/10" 
            : "border-border"
        )}
      >
        {isFeatured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-blue-600 text-white hover:bg-blue-700 gap-1 shadow-md">
              <Sparkles className="w-3 h-3" />
              Featured
            </Badge>
          </div>
        )}
        
        <div className="aspect-[4/3] overflow-hidden relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/30">
                {name.charAt(0)}
              </span>
            </div>
          )}
          {isFeatured && (
            <div className="absolute inset-0 border-2 border-blue-600/30 pointer-events-none" />
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors line-clamp-1 flex-1">
              {name}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{rating}</span>
            <span>•</span>
            <span>{distance} away ({neighbourhood})</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {certification === "MUIS" ? (
              <Badge className="bg-primary text-white hover:bg-primary-dark">
                <Shield className="w-3 h-3 mr-1" />
                MUIS Certified
              </Badge>
            ) : certification === "Muslim-Owned" ? (
              <Badge variant="outline" className="border-accent text-accent">
                <span className="mr-1">☪️</span>
                Muslim-Owned
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
