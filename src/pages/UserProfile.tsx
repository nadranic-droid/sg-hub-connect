import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Star,
  Calendar,
  MapPin,
  MessageSquare,
  Heart,
  Award,
  ThumbsUp,
  Camera,
} from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  images?: string[];
  helpful_count?: number;
  businesses: {
    id: string;
    name: string;
    slug: string;
    cover_image?: string;
    neighbourhoods?: { name: string };
  };
}

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState("reviews");

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      // For now, we'll get basic info from reviews
      // In a real app, you'd have a profiles table
      const { data: reviews } = await supabase
        .from("reviews")
        .select("user_id, created_at")
        .eq("user_id", userId)
        .limit(1);

      if (!reviews || reviews.length === 0) {
        return null;
      }

      return {
        id: userId,
        created_at: reviews[0].created_at,
      };
    },
    enabled: !!userId,
  });

  // Fetch user reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["user-reviews", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          content,
          created_at,
          images,
          helpful_count,
          businesses (
            id,
            name,
            slug,
            cover_image,
            neighbourhoods (name)
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      return data as Review[] || [];
    },
    enabled: !!userId,
  });

  // Calculate stats
  const stats = {
    totalReviews: reviews?.length || 0,
    totalPhotos: reviews?.reduce((acc, r) => acc + (r.images?.length || 0), 0) || 0,
    avgRating: reviews?.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0",
    helpfulVotes: reviews?.reduce((acc, r) => acc + (r.helpful_count || 0), 0) || 0,
  };

  // Get badges based on activity
  const getBadges = () => {
    const badges = [];
    if (stats.totalReviews >= 50) badges.push({ name: "Elite Reviewer", color: "bg-amber-500" });
    else if (stats.totalReviews >= 25) badges.push({ name: "Super Reviewer", color: "bg-purple-500" });
    else if (stats.totalReviews >= 10) badges.push({ name: "Active Reviewer", color: "bg-blue-500" });
    else if (stats.totalReviews >= 5) badges.push({ name: "Regular Reviewer", color: "bg-green-500" });

    if (stats.totalPhotos >= 50) badges.push({ name: "Photographer", color: "bg-pink-500" });
    if (stats.helpfulVotes >= 25) badges.push({ name: "Helpful", color: "bg-cyan-500" });

    return badges;
  };

  const badges = getBadges();

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <User className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-heading font-bold text-2xl mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This user doesn't exist or hasn't written any reviews yet.
          </p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`User Profile - Humble Halal`}
        description={`View reviews and contributions from this community member`}
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-heading font-bold text-3xl mb-2">
                Community Member
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {profile.created_at ? format(new Date(profile.created_at), "MMMM yyyy") : "Unknown"}
                </span>
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <Badge key={badge.name} className={`${badge.color} text-white`}>
                      <Award className="w-3 h-3 mr-1" />
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{stats.totalReviews}</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{stats.totalPhotos}</div>
                <div className="text-xs text-muted-foreground">Photos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{stats.avgRating}</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{stats.helpfulVotes}</div>
                <div className="text-xs text-muted-foreground">Helpful</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Reviews ({stats.totalReviews})
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-2">
              <Camera className="w-4 h-4" />
              Photos ({stats.totalPhotos})
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            {reviewsLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Business Image */}
                        <Link to={`/business/${review.businesses?.slug}`} className="shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                            {review.businesses?.cover_image ? (
                              <img
                                src={review.businesses.cover_image}
                                alt={review.businesses?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <MapPin className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Review Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <Link
                                to={`/business/${review.businesses?.slug}`}
                                className="font-heading font-bold text-lg hover:text-primary transition-colors"
                              >
                                {review.businesses?.name}
                              </Link>
                              {review.businesses?.neighbourhoods?.name && (
                                <p className="text-sm text-muted-foreground">
                                  {review.businesses.neighbourhoods.name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{review.rating}</span>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3 line-clamp-3">
                            {review.content}
                          </p>

                          {/* Review Images */}
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.images.slice(0, 4).map((img, idx) => (
                                <div
                                  key={idx}
                                  className="w-16 h-16 rounded-lg overflow-hidden bg-muted"
                                >
                                  <img
                                    src={img}
                                    alt={`Review photo ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {review.images.length > 4 && (
                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
                                  +{review.images.length - 4}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{format(new Date(review.created_at), "MMM d, yyyy")}</span>
                            {review.helpful_count && review.helpful_count > 0 && (
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {review.helpful_count} found helpful
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            {reviews && reviews.some((r) => r.images && r.images.length > 0) ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {reviews
                  .flatMap((r) =>
                    (r.images || []).map((img, idx) => ({
                      image: img,
                      business: r.businesses,
                      reviewId: r.id,
                    }))
                  )
                  .map((item, idx) => (
                    <Link
                      key={`${item.reviewId}-${idx}`}
                      to={`/business/${item.business?.slug}`}
                      className="aspect-square rounded-lg overflow-hidden bg-muted group relative"
                    >
                      <img
                        src={item.image}
                        alt={item.business?.name || "Review photo"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-white text-xs truncate">
                          {item.business?.name}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No photos uploaded yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
