import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Code, Terminal, Key } from "lucide-react";

const ApiDocs = () => {
  const endpoints = [
    {
      method: "POST",
      path: "/api/auth/login",
      desc: "Authenticate warehouse or dealer user and issue JWT bearer token.",
    },
    {
      method: "POST",
      path: "/api/optimize",
      desc: "Run 3D heuristics & multi-parameter scoring to return optimal truck matches.",
    },
    {
      method: "GET",
      path: "/api/trucks",
      desc: "Retrieve available fleet matching capacity, route, or location query.",
    },
    {
      method: "POST",
      path: "/api/bookings",
      desc: "Dispatch booking request from warehouse to truck dealer.",
    },
    {
      method: "GET",
      path: "/api/stats",
      desc: "Fetch aggregated capacity utilization and CO2 savings metrics.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Developer <span className="text-gradient">API & Reference</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Integrate truck optimization algorithms programmatically using our RESTful JSON APIs.
            </p>
          </div>

          {/* Auth section */}
          <div className="glass-card p-6 mb-8 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-teal" />
              <h2 className="text-xl font-bold">Authentication</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              All requests require a valid Bearer token passed in the Authorization header:
            </p>
            <pre className="bg-slate-900 p-4 rounded-lg text-xs font-mono text-cyan overflow-x-auto">
              Authorization: Bearer &lt;YOUR_JWT_TOKEN&gt;
            </pre>
          </div>

          {/* Endpoints section */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-teal" />
              <h2 className="text-xl font-bold">Core REST Endpoints</h2>
            </div>

            {endpoints.map((ep, idx) => (
              <div key={idx} className="glass-card p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                    ep.method === "POST" ? "bg-teal/20 text-teal border border-teal/30" : "bg-cyan/20 text-cyan border border-cyan/30"
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-semibold">{ep.path}</span>
                </div>
                <p className="text-sm text-muted-foreground">{ep.desc}</p>
              </div>
            ))}
          </div>

          {/* Code example */}
          <div className="glass-card p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-5 h-5 text-teal" />
              <h2 className="text-xl font-bold">Example Optimization Payload (JavaScript)</h2>
            </div>
            <pre className="bg-slate-900 p-4 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
{`const response = await fetch('https://loadoptimize.render.com/api/optimize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    weight_kg: 8500,
    volume_m3: 42,
    destination_city: "Mumbai",
    destination_state: "Maharashtra"
  })
});
const data = await response.json();
console.log("Top truck recommendations:", data.recommendations);`}
            </pre>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApiDocs;
