
import { NextResponse } from "next/server";

export type MeaningWithExample = {
  meaning: string;
  exampleSpanish: string;
  exampleEnglish: string;
};

export type WordAnalysisData = {
  primaryTranslation: string;
  partOfSpeech: string;
  meanings: MeaningWithExample[];
};

type GeminiApiResponse = {
  candidates?: Array<{
    content: { parts: Array<{ text: string }> };
  }>;
  error?: { message: string };
};

export async function POST(request: Request) {
  const { word, sourceLanguage, targetLanguage } = await request.json();

  if (!word || !sourceLanguage || !targetLanguage) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const genAIKey = process.env.GEN_AI_KEY;
  if (!genAIKey) {
    return NextResponse.json({ error: "AI API key is not configured" }, { status: 500 });
  }

  const prompt = `
    Analyze the ${sourceLanguage} word "${word}".
    The user's native language is ${targetLanguage}.
    Provide the response ONLY as a valid JSON object with no other text, explanations, or markdown formatting.
    The JSON object must have this exact structure:
    {
      "primaryTranslation": "The most common ${targetLanguage} translation of the word.",
      "partOfSpeech": "The part of speech of the word in ${sourceLanguage} (e.g., 'verb', 'noun', 'adjective').",
      "meanings": [
        {
          "meaning": "A specific meaning of the word in ${targetLanguage}.",
          "exampleSpanish": "An example sentence in ${sourceLanguage} demonstrating this specific meaning.",
          "exampleEnglish": "The ${targetLanguage} translation of the example sentence."
        },
        {
          "meaning": "Another meaning of the word in ${targetLanguage}.",
          "exampleSpanish": "Another example sentence in ${sourceLanguage} for the second meaning.",
          "exampleEnglish": "The ${targetLanguage} translation of the second example sentence."
        }
      ]
    }
    Provide 2-3 meanings. Ensure the example sentences are practical and common.
  `;

  try {
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${genAIKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      },
    );

    const aiData: GeminiApiResponse = await aiResponse.json();
    if (!aiResponse.ok || !aiData.candidates) {
      console.error("AI API Error:", aiData);
      throw new Error(aiData.error?.message || "AI request failed");
    }

    const text = aiData.candidates[0].content.parts[0].text;
    const analysis = JSON.parse(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to get analysis from AI service." },
      { status: 500 },
    );
  }
}