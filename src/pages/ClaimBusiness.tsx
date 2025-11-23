import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Search, Building2, MapPin, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const ClaimBusiness = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedBusinessId = searchParams.get("business");

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [value, setValue] = useState(preSelectedBusinessId || "");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch businesses with city and category info
      const { data: businessData } = await supabase
        .from("businesses")
        .select(`
          id, 
          name, 
          address,
          city_id,
          category_id,
          cities (id, name, slug),
          categories (id, name)
        `)
        .eq("is_claimed", false)
        .eq("status", "approved")
        .order("name");
      
      setBusinesses(businessData || []);

      // Fetch cities
      const { data: cityData } = await (supabase as any)
        .from("cities")
        .select("id, name, slug")
        .eq("is_public", true)
        .order("name");
      
      setCities(cityData || []);

      // Fetch categories
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      
      setCategories(categoryData || []);
    };
    fetchData();
  }, []);

  // Filter businesses based on search, city, and category
  useEffect(() => {
    let filtered = businesses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity !== "all") {
      filtered = filtered.filter((b) => b.city_id === selectedCity);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((b) => b.category_id === selectedCategory);
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchTerm, selectedCity, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) {
        toast.error("Please select a business to claim");
        return;
    }

    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        toast.error("You must be logged in to claim a business");
        navigate("/auth");
        return;
    }

    const { error } = await supabase.from("claims").insert({
        business_id: value,
        user_id: user.id,
        notes: `Contact: ${formData.contactName}, Phone: ${formData.phone}, Email: ${formData.email}\nNotes: ${formData.notes}`,
        status: "pending"
    });

    if (error) {
        toast.error("Failed to submit claim request");
    } else {
        toast.success("Claim request submitted successfully! We will contact you shortly.");
        navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Claim Your Business - Humble Halal"
        description="Verify your ownership and manage your business listing on Humble Halal."
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">Claim Your Business</h1>
            <p className="text-muted-foreground text-lg">
              Take control of your listing, update information, and respond to reviews.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Filters */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm font-semibold">Filter Businesses</Label>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Business name or address..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger id="city">
                          <MapPin className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger id="category">
                          <Building2 className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {filteredBusinesses.length !== businesses.length && (
                    <p className="text-xs text-muted-foreground">
                      Showing {filteredBusinesses.length} of {businesses.length} businesses
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                    <Label>Search & Select Your Business</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <Input
                        placeholder="Start typing your business name..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                        }}
                        className="pl-9"
                      />
                    </div>
                    
                    {searchTerm && filteredBusinesses.length > 0 && (
                      <div className="border rounded-lg mt-2 max-h-[300px] overflow-y-auto bg-white shadow-lg">
                        {filteredBusinesses.slice(0, 10).map((business) => (
                          <button
                            key={business.id}
                            type="button"
                            onClick={() => {
                              setValue(business.id);
                              setSearchTerm(business.name);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0",
                              value === business.id && "bg-primary/10"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <Check
                                className={cn(
                                  "mt-0.5 h-4 w-4 shrink-0",
                                  value === business.id ? "opacity-100 text-primary" : "opacity-0"
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground">{business.name}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  {business.cities?.name && (
                                    <>
                                      <MapPin className="w-3 h-3" />
                                      <span>{business.cities.name}</span>
                                    </>
                                  )}
                                  {business.categories?.name && (
                                    <>
                                      <span>•</span>
                                      <span>{business.categories.name}</span>
                                    </>
                                  )}
                                </div>
                                {business.address && (
                                  <div className="text-xs text-muted-foreground mt-1 truncate">{business.address}</div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                        {filteredBusinesses.length > 10 && (
                          <div className="px-4 py-2 text-xs text-muted-foreground text-center border-t bg-muted/50">
                            Showing first 10 of {filteredBusinesses.length} results. Refine your search for more.
                          </div>
                        )}
                      </div>
                    )}
                    
                    {searchTerm && filteredBusinesses.length === 0 && (
                      <div className="border rounded-lg mt-2 p-4 text-center text-sm text-muted-foreground bg-muted/50">
                        No businesses found matching "{searchTerm}". 
                        <Link to="/business/submit" className="text-primary hover:underline ml-1">Create a new listing</Link>
                      </div>
                    )}
                    
                    {value && (
                      <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-semibold text-foreground">
                              {filteredBusinesses.find((b) => b.id === value)?.name || businesses.find((b) => b.id === value)?.name}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Selected for claim request
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setValue("");
                              setSearchTerm("");
                            }}
                            className="shrink-0"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                        Can't find your business? <Link to="/business/submit" className="text-primary hover:underline">Create a new listing</Link>.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Person</Label>
                        <Input 
                            id="contactName" 
                            placeholder="Full Name" 
                            value={formData.contactName}
                            onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                            id="phone" 
                            placeholder="+65 1234 5678" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="owner@business.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Additional Verification Details</Label>
                    <Textarea 
                        id="notes" 
                        placeholder="Please provide any details that help verify your ownership (e.g. ACRA number, social media handle)..." 
                        className="min-h-[100px]"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Claim Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClaimBusiness;
