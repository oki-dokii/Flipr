import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Lightbulb, BarChart3, DollarSign, Star } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { name: 'Home', url: '#hero', icon: Home },
    { name: 'Features', url: '#features', icon: Lightbulb },
    { name: 'Results', url: '#results', icon: BarChart3 },
    { name: 'Pricing', url: '#pricing', icon: DollarSign },
    { name: 'Testimonials', url: '#testimonials', icon: Star }
  ];

  return <NavBar items={navItems} className="fixed top-0 pt-6" />;
};

export default Navbar;
