import { NextResponse } from "next/server";

export type MeaningAnalysis = {
  partOfSpeech: string;
  translation: string;
  exampleSentence: string;
  exampleTranslation: string;
};

export type WordAnalysisData = {
  rootWord?: string;
  analysis: MeaningAnalysis[];
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
      "rootWord": "The root or infinitive form of the word. If not applicable, use the original word.",
      "analysis": [
        {
          "partOfSpeech": "The part of speech (e.g., 'verb', 'noun', 'adjective').",
          "translation": "The ${targetLanguage} translation for this specific meaning.",
          "exampleSentence": "An example sentence in ${sourceLanguage} using the original word for this meaning.",
          "exampleTranslation": "The ${targetLanguage} translation of the example sentence."
        },
        {
          "partOfSpeech": "The part of speech for a second meaning.",
          "translation": "A second, different ${targetLanguage} translation.",
          "exampleSentence": "A second example sentence in ${sourceLanguage} demonstrating the second meaning.",
          "exampleTranslation": "The ${targetLanguage} translation of the second example sentence."
        }
      ]
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