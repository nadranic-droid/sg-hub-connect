import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LinkMeshProps {
  currentSlug?: string;
  type: "category" | "neighbourhood";
}

export const LinkMesh = ({ currentSlug, type }: LinkMeshProps) => {
  const { data: links } = useQuery({
    queryKey: ["link-mesh", type],
    queryFn: async () => {
      const table = type === "category" ? "categories" : "neighbourhoods";
      
      const { data } = await supabase
        .from(table)
        .select("name, slug")
        .order("name", { ascending: true })
        .limit(20); // Limit to keep footer clean, or remove for full mesh

      return data || [];
    },
  });

  if (!links || links.length === 0) return null;

  const title = type === "category" ? "More Categories" : "Explore Neighbourhoods";
  const basePath = type === "category" ? "/category/" : "/neighbourhood/";

  return (
    <div className="bg-muted/30 py-8 border-t border-border mt-12">
      <div className="container mx-auto px-4">
        <h3 className="font-heading font-bold text-lg mb-4">{title}</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {links
            .filter((link) => link.slug !== currentSlug)
            .map((link) => (
              <Link
                key={link.slug}
                to={`${basePath}${link.slug}`}
                className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
              >
                {link.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

