import { Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-slate-950/80">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">LoadOptimize</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered truck loading optimization for sustainable logistics.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/#features" className="hover:text-teal transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-teal transition-colors">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-teal transition-colors">Integrations</Link></li>
              <li><Link to="/api-docs" className="hover:text-teal transition-colors">API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-teal transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-teal transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-teal transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-teal transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-teal transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-teal transition-colors">Terms</Link></li>
              <li><Link to="/security" className="hover:text-teal transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 LoadOptimize. All rights reserved. Built for Flipr Hackathon 30.1.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/oki-dokii/Flipr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
