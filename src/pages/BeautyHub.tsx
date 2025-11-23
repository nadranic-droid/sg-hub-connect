import { CategoryHub } from "@/components/CategoryHub";
import { Sparkles, Scissors, Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const BeautyHub = () => {
  return (
    <CategoryHub
      categorySlug="beauty"
      categoryName="Beauty & Wellness"
      icon={Sparkles}
      heroGradient="bg-gradient-to-br from-pink-600 via-rose-500 to-fuchsia-600"
      description="Discover Halal-certified beauty salons, spas, and wellness centers in Singapore. Find services that align with Islamic principles."
      seoKeywords={[
        "halal beauty singapore",
        "muslim beauty salons singapore",
        "halal spa singapore",
        "islamic beauty services",
        "halal wellness singapore",
        "muslim beauty services",
        "halal cosmetics singapore"
      ]}
      contentSections={
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-3xl mb-8 text-center">
                Beauty & Wellness Services
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Scissors className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Hair Services</h3>
                        <p className="text-sm text-muted-foreground">
                          Halal-certified hair salons offering cuts, styling, and treatments
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Sparkles className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Beauty Treatments</h3>
                        <p className="text-sm text-muted-foreground">
                          Facials, skincare, and beauty treatments using Halal-certified products
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Heart className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Wellness & Spa</h3>
                        <p className="text-sm text-muted-foreground">
                          Relaxing spa treatments and wellness services in Halal-compliant environments
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Star className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Bridal Services</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete bridal packages including makeup, hair, and beauty services
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

export default BeautyHub;

