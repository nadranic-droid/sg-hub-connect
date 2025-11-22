export const HeroSection = () => {
  return (
    <section 
      className="h-[400px] bg-cover bg-center relative flex items-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
      <div className="container mx-auto px-4 relative z-10 text-white">
        <h1 className="font-heading font-extrabold text-5xl md:text-6xl mb-3">
          Discover Halal Singapore.
        </h1>
        <p className="text-xl md:text-2xl opacity-95">
          Your trusted guide to verified Halal businesses.
        </p>
      </div>
    </section>
  );
};
