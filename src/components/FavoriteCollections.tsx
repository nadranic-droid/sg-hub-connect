import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FolderPlus,
  Heart,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Star,
  MapPin,
  ExternalLink,
  FolderHeart,
} from "lucide-react";
import { toast } from "sonner";

interface Collection {
  id: string;
  name: string;
  businessIds: string[];
  createdAt: string;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  image: string;
  category?: { name: string };
  neighbourhood?: { name: string };
  average_rating?: number;
}

const COLLECTIONS_KEY = "humble_halal_collections";

const getCollections = (): Collection[] => {
  try {
    return JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveCollections = (collections: Collection[]) => {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
};

export function FavoriteCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [businesses, setBusinesses] = useState<Record<string, Business>>({});
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editName, setEditName] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const savedCollections = getCollections();
    setCollections(savedCollections);

    // Fetch business details for all businesses in collections
    const allBusinessIds = [...new Set(savedCollections.flatMap(c => c.businessIds))];
    if (allBusinessIds.length > 0) {
      const { data } = await supabase
        .from("businesses")
        .select("id, name, slug, image, average_rating, categories(name), neighbourhoods(name)")
        .in("id", allBusinessIds);

      if (data) {
        const businessMap: Record<string, Business> = {};
        data.forEach((b: any) => {
          businessMap[b.id] = {
            id: b.id,
            name: b.name,
            slug: b.slug,
            image: b.image,
            category: b.categories,
            neighbourhood: b.neighbourhoods,
            average_rating: b.average_rating,
          };
        });
        setBusinesses(businessMap);
      }
    }
    setLoading(false);
  };

  const createCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name: newCollectionName.trim(),
      businessIds: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [...collections, newCollection];
    setCollections(updated);
    saveCollections(updated);
    setNewCollectionName("");
    setIsCreateOpen(false);
    toast.success(`Collection "${newCollection.name}" created`);
  };

  const updateCollection = () => {
    if (!editingCollection || !editName.trim()) return;

    const updated = collections.map(c =>
      c.id === editingCollection.id ? { ...c, name: editName.trim() } : c
    );
    setCollections(updated);
    saveCollections(updated);
    setEditingCollection(null);
    setEditName("");
    setIsEditOpen(false);
    toast.success("Collection renamed");
  };

  const deleteCollection = (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    const updated = collections.filter(c => c.id !== collectionId);
    setCollections(updated);
    saveCollections(updated);
    toast.success("Collection deleted");
  };

  const removeFromCollection = (collectionId: string, businessId: string) => {
    const updated = collections.map(c =>
      c.id === collectionId
        ? { ...c, businessIds: c.businessIds.filter(id => id !== businessId) }
        : c
    );
    setCollections(updated);
    saveCollections(updated);
    toast.success("Business removed from collection");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Collections</h2>
          <p className="text-muted-foreground text-sm">
            Organize your favorite businesses into collections
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="w-4 h-4 mr-2" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Collection name (e.g., Date Night, Family Restaurants)"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createCollection()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createCollection}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Collection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Collection name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateCollection()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateCollection}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderHeart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground text-sm text-center mb-4">
              Create your first collection to organize your favorite businesses
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{collection.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {collection.businessIds.length} business{collection.businessIds.length !== 1 ? "es" : ""}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCollection(collection);
                          setEditName(collection.name);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteCollection(collection.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {collection.businessIds.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <p>No businesses in this collection</p>
                    <p className="text-xs mt-1">
                      Add businesses from their detail pages
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {collection.businessIds.slice(0, 3).map((businessId) => {
                      const business = businesses[businessId];
                      if (!business) return null;
                      return (
                        <div
                          key={businessId}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group"
                        >
                          <img
                            src={business.image || "/placeholder.svg"}
                            alt={business.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/business/${business.slug}`}
                              className="font-medium text-sm hover:text-primary truncate block"
                            >
                              {business.name}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {business.average_rating && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {business.average_rating.toFixed(1)}
                                </span>
                              )}
                              {business.category && (
                                <span>{business.category.name}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFromCollection(collection.id, businessId)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                    {collection.businessIds.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{collection.businessIds.length - 3} more
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper component for adding to collections from other pages
export function AddToCollectionButton({ businessId }: { businessId: string }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    setCollections(getCollections());
  }, [isOpen]);

  const addToCollection = (collectionId: string) => {
    const updated = collections.map(c => {
      if (c.id === collectionId) {
        if (c.businessIds.includes(businessId)) {
          toast.info("Already in this collection");
          return c;
        }
        toast.success(`Added to "${c.name}"`);
        return { ...c, businessIds: [...c.businessIds, businessId] };
      }
      return c;
    });
    setCollections(updated);
    saveCollections(updated);
    setIsOpen(false);
  };

  const createAndAdd = () => {
    if (!newCollectionName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name: newCollectionName.trim(),
      businessIds: [businessId],
      createdAt: new Date().toISOString(),
    };

    const updated = [...collections, newCollection];
    setCollections(updated);
    saveCollections(updated);
    setNewCollectionName("");
    setIsOpen(false);
    toast.success(`Created "${newCollection.name}" and added business`);
  };

  const isInCollection = (collectionId: string) => {
    return collections.find(c => c.id === collectionId)?.businessIds.includes(businessId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderPlus className="w-4 h-4" />
          Add to Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {collections.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Collections</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    onClick={() => addToCollection(collection.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Heart className={`w-4 h-4 ${isInCollection(collection.id) ? "fill-primary text-primary" : ""}`} />
                      <span className="font-medium">{collection.name}</span>
                    </div>
                    {isInCollection(collection.id) && (
                      <Badge variant="secondary" className="text-xs">Added</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Create New Collection</p>
            <div className="flex gap-2">
              <Input
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createAndAdd()}
              />
              <Button onClick={createAndAdd}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
