import { Link } from "react-router-dom";
import { Utensils, Coffee, Users } from "lucide-react";

const categories = [
  { name: "Restaurant", icon: Utensils, slug: "restaurant", link: "/restaurant-hub" },
  { name: "Cafes", icon: Coffee, slug: "cafes", link: "/cafe-hub" },
  { name: "Community", icon: Users, slug: "community", link: "/category/community" },
];

export const QuickCategories = () => {
  return (
    <div className="container mx-auto px-4 -mt-8 sm:-mt-12 relative z-20 mb-12 sm:mb-16">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={category.link}
            className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-border hover:border-secondary hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center gap-2 sm:gap-3 w-24 sm:w-28"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center">
              {/* Replaced text-primary with explicit color as some setups might have issues */}
              <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F766E]" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-center leading-tight">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};