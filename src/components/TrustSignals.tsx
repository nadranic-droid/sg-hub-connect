import { Shield, CheckCircle, Users } from "lucide-react";

export const TrustSignals = () => {
  const signals = [
    {
      icon: Shield,
      title: "Clear Halal Status",
      description: "Clear Halal Status to ws-oirpact clear halal status.",
    },
    {
      icon: CheckCircle,
      title: "Verified Listings",
      description: "Werified ths aracents by holdxii mocest tns grouid busts.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Community meet cirata oriers and promots oun trivxt.",
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