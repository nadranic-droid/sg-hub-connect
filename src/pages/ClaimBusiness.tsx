import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Search, MapPin, ArrowLeft, Building2, FileText } from "lucide-react";
import { toast } from "sonner";

const ClaimBusiness = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get("business");
  
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [formData, setFormData] = useState({
    notes: "",
    proof_documents: [] as string[],
  });

  useEffect(() => {
    if (businessId) {
      const fetchBusiness = async () => {
        const { data } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", businessId)
          .maybeSingle();

        setBusiness(data);
      };
      fetchBusiness();
    }
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please sign in to claim a business");
      navigate("/auth");
      return;
    }

    if (!businessId) {
      toast.error("No business selected");
      return;
    }

    const { error } = await supabase.from("claims").insert({
      business_id: businessId,
      user_id: session.user.id,
      notes: formData.notes,
      status: "pending",
    });

    if (error) {
      toast.error("Failed to submit claim");
      console.error(error);
    } else {
      toast.success("Claim submitted successfully! Our team will review it shortly.");
      navigate("/dashboard");
    }

    setLoading(false);
  };

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

            <div className="flex items-center gap-6 flex-shrink-0">
              <Link to="/auth">
                <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-10">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              Claim Your Business
            </CardTitle>
            <p className="text-muted-foreground">
              Verify your ownership to manage your business listing and respond to reviews
            </p>
          </CardHeader>
          <CardContent>
            {business && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-1">{business.name}</h3>
                <p className="text-sm text-muted-foreground">{business.address}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="notes">
                  Additional Information *
                  <span className="text-sm text-muted-foreground ml-2">
                    Explain your connection to this business
                  </span>
                </Label>
                <Textarea
                  id="notes"
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="I am the owner/manager of this business..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 mb-1">Verification Process</p>
                    <p className="text-blue-700">
                      Our team will review your claim within 2-3 business days. You may be contacted for additional verification documents.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary-dark"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Claim"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClaimBusiness;
