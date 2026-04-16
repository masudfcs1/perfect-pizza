import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, Sparkles } from "lucide-react";
import { useCart, EXTRA_OPTIONS, SIZE_MULTIPLIER, SIZE_LABELS, type PizzaSize } from "./CartContext";

interface Pizza {
  name: string;
  basePrice: number;
  image: string;
  desc: string;
  tag: string;
  rating: number;
}

interface Props {
  pizza: Pizza | null;
  onClose: () => void;
}

const PizzaDetailModal = ({ pizza, onClose }: Props) => {
  const { addToCart, setIsOpen } = useCart();
  const [size, setSize] = useState<PizzaSize>("MD");
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!pizza) return null;

  const sizePrice = pizza.basePrice * SIZE_MULTIPLIER[size];
  const extrasTotal = extras.reduce((s, name) => {
    const e = EXTRA_OPTIONS.find((o) => o.name === name);
    return s + (e?.price || 0);
  }, 0);
  const unitPrice = sizePrice + extrasTotal;
  const total = unitPrice * qty;

  const toggleExtra = (name: string) => {
    setExtras((prev) => (prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]));
  };

  const handleAdd = () => {
    addToCart({ name: pizza.name, basePrice: pizza.basePrice, image: pizza.image, size, extras });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      setIsOpen(true);
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-foreground/40 backdrop-blur-md z-[60] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-background rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
        >
          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
            <motion.img
              src={pizza.image}
              alt={pizza.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-4 left-6"
            >
              <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                {pizza.tag}
              </span>
            </motion.div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title & rating */}
            <div>
              <h2 className="font-display text-3xl font-bold">{pizza.name}</h2>
              <p className="text-muted-foreground mt-1">{pizza.desc}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-accent">★</span>
                <span className="font-semibold text-sm">{pizza.rating}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-3">Choose Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["SM", "MD", "XXL"] as PizzaSize[]).map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSize(s)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
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
                    <div className="font-bold text-primary mt-1">
                      ${(pizza.basePrice * SIZE_MULTIPLIER[s]).toFixed(2)}
                    </div>
                    {size === s && (
                      <motion.div
                        layoutId="size-indicator"
                        className="absolute inset-0 rounded-2xl border-2 border-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-3">Add Extras</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EXTRA_OPTIONS.map((extra) => {
                  const selected = extras.includes(extra.name);
                  const isGarlic = extra.name === "Extra Garlic";
                  return (
                    <motion.button
                      key={extra.name}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => toggleExtra(extra.name)}
                      className={`relative p-3 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                        selected
                          ? isGarlic
                            ? "border-accent bg-accent/15 shadow-lg shadow-accent/20"
                            : "border-primary bg-primary/10 shadow-lg shadow-primary/15"
                          : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      {/* Garlic glow effect */}
                      {isGarlic && selected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent pointer-events-none"
                        />
                      )}
                      {isGarlic && selected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute top-1 right-1"
                        >
                          <Sparkles className="w-4 h-4 text-accent" />
                        </motion.div>
                      )}
                      <div className="relative z-10 flex items-center gap-2">
                        <motion.span
                          animate={selected ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                          transition={{ duration: 0.5 }}
                          className="text-xl"
                        >
                          {extra.icon}
                        </motion.span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs truncate">{extra.name}</div>
                          <div className="text-xs text-primary font-bold">+${extra.price.toFixed(2)}</div>
                        </div>
                      </div>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                        >
                          <span className="text-[10px] font-bold">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Add */}
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
                onClick={handleAdd}
                className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/25 flex items-center justify-center gap-3"
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
                      Add ${total.toFixed(2)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PizzaDetailModal;
