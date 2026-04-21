import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PizzaCustomizer from "@/components/PizzaCustomizer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutPage from "@/components/CheckoutPage";
import { CartProvider } from "@/components/CartContext";

const Customize = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <CartDrawer />
        <CheckoutPage />
        <div className="pt-20">
          <PizzaCustomizer />
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Customize;
