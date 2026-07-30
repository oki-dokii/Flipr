import Navbar from "../components/Navbar";
import Scene3DHero from "../components/Scene3D/Scene3DHero";
import MetricsBar from "../components/MetricsBar";
import FeaturesSection from "../components/FeaturesSection";
import ComparisonSection from "../components/ComparisonSection";
import HowItWorksSection from "../components/HowItWorksSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Scene3DHero />
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
