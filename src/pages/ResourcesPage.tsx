import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, ExternalLink, Download } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ResourcesPage = () => {
  const resources = [
    {
      title: "Halal Certification Guide",
      description: "A comprehensive guide on how to get MUIS Halal certification for your business.",
      type: "Guide",
      link: "#"
    },
    {
      title: "Business Grant Checklist",
      description: "Checklist of available government grants for F&B and tourism businesses.",
      type: "Checklist",
      link: "#"
    },
    {
      title: "Community Guidelines",
      description: "Rules and best practices for participating in the SG Hub Connect community.",
      type: "Policy",
      link: "#"
    },
    {
      title: "Marketing Toolkit",
      description: "Templates and assets to help you promote your business on social media.",
      type: "Toolkit",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Resources - SG Hub Connect"
        description="Helpful resources, guides, and tools for businesses and community members."
        keywords={["resources", "guides", "business tools", "halal certification", "singapore"]}
      />
      <Header />
      
      {/* Hero */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl mb-4">Resources</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Curated guides, tools, and documents to help you succeed.
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
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link to={resource.link}>
                    <span className="flex-1 text-left">View Resource</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-muted rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Need something else?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            If you can't find what you're looking for, contact our support team for assistance.
          </p>
          <Button asChild>
            <Link to="/auth">Contact Support</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;

