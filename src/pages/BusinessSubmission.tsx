import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, MapPin, Image as ImageIcon, CheckSquare, Search, 
  ArrowLeft, ArrowRight, Check, Upload, X 
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { sendGoHighLevelWebhook } from "@/utils/webhooks";

import { uploadToCloudinary } from "@/utils/cloudinary";

const steps = [
  { id: 1, name: "Basic Info", icon: Building2 },
  { id: 2, name: "Location", icon: MapPin },
  { id: 3, name: "Media", icon: ImageIcon },
  { id: 4, name: "Details", icon: CheckSquare },
  { id: 5, name: "SEO", icon: Search }
];

const amenities = [
  "WiFi", "Parking", "Air Conditioning", "Wheelchair Accessible",
  "Pet Friendly", "Outdoor Seating", "Delivery", "Takeaway",
  "Credit Cards", "Reservations", "Halal", "Vegetarian Options"
];

const priceRanges = ["$", "$$", "$$$", "$$$$"];

// Helper function to extract city from address
const extractCityFromAddress = (address: string): string | null => {
  // Simple extraction - can be enhanced with geocoding API
  // For Singapore, common patterns: "Singapore", "SG", postal code areas
  const singaporeAreas = [
    "Orchard", "Marina Bay", "Chinatown", "Little India", "Sentosa",
    "Jurong", "Tampines", "Woodlands", "Ang Mo Kio", "Bishan",
    "Clementi", "Pasir Ris", "Punggol", "Sengkang", "Yishun"
  ];
  
  for (const area of singaporeAreas) {
    if (address.toLowerCase().includes(area.toLowerCase())) {
      return area;
    }
  }
  
  return "Singapore"; // Default
};

