import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  const jobs = [
    {
      title: "Senior Fullstack Engineer (React & Node.js)",
      type: "Full-Time",
      location: "Remote / Hybrid",
      dept: "Engineering",
      desc: "Build real-time optimization dashboards, 3D WebGL packing visualizers, and scalable Express backends.",
    },
    {
      title: "Logistics Optimization Researcher (OR / Heuristics)",
      type: "Full-Time",
      location: "Remote",
      dept: "Data Science",
      desc: "Design and implement high-performance 3D bin-packing and multi-depot vehicle routing algorithms.",
    },
    {
      title: "Technical Account Manager - Freight & Logistics",
      type: "Full-Time",
      location: "Mumbai / Bengaluru",
      dept: "Operations",
      desc: "Help enterprise warehouses and regional truck dealers onboard and optimize their daily dispatch.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Help us revolutionize supply chain efficiency and make global freight transportation zero-waste and green.
            </p>
          </div>

          <div className="space-y-6">
            {jobs.map((job, idx) => (
              <div key={idx} className="glass-card p-6 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-teal/50 transition-all">
                <div>
                  <div className="flex items-center gap-3 text-xs text-teal font-semibold mb-2">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.dept}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-teal/10 border border-teal/20">{job.type}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.desc}</p>
                </div>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-lg bg-teal/10 hover:bg-teal/20 border border-teal/30 text-teal font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
