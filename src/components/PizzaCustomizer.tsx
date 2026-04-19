import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, ArrowRight, ArrowLeft, ShoppingCart,
  Plus, Minus, Check, Sparkles, RotateCcw
} from "lucide-react";
import { useCart, SIZE_MULTIPLIER, SIZE_LABELS, type PizzaSize } from "./CartContext";
import heroPizza from "@/assets/hero-pizza.jpg";

// ═══════════════════════════════════════════════════════
// DATA — Each option has id, name, price, emoji, desc, & color
// ═══════════════════════════════════════════════════════

interface CustomOption {
  id: string;
  name: string;
  price: number;
  emoji: string;
  desc: string;
  color: string;
  image?: string;
}

const CRUST_OPTIONS: CustomOption[] = [
  { id: "thin", name: "Thin & Crispy", price: 3.00, emoji: "🫓", desc: "Ultra-thin, golden & crunchy", color: "#D4A574", image: "/crust-options.png" },
  { id: "classic", name: "Hand-Tossed", price: 4.00, emoji: "🍕", desc: "Traditional New York style", color: "#C4944C", image: "/crust-options.png" },
  { id: "thick", name: "Deep Dish", price: 5.00, emoji: "🥘", desc: "Thick, buttery Chicago-style", color: "#B8863C", image: "/crust-options.png" },
  { id: "stuffed", name: "Stuffed Crust", price: 6.00, emoji: "🧀", desc: "Cheese-filled edges", color: "#A87834", image: "/crust-options.png" },
];

const SAUCE_OPTIONS: CustomOption[] = [
  { id: "tomato", name: "Classic Tomato", price: 1.50, emoji: "🍅", desc: "San Marzano, slow-simmered", color: "#DC2626", image: "/sauce-options.png" },
  { id: "bbq", name: "Smoky BBQ", price: 2.00, emoji: "🔥", desc: "Hickory-smoked, sweet & tangy", color: "#92400E", image: "/sauce-options.png" },
  { id: "pesto", name: "Basil Pesto", price: 2.50, emoji: "🌿", desc: "Fresh basil, pine nuts, garlic", color: "#166534", image: "/sauce-options.png" },
  { id: "white", name: "Garlic Alfredo", price: 2.00, emoji: "🧄", desc: "Rich, creamy garlic butter", color: "#F5F5DC", image: "/sauce-options.png" },
];

const CHEESE_OPTIONS: CustomOption[] = [
  { id: "mozzarella", name: "Fresh Mozzarella", price: 2.50, emoji: "🧀", desc: "Classic stretch & melt", color: "#FFFDD0", image: "/cheese-options.png" },
  { id: "cheddar", name: "Sharp Cheddar", price: 3.00, emoji: "🟧", desc: "Bold, aged flavor", color: "#FF8C00", image: "/cheese-options.png" },
  { id: "quattro", name: "Four Cheese", price: 4.00, emoji: "✨", desc: "Mozzarella, parmesan, gouda, fontina", color: "#FFF8DC", image: "/cheese-options.png" },
  { id: "vegan", name: "Plant-Based", price: 3.50, emoji: "🌱", desc: "Cashew-based, dairy-free", color: "#90EE90", image: "/cheese-options.png" },
];

interface ToppingOption {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: "meat" | "veggie";
}

const TOPPING_OPTIONS: ToppingOption[] = [
  { id: "pepperoni", name: "Pepperoni", price: 1.50, emoji: "🔴", category: "meat" },
  { id: "sausage", name: "Italian Sausage", price: 1.75, emoji: "🌭", category: "meat" },
  { id: "bacon", name: "Crispy Bacon", price: 2.00, emoji: "🥓", category: "meat" },
  { id: "chicken", name: "Grilled Chicken", price: 2.00, emoji: "🍗", category: "meat" },
  { id: "mushrooms", name: "Mushrooms", price: 1.00, emoji: "🍄", category: "veggie" },
  { id: "peppers", name: "Bell Peppers", price: 1.00, emoji: "🫑", category: "veggie" },
  { id: "olives", name: "Black Olives", price: 1.00, emoji: "🫒", category: "veggie" },
  { id: "onions", name: "Red Onions", price: 0.75, emoji: "🧅", category: "veggie" },
  { id: "jalapenos", name: "Jalapeños", price: 1.25, emoji: "🌶️", category: "veggie" },
  { id: "pineapple", name: "Pineapple", price: 1.00, emoji: "🍍", category: "veggie" },
  { id: "spinach", name: "Fresh Spinach", price: 1.00, emoji: "🥬", category: "veggie" },
  { id: "tomatoes", name: "Sun-dried Tomato", price: 1.25, emoji: "🍅", category: "veggie" },
];

