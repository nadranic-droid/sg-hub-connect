import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { generateBreadcrumbSchema, generateCollectionPageSchema } from "@/utils/seoSchemas";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LinkMesh } from "@/components/LinkMesh";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: categoryData } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      setCategory(categoryData);

      if (categoryData) {
        const { data: businessData } = await supabase
          .from("businesses")
          .select(`
            *,
            categories!businesses_category_id_fkey (name),
            neighbourhoods (name)
          `)
          .eq("category_id", categoryData.id)
          .eq("status", "approved")
          .order("is_featured", { ascending: false })
          .order("avg_rating", { ascending: false });

        setBusinesses(businessData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEO
          title="Category Not Found"
          description="The category you're looking for doesn't exist."
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-muted-foreground mb-4">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://humblehalal.sg" },
    { name: category.name, url: `https://humblehalal.sg/category/${category.slug}` },
  ]);

  const collectionSchema = generateCollectionPageSchema(
    `${category.name} in Singapore`,
    category.description || `Browse verified Halal ${category.name} businesses in Singapore`,
    `https://humblehalal.sg/category/${category.slug}`,
    businesses.length
  );

  const seoTitle = category.seo_title || `Best Halal ${category.name} in Singapore (${new Date().getFullYear()}) | Humble Halal`;
  const seoDescription = category.seo_description || 
    `Looking for Halal ${category.name} in Singapore? Browse ${businesses.length}+ verified MUIS certified and Muslim-owned ${category.name} spots. Read reviews, check menus and find locations near you.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={[category.name, "halal", "singapore", "muis certified", "muslim owned"]}
        schema={[breadcrumbSchema, collectionSchema]}
      />
      <Header />

      {/* Category Header */}
      <section className="bg-muted/50 border-b border-border py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>
          <h1 className="font-heading font-extrabold text-4xl mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground text-lg">{category.description}</p>
          )}
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {businesses.length} businesses found
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {businesses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                id={business.id}
                name={business.name}
                slug={business.slug}
                category={business.categories?.name}
                neighbourhood={business.neighbourhoods?.name || "Singapore"}
                shortDescription={business.short_description}
                rating={business.avg_rating || 0}
                reviewCount={business.review_count || 0}
                priceRange={business.price_range}
                image={business.cover_image || business.images?.[0]}
                isVerified={business.is_verified}
                isFeatured={business.is_featured}
                phone={business.phone}
                website={business.website}
                certification={business.is_verified ? "MUIS" : null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-6">
              Check back later for new businesses in this category.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Browse All Categories</Link>
            </Button>
          </div>
        )}
      </main>
      
      <LinkMesh currentSlug={slug} type="category" />
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
