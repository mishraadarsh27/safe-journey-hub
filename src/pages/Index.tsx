import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import SafetyTipsSection from "@/components/SafetyTipsSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO Meta - handled by index.html */}

      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SafetyTipsSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
