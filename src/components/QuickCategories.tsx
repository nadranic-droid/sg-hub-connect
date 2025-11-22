import { Link } from "react-router-dom";
import { Utensils, Coffee, Map, Wine, Users } from "lucide-react";

const categories = [
  { name: "Restaurants", icon: Utensils, slug: "food-beverage" },
  { name: "Cafes", icon: Coffee, slug: "lifestyle" },
  { name: "Tours", icon: Map, slug: "services" },
  { name: "Drinks", icon: Wine, slug: "groceries" },
  { name: "Community", icon: Users, slug: "mosques" },
];

export const QuickCategories = () => {
  return (
    <div className="container mx-auto px-4 -mt-12 relative z-20 mb-16">
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="bg-white rounded-2xl p-4 shadow-lg border border-border hover:border-secondary hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-3 w-28"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <category.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-sm text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};