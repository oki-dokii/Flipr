import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Lock, Shield, Server, KeyRound } from "lucide-react";

const Security = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Security & <span className="text-gradient">Compliance</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              How we protect your supply chain data, API keys, and enterprise logistics records.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="glass-card p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Encryption at Rest & In Transit</h3>
              <p className="text-sm text-muted-foreground">
                All network communication uses TLS 1.3 encryption. Internal database payloads and user credentials are cryptographically hashed.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-4">
                <KeyRound className="w-5 h-5 text-cyan" />
              </div>
              <h3 className="text-xl font-bold mb-2">Role-Based Access Control (RBAC)</h3>
              <p className="text-sm text-muted-foreground">
                Strict multi-tenant authorization prevents warehouses from accessing competitor fleet data or unassigned dealer bookings.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Zero API Key Leaks</h3>
              <p className="text-sm text-muted-foreground">
                OpenStreetMap and OSRM integration replaces costly third-party map keys with open-standard geocoding services.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <Server className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Audit Logging</h3>
              <p className="text-sm text-muted-foreground">
                System activities, authorization attempts, and truck optimization queries are logged for admin compliance review.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
