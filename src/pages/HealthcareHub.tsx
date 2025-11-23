import { CategoryHub } from "@/components/CategoryHub";
import { Heart, Stethoscope, Pill, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HealthcareHub = () => {
  return (
    <CategoryHub
      categorySlug="healthcare"
      categoryName="Healthcare"
      icon={Heart}
      heroGradient="bg-gradient-to-br from-red-600 via-red-500 to-pink-600"
      description="Find Halal-compliant healthcare services in Singapore. Connect with Muslim doctors, clinics, and healthcare providers who understand your needs."
      seoKeywords={[
        "halal healthcare singapore",
        "muslim doctors singapore",
        "islamic healthcare",
        "halal clinics singapore",
        "muslim healthcare providers",
        "halal medical services",
        "islamic medicine singapore"
      ]}
      contentSections={
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-3xl mb-8 text-center">
                Healthcare Services Available
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Stethoscope className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">General Practice</h3>
                        <p className="text-sm text-muted-foreground">
                          Family doctors and general practitioners for routine check-ups and consultations
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
                        <h3 className="font-semibold text-lg mb-2">Specialist Care</h3>
                        <p className="text-sm text-muted-foreground">
                          Specialized medical care from Muslim healthcare professionals
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Pill className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Pharmacy Services</h3>
                        <p className="text-sm text-muted-foreground">
                          Halal-certified medications and pharmaceutical services
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Users className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Women's Health</h3>
                        <p className="text-sm text-muted-foreground">
                          Female healthcare providers for women's health needs
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

export default HealthcareHub;

