import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CreditCard } from "lucide-react";
import { toast } from "sonner";

const MembershipPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null); // Add state for editing
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    billing_interval: "month",
    features: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from("membership_plans")
      .select("*")
      .order("price", { ascending: true });

    setPlans(data || []);
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      price: plan.price.toString(),
      billing_interval: plan.billing_interval,
      features: plan.features ? plan.features.join("\n") : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const features = formData.features.split("\n").filter((f) => f.trim());
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      billing_interval: formData.billing_interval,
      features: features,
    };

    let error;
    if (editingPlan) {
        const { error: updateError } = await supabase
            .from("membership_plans")
            .update(payload)
            .eq("id", editingPlan.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from("membership_plans")
            .insert(payload);
        error = insertError;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(editingPlan ? "Plan updated successfully" : "Plan created successfully");
      setShowForm(false);
      setEditingPlan(null);
      setFormData({ name: "", description: "", price: "", billing_interval: "month", features: "" });
      fetchPlans();
    }
  };

  const cancelEdit = () => {
      setShowForm(false);
      setEditingPlan(null);
      setFormData({ name: "", description: "", price: "", billing_interval: "month", features: "" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-3xl">Membership Plans</h2>
        <Button onClick={() => {
            if (showForm) cancelEdit();
            else setShowForm(true);
        }} className="gap-2">
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Plan"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Premium Plan"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full access to all features..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (SGD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <Label htmlFor="interval">Billing Interval</Label>
                  <Select
                    value={formData.billing_interval}
                    onValueChange={(value) => setFormData({ ...formData, billing_interval: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Featured listing&#10;Priority support&#10;Analytics dashboard"
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full">{editingPlan ? "Update Plan" : "Create Plan"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                {plan.name}
              </CardTitle>
              <p className="text-muted-foreground text-sm">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-base font-normal text-muted-foreground">
                    /{plan.billing_interval}
                  </span>
                </div>
              </div>

              {plan.features && (
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Button variant="outline" className="w-full" onClick={() => handleEdit(plan)}>
                Edit Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlans;
