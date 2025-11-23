import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const AdminSettings = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage platform configurations</p>
      </div>
      <Separator />
      
      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">General Settings</h3>
          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" defaultValue="Humble Halal" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input id="supportEmail" defaultValue="support@humblehalal.sg" />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">SEO Defaults</h3>
          <div className="grid gap-2">
            <Label htmlFor="metaTitle">Default Meta Title</Label>
            <Input id="metaTitle" defaultValue="Humble Halal - Singapore Business Directory" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="metaDesc">Default Meta Description</Label>
            <Input id="metaDesc" defaultValue="Singapore's trusted guide to verified Halal businesses." />
          </div>
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default AdminSettings;

