import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const EventSubmit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    organizer: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
        toast.error("Please select an event date");
        return;
    }

    setLoading(true);
    
    try {
        let imageUrl = "";

        // Upload Image
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            
            // Try to upload to event-images bucket, fallback to public bucket if it doesn't exist
            let bucketName = 'event-images';
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from(bucketName)
                .upload(fileName, imageFile);

            if (uploadError) {
                // If bucket doesn't exist, try public bucket or create a data URL
                if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
                    console.warn('event-images bucket not found, using data URL instead');
                    // Convert to base64 data URL as fallback
                    const reader = new FileReader();
                    imageUrl = await new Promise((resolve) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(imageFile);
                    });
                } else {
                    throw uploadError;
                }
            } else {
                // Get Public URL (Assuming bucket is public)
                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(fileName);
                    
                imageUrl = publicUrl;
            }
        }

        // Insert Event
        const { error } = await supabase.from("events").insert({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            event_date: date.toISOString(),
            image: imageUrl,
            status: "pending"
        });

        if (error) throw error;

        toast.success("Event submitted successfully! Pending approval.");
        navigate("/events");

    } catch (error: any) {
        toast.error(error.message || "Failed to submit event");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Submit Event - Humble Halal"
        description="Share your upcoming halal event, bazaar, or community gathering with the Singapore Muslim community."
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">Submit an Event</h1>
            <p className="text-muted-foreground text-lg">
              Share bazaars, workshops, and community gatherings.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input 
                        id="title" 
                        placeholder="e.g. Ramadan Bazaar 2025" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Event Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bazaar">Bazaar / Market</SelectItem>
                                <SelectItem value="workshop">Workshop / Class</SelectItem>
                                <SelectItem value="religious">Religious / Talk</SelectItem>
                                <SelectItem value="community">Community Gathering</SelectItem>
                                <SelectItem value="charity">Charity / Fundraiser</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location / Venue</Label>
                    <Input 
                        id="location" 
                        placeholder="e.g. Singapore Expo Hall 4 or Online" 
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                        id="description" 
                        placeholder="Tell us about the event..." 
                        className="min-h-[120px]"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Event Banner (Optional)</Label>
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('image-upload')?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            {imageFile ? imageFile.name : "Upload Image"}
                        </Button>
                        <input 
                            id="image-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended size: 1200x630px. Max 5MB.</p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                        </>
                    ) : "Submit Event"}
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

export default EventSubmit;
