import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, Edit2, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ReviewResponseProps {
  reviewId: string;
  businessId: string;
  businessOwnerId?: string;
  existingResponse?: {
    id: string;
    content: string;
    created_at: string;
  };
  onResponseAdded?: () => void;
}

export function ReviewResponse({
  reviewId,
  businessId,
  businessOwnerId,
  existingResponse,
  onResponseAdded,
}: ReviewResponseProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [response, setResponse] = useState(existingResponse?.content || "");
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(existingResponse);

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id && businessOwnerId) {
        setIsOwner(session.user.id === businessOwnerId);
      }
    };
    checkOwnership();
  }, [businessOwnerId]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to respond");
        return;
      }

      if (isEditing && currentResponse) {
        // Update existing response
        const { error } = await supabase
          .from("review_responses")
          .update({
            content: response.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentResponse.id);

        if (error) throw error;

        setCurrentResponse({
          ...currentResponse,
          content: response.trim(),
        });
        toast.success("Response updated");
      } else {
        // Create new response
        const { data, error } = await supabase
          .from("review_responses")
          .insert({
            review_id: reviewId,
            business_id: businessId,
            user_id: session.user.id,
            content: response.trim(),
          })
          .select()
          .single();

        if (error) throw error;

        setCurrentResponse({
          id: data.id,
          content: data.content,
          created_at: data.created_at,
        });
        toast.success("Response posted");
      }

      setShowForm(false);
      setIsEditing(false);
      onResponseAdded?.();
    } catch (error: any) {
      console.error("Error saving response:", error);
      toast.error(error.message || "Failed to save response");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentResponse) return;

    if (!confirm("Are you sure you want to delete this response?")) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("review_responses")
        .delete()
        .eq("id", currentResponse.id);

      if (error) throw error;

      setCurrentResponse(undefined);
      setResponse("");
      toast.success("Response deleted");
      onResponseAdded?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete response");
    } finally {
      setLoading(false);
    }
  };

  // Show existing response
  if (currentResponse && !isEditing) {
    return (
      <div className="ml-8 mt-3 pl-4 border-l-2 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">Business Owner</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(currentResponse.created_at), "MMM d, yyyy")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{currentResponse.content}</p>

            {/* Edit/Delete buttons for owner */}
            {isOwner && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setIsEditing(true);
                    setResponse(currentResponse.content);
                  }}
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show form for owner
  if (isOwner && (showForm || isEditing)) {
    return (
      <div className="ml-8 mt-3 pl-4 border-l-2 border-primary/30">
        <div className="space-y-3">
          <Textarea
            placeholder="Write your response to this review..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  {isEditing ? "Update" : "Post Response"}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setResponse(currentResponse?.content || "");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show "Reply" button for owner if no response exists
  if (isOwner && !currentResponse) {
    return (
      <div className="ml-8 mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setShowForm(true)}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Reply as Business Owner
        </Button>
      </div>
    );
  }

  return null;
}
