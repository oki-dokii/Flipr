import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Lightbulb, BarChart3, DollarSign, Star, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', url: '#hero', icon: Home },
    { name: 'Features', url: '#features', icon: Lightbulb },
    { name: 'Results', url: '#results', icon: BarChart3 }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-6">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <NavBar items={navItems} className="mx-auto" />

        <div className="absolute right-4 top-6 flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-teal to-cyan"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="hidden md:flex"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-teal to-cyan"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
