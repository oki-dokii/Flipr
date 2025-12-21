import { ArrowRight, Package, TrendingDown, Leaf, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] pt-16 overflow-hidden bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,191,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,191,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center mx-auto mb-8">
            <Truck className="w-10 h-10 text-white" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Truck Loading
            <span className="block text-gradient mt-2">Optimization System</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered platform to optimize truck loads, reduce costs, and minimize carbon emissions.
            Connect warehouses with the right trucks for every shipment.
          </p>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/calculator"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-teal to-cyan text-white font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              Quick Calculator
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-teal/30 text-muted-foreground">
              <span>or click <strong className="text-teal">Get Started</strong> to sign up</span>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal/20 to-cyan/20 flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-teal" />
              </div>
              <div className="text-2xl font-bold text-teal mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Capacity Utilization</div>
              <p className="text-xs text-muted-foreground mt-2">Maximize every truck's load capacity</p>
            </div>

            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-6 h-6 text-cyan" />
              </div>
              <div className="text-2xl font-bold text-cyan mb-2">↓ 25%</div>
              <div className="text-sm text-muted-foreground">Fewer Trucks Needed</div>
              <p className="text-xs text-muted-foreground mt-2">Reduce fleet costs significantly</p>
            </div>

            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-500 mb-2">↓ 40%</div>
              <div className="text-sm text-muted-foreground">Carbon Reduction</div>
              <p className="text-xs text-muted-foreground mt-2">Eco-friendly logistics optimization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />
    </section>
  );
};

export default HeroSection;