const STEPS = [
  { title: "Crust", subtitle: "Choose Your Base", icon: "🫓" },
  { title: "Sauce", subtitle: "Pick Your Sauce", icon: "🍅" },
  { title: "Cheese", subtitle: "Layer Your Cheese", icon: "🧀" },
  { title: "Toppings", subtitle: "Add Toppings", icon: "🍄" },
  { title: "Review", subtitle: "Review & Order", icon: "🎉" },
];

// ═══════════════════════════════════════════════════════
// STEP PROGRESS BAR
// ═══════════════════════════════════════════════════════

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
    {STEPS.map((step, i) => (
      <div key={step.title} className="flex items-center">
        <motion.button
          className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
            i === current
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : i < current
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-base sm:text-lg">{step.icon}</span>
          <span className="hidden sm:inline">{step.title}</span>
          {i < current && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center"
            >
              <Check className="w-2.5 h-2.5" />
            </motion.div>
          )}
        </motion.button>
        {i < total - 1 && (
          <div className={`w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 rounded-full transition-colors duration-500 ${
            i < current ? "bg-primary" : "bg-border"
          }`} />
        )}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════
// OPTION CARD — with emoji, price, image, and selection glow
// ═══════════════════════════════════════════════════════

const OptionCard = ({
  option,
  selected,
  onSelect,
  index,
}: {
  option: CustomOption;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) => (
  <motion.button
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, type: "spring", stiffness: 120 }}
    whileHover={{ scale: 1.03, y: -4 }}
    whileTap={{ scale: 0.97 }}
    onClick={onSelect}
    className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 text-left overflow-hidden transition-all duration-400 ${
      selected
        ? "border-primary bg-primary/8 shadow-xl shadow-primary/15"
        : "border-border bg-card hover:border-primary/30 hover:shadow-lg"
    }`}
  >
    {/* Selection glow */}
    {selected && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${option.color}15, transparent 70%)`,
        }}
      />
    )}

    {/* Image thumbnail */}
    {option.image && (
      <div className="relative w-full h-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4">
        <img
          src={option.image}
          alt={option.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        <motion.div
          animate={selected ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="absolute bottom-2 left-2 text-2xl sm:text-3xl drop-shadow-lg"
        >
          {option.emoji}
        </motion.div>
      </div>
    )}

    <div className="relative z-10">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-sm sm:text-base truncate">{option.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{option.desc}</p>
        </div>
        <motion.div
          key={option.price}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-primary font-bold text-sm sm:text-base whitespace-nowrap"
        >
          ${option.price.toFixed(2)}
        </motion.div>
      </div>
    </div>

    {/* Check mark */}
    {selected && (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
      >
        <Check className="w-3.5 h-3.5" />
      </motion.div>
    )}
  </motion.button>
);

// ═══════════════════════════════════════════════════════
// TOPPING CARD — smaller, multi-select
// ═══════════════════════════════════════════════════════

const ToppingCard = ({
  topping,
  selected,
  onToggle,
  index,
}: {
  topping: ToppingOption;
  selected: boolean;
  onToggle: () => void;
  index: number;
}) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.04, type: "spring", stiffness: 150 }}
    whileHover={{ scale: 1.06, y: -3 }}
    whileTap={{ scale: 0.94 }}
    onClick={onToggle}
    className={`relative p-3 sm:p-4 rounded-2xl border-2 text-left overflow-hidden transition-all duration-300 ${
      selected
        ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
        : "border-border bg-card hover:border-primary/30"
    }`}
  >
    <div className="flex items-center gap-2 sm:gap-3">
      <motion.span
        animate={selected ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="text-xl sm:text-2xl"
      >
        {topping.emoji}
      </motion.span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-xs sm:text-sm truncate">{topping.name}</div>
        <div className="text-xs text-primary font-bold">+${topping.price.toFixed(2)}</div>
      </div>
    </div>
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
      >
        <Check className="w-3 h-3" />
      </motion.div>
    )}
    {topping.category === "meat" && (
      <div className="absolute bottom-1.5 right-2 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">
        Meat
      </div>
    )}
  </motion.button>
);

