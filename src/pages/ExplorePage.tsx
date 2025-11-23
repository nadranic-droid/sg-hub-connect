import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LinkMesh } from "@/components/LinkMesh";
import { MapPin } from "lucide-react";

const ExplorePage = () => {
  const { neighbourhood, category } = useParams();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    heading: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      let query = supabase
        .from("businesses")
        .select(`
          *,
          categories!inner(name, slug),
          neighbourhoods!inner(name, slug, region)
        `)
        .eq("status", "approved")
        .eq("neighbourhoods.slug", neighbourhood);

      if (category) {
        query = query.eq("categories.slug", category);
      }

      const { data } = await query.order("is_featured", { ascending: false });
      
      setBusinesses(data || []);
      
      // Generate Metadata
      const neighbourhoodName = data?.[0]?.neighbourhoods?.name || neighbourhood?.replace("-", " ");
      const categoryName = data?.[0]?.categories?.name || category?.replace("-", " ");
      const year = new Date().getFullYear();

      if (category) {
        setMeta({
          title: `Best Halal ${categoryName} in ${neighbourhoodName} (${year}) | Humble Halal`,
          description: `Looking for Halal ${categoryName} in ${neighbourhoodName}? Browse verified MUIS certified and Muslim-owned spots in ${neighbourhoodName}.`,
          heading: `Halal ${categoryName} in ${neighbourhoodName}`
        });
      } else {
        setMeta({
          title: `Top Halal Food & Services in ${neighbourhoodName} (${year}) | Humble Halal`,
          description: `Explore the best Halal food and services in ${neighbourhoodName}. Verified restaurants, cafes and more.`,
          heading: `Explore ${neighbourhoodName}`
        });
      }

      setLoading(false);
    };

    if (neighbourhood) {
      fetchData();
    }
  }, [neighbourhood, category]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={meta.title}
        description={meta.description}
        keywords={[neighbourhood || "", category || "", "halal", "singapore"]}
      />
      <Header />

      <section className="bg-muted/50 border-b border-border py-12">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground mb-4 capitalize">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/#neighbourhoods" className="hover:text-foreground">Neighbourhoods</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{neighbourhood?.replace("-", " ")}</span>
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">{category.replace("-", " ")}</span>
              </>
            )}
          </nav>
          <h1 className="font-heading font-extrabold text-4xl mb-4 capitalize">{meta.heading}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span>{businesses.length} verified listings found</span>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : businesses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                id={business.id}
                name={business.name}
                slug={business.slug}
                category={business.categories?.name}
                neighbourhood={business.neighbourhoods?.name}
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
              We couldn't find any listings matching your criteria.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Browse All Neighbourhoods</Link>
            </Button>
          </div>
        )}
      </main>

      <LinkMesh currentSlug={neighbourhood} type="neighbourhood" />
      <Footer />
    </div>
  );
};

export default ExplorePage;

