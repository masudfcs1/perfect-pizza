import { motion } from "framer-motion";
import meatLovers from "@/assets/pizza-meat-lovers.jpg";

const SpecialsSection = () => {
  return (
    <section id="specials" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-border shadow-xl shadow-primary/5"
        >
          <div className="flex-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              🔥 Weekly Special
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              The <span className="text-gradient">Inferno</span> Meat Lovers
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Our most loaded pizza ever — pepperoni, Italian sausage, smoked bacon, ground beef, 
              and a secret chili oil drizzle on a thick, golden crust. Limited time only.
            </p>
            <div className="flex items-center gap-6 mb-8">
              <div>
                <span className="text-muted-foreground line-through text-lg">$24</span>
                <span className="font-display text-4xl font-bold text-gradient ml-3">$19</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-basil/10 text-basil text-xs font-bold">
                SAVE 20%
              </span>
            </div>
            <a
              href="#order"
              className="inline-block px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity glow"
            >
              Order This Special
            </a>
          </div>

          <motion.div
            whileHover={{ rotate: 3, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex-1 max-w-md"
          >
            <img
              src={meatLovers}
              alt="Meat lovers pizza special"
              loading="lazy"
              width={800}
              height={800}
              className="w-full rounded-2xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialsSection;
