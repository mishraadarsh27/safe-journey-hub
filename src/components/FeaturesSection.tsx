import { Navigation, ShieldAlert, Users } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Navigation,
    title: "Live Tracking",
    subtitle: "GPS monitored journey with real-time location updates for complete peace of mind.",
  },
  {
    icon: ShieldAlert,
    title: "One-Tap SOS",
    subtitle: "Instant emergency alert to your trusted contacts and local authorities.",
  },
  {
    icon: Users,
    title: "Trusted Contacts",
    subtitle: "Share your journey with loved ones so they always know you're safe.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="w-full py-12 md:py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            Your Safety, Our Priority
          </h2>
          <p
            className="text-muted-foreground max-w-md mx-auto opacity-0 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            Built with features that keep you protected throughout your journey
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              subtitle={feature.subtitle}
              delay={0.7 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
