import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LeadAnalysis } from "@/types";
import { 
  Globe, 
  Target, 
  TrendingUp, 
  Check, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Languages,
  MapPin,
  Package
} from "lucide-react";

interface SimulationPanelProps {
  analysis: LeadAnalysis | null;
  isProcessing: boolean;
}

const SimulationPanel = ({ analysis, isProcessing }: SimulationPanelProps) => {
  // Processing steps for visualization
  const processingSteps = [
    { id: 'detect', label: 'Detecting Language', icon: Languages },
    { id: 'region', label: 'Analyzing Region', icon: MapPin },
    { id: 'entities', label: 'Extracting Entities', icon: Package },
    { id: 'simulate', label: 'Running Simulations', icon: Target },
  ];

  if (!analysis && !isProcessing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Target className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Sales Simulation</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Send a message to see AI analyze and simulate 3 different sales approaches
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Processing visualization */}
      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  AI Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {processingSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        backgroundColor: ['hsl(var(--muted))', 'hsl(var(--primary))', 'hsl(var(--success))']
                      }}
                      transition={{ duration: 1, delay: index * 0.3 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <step.icon className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{step.label}</div>
                      <Progress 
                        value={100} 
                        className="h-1 mt-1"
                      />
                    </div>
                    <Check className="w-4 h-4 text-success" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis results */}
      {analysis && !isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Language & Region Detection */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Context Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Language</div>
                  <div className="font-medium capitalize">{analysis.detectedLanguage === 'hi' ? 'Hindi' : analysis.detectedLanguage === 'ta' ? 'Tamil' : analysis.detectedLanguage === 'bn' ? 'Bengali' : 'English'}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Region</div>
                  <div className="font-medium">{analysis.region}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Industry</div>
                  <div className="font-medium">{analysis.industry}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Total Value</div>
                  <div className="font-medium text-success">₹{analysis.entities.totalValue.toLocaleString()}</div>
                </div>
              </div>

              {/* Entities */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">Extracted Items</div>
                <div className="space-y-2">
                  {analysis.entities.products.map((product, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{product.name} ({product.nameEnglish})</span>
                      <span className="text-muted-foreground">
                        {product.quantity} {product.unit} × ₹{product.unitPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales Simulations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Sales Simulations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.simulations.map((sim, index) => (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    analysis.recommendedApproach === sim.id
                      ? 'border-success bg-success/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{sim.approach}</h4>
                        {analysis.recommendedApproach === sim.id && (
                          <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{sim.description}</p>
                    </div>
                  </div>

                  {/* Win probability bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Win Probability</span>
                      <span className="font-bold text-foreground">{sim.winProbability}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sim.winProbability}%` }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        className={`h-full rounded-full ${
                          sim.winProbability >= 70 
                            ? 'bg-success' 
                            : sim.winProbability >= 50 
                            ? 'bg-warning' 
                            : 'bg-destructive'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Vernacular response */}
                  <div className="p-3 rounded-lg bg-muted/50 mb-3">
                    <div className="text-xs text-muted-foreground mb-1">Suggested Response</div>
                    <p className="text-sm">{sim.vernacularResponse}</p>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      {sim.pros.map((pro, i) => (
                        <div key={i} className="flex items-center gap-1 text-success">
                          <Check className="w-3 h-3" />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      {sim.cons.map((con, i) => (
                        <div key={i} className="flex items-center gap-1 text-destructive">
                          <AlertCircle className="w-3 h-3" />
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SimulationPanel;
