import { motion } from "framer-motion";
import cheeseBurst from "@/assets/pizza-cheese-burst.jpg";

const stats = [
  { value: "900°F", label: "Oven Temperature" },
  { value: "72hr", label: "Dough Fermentation" },
  { value: "15+", label: "Signature Pizzas" },
  { value: "2014", label: "Est. Since" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden glow">
            <img
              src={cheeseBurst}
              alt="Stretchy cheese burst pizza"
              loading="lazy"
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <span className="font-display text-3xl font-bold text-primary-foreground">10+</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-semibold text-sm tracking-[0.3em] uppercase mb-4">
            Our Story
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Born from <span className="text-gradient">Flame</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            What started as a passion project in a tiny Naples kitchen has grown into a 
            movement. We import our flour from Italy, ferment our dough for 72 hours, and 
            fire every pizza in a custom-built stone oven at 900°F. No shortcuts. No compromises. 
            Just honest, fiery pizza.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl p-4 text-center border border-border shadow-sm">
                <div className="font-display text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-muted-foreground text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
