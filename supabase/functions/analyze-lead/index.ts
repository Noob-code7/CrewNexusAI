import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadAnalysis {
  detectedLanguage: string;
  region: string;
  industry: string;
  entities: {
    products: Array<{
      name: string;
      nameEnglish: string;
      quantity: number;
      unit: string;
      unitPrice: number;
    }>;
    quantity: string;
    timeline: string;
    paymentTerms: string;
    totalValue: number;
  };
  culturalContext: {
    region: string;
    festivalSeason: string | null;
    negotiationStyle: string;
    paymentPreference: string;
  };
  simulations: Array<{
    id: number;
    approach: string;
    description: string;
    vernacularResponse: string;
    winProbability: number;
    pros: string[];
    cons: string[];
  }>;
  cashFlow: {
    totalAmount: number;
    payments: Array<{
      amount: number;
      expectedDate: string;
      method: string;
      probability: number;
    }>;
    riskFactors: string[];
    workingCapitalImpact: number;
  };
  recommendedApproach: number;
}

// Language detection helper
function detectLanguage(text: string): string {
  // Tamil: \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Bengali: \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  // Telugu: \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  // Gujarati: \u0A80-\u0AFF
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
  // Kannada: \u0C80-\u0CFF
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  // Malayalam: \u0D00-\u0D7F
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  // Punjabi (Gurmukhi): \u0A00-\u0A7F
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
  // Devanagari (Hindi/Marathi): \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text)) {
    // Check for Marathi-specific words
    if (/\b(आहे|आणि|किंवा|म्हणून|मी|तू|आम्ही)\b/.test(text)) return 'mr';
    return 'hi';
  }
  return 'en';
}

// Regional context scoring
function calculateRegionalScore(text: string, language: string): {
  region: string;
  regionCode: string;
  festivalSeason: string | null;
  negotiationStyle: string;
  paymentPreference: string;
} {
  let score = { north: 0, south: 0, east: 0, west: 0 };
  let festivalSeason: string | null = null;
  let negotiationStyle = '';
  let paymentPreference = 'upi';

  // Language-based region mapping
  const languageRegions: Record<string, { region: string; code: string }> = {
    hi: { region: 'North India', code: 'north' },
    pa: { region: 'North India', code: 'north' },
    mr: { region: 'West India', code: 'west' },
    gu: { region: 'West India', code: 'west' },
    ta: { region: 'South India', code: 'south' },
    te: { region: 'South India', code: 'south' },
    kn: { region: 'South India', code: 'south' },
    ml: { region: 'South India', code: 'south' },
    bn: { region: 'East India', code: 'east' },
    en: { region: 'Pan India', code: 'west' },
  };

  const baseRegion = languageRegions[language] || { region: 'Pan India', code: 'west' };

  // Regional indicators
  if (text.includes('भैया') || text.includes('यार') || text.includes('बहन')) {
    score.north += 20;
    negotiationStyle = 'Relationship-based, uses familiar terms';
  }
  if (text.includes('அண்ணா') || text.includes('அக்கா') || text.includes('தம்பி')) {
    score.south += 20;
    negotiationStyle = 'Respectful, family-oriented';
  }
  if (text.includes('ভাই') || text.includes('দিদি') || text.includes('বোন')) {
    score.east += 20;
    negotiationStyle = 'Formal respect, relationship-focused';
  }
  if (text.includes('ભાઈ') || text.includes('બહેન')) {
    score.west += 20;
    negotiationStyle = 'Business-focused, relationship-aware';
  }

  // Festival detection
  const festivals = [
    { name: 'Diwali', keywords: ['दिवाली', 'தீபாவளி', 'দীপাবলি', 'diwali', 'deepavali'] },
    { name: 'Pongal', keywords: ['பொங்கல்', 'pongal'] },
    { name: 'Eid', keywords: ['ईद', 'eid', 'ঈদ'] },
    { name: 'Holi', keywords: ['होली', 'holi', 'হোলি'] },
    { name: 'Dussehra', keywords: ['दशहरा', 'dussehra', 'দুর্গাপূজা'] },
  ];

  for (const festival of festivals) {
    if (festival.keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()))) {
      festivalSeason = festival.name;
      break;
    }
  }

  // Payment preference detection
  if (text.toLowerCase().includes('upi') || text.toLowerCase().includes('phonepe') || text.toLowerCase().includes('gpay')) {
    paymentPreference = 'upi';
  } else if (text.toLowerCase().includes('cash') || text.toLowerCase().includes('नकद') || text.toLowerCase().includes('रोकड़')) {
    paymentPreference = 'cash';
  } else if (text.toLowerCase().includes('credit') || text.toLowerCase().includes('क्रेडिट') || text.toLowerCase().includes('उधार')) {
    paymentPreference = 'credit';
  } else if (text.toLowerCase().includes('cheque') || text.toLowerCase().includes('चेक')) {
    paymentPreference = 'cheque';
  }

  // Determine final region based on scores
  const maxScore = Math.max(score.north, score.south, score.east, score.west);
  let finalRegion = baseRegion;
  if (maxScore > 0) {
    if (score.north === maxScore) finalRegion = { region: 'North India', code: 'north' };
    else if (score.south === maxScore) finalRegion = { region: 'South India', code: 'south' };
    else if (score.east === maxScore) finalRegion = { region: 'East India', code: 'east' };
    else if (score.west === maxScore) finalRegion = { region: 'West India', code: 'west' };
  }

  if (!negotiationStyle) {
    negotiationStyle = baseRegion.code === 'north' ? 'Relationship-based, informal' :
                      baseRegion.code === 'south' ? 'Respectful, value-focused' :
                      baseRegion.code === 'east' ? 'Formal, relationship-oriented' :
                      'Business-focused, pragmatic';
  }

  return {
    region: finalRegion.region,
    regionCode: finalRegion.code,
    festivalSeason,
    negotiationStyle,
    paymentPreference,
  };
}

