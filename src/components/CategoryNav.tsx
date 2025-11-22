import { Link } from "react-router-dom";

interface CategoryNavProps {
  activeCategory: string;
  categories: Array<{ name: string; slug: string }>;
}

export const CategoryNav = ({ activeCategory, categories }: CategoryNavProps) => {
  return (
    <nav className="bg-white border-b border-border sticky top-[72px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className={`py-4 px-2 font-medium relative transition-colors hover:text-primary ${
                activeCategory === category.name
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              }`}
            >
              {category.name}
              {activeCategory === category.name && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
