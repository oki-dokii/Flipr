import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShieldCheck } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass-card p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-teal" />
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xs text-muted-foreground mb-6">Last Updated: July 30, 2026</p>

            <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
                <p>
                  We collect information necessary to provide logistics optimization services, including warehouse facility coordinates, shipment dimensions (weight, volume, quantity), truck fleet specifications, and contact email addresses during account registration.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Information</h2>
                <p>
                  Data is processed strictly for evaluating heuristic truck matching models, calculating volumetric utilization, generating CO2 savings metrics, and facilitating dispatch booking transactions between warehouses and verified truck dealers.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground mb-2">3. Data Security & Storage</h2>
                <p>
                  All credentials and session data are protected using bcrypt password hashing and stateless JWT tokens. We do not sell or rent customer operational data to third-party advertisers.
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

export default Privacy;
