import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag } from "lucide-react";
import { SEO } from "@/components/SEO";
import { generateCollectionPageSchema, generateBreadcrumbSchema } from "@/utils/seoSchemas";

const Articles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      setArticles(data || []);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://humblehalal.sg" },
    { name: "Articles", url: "https://humblehalal.sg/articles" },
  ]);

  const collectionSchema = generateCollectionPageSchema(
    "Halal Lifestyle & Dining Articles",
    "Expert guides on Halal food, Muslim lifestyle, and Singapore business spotlights",
    "https://humblehalal.sg/articles",
    articles.length
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Halal Lifestyle & Dining Articles - Humble Halal Blog"
        description="Expert guides on Halal dining, Muslim lifestyle, Ramadan, and Singapore business spotlights. Stay updated with the latest in Singapore's Halal scene."
        keywords={["halal articles", "muslim lifestyle", "halal food guide", "singapore muslim", "ramadan guide"]}
        schema={[breadcrumbSchema, collectionSchema]}
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">
            Halal Lifestyle & Dining
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Expert guides, reviews, and insights into Singapore's vibrant Halal scene
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="container mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
            <p className="text-muted-foreground">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} to={`/articles/${article.slug}`}>
                <Card className="overflow-hidden hover-lift h-full group">
                  {article.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                      {article.category && (
                        <Badge variant="outline" className="font-medium">
                          {article.category}
                        </Badge>
                      )}
                      {article.is_featured && (
                        <Badge className="bg-secondary text-white">Featured</Badge>
                      )}
                    </div>
                    <h2 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.published_at).toLocaleDateString('en-SG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        5 min read
                      </div>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        {article.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span key={idx} className="text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Articles;