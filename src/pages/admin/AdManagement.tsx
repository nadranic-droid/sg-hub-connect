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
import { Eye, MousePointerClick } from "lucide-react";
import { format } from "date-fns";

const AdManagement = () => {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const { data } = await supabase
      .from("ad_slots")
      .select(`
        *,
        businesses (name)
      `)
      .order("created_at", { ascending: false });

    setAds(data || []);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-3xl">Ad Management</h2>
        <Button className="gap-2">Create Ad Slot</Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">{ad.businesses?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ad.slot_type.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(ad.start_date), "MMM d")} - {format(new Date(ad.end_date), "MMM d")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          {ad.impressions}
                        </div>
                        <div className="flex items-center gap-1">
                          <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                          {ad.clicks}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={ad.status === "active" ? "default" : "secondary"}
                        className={ad.status === "active" ? "bg-success" : ""}
                      >
                        {ad.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No ad slots found
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

export default AdManagement;
