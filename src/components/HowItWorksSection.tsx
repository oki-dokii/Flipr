import { Upload, Cpu, Truck, BarChart } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Cargo Data",
    description: "Import your shipment details, dimensions, weights, and delivery priorities.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Optimization",
    description: "Our algorithm analyzes thousands of configurations to find the optimal arrangement.",
  },
  {
    icon: Truck,
    step: "03",
    title: "Load & Ship",
    description: "Follow the visual loading guide to place cargo exactly as planned for maximum efficiency.",
  },
  {
    icon: BarChart,
    step: "04",
    title: "Track & Improve",
    description: "Monitor performance metrics and continuously improve with AI-driven insights.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It{' '}
            <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in minutes. Our streamlined process makes optimization effortless.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal/30 to-transparent" />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={item}
                className="relative text-center group"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl font-bold text-teal/10 group-hover:text-teal/20 transition-colors duration-300">
                  {step.step}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal to-cyan mb-6 shadow-lg shadow-teal/20"
                >
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </motion.div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-teal transition-colors">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
