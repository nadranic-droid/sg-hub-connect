import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminNeighbourhoods = () => {
  const [neighbourhoods, setNeighbourhoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    region: "Central",
    description: "",
  });

  const fetchNeighbourhoods = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("neighbourhoods")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to fetch neighbourhoods");
    } else {
      setNeighbourhoods(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNeighbourhoods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    const payload = {
        name: formData.name,
        slug,
        region: formData.region,
        description: formData.description,
    };

    let error;
    if (editingItem) {
        const { error: updateError } = await supabase
            .from("neighbourhoods")
            .update(payload)
            .eq("id", editingItem.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from("neighbourhoods")
            .insert(payload);
        error = insertError;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(editingItem ? "Neighbourhood updated" : "Neighbourhood created");
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({ name: "", slug: "", region: "Central", description: "" });
      fetchNeighbourhoods();
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      region: item.region || "Central",
      description: item.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This might affect businesses linked to this neighbourhood.")) return;

    const { error } = await supabase.from("neighbourhoods").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete neighbourhood");
    } else {
      toast.success("Neighbourhood deleted");
      fetchNeighbourhoods();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Neighbourhoods</h2>
          <p className="text-muted-foreground">Manage Singapore neighbourhoods</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
                setEditingItem(null);
                setFormData({ name: "", slug: "", region: "Central", description: "" });
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Neighbourhood
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Neighbourhood" : "Add Neighbourhood"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  placeholder="Auto-generated if empty"
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <select 
                    id="region"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                >
                    <option value="Central">Central</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North-East">North-East</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingItem ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : neighbourhoods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">No neighbourhoods found</TableCell>
              </TableRow>
            ) : (
              neighbourhoods.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                  <TableCell>{item.business_count || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminNeighbourhoods;

