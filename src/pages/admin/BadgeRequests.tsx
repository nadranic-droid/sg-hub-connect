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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge as BadgeIcon, CheckCircle, XCircle, Eye, Mail, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const BadgeRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("badge_requests")
      .select(`
        *,
        businesses (
          id,
          name,
          slug
        )
      `)
      .order("request_date", { ascending: false });

    if (error) {
      toast.error("Failed to fetch badge requests");
      return;
    }

    setRequests(data || []);
  };

  const handleStatusUpdate = async (requestId: string, status: string) => {
    setLoading(true);
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === "verified") {
        updateData.verified_date = new Date().toISOString();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          updateData.admin_user_id = session.user.id;
        }
      }

      if (verificationNotes) {
        updateData.verification_notes = verificationNotes;
      }

      const { error } = await supabase
        .from("badge_requests")
        .update(updateData)
        .eq("id", requestId);

      if (error) throw error;

      toast.success(`Request ${status} successfully`);
      setSelectedRequest(null);
      setVerificationNotes("");
      fetchRequests();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const generateCouponCode = () => {
    // Generate a unique coupon code
    const prefix = "BADGE";
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}-${random}`;
  };

  const handleGenerateCoupon = async () => {
    if (!selectedRequest) return;

    const code = generateCouponCode();
    setCouponCode(code);

    try {
      // Update request with coupon code and status
      const { error } = await supabase
        .from("badge_requests")
        .update({
          coupon_code: code,
          status: "coupon_sent",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      // TODO: Send email with coupon code
      // This would typically call an email service or Supabase Edge Function
      
      toast.success("Coupon code generated and request updated!");
      setSelectedRequest({ ...selectedRequest, coupon_code: code, status: "coupon_sent" });
      fetchRequests();
    } catch (error: any) {
      console.error("Error generating coupon:", error);
      toast.error(error.message || "Failed to generate coupon");
    }
  };

  const copyCouponCode = async () => {
    if (couponCode) {
      await navigator.clipboard.writeText(couponCode);
      toast.success("Coupon code copied to clipboard!");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pending", variant: "outline" },
      verified: { label: "Verified", variant: "default" },
      rejected: { label: "Rejected", variant: "destructive" },
      coupon_sent: { label: "Coupon Sent", variant: "secondary" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Badge Redemption Requests</h1>
        <p className="text-muted-foreground">
          Manage badge requests and verify badges for free featured listing coupons
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{requests.filter(r => r.status === "pending").length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{requests.filter(r => r.status === "verified").length}</div>
            <div className="text-sm text-muted-foreground">Verified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{requests.filter(r => r.status === "coupon_sent").length}</div>
            <div className="text-sm text-muted-foreground">Coupons Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{requests.length}</div>
            <div className="text-sm text-muted-foreground">Total Requests</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No badge requests yet
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {format(new Date(request.request_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">{request.business_name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      <a
                        href={request.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {new URL(request.website_url).hostname}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                    <TableCell>{request.city}, {request.state}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setCouponCode(request.coupon_code || "");
                            setVerificationNotes(request.verification_notes || "");
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(request.website_url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Badge Request Details</DialogTitle>
            <DialogDescription>
              Review and manage this badge redemption request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Business Name</Label>
                  <p className="font-medium">{selectedRequest.business_name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{selectedRequest.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p>{selectedRequest.phone || "Not provided"}</p>
                </div>
                <div>
                  <Label>Website URL</Label>
                  <a
                    href={selectedRequest.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {selectedRequest.website_url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <Label>Location</Label>
                  <p>{selectedRequest.city}, {selectedRequest.state}</p>
                </div>
                <div>
                  <Label>Badge Location</Label>
                  <p>{selectedRequest.badge_location || "Not specified"}</p>
                </div>
                <div>
                  <Label>Request Date</Label>
                  <p>{format(new Date(selectedRequest.request_date), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              {selectedRequest.businesses && (
                <div>
                  <Label>Linked Business Listing</Label>
                  <p>
                    <a
                      href={`/business/${selectedRequest.businesses.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedRequest.businesses.name}
                    </a>
                  </p>
                </div>
              )}

              <div>
                <Label>Verification Notes</Label>
                <Textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Add notes about verification..."
                  className="mt-2"
                />
              </div>

              {selectedRequest.coupon_code && (
                <div>
                  <Label>Coupon Code</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={selectedRequest.coupon_code} readOnly />
                    <Button size="sm" variant="outline" onClick={copyCouponCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <DialogFooter className="flex flex-wrap gap-2">
                {selectedRequest.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedRequest.id, "rejected")}
                      disabled={loading}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id, "verified")}
                      disabled={loading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Badge
                    </Button>
                  </>
                )}
                {selectedRequest.status === "verified" && (
                  <Button
                    onClick={handleGenerateCoupon}
                    disabled={loading || !!selectedRequest.coupon_code}
                  >
                    <BadgeIcon className="w-4 h-4 mr-2" />
                    Generate & Send Coupon
                  </Button>
                )}
                {selectedRequest.status === "coupon_sent" && (
                  <div className="text-sm text-muted-foreground">
                    Coupon code: <span className="font-mono font-semibold">{selectedRequest.coupon_code}</span>
                  </div>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgeRequests;

