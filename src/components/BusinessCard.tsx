import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Globe, Heart, Verified } from "lucide-react";
import { useState } from "react";

interface BusinessCardProps {
  id: string;
  name: string;
  slug: string;
  category: string;
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
}

export const BusinessCard = ({
  id,
  name,
  slug,
  category,
  neighbourhood,
  shortDescription,
  rating = 0,
  reviewCount = 0,
  priceRange,
  image,
  isVerified,
  isFeatured,
  phone,
  website,
}: BusinessCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden hover-lift border-2 border-border/50 hover:border-primary/50 transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full gradient-mesh flex items-center justify-center">
            <span className="text-4xl font-bold text-white/30">{name.charAt(0)}</span>
          </div>
        )}
        {isFeatured && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground shadow-glow-secondary">
            Featured
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background ${
            isFavorite ? "text-destructive" : "text-muted-foreground"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link to={`/business/${slug}`} className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {name}
              {isVerified && (
                <Verified className="inline-block w-4 h-4 ml-1.5 text-primary fill-primary" />
              )}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          {priceRange && (
            <span className="text-sm text-muted-foreground">{priceRange}</span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-secondary text-secondary"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-1">
            {rating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>

        {shortDescription && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {shortDescription}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{neighbourhood}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link to={`/business/${slug}`}>View Details</Link>
          </Button>
          {phone && (
            <Button variant="outline" size="icon" asChild>
              <a href={`tel:${phone}`}>
                <Phone className="w-4 h-4" />
              </a>
            </Button>
          )}
          {website && (
            <Button variant="outline" size="icon" asChild>
              <a href={website} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
