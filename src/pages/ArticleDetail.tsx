import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/utils/seoSchemas";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_id?: string;
  published_at?: string;
  created_at?: string;
  views_count?: number;
  category?: string;
  tags?: string[];
  is_published?: boolean;
}

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      setArticle(data);
      setLoading(false);

      // Update views count
      if (data) {
        await supabase
          .from("articles")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", data.id);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/articles">View All Articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.excerpt,
    image: article.featured_image,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: article.author_id || "Humble Halal",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://humblehalal.sg" },
    { name: "Articles", url: "https://humblehalal.sg/articles" },
    { name: article.title, url: `https://humblehalal.sg/articles/${article.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={article.seo_title || article.title}
        description={article.seo_description || article.excerpt}
        keywords={article.tags || []}
        image={article.featured_image}
        type="article"
        schema={[articleSchema, breadcrumbSchema]}
      />
      <Header />

      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link to="/articles">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {article.category && (
                <Badge variant="outline" className="font-medium">
                  {article.category}
                </Badge>
              )}
              {article.is_featured && (
                <Badge className="bg-secondary text-white">Featured</Badge>
              )}
            </div>

            <h1 className="font-heading font-extrabold text-3xl md:text-5xl mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.published_at).toLocaleDateString('en-SG', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  5 min read
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="aspect-video rounded-xl overflow-hidden mb-10">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-ul:my-6 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-5 h-5 text-muted-foreground" />
                {article.tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-muted rounded-xl text-center">
            <h3 className="font-heading font-bold text-2xl mb-3">
              Discover More Halal Businesses
            </h3>
            <p className="text-muted-foreground mb-6">
              Browse our directory of verified Halal restaurants, shops, and services
            </p>
            <Button asChild size="lg">
              <Link to="/">Explore Directory</Link>
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticleDetail;