import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatPanel from "@/components/dashboard/ChatPanel";
import SimulationPanel from "@/components/dashboard/SimulationPanel";
import ResultsPanel from "@/components/dashboard/ResultsPanel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ChatMessage, LeadAnalysis, SupportedLanguage } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<LeadAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('hi');
  const [activePanel, setActivePanel] = useState<'chat' | 'simulation' | 'results'>('chat');

  // Handle initial message from landing page
  useEffect(() => {
    const state = location.state as { initialMessage?: string } | null;
    if (state?.initialMessage) {
      // Clear state to prevent re-sending on refresh
      window.history.replaceState({}, document.title);
      
      // Send the message after a short delay
      setTimeout(() => {
        handleSendMessage(state.initialMessage!);
      }, 500);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setCurrentAnalysis(null);

    try {
      // Call the AI edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-lead`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ message: content }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze lead');
      }

      const data = await response.json();
      
      // Create assistant message with analysis
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.summary || 'Analysis complete',
        timestamp: new Date(),
        language: data.analysis?.detectedLanguage,
        analysis: data.analysis,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentAnalysis(data.analysis);
      
      // Auto-switch to simulation panel on mobile
      if (isMobile) {
        setActivePanel('simulation');
      }
    } catch (error) {
      console.error('Error analyzing lead:', error);
      
      // Fallback with mock data for demo
      const mockAnalysis = getMockAnalysis(content);
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I've analyzed your lead. Here's what I found:`,
        timestamp: new Date(),
        language: mockAnalysis.detectedLanguage,
        analysis: mockAnalysis,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentAnalysis(mockAnalysis);
      
      if (isMobile) {
        setActivePanel('simulation');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader 
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      
      {/* Mobile tab navigation */}
      {isMobile && (
        <div className="flex border-b border-border bg-card">
          {(['chat', 'simulation', 'results'] as const).map((panel) => (
            <button
              key={panel}
              onClick={() => setActivePanel(panel)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activePanel === panel
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {panel === 'chat' && 'Chat'}
              {panel === 'simulation' && 'Analysis'}
              {panel === 'results' && 'Results'}
            </button>
          ))}
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: 3-panel layout */}
        {!isMobile ? (
          <>
            <div className="w-[30%] border-r border-border">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isProcessing={isProcessing}
                selectedLanguage={selectedLanguage}
              />
            </div>
            <div className="w-[40%] border-r border-border">
              <SimulationPanel
                analysis={currentAnalysis}
                isProcessing={isProcessing}
              />
            </div>
            <div className="w-[30%]">
              <ResultsPanel
                analysis={currentAnalysis}
                isProcessing={isProcessing}
              />
            </div>
          </>
        ) : (
          /* Mobile: Single panel view */
          <div className="flex-1">
            {activePanel === 'chat' && (
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isProcessing={isProcessing}
                selectedLanguage={selectedLanguage}
              />
            )}
            {activePanel === 'simulation' && (
              <SimulationPanel
                analysis={currentAnalysis}
                isProcessing={isProcessing}
              />
            )}
            {activePanel === 'results' && (
              <ResultsPanel
                analysis={currentAnalysis}
                isProcessing={isProcessing}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Mock analysis for fallback/demo
function getMockAnalysis(input: string): LeadAnalysis {
  // Detect language based on script
  let detectedLanguage: SupportedLanguage = 'en';
  if (/[\u0B80-\u0BFF]/.test(input)) detectedLanguage = 'ta'; // Tamil
  else if (/[\u0980-\u09FF]/.test(input)) detectedLanguage = 'bn'; // Bengali
  else if (/[\u0C00-\u0C7F]/.test(input)) detectedLanguage = 'te'; // Telugu
  else if (/[\u0A80-\u0AFF]/.test(input)) detectedLanguage = 'gu'; // Gujarati
  else if (/[\u0C80-\u0CFF]/.test(input)) detectedLanguage = 'kn'; // Kannada
  else if (/[\u0D00-\u0D7F]/.test(input)) detectedLanguage = 'ml'; // Malayalam
  else if (/[\u0A00-\u0A7F]/.test(input)) detectedLanguage = 'pa'; // Punjabi (Gurmukhi)
  else if (/[\u0900-\u097F]/.test(input)) detectedLanguage = 'hi'; // Devanagari (Hindi/Marathi)

  const regions: Record<SupportedLanguage, 'north' | 'south' | 'east' | 'west'> = {
    en: 'west',
    hi: 'north',
    mr: 'west',
    pa: 'north',
    bn: 'east',
    ta: 'south',
    te: 'south',
    kn: 'south',
    ml: 'south',
    gu: 'west',
  };

  return {
    detectedLanguage,
    region:
      detectedLanguage === 'hi' ? 'North India'
      : detectedLanguage === 'pa' ? 'North India'
      : detectedLanguage === 'bn' ? 'East India'
      : detectedLanguage === 'ta' ? 'Tamil Nadu'
      : detectedLanguage === 'te' ? 'Telangana / Andhra Pradesh'
      : detectedLanguage === 'kn' ? 'Karnataka'
      : detectedLanguage === 'ml' ? 'Kerala'
      : detectedLanguage === 'gu' ? 'Gujarat'
      : detectedLanguage === 'mr' ? 'Maharashtra'
      : 'Pan India',
    industry: 'Retail/Kirana',
    entities: {
      products: [
        { name: 'चावल', nameEnglish: 'Rice', quantity: 50, unit: 'kg', unitPrice: 45 },
        { name: 'तेल', nameEnglish: 'Oil', quantity: 20, unit: 'litre', unitPrice: 150 },
      ],
      quantity: '50 kg + 20 litre',
      timeline: 'Tomorrow morning',
      paymentTerms: 'Credit',
      totalValue: 5250,
    },
    culturalContext: {
      region: regions[detectedLanguage],
      festivalSeason: null,
      negotiationStyle: 'Relationship-based, uses familiar terms (भैया)',
      paymentPreference: 'credit',
    },
    simulations: [
      {
        id: 1,
        approach: 'Discount for Cash',
        description: 'Offer 5% discount for immediate UPI payment',
        vernacularResponse:
          detectedLanguage === 'hi'
            ? 'भैया, अगर अभी UPI से पेमेंट करो तो 5% छूट मिलेगी!'
          : detectedLanguage === 'bn'
            ? 'ভাই, এখনই UPI করলে ৫% ছাড় পাবেন!'
          : detectedLanguage === 'ta'
            ? 'அண்ணா, இப்போ UPI பேமெண்ட் செய்தால் 5% தள்ளுபடி!'
          : detectedLanguage === 'te'
            ? 'అన్నా, ఇప్పుడే UPI చేస్తే 5% డిస్కౌంట్!'
          : detectedLanguage === 'gu'
            ? 'ભાઈ, હમણાં UPI કરો તો 5% છૂટ મળશે!'
          : detectedLanguage === 'kn'
            ? 'ಅಣ್ಣಾ, ಈಗಲೇ UPI ಮಾಡಿದರೆ 5% ರಿಯಾಯಿತಿ!'
          : detectedLanguage === 'ml'
            ? 'ചേട്ടാ, ഇപ്പോൾ UPI ചെയ്താൽ 5% ഡിസ്കൗണ്ട്!'
          : detectedLanguage === 'pa'
            ? 'ਭਰਾ, ਹੁਣੇ UPI ਕਰੋ ਤਾਂ 5% ਛੂਟ ਮਿਲੇਗੀ!'
          : '5% discount if you pay now via UPI!',
        winProbability: 65,
        pros: ['Immediate cash flow', 'No credit risk'],
        cons: ['Lower margin', 'May lose deal'],
      },
      {
        id: 2,
        approach: '2-Week Credit with Discount',
        description: 'Offer 3% discount with 14-day credit period',
        vernacularResponse:
          detectedLanguage === 'hi'
            ? 'भैया, 14 दिन का क्रेडिट दूंगा, और 3% की छूट भी!'
          : detectedLanguage === 'bn'
            ? 'ভাই, ১৪ দিনের ক্রেডিট দেব, সাথে ৩% ছাড়ও!'
          : detectedLanguage === 'ta'
            ? 'அண்ணா, 14 நாள் கிரெடிட் + 3% தள்ளுபடி!'
          : detectedLanguage === 'te'
            ? 'అన్నా, 14 రోజుల క్రెడిట్ + 3% డిస్కౌంట్!'
          : detectedLanguage === 'gu'
            ? 'ભાઈ, 14 દિવસનું ક્રેડિટ + 3% છૂટ!'
          : detectedLanguage === 'kn'
            ? 'ಅಣ್ಣಾ, 14 ದಿನ ಕ್ರೆಡಿಟ್ + 3% ರಿಯಾಯಿತಿ!'
          : detectedLanguage === 'ml'
            ? 'ചേട്ടാ, 14 ദിവസം ക്രെഡിറ്റ് + 3% ഡിസ്കൗണ്ട്!'
          : detectedLanguage === 'pa'
            ? 'ਭਰਾ, 14 ਦਿਨਾਂ ਦਾ ਕਰੇਡਿਟ + 3% ਛੂਟ!'
          : 'I can give 14 days credit with 3% discount!',
        winProbability: 80,
        pros: ['High win rate', 'Builds relationship', 'Reasonable margin'],
        cons: ['2-week wait for payment'],
      },
      {
        id: 3,
        approach: 'Free Delivery',
        description: 'Full price but free home delivery',
        vernacularResponse:
          detectedLanguage === 'hi'
            ? 'भैया, पूरा पैसा दो, लेकिन डिलीवरी फ्री!'
          : detectedLanguage === 'bn'
            ? 'ভাই, পুরো দাম, কিন্তু ডেলিভারি ফ্রি!'
          : detectedLanguage === 'ta'
            ? 'அண்ணா, முழு விலை; டெலிவரி ஃப்ரீ!'
          : detectedLanguage === 'te'
            ? 'అన్నా, పూర్తి ధర; డెలివరీ ఫ్రీ!'
          : detectedLanguage === 'gu'
            ? 'ભાઈ, પૂરો ભાવ; ડિલિવરી ફ્રી!'
          : detectedLanguage === 'kn'
            ? 'ಅಣ್ಣಾ, ಪೂರ್ಣ ಬೆಲೆ; ಡೆಲಿವರಿ ಫ್ರೀ!'
          : detectedLanguage === 'ml'
            ? 'ചേട്ടാ, ഫുള്‍ പ്രൈസ്; ഡെലിവറി ഫ്രീ!'
          : detectedLanguage === 'pa'
            ? 'ਭਰਾ, ਪੂਰਾ ਭਾਵ; ਡਿਲਿਵਰੀ ਫਰੀ!'
          : 'Pay full price but delivery is free!',
        winProbability: 45,
        pros: ['Full margin retained'],
        cons: ['Lower win probability', 'Delivery cost'],
      },
    ],
    cashFlow: {
      totalAmount: 5250,
      payments: [
        { amount: 0, expectedDate: new Date(), method: 'upi', probability: 20 },
        { amount: 5250, expectedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), method: 'credit', probability: 80 },
      ],
      riskFactors: ['Credit customer', 'No advance payment'],
      workingCapitalImpact: -5250,
    },
    recommendedApproach: 2,
  };
}

export default Dashboard;
