import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass-card p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-teal" />
              <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xs text-muted-foreground mb-6">Last Updated: July 30, 2026</p>

            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-2">1. Agreement to Terms</h2>
                <p>
                  By accessing or using LoadOptimize, you agree to be bound by these Terms of Service. If you are registering on behalf of a warehouse entity or truck dealership, you confirm you have authority to bind that entity.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-2">2. Load Calculation Accuracy</h2>
                <p>
                  The LoadOptimize heuristic algorithm provides estimated spatial and weight optimizations based on user-inputted payload dimensions. Users remain responsible for verifying physical axle limits and transport safety regulations prior to dispatch.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-2">3. Service Commitments</h2>
                <p>
                  We strive to maintain continuous platform availability. Maintenance windows and algorithm updates are communicated via the platform notifications dashboard.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