const BusinessSubmission = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: "",
    category_id: "",
    subcategory_id: "",
    short_description: "",
    description: "",
    
    // Step 2: Location
    address: "",
    postal_code: "",
    neighbourhood_id: "",
    latitude: "",
    longitude: "",
    
    // Step 3: Media
    logo: null as File | null,
    cover_image: null as File | null,
    images: [] as File[],
    
    // Step 4: Details
    phone: "",
    email: "",
    website: "",
    whatsapp: "",
    price_range: "",
    amenities: [] as string[],
    operating_hours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "10:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true }
    },
    
    // Step 5: SEO
    seo_title: "",
    seo_description: "",
    seo_keywords: [] as string[]
  });

  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (field: string, value: string | number | File | File[] | Record<string, unknown> | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === "images") {
      const fileArray = Array.from(files).slice(0, 10);
      setFormData(prev => ({ ...prev, images: fileArray }));
    } else {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.short_description || !formData.description) {
          toast.error("Please fill in all required fields");
          return false;
        }
        break;
      case 2:
        if (!formData.address || !formData.postal_code) {
          toast.error("Please fill in address and postal code");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      // Check if user is logged in (optional for public submissions)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Generate slug from name
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Upload images to Cloudinary
      let logoUrl = null;
      let coverImageUrl = null;
      const imageUrls: string[] = [];

      if (formData.logo) {
        logoUrl = await uploadToCloudinary(formData.logo, 'logos');
      }

      if (formData.cover_image) {
        coverImageUrl = await uploadToCloudinary(formData.cover_image, 'covers');
      }

      if (formData.images.length > 0) {
        for (const file of formData.images) {
          const url = await uploadToCloudinary(file, 'gallery');
          if (url) imageUrls.push(url);
        }
      }

      // Extract city from address or use a default
      // This is a simple implementation - you may want to use a geocoding service
      const cityName = extractCityFromAddress(formData.address) || "Singapore";
      const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Check if city exists, create if it doesn't
      let cityId: string | null = null;
      const { data: existingCity } = await (supabase as any)
        .from("cities")
        .select("id")
        .eq("slug", citySlug)
        .maybeSingle();

      if (existingCity) {
        cityId = existingCity.id;
      } else {
        // Create new city (hidden until approved)
        const { data: newCity, error: cityError } = await (supabase as any)
          .from("cities")
          .insert({
            name: cityName,
            slug: citySlug,
            state_id: null, // Will be set later or use default Singapore state
            is_public: false, // Hidden until approved
            created_from_submission: true,
            description: `Discover halal businesses in ${cityName}`,
          })
          .select()
          .single();

        if (!cityError && newCity) {
          cityId = newCity.id;
        }
      }

      const businessData = {
        name: formData.name,
        slug,
        short_description: formData.short_description,
        description: formData.description,
        address: formData.address,
        postal_code: formData.postal_code,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        whatsapp: formData.whatsapp,
        price_range: formData.price_range,
        amenities: formData.amenities,
        operating_hours: formData.operating_hours,
        logo: logoUrl,
        cover_image: coverImageUrl,
        images: imageUrls,
        seo_title: formData.seo_title || formData.name,
        seo_description: formData.seo_description || formData.short_description,
        seo_keywords: formData.seo_keywords,
        owner_id: user?.id || null, // Allow null for guest submissions
        city_id: cityId,
        status: "pending",
        submitted_by_email: formData.email, // Track submitter email
      };

      const { data: insertedData, error } = await supabase
        .from("businesses")
        .insert([businessData])
        .select()
        .single();

      if (error) throw error;

      // Send webhook to GoHighLevel if configured
      const webhookUrl = import.meta.env.VITE_GOHIGHLEVEL_WEBHOOK_URL;
      if (webhookUrl && insertedData) {
        // Send webhook asynchronously (don't block submission)
        sendGoHighLevelWebhook(webhookUrl, "BusinessSubmission", {
          business_id: insertedData.id,
          business_name: insertedData.name,
          slug: insertedData.slug,
          owner_id: insertedData.owner_id,
          status: insertedData.status,
          contact: {
            email: insertedData.email,
            phone: insertedData.phone,
            whatsapp: insertedData.whatsapp,
          },
          location: {
            address: insertedData.address,
            postal_code: insertedData.postal_code,
          },
          submitted_at: new Date().toISOString(),
        }).catch((err) => {
          console.error("Webhook failed (non-critical):", err);
          // Don't show error to user, webhook is optional
        });
      }

      toast.success("Business submitted successfully! Pending approval.");
      
      // Redirect based on whether user is logged in
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/", { state: { message: "Thank you for your submission! We'll review it and contact you soon." } });
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 hover-lift">
            <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-heading font-bold text-xl">H</span>
            </div>
            <span className="font-heading font-bold text-2xl">Humble Halal</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs 
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Submit Business" }
          ]} 
          className="mb-6"
        />

        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading font-bold text-3xl">Add Your Business</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 mb-6" />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${index !== 0 ? "ml-4" : ""}`}>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? "bg-success text-success-foreground"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep === step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-12 lg:w-24 mx-2 ${
                    currentStep > step.id ? "bg-success" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-2xl mb-2">Basic Information</CardTitle>
                  <CardDescription>Tell us about your business</CardDescription>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your Business Name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="short_description">Short Description *</Label>
                    <Input
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => handleInputChange("short_description", e.target.value)}
                      placeholder="A brief tagline (max 100 characters)"
                      maxLength={100}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Detailed description of your business, services, and what makes you unique..."
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-2xl mb-2">Location Details</CardTitle>
                  <CardDescription>Where can customers find you?</CardDescription>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Example Street, #01-234"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postal_code">Postal Code *</Label>
                      <Input
                        id="postal_code"
                        value={formData.postal_code}
                        onChange={(e) => handleInputChange("postal_code", e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="p-4 border-2 border-dashed rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground text-center">
                      📍 Map integration: Click to set your exact location on the map
                    </p>
                    <div className="h-64 bg-muted rounded-lg mt-4 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Media */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-2xl mb-2">Photos & Media</CardTitle>
                  <CardDescription>Show off your business with great images</CardDescription>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label>Business Logo</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("logo", e.target.files)}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload logo</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Cover Image</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("cover_image", e.target.files)}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 1920x600px</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Gallery Images (up to 10)</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange("images", e.target.files)}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <label htmlFor="gallery-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload gallery images</p>
                        <p className="text-xs text-muted-foreground mt-1">Select multiple images</p>
                      </label>
                    </div>
                    
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-5 gap-4 mt-4">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-2xl mb-2">Business Details</CardTitle>
                  <CardDescription>Additional information about your business</CardDescription>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+65 1234 5678"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="business@example.com"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://www.example.com"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                        placeholder="+65 1234 5678"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Price Range</Label>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      {priceRanges.map((price) => (
                        <Button
                          key={price}
                          variant={formData.price_range === price ? "default" : "outline"}
                          onClick={() => handleInputChange("price_range", price)}
                          className="w-full"
                        >
                          {price}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Amenities</Label>
                    <div className="grid md:grid-cols-3 gap-4 mt-2">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <Checkbox
                            id={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityToggle(amenity)}
                          />
                          <Label htmlFor={amenity} className="cursor-pointer font-normal">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: SEO */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-2xl mb-2">SEO Settings</CardTitle>
                  <CardDescription>Optimize your listing for search engines</CardDescription>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={formData.seo_title}
                      onChange={(e) => handleInputChange("seo_title", e.target.value)}
                      placeholder={formData.name || "Your Business Name"}
                      maxLength={60}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.seo_title.length}/60 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                      id="seo_description"
                      value={formData.seo_description}
                      onChange={(e) => handleInputChange("seo_description", e.target.value)}
                      placeholder={formData.short_description || "Brief description of your business..."}
                      maxLength={160}
                      rows={3}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.seo_description.length}/160 characters
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Preview</h4>
                    <div className="space-y-1">
                      <p className="text-primary font-medium">
                        {formData.seo_title || formData.name || "Your Business Name"}
                      </p>
                      <p className="text-xs text-success">
                        humblehalal.sg › business › {formData.name.toLowerCase().replace(/\s+/g, "-")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.seo_description || formData.short_description || "Your business description will appear here..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="gap-2" variant="hero">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="gap-2" variant="hero">
              {loading ? "Submitting..." : "Submit Business"}
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default BusinessSubmission;
