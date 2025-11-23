import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Copy, 
  Check, 
  Mail, 
  Sparkles, 
  Code, 
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Badge as BadgeIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  websiteUrl: z.string().url("Valid website URL is required"),
  listingUrl: z.string().url("Valid listing URL is required").optional().or(z.literal("")),
  badgeLocation: z.string().min(1, "Please specify where you added the badge"),
});

type FormData = z.infer<typeof formSchema>;

// Get base URL from environment variable or fallback to current origin
const getBaseUrl = () => {
  return import.meta.env.VITE_SITE_URL || window.location.origin;
};

const BadgeGenerator = () => {
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [badgeCode, setBadgeCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Fetch cities with states
  const { data: cities } = useQuery({
    queryKey: ["cities-for-badge"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("cities")
        .select(`
          id,
          name,
          slug,
          states!inner (
            id,
            name,
            slug,
            code
          )
        `)
        .eq("is_public", true)
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Generate badge code when city is selected
  useEffect(() => {
    if (selectedCity) {
      const stateSlug = selectedCity.states?.slug || "";
      const citySlug = selectedCity.slug;
      const baseUrl = getBaseUrl();
      
      // Generate badge HTML code
      const code = `<a href="${baseUrl}/${stateSlug}/${citySlug}" target="_blank" rel="noopener">
  <img src="${baseUrl}/badges/badge-${citySlug}.png" alt="Listed on Humble Halal - ${selectedCity.name}" width="150" height="60">
</a>`;
      
      setBadgeCode(code);
    }
  }, [selectedCity]);

  const copyToClipboard = async (text: string, type: "code" | "email") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Badge code copied to clipboard!");
      } else {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
        toast.success("Email template copied to clipboard!");
      }
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const generateEmailTemplate = (formData: FormData) => {
    const baseUrl = getBaseUrl();
    const listingUrl = formData.listingUrl || (selectedCity ? `${baseUrl}/${selectedCity.states?.slug || ""}/${selectedCity.slug}` : "");
    
    return `To: support@humblehalal.com
Subject: Badge Added - Free Month Request for ${formData.businessName}

Hi Humble Halal Team,

I've added your badge to my website at: ${formData.websiteUrl}

Business Details:

Business Name: ${formData.businessName}
Store Location: ${selectedCity ? `${selectedCity.name}, ${selectedCity.states?.code || ""}` : ""}
Listed on your directory at: ${listingUrl}
Badge/Link Location: ${formData.badgeLocation}

Please verify the badge is live and send me the coupon code for one free month of featured listing.

Thank you!

${formData.businessName}
${formData.phone ? `Phone: ${formData.phone}` : ""}
Email: ${formData.email}`;
  };

  const onSubmit = async (formData: FormData) => {
    try {
      // Submit badge request
      const { data, error } = await supabase
        .from("badge_requests")
        .insert([
          {
            business_name: formData.businessName,
            business_address: `${selectedCity?.name}, ${selectedCity?.states?.name || ""}`,
            contact_email: formData.email,
            contact_phone: formData.phone || null,
            badge_type: "standard",
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSubmitted(true);
      toast.success("Request submitted! We'll verify your badge and send you a coupon code within 24-48 hours.");
    } catch (error: any) {
      console.error("Error submitting request:", error);
      toast.error(error.message || "Failed to submit request. Please try again.");
    }
  };

  const formValues = watch();
  const emailTemplate = formValues.businessName && formValues.email 
    ? generateEmailTemplate(formValues as FormData) 
    : "";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Free Badge Generator - Get One Month Free Featured Listing | Humble Halal"
        description="Add our badge to your website and receive one FREE month of featured listing (worth $29). Generate your badge code and get started today!"
        keywords={["badge generator", "free featured listing", "backlink badge", "humble halal badge"]}
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-accent py-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              LIMITED TIME OFFER
            </Badge>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Get <span className="text-yellow-300">1 Month FREE</span> Featured Listing!
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Add our "Humble Halal Directory" badge to your website and receive one FREE month of featured listing (worth $29). 
              Generate your custom badge in seconds!
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 shadow-xl" asChild>
              <Link to="#generator">
                <Sparkles className="w-5 h-5" />
                Generate Badge & Get $29 Off
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                How to Claim Your Free Month of Featured Listings
              </h2>
              <p className="text-muted-foreground text-lg">
                Follow these simple steps to get your free month:
              </p>
            </div>
            
            <Card className="bg-blue-50/50 border-blue-200 mb-8">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {[
                    { 
                      step: "1", 
                      title: "Create Your Account", 
                      desc: "Sign up for a free account to manage your listing.",
                      link: { text: "Sign Up Here", href: "/auth" }
                    },
                    { 
                      step: "2", 
                      title: "Add or Claim Your Listing", 
                      desc: "Either add your store if it's not listed yet, or claim your existing listing.",
                      link: { text: "Add Your Store", href: "/business/submit" },
                      link2: { text: "Claim Existing Listing", href: "/claim-business" }
                    },
                    { 
                      step: "3", 
                      title: "Generate & Add Badge to Your Website", 
                      desc: "Use the generator below to create your custom badge and add it to your website."
                    },
                    { 
                      step: "4", 
                      title: "Login & Upgrade to Featured", 
                      desc: "After adding the badge, login to your account and click 'Upgrade to Featured'.",
                      link: { text: "Login to Dashboard", href: "/dashboard" }
                    },
                    { 
                      step: "5", 
                      title: "Choose 1 Month Option & Enter Code", 
                      desc: "Select the 1 month featured listing option and enter your unique discount code."
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-muted-foreground mb-2">{item.desc}</p>
                        {item.link && (
                          <div className="flex flex-wrap gap-2">
                            <Link to={item.link.href} className="text-primary hover:underline text-sm font-medium">
                              {item.link.text} →
                            </Link>
                            {item.link2 && (
                              <Link to={item.link2.href} className="text-primary hover:underline text-sm font-medium">
                                {item.link2.text} →
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-900">
                    <strong>Note:</strong> Email us at{" "}
                    <a href="mailto:support@humblehalal.com" className="text-primary hover:underline font-medium">
                      support@humblehalal.com
                    </a>{" "}
                    with your website URL after adding the badge. We'll send your discount code within 24 hours!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Badge Generator Tool */}
      <section id="generator" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle className="text-2xl">Enter Your Store Location</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Select your district and neighbourhood in Singapore, and we'll automatically generate the badge that links to your local directory page!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-base font-semibold">Search for your district and neighbourhood:</Label>
                  <Select
                    value={selectedCity?.id || ""}
                    onValueChange={(value) => {
                      const city = cities?.find((c: any) => c.id === value);
                      setSelectedCity(city);
                    }}
                  >
                    <SelectTrigger id="city" className="mt-2 h-12 text-base">
                      <SelectValue placeholder="e.g., Little India, Central or Orchard, Central or Marina Bay, Central..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city: any) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}, {city.states?.name || city.states?.code || ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Start typing to search for your district in Singapore
                  </p>
                </div>

                {selectedCity && badgeCode && (
                  <div className="space-y-4">
                    <div>
                      <Label>Badge Preview</Label>
                      <div className="mt-2 p-4 bg-background border rounded-lg flex items-center justify-center">
                        <div className="bg-white p-4 rounded border-2 border-primary/20">
                          <img 
                            src={`${getBaseUrl()}/badges/badge-${selectedCity.slug}.png`}
                            alt={`Listed on Humble Halal - ${selectedCity.name}`}
                            width="150"
                            height="60"
                            onError={(e) => {
                              // Fallback to a placeholder if badge image doesn't exist
                              (e.target as HTMLImageElement).src = `${getBaseUrl()}/placeholder.svg`;
                            }}
                            className="max-w-[150px] h-auto"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>HTML Embed Code</Label>
                      <div className="mt-2 relative">
                        <Textarea
                          value={badgeCode}
                          readOnly
                          className="font-mono text-sm min-h-[100px] pr-12"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(badgeCode, "code")}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {copied && (
                        <p className="text-sm text-success mt-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Copied to clipboard!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Add Our Badge */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">Why Add Our Badge?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Build Trust</h3>
                  <p className="text-muted-foreground text-sm">
                    Show customers you're listed on a trusted directory
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Get More Visibility</h3>
                  <p className="text-muted-foreground text-sm">
                    Drive traffic from thousands of people shopping for halal businesses each month
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <BadgeIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">1 Month FREE</h3>
                  <p className="text-muted-foreground text-sm">
                    Featured listing worth $29 - absolutely free!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* See How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">See How It Works</h2>
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                        1
                      </div>
                      <h3 className="font-bold text-lg">Add Badge to Your Site</h3>
                    </div>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 bg-muted/20">
                      <div className="text-xs text-muted-foreground mb-2">Your Website</div>
                      <div className="bg-white rounded p-4 shadow-sm">
                        <div className="h-32 bg-muted/50 rounded mb-4"></div>
                        <div className="text-xs text-center text-muted-foreground py-2 border-t-2 border-primary">
                          Badge Here!
                        </div>
                        <div className="mt-2 text-center">
                          <Badge className="bg-primary text-white">HUMBLE HALAL</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
                  </div>
                  <div className="space-y-4 md:col-start-1 md:row-start-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                        2
                      </div>
                      <h3 className="font-bold text-lg">Customer Finds Your Store</h3>
                    </div>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 bg-muted/20">
                      <div className="text-xs text-muted-foreground mb-2">Your Store!</div>
                      <div className="bg-white rounded p-4 shadow-sm">
                        <div className="text-sm font-semibold mb-2">Your Business Name</div>
                        <div className="text-xs text-muted-foreground mb-4">Address, Phone, etc.</div>
                        <div className="h-24 bg-muted/50 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>The Result:</strong> Customers see you're on a trusted directory, click the badge, find your store details, and contact you!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alternative Text Link Option */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Prefer a Text Link? (For Non-Technical Users)</CardTitle>
                <CardDescription>
                  If you're not comfortable with HTML, you can add a simple text link instead
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Add this text to your website's footer or links page:</Label>
                  <p className="mt-2 p-3 bg-muted rounded text-sm">
                    Find more halal businesses on{" "}
                    <a href={selectedCity ? `${getBaseUrl()}/${selectedCity.states?.slug || ""}/${selectedCity.slug}` : "#"} 
                       className="text-primary hover:underline" 
                       target="_blank" 
                       rel="noopener">
                      Humble Halal
                    </a>
                  </p>
                </div>
                <div>
                  <Label>Or use this HTML code:</Label>
                  <div className="mt-2 relative">
                    <Textarea
                      value={selectedCity ? `<a href="${getBaseUrl()}/${selectedCity.states?.slug || ""}/${selectedCity.slug}" target="_blank">Find us on Humble Halal</a>` : ""}
                      readOnly
                      className="font-mono text-sm min-h-[60px] pr-12"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        const baseUrl = getBaseUrl();
                        const textLink = selectedCity ? `<a href="${baseUrl}/${selectedCity.states?.slug || ""}/${selectedCity.slug}" target="_blank">Find us on Humble Halal</a>` : "";
                        copyToClipboard(textLink, "code");
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Email Notification Template */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Send Us This Email</CardTitle>
                <CardDescription>
                  Fill out the form below and copy the email template, or submit directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="font-semibold text-xl mb-2">Request Submitted!</h3>
                    <p className="text-muted-foreground mb-4">
                      We've received your badge request. We'll verify the badge is live on your website 
                      and send you a coupon code within 24-48 hours.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can also send us an email directly at{" "}
                      <a href="mailto:support@humblehalal.com" className="text-primary hover:underline">
                        support@humblehalal.com
                      </a>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          {...register("businessName")}
                          className="mt-2"
                          placeholder="Your Business Name"
                        />
                        {errors.businessName && (
                          <p className="text-sm text-destructive mt-1">{errors.businessName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="mt-2"
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          className="mt-2"
                          placeholder="+65 1234 5678"
                        />
                      </div>
                      <div>
                        <Label htmlFor="websiteUrl">Your Website URL *</Label>
                        <Input
                          id="websiteUrl"
                          {...register("websiteUrl")}
                          className="mt-2"
                          placeholder="https://yourwebsite.com"
                        />
                        {errors.websiteUrl && (
                          <p className="text-sm text-destructive mt-1">{errors.websiteUrl.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="listingUrl">Your Listing URL on Humble Halal (Optional)</Label>
                      <Input
                        id="listingUrl"
                        {...register("listingUrl")}
                        className="mt-2"
                        placeholder="https://humblehalal.com/..."
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Help us find your listing faster
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="badgeLocation">Where did you add the badge? *</Label>
                      <Input
                        id="badgeLocation"
                        {...register("badgeLocation")}
                        className="mt-2"
                        placeholder="e.g., Footer, Sidebar, About Page, Links Page"
                      />
                      {errors.badgeLocation && (
                        <p className="text-sm text-destructive mt-1">{errors.badgeLocation.message}</p>
                      )}
                    </div>

                    <div>
                      <Label>Email Template (Preview)</Label>
                      <div className="mt-2 relative">
                        <Textarea
                          value={emailTemplate}
                          readOnly
                          className="font-mono text-sm min-h-[200px] pr-12"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(emailTemplate, "email")}
                          disabled={!emailTemplate}
                        >
                          {emailCopied ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button type="submit" className="flex-1">
                        Submit Request
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        asChild
                      >
                        <a href={`mailto:support@humblehalal.com?subject=Badge Added - Free Month Request&body=${encodeURIComponent(emailTemplate)}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Open Email Client
                        </a>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Badge must remain on website for minimum 30 days after free month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Badge must link back to correct listing page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>One free month per business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Badge must be visible (not hidden)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Directory reserves right to verify and revoke offer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Coupon code expires 90 days from issue date</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-3xl mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How long until I receive my coupon code?</AccordionTrigger>
                <AccordionContent>
                  Within 24-48 hours of verification. We'll check that your badge is live and then send you the coupon code via email.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Where should I place the badge?</AccordionTrigger>
                <AccordionContent>
                  Footer, sidebar, about page, or links page works great. Just make sure it's visible to site visitors.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I remove the badge after the free month?</AccordionTrigger>
                <AccordionContent>
                  The badge should remain for at least 30 days after your free month ends to honor the agreement.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What if I need help adding the badge?</AccordionTrigger>
                <AccordionContent>
                  Email us at support@humblehalal.com and we'll provide step-by-step guidance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Do I need to be claimed on the directory first?</AccordionTrigger>
                <AccordionContent>
                  No, but you should claim your listing to manage your featured upgrade. You can claim your business from your dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BadgeGenerator;

