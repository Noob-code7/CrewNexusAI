import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadAnalysis, InvoiceData, InvoiceItem } from "@/types";
import { Download, MessageCircle, Printer, Edit2, Copy } from "lucide-react";
import { toast } from "sonner";

interface InvoiceGeneratorProps {
  analysis: LeadAnalysis;
}

// HSN Code mapping for common products
const HSN_CODE_MAP: Record<string, string> = {
  // Grains & Cereals
  'rice': '1006',
  'चावल': '1006',
  'बासमती': '1006',
  'बिय्यं': '1006',
  'அரிசி': '1006',
  'ভাত': '1006',
  
  // Oils
  'oil': '1509',
  'तेल': '1509',
  'எண்ணெய்': '1509',
  'তেল': '1509',
  'mustard oil': '1509',
  'sunflower oil': '1509',
  'groundnut oil': '1509',
  
  // Textiles
  'silk': '5007',
  'சில்க்': '5007',
  'saree': '5007',
  'cloth': '5007',
  'fabric': '5007',
  'துணி': '5007',
  
  // Electronics
  'tv': '8528',
  'television': '8528',
  'led': '8528',
  'mobile': '8517',
  'phone': '8517',
  
  // Default
  'default': '9983', // Other services
};

// Get HSN code for a product
function getHSNCode(productName: string): string {
  const lowerName = productName.toLowerCase();
  for (const [key, code] of Object.entries(HSN_CODE_MAP)) {
    if (lowerName.includes(key)) {
      return code;
    }
  }
  return HSN_CODE_MAP.default;
}

// Regional greetings for all 10 languages
function getRegionalGreeting(language: string): string {
  const greetings: Record<string, string> = {
    hi: 'धन्यवाद! आपके व्यापार के लिए शुक्रिया।',
    ta: 'நன்றி! உங்கள் வணிகத்திற்கு நன்றி।',
    bn: 'ধন্যবাদ! আপনার ব্যবসার জন্য ধন্যবাদ।',
    te: 'ధన్యవాదాలు! మీ వ్యాపారానికి కృతజ్ఞతలు।',
    gu: 'આભાર! તમારા વ્યવસાય માટે આભાર।',
    mr: 'धन्यवाद! तुमच्या व्यवसायासाठी आभार।',
    kn: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವ್ಯಾಪಾರಕ್ಕೆ ಕೃತಜ್ಞತೆಗಳು।',
    ml: 'നന്ദി! നിങ്ങളുടെ ബിസിനസ്സിന് നന്ദി।',
    pa: 'ਧੰਨਵਾਦ! ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਲਈ ਧੰਨਵਾਦ।',
    en: 'Thank you for your business!',
  };
  return greetings[language] || greetings.en;
}

