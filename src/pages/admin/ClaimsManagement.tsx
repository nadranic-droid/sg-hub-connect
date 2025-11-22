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
import { FileCheck, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const ClaimsManagement = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    const { data, error } = await supabase
      .from("claims")
      .select(`
        *,
        businesses (
          id,
          name,
          address,
          owner_id
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch claims");
      return;
    }

    setClaims(data || []);
  };

  const handleStatusUpdate = async (claimId: string, status: string) => {
    setLoading(true);
    try {
      // Update claim status
      const { error: claimError } = await supabase
        .from("claims")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", claimId);

      if (claimError) throw claimError;

      // If approved, update business ownership
      if (status === "approved") {
        const claim = claims.find(c => c.id === claimId);
        if (claim) {
          const { error: businessError } = await supabase
            .from("businesses")
            .update({ 
              owner_id: claim.user_id,
              is_claimed: true,
              updated_at: new Date().toISOString()
            })
            .eq("id", claim.business_id);

          if (businessError) throw businessError;

          // Assign business_owner role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert([{ 
              user_id: claim.user_id, 
              role: "business_owner" 
            }]);

          // Ignore error if role already exists
          if (roleError && !roleError.message.includes("duplicate")) {
            throw roleError;
          }
        }
      }

      toast.success(`Claim ${status} successfully`);
      setSelectedClaim(null);
      fetchClaims();
    } catch (error: any) {
      toast.error(error.message || "Failed to update claim");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-3xl flex items-center gap-2">
            <FileCheck className="w-8 h-8 text-primary" />
            Business Claims
          </h2>
          <p className="text-muted-foreground mt-1">
            Review and approve business ownership claims
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Claimant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.length > 0 ? (
                claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">
                      {claim.businesses?.name || "Unknown"}
                      <div className="text-sm text-muted-foreground">
                        {claim.businesses?.address}
                      </div>
                    </TableCell>
                    <TableCell>{claim.user_id}</TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(claim.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedClaim(claim)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No claims found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Claim</DialogTitle>
            <DialogDescription>
              Review the business ownership claim details
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Business Details</h4>
                <p className="text-sm">
                  <strong>Name:</strong> {selectedClaim.businesses?.name}
                </p>
                <p className="text-sm">
                  <strong>Address:</strong> {selectedClaim.businesses?.address}
                </p>
              </div>

              {selectedClaim.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Claimant Notes</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {selectedClaim.notes}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                {getStatusBadge(selectedClaim.status)}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Submitted</h4>
                <p className="text-sm">
                  {format(new Date(selectedClaim.created_at), "PPP 'at' p")}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedClaim?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate(selectedClaim.id, "rejected")}
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedClaim.id, "approved")}
                  disabled={loading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClaimsManagement;
