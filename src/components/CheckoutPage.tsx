import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, User, CreditCard, Banknote, ArrowLeft, CheckCircle2, Truck } from "lucide-react";
import { useCart, getItemPrice, EXTRA_OPTIONS, SIZE_LABELS } from "./CartContext";

type PaymentMethod = "online" | "cash";

const CheckoutPage = () => {
  const { items, totalPrice, checkoutOpen, setCheckoutOpen, setIsOpen } = useCart();
  const [step, setStep] = useState<"delivery" | "payment" | "confirmed">("delivery");
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  if (!checkoutOpen) return null;

  const handleBack = () => {
    if (step === "payment") setStep("delivery");
    else { setCheckoutOpen(false); setIsOpen(true); }
  };

  const handleConfirm = () => {
    setStep("confirmed");
  };

  const deliveryFee = 3.99;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/40 backdrop-blur-md z-[70] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="relative bg-background rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              {step !== "confirmed" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBack}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              )}
              <h2 className="font-display text-xl font-bold">
                {step === "delivery" && "Delivery Details"}
                {step === "payment" && "Payment"}
                {step === "confirmed" && "Order Confirmed!"}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setCheckoutOpen(false); setStep("delivery"); }}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Step indicator */}
          {step !== "confirmed" && (
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2">
                {["delivery", "payment"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <motion.div
                      animate={{ scale: step === s ? 1.1 : 1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step === s ? "bg-primary text-primary-foreground" : i === 0 && step === "payment" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </motion.div>
                    {i < 1 && <div className={`flex-1 h-0.5 rounded ${step === "payment" ? "bg-primary/30" : "bg-muted"}`} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            <AnimatePresence mode="wait">
              {/* DELIVERY STEP */}
              {step === "delivery" && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary" /> Full Name
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-primary" /> Phone Number
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="123 Pizza Street, Apt 4B..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Special Notes (optional)</label>
                    <input
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Ring doorbell twice..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("payment")}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25"
                  >
                    Continue to Payment
                  </motion.button>
                </motion.div>
              )}

              {/* PAYMENT STEP */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Order Summary */}
                  <div className="space-y-3">
                    <h3 className="font-display font-semibold">Order Summary</h3>
                    {items.map((item) => {
                      const price = getItemPrice(item);
                      return (
                        <div key={item.id} className="flex gap-3 bg-card rounded-xl p-3 border border-border">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{item.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">{item.size}</span>
                              {item.extras.map((e) => {
                                const ext = EXTRA_OPTIONS.find((o) => o.name === e);
                                return <span key={e} className="text-[10px]">{ext?.icon}</span>;
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">${(price * item.quantity).toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">×{item.quantity}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-display font-semibold mb-3">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPayment("online")}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${
                          payment === "online"
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
                            : "border-border bg-card hover:border-primary/30"
                        }`}
                      >
                        <CreditCard className={`w-8 h-8 mx-auto mb-2 ${payment === "online" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="font-bold text-sm">Pay Online</div>
                        <div className="text-xs text-muted-foreground">Card / UPI</div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPayment("cash")}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${
                          payment === "cash"
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
                            : "border-border bg-card hover:border-primary/30"
                        }`}
                      >
                        <Banknote className={`w-8 h-8 mx-auto mb-2 ${payment === "cash" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="font-bold text-sm">Cash</div>
                        <div className="text-xs text-muted-foreground">On Delivery</div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-card rounded-2xl p-4 border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-display text-xl font-bold text-primary">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirm}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25"
                  >
                    {payment === "online" ? "Pay & Place Order" : "Place Order"}
                  </motion.button>
                </motion.div>
              )}

              {/* CONFIRMED */}
              {step === "confirmed" && (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-primary mx-auto" />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-2xl font-bold">Order Placed! 🎉</h3>
                    <p className="text-muted-foreground mt-2">Your delicious pizza is being prepared</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card rounded-2xl p-6 border border-border inline-flex items-center gap-4"
                  >
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Truck className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div className="text-left">
                      <div className="font-bold text-sm">Estimated Delivery</div>
                      <div className="text-primary font-display text-lg font-bold">25-35 min</div>
                    </div>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setCheckoutOpen(false); setStep("delivery"); }}
                    className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25"
                  >
                    Done
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutPage;
