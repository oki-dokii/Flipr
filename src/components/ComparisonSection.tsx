import { Check, X } from "lucide-react";
import { ComparisonScene3D } from "./Scene3D/ComparisonScene3D";

const ComparisonSection = () => {
  return (
    <section id="results" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsla(175,80%,50%,0.08)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See the{' '}
            <span className="text-gradient">Difference</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Compare traditional loading methods with our AI-optimized approach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before */}
          <div className="glass-card p-8 border-destructive/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">Traditional Loading</h3>
            </div>

            {/* Visual representation */}
            {/* Visual representation */}
            <div className="relative h-64 bg-navy-medium rounded-xl mb-6 overflow-hidden border border-white/5">
              <ComparisonScene3D mode="inefficient" />
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-medium backdrop-blur-sm">
                58% utilized
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <X className="w-4 h-4 text-destructive" />
                Manual planning takes hours
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <X className="w-4 h-4 text-destructive" />
                Wasted space costs money
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <X className="w-4 h-4 text-destructive" />
                Higher emissions per shipment
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <X className="w-4 h-4 text-destructive" />
                Safety compliance guesswork
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="glass-card p-8 border-green/30 glow-green hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green" />
              </div>
              <h3 className="text-xl font-semibold">LoadOptimize</h3>
            </div>

            {/* Visual representation */}
            <div className="relative h-64 bg-navy-medium rounded-xl mb-6 overflow-hidden border border-white/5">
              <ComparisonScene3D mode="optimized" />
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-green/20 text-green text-sm font-medium backdrop-blur-sm">
                94% utilized
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green" />
                Instant AI optimization
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green" />
                Maximum space utilization
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green" />
                32% lower CO₂ emissions
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green" />
                Guaranteed safety compliance
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
