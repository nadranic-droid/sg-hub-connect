import { Link } from "react-router-dom";
import { Sparkles, Check, TrendingUp, Eye, Image as ImageIcon, Star, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Advertise = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Top Placement",
      description: "Your listing appears at the top of city pages, above regular listings"
    },
    {
      icon: Sparkles,
      title: "Featured Badge",
      description: "Stand out with a blue border and 'Featured' badge that builds trust"
    },
    {
      icon: ImageIcon,
      title: "Image Gallery",
      description: "Showcase up to 8 high-quality images of your business"
    },
    {
      icon: Eye,
      title: "More Visibility",
      description: "Get 3-5x more views and clicks compared to regular listings"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Advertise Your Store on Humble Halal | Featured Listings"
        description="Get your business featured on Humble Halal and reach more customers. Top placement, featured badge, and increased visibility starting at $29/month. Get one FREE month with our badge program!"
        keywords={["advertise on humble halal", "featured listing", "business advertising", "halal directory advertising"]}
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Featured Listings
            </Badge>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Advertise Your Store on <span className="text-primary">Humble Halal</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Reach thousands of customers looking for Halal businesses in Singapore. 
              Get top placement, increased visibility, and more customers with our featured listings.
            </p>
          </div>
        </div>
      </section>

      {/* Special Offer Call-Out */}
      <section className="py-8 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-y border-primary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-primary shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-6 h-6 text-primary" />
                    <h2 className="font-heading font-bold text-2xl">Get One FREE Month of Featured Listing</h2>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Add our badge to your website and receive one FREE month of featured listing
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    Worth $29
                  </Badge>
                </div>
                <Button size="lg" asChild className="gap-2">
                  <Link to="/badge-generator">
                    Get Free Month
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl mb-4">Featured Listing Pricing</h2>
            <p className="text-muted-foreground text-lg">
              Choose the plan that works best for your business
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
            {/* Monthly Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Monthly</CardTitle>
                <CardDescription>Perfect for trying out featured listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{feature.description}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Quarterly Plan */}
            <Card className="relative border-2 border-primary">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle>Quarterly</CardTitle>
                <CardDescription>Save $12 with quarterly billing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$75</span>
                    <span className="text-muted-foreground">/quarter</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground line-through">$87</span>
                    <Badge variant="secondary" className="text-xs">
                      Save $12
                    </Badge>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{feature.description}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Yearly</CardTitle>
                <CardDescription>Best value - save $58 per year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$290</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground line-through">$348</span>
                    <Badge variant="secondary" className="text-xs">
                      Save $58
                    </Badge>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{feature.description}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-3xl mb-8 text-center">
              Why Choose Featured Listings?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-3xl mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How long does it take to activate?</AccordionTrigger>
                <AccordionContent>
                  Your featured listing is activated immediately after payment confirmation, usually within minutes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your featured listing at any time. Your listing will remain featured until the end of your billing period.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What happens when my featured listing expires?</AccordionTrigger>
                <AccordionContent>
                  Your listing will automatically return to regular status. You can renew anytime to continue enjoying featured benefits.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I get the free month with the badge?</AccordionTrigger>
                <AccordionContent>
                  Simply visit our <Link to="/badge-generator" className="text-primary hover:underline">Badge Generator</Link> page, 
                  select your city, add the badge to your website, and send us an email. We'll verify the badge and send you a coupon code 
                  for one free month of featured listing (worth $29).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Can I upload images after upgrading?</AccordionTrigger>
                <AccordionContent>
                  Yes! Once your listing is featured, you can upload up to 8 images from your business dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto border-2 border-primary">
            <CardContent className="p-8 text-center">
              <h2 className="font-heading font-bold text-3xl mb-4">
                Ready to Get More Customers?
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Start your featured listing today or get one free month with our badge program
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/badge-generator">
                    Get Free Month with Badge
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/business/submit">
                    List Your Business First
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Advertise;

