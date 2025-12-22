import { Boxes, BarChart3, Route, AlertTriangle, Zap, Cloud } from "lucide-react";
import { motion } from "framer-motion";
import { GlowingEffect } from "./ui/glowing-effect";
import { cn } from "../lib/utils";

const features = [
  {
    icon: Boxes,
    title: "3D Load Planning",
    description: "AI-powered algorithms calculate optimal cargo placement in real-time, maximizing every cubic meter of space.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Monitor utilization rates, track efficiency improvements, and visualize savings across your entire fleet.",
  },
  {
    icon: Route,
    title: "Route Integration",
    description: "Seamlessly integrates with route optimization to plan loads based on delivery sequence and priorities.",
  },
  {
    icon: AlertTriangle,
    title: "Safety Compliance",
    description: "Automatic weight distribution checks prevent overloading and ensure axle weight regulations are met.",
  },
  {
    icon: Zap,
    title: "Instant Optimization",
    description: "Get loading plans in seconds, not hours. Our engine processes thousands of configurations instantly.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Access your data anywhere. Real-time sync across warehouse teams, drivers, and management.",
  },
];

interface GridItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const GridItem = ({ icon: Icon, title, description }: GridItemProps) => {
  return (
    <div className="min-h-[14rem] list-none relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-navy-medium/80 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] p-6">
        <div className="relative flex flex-1 flex-col justify-between gap-3">
          <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted/20 p-2">
            <Icon className="h-5 w-5 text-teal" />
          </div>
          <div className="space-y-3">
            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
              {title}
            </h3>
            <h2 className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
              {description}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,hsla(142,70%,45%,0.05)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Smart Features for{' '}
            <span className="text-gradient-green">Smarter Logistics</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to transform your cargo operations and achieve maximum efficiency.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GridItem
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeaturesSection;
