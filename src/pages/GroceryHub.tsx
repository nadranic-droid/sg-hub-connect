import { CategoryHub } from "@/components/CategoryHub";
import { ShoppingBag, Package, Leaf, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const GroceryHub = () => {
  return (
    <CategoryHub
      categorySlug="groceries"
      categoryName="Groceries"
      icon={ShoppingBag}
      heroGradient="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600"
      description="Shop at Halal-certified grocery stores and supermarkets in Singapore. Find fresh produce, Halal meat, and everyday essentials from trusted suppliers."
      seoKeywords={[
        "halal groceries singapore",
        "halal supermarkets singapore",
        "muis certified groceries",
        "halal food stores",
        "muslim grocery stores",
        "halal meat singapore",
        "halal produce singapore"
      ]}
      contentSections={
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-3xl mb-8 text-center">
                What You'll Find
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Package className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Halal Meat & Poultry</h3>
                        <p className="text-sm text-muted-foreground">
                          Fresh Halal-certified meat, chicken, and seafood from trusted suppliers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Leaf className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Fresh Produce</h3>
                        <p className="text-sm text-muted-foreground">
                          Quality fruits, vegetables, and fresh ingredients for your kitchen
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <ShoppingBag className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Halal Products</h3>
                        <p className="text-sm text-muted-foreground">
                          Certified Halal snacks, beverages, and packaged goods
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Truck className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Delivery Options</h3>
                        <p className="text-sm text-muted-foreground">
                          Many stores offer home delivery for your convenience
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      }
    />
  );
};

export default GroceryHub;

