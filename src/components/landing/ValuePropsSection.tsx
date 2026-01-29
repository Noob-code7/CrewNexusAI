import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, TrendingUp, FileText, IndianRupee, Languages, Zap } from "lucide-react";

const valueProps = [
  {
    icon: Languages,
    title: "Speaks Your Language",
    titleHi: "आपकी भाषा बोलता है",
    description:
      "Process leads in Hindi, Tamil, Bengali & English. Cultural context included — understands regional negotiation styles.",
    color: "primary",
    features: ["Auto language detection", "Regional dialects", "Cultural context"],
  },
  {
    icon: TrendingUp,
    title: "Predicts Cash Flow",
    titleHi: "कैश फ्लो की भविष्यवाणी",
    description:
      "Know exactly when money will arrive. UPI in 1 day, Cheque in 7 days, Credit in 15+ days — with Indian business cycles.",
    color: "secondary",
    features: ["Payment timeline", "Festival adjustments", "Risk factors"],
  },
  {
    icon: FileText,
    title: "Generates Documents",
    titleHi: "दस्तावेज़ बनाता है",
    description:
      "GST-compliant invoices in seconds. Bilingual output, UPI QR codes, and one-click WhatsApp sharing.",
    color: "accent",
    features: ["GST compliant", "UPI QR codes", "WhatsApp sharing"],
  },
];

const ValuePropsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4"
          >
            <Zap className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Designed for India</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From Lead to Cash, Simplified
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            CrewNexusAI understands the Indian SME ecosystem — festivals, payment cycles,
            regional preferences, and vernacular communication.
          </p>
        </motion.div>

        {/* Value proposition cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden relative">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                      prop.color === "primary"
                        ? "bg-primary/10 text-primary"
                        : prop.color === "secondary"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    <prop.icon className="w-7 h-7" />
                  </motion.div>

                  <CardTitle className="text-xl md:text-2xl">
                    {prop.title}
                    <span className="block text-base font-normal text-muted-foreground mt-1">
                      {prop.titleHi}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  <p className="text-muted-foreground mb-6">{prop.description}</p>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-2">
                    {prop.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>

                {/* Decorative corner */}
                <div
                  className={`absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-10 ${
                    prop.color === "primary"
                      ? "bg-primary"
                      : prop.color === "secondary"
                      ? "bg-secondary"
                      : "bg-accent"
                  }`}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: IndianRupee, value: "₹20,000+", label: "Avg monthly savings" },
              { icon: TrendingUp, value: "25%", label: "Higher conversion rate" },
              { icon: Globe, value: "4+", label: "Indian languages" },
              { icon: Zap, value: "< 3 sec", label: "Response time" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValuePropsSection;
