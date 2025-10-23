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
  const { word, sourceLanguage, targetLanguage, context } =
    await request.json();

  if (!word || !sourceLanguage || !targetLanguage) {
    return NextResponse.json(
      {
        error:
          "Missing required parameters: word, sourceLanguage, targetLanguage",
      },
      { status: 400 },
    );
  }

  const deepLKey = process.env.DEEPL_API_KEY;
  if (!deepLKey) {
    return NextResponse.json(
      { error: "Translation API key is not configured" },
      { status: 500 },
    );
  }

  const sourceLangCode = langCodeMap[sourceLanguage];
  const targetLangCode = langCodeMap[targetLanguage];

  if (!sourceLangCode || !targetLangCode) {
    return NextResponse.json(
      { error: `Unsupported source or target language` },
      { status: 400 },
    );
  }

  let primaryTranslation = "";

  try {
    const body: {
      text: string[];
      source_lang: string;
      target_lang: string;
      context?: string;
    } = {
      text: [word],
      source_lang: sourceLangCode,
      target_lang: targetLangCode,
    };

    if (context) {
      body.context = context;
    }

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${deepLKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

  return NextResponse.json({ translation: translationData });
}