import { useState } from "react";
import { Shield, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { DestinationSearch } from "@/components/DestinationSearch";
import { LocationResult } from "@/services/geocoding";

import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const { user, loginWithGoogle } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();

  const handleStartJourney = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to start a journey.",
      });
      loginWithGoogle();
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Destination required",
        description: "Please enter your destination to start your journey.",
        variant: "destructive",
      });
      return;
    }

    // Instead of starting the trip immediately, we navigate to Dashboard with the intent
    setIsStarting(true);

    // Check if geolocation is supported (quick check)
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      setIsStarting(false);
      return;
    }

    // Pass the selected location to the dashboard
    navigate("/dashboard", { state: { targetLocation: selectedLocation } });
  };

  return (
    <section className="w-full py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        {/* Shield Icon - Animated */}
        <div
          className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-primary/10 mb-6 md:mb-8 animate-float"
          style={{ animationDelay: "0s" }}
        >
          <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary" strokeWidth={1.5} />
        </div>

        {/* Headings */}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight opacity-0 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          Safe Journey Starts Here
        </h1>
        <p
          className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 max-w-md mx-auto opacity-0 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          We'll monitor your trip and keep you connected to help.
        </p>

        {/* Destination Input */}
        <div
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="relative flex-1 text-left">
            <DestinationSearch onSelect={setSelectedLocation} />
          </div>
        </div>

        {/* CTA Button */}
        <div
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            variant="hero"
            size="xl"
            onClick={handleStartJourney}
            disabled={isStarting}
            className={`w-full sm:w-auto min-w-[200px]`}
          >
            {user ? (isStarting ? "Processing..." : "Start Journey") : "Login to Start"}
            {!isStarting && <ArrowRight className="w-5 h-5 ml-1" />}
          </Button>
        </div>

        {/* Trust indicator */}
        <p
          className="mt-6 text-sm text-muted-foreground opacity-0 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            24/7 monitoring • Instant alerts • Trusted by thousands
          </span>
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