// ═══════════════════════════════════════════════════════
// LIVE PIZZA PREVIEW — animated layered circles
// ═══════════════════════════════════════════════════════

const TOPPING_POSITIONS = [
  // ring 1 - inner
  { x: 0, y: -20 }, { x: 17, y: 10 }, { x: -17, y: 10 },
  // ring 2 - middle
  { x: 30, y: -25 }, { x: 35, y: 15 }, { x: 0, y: 35 },
  { x: -35, y: 15 }, { x: -30, y: -25 },
  // ring 3 - outer
  { x: 45, y: -10 }, { x: 20, y: -45 }, { x: -20, y: -45 },
  { x: -45, y: -10 },
];

const PizzaPreview = ({
  crust,
  sauce,
  cheese,
  toppings,
}: {
  crust: CustomOption | null;
  sauce: CustomOption | null;
  cheese: CustomOption | null;
  toppings: ToppingOption[];
}) => {
  return (
    <div className="relative w-56 h-56 sm:w-72 sm:h-72 mx-auto">
      {/* Plate / shadow */}
      <div className="absolute inset-[-8%] rounded-full bg-foreground/5 blur-xl" />

      {/* Crust layer */}
      <motion.div
        animate={{
          scale: crust ? 1 : 0.3,
          opacity: crust ? 1 : 0.2,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute inset-0 rounded-full"
        style={{
          background: crust
            ? `radial-gradient(circle at 35% 35%, ${crust.color}ee, ${crust.color}88)`
            : "#d4a57433",
          boxShadow: crust ? `inset 0 -8px 20px ${crust.color}44, 0 8px 30px #00000022` : "none",
        }}
      />

      {/* Crust edge detail */}
      {crust && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-full"
          style={{
            border: `6px solid ${crust.color}`,
            boxShadow: `inset 0 0 10px ${crust.color}66`,
          }}
        />
      )}

      {/* Sauce layer */}
      <motion.div
        animate={{
          scale: sauce ? 1 : 0,
          opacity: sauce ? 0.85 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute inset-[10%] rounded-full"
        style={{
          background: sauce
            ? `radial-gradient(circle at 40% 40%, ${sauce.color}dd, ${sauce.color}99)`
            : "transparent",
        }}
      />

      {/* Cheese layer */}
      <motion.div
        animate={{
          scale: cheese ? 1 : 0,
          opacity: cheese ? 0.7 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute inset-[12%] rounded-full"
        style={{
          background: cheese
            ? `radial-gradient(circle at 30% 30%, ${cheese.color}cc, ${cheese.color}66)`
            : "transparent",
          mixBlendMode: "overlay",
        }}
      />

      {/* Cheese dots pattern */}
      {cheese && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-[14%] rounded-full overflow-hidden"
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, ${cheese.color} 2px, transparent 2px)`,
              backgroundSize: "14px 14px",
            }}
          />
        </motion.div>
      )}

      {/* Toppings */}
      <AnimatePresence>
        {toppings.map((t, i) => {
          const pos = TOPPING_POSITIONS[i % TOPPING_POSITIONS.length];
          return (
            <motion.div
              key={t.id}
              initial={{ scale: 0, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: i * 0.05 }}
              className="absolute text-lg sm:text-xl pointer-events-none"
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            >
              {t.emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Steam animation */}
      {(crust || sauce) && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, -60],
                opacity: [0, 0.4, 0],
                scale: [0.5, 1, 1.5],
              }}
              transition={{
                duration: 3,
                delay: i * 0.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute top-[10%] text-lg pointer-events-none"
              style={{ left: `${30 + i * 18}%` }}
            >
              ♨️
            </motion.div>
          ))}
        </>
      )}

      {/* Empty state */}
      {!crust && !sauce && !cheese && toppings.length === 0 && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <span className="text-4xl sm:text-5xl">🍽️</span>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Start building!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// PRICE BREAKDOWN
// ═══════════════════════════════════════════════════════

const PriceBreakdown = ({
  crust,
  sauce,
  cheese,
  toppings,
  size,
}: {
  crust: CustomOption | null;
  sauce: CustomOption | null;
  cheese: CustomOption | null;
  toppings: ToppingOption[];
  size: PizzaSize;
}) => {
  const basePrice =
    (crust?.price || 0) + (sauce?.price || 0) + (cheese?.price || 0) +
    toppings.reduce((s, t) => s + t.price, 0);
  const sizedPrice = basePrice * SIZE_MULTIPLIER[size];

  return (
    <div className="space-y-2 text-sm">
      {crust && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{crust.emoji} {crust.name}</span>
          <span className="font-medium">${crust.price.toFixed(2)}</span>
        </div>
      )}
      {sauce && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{sauce.emoji} {sauce.name}</span>
          <span className="font-medium">${sauce.price.toFixed(2)}</span>
        </div>
      )}
      {cheese && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{cheese.emoji} {cheese.name}</span>
          <span className="font-medium">${cheese.price.toFixed(2)}</span>
        </div>
      )}
      {toppings.map((t) => (
        <div key={t.id} className="flex justify-between">
          <span className="text-muted-foreground">{t.emoji} {t.name}</span>
          <span className="font-medium">${t.price.toFixed(2)}</span>
        </div>
      ))}
      {basePrice > 0 && (
        <>
          <div className="border-t border-border pt-2 mt-2 flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${basePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Size ({SIZE_LABELS[size]}) ×{SIZE_MULTIPLIER[size]}</span>
            <span className="font-medium">${sizedPrice.toFixed(2)}</span>
          </div>
          <div className="border-t border-primary/30 pt-2 flex justify-between">
            <span className="font-bold text-base">Total</span>
            <motion.span
              key={sizedPrice}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display font-bold text-xl text-primary"
            >
              ${sizedPrice.toFixed(2)}
            </motion.span>
          </div>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// REVIEW STEP
// ═══════════════════════════════════════════════════════

const ReviewStep = ({
  crust,
  sauce,
  cheese,
  toppings,
  size,
  setSize,
  qty,
  setQty,
  onAddToCart,
  added,
}: {
  crust: CustomOption | null;
  sauce: CustomOption | null;
  cheese: CustomOption | null;
  toppings: ToppingOption[];
  size: PizzaSize;
  setSize: (s: PizzaSize) => void;
  qty: number;
  setQty: (q: number) => void;
  onAddToCart: () => void;
  added: boolean;
}) => {
  const basePrice =
    (crust?.price || 0) + (sauce?.price || 0) + (cheese?.price || 0) +
    toppings.reduce((s, t) => s + t.price, 0);
  const sizedTotal = basePrice * SIZE_MULTIPLIER[size] * qty;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h3 className="font-display text-2xl font-bold flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />
        Your Custom Creation
      </h3>

      {/* Selected items summary */}
      <div className="space-y-3 p-4 rounded-2xl bg-muted/50 border border-border">
        <PriceBreakdown crust={crust} sauce={sauce} cheese={cheese} toppings={toppings} size={size} />
      </div>

      {/* Size selector */}
      <div>
        <h4 className="font-display font-semibold text-lg mb-3">Choose Size</h4>
        <div className="grid grid-cols-3 gap-3">
          {(["SM", "MD", "XXL"] as PizzaSize[]).map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSize(s)}
              className={`relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                size === s
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
                  : "border-border hover:border-primary/30 bg-card"
              }`}
            >
              <motion.div
                animate={{ scale: size === s ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-2xl mb-1"
              >
                🍕
              </motion.div>
              <div className="font-bold text-sm">{s}</div>
              <div className="text-xs text-muted-foreground">{SIZE_LABELS[s]}</div>
              <div className="font-bold text-primary mt-1 text-sm">
                ×{SIZE_MULTIPLIER[s]}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-3 bg-card rounded-2xl border border-border p-2">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Minus className="w-4 h-4" />
          </motion.button>
          <motion.span
            key={qty}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-bold text-lg w-8 text-center"
          >
            {qty}
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setQty(qty + 1)}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddToCart}
          disabled={!crust || !sauce || !cheese}
          className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/25 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="done"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                ✓ Added!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ${sizedTotal.toFixed(2)}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

const PizzaCustomizer = () => {
  const { addToCart, setIsOpen: setCartOpen } = useCart();

  const [step, setStep] = useState(0);
  const [crust, setCrust] = useState<CustomOption | null>(null);
  const [sauce, setSauce] = useState<CustomOption | null>(null);
  const [cheese, setCheese] = useState<CustomOption | null>(null);
  const [toppings, setToppings] = useState<ToppingOption[]>([]);
  const [size, setSize] = useState<PizzaSize>("MD");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const toggleTopping = (t: ToppingOption) => {
    setToppings((prev) =>
      prev.find((x) => x.id === t.id)
        ? prev.filter((x) => x.id !== t.id)
        : [...prev, t]
    );
  };

  const basePrice = useMemo(
    () =>
      (crust?.price || 0) +
      (sauce?.price || 0) +
      (cheese?.price || 0) +
      toppings.reduce((s, t) => s + t.price, 0),
    [crust, sauce, cheese, toppings]
  );

  const canGoNext = () => {
    if (step === 0) return !!crust;
    if (step === 1) return !!sauce;
    if (step === 2) return !!cheese;
    return true;
  };

  const handleAddToCart = () => {
    if (!crust || !sauce || !cheese) return;

    const extras = [
      crust.name,
      sauce.name,
      cheese.name,
      ...toppings.map((t) => t.name),
    ];

    for (let i = 0; i < qty; i++) {
      addToCart({
        name: "🎨 Custom Pizza",
        basePrice,
        image: heroPizza,
        size,
        extras,
      });
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setCartOpen(true);
    }, 1000);
  };

  const handleReset = () => {
    setStep(0);
    setCrust(null);
    setSauce(null);
    setCheese(null);
    setToppings([]);
    setSize("MD");
    setQty(1);
  };

  const stepDirection = useMemo(() => {
    return 1; // always forward for animation consistency
  }, []);

  return (
    <section id="customize" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-primary font-semibold text-sm uppercase mb-4 flex items-center justify-center gap-2"
          >
            <ChefHat className="w-4 h-4" />
            Build Your Own
          </motion.p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
            Pizza <span className="text-gradient">Customizer</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Craft your dream pizza step by step. Choose your crust, sauce, cheese & toppings — each with its own price.
          </p>
        </motion.div>

        {/* Step indicator */}
        <StepIndicator current={step} total={STEPS.length} />

        {/* Main builder area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Options panel — 3 cols on large screens */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              {/* STEP 0: Crust */}
              {step === 0 && (
                <motion.div
                  key="crust"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">🫓</span>
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold">Choose Your Crust</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">The foundation of every great pizza</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {CRUST_OPTIONS.map((opt, i) => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={crust?.id === opt.id}
                        onSelect={() => setCrust(opt)}
                        index={i}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Sauce */}
              {step === 1 && (
                <motion.div
                  key="sauce"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">🍅</span>
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold">Pick Your Sauce</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">The soul of your pizza flavor</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {SAUCE_OPTIONS.map((opt, i) => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={sauce?.id === opt.id}
                        onSelect={() => setSauce(opt)}
                        index={i}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Cheese */}
              {step === 2 && (
                <motion.div
                  key="cheese"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">🧀</span>
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold">Layer Your Cheese</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Because cheese makes everything better</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {CHEESE_OPTIONS.map((opt, i) => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={cheese?.id === opt.id}
                        onSelect={() => setCheese(opt)}
                        index={i}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Toppings */}
              {step === 3 && (
                <motion.div
                  key="toppings"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">🍄</span>
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold">Add Your Toppings</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Select as many as you like — {toppings.length} selected
                      </p>
                    </div>
                  </div>

                  {/* Category headers */}
                  <div className="mb-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      🥩 Premium Meats
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                      {TOPPING_OPTIONS.filter((t) => t.category === "meat").map((t, i) => (
                        <ToppingCard
                          key={t.id}
                          topping={t}
                          selected={toppings.some((x) => x.id === t.id)}
                          onToggle={() => toggleTopping(t)}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      🥬 Fresh Veggies
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {TOPPING_OPTIONS.filter((t) => t.category === "veggie").map((t, i) => (
                        <ToppingCard
                          key={t.id}
                          topping={t}
                          selected={toppings.some((x) => x.id === t.id)}
                          onToggle={() => toggleTopping(t)}
                          index={i + 4}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Topping image reference */}
                  <div className="mt-4 sm:mt-6 rounded-2xl overflow-hidden border border-border">
                    <img
                      src="/topping-options.png"
                      alt="Fresh pizza toppings"
                      className="w-full h-28 sm:h-36 object-cover"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Review */}
              {step === 4 && (
                <ReviewStep
                  key="review"
                  crust={crust}
                  sauce={sauce}
                  cheese={cheese}
                  toppings={toppings}
                  size={size}
                  setSize={setSize}
                  qty={qty}
                  setQty={setQty}
                  onAddToCart={handleAddToCart}
                  added={added}
                />
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6 sm:mt-8 gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => step > 0 && setStep(step - 1)}
                disabled={step === 0}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-card border border-border font-semibold text-sm hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-card border border-border hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                title="Reset all"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>

              {step < 4 && (
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => canGoNext() && setStep(step + 1)}
                  disabled={!canGoNext()}
                  className="flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed glow"
                >
                  {step === 3 ? "Review" : "Next"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Preview panel — 2 cols on large screens */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-28 space-y-4 sm:space-y-6"
            >
              {/* Visual pizza */}
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-border shadow-xl">
                <div className="text-center mb-4">
                  <h3 className="font-display font-bold text-base sm:text-lg">Your Pizza Preview</h3>
                  <p className="text-xs text-muted-foreground">Watch it come to life!</p>
                </div>

                <div className="relative">
                  {/* Slow rotation wrapper */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <PizzaPreview crust={crust} sauce={sauce} cheese={cheese} toppings={toppings} />
                  </motion.div>
                </div>

                {/* Quick summary under preview */}
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                  {crust && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                    >
                      {crust.emoji} {crust.name}
                    </motion.span>
                  )}
                  {sauce && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                    >
                      {sauce.emoji} {sauce.name}
                    </motion.span>
                  )}
                  {cheese && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                    >
                      {cheese.emoji} {cheese.name}
                    </motion.span>
                  )}
                  {toppings.map((t) => (
                    <motion.span
                      key={t.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2.5 py-1 rounded-full bg-accent/10 text-accent-foreground text-xs font-semibold"
                    >
                      {t.emoji} {t.name}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Running price card */}
              <motion.div
                layout
                className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-card border border-border"
              >
                <h4 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                  💰 Price Breakdown
                </h4>
                <PriceBreakdown
                  crust={crust}
                  sauce={sauce}
                  cheese={cheese}
                  toppings={toppings}
                  size={size}
                />
                {basePrice === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">
                    Select options to see pricing
                  </p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PizzaCustomizer;
