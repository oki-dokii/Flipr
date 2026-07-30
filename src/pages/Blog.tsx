import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const posts = [
    {
      title: "How 3D Bin Packing Algorithms Cut Freight Costs by 28%",
      date: "July 28, 2026",
      author: "Logistics Team",
      category: "Optimization Tech",
      snippet: "Discover how volumetric heuristic scoring maximizes every cubic meter of truck trailer capacity while ensuring axle weight balance.",
    },
    {
      title: "Green Freight: Measuring and Reporting Scope 3 Carbon Reductions",
      date: "July 15, 2026",
      author: "Sustainability Lead",
      category: "Environmental",
      snippet: "How warehouse managers can generate auditable CO2 reporting and achieve corporate ESG goals using automated trip logs.",
    },
    {
      title: "Connecting Warehouses and Fleet Dealers: The Future of Shared Logistics",
      date: "June 30, 2026",
      author: "Supply Chain Analyst",
      category: "Industry Insights",
      snippet: "Why real-time fleet matching platforms are replacing traditional manual broker phone calls in modern supply chains.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              LoadOptimize <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Articles, research, and insights on logistics optimization, AI freight matching, and green supply chains.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <div key={idx} className="glass-card p-6 border border-white/10 flex flex-col justify-between hover:border-teal/50 transition-all">
                <div>
                  <span className="text-xs text-teal font-semibold uppercase tracking-wider mb-2 block">{post.category}</span>
                  <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{post.snippet}</p>
                </div>
                <div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  </div>
                  <Link to="#" className="text-xs font-semibold text-teal hover:underline inline-flex items-center gap-1">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
