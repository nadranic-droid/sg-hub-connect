import { Shield, CheckCircle, Users } from "lucide-react";

export const TrustSignals = () => {
  const signals = [
    {
      icon: Shield,
      title: "Clear Halal Status",
      description: "Every listing clearly displays its Halal certification status, whether MUIS-certified or Muslim-owned, so you can dine with confidence.",
    },
    {
      icon: CheckCircle,
      title: "Verified Listings",
      description: "All businesses are verified by our team to ensure accuracy and authenticity, giving you peace of mind.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by the community, for the community. Share your favorite spots and help others discover amazing Halal businesses.",
    },
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
          Why rely on Humble Halal?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {signals.map((signal, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <signal.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">{signal.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{signal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};