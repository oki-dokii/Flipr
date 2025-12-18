import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Scene3DHero = lazy(() => import("./Scene3D/Scene3DHero"));

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* 3D Scene */}
      <Suspense
        fallback={
          <div className="w-full h-[80vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal" />
          </div>
        }
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Scene3DHero />
        </motion.div>
      </Suspense>

      {/* Trust badges below the 3D scene */}
      <div className="container mx-auto px-4 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="pt-8 border-t border-white/10"
        >
          <p className="text-sm text-muted-foreground mb-4 text-center">Trusted by logistics leaders</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            {["DHL", "FedEx", "Maersk", "UPS"].map((brand, index) => (
              <motion.span
                key={brand}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="text-lg font-semibold"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
