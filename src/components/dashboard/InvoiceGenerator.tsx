import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeadAnalysis, InvoiceData, InvoiceItem } from "@/types";
import { Download, MessageCircle, Printer, Edit2 } from "lucide-react";

interface InvoiceGeneratorProps {
  analysis: LeadAnalysis;
}

const InvoiceGenerator = ({ analysis }: InvoiceGeneratorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sellerInfo, setSellerInfo] = useState({
    name: "Your Business Name",
    address: "123 Main Street, City, State - 400001",
    gstin: "27AABCU9603R1ZM",
    phone: "+91 98765 43210",
    upiId: "business@upi",
  });

  const [buyerInfo, setBuyerInfo] = useState({
    name: "Customer Name",
    address: "Customer Address",
    gstin: "",
    phone: "",
  });

  // Generate invoice items from analysis
  const invoiceItems: InvoiceItem[] = useMemo(() => {
    return analysis.entities.products.map((product, index) => ({
      id: `item-${index}`,
      description: product.nameEnglish,
      descriptionRegional: product.name,
      hsnCode: "1006", // Default HSN for rice, would be dynamic
      quantity: product.quantity,
      unit: product.unit,
      rate: product.unitPrice,
      amount: product.quantity * product.unitPrice,
      gstRate: 5, // Default GST rate
    }));
  }, [analysis]);

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const gstAmount = subtotal * 0.05; // 5% GST
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const total = subtotal + gstAmount;

  const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
  const invoiceDate = new Date();
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  // Generate UPI payment link
  const upiLink = `upi://pay?pa=${sellerInfo.upiId}&pn=${encodeURIComponent(sellerInfo.name)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for ${invoiceNumber}`)}`;

  const getRegionalGreeting = () => {
    switch (analysis.detectedLanguage) {
      case 'hi': return 'धन्यवाद! आपके व्यापार के लिए शुक्रिया।';
      case 'ta': return 'நன்றி! உங்கள் வணிகத்திற்கு நன்றி।';
      case 'bn': return 'ধন্যবাদ! আপনার ব্যবসার জন্য ধন্যবাদ।';
      default: return 'Thank you for your business!';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">GST Invoice</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-primary">{sellerInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{sellerInfo.address}</p>
            <p className="text-sm text-muted-foreground">GSTIN: {sellerInfo.gstin}</p>
            <p className="text-sm text-muted-foreground">Phone: {sellerInfo.phone}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">TAX INVOICE</div>
            <div className="text-sm text-muted-foreground mt-1">
              <div>Invoice #: <span className="font-mono">{invoiceNumber}</span></div>
              <div>Date: {invoiceDate.toLocaleDateString('en-IN')}</div>
              <div>Due: {dueDate.toLocaleDateString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Bill To:</h3>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={buyerInfo.name}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                placeholder="Customer Name"
              />
              <Input
                value={buyerInfo.address}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })}
                placeholder="Customer Address"
              />
              <Input
                value={buyerInfo.gstin}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, gstin: e.target.value })}
                placeholder="GSTIN (optional)"
              />
            </div>
          ) : (
            <div>
              <p className="font-medium">{buyerInfo.name}</p>
              <p className="text-sm text-muted-foreground">{buyerInfo.address}</p>
              {buyerInfo.gstin && (
                <p className="text-sm text-muted-foreground">GSTIN: {buyerInfo.gstin}</p>
              )}
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Item</th>
                <th className="text-center p-3 font-medium">HSN</th>
                <th className="text-center p-3 font-medium">Qty</th>
                <th className="text-right p-3 font-medium">Rate</th>
                <th className="text-right p-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="p-3">
                    <div>{item.description}</div>
                    {item.descriptionRegional && (
                      <div className="text-xs text-muted-foreground">{item.descriptionRegional}</div>
                    )}
                  </td>
                  <td className="text-center p-3 font-mono text-muted-foreground">{item.hsnCode}</td>
                  <td className="text-center p-3">{item.quantity} {item.unit}</td>
                  <td className="text-right p-3">₹{item.rate.toFixed(2)}</td>
                  <td className="text-right p-3 font-medium">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CGST (2.5%)</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SGST (2.5%)</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-success">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* UPI QR Code */}
        <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl mb-6">
          <h3 className="text-sm font-medium mb-3">Scan to Pay via UPI</h3>
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <QRCodeSVG
              value={upiLink}
              size={150}
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {sellerInfo.upiId}
          </p>
          <p className="text-lg font-bold text-success mt-1">₹{total.toFixed(2)}</p>
        </div>

        {/* Regional greeting */}
        <div className="text-center text-sm text-muted-foreground mb-6 p-4 bg-muted/30 rounded-lg">
          {getRegionalGreeting()}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="flex-1 gradient-saffron text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="secondary" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Share on WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceGenerator;
