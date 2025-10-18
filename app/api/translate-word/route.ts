import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type GeminiApiResponse = {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
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

  const prompt = `Provide a simple, one-to-two-word translation of the word "${word}" into ${language} as it is used in the following sentence. The user's level is ${level}. Do not explain or add any extra text, just provide the translation.
Sentence: "${context}"`;

  let translation = "";

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

    if (!aiResponse.ok) {
      throw new Error(`AI API request failed with status ${aiResponse.status}`);
    }

    const aiData: GeminiApiResponse = await aiResponse.json();
    translation = aiData.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get translation from AI." },
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
      translation,
    });

  if (insertError) {
    console.error("Failed to cache word translation:", insertError.message);
  }

  return NextResponse.json({ translation });
} 