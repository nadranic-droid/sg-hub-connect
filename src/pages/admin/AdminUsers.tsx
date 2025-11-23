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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Try profiles table first, fallback to auth.users if profiles doesn't exist
      let query = supabase
        .from("profiles")
        .select(`
          *,
          user_roles (role)
        `)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("full_name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        // If profiles table doesn't exist, try to get users from auth
        console.warn("Profiles table error:", error);
        
        // Alternative: Use a function or RPC to get users
        // For now, show empty state with helpful message
        if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          toast.error("Profiles table not found. Please ensure the profiles table exists in your database.");
          setUsers([]);
        } else {
          toast.error(`Failed to fetch users: ${error.message}`);
          setUsers([]);
        }
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    
    // Check if role exists
    const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    let error;
    
    if (existingRole) {
        const { error: updateError } = await supabase
            .from("user_roles")
            .update({ role: newRole })
            .eq("user_id", userId);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from("user_roles")
            .insert({ user_id: userId, role: newRole });
        error = insertError;
    }

    if (error) {
      toast.error("Failed to update role");
    } else {
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage users and permissions</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const role = user.user_roles?.[0]?.role || "user";
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                            {user.avatar_url && (
                                <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                            )}
                            <div>
                                <div>{user.full_name || "Anonymous"}</div>
                                <div className="text-xs text-muted-foreground">{user.id}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={role === "admin" ? "default" : "outline"}
                        className={role === "admin" ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        {role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleAdminRole(user.id, role)}
                        title={role === "admin" ? "Remove Admin" : "Make Admin"}
                      >
                        {role === "admin" ? (
                          <ShieldOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Shield className="h-4 w-4 text-purple-600" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;

