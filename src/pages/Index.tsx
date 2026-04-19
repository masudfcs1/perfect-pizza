import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import CheckoutPage from "@/components/CheckoutPage";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import PizzaCustomizer from "@/components/PizzaCustomizer";
import AboutSection from "@/components/AboutSection";
import SpecialsSection from "@/components/SpecialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <CartDrawer />
        <CheckoutPage />
        <HeroSection />
        <MenuSection />
        <PizzaCustomizer />
        <AboutSection />
        <SpecialsSection />
        <CTASection />
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
