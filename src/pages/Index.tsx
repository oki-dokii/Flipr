import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MetricsBar from "@/components/MetricsBar";
import FeaturesSection from "@/components/FeaturesSection";
import ComparisonSection from "@/components/ComparisonSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <MetricsBar />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
