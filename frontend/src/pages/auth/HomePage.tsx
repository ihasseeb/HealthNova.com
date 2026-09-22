import HeroSection from "../../components/Home/HeroSection";
import FeaturesSection from "../../components/Home/FeatureSection";
import HowItWorksSection from "../../components/Home/HowitWorksSection";
import CTASection from "../../components/Home/CTASection";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
};

export default Home;
