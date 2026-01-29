import HeroSection from "@/components/landing/HeroSection";
import DemoSection from "@/components/landing/DemoSection";
import ValuePropsSection from "@/components/landing/ValuePropsSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <DemoSection />
      <ValuePropsSection />
      <Footer />
    </div>
  );
};

export default Index;
