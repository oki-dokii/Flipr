import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Check, Zap, Shield, Building } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter Warehouse",
      price: "$49",
      period: "/month",
      description: "Perfect for single warehouses starting load optimization.",
      features: [
        "Up to 100 shipments / month",
        "Basic 3D Load Optimization",
        "Haversine & OSRM Routing",
        "Email Support",
        "CO2 Emissions Calculator"
      ],
      icon: Zap,
      popular: false,
      buttonText: "Start Free Trial",
    },
    {
      name: "Professional Fleet",
      price: "$199",
      period: "/month",
      description: "For growing logistics operators & multi-truck fleets.",
      features: [
        "Unlimited Shipments & Trucks",
        "Advanced Multi-parameter AI Matching",
        "Real-time GPS Tracking",
        "Priority Support (24/7)",
        "Automated CO2 Audit Reports",
        "Custom ERP Export (CSV/JSON)"
      ],
      icon: Shield,
      popular: true,
      buttonText: "Get Started",
    },
    {
      name: "Enterprise Global",
      price: "Custom",
      period: "",
      description: "For enterprise supply chains requiring custom SLA & integrations.",
      features: [
        "Dedicated Database & Single-Tenant Hosting",
        "Custom SAP / Oracle / Salesforce WMS Connectors",
        "Custom Heuristic Algorithm Tuning",
        "Dedicated Success Manager",
        "SLA Guarantee 99.99%"
      ],
      icon: Building,
      popular: false,
      buttonText: "Contact Sales",
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Flexible <span className="text-gradient">Pricing Plans</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that best fits your warehouse or truck dealer operation. Transparent pricing with zero hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`glass-card p-8 relative flex flex-col justify-between ${
                    plan.popular ? "border-teal glow-teal scale-105" : "border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal to-cyan text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-teal" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8 text-sm">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-teal flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/register"
                    className={`w-full py-3 rounded-lg font-semibold text-center transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-teal to-cyan text-white hover:opacity-90"
                        : "bg-white/10 hover:bg-white/20 text-foreground"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
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

export default Pricing;
