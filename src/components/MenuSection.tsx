import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Flame, Star, Eye } from "lucide-react";
import { useCart, SIZE_MULTIPLIER, type PizzaSize } from "./CartContext";
import PizzaDetailModal from "./PizzaDetailModal";
import pizzaMargherita from "@/assets/pizza-margherita.jpg";
import pizzaPepperoni from "@/assets/pizza-pepperoni.jpg";
import pizzaBbq from "@/assets/pizza-bbq.jpg";
import pizzaVeggie from "@/assets/pizza-veggie.jpg";
import pizzaCheeseBurst from "@/assets/pizza-cheese-burst.jpg";
import pizzaDessert from "@/assets/pizza-dessert.jpg";
import pizzaMeatLovers from "@/assets/pizza-meat-lovers.jpg";

const pizzas = [
  { name: "Classic Margherita", basePrice: 14, image: pizzaMargherita, desc: "San Marzano tomatoes, fresh mozzarella, basil", tag: "Popular", rating: 4.8 },
  { name: "Spicy Pepperoni", basePrice: 16, image: pizzaPepperoni, desc: "Double pepperoni, mozzarella, chili flakes", tag: "Spicy 🔥", rating: 4.9 },
  { name: "BBQ Chicken", basePrice: 18, image: pizzaBbq, desc: "Grilled chicken, caramelized onions, BBQ drizzle", tag: "Chef's Pick", rating: 4.7 },
  { name: "Veggie Supreme", basePrice: 15, image: pizzaVeggie, desc: "Bell peppers, olives, mushrooms, onions, corn", tag: "Healthy", rating: 4.6 },
  { name: "Cheese Burst", basePrice: 17, image: pizzaCheeseBurst, desc: "Four-cheese blend, stuffed crust, extra gooey", tag: "Bestseller", rating: 4.9 },
  { name: "Nutella Dessert", basePrice: 13, image: pizzaDessert, desc: "Nutella, strawberries, powdered sugar, chocolate", tag: "Sweet", rating: 4.5 },
  { name: "Meat Lovers", basePrice: 19, image: pizzaMeatLovers, desc: "Pepperoni, bacon, sausage, beef, thick crust", tag: "Premium", rating: 4.8 },
];

const PizzaCard = ({ pizza, index, onViewDetail }: { pizza: typeof pizzas[0]; index: number; onViewDetail: () => void }) => {
  const { addToCart, setIsOpen } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("MD");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const currentPrice = pizza.basePrice * SIZE_MULTIPLIER[selectedSize];

  const handleQuickAdd = () => {
    addToCart({ name: pizza.name, basePrice: pizza.basePrice, image: pizza.image, size: selectedSize, extras: [] });
    setIsAdded(true);
    setIsOpen(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      style={{
        transform: isHovered ? `perspective(800px) rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg)` : "perspective(800px) rotateY(0deg) rotateX(0deg)",
        transition: isHovered ? "none" : "transform 0.5s ease-out",
      }}
      className="group relative rounded-3xl overflow-hidden bg-card border border-border"
    >
      {/* Cursor glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at ${(mousePos.x / 20 + 0.5) * 100}% ${(mousePos.y / 20 + 0.5) * 100}%, hsl(var(--primary) / 0.12), transparent 60%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] cursor-pointer" onClick={onViewDetail}>
        <motion.img
          src={pizza.image}
          alt={pizza.name}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.12 : 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.3 }}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/30"
        >
          <Flame className="w-3 h-3" />
          {pizza.tag}
        </motion.div>

        {/* Hover view button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 flex gap-2 z-20"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => { e.stopPropagation(); onViewDetail(); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/30 backdrop-blur-sm"
              >
                <Eye className="w-4 h-4" /> Customize & Add
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold leading-tight truncate">{pizza.name}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{pizza.desc}</p>
          </div>
        </div>

        {/* Size selector */}
        <div className="flex gap-2">
          {(["SM", "MD", "XXL"] as PizzaSize[]).map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setSelectedSize(s)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                selectedSize === s
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm font-semibold">{pizza.rating}</span>
          </div>
          <motion.div
            key={currentPrice}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-2xl font-bold text-primary"
          >
            ${currentPrice.toFixed(2)}
          </motion.div>
        </div>

        {/* Quick add */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleQuickAdd}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  ✓ Added!
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Quick Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onViewDetail}
            className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary" />
          </motion.button>
        </div>
      </div>

      {/* Float animation */}
      <AnimatePresence>
        {isAdded && (
          <motion.div
            initial={{ scale: 0, opacity: 1, y: 0 }}
            animate={{ scale: 1.5, opacity: 0, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <ShoppingCart className="w-8 h-8 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MenuSection = () => {
  const [detailPizza, setDetailPizza] = useState<typeof pizzas[0] | null>(null);

  return (
    <>
      <section id="menu" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-primary font-semibold text-sm uppercase mb-4"
            >
              Our Menu
            </motion.p>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Signature <span className="text-gradient">Creations</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Each pizza is handcrafted with premium ingredients. Choose your size and extras!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pizzas.map((pizza, i) => (
              <PizzaCard key={pizza.name} pizza={pizza} index={i} onViewDetail={() => setDetailPizza(pizza)} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {detailPizza && <PizzaDetailModal pizza={detailPizza} onClose={() => setDetailPizza(null)} />}
      </AnimatePresence>
    </>
  );
};

export default MenuSection;
