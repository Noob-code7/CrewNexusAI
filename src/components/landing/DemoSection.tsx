import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_SCENARIOS, type DemoScenario } from "@/types";
import { ArrowRight, Mic, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DemoSection = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScenarioClick = (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    setInputText(scenario.input);
  };

  const handleTryDemo = () => {
    if (inputText.trim()) {
      // Navigate to dashboard with the input
      navigate("/dashboard", { state: { initialMessage: inputText } });
    }
  };

  return (
    <section id="demo-section" className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See the Magic in Your Language
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try typing a sales lead in Hindi, Tamil, or Bengali. Watch our AI understand,
            analyze, and prepare your response.
          </p>
        </motion.div>

        {/* Demo scenario bubbles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {DEMO_SCENARIOS.map((scenario, index) => (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleScenarioClick(scenario)}
              className={`group relative px-4 py-3 rounded-2xl border-2 transition-all duration-300 text-left ${
                selectedScenario?.id === scenario.id
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {scenario.language.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">{scenario.titleRegional}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2 max-w-[200px]">
                    {scenario.input}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {selectedScenario?.id === scenario.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </motion.div>

        {/* Main demo input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-2 border-border shadow-xl overflow-hidden">
            <CardContent className="p-0">
              {/* Input area */}
              <div className="p-4 md:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-saffron flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Type a Sales Lead</h3>
                    <p className="text-sm text-muted-foreground">
                      In any language — we'll detect and analyze automatically
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Example: भैया, 100 किलो चावल कल तक चाहिए..."
                    className="min-h-[120px] resize-none pr-12 text-base border-2 focus:border-primary transition-colors"
                  />
                  <button
                    className="absolute right-3 bottom-3 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    title="Voice input"
                  >
                    <Mic className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex items-center justify-between p-4 md:p-6 pt-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs">
                    🇮🇳 Auto-detect
                  </span>
                  <span className="hidden sm:inline">Hindi, Tamil, Bengali, Telugu & 6 more</span>
                </div>

                <Button
                  onClick={handleTryDemo}
                  disabled={!inputText.trim() || isProcessing}
                  className="gradient-saffron text-primary-foreground gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Try Demo
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* What happens next hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Language Detection</span>
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span>Sales Simulation</span>
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Cash Flow</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
