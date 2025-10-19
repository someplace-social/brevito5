import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type GeminiApiResponse = {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    message: string;
  };
};

// The structure we expect Gemini to return
export type TranslationData = {
  primaryTranslation: string;
  otherMeanings: string[];
  exampleSentences: string[];
};

export async function POST(request: Request) {
  const { word, context, language, level, factId } = await request.json();

  if (!word || !context || !language || !level || !factId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // 1. Check for existing word translation
  const { data: existingTranslation, error: existingError } = await supabase
    .from("word_translations")
    .select("translation")
    .eq("fact_id", factId)
    .eq("language", language)
    .eq("level", level)
    .eq("word", word)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    return NextResponse.json(
      { error: existingError.message },
      { status: 500 },
    );
  }

  if (existingTranslation) {
    return NextResponse.json({ translation: existingTranslation.translation });
  }

  // 2. If not found, call AI to translate
  const genAIKey = process.env.GEN_AI_KEY;
  if (!genAIKey) {
    return NextResponse.json(
      { error: "AI API key is not configured" },
      { status: 500 },
    );
  }

  const prompt = `
    Given the word "${word}" from the sentence "${context}", provide a detailed translation into English for a ${level} level learner.
    Respond ONLY with a valid JSON object. Do not include any other text, explanations, or markdown formatting.
    The JSON object should have the following structure:
    {
      "primaryTranslation": "The single most likely translation of the word in this context.",
      "otherMeanings": ["A list of 1-2 other common meanings for the word.", "Another meaning."],
      "exampleSentences": ["An example sentence using the word in ${language}.", "A second example sentence."]
    }
  `;

  let translationData: TranslationData;

  try {
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${genAIKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const aiData: GeminiApiResponse = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("AI API Error:", aiData);
      const message = aiData?.error?.message ?? "AI API request failed";
      return NextResponse.json({ error: message }, { status: aiResponse.status });
    }

    const text = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      const finishReason = aiData?.candidates?.[0]?.finishReason;
      const errorMessage = finishReason
        ? `Content generation stopped: ${finishReason}`
        : "Invalid response structure from AI.";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // Clean the response and parse it as JSON
    const cleanedText = text.trim().replace(/^```json\n|```$/g, "");
    translationData = JSON.parse(cleanedText);

  } catch (error) {
    console.error("Error fetching or parsing translation:", error);
    return NextResponse.json(
      { error: "Failed to get a valid translation from the AI service." },
      { status: 500 },
    );
  }

  // 3. Insert the new translation into the cache
  const { error: insertError } = await supabase
    .from("word_translations")
    .insert({
      fact_id: factId,
      language,
      level,
      word,
      translation: translationData, // Insert the JSON object
    });

  if (insertError) {
    console.error("Failed to cache word translation:", insertError.message);
  }

  return NextResponse.json({ translation: translationData });
}