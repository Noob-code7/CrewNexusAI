import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Languages, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered for Indian SMEs</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Your AI Business Partner{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Speaks Your Language
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              From sales lead to cash in bank — in{" "}
              <span className="font-semibold text-foreground">Hindi</span>,{" "}
              <span className="font-semibold text-foreground">Tamil</span>,{" "}
              <span className="font-semibold text-foreground">Bengali</span> & 8 more Indian languages
            </motion.p>

            {/* Language showcase */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
            >
              {[
                { lang: "हिन्दी", color: "bg-primary/10 text-primary" },
                { lang: "தமிழ்", color: "bg-secondary/10 text-secondary" },
                { lang: "বাংলা", color: "bg-accent/10 text-accent" },
                { lang: "తెలుగు", color: "bg-primary/10 text-primary" },
                { lang: "मराठी", color: "bg-secondary/10 text-secondary" },
                { lang: "English", color: "bg-muted text-muted-foreground" },
              ].map((item, index) => (
                <motion.span
                  key={item.lang}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${item.color}`}
                >
                  {item.lang}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="gradient-saffron text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Try Free Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-2"
              >
                <Languages className="w-4 h-4 mr-2" />
                Open Dashboard
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border"
            >
              {[
                { value: "4+", label: "Languages" },
                { value: "63M", label: "SMEs in India" },
                { value: "25%", label: "Higher Conversions" },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Animated dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              {/* Mock dashboard header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 text-center text-sm text-muted-foreground">CrewNexusAI Dashboard</div>
              </div>

              {/* Mock chat interface */}
              <div className="p-4 space-y-4 min-h-[300px]">
                {/* User message */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground text-sm">
                    भैया, 50 किलो चावल चाहिए
                  </div>
                </motion.div>

                {/* AI response */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] space-y-2">
                    <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-accent text-accent-foreground text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium">Hindi detected • North India</span>
                      </div>
                      <div className="text-xs opacity-90">
                        Analyzing: 50kg Rice order • Kirana Store
                      </div>
                    </div>

                    {/* Simulation preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 }}
                      className="px-4 py-3 rounded-xl bg-muted/50 border border-border"
                    >
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Best Approach: 80% Win Rate
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "80%" }}
                          transition={{ delay: 2, duration: 0.6 }}
                          className="h-full bg-success rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Mock input */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-background border border-border">
                  <span className="text-sm text-muted-foreground">Type in any language...</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-4 top-20 px-3 py-2 rounded-lg bg-success text-success-foreground text-xs font-medium shadow-lg"
            >
              ₹8,500 Cash Flow ↑
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-4 bottom-32 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium shadow-lg"
            >
              Invoice Generated ✓
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