// Calculate cash flow with regional patterns
function calculateCashFlow(
  totalValue: number,
  paymentTerms: string,
  regionCode: string,
  festivalSeason: string | null,
  paymentPreference: string
): {
  payments: Array<{ amount: number; expectedDate: string; method: string; probability: number }>;
  riskFactors: string[];
  workingCapitalImpact: number;
} {
  const now = new Date();
  const payments: Array<{ amount: number; expectedDate: string; method: string; probability: number }> = [];
  const riskFactors: string[] = [];
  let workingCapitalImpact = -totalValue;

  // Regional payment patterns
  const regionalPatterns: Record<string, { upi: number; cash: number; cheque: number; credit: number }> = {
    north: { upi: 1, cash: 0, cheque: 5, credit: 15 },
    south: { upi: 1, cash: 0, cheque: 7, credit: 30 },
    east: { upi: 1, cash: 0, cheque: 6, credit: 20 },
    west: { upi: 1, cash: 0, cheque: 5, credit: 18 },
  };

  const patterns = regionalPatterns[regionCode] || regionalPatterns.north;

  // Festival season adjustments
  let festivalMultiplier = 1;
  if (festivalSeason) {
    festivalMultiplier = 0.7; // Payments faster during festivals
    riskFactors.push(`Festival season (${festivalSeason}) - faster payments expected`);
  }

  // Payment method determination
  if (paymentTerms.toLowerCase().includes('advance') || paymentTerms.toLowerCase().includes('advance')) {
    const advanceAmount = totalValue * 0.3;
    const advanceDate = new Date(now.getTime() + 0 * 24 * 60 * 60 * 1000);
    payments.push({
      amount: advanceAmount,
      expectedDate: advanceDate.toISOString(),
      method: paymentPreference === 'upi' ? 'upi' : 'cash',
      probability: 80,
    });
    workingCapitalImpact += advanceAmount;

    const balanceAmount = totalValue - advanceAmount;
    const balanceDate = new Date(now.getTime() + patterns.credit * 24 * 60 * 60 * 1000 * festivalMultiplier);
    payments.push({
      amount: balanceAmount,
      expectedDate: balanceDate.toISOString(),
      method: 'credit',
      probability: 70,
    });
  } else if (paymentTerms.toLowerCase().includes('credit') || paymentTerms.toLowerCase().includes('क्रेडिट')) {
    const creditDays = patterns.credit * festivalMultiplier;
    const creditDate = new Date(now.getTime() + creditDays * 24 * 60 * 60 * 1000);
    payments.push({
      amount: totalValue,
      expectedDate: creditDate.toISOString(),
      method: 'credit',
      probability: 75,
    });
    riskFactors.push('Credit customer - payment delay risk');
  } else if (paymentTerms.toLowerCase().includes('cash') || paymentPreference === 'cash') {
    payments.push({
      amount: totalValue,
      expectedDate: new Date(now.getTime() + patterns.cash * 24 * 60 * 60 * 1000).toISOString(),
      method: 'cash',
      probability: 90,
    });
    workingCapitalImpact += totalValue;
  } else {
    // Default to UPI
    payments.push({
      amount: totalValue,
      expectedDate: new Date(now.getTime() + patterns.upi * 24 * 60 * 60 * 1000 * festivalMultiplier).toISOString(),
      method: 'upi',
      probability: 85,
    });
    workingCapitalImpact += totalValue * 0.9; // 90% confidence
  }

  if (paymentTerms.toLowerCase().includes('credit')) {
    riskFactors.push('No advance payment');
  }

  return { payments, riskFactors, workingCapitalImpact };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Step 1: Detect language and extract entities
    const detectedLanguage = detectLanguage(message);
    const regionalContext = calculateRegionalScore(message, detectedLanguage);

    const languageNames: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      ta: "Tamil",
      bn: "Bengali",
      te: "Telugu",
      gu: "Gujarati",
      mr: "Marathi",
      kn: "Kannada",
      ml: "Malayalam",
      pa: "Punjabi",
    };

    const entityExtractionPrompt = `You are CrewNexusAI, an expert at extracting business information from Indian regional languages.

Extract entities from this ${languageNames[detectedLanguage]} sales lead message and return ONLY a JSON object:
{
  "products": [
    {
      "name": "product name in original language",
      "nameEnglish": "English translation",
      "quantity": number,
      "unit": "kg" | "litre" | "pieces" | "metres" | "units",
      "unitPrice": estimated market price in INR
    }
  ],
  "quantity": "human readable summary",
  "timeline": "delivery timeline mentioned",
  "paymentTerms": "credit" | "advance" | "cash" | "partial" | "upi",
  "totalValue": total estimated value in INR,
  "industry": "Kirana/Grocery" | "Textiles" | "Manufacturing" | "Services" | "FMCG" | "Electronics"
}

Message: "${message}"

Return ONLY the JSON object, no additional text.`;

    const entityResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "user", content: entityExtractionPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!entityResponse.ok) {
      throw new Error(`Entity extraction failed: ${entityResponse.status}`);
    }

    const entityData = await entityResponse.json();
    const entityContent = entityData.choices?.[0]?.message?.content;
    const entities = JSON.parse(entityContent.match(/\{[\s\S]*\}/)?.[0] || '{}');

    // Step 2: Run 3 parallel sales simulations
    const simulationPrompts = [
      {
        id: 1,
        name: "Discount for Cash",
        prompt: `As a ${entities.industry} business owner in ${regionalContext.region}, you receive this lead in ${languageNames[detectedLanguage]}:
"${message}"

The customer wants: ${entities.quantity} with ${entities.paymentTerms} payment terms.

Your approach: Offer 5% discount for immediate UPI payment. This approach prioritizes immediate cash flow.

Generate a response in ${languageNames[detectedLanguage]} that:
1. Acknowledges the customer respectfully
2. Offers 5% discount for immediate payment
3. Emphasizes benefits (fast delivery, good price)
4. Is culturally appropriate for ${regionalContext.region}

Return JSON:
{
  "vernacularResponse": "your response in ${languageNames[detectedLanguage]}",
  "winProbability": 60-70,
  "pros": ["immediate cash flow", "no credit risk"],
  "cons": ["lower margin", "may lose deal if customer insists on credit"]
}`,
      },
      {
        id: 2,
        name: "Flexible Credit Terms",
        prompt: `As a ${entities.industry} business owner in ${regionalContext.region}, you receive this lead in ${languageNames[detectedLanguage]}:
"${message}"

The customer wants: ${entities.quantity} with ${entities.paymentTerms} payment terms.

Your approach: Offer flexible credit terms (14-21 days) with a small discount (2-3%). This builds relationships and has high win probability.

Generate a response in ${languageNames[detectedLanguage]} that:
1. Shows understanding of customer needs
2. Offers credit with small discount
3. Emphasizes relationship and trust
4. Is culturally appropriate for ${regionalContext.region} (${regionalContext.negotiationStyle})

Return JSON:
{
  "vernacularResponse": "your response in ${languageNames[detectedLanguage]}",
  "winProbability": 75-85,
  "pros": ["high win rate", "builds relationship", "reasonable margin"],
  "cons": ["wait for payment", "credit risk"]
}`,
      },
      {
        id: 3,
        name: "Value-First Approach",
        prompt: `As a ${entities.industry} business owner in ${regionalContext.region}, you receive this lead in ${languageNames[detectedLanguage]}:
"${message}"

The customer wants: ${entities.quantity} with ${entities.paymentTerms} payment terms.

Your approach: Emphasize quality, reliability, and service. Offer full price but highlight value (free delivery, warranty, etc.). This maintains margins.

Generate a response in ${languageNames[detectedLanguage]} that:
1. Highlights product/service quality
2. Offers value-added services
3. Justifies full price
4. Is culturally appropriate for ${regionalContext.region}

Return JSON:
{
  "vernacularResponse": "your response in ${languageNames[detectedLanguage]}",
  "winProbability": 45-60,
  "pros": ["full margin", "positions as premium"],
  "cons": ["lower win probability", "may need negotiation"]
}`,
      },
    ];

    // Run all 3 simulations in parallel
    const simulationResults = await Promise.all(
      simulationPrompts.map(async (sim) => {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "user", content: sim.prompt }],
            temperature: 0.5,
          }),
        });

        if (!response.ok) {
          throw new Error(`Simulation ${sim.id} failed`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        const result = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || '{}');

        return {
          id: sim.id,
          approach: sim.name,
          description: sim.name === "Discount for Cash" ? "Offer 5% discount for immediate UPI payment" :
                      sim.name === "Flexible Credit Terms" ? "Offer 14-21 day credit with 2-3% discount" :
                      "Emphasize quality and value, maintain full price",
          vernacularResponse: result.vernacularResponse || `Response in ${languageNames[detectedLanguage]}`,
          winProbability: result.winProbability || 50,
          pros: result.pros || [],
          cons: result.cons || [],
        };
      })
    );

    // Select best approach
    const recommendedApproach = simulationResults.reduce((best, current) =>
      current.winProbability > best.winProbability ? current : best
    ).id;

    // Step 3: Calculate cash flow
    const cashFlow = calculateCashFlow(
      entities.totalValue,
      entities.paymentTerms,
      regionalContext.regionCode,
      regionalContext.festivalSeason,
      regionalContext.paymentPreference
    );

    // Construct final analysis
    const analysis: LeadAnalysis = {
      detectedLanguage,
      region: regionalContext.region,
      industry: entities.industry || "Retail/Kirana",
      entities: {
        products: entities.products || [],
        quantity: entities.quantity || "",
        timeline: entities.timeline || "",
        paymentTerms: entities.paymentTerms || "credit",
        totalValue: entities.totalValue || 0,
      },
      culturalContext: {
        region: regionalContext.regionCode,
        festivalSeason: regionalContext.festivalSeason,
        negotiationStyle: regionalContext.negotiationStyle,
        paymentPreference: regionalContext.paymentPreference,
      },
      simulations: simulationResults,
      cashFlow: {
        totalAmount: entities.totalValue || 0,
        payments: cashFlow.payments,
        riskFactors: cashFlow.riskFactors,
        workingCapitalImpact: cashFlow.workingCapitalImpact,
      },
      recommendedApproach,
    };

    const summary = `I detected ${languageNames[detectedLanguage]} from ${regionalContext.region}. This appears to be a ${analysis.industry} order worth ₹${analysis.entities.totalValue.toLocaleString("en-IN")}.

I've analyzed 3 sales approaches in parallel. The recommended approach has a ${analysis.simulations.find(s => s.id === analysis.recommendedApproach)?.winProbability}% win probability.`;

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        analysis,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-lead error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
