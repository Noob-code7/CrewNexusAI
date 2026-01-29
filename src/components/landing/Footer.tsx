import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg gradient-saffron flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CN</span>
            </div>
            <span className="font-bold text-lg">CrewNexusAI</span>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for Indian SMEs
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            © 2025 CrewNexusAI. All rights reserved.
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
