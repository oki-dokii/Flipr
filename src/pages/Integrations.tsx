import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Cpu, Database, Share2, Layers, Server } from "lucide-react";

const Integrations = () => {
  const integrations = [
    {
      name: "SAP Supply Chain Management",
      category: "Enterprise ERP",
      desc: "Automatically sync warehouse orders, bill of materials, and shipping schedules in real-time.",
      icon: Database,
    },
    {
      name: "Oracle Warehouse Management (WMS)",
      category: "WMS Solution",
      desc: "Push optimized load configurations and pallet allocations directly to forklift terminals.",
      icon: Server,
    },
    {
      name: "Salesforce Logistics Cloud",
      category: "CRM & Dispatch",
      desc: "Trigger dispatch updates and live customer tracking URLs straight from Salesforce workflows.",
      icon: Share2,
    },
    {
      name: "Samsara & Geotab Telematics",
      category: "Fleet Telematics",
      desc: "Fetch live truck location, remaining weight capacity, and driver HOS (Hours of Service).",
      icon: Cpu,
    },
    {
      name: "OpenStreetMap & OSRM Engine",
      category: "Routing & Geocoding",
      desc: "Built-in open source mapping service for turn-by-turn routing and exact distance calculations.",
      icon: Layers,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Seamless <span className="text-gradient">Integrations</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect LoadOptimize with your existing WMS, ERP, and telematics systems with our plug-and-play APIs and native connectors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {integrations.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="glass-card p-6 border border-white/10 hover:border-teal/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-teal" />
                  </div>
                  <span className="text-xs text-teal font-semibold uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-xl font-bold mt-1 mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Integrations;
