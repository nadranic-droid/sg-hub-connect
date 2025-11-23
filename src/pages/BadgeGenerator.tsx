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
  ArrowRight
} from "lucide-react";
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
            email: formData.email,
            phone: formData.phone || null,
            website_url: formData.websiteUrl,
            city: selectedCity?.name || "",
            state: selectedCity?.states?.name || "",
            badge_location: formData.badgeLocation,
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
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Free Month Offer
            </Badge>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Free Badge Generator - Get One Month Free
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Add our badge to your website and receive one FREE month of featured listing (worth $29)
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-3xl mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { step: "1", title: "Generate Your Badge", desc: "Select your city and copy the badge code" },
                { step: "2", title: "Add to Your Website", desc: "Paste the HTML code into your website" },
                { step: "3", title: "Notify Us", desc: "Send us an email using the template below" },
                { step: "4", title: "Receive Your Coupon", desc: "We'll email you a coupon code within 24-48 hours" },
              ].map((item) => (
                <Card key={item.step}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">{item.step}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Badge Generator Tool */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Generate Your Badge</CardTitle>
                <CardDescription>Select your store's city from the dropdown below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="city">Select Your Store's City</Label>
                  <Select
                    value={selectedCity?.id || ""}
                    onValueChange={(value) => {
                      const city = cities?.find((c: any) => c.id === value);
                      setSelectedCity(city);
                    }}
                  >
                    <SelectTrigger id="city" className="mt-2">
                      <SelectValue placeholder="Choose a city..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city: any) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}, {city.states?.code || city.states?.name || ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

      {/* Alternative Text Link Option */}
      <section className="py-16">
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

