import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield } from "lucide-react";

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
}: BusinessCardProps) => {
  return (
    <Link to={`/business/${slug}`}>
      <Card className="overflow-hidden hover-lift border border-border group">
        <div className="aspect-[4/3] overflow-hidden">
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
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{rating}</span>
            <span>•</span>
            <span>{distance} away ({neighbourhood})</span>
          </div>

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
        </CardContent>
      </Card>
    </Link>
  );
};
