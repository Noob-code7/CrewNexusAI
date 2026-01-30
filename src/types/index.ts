// Language types
export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'ta'
  | 'bn'
  | 'te'
  | 'gu'
  | 'mr'
  | 'kn'
  | 'ml'
  | 'pa';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script:
    | 'latin'
    | 'devanagari'
    | 'bengali'
    | 'tamil'
    | 'telugu'
    | 'gujarati'
    | 'kannada'
    | 'malayalam'
    | 'gurmukhi';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'tamil' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'bengali' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'telugu' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'gujarati' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'devanagari' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'malayalam' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'gurmukhi' },
];

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: SupportedLanguage;
  analysis?: LeadAnalysis;
}

// Lead Analysis types
export interface LeadAnalysis {
  detectedLanguage: SupportedLanguage;
  region: string;
  industry: string;
  entities: ExtractedEntities;
  culturalContext: CulturalContext;
  simulations: SalesSimulation[];
  cashFlow: CashFlowPrediction;
  recommendedApproach: number;
}

export interface ExtractedEntities {
  products: ProductEntity[];
  quantity: string;
  timeline: string;
  paymentTerms: string;
  totalValue: number;
}

export interface ProductEntity {
  name: string;
  nameEnglish: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface CulturalContext {
  region: 'north' | 'south' | 'east' | 'west';
  festivalSeason: string | null;
  negotiationStyle: string;
  paymentPreference: 'upi' | 'cash' | 'credit' | 'cheque';
}

// Sales Simulation types
export interface SalesSimulation {
  id: number;
  approach: string;
  description: string;
  vernacularResponse: string;
  winProbability: number;
  pros: string[];
  cons: string[];
}

// Cash Flow types
export interface CashFlowPrediction {
  totalAmount: number;
  payments: PaymentPrediction[];
  riskFactors: string[];
  workingCapitalImpact: number;
}

export interface PaymentPrediction {
  amount: number;
  expectedDate: Date;
  method: 'upi' | 'cash' | 'cheque' | 'credit';
  probability: number;
}

// Invoice types
export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  seller: BusinessInfo;
  buyer: BusinessInfo;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  paymentTerms: string;
  notes: string;
  language: SupportedLanguage;
  upiId?: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  gstin?: string;
  phone?: string;
  email?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  descriptionRegional?: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  gstRate: number;
}

// Demo scenarios
export interface DemoScenario {
  id: string;
  title: string;
  titleRegional: string;
  language: SupportedLanguage;
  input: string;
  industry: string;
  description: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'hindi-kirana',
    title: 'Hindi Kirana Store',
    titleRegional: 'हिंदी किराना दुकान',
    language: 'hi',
    input: 'भैया, 50 किलो चावल और 20 लीटर तेल कल सुबह तक चाहिए, क्रेडिट पर देना',
    industry: 'Kirana/Grocery',
    description: 'A typical kirana store order with credit request',
  },
  {
    id: 'tamil-textile',
    title: 'Tamil Textile Merchant',
    titleRegional: 'தமிழ் ஜவுளி வியாபாரி',
    language: 'ta',
    input: '100 மீட்டர் சில்க் துணி தீபாவளிக்கு, முன்பணம் 30%',
    industry: 'Textiles',
    description: 'Festival season silk order with advance payment',
  },
  {
    id: 'bengali-oil',
    title: 'Bengali Oil Distributor',
    titleRegional: 'বাংলা তেল বিতরণকারী',
    language: 'bn',
    input: 'আমাকে ২০০ লিটার সরষের তেল দরকার, এক মাসের ক্রেডিট চাই',
    industry: 'FMCG/Oil',
    description: 'Bulk mustard oil order with credit terms',
  },
  {
    id: 'english-electronics',
    title: 'Electronics Wholesaler',
    titleRegional: 'Electronics Wholesaler',
    language: 'en',
    input: 'I need 50 units of LED TVs 32 inch, delivery by this weekend, 50% advance',
    industry: 'Electronics',
    description: 'B2B electronics order with partial advance',
  },
];
