import { NextResponse } from "next/server";

export type WordAnalysisData = {
  rootWord?: string;
  otherMeanings?: string[];
  exampleSentences?: string[];
};

type GeminiApiResponse = {
  candidates?: Array<{
    content: { parts: Array<{ text: string }> };
  }>;
  error?: { message: string };
};

export async function POST(request: Request) {
  const { word, language } = await request.json();

  if (!word || !language) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const genAIKey = process.env.GEN_AI_KEY;
  if (!genAIKey) {
    return NextResponse.json({ error: "AI API key is not configured" }, { status: 500 });
  }

  const prompt = `
    Analyze the ${language} word "${word}".
    Provide the response ONLY as a valid JSON object with no other text, explanations, or markdown formatting.
    The JSON object must have this exact structure:
    {
      "rootWord": "The root or infinitive form of the word. If not applicable, use the original word.",
      "otherMeanings": ["A list of 2-3 common English meanings or synonyms for the word."],
      "exampleSentences": ["An example sentence in ${language} using the original word.", "A second example sentence in ${language}."]
    }
  `;

  try {
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${genAIKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const aiData: GeminiApiResponse = await aiResponse.json();
    if (!aiResponse.ok || !aiData.candidates) {
      console.error("AI API Error:", aiData);
      throw new Error(aiData.error?.message || "AI request failed");
    }

    const text = aiData.candidates[0].content.parts[0].text;
    const analysis = JSON.parse(text.trim().replace(/^```json\n|```$/g, ""));
    
    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to get analysis from AI service." }, { status: 500 });
  }
}