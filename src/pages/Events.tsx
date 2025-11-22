import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, User, Search, Plus } from "lucide-react";
import { format } from "date-fns";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("status", "approved")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });

      setEvents(data || []);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex-shrink-0">
              <div className="font-heading font-bold text-xl leading-tight">
                Humble Halal
                <div className="text-xs font-normal opacity-90">Singapore Business Directory</div>
              </div>
            </Link>

            <div className="flex-1 max-w-2xl mx-8 relative">
              <Input
                placeholder="Search events..."
                className="w-full h-11 pl-4 pr-12 bg-white text-foreground border-0"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <Link to="/auth">
                <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-muted/50 border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-extrabold text-4xl mb-2">Upcoming Events</h1>
              <p className="text-muted-foreground text-lg">
                Discover halal events, bazaars, and community gatherings
              </p>
            </div>
            <Link to="/events/submit">
              <Button className="bg-secondary text-white hover:bg-secondary-dark gap-2">
                <Plus className="w-5 h-5" />
                Submit Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <main className="container mx-auto px-4 py-10">
        {events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover-lift border">
                {event.image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-heading font-bold text-xl line-clamp-2">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(event.event_date), "PPP")}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to submit an event!
            </p>
            <Link to="/events/submit">
              <Button>Submit Event</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;