const InvoiceGenerator = ({ analysis }: InvoiceGeneratorProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
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
      hsnCode: getHSNCode(product.nameEnglish || product.name),
      quantity: product.quantity,
      unit: product.unit,
      rate: product.unitPrice,
      amount: product.quantity * product.unitPrice,
      gstRate: 5, // Default GST rate (can be made dynamic)
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

  // Generate WhatsApp message
  const generateWhatsAppMessage = (): string => {
    const itemsList = invoiceItems.map(item => 
      `${item.descriptionRegional || item.description}: ${item.quantity} ${item.unit} × ₹${item.rate}`
    ).join('\n');
    
    const message = `*Invoice ${invoiceNumber}*\n\n` +
      `Dear ${buyerInfo.name},\n\n` +
      `Please find your invoice details:\n\n` +
      `${itemsList}\n\n` +
      `*Total: ₹${total.toFixed(2)}*\n` +
      `Due Date: ${dueDate.toLocaleDateString('en-IN')}\n\n` +
      `Scan the QR code or use UPI ID: ${sellerInfo.upiId}\n\n` +
      `${getRegionalGreeting(analysis.detectedLanguage)}`;
    
    return encodeURIComponent(message);
  };

  // Handle PDF download using browser print
  const handleDownloadPDF = () => {
    if (!invoiceRef.current) return;
    
    // Create a new window with the invoice content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { font-family: Arial, sans-serif; }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #000; }
            .seller-info h2 { margin: 0 0 10px 0; color: #FF9933; }
            .invoice-title { font-size: 24px; font-weight: bold; text-align: right; }
            .invoice-meta { text-align: right; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #000; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .totals { text-align: right; margin-top: 20px; }
            .total-row { font-weight: bold; font-size: 18px; padding-top: 10px; border-top: 2px solid #000; }
            .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: #f9f9f9; }
            .greeting { text-align: center; margin: 20px 0; padding: 15px; background: #f0f0f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="seller-info">
              <h2>${sellerInfo.name}</h2>
              <p>${sellerInfo.address}</p>
              <p>GSTIN: ${sellerInfo.gstin}</p>
              <p>Phone: ${sellerInfo.phone}</p>
            </div>
            <div>
              <div class="invoice-title">TAX INVOICE</div>
              <div class="invoice-meta">
                <div>Invoice #: <strong>${invoiceNumber}</strong></div>
                <div>Date: ${invoiceDate.toLocaleDateString('en-IN')}</div>
                <div>Due: ${dueDate.toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3>Bill To:</h3>
            <p><strong>${buyerInfo.name}</strong></p>
            <p>${buyerInfo.address}</p>
            ${buyerInfo.gstin ? `<p>GSTIN: ${buyerInfo.gstin}</p>` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>HSN</th>
                <th>Qty</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceItems.map(item => `
                <tr>
                  <td>
                    ${item.description}
                    ${item.descriptionRegional ? `<br><small>${item.descriptionRegional}</small>` : ''}
                  </td>
                  <td>${item.hsnCode}</td>
                  <td>${item.quantity} ${item.unit}</td>
                  <td style="text-align: right;">₹${item.rate.toFixed(2)}</td>
                  <td style="text-align: right;">₹${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div>Subtotal: ₹${subtotal.toFixed(2)}</div>
            <div>CGST (2.5%): ₹${cgst.toFixed(2)}</div>
            <div>SGST (2.5%): ₹${sgst.toFixed(2)}</div>
            <div class="total-row">Total: ₹${total.toFixed(2)}</div>
          </div>
          
          <div class="qr-section">
            <h3>Scan to Pay via UPI</h3>
            <p>UPI ID: ${sellerInfo.upiId}</p>
            <p style="font-size: 20px; font-weight: bold; color: #138808;">₹${total.toFixed(2)}</p>
            <p><small>Note: QR code not included in PDF. Use UPI ID to pay.</small></p>
          </div>
          
          <div class="greeting">
            ${getRegionalGreeting(analysis.detectedLanguage)}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.print();
      toast.success('PDF download started');
    }, 250);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  // Handle WhatsApp share
  const handleWhatsAppShare = () => {
    const phoneNumber = buyerInfo.phone.replace(/\D/g, ''); // Remove non-digits
    const message = generateWhatsAppMessage();
    
    if (phoneNumber && phoneNumber.length === 10) {
      // If phone number is available, send directly
      window.open(`https://wa.me/91${phoneNumber}?text=${message}`, '_blank');
    } else {
      // Otherwise, open WhatsApp Web with pre-filled message
      window.open(`https://web.whatsapp.com/send?text=${message}`, '_blank');
    }
    toast.success('Opening WhatsApp...');
  };

  // Copy UPI ID to clipboard
  const handleCopyUPI = () => {
    navigator.clipboard.writeText(sellerInfo.upiId);
    toast.success('UPI ID copied to clipboard');
  };

  return (
    <div ref={invoiceRef}>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">GST Invoice</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePrint}>
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
                  value={buyerInfo.phone}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                  placeholder="Phone Number (for WhatsApp)"
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
                {buyerInfo.phone && (
                  <p className="text-sm text-muted-foreground">Phone: {buyerInfo.phone}</p>
                )}
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
            <div className="flex items-center gap-2 mt-3">
              <p className="text-xs text-muted-foreground text-center">
                {sellerInfo.upiId}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopyUPI}
                title="Copy UPI ID"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-lg font-bold text-success mt-1">₹{total.toFixed(2)}</p>
          </div>

          {/* Regional greeting */}
          <div className="text-center text-sm text-muted-foreground mb-6 p-4 bg-muted/30 rounded-lg">
            {getRegionalGreeting(analysis.detectedLanguage)}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="flex-1 gradient-saffron text-primary-foreground"
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={handleWhatsAppShare}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Share on WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGenerator;
