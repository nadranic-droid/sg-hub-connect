import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const EventsManagement = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    setEvents(data || []);
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to approve event");
    } else {
      toast.success("Event approved");
      fetchEvents();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("events")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to reject event");
    } else {
      toast.success("Event rejected");
      fetchEvents();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-3xl flex items-center gap-2">
          <Calendar className="w-8 h-8 text-primary" />
          Events Management
        </h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(event.event_date), "PPP")}
                    </TableCell>
                    <TableCell>{event.organizer_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          event.status === "approved"
                            ? "default"
                            : event.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className={event.status === "approved" ? "bg-success" : ""}
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {event.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-success hover:bg-success/90"
                            onClick={() => handleApprove(event.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(event.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsManagement;
