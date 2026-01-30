import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadAnalysis, InvoiceData, SupportedLanguage } from "@/types";
import { 
  IndianRupee, 
  TrendingUp, 
  FileText, 
  Download,
  MessageCircle,
  Calendar,
  AlertTriangle,
  QrCode,
  Clock
} from "lucide-react";
import InvoiceGenerator from "./InvoiceGenerator";

interface ResultsPanelProps {
  analysis: LeadAnalysis | null;
  isProcessing: boolean;
}

const ResultsPanel = ({ analysis, isProcessing }: ResultsPanelProps) => {
  const [showInvoice, setShowInvoice] = useState(false);

  if (!analysis && !isProcessing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <IndianRupee className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Results & Actions</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Cash flow predictions and invoice generation will appear here
        </p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl gradient-saffron flex items-center justify-center mb-4"
        >
          <IndianRupee className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h3 className="font-semibold text-lg mb-2">Calculating...</h3>
        <p className="text-sm text-muted-foreground">
          Predicting cash flow and preparing documents
        </p>
      </div>
    );
  }

  const cashFlow = analysis!.cashFlow;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <AnimatePresence mode="wait">
        {showInvoice ? (
          <motion.div
            key="invoice"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowInvoice(false)}
              className="mb-4"
            >
              ← Back to Results
            </Button>
            <InvoiceGenerator analysis={analysis!} />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Cash Flow Prediction */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-success/5">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  Cash Flow Prediction
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Total amount with animation */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center mb-6"
                >
                  <div className="text-xs text-muted-foreground mb-1">Expected Total</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl font-bold text-success flex items-center justify-center gap-1"
                  >
                    <IndianRupee className="w-8 h-8" />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {cashFlow.totalAmount.toLocaleString()}
                    </motion.span>
                  </motion.div>
                </motion.div>

                {/* Payment timeline */}
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Payment Timeline
                  </div>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    
                    {cashFlow.payments.map((payment, index) => {
                      const methodColors = {
                        upi: 'bg-success',
                        cash: 'bg-warning',
                        cheque: 'bg-accent',
                        credit: 'bg-primary',
                      };
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.15 }}
                          className="relative pl-10 pb-4"
                        >
                          <div className={`absolute left-2 top-1 w-5 h-5 rounded-full ${methodColors[payment.method]} flex items-center justify-center`}>
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                          
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">
                                {formatCurrency(payment.amount)}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                                payment.method === 'upi' ? 'bg-success/10 text-success' :
                                payment.method === 'cash' ? 'bg-warning/10 text-warning-foreground' :
                                payment.method === 'cheque' ? 'bg-accent/10 text-accent' :
                                'bg-primary/10 text-primary'
                              }`}>
                                {payment.method}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {payment.expectedDate.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                              <span className="ml-2">({payment.probability}% likely)</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Risk factors */}
                {cashFlow.riskFactors.length > 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-2 text-warning-foreground text-xs font-medium mb-2">
                      <AlertTriangle className="w-3 h-3" />
                      Risk Factors
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {cashFlow.riskFactors.map((risk, i) => (
                        <li key={i}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Document Generator */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Document Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowInvoice(true)}
                  className="w-full gradient-saffron text-primary-foreground"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate GST Invoice
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <QrCode className="w-3 h-3 mr-1" />
                    UPI QR Code
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2 text-success" />
                  Send WhatsApp Reply
                </Button>
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <Calendar className="w-4 h-4 mr-2 text-accent" />
                  Schedule Follow-up
                </Button>
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <IndianRupee className="w-4 h-4 mr-2 text-primary" />
                  Connect to Bank
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsPanel;
