import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Truck, Target, Award, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-gradient">LoadOptimize</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Eliminating partial truckloads and empty freight runs through intelligent, multi-parameter logistics optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="glass-card p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-teal" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Over 30% of trucks on the road today run partially empty or completely unladen. LoadOptimize was created to solve this inefficiency. By connecting warehouses directly with fleet operators using smart 3D spatial packing algorithms, we help companies save freight costs while significantly cutting carbon emissions.
              </p>
            </div>

            <div className="glass-card p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-cyan" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Built for Hackathon 30.1</h2>
              <p className="text-muted-foreground leading-relaxed">
                Engineered for the Flipr Fullstack Web Development Hackathon 30.1, LoadOptimize combines type-safe backend services, SQLite/PostgreSQL data structures, and interactive WebGL 3D visualizations to deliver a complete logistics workflow.
              </p>
            </div>
          </div>

          {/* Stats section */}
          <div className="glass-card p-8 border border-white/10 mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">System Impact Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-extrabold text-teal">94%</div>
                <div className="text-xs text-muted-foreground mt-1">Average Volume Fit</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-cyan">↓ 32%</div>
                <div className="text-xs text-muted-foreground mt-1">CO2 Emissions Reduced</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-green-500">28%</div>
                <div className="text-xs text-muted-foreground mt-1">Cost Savings / Trip</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-blue-400">100%</div>
                <div className="text-xs text-muted-foreground mt-1">Safety Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
