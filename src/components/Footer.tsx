const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-card py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-display text-2xl font-bold text-gradient mb-4">Inferno Pizza</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Wood-fired artisan pizza, crafted with passion since 2014. 
            Every bite is a journey to Naples.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Hours</h4>
          <div className="text-muted-foreground text-sm space-y-2">
            <p>Mon – Thu: 11am – 10pm</p>
            <p>Fri – Sat: 11am – 12am</p>
            <p>Sunday: 12pm – 9pm</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
          <div className="text-muted-foreground text-sm space-y-2">
            <p>123 Flame Street, Downtown</p>
            <p>hello@infernopizza.com</p>
            <p>(555) 900-FIRE</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-muted-foreground text-xs">
        © 2026 Inferno Pizza. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
