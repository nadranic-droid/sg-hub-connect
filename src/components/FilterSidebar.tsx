import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";

interface FilterSidebarProps {
  categories?: { id: string; name: string }[];
  neighbourhoods?: { id: string; name: string }[];
  onFilterChange?: (filters: any) => void;
}

export const FilterSidebar = ({
  categories = [],
  neighbourhoods = [],
  onFilterChange,
}: FilterSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Filters</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox id={`cat-${category.id}`} />
                    <Label
                      htmlFor={`cat-${category.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Neighbourhoods */}
          {neighbourhoods.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Neighbourhoods</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {neighbourhoods.map((neighbourhood) => (
                  <div key={neighbourhood.id} className="flex items-center space-x-2">
                    <Checkbox id={`neigh-${neighbourhood.id}`} />
                    <Label
                      htmlFor={`neigh-${neighbourhood.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {neighbourhood.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Rating */}
          <div>
            <h4 className="font-medium mb-3">Minimum Rating</h4>
            <RadioGroup defaultValue="0">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-normal cursor-pointer flex items-center gap-1"
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">& up</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <RadioGroup defaultValue="all">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="price-all" />
                <Label htmlFor="price-all" className="text-sm font-normal cursor-pointer">
                  All Prices
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="$" id="price-1" />
                <Label htmlFor="price-1" className="text-sm font-normal cursor-pointer">
                  $ - Budget
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="$$" id="price-2" />
                <Label htmlFor="price-2" className="text-sm font-normal cursor-pointer">
                  $$ - Moderate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="$$$" id="price-3" />
                <Label htmlFor="price-3" className="text-sm font-normal cursor-pointer">
                  $$$ - Expensive
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="$$$$" id="price-4" />
                <Label htmlFor="price-4" className="text-sm font-normal cursor-pointer">
                  $$$$ - Luxury
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h4 className="font-medium mb-3">Amenities</h4>
            <div className="space-y-2">
              {["WiFi", "Parking", "Wheelchair Accessible", "Pet Friendly", "Air Conditioning"].map(
                (amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox id={amenity.toLowerCase().replace(/\s+/g, "-")} />
                    <Label
                      htmlFor={amenity.toLowerCase().replace(/\s+/g, "-")}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {amenity}
                    </Label>
                  </div>
                )
              )}
            </div>
          </div>

          <Separator />

          {/* Open Now */}
          <div className="flex items-center space-x-2">
            <Checkbox id="open-now" />
            <Label htmlFor="open-now" className="text-sm font-medium cursor-pointer">
              Open Now
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
