import { CategoryHub } from "@/components/CategoryHub";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EducationHub = () => {
  return (
    <CategoryHub
      categorySlug="education"
      categoryName="Education"
      icon={GraduationCap}
      heroGradient="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600"
      description="Discover Halal-compliant educational institutions and services in Singapore. Find Islamic schools, tutoring centers, and educational programs."
      seoKeywords={[
        "halal education singapore",
        "islamic schools singapore",
        "muslim education singapore",
        "halal tutoring singapore",
        "islamic studies singapore",
        "muslim schools",
        "halal learning centers"
      ]}
      contentSections={
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-3xl mb-8 text-center">
                Educational Services Available
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Islamic Schools</h3>
                        <p className="text-sm text-muted-foreground">
                          Full-time Islamic schools offering comprehensive education with Islamic values
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
                        <h3 className="font-semibold text-lg mb-2">Quran & Islamic Studies</h3>
                        <p className="text-sm text-muted-foreground">
                          Quran memorization, Tajweed, and Islamic studies classes for all ages
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
                        <h3 className="font-semibold text-lg mb-2">Tutoring Centers</h3>
                        <p className="text-sm text-muted-foreground">
                          Academic tutoring and enrichment programs in Halal-compliant environments
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Award className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Professional Development</h3>
                        <p className="text-sm text-muted-foreground">
                          Courses and workshops for professional growth and skill development
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

export default EducationHub;

