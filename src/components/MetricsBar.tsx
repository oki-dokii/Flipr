import { TrendingUp, Leaf, DollarSign, Shield } from "lucide-react";
import { motion, useInView, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const metrics = [
  {
    icon: TrendingUp,
    value: 94,
    suffix: "%",
    label: "Avg. Utilization",
    color: "text-teal",
  },
  {
    icon: Leaf,
    value: 32,
    prefix: "-",
    suffix: "%",
    label: "CO₂ Reduction",
    color: "text-green",
  },
  {
    icon: DollarSign,
    value: 28,
    suffix: "%",
    label: "Cost Savings",
    color: "text-cyan",
  },
  {
    icon: Shield,
    value: 100,
    suffix: "%",
    label: "Safety Compliance",
    color: "text-accent",
  },
];

const Counter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const springValue = useSpring(0, { bounce: 0, duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
};

const MetricsBar = () => {
  return (
    <section className="py-12 border-y border-white/10 bg-navy-medium/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl -translate-y-1/2 -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl glass mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all duration-300">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className={`text-3xl md:text-5xl font-bold ${metric.color} mb-2`}>
                <Counter value={metric.value} prefix={metric.prefix} suffix={metric.suffix} />
              </div>
              <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsBar;
