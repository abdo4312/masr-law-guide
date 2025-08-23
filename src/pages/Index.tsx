import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LegalCategories from "@/components/LegalCategories";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <LegalCategories />
      <ConsultationForm />
      <Footer />
    </div>
  );
};

export default Index;
