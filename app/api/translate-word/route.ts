import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export type TranslationData = {
  primaryTranslation: string;
};

type DeepLApiResponse = {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
};

// Maps frontend language names to DeepL API language codes
const langCodeMap: { [key: string]: string } = {
  English: "EN",
  Spanish: "ES",
  French: "FR",
  German: "DE",
  Italian: "IT",
};

export async function POST(request: Request) {
  const { word, factId, level, sourceLanguage, targetLanguage } = await request.json();

  if (!word || !factId || !level || !sourceLanguage || !targetLanguage) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const supabase = await createClient();

  // 1. Check cache
  const { data: existingTranslation } = await supabase
    .from("word_translations")
    .select("translation")
    .eq("word", word)
    .eq("language", sourceLanguage) // We cache based on the source language word
    .single();

  if (existingTranslation) {
    return NextResponse.json({ translation: existingTranslation.translation });
  }

  // 2. Call DeepL API
  const deepLKey = process.env.DEEPL_API_KEY;
  if (!deepLKey) {
    return NextResponse.json({ error: "Translation API key is not configured" }, { status: 500 });
  }

  const targetLangCode = langCodeMap[targetLanguage];
  if (!targetLangCode) {
    return NextResponse.json({ error: `Unsupported target language: ${targetLanguage}` }, { status: 400 });
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
        target_lang: targetLangCode,
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
    return NextResponse.json({ error: "Failed to get a valid translation." }, { status: 500 });
  }
  
  const translationData: TranslationData = { primaryTranslation };

  // 3. Insert into cache
  await supabase
    .from("word_translations")
    .insert({
      fact_id: factId,
      language: sourceLanguage, // Cache is keyed by the original word's language
      level,
      word,
      translation: translationData,
    });

  return NextResponse.json({ translation: translationData });
}