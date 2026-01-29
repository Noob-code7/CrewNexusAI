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

    const systemPrompt = `You are CrewNexusAI, an expert AI sales assistant for Indian SMEs. You specialize in:
1. Detecting Indian languages (Hindi, Tamil, Bengali, English)
2. Understanding regional business contexts
3. Simulating sales approaches with win probabilities
4. Predicting cash flow based on payment terms

Analyze the following sales lead message and return a JSON object with this exact structure:
{
  "detectedLanguage": "hi" | "ta" | "bn" | "en",
  "region": "North India" | "South India" | "East India" | "West India" | "Pan India",
  "industry": "detected industry type",
  "entities": {
    "products": [
      {
        "name": "product name in original language",
        "nameEnglish": "English translation",
        "quantity": number,
        "unit": "kg" | "litre" | "pieces" | "metres" | etc,
        "unitPrice": estimated price in INR
      }
    ],
    "quantity": "human readable quantity summary",
    "timeline": "delivery timeline mentioned",
    "paymentTerms": "credit" | "advance" | "cash" | "partial",
    "totalValue": total estimated value in INR
  },
  "culturalContext": {
    "region": "north" | "south" | "east" | "west",
    "festivalSeason": null or festival name if relevant,
    "negotiationStyle": "description of regional negotiation pattern",
    "paymentPreference": "upi" | "cash" | "credit" | "cheque"
  },
  "simulations": [
    {
      "id": 1,
      "approach": "approach name",
      "description": "brief description",
      "vernacularResponse": "suggested response in the detected language",
      "winProbability": 0-100,
      "pros": ["pro1", "pro2"],
      "cons": ["con1"]
    }
  ] (provide exactly 3 different approaches),
  "cashFlow": {
    "totalAmount": total value,
    "payments": [
      {
        "amount": payment amount,
        "expectedDate": "ISO date string",
        "method": "upi" | "cash" | "cheque" | "credit",
        "probability": 0-100
      }
    ],
    "riskFactors": ["risk1", "risk2"],
    "workingCapitalImpact": negative number for outflow
  },
  "recommendedApproach": 1 | 2 | 3 (the simulation id with highest win probability)
}

Language detection rules:
- Devanagari script (अ-ह) = Hindi (hi)
- Tamil script (அ-ஹ) = Tamil (ta)
- Bengali script (অ-হ) = Bengali (bn)
- Latin script = English (en)

Regional context clues:
- "भैया", "यार" = North India, relationship-based negotiation
- Festival mentions = adjust pricing strategy
- "Credit" requests = typical in B2B, 15-30 day payment cycle

Payment timeline estimates:
- UPI: 1 day
- Cash: Same day
- Cheque: 5-7 days
- Credit: 15-30 days based on terms

Provide realistic market prices for products. Be culturally sensitive and business-savvy.
Return ONLY the JSON object, no additional text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this sales lead:\n\n"${message}"` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON from the AI response
    let analysis: LeadAnalysis;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI analysis");
    }

    // Generate a summary message
    const languageNames: Record<string, string> = {
      hi: "Hindi",
      ta: "Tamil",
      bn: "Bengali",
      en: "English",
    };

    const summary = `I detected ${languageNames[analysis.detectedLanguage] || "your"} language from ${analysis.region}. This appears to be a ${analysis.industry} order worth ₹${analysis.entities.totalValue.toLocaleString("en-IN")}.

I've analyzed 3 sales approaches for you. The recommended approach has a ${analysis.simulations.find(s => s.id === analysis.recommendedApproach)?.winProbability}% win probability.`;

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
