import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// The simplified structure for our translation response
export type TranslationData = {
  primaryTranslation: string;
};

// The structure of the DeepL API response
type DeepLApiResponse = {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
};

export async function POST(request: Request) {
  const { word, factId, language, level } = await request.json();

  if (!word || !factId || !language || !level) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // 1. Check for existing word translation in our cache
  const { data: existingTranslation, error: existingError } = await supabase
    .from("word_translations")
    .select("translation")
    .eq("word", word)
    .eq("language", language)
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

  // 2. If not found, call the DeepL API
  const deepLKey = process.env.DEEPL_API_KEY;
  if (!deepLKey) {
    return NextResponse.json(
      { error: "Translation API key is not configured" },
      { status: 500 },
    );
  }

  let primaryTranslation = "";

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${deepLKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [word],
        target_lang: "EN", // We always want to translate to English
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepL API Error:", errorText);
      throw new Error(`DeepL API request failed with status ${response.status}`);
    }

    const data: DeepLApiResponse = await response.json();
    const translatedText = data?.translations?.[0]?.text;

    if (!translatedText) {
      throw new Error("Invalid response structure from DeepL API.");
    }
    primaryTranslation = translatedText;

  } catch (error) {
    console.error("Error fetching from DeepL:", error);
    return NextResponse.json(
      { error: "Failed to get a valid translation." },
      { status: 500 },
    );
  }
  
  const translationData: TranslationData = { primaryTranslation };

  // 3. Insert the new translation into our cache
  const { error: insertError } = await supabase
    .from("word_translations")
    .insert({
      fact_id: factId, // Retain for potential future use
      language,
      level,
      word,
      translation: translationData,
    });

  if (insertError) {
    console.error("Failed to cache word translation:", insertError.message);
  }

  return NextResponse.json({ translation: translationData });
}