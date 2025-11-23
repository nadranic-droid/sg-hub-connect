import { CategoryHub } from "@/components/CategoryHub";
import { Scale, BookOpen, Users, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LawyerHub = () => {
  return (
    <CategoryHub
      categorySlug="lawyers"
      categoryName="Lawyers"
      icon={Scale}
      heroGradient="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600"
      description="Find trusted Halal-compliant legal services in Singapore. Connect with experienced Muslim lawyers and law firms specializing in various areas of law."
      seoKeywords={[
        "halal lawyers singapore",
        "muslim lawyers singapore",
        "islamic law singapore",
        "halal legal services",
        "muslim law firms",
        "shariah compliant lawyers",
        "legal services singapore"
      ]}
      contentSections={
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading font-bold text-3xl mb-8 text-center">
                Legal Services We Cover
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover-lift">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Family Law</h3>
                    <p className="text-sm text-muted-foreground">
                      Divorce, custody, inheritance, and family matters handled with Islamic principles
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Business Law</h3>
                    <p className="text-sm text-muted-foreground">
                      Corporate law, contracts, and business formation for Halal businesses
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover-lift">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Estate Planning</h3>
                    <p className="text-sm text-muted-foreground">
                      Wills, trusts, and estate planning aligned with Islamic inheritance laws
                    </p>
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

export default LawyerHub;

