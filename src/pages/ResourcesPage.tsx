import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, ExternalLink } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ResourcesPage = () => {
  const resources = [
    {
      title: "MUIS Halal Certification Guide",
      description: "Complete step-by-step guide to obtaining MUIS (Majlis Ugama Islam Singapura) halal certification. Learn about application requirements, fees, inspection process, and renewal procedures for restaurants, cafes, and F&B businesses in Singapore.",
      type: "Guide",
      link: "https://www.muis.gov.sg/Halal/Halal-Certification",
      external: true
    },
    {
      title: "Singapore Business Grants & Support",
      description: "Comprehensive checklist of Enterprise Singapore grants available for halal F&B businesses, including Productivity Solutions Grant (PSG), Enterprise Development Grant (EDG), and sector-specific funding for food businesses.",
      type: "Checklist",
      link: "https://www.enterprisesg.gov.sg/financial-assistance",
      external: true
    },
    {
      title: "Halal Business Community Guidelines",
      description: "Best practices and community standards for halal businesses on Humble Halal. Learn about MUIS compliance, proper halal signage, ingredient sourcing requirements, and maintaining halal integrity in your operations.",
      type: "Policy",
      link: "#",
      external: false
    },
    {
      title: "Singapore Social Media Marketing Toolkit",
      description: "Ready-to-use templates, hashtag guides, and content ideas specifically designed for halal businesses in Singapore. Includes Instagram, Facebook, and TikTok templates optimized for the local market.",
      type: "Toolkit",
      link: "#",
      external: false
    },
    {
      title: "Food Safety & Hygiene Standards",
      description: "SFA (Singapore Food Agency) guidelines and checklists for food businesses. Essential information on licensing, food safety management systems, and compliance requirements for operating in Singapore.",
      type: "Guide",
      link: "https://www.sfa.gov.sg/food-retail",
      external: true
    },
    {
      title: "Halal Ingredient Sourcing Directory",
      description: "Curated directory of MUIS-certified suppliers and distributors in Singapore. Find halal-certified ingredients, packaging materials, and food products for your business.",
      type: "Directory",
      link: "#",
      external: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Resources for Halal Businesses in Singapore - Humble Halal"
        description="Essential resources for halal businesses in Singapore: MUIS certification guides, government grants, food safety standards, marketing toolkits, and community guidelines. Everything you need to start and grow your halal business."
        keywords={["halal business resources singapore", "MUIS certification guide", "singapore business grants", "halal food business", "singapore F&B resources", "halal marketing singapore"]}
      />
      <Header />
      
      {/* Hero */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl mb-4">Resources for Halal Businesses</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Essential guides, tools, and resources tailored for halal businesses in Singapore. From MUIS certification to government grants and marketing support.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
                    {resource.type}
                  </span>
                </div>
                <CardTitle className="mt-4">{resource.title}</CardTitle>
                <CardDescription className="mt-2">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resource.external ? (
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      <span className="flex-1 text-left">View Resource</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link to={resource.link}>
                      <span className="flex-1 text-left">View Resource</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-muted rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Additional Singapore Resources</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-background rounded-lg">
              <h3 className="font-semibold mb-2">Government Agencies</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <a href="https://www.muis.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MUIS - Majlis Ugama Islam Singapura</a></li>
                <li>• <a href="https://www.enterprisesg.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Enterprise Singapore</a></li>
                <li>• <a href="https://www.sfa.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Singapore Food Agency (SFA)</a></li>
                <li>• <a href="https://www.acra.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ACRA - Business Registration</a></li>
              </ul>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <h3 className="font-semibold mb-2">Business Support</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <a href="https://www.gobusiness.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GoBusiness Portal</a></li>
                <li>• <a href="https://www.iras.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">IRAS - Tax Information</a></li>
                <li>• <a href="https://www.mom.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MOM - Employment Matters</a></li>
                <li>• <a href="https://www.pdpc.gov.sg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PDPC - Data Protection</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Need help with something specific? Contact our support team.
            </p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;

