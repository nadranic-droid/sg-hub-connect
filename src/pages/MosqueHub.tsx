import { CategoryHub } from "@/components/CategoryHub";
import { Building2, Clock, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MosqueHub = () => {
  return (
    <CategoryHub
      categorySlug="mosques"
      categoryName="Mosques"
      icon={Building2}
      heroGradient="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600"
      description="Find mosques and Islamic centers across Singapore. Discover prayer times, facilities, and community services at mosques near you."
      seoKeywords={[
        "mosques singapore",
        "masjid singapore",
        "islamic centers singapore",
        "prayer facilities singapore",
        "halal prayer spaces",
        "muslim community centers",
        "islamic places of worship"
      ]}
      contentSections={
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-3xl mb-8 text-center">
                Mosque Facilities & Services
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Clock className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Prayer Times</h3>
                        <p className="text-sm text-muted-foreground">
                          Find accurate prayer times and schedules for daily prayers, Jumu'ah, and special occasions
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
                        <h3 className="font-semibold text-lg mb-2">Community Services</h3>
                        <p className="text-sm text-muted-foreground">
                          Access community programs, educational classes, and social services
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <BookOpen className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Islamic Education</h3>
                        <p className="text-sm text-muted-foreground">
                          Quran classes, Islamic studies, and educational programs for all ages
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Building2 className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Facilities</h3>
                        <p className="text-sm text-muted-foreground">
                          Ablution facilities, parking, accessibility features, and more
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

export default MosqueHub;

