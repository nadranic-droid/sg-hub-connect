import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Share2, 
  Clock, 
  User,
  ExternalLink,
  Users,
  Heart,
  Facebook,
  Twitter,
  Copy,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { AdSlot } from "@/components/AdSlot";

// RSVP localStorage helpers
const RSVP_STORAGE_KEY = "humble_halal_event_rsvps";
const RSVP_COUNTS_KEY = "humble_halal_event_rsvp_counts";

const getRSVPs = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(RSVP_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const getRSVPCounts = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(RSVP_COUNTS_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveRSVP = (eventId: string, hasRSVPed: boolean) => {
  const rsvps = getRSVPs();
  const counts = getRSVPCounts();

  if (hasRSVPed) {
    rsvps[eventId] = true;
    counts[eventId] = (counts[eventId] || 0) + 1;
  } else {
    delete rsvps[eventId];
    counts[eventId] = Math.max((counts[eventId] || 1) - 1, 0);
  }

  localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvps));
  localStorage.setItem(RSVP_COUNTS_KEY, JSON.stringify(counts));
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Load RSVP state on mount
  useEffect(() => {
    if (id) {
      const rsvps = getRSVPs();
      const counts = getRSVPCounts();
      setHasRSVPed(!!rsvps[id]);
      setRsvpCount(counts[id] || 0);
    }
  }, [id]);

  const handleRSVP = () => {
    if (!id) return;

    setRsvpLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      const newRSVPState = !hasRSVPed;
      saveRSVP(id, newRSVPState);
      setHasRSVPed(newRSVPState);
      setRsvpCount(prev => newRSVPState ? prev + 1 : Math.max(prev - 1, 0));

      if (newRSVPState) {
        toast.success("You're going! See you at the event.");
      } else {
        toast.info("RSVP cancelled");
      }

      setRsvpLoading(false);
    }, 300);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .maybeSingle();

      if (error) {
        toast.error("Failed to load event");
        navigate("/events");
      } else if (!data) {
        toast.error("Event not found");
        navigate("/events");
      } else {
        setEvent(data);
        
        // Fetch related events
        const { data: related } = await supabase
          .from("events")
          .select("*")
          .eq("status", "approved")
          .neq("id", id)
          .gte("event_date", new Date().toISOString())
          .order("event_date", { ascending: true })
          .limit(3);
        
        setRelatedEvents(related || []);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id, navigate]);

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const text = `${event?.title} - ${event?.description?.substring(0, 100)}...`;
    
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
      return;
    }
    
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
      return;
    }
    
    // Native share API
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const eventDate = new Date(event.event_date);
  const isPastEvent = eventDate < new Date();
  
  // Default event images based on event type or random selection
  const defaultEventImages = [
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1920&auto=format&fit=crop",
  ];
  
  const getDefaultImage = () => {
    // Use event title hash to consistently pick an image
    const hash = event.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return defaultEventImages[hash % defaultEventImages.length];
  };
  
  const eventImage = event.image || getDefaultImage();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${event.title} - Humble Halal Events`}
        description={event.description || `Join us for ${event.title}`}
        image={eventImage}
      />
      <Header />

      {/* Hero Image Section */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-muted">
        <img
          src={eventImage}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultEventImages[0];
            target.onerror = null; // Prevent infinite loop
          }}
        />
        {/* Stronger gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/events")}
            className="backdrop-blur-md bg-white/90 hover:bg-white text-foreground shadow-lg border border-border/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>

        {/* Share Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleShare()}
            className="backdrop-blur-md bg-white/90 hover:bg-white text-foreground shadow-lg border border-border/50"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-primary text-white shadow-lg">
              {isPastEvent ? "Past Event" : "Upcoming Event"}
            </Badge>
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl lg:text-6xl text-white mb-2 drop-shadow-2xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 font-medium">Date</p>
                      <p className="font-bold text-lg text-foreground">
                        {format(eventDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 font-medium">
                        {format(eventDate, "h:mm a")}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1 font-medium">Location</p>
                        <p className="font-bold text-lg mb-2 text-foreground">{event.location}</p>
                        <a
                          href={getGoogleMapsUrl(event.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline flex items-center gap-1 transition-colors"
                        >
                          View on Map <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />
                
                {/* In-Content Ad */}
                <AdSlot type="in_content" showMockup={true} />

                {event.description && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-foreground">About This Event</h2>
                    <div className="prose max-w-none">
                      <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed text-lg font-medium">
                        {event.description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share Section */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-4 text-foreground">Share This Event</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleShare("facebook")}
                    className="flex-1 md:flex-initial"
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("twitter")}
                    className="flex-1 md:flex-initial"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("copy")}
                    className="flex-1 md:flex-initial"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground">More Events</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {relatedEvents.map((relatedEvent) => {
                      const relatedImage = relatedEvent.image || getDefaultImage();
                      return (
                        <Link
                          key={relatedEvent.id}
                          to={`/events/${relatedEvent.id}`}
                          className="group"
                        >
                          <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                            <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
                              <img
                                src={relatedImage}
                                alt={relatedEvent.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = defaultEventImages[0];
                                  target.onerror = null;
                                }}
                              />
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                                {relatedEvent.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(relatedEvent.event_date), "MMM d, yyyy")}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* RSVP Card */}
              <Card className={`border-2 shadow-lg ${hasRSVPed ? "border-primary bg-primary/5" : "border-border"}`}>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${hasRSVPed ? "bg-primary text-white" : "bg-primary/10"}`}>
                      {hasRSVPed ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <Users className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {hasRSVPed ? "You're Going!" : "Join This Event"}
                    </h3>
                    {rsvpCount > 0 && (
                      <p className="text-muted-foreground text-sm font-medium">
                        {rsvpCount} {rsvpCount === 1 ? "person" : "people"} going
                      </p>
                    )}
                    {!hasRSVPed && rsvpCount === 0 && !isPastEvent && (
                      <p className="text-muted-foreground text-sm font-medium">
                        Be the first to RSVP!
                      </p>
                    )}
                    {isPastEvent && (
                      <p className="text-muted-foreground text-sm font-medium">
                        This event has ended
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {!isPastEvent ? (
                      <Button
                        size="lg"
                        className={`w-full ${hasRSVPed ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"} text-white`}
                        onClick={handleRSVP}
                        disabled={rsvpLoading}
                      >
                        {rsvpLoading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Processing...
                          </span>
                        ) : hasRSVPed ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Cancel RSVP
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-4 w-4" />
                            RSVP Now
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        Event Ended
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-2 hover:bg-muted"
                      onClick={() => navigate("/events/submit")}
                    >
                      Submit Your Event
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Event Info Card */}
              <Card className="border border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-6 text-foreground text-lg">Event Information</h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-3 pb-4 border-b border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-base leading-tight">
                          {format(eventDate, "EEEE, MMMM d")}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                          {format(eventDate, "yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-start gap-3 pb-4 border-b border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground text-base mb-2 break-words">
                            {event.location}
                          </p>
                          <a
                            href={getGoogleMapsUrl(event.location)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:text-primary/80 hover:underline flex items-center gap-1 transition-colors inline-flex"
                          >
                            Get Directions <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {event.organizer_name && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground font-medium mb-1">Organized by</p>
                          <p className="font-bold text-foreground text-base break-words">
                            {event.organizer_name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom Banner Ad */}
      <AdSlot type="banner_bottom" showMockup={true} />

      <Footer />
    </div>
  );
};

export default EventDetail;

