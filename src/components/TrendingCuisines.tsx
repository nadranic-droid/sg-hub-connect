import { Link } from "react-router-dom";

const cuisines = [
  {
    name: "Japanese",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&auto=format&fit=crop",
  },
  {
    name: "Korean",
    image: "https://images.unsplash.com/photo-1580867332126-b5b5e0193c7b?w=400&auto=format&fit=crop",
  },
  {
    name: "Korean Baraon",
    image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&auto=format&fit=crop",
  },
  {
    name: "Keungee",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop",
  },
  {
    name: "Dion",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop",
  },
  {
    name: "Other",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop",
  },
];

export const TrendingCuisines = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
          Explore Trending Cuisines
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {cuisines.map((cuisine, index) => (
            <Link
              key={index}
              to={`/search?cuisine=${cuisine.name}`}
              className="relative aspect-[2/3] rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={cuisine.image}
                alt={cuisine.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to a generic food image if original fails
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop";
                  target.onerror = null;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 flex items-end justify-center p-4">
                <h3 className="font-heading font-bold text-white text-lg text-center">
                  {cuisine.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};