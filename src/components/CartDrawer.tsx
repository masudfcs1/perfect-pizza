import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, getItemPrice, EXTRA_OPTIONS, SIZE_LABELS } from "./CartContext";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, totalItems, totalPrice, setCheckoutOpen } = useCart();

  const handleCheckout = () => {
    setIsOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-bold">Your Cart</h2>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Your cart is empty</p>
                    <p className="text-muted-foreground/60 text-sm mt-1">Add some delicious pizzas!</p>
                  </motion.div>
                ) : (
                  items.map((item) => {
                    const price = getItemPrice(item);
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, scale: 0.8 }}
                        className="bg-card rounded-2xl p-4 border border-border space-y-3"
                      >
                        <div className="flex gap-3">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-semibold text-sm truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                                {item.size}
                              </span>
                              <span className="text-xs text-muted-foreground">{SIZE_LABELS[item.size]}</span>
                            </div>
                            <p className="text-primary font-bold text-sm mt-1">${price.toFixed(2)}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.id)}
                            className="self-start p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Extras */}
                        {item.extras.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.extras.map((extraName) => {
                              const extra = EXTRA_OPTIONS.find((e) => e.name === extraName);
                              return (
                                <span
                                  key={extraName}
                                  className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent-foreground font-medium flex items-center gap-1"
                                >
                                  {extra?.icon} {extraName} +${extra?.price.toFixed(2)}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                          <span className="font-display font-bold text-primary">
                            ${(price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-6 border-t border-border space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Total</span>
                  <span className="font-display text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
