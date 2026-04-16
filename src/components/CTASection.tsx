import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section id="order" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-semibold text-sm tracking-[0.3em] uppercase mb-4">
            Ready to Order?
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Get it <span className="text-gradient">Hot & Fresh</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Order online for delivery or pick up in-store. Fresh from our oven to your door in under 30 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity glow"
            >
              🍕 Order Delivery
            </a>
            <a
              href="#"
              className="px-10 py-4 rounded-full bg-card border border-border font-semibold text-lg text-foreground transition-all hover:bg-secondary"
            >
              📞 Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
