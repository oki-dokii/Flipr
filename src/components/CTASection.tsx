import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsla(175,80%,50%,0.15)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-teal/30 mb-8">
            <Sparkles className="w-4 h-4 text-teal" />
            <span className="text-sm text-muted-foreground">Limited Time: 30-Day Free Trial</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Optimize{' '}
            <span className="text-gradient">Your Fleet?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join 500+ logistics companies already saving millions and reducing their carbon footprint with LoadOptimize.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => navigate('/login')}
            >
              Schedule Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-teal">500+</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-green">2M+</div>
              <div className="text-sm text-muted-foreground">Loads Optimized</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-cyan">$50M+</div>
              <div className="text-sm text-muted-foreground">Saved Annually</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
