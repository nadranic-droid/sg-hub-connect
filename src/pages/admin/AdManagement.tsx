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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, MousePointerClick, Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AdManagement = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    business_id: "",
    slot_type: "home_featured",
    start_date: "" as string | Date,
    end_date: "" as string | Date,
    status: "pending"
  });
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  useEffect(() => {
    fetchAds();
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const { data } = await supabase.from("businesses").select("id, name").order("name");
    setBusinesses(data || []);
  };

  const fetchAds = async () => {
    // Check if ad_slots table exists first/mock for now if not
    const { data, error } = await supabase
      .from("ad_slots")
      .select(`
        *,
        businesses (name)
      `)
      .order("created_at", { ascending: false });
      
    if (error) {
        // Table might not exist in this version, just show empty or mock
        console.log("Ad slots table query error:", error);
    } else {
        setAds(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure dates are strings
    const submitData = {
      ...formData,
      start_date: typeof formData.start_date === 'string' 
        ? formData.start_date 
        : formData.start_date instanceof Date 
          ? formData.start_date.toISOString().split('T')[0]
          : '',
      end_date: typeof formData.end_date === 'string' 
        ? formData.end_date 
        : formData.end_date instanceof Date 
          ? formData.end_date.toISOString().split('T')[0]
          : '',
    };
    
    const { error } = await supabase.from("ad_slots").insert(submitData);

    if (error) {
      toast.error("Failed to create ad slot. (Check if 'ad_slots' table exists)");
    } else {
      toast.success("Ad slot created");
      setIsDialogOpen(false);
      setFormData({
        business_id: "",
        slot_type: "home_featured",
        start_date: "",
        end_date: "",
        status: "pending"
      });
      fetchAds();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-3xl">Ad Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
             <Button className="gap-2"><Plus className="w-4 h-4"/> Create Ad Slot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Ad Slot</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="business">Business</Label>
                    <Select onValueChange={(val) => setFormData({...formData, business_id: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Business" />
                        </SelectTrigger>
                        <SelectContent>
                            {businesses.map(b => (
                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Slot Type</Label>
                    <Select 
                        defaultValue="home_featured"
                        onValueChange={(val) => setFormData({...formData, slot_type: val})}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="home_featured">Home Featured</SelectItem>
                            <SelectItem value="sidebar_promo">Sidebar Promo</SelectItem>
                            <SelectItem value="banner_top">Top Banner</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.start_date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.start_date ? (
                                        format(
                                            typeof formData.start_date === 'string' 
                                                ? new Date(formData.start_date) 
                                                : formData.start_date,
                                            "PPP"
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={
                                        formData.start_date
                                            ? typeof formData.start_date === 'string'
                                                ? new Date(formData.start_date)
                                                : formData.start_date
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        if (date) {
                                            setFormData({...formData, start_date: date.toISOString().split('T')[0]});
                                            setStartDateOpen(false);
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.end_date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.end_date ? (
                                        format(
                                            typeof formData.end_date === 'string' 
                                                ? new Date(formData.end_date) 
                                                : formData.end_date,
                                            "PPP"
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={
                                        formData.end_date
                                            ? typeof formData.end_date === 'string'
                                                ? new Date(formData.end_date)
                                                : formData.end_date
                                            : undefined
                                    }
                                    onSelect={(date) => {
                                        if (date) {
                                            setFormData({...formData, end_date: date.toISOString().split('T')[0]});
                                            setEndDateOpen(false);
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <Button type="submit" className="w-full">Create Slot</Button>
            </form>
          </DialogContent>
        </Dialog>
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
