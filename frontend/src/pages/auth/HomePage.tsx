import HeroSection from "../../components/Home/HeroSection";
import FeatureSection from "../../components/Home/FeatureSection";
import HowitWorksSection from "../../components/Home/HowitWorksSection";
import CTASection from "../../components/Home/CTASection";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <HeroSection />
      <FeatureSection />
      <HowitWorksSection />
      <CTASection />
    </div>
  );
};

export default Home;
