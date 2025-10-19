import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// This is a more flexible structure for the Gemini API response
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

export async function POST(request: Request) {
  const { factId, language, level } = await request.json();

  if (!factId || !language || !level) {
    return NextResponse.json(
      { error: "Missing required parameters: factId, language, level" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // 1. Check for existing generated content
  const { data: existingContent, error: existingError } = await supabase
    .from("generated_content")
    .select("content")
    .eq("fact_id", factId)
    .eq("language", language)
    .eq("level", level)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existingContent) {
    return NextResponse.json({ content: existingContent.content });
  }

  // 2. If not found, fetch the original English text
  const { data: fact, error: factError } = await supabase
    .from("fun_facts")
    .select("english_text")
    .eq("id", factId)
    .single();

  if (factError) {
    return NextResponse.json({ error: factError.message }, { status: 500 });
  }

  if (!fact) {
    return NextResponse.json(
      { error: `Fact with id ${factId} not found` },
      { status: 404 },
    );
  }

  // 3. Call AI to translate and simplify
  const genAIKey = process.env.GEN_AI_KEY;
  if (!genAIKey) {
    return NextResponse.json(
      { error: "AI API key is not configured on the server." },
      { status: 500 },
    );
  }

  const prompt = `Translate and simplify this sentence into ${language} at a ${level} level. Keep the same meaning. Output only the translated sentence, with no extra text or quotation marks.
Sentence: "${fact.english_text}"`;

  let generatedText = "";

  try {
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${genAIKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("No content generated or invalid response structure:", aiData);
      const finishReason = aiData?.candidates?.[0]?.finishReason;
      const errorMessage = finishReason
        ? `Content generation stopped: ${finishReason}`
        : "Invalid response structure from AI.";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    generatedText = text.trim();
  } catch (error) {
    console.error("Network or parsing error when calling AI API:", error);
    return NextResponse.json(
      { error: "Failed to communicate with the AI service." },
      { status: 500 },
    );
  }

  // 4. Insert the new content into the generated_content table for caching
  const { error: insertError } = await supabase
    .from("generated_content")
    .insert({
      fact_id: factId,
      language,
      level,
      content: generatedText,
    });

  if (insertError) {
    // Log the error but don't block the response to the user
    console.error("Failed to cache generated content:", insertError.message);
  }

  // 5. Return the generated text
  return NextResponse.json({ content: generatedText });
}